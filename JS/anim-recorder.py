# ClassLedger animation recorder (runs in the browser with Pyodide, admin page only).
# It runs the Python function of a lesson on an array, watches every line, and turns what happened into the
# steps the animation player understands: { a, cmp, swap, mark, done, held, hole, target, tags, out, eq, sign, line, msg, c, s }
import ast, re, sys, json

MAX_EVENTS = 4000
MAX_STEPS = 600


class TooLong(Exception):
    pass


def _line_info(src_line, tname):
    """What a source line contains: its Compare node (if any) and the subscripts of the array."""
    s = src_line.strip()
    s = re.sub(r"\s*#.*$", "", s)
    if not s:
        return None
    probe = s
    if probe.endswith(":"):
        probe += "\n    pass"
    probe = re.sub(r"^(elif)\b", "if", probe)
    probe = re.sub(r"^else\s*:", "pass", probe)
    try:
        tree = ast.parse(probe)
    except SyntaxError:
        return None
    node = tree.body[0] if tree.body else None
    if node is None:
        return None
    info = {"kind": type(node).__name__, "cmp": None, "subs": [], "src": s}
    head = node
    if isinstance(node, (ast.If, ast.While)):
        head = node.test
    elif isinstance(node, (ast.For,)):
        head = node.iter
    for sub in ast.walk(head if not isinstance(node, ast.For) else node.iter):
        if isinstance(sub, ast.Subscript) and isinstance(sub.value, ast.Name) and sub.value.id == tname:
            info["subs"].append(sub.slice)
    if isinstance(node, (ast.Assign, ast.AugAssign, ast.Expr, ast.Return)):
        for sub in ast.walk(node):
            if isinstance(sub, ast.Subscript) and isinstance(sub.value, ast.Name) and sub.value.id == tname:
                info["subs"].append(sub.slice)
    first = None
    for sub in ast.walk(head):
        if isinstance(sub, ast.Compare) and len(sub.ops) == 1:
            if first is None:
                first = sub
            if any(isinstance(x, ast.Subscript) for x in ast.walk(sub)):
                info["cmp"] = sub  # the comparison that looks at the array wins
                info["on_array"] = True
                break
    if info["cmp"] is None:
        info["cmp"] = first
        info["on_array"] = False
    return info


def _ev(expr_node, frame):
    try:
        code = compile(ast.Expression(expr_node), "<anim>", "eval")
        return eval(code, frame.f_globals, frame.f_locals)
    except Exception:
        return None


OPS = {ast.Lt: "<", ast.Gt: ">", ast.LtE: "≤", ast.GtE: "≥", ast.Eq: "=", ast.NotEq: "≠"}


def _run_once(code, fname, mode, arr, target, info_cache, lines, tname):
    ns = {"__name__": "__anim__"}
    exec(compile(code, "<lesson>", "exec"), ns)
    fn = ns[fname]
    events = []
    work = list(arr)

    def tracer(frame, event, a):
        if frame.f_code is not fn.__code__:
            return tracer if frame.f_code.co_filename == "<lesson>" else None
        if event == "line":
            if len(events) > MAX_EVENTS:
                raise TooLong("too many lines executed")
            ln = frame.f_lineno
            info = info_cache.get(ln)
            if info is None and ln not in info_cache:
                info = _line_info(lines[ln - 1] if ln - 1 < len(lines) else "", tname)
                info_cache[ln] = info
            loc = {}
            for k, v in frame.f_locals.items():
                if isinstance(v, int) and not isinstance(v, bool):
                    loc[k] = v
            ev = {"ln": ln, "raw": list(frame.f_locals.get(tname, work)), "loc": loc, "idx": [], "cmpv": None}
            if info:
                for sl in info["subs"]:
                    v = _ev(sl, frame)
                    if isinstance(v, int) and not isinstance(v, bool):
                        ev["idx"].append(v)
                if info["cmp"] is not None:
                    c = info["cmp"]
                    lv = _ev(c.left, frame)
                    rv = _ev(c.comparators[0], frame)
                    op = OPS.get(type(c.ops[0]), "?")
                    res = None
                    try:
                        res = bool(eval(compile(ast.Expression(c), "<anim>", "eval"), frame.f_globals, frame.f_locals))
                    except Exception:
                        pass
                    ev["cmpv"] = (lv, rv, op, res)
            events.append(ev)
        elif event == "return":
            events.append({"ln": None, "raw": list(frame.f_locals.get(tname, work)), "loc": {}, "idx": [], "cmpv": None, "ret": a})
        return tracer

    sys.settrace(tracer)
    try:
        if mode == "search":
            fn(work, len(work), target)
        else:
            fn(work, len(work))
    finally:
        sys.settrace(None)
    return events


def _auto_msg(info, ev, algo_text, changed_txt):
    parts = []
    if algo_text:
        parts.append(algo_text.strip())
    detail = ""
    cv = ev["cmpv"]
    if cv and cv[0] is not None and cv[1] is not None:
        detail = "%s %s %s : %s" % (cv[0], cv[2], cv[1], "vrai" if cv[3] else "faux")
    elif changed_txt:
        detail = changed_txt
    return " : ".join([p for p in [parts[0] if parts else "", detail] if p]) or None


def _custom_msg(src_line, loc, raw):
    """`# fr: Compare {T[j]} et {T[j+1]} | ar: ...` at the end of a Python line."""
    m = re.search(r"#\s*fr\s*:\s*(.*?)(?:\|\s*ar\s*:\s*(.*))?$", src_line)
    if not m:
        return None
    env = dict(loc)
    env["T"] = raw

    def fill(t):
        def sub(mm):
            try:
                return str(eval(mm.group(1), {}, env))
            except Exception:
                return mm.group(0)

        return re.sub(r"\{([^{}]+)\}", sub, t).strip()

    fr = fill(m.group(1))
    ar = fill(m.group(2)) if m.group(2) else fr
    return {"fr": fr, "ar": ar}


def record(code, fname, mode, variants, algo_lines, py2algo, index_vars, zone, detail):
    """variants: [{input: [...], target: x|None}] -> [{input, target, steps}]"""
    lines = code.split("\n")
    # name of the array parameter: first parameter of the function
    tree = ast.parse(code)
    fdef = [n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name == fname]
    if not fdef:
        raise ValueError("fonction %s introuvable" % fname)
    params = [a.arg for a in fdef[0].args.args]
    tname = params[0]
    info_cache = {}
    out = []
    last_algo = max(0, len(algo_lines) - 1)

    def algo_of(ln):
        if ln is None:
            return last_algo
        i = ln - 1
        if 0 <= i < len(py2algo):
            return py2algo[i]
        return 0

    for var in variants:
        arr = [int(v) for v in var["input"]]
        target = var.get("target")
        if len(set(arr)) != len(arr):
            raise ValueError("les valeurs du tableau doivent être différentes")
        events = _run_once(code, fname, mode, arr, target, info_cache, lines, tname)
        n = len(arr)
        orig = list(arr)
        V = list(arr)
        stable = list(arr)
        c = 0
        s = 0
        last_key = None
        blank_since_stable = False
        steps = []

        def snap(extra):
            o = dict(extra)
            o["a"] = list(V)
            o["c"] = c
            o["s"] = s
            o["done"] = []
            if mode == "search" and target is not None:
                o["target"] = target
            return o

        steps.append(snap({"line": algo_of(fdef[0].lineno + 1) if False else 0, "msg": {"fr": "Début : tableau de %d éléments." % n, "ar": "البداية: مصفوفة من %d عناصر." % n}}))
        ev_lines = [e for e in events if e["ln"] is not None]
        for k, ev in enumerate(events):
            post = events[k + 1]["raw"] if k + 1 < len(events) else ev["raw"]
            pre = ev["raw"]
            if ev["ln"] is None:
                continue
            nxt_raw = post
            changed = [d for d in range(n) if pre[d] != nxt_raw[d]]
            # visual array: a changed slot takes its card from another slot (the source slot becomes a hole)
            if changed:
                last_key = None
                blanks = []
                for d in changed:
                    v = nxt_raw[d]
                    if v in V:
                        s_i = V.index(v)
                        if s_i not in changed:
                            blanks.append(s_i)
                for b in blanks:
                    V[b] = None
                if blanks:
                    s += 1  # a card moved to another slot (a shift, or the first half of an exchange)
                    blank_since_stable = True
                for d in changed:
                    V[d] = nxt_raw[d]
            info = info_cache.get(ev["ln"])
            is_cmp = ev["cmpv"] is not None
            loc = ev["loc"]
            # which lines are worth a step
            keep = True
            if not detail:
                kind = info["kind"] if info else ""
                scalar_change = False
                if k + 1 < len(events):
                    nl = events[k + 1]["loc"]
                    scalar_change = any(loc.get(x) != nl.get(x) for x in set(loc) | set(nl)) if events[k + 1]["ln"] is not None else False
                keep = bool(changed) or is_cmp or (kind in ("Assign", "AugAssign", "Return") and (scalar_change or kind == "Return"))
                if kind in ("For", "While") and not is_cmp and not changed:
                    keep = False
            if not keep:
                continue
            on_arr = bool(info and info.get("on_array")) and is_cmp
            idxs0 = tuple(i for i in ev["idx"] if 0 <= i < n)
            on_arr = on_arr and bool(idxs0)
            if on_arr:
                if idxs0 != last_key:
                    c += 1  # the same cards compared again straight away (T[m] == x, then T[m] < x) count once
                last_key = idxs0
            else:
                last_key = None
            missing = [v for v in orig if v not in V]
            held = missing[0] if len(missing) == 1 and None in V else None
            st = snap({"line": algo_of(ev["ln"])})
            idxs = [i for i in ev["idx"] if 0 <= i < n]
            seen = []
            for i in idxs:
                if i not in seen:
                    seen.append(i)
            if on_arr and seen:
                st["cmp"] = seen[:2]
                cv = ev["cmpv"]
                if len(seen) == 1 and held is None and cv[0] is not None and cv[1] is not None:
                    if cv[2] in ("=", "≠"):
                        st["eq"] = cv[0] == cv[1]
                    else:
                        st["sign"] = "<" if cv[0] < cv[1] else ">" if cv[0] > cv[1] else "="
                        st["eq"] = cv[0] == cv[1]
            if held is not None:
                st["held"] = held
            # labels under the slots: the index variables
            tags = {}
            for name in index_vars:
                v = loc.get(name)
                if v is not None and 0 <= v < n:
                    tags[v] = tags[v] + "·" + name if v in tags else name
            if tags:
                st["tags"] = tags
            if zone and len(zone) == 2:
                lo = loc.get(zone[0])
                hi = loc.get(zone[1])
                if lo is not None and hi is not None:
                    st["out"] = [q for q in range(n) if q < lo or q > hi]
            # exchange of two cards
            if None not in V and held is None:
                diff = [d for d in range(n) if V[d] != stable[d]]
                if len(diff) == 2 and V[diff[0]] == stable[diff[1]] and V[diff[1]] == stable[diff[0]]:
                    st["swap"] = diff
                    if not blank_since_stable:
                        s += 1
                    st["s"] = s
                blank_since_stable = False
                stable = list(V)
                st["a"] = list(V)
            st["c"] = c
            src = lines[ev["ln"] - 1] if ev["ln"] - 1 < len(lines) else ""
            custom = _custom_msg(src, loc, ev["raw"])
            if custom:
                st["msg"] = custom
            else:
                txt = algo_lines[st["line"]] if st["line"] < len(algo_lines) else None
                ch = ", ".join("T[%d] = %s" % (d + 1, nxt_raw[d]) for d in changed) if changed else ""
                st["msg"] = None
                m = _auto_msg(info, ev, txt, ch)
                if m:
                    st["msg"] = {"fr": m, "ar": m}
            steps.append(st)
            if len(steps) > MAX_STEPS:
                raise TooLong("trop d'étapes (%d) : réduis la taille du tableau" % len(steps))
        # the end
        ret = events[-1].get("ret") if events else None
        final = snap({"line": last_algo, "msg": None})
        if mode == "search":
            ok = bool(ret) if ret is not None else False
            final["msg"] = {
                "fr": "Retourner %s : %s" % ("Vrai" if ok else "Faux", "%s est dans le tableau." % target if ok else "%s n'est pas dans le tableau." % target),
                "ar": "نرجع %s" % ("Vrai" if ok else "Faux"),
            }
            final["done"] = []
            for st in reversed(steps):
                if st.get("eq") and st.get("cmp"):
                    final["done"] = [st["cmp"][0]]
                    break
        steps.append(final)
        # sorted marks: a card is done once it sits in its final place for good
        if mode == "sort":
            fin = steps[-1]["a"]
            ok_from = [None] * n
            for d in range(n):
                t = len(steps)
                for i in range(len(steps) - 1, -1, -1):
                    if steps[i]["a"][d] == fin[d]:
                        t = i
                    else:
                        break
                ok_from[d] = t
            for i, st in enumerate(steps):
                st["done"] = [d for d in range(n) if ok_from[d] <= i and i > 0]
            steps[-1]["done"] = list(range(n))
        for st in steps:
            if "tags" in st:
                st["tags"] = {str(k2): v2 for k2, v2 in st["tags"].items()}
        out.append({"input": arr, "target": target, "steps": steps})
    return out


def record_json(payload_json):
    p = json.loads(payload_json)
    res = record(
        p["code"], p["fname"], p["mode"], p["variants"], p["algo_lines"], p["py2algo"], p.get("index_vars", []), p.get("zone"), bool(p.get("detail"))
    )
    return json.dumps(res)
