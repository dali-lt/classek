/* ClassLedger algorithm animations (used by chapters.js).
   In a lesson, a fenced block  ```viz  followed by one name (tri-bulles | tri-selection | tri-insertion)
   becomes a step-by-step animation next to the pseudo-code. Everything runs in the browser, nothing to host.

   makeAlgoViz(kind, opts) -> element
     opts.el(tag, cls, text)         element helper
     opts.codeLine(text, lang)       node with the colouring of one code line
     opts.lang()                     "fr" | "ar" (page language)
     opts.codeLang()                 "algo" | "python"
     opts.setCodeLang(l)             remember the choice (shared with the code blocks of the lesson)
*/

var UI = {
  fr: {
    reset: "Recommencer",
    prev: "Pas précédent",
    next: "Pas suivant",
    play: "Lecture",
    pause: "Pause",
    speed: "Vitesse",
    slow: "Lent",
    normal: "Normal",
    fast: "Rapide",
    shuffle: "Nouveau tableau",
    step: "Étape",
    cmp: "Comparaisons",
    swp: "Échanges",
    algo: "Algorithme",
    python: "Python",
    done: "Le tableau est trié.",
    start: "Tableau de départ. Appuie sur « Pas suivant » ou sur Lecture.",
    held: "x (valeur en main)",
    title: { "tri-bulles": "Tri à bulles", "tri-selection": "Tri par sélection", "tri-insertion": "Tri par insertion" },
  },
  ar: {
    reset: "من البداية",
    prev: "الخطوة السابقة",
    next: "الخطوة التالية",
    play: "تشغيل",
    pause: "إيقاف",
    speed: "السرعة",
    slow: "بطيء",
    normal: "عادي",
    fast: "سريع",
    shuffle: "مصفوفة جديدة",
    step: "الخطوة",
    cmp: "المقارنات",
    swp: "التبديلات",
    algo: "Algorithme",
    python: "Python",
    done: "المصفوفة مرتبة.",
    start: "المصفوفة الأولى. اضغط على « الخطوة التالية » أو تشغيل.",
    held: "x (القيمة في اليد)",
    title: { "tri-bulles": "Tri à bulles", "tri-selection": "Tri par sélection", "tri-insertion": "Tri par insertion" },
  },
};

/* ---------------- pseudo-code (Bac conventions, tables start at 1) and Python (starts at 0) ---------------- */
var CODE = {
  "tri-bulles": {
    algo: [
      "Procédure tri_bulles (@T : Tab, n : Entier)",
      "DEBUT",
      "   Pour i de 1 à n - 1 Faire",
      "      Pour j de 1 à n - i Faire",
      "         Si T[j] > T[j + 1] Alors",
      "            t ← T[j]",
      "            T[j] ← T[j + 1]",
      "            T[j + 1] ← t",
      "         FinSi",
      "      FinPour",
      "   FinPour",
      "FIN",
    ],
    python: [
      "def tri_bulles(T, n):",
      "    for i in range(1, n):",
      "        for j in range(n - i):",
      "            if T[j] > T[j + 1]:",
      "                t = T[j]",
      "                T[j] = T[j + 1]",
      "                T[j + 1] = t",
    ],
    map: [0, 0, 1, 2, 3, 4, 5, 6, 3, 2, 1, 6],
  },
  "tri-selection": {
    algo: [
      "Procédure tri_selection (@T : Tab, n : Entier)",
      "DEBUT",
      "   Pour i de 1 à n - 1 Faire",
      "      im ← i",
      "      Pour j de i + 1 à n Faire",
      "         Si T[j] < T[im] Alors",
      "            im ← j",
      "         FinSi",
      "      FinPour",
      "      Si im ≠ i Alors",
      "         t ← T[i]",
      "         T[i] ← T[im]",
      "         T[im] ← t",
      "      FinSi",
      "   FinPour",
      "FIN",
    ],
    python: [
      "def tri_selection(T, n):",
      "    for i in range(n - 1):",
      "        im = i",
      "        for j in range(i + 1, n):",
      "            if T[j] < T[im]:",
      "                im = j",
      "        if im != i:",
      "            t = T[i]",
      "            T[i] = T[im]",
      "            T[im] = t",
    ],
    map: [0, 0, 1, 2, 3, 4, 5, 4, 3, 6, 7, 8, 9, 6, 1, 9],
  },
  "tri-insertion": {
    algo: [
      "Procédure tri_insertion (@T : Tab, n : Entier)",
      "DEBUT",
      "   Pour i de 2 à n Faire",
      "      x ← T[i]",
      "      j ← i - 1",
      "      place ← Faux",
      "      Tant que (j ≥ 1) ET (NON place) Faire",
      "         Si T[j] > x Alors",
      "            T[j + 1] ← T[j]",
      "            j ← j - 1",
      "         Sinon",
      "            place ← Vrai",
      "         FinSi",
      "      FinTantQue",
      "      T[j + 1] ← x",
      "   FinPour",
      "FIN",
    ],
    python: [
      "def tri_insertion(T, n):",
      "    for i in range(1, n):",
      "        x = T[i]",
      "        j = i - 1",
      "        place = False",
      "        while j >= 0 and not place:",
      "            if T[j] > x:",
      "                T[j + 1] = T[j]",
      "                j = j - 1",
      "            else:",
      "                place = True",
      "        T[j + 1] = x",
    ],
    map: [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 6, 5, 11, 1, 11],
  },
};

/* ---------------- step generators ----------------
   a step: { a: array (null = empty slot), cmp: [i, j], swap: [i, j], mark: index, done: [indexes], held: value|null,
             line: algo line index, msg: {fr, ar}, c: comparisons so far, s: swaps so far } */
function gen(kind, input) {
  var a = input.slice();
  var n = a.length;
  var steps = [];
  var c = 0;
  var s = 0;
  var done = [];
  function push(o) {
    o.a = a.slice();
    o.done = done.slice();
    o.c = c;
    o.s = s;
    steps.push(o);
  }
  var i, j;
  push({ line: 1, msg: { fr: "Début : tableau de " + n + " éléments.", ar: "البداية: مصفوفة من " + n + " عناصر." } });

  if (kind === "tri-bulles") {
    for (var pi = 1; pi <= n - 1; pi++) {
      push({ line: 2, msg: { fr: "Passage i = " + pi + " : j va de 1 à " + (n - pi) + ".", ar: "الدورة i = " + pi + " : j من 1 إلى " + (n - pi) + "." } });
      for (j = 0; j < n - pi; j++) {
        c++;
        var gt = a[j] > a[j + 1];
        push({
          line: 4,
          cmp: [j, j + 1],
          msg: {
            fr: "Compare T[" + (j + 1) + "] = " + a[j] + " et T[" + (j + 2) + "] = " + a[j + 1] + " : " + (gt ? a[j] + " > " + a[j + 1] + ", il faut échanger." : "dans le bon ordre."),
            ar: "نقارن T[" + (j + 1) + "] = " + a[j] + " مع T[" + (j + 2) + "] = " + a[j + 1] + " : " + (gt ? "نبدّل لأن " + a[j] + " > " + a[j + 1] : "الترتيب صحيح."),
          },
        });
        if (gt) {
          var tmp = a[j];
          a[j] = a[j + 1];
          a[j + 1] = tmp;
          s++;
          push({
            line: 5,
            swap: [j, j + 1],
            msg: { fr: "Échange avec la variable t : " + a[j + 1] + " passe à droite.", ar: "تبديل بالمتغير t : " + a[j + 1] + " ينتقل لليمين." },
          });
        }
      }
      done.push(n - pi);
      push({
        line: 9,
        msg: {
          fr: "Fin du passage " + pi + " : le plus grand des éléments restants est à sa place (T[" + (n - pi + 1) + "]).",
          ar: "نهاية الدورة " + pi + " : أكبر العناصر المتبقية أخذ مكانه (T[" + (n - pi + 1) + "]).",
        },
      });
    }
    done = [];
    for (i = 0; i < n; i++) done.push(i);
    push({ line: 11, msg: null });
  } else if (kind === "tri-selection") {
    for (i = 0; i < n - 1; i++) {
      var mn = i;
      push({ line: 3, mark: mn, msg: { fr: "i = " + (i + 1) + " : on suppose que le minimum est en T[" + (i + 1) + "].", ar: "i = " + (i + 1) + " : نفترض أن الأصغر في T[" + (i + 1) + "]." } });
      for (j = i + 1; j < n; j++) {
        c++;
        var lt = a[j] < a[mn];
        push({
          line: 5,
          cmp: [j, mn],
          mark: mn,
          msg: {
            fr: "Compare T[" + (j + 1) + "] = " + a[j] + " au minimum " + a[mn] + " : " + (lt ? "plus petit, nouveau minimum (im)." : "pas plus petit."),
            ar: "نقارن T[" + (j + 1) + "] = " + a[j] + " مع الأصغر " + a[mn] + " : " + (lt ? "أصغر، الأصغر الجديد." : "ليس أصغر."),
          },
        });
        if (lt) {
          mn = j;
          push({ line: 6, mark: mn, msg: { fr: "im ← " + (j + 1) + ".", ar: "im ← " + (j + 1) + "." } });
        }
      }
      if (mn !== i) {
        var t2 = a[i];
        a[i] = a[mn];
        a[mn] = t2;
        s++;
        done.push(i);
        push({ line: 10, swap: [i, mn], msg: { fr: "On place le minimum en T[" + (i + 1) + "] : échange.", ar: "نضع الأصغر في T[" + (i + 1) + "] : تبديل." } });
      } else {
        done.push(i);
        push({ line: 9, msg: { fr: "Le minimum est déjà en T[" + (i + 1) + "] : pas d'échange.", ar: "الأصغر موجود في T[" + (i + 1) + "] : لا تبديل." } });
      }
    }
    done = [];
    for (i = 0; i < n; i++) done.push(i);
    push({ line: 15, msg: null });
  } else {
    done = [0];
    for (i = 1; i < n; i++) {
      var x = a[i];
      a[i] = null;
      j = i - 1;
      push({ line: 3, held: x, hole: i, msg: { fr: "i = " + (i + 1) + " : x ← T[" + (i + 1) + "] = " + x + ". On lui cherche une place à gauche.", ar: "i = " + (i + 1) + " : x ← T[" + (i + 1) + "] = " + x + ". نبحث له عن مكان على اليسار." } });
      while (j >= 0) {
        c++;
        var bigger = a[j] > x;
        push({
          line: 7,
          held: x,
          cmp: [j],
          msg: {
            fr: "Si T[" + (j + 1) + "] > x ? " + a[j] + " > " + x + " : " + (bigger ? "oui, on le décale à droite." : "non."),
            ar: "هل T[" + (j + 1) + "] > x ؟ " + a[j] + " > " + x + " : " + (bigger ? "نعم، نزحزحه لليمين." : "لا."),
          },
        });
        if (!bigger) {
          push({ line: 11, held: x, msg: { fr: "place ← Vrai : x a trouvé sa place.", ar: "place ← Vrai : x وجد مكانه." } });
          break;
        }
        a[j + 1] = a[j];
        a[j] = null;
        s++;
        push({ line: 8, held: x, msg: { fr: "T[" + (j + 2) + "] ← T[" + (j + 1) + "] : décalage, puis j ← j - 1.", ar: "T[" + (j + 2) + "] ← T[" + (j + 1) + "] : إزاحة، ثم j ← j - 1." } });
        j--;
      }
      a[j + 1] = x;
      done = [];
      for (var k = 0; k <= i; k++) done.push(k);
      push({ line: 14, msg: { fr: "T[" + (j + 2) + "] ← x = " + x + " : le début du tableau est trié.", ar: "T[" + (j + 2) + "] ← x = " + x + " : بداية المصفوفة مرتبة." } });
    }
    push({ line: 16, msg: null });
  }
  return steps;
}

function randomArray(n) {
  var pool = [];
  for (var i = 1; i <= 12; i++) pool.push(i);
  var out = [];
  while (out.length < n) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  return out;
}

export function makeAlgoViz(kind, opts) {
  var el = opts.el;
  var code = CODE[kind];
  var box = el("div", "av");
  if (!code) {
    box.textContent = "viz: " + kind;
    return box;
  }
  var start = kind === "tri-insertion" ? [5, 3, 8, 1, 9, 2] : [5, 3, 8, 1, 9, 2];
  var input = start.slice();
  var steps = gen(kind, input);
  var idx = 0;
  var timer = null;
  var speed = 900;

  function u(key) {
    return UI[opts.lang() === "ar" ? "ar" : "fr"][key];
  }

  var head = el("div", "av-head");
  head.append(el("span", "test-chip", u("title")[kind]));
  var counters = el("span", "av-counters");
  head.append(counters);
  box.append(head);
  var split = el("div", "av-split");
  var left = el("div", "av-left");
  var right = el("div", "av-right");

  var stage = el("div", "av-stage");
  right.append(stage);
  var msg = el("p", "av-msg");
  right.append(msg);

  var bar = el("div", "av-ctl");
  function btn(cls, label, svg) {
    var b = el("button", "av-btn " + cls);
    b.type = "button";
    b.setAttribute("aria-label", label);
    b.title = label;
    b.innerHTML = svg;
    return b;
  }
  var ICON = {
    reset: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
    prev: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18 5v14L8 12z"/><rect x="5" y="5" width="2.4" height="14" rx="1"/></svg>',
    next: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 5v14l10-7z"/><rect x="16.6" y="5" width="2.4" height="14" rx="1"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M7 4.5v15l12-7.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="6" y="4.5" width="4" height="15" rx="1.4"/><rect x="14" y="4.5" width="4" height="15" rx="1.4"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="m4 4 5 5"/></svg>',
  };
  var bReset = btn("", u("reset"), ICON.reset);
  var bPrev = btn("", u("prev"), ICON.prev);
  var bPlay = btn("is-main", u("play"), ICON.play);
  var bNext = btn("", u("next"), ICON.next);
  var bShuf = btn("", u("shuffle"), ICON.shuffle);
  var seg = el("div", "av-seg");
  seg.setAttribute("role", "group");
  seg.setAttribute("aria-label", u("speed"));
  [["slow", 1500], ["normal", 900], ["fast", 380]].forEach(function (o) {
    var sb = el("button", "av-seg-b", u(o[0]));
    sb.type = "button";
    sb.setAttribute("aria-pressed", o[1] === speed ? "true" : "false");
    sb.addEventListener("click", function () {
      speed = o[1];
      Array.prototype.forEach.call(seg.children, function (x) {
        x.setAttribute("aria-pressed", x === sb ? "true" : "false");
      });
      if (timer) {
        stop();
        play();
      }
    });
    seg.append(sb);
  });
  var prog = el("div", "av-prog");
  var progFill = el("i");
  var progRest = el("b");
  prog.append(progFill, progRest);
  var side = el("div", "av-side");
  side.append(bReset, bShuf);
  var mainBtns = el("div", "av-main");
  mainBtns.append(bPrev, bPlay, bNext);
  var row = el("div", "av-row");
  row.append(side, mainBtns, seg);
  bar.append(prog, row);
  right.append(bar);

  var codeWrap = el("div", "av-code");
  var tabs = el("div", "code-tabs");
  tabs.setAttribute("role", "group");
  var tabBtns = {};
  ["algo", "python"].forEach(function (l) {
    var b = el("button", "code-tab", l === "algo" ? "Algorithme" : "Python");
    b.type = "button";
    b.addEventListener("click", function () {
      opts.setCodeLang(l);
      paintCode();
    });
    tabBtns[l] = b;
    tabs.append(b);
  });
  var pre = el("pre", "test-code av-pre");
  var win = el("div", "av-win");
  var dots = el("div", "av-dots");
  dots.append(el("i"), el("i"), el("i"));
  win.append(dots, pre);
  codeWrap.append(tabs, win);
  left.append(codeWrap);
  split.append(left, right);
  box.append(split);

  var lineNodes = [];
  var paintedLang = "";
  function paintCode() {
    var l = opts.codeLang() === "python" ? "python" : "algo";
    tabBtns.algo.setAttribute("aria-pressed", l === "algo" ? "true" : "false");
    tabBtns.python.setAttribute("aria-pressed", l === "python" ? "true" : "false");
    if (paintedLang !== l) {
      paintedLang = l;
      pre.textContent = "";
      lineNodes = code[l].map(function (txt) {
        var d = el("span", "av-line");
        d.append(opts.codeLine(txt, l));
        pre.append(d);
        return d;
      });
    }
    var st = steps[idx];
    var target = l === "algo" ? st.line : code.map[st.line];
    lineNodes.forEach(function (d, k) {
      d.classList.toggle("is-on", k === target);
    });
    paintStage();
  }

  var off = 1;
  var field = el("div", "av-field");
  var cards = {};
  var n0 = input.length;
  function buildField() {
    field.textContent = "";
    cards = {};
    var slots = el("div", "av-slots");
    for (var q = 0; q < n0; q++) {
      var sl = el("span", "av-slot");
      sl.append(el("i"));
      slots.append(sl);
    }
    field.append(slots);
  }
  var CHECK = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  var SWITCH = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h14l-3.5-3.5"/><path d="M20 16H6l3.5 3.5"/></svg>';
  function cardFor(v) {
    if (cards[v]) return cards[v];
    var w = el("div", "av-cw");
    w.style.width = 100 / n0 + "%";
    var c = el("div", "av-card c" + (v % 4));
    c.append(el("span", "av-ci av-ci-a"), el("span", "av-ci av-ci-b"), el("i", "av-blob"), el("b", "av-cv", String(v)), el("span", "av-logo"));
    var dn = el("span", "av-done");
    dn.innerHTML = CHECK;
    w.append(c, dn, el("span", "av-tag", "im"));
    field.append(w);
    cards[v] = w;
    return w;
  }
  buildField();
  stage.append(field);
  function paintStage() {
    off = paintedLang === "python" ? 0 : 1;
    var st = steps[idx];
    var hole = st.a.indexOf(null);
    Array.prototype.forEach.call(field.querySelectorAll(".av-pair"), function (x) {
      x.remove();
    });
    st.a.forEach(function (v, k) {
      if (v == null) return;
      var w = cardFor(v);
      var cls = "av-cw";
      if (st.done.indexOf(k) >= 0) cls += " is-sorted";
      if (st.mark === k && kind === "tri-selection") cls += " is-mark";
      if (st.cmp && st.cmp.indexOf(k) >= 0) cls += " is-cmp";
      if (st.swap && st.swap.indexOf(k) >= 0) cls += " is-swap";
      w.className = cls;
      w.style.left = (k * 100) / n0 + "%";
      w.style.zIndex = "1";
      w.querySelector(".av-ci-a").textContent = String(k + off);
      w.querySelector(".av-ci-b").textContent = String(k + off);
    });
    if (st.held != null) {
      var hw = cardFor(st.held);
      hw.className = "av-cw is-held" + (st.cmp ? " is-cmp" : "");
      hw.style.left = (hole < 0 ? 0 : (hole * 100) / n0) + "%";
      hw.style.zIndex = "2";
      hw.querySelector(".av-ci-a").textContent = "x";
      hw.querySelector(".av-ci-b").textContent = "x";
    }
    // a round badge between the two cards being looked at: the sign of the comparison, or the switch icon
    var p = -1;
    var q = -1;
    var swapNow = false;
    if (st.swap) {
      p = Math.min(st.swap[0], st.swap[1]);
      q = Math.max(st.swap[0], st.swap[1]);
      swapNow = true;
    } else if (st.cmp && st.cmp.length === 2) {
      p = Math.min(st.cmp[0], st.cmp[1]);
      q = Math.max(st.cmp[0], st.cmp[1]);
    } else if (st.cmp && st.cmp.length === 1 && st.held != null && hole >= 0) {
      p = st.cmp[0];
      q = hole;
    }
    if (p >= 0) {
      var vl = st.a[p];
      var vr = q === hole && st.held != null ? st.held : st.a[q];
      var adj = q - p === 1;
      var badge = el("span", "av-pair" + (adj ? "" : " is-above") + (swapNow ? " is-switch" : ""));
      if (swapNow) badge.innerHTML = SWITCH;
      else badge.textContent = vl > vr ? ">" : vl < vr ? "<" : "=";
      var hostVal = adj ? vl : vr;
      var host = cards[hostVal];
      if (host) host.append(badge);
    }
    progFill.style.flexBasis = (steps.length > 1 ? (idx / (steps.length - 1)) * 100 : 0) + "%";
    progFill.style.display = idx === 0 ? "none" : "";
    progRest.style.display = idx === steps.length - 1 ? "none" : "";
    var last = idx === steps.length - 1;
    var text = last ? u("done") : idx === 0 ? u("start") : st.msg ? st.msg[opts.lang() === "ar" ? "ar" : "fr"] : "";
    msg.textContent = text;
    msg.classList.toggle("is-done", last);
    counters.textContent = u("step") + " " + idx + "/" + (steps.length - 1) + " · " + u("cmp") + " " + st.c + " · " + u("swp") + " " + st.s;
    bPrev.disabled = idx === 0;
    bNext.disabled = last;
    bReset.disabled = idx === 0;
    if (last) stop();
  }

  function go(n) {
    idx = Math.max(0, Math.min(steps.length - 1, n));
    paintCode();
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
    bPlay.innerHTML = ICON.play;
    bPlay.setAttribute("aria-label", u("play"));
    bPlay.title = u("play");
  }
  function play() {
    if (idx >= steps.length - 1) go(0);
    bPlay.innerHTML = ICON.pause;
    bPlay.setAttribute("aria-label", u("pause"));
    bPlay.title = u("pause");
    timer = setInterval(function () {
      if (!document.body.contains(box)) return stop();
      go(idx + 1);
    }, speed);
  }
  bPlay.addEventListener("click", function () {
    if (timer) stop();
    else play();
  });
  bNext.addEventListener("click", function () {
    stop();
    go(idx + 1);
  });
  bPrev.addEventListener("click", function () {
    stop();
    go(idx - 1);
  });
  bReset.addEventListener("click", function () {
    stop();
    go(0);
  });
  bShuf.addEventListener("click", function () {
    stop();
    input = randomArray(6);
    steps = gen(kind, input);
    buildField();
    go(0);
  });

  box.setAttribute("lang", "fr");
  box.setAttribute("dir", "ltr");
  paintCode();
  return box;
}

/* ---------------- launcher card + big split-screen box ---------------- */
export function algoTitle(kind, lang) {
  var t = UI[lang === "ar" ? "ar" : "fr"].title[kind];
  return t || kind;
}
export function openAlgoViz(kind, opts) {
  var el = opts.el;
  var old = document.querySelector(".av-modal");
  if (old) old.remove();
  var ov = el("div", "av-modal");
  ov.setAttribute("role", "dialog");
  ov.setAttribute("aria-modal", "true");
  var card = el("div", "av-modal-card");
  var close = el("button", "av-modal-x");
  close.type = "button";
  close.setAttribute("aria-label", "×");
  close.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  var prevOverflow = document.body.style.overflow;
  function shut() {
    ov.remove();
    document.body.style.overflow = prevOverflow;
    document.removeEventListener("keydown", onKey);
  }
  function onKey(e) {
    if (e.key === "Escape") shut();
  }
  close.addEventListener("click", shut);
  ov.addEventListener("mousedown", function (e) {
    if (e.target === ov) shut();
  });
  document.addEventListener("keydown", onKey);
  card.append(close, makeAlgoViz(kind, opts));
  ov.append(card);
  document.body.append(ov);
  document.body.style.overflow = "hidden";
  close.focus();
}
export function makeAlgoLauncher(kind, opts) {
  var el = opts.el;
  var lang = opts.lang() === "ar" ? "ar" : "fr";
  var row = el("div", "av-launch");
  var txt = el("div", "av-launch-t");
  txt.append(el("b", "", algoTitle(kind, lang)), el("small", "", lang === "ar" ? "رسم متحرك خطوة بخطوة" : "Animation pas à pas"));
  var b = el("button", "pc-btn av-launch-btn", lang === "ar" ? "فتح الرسم" : "Ouvrir l’animation");
  b.type = "button";
  b.addEventListener("click", function () {
    openAlgoViz(kind, opts);
  });
  row.append(txt, b);
  return row;
}

export function hasAlgoViz(kind) {
  return !!CODE[kind];
}
