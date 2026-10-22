/* Admin: the "Animations" tab. You write the Algorithme and the Python of a function, the page runs the Python
   in the browser (Pyodide), records every step, shows the animation, and saves it in Firestore "animations".
   Students then get it in the Visualiser box and as a Run button on every code block that starts with that function. */
import { makeAlgoViz, registerAnimations } from "./algoviz.js?v=67";

var PY_BASE = window.PYODIDE_BASE || "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
var pyReady = null;
function loadScript(src) {
  return new Promise(function (ok, bad) {
    var s = document.createElement("script");
    s.src = src;
    s.onload = ok;
    s.onerror = function () {
      bad(new Error("Impossible de charger " + src));
    };
    document.head.append(s);
  });
}
function getPython(setStatus) {
  if (pyReady) return pyReady;
  pyReady = (async function () {
    setStatus("Chargement de Python (une seule fois, ~10 Mo)…");
    await loadScript(PY_BASE + "pyodide.js");
    var py = await window.loadPyodide({ indexURL: PY_BASE });
    var src = await (await fetch("JS/anim-recorder.py?v=1")).text();
    py.runPython(src);
    return py;
  })();
  pyReady.catch(function () {
    pyReady = null;
  });
  return pyReady;
}

var TEMPLATES = {
  sort: {
    python: ["def tri_exemple(T, n):", "    for i in range(n - 1):", "        for j in range(n - 1 - i):", "            if T[j] > T[j + 1]:", "                T[j], T[j + 1] = T[j + 1], T[j]"].join("\n"),
    algo: ["Procédure tri_exemple (@T : Tab, n : Entier)", "DEBUT", "   Pour i de 1 à n - 1 Faire", "      Pour j de 1 à n - i Faire", "         Si T[j] > T[j + 1] Alors", "            échanger T[j] et T[j + 1]", "         FinSi", "      FinPour", "   FinPour", "FIN"].join("\n"),
    variants: "5 3 8 1 9 2\n9 8 7 6 5 4\n1 2 3 4 5 6",
  },
  search: {
    python: ["def cherche(T, n, x):", "    i = 0", "    while i < n and T[i] != x:", "        i = i + 1", "    return i < n"].join("\n"),
    algo: ["Fonction cherche (T : Tab, n, x : Entier) : Booléen", "DEBUT", "   i ← 1", "   Tant que (i ≤ n) ET (T[i] ≠ x) Faire", "      i ← i + 1", "   FinTantQue", "   Retourner i ≤ n", "FIN"].join("\n"),
    variants: "4 9 2 7 5 1 | x=7\n4 9 2 7 5 1 | x=3\n3 8 1 6 2 9 | x=3",
  },
  other: {
    python: ["def inverser(T, n):", "    for i in range(n // 2):", "        T[i], T[n - 1 - i] = T[n - 1 - i], T[i]"].join("\n"),
    algo: ["Procédure inverser (@T : Tab, n : Entier)", "DEBUT", "   Pour i de 1 à n div 2 Faire", "      échanger T[i] et T[n - i + 1]", "   FinPour", "FIN"].join("\n"),
    variants: "1 2 3 4 5 6\n5 3 8 1 9 2",
  },
};
var GROUPS = [
  ["tris", "Tris", "الترتيب"],
  ["recherche", "Recherche", "البحث"],
  ["tableaux", "Tableaux", "الجداول"],
];

/* ---------- helpers: line map ---------- */
function isStructural(line) {
  return /^\s*(Fin|DEBUT|FIN)/i.test(line) && !/^\s*FinSi\s+\S/.test(line);
}
function words(s) {
  return (String(s).toLowerCase().match(/[a-zà-ÿ_][a-zà-ÿ_0-9]*/g) || []).filter(function (w) {
    return ["de", "à", "faire", "alors", "et", "ou", "non", "mod", "div", "tab", "entier", "pour", "si", "sinon", "tant", "que", "retourner", "for", "if", "while", "else", "elif", "return", "in", "range", "def", "and", "or", "not"].indexOf(w) < 0;
  });
}
function klass(line, py) {
  var s = line.trim().toLowerCase();
  if (/^(procédure|fonction|def)\b/.test(s)) return "def";
  if (/^(pour|for)\b/.test(s)) return "loop";
  if (/^(tant que|while)\b/.test(s)) return "while";
  if (/^(si|if|elif)\b/.test(s)) return "if";
  if (/^(sinon|else)\b/.test(s)) return "else";
  if (/^(retourner|return)\b/.test(s)) return "ret";
  return "stmt";
}
// first guess: for each Algorithme line, the Python line that looks like it (same kind of line, same words), in order
export function guessMap(algo, py) {
  var map = [];
  var ptr = 0;
  var last = 0;
  algo.forEach(function (al, ai) {
    if (isStructural(al) || /^\s*$/.test(al)) {
      map.push(last);
      return;
    }
    var kl = klass(al);
    var aw = words(al.replace(/←/g, " "));
    var best = -1;
    var bestScore = -1;
    for (var p = ptr; p < Math.min(py.length, ptr + 6); p++) {
      var kp = klass(py[p]);
      var compat = kp === kl || (kl === "stmt" && kp === "stmt") || (kl === "if" && kp === "while" && false);
      if (!compat) continue;
      var pw = words(py[p]);
      var score = aw.filter(function (w) {
        return pw.indexOf(w) >= 0;
      }).length;
      if (score > bestScore) {
        bestScore = score;
        best = p;
      }
      if (kl === "def") break;
    }
    if (best < 0) best = Math.min(py.length - 1, last);
    map.push(best);
    last = best;
    ptr = best + 1;
  });
  return map;
}
// Python line -> Algorithme line (what the recorder needs): the line that really does something wins over Fin…
export function invertMap(map, algo, nPy) {
  var out = [];
  var prev = 0;
  for (var p = 0; p < nPy; p++) {
    var c = [];
    map.forEach(function (pl, a) {
      if (pl === p) c.push(a);
    });
    var good = c.filter(function (a) {
      return !isStructural(algo[a]);
    });
    var pick = good.length ? good[0] : c.length ? c[0] : null;
    if (pick == null) pick = prev;
    out.push(pick);
    prev = pick;
  }
  return out;
}
function detectIndexVars(code) {
  var found = [];
  var re = /\bT\[([^\]]+)\]/g;
  var m;
  while ((m = re.exec(code))) {
    (m[1].match(/[A-Za-z_][A-Za-z_0-9]*/g) || []).forEach(function (w) {
      if (w !== "T" && w !== "n" && found.indexOf(w) < 0) found.push(w);
    });
  }
  return found;
}
function slug(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
function parseVariants(text, mode) {
  var out = [];
  String(text || "")
    .split("\n")
    .forEach(function (ln) {
      var t = ln.trim();
      if (!t) return;
      var parts = t.split("|");
      var arr = (parts[0].match(/-?\d+/g) || []).map(Number);
      var x = null;
      var m = /x\s*=\s*(-?\d+)/.exec(parts[1] || "");
      if (m) x = Number(m[1]);
      if (!arr.length) return;
      out.push({ input: arr, target: x });
    });
  if (mode === "search")
    out.forEach(function (v) {
      if (v.target == null) throw new Error("Recherche : ajoute « | x=7 » à chaque ligne.");
    });
  return out;
}

/* ---------- JSON file -> form fields ----------
   One animation per file. Every field is optional except python and algo; text fields accept a string or an array of lines.
   {
     "title_fr": "Factorielle (tableau)", "title_ar": "...",
     "group": "tris" | "recherche" | "tableaux" | "autre-nom", "group_fr": "...", "group_ar": "...",   (group_fr/ar only for a new group)
     "mode": "sort" | "search" | "other",
     "python": ["def f(T, n):", "    ..."],   "algo": ["Procédure f (@T : Tab, n : Entier)", "DEBUT", "..."],
     "map": [0, 0, 1, ...],                   (optional: Python line, 0-based, for each Algorithme line; guessed if missing)
     "index_vars": "i, j",  "zone": "d, f",   (optional)
     "variants": ["5 3 8 1 9 2", "9 8 7 6 5 4"]   or   ["4 9 2 7 | x=7"]   or   [{ "input": [4, 9, 2], "target": 9 }],
     "detail": false
   } */
function asText(v) {
  return Array.isArray(v) ? v.join("\n") : v == null ? "" : String(v);
}
function asList(v) {
  return Array.isArray(v)
    ? v.map(String)
    : String(v == null ? "" : v)
        .split(/[ ,]+/)
        .filter(Boolean);
}
export function normalizeAnimJson(raw) {
  if (Array.isArray(raw)) raw = raw[0];
  if (!raw || typeof raw !== "object") throw new Error("Le fichier doit contenir un objet JSON (une animation).");
  var mode = raw.mode == null ? "other" : String(raw.mode);
  if (["sort", "search", "other"].indexOf(mode) < 0) throw new Error("« mode » doit être sort, search ou other (reçu : " + mode + ").");
  var py = asText(raw.python);
  var algo = asText(raw.algo);
  if (!py.trim()) throw new Error("Il manque « python » dans le fichier.");
  if (!algo.trim()) throw new Error("Il manque « algo » dans le fichier.");
  var vtext = "";
  if (typeof raw.variantsText === "string" && raw.variantsText.trim()) vtext = raw.variantsText;
  else if (Array.isArray(raw.variants))
    vtext = raw.variants
      .map(function (v) {
        if (typeof v === "string") return v;
        if (Array.isArray(v)) return v.join(" ");
        if (v && Array.isArray(v.input)) return v.input.join(" ") + (v.target != null ? " | x=" + v.target : "");
        return "";
      })
      .filter(Boolean)
      .join("\n");
  else vtext = asText(raw.variants);
  return {
    title_fr: asText(raw.title_fr || raw.title).trim(),
    title_ar: asText(raw.title_ar).trim(),
    group: asText(raw.group).trim(),
    group_fr: asText(raw.group_fr).trim(),
    group_ar: asText(raw.group_ar).trim(),
    mode: mode,
    python: py,
    algo: algo,
    map: Array.isArray(raw.map) ? raw.map.map(Number) : null,
    index_vars: asList(raw.index_vars),
    zone: asList(raw.zone),
    variantsText: vtext,
    detail: !!raw.detail,
  };
}

/* ---------- the tab ---------- */
export function initAnimAdmin(ctx) {
  var sdk = ctx.sdk;
  var db = ctx.db;
  var pane = ctx.pane;
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function field(label, node, hint) {
    var f = el("div", "up-field");
    f.append(el("span", "up-label", label), node);
    if (hint) f.append(el("p", "up-hint an-hint", hint));
    return f;
  }
  function input(ph) {
    var i = el("input", "an-in");
    i.type = "text";
    i.placeholder = ph || "";
    return i;
  }
  function area(rows, ph) {
    var t = el("textarea", "an-ta");
    t.rows = rows;
    t.spellcheck = false;
    if (ph) t.placeholder = ph;
    return t;
  }

  var listBox = el("div", "an-list");
  var fTitleFr = input("Tri de Shell");
  var fTitleAr = input("ترتيب شل");
  var fGroup = el("select", "an-in");
  GROUPS.forEach(function (g) {
    var o = el("option", "", g[1]);
    o.value = g[0];
    fGroup.append(o);
  });
  var og = el("option", "", "Autre groupe…");
  og.value = "__new";
  fGroup.append(og);
  var fGroupFr = input("Nom du groupe (FR)");
  var fGroupAr = input("اسم المجموعة (AR)");
  var gRow = el("div", "an-row");
  gRow.append(fGroupFr, fGroupAr);
  gRow.hidden = true;
  var fMode = el("select", "an-in");
  [
    ["sort", "Tri : la fonction range T sur place"],
    ["search", "Recherche : la fonction renvoie Vrai / Faux"],
    ["other", "Autre : la fonction modifie T"],
  ].forEach(function (m) {
    var o = el("option", "", m[1]);
    o.value = m[0];
    fMode.append(o);
  });
  var fPy = area(9);
  var fAlgo = area(9);
  var mapBox = el("div", "an-map");
  var fIdx = input("i, j");
  var fZone = input("d, f (facultatif)");
  var fVar = area(4);
  var fDetail = el("input");
  fDetail.type = "checkbox";
  var detailLbl = el("label", "an-check");
  detailLbl.append(fDetail, document.createTextNode(" Détaillé : une étape pour chaque ligne exécutée (sinon : seulement comparaisons et modifications)"));
  var status = el("p", "up-msg an-status");
  status.setAttribute("role", "status");
  var previewBox = el("div", "an-preview");
  var btnGuess = el("button", "an-btn", "Deviner la correspondance");
  btnGuess.type = "button";
  var btnGen = el("button", "an-btn is-main", "Générer l’aperçu");
  btnGen.type = "button";
  var btnSave = el("button", "an-btn is-save", "Enregistrer");
  btnSave.type = "button";
  btnSave.disabled = true;
  var btnNew = el("button", "an-btn", "Nouveau");
  btnNew.type = "button";
  var btnImport = el("button", "an-btn", "Importer un fichier JSON");
  btnImport.type = "button";
  var btnExport = el("button", "an-btn", "Exporter en JSON");
  btnExport.type = "button";
  var fileIn = el("input");
  fileIn.type = "file";
  fileIn.accept = ".json,application/json";
  fileIn.hidden = true;
  var io = el("div", "an-actions");
  io.append(btnImport, btnExport, fileIn);
  var ioHint = el("p", "up-hint an-hint", "Remplis le formulaire à la main, ou charge un fichier .json qui le remplit. « Exporter en JSON » te donne un modèle à copier.");
  var actions = el("div", "an-actions");
  actions.append(btnNew, btnGen, btnSave);

  var form = el("div", "an-form");
  var gLabel = el("div", "up-field");
  gLabel.append(el("span", "up-label", "Groupe"), fGroup, gRow);
  var r1 = el("div", "an-row");
  r1.append(field("Titre (FR)", fTitleFr), field("Titre (AR)", fTitleAr));
  var r2 = el("div", "an-row");
  r2.append(field("Type", fMode), gLabel);
  var r3 = el("div", "an-row");
  r3.append(field("Python (la fonction commence à la 1re ligne)", fPy), field("Algorithme (1re ligne : Procédure ou Fonction + même nom)", fAlgo));
  var mapField = field("Correspondance : pour chaque ligne de l’Algorithme, la ligne Python qui la fait", mapBox, "Sert à colorer la bonne ligne dans les deux onglets.");
  mapField.append(btnGuess);
  var r4 = el("div", "an-row");
  r4.append(field("Variables d’indice à afficher sous les cases", fIdx, "Détectées automatiquement ; tu peux les changer."), field("Zone de recherche (début, fin)", fZone, "Les cases hors de la zone sont grisées (recherche dichotomique)."));
  form.append(r1, r2, r3, mapField, r4, field("Exemples (un par ligne)", fVar, "Valeurs différentes, séparées par des espaces. Recherche : ajoute  | x=7"), detailLbl, status, actions, previewBox);

  var head = el("div", "up-field");
  head.append(el("span", "up-label", "Animations enregistrées"), listBox);
  pane.append(head, el("span", "up-label", "Ajouter ou modifier une animation"), io, ioHint, form);

  var current = { id: "", steps: null, doc: null };
  function setStatus(msg, kind) {
    status.textContent = msg || "";
    status.className = "up-msg an-status" + (kind ? " is-" + kind : "");
  }
  function lines(t) {
    return String(t).replace(/\r/g, "").replace(/\s+$/, "").split("\n");
  }
  function fname() {
    var m = /^\s*def\s+([A-Za-z_][A-Za-z_0-9]*)/m.exec(fPy.value);
    return m ? m[1] : "";
  }
  function renderMap(map) {
    mapBox.textContent = "";
    var al = lines(fAlgo.value);
    var pl = lines(fPy.value);
    al.forEach(function (a, i) {
      var row = el("div", "an-map-row");
      row.append(el("code", "", a.replace(/^\s+/, function (s) { return s; })));
      var sel = el("select", "an-in an-map-sel");
      pl.forEach(function (p, k) {
        var o = el("option", "", k + 1 + "  " + p.trim().slice(0, 34));
        o.value = String(k);
        sel.append(o);
      });
      sel.value = String(Math.max(0, Math.min(pl.length - 1, map && map[i] != null ? map[i] : 0)));
      row.append(sel);
      mapBox.append(row);
    });
  }
  function readMap() {
    return Array.prototype.map.call(mapBox.querySelectorAll("select"), function (s) {
      return Number(s.value);
    });
  }
  function resetPreview() {
    current.steps = null;
    btnSave.disabled = true;
    previewBox.textContent = "";
  }
  function fill(mode) {
    var t = TEMPLATES[mode];
    fPy.value = t.python;
    fAlgo.value = t.algo;
    fVar.value = t.variants;
    fIdx.value = detectIndexVars(t.python).join(", ");
    renderMap(guessMap(lines(t.algo), lines(t.python)));
  }
  fMode.addEventListener("change", function () {
    if (!current.id || confirm("Remplacer le code par l’exemple de ce type ?")) {
      fill(fMode.value);
      resetPreview();
    }
  });
  fGroup.addEventListener("change", function () {
    gRow.hidden = fGroup.value !== "__new";
  });
  [fPy, fAlgo].forEach(function (t) {
    t.addEventListener("change", function () {
      renderMap(guessMap(lines(fAlgo.value), lines(fPy.value)));
      fIdx.value = detectIndexVars(fPy.value).join(", ");
      resetPreview();
    });
  });
  btnGuess.addEventListener("click", function () {
    renderMap(guessMap(lines(fAlgo.value), lines(fPy.value)));
    resetPreview();
  });
  btnNew.addEventListener("click", function () {
    current = { id: "", steps: null, doc: null };
    fTitleFr.value = "";
    fTitleAr.value = "";
    fGroup.value = "tris";
    gRow.hidden = true;
    fMode.value = "sort";
    fZone.value = "";
    fDetail.checked = false;
    fill("sort");
    resetPreview();
    setStatus("");
  });

  // fills every field of the form from a normalised animation (see normalizeAnimJson)
  function loadIntoForm(f) {
    var group = f.group || (f.mode === "sort" ? "tris" : f.mode === "search" ? "recherche" : "tableaux");
    var known = GROUPS.some(function (g) {
      return g[0] === group;
    });
    fTitleFr.value = f.title_fr;
    fTitleAr.value = f.title_ar;
    fGroup.value = known ? group : "__new";
    gRow.hidden = known;
    fGroupFr.value = known ? "" : f.group_fr || group;
    fGroupAr.value = known ? "" : f.group_ar || "";
    fMode.value = f.mode;
    fPy.value = f.python;
    fAlgo.value = f.algo;
    fIdx.value = (f.index_vars.length ? f.index_vars : detectIndexVars(f.python)).join(", ");
    fZone.value = f.zone.join(", ");
    fVar.value = f.variantsText;
    fDetail.checked = f.detail;
    var al = lines(f.algo);
    renderMap(f.map && f.map.length === al.length ? f.map : guessMap(al, lines(f.python)));
    resetPreview();
  }
  btnImport.addEventListener("click", function () {
    fileIn.click();
  });
  fileIn.addEventListener("change", async function () {
    var file = fileIn.files && fileIn.files[0];
    if (!file) return;
    try {
      var raw = JSON.parse(await file.text());
      var many = Array.isArray(raw) && raw.length > 1;
      var f = normalizeAnimJson(raw);
      current = { id: "", steps: null, doc: null };
      loadIntoForm(f);
      setStatus("« " + (f.title_fr || file.name) + " » chargé depuis le fichier" + (many ? " (1re animation du fichier seulement)" : "") + " : vérifie, puis Générer l’aperçu.", "ok");
    } catch (e) {
      setStatus("Fichier JSON refusé : " + ((e && e.message) || e), "error");
    }
    fileIn.value = "";
  });
  btnExport.addEventListener("click", function () {
    var newGroup = fGroup.value === "__new";
    var out = {
      title_fr: fTitleFr.value.trim(),
      title_ar: fTitleAr.value.trim(),
      group: newGroup ? slug(fGroupFr.value) || "autres" : fGroup.value,
    };
    if (newGroup) {
      out.group_fr = fGroupFr.value.trim();
      out.group_ar = fGroupAr.value.trim();
    }
    out.mode = fMode.value;
    out.python = lines(fPy.value);
    out.algo = lines(fAlgo.value);
    out.map = readMap();
    out.index_vars = fIdx.value.split(/[ ,]+/).filter(Boolean);
    out.zone = fZone.value.split(/[ ,]+/).filter(Boolean);
    out.variants = fVar.value
      .split("\n")
      .map(function (x) {
        return x.trim();
      })
      .filter(Boolean);
    out.detail = fDetail.checked;
    var blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (fname() || "animation") + ".json";
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
    }, 1000);
  });

  function collect() {
    var mode = fMode.value;
    var name = fname();
    if (!name) throw new Error("Python : la première ligne doit être « def nom(T, n) : ».");
    var al = lines(fAlgo.value);
    var pl = lines(fPy.value);
    if (!/^\s*(Procédure|Fonction)\s+/.test(al[0] || "")) throw new Error("Algorithme : la première ligne doit commencer par Procédure ou Fonction.");
    var an = /^\s*(?:Procédure|Fonction)\s+([A-Za-z_][A-Za-z_0-9]*)/.exec(al[0]);
    if (!an || an[1] !== name) throw new Error("Le nom de la fonction doit être le même en Algorithme (« " + (an ? an[1] : "?") + " ») et en Python (« " + name + " »).");
    if (!fTitleFr.value.trim()) throw new Error("Donne un titre en français.");
    var variants = parseVariants(fVar.value, mode);
    if (!variants.length) throw new Error("Ajoute au moins un exemple.");
    var map = readMap();
    var group = fGroup.value === "__new" ? slug(fGroupFr.value) || "autres" : fGroup.value;
    var g = GROUPS.filter(function (x) {
      return x[0] === group;
    })[0];
    return {
      id: slug(name),
      fname: name,
      mode: mode,
      title_fr: fTitleFr.value.trim(),
      title_ar: fTitleAr.value.trim() || fTitleFr.value.trim(),
      group: group,
      group_fr: g ? g[1] : fGroupFr.value.trim() || group,
      group_ar: g ? g[2] : fGroupAr.value.trim() || fGroupFr.value.trim() || group,
      algo: al,
      python: pl,
      map: map,
      index_vars: fIdx.value.split(/[ ,]+/).filter(Boolean),
      zone: fZone.value.split(/[ ,]+/).filter(Boolean),
      detail: fDetail.checked,
      variantsText: fVar.value,
      variants: variants,
    };
  }

  btnGen.addEventListener("click", async function () {
    var doc;
    try {
      doc = collect();
    } catch (e) {
      return setStatus(e.message, "error");
    }
    btnGen.disabled = true;
    btnSave.disabled = true;
    try {
      var py = await getPython(setStatus);
      setStatus("Enregistrement des étapes…");
      var payload = {
        code: doc.python.join("\n"),
        fname: doc.fname,
        mode: doc.mode,
        variants: doc.variants.map(function (v) {
          return { input: v.input, target: v.target };
        }),
        algo_lines: doc.algo,
        py2algo: invertMap(doc.map, doc.algo, doc.python.length),
        index_vars: doc.index_vars,
        zone: doc.zone.length === 2 ? doc.zone : null,
        detail: doc.detail,
      };
      var res = JSON.parse(py.globals.get("record_json")(JSON.stringify(payload)));
      doc.variants = res;
      current.doc = doc;
      showPreview(doc);
      var total = res.reduce(function (a, v) {
        return a + v.steps.length;
      }, 0);
      setStatus("Aperçu prêt : " + res.length + " exemple(s), " + total + " étapes. Vérifie-le, puis Enregistrer.", "ok");
      btnSave.disabled = false;
    } catch (e) {
      var m = String((e && e.message) || e);
      var last = m.trim().split("\n").slice(-1)[0];
      setStatus("Erreur : " + last, "error");
      console.warn(e);
    }
    btnGen.disabled = false;
  });

  function plainLine(text, lang) {
    var frag = document.createDocumentFragment();
    var kw = lang === "python" ? /\b(def|if|elif|else|return|for|while|in|range|and|or|not|True|False|break)\b/g : /\b(Fonction|Procédure|DEBUT|FIN|Si|Alors|Sinon|FinSi|Pour|de|à|Faire|FinPour|Tant|que|FinTantQue|Retourner|Vrai|Faux|ET|OU|NON|div|mod)\b/g;
    var last = 0;
    var m;
    while ((m = kw.exec(text))) {
      if (m.index > last) frag.append(document.createTextNode(text.slice(last, m.index)));
      frag.append(el("span", "tk-kw", m[0]));
      last = m.index + m[0].length;
    }
    frag.append(document.createTextNode(text.slice(last)));
    return frag;
  }
  var codeLang = "algo";
  function showPreview(doc) {
    previewBox.textContent = "";
    var tmp = Object.assign({}, doc, { id: "apercu-" + doc.id });
    registerAnimations([tmp]);
    var holder = el("div", "an-preview-card");
    var opts = {
      el: el,
      codeLine: plainLine,
      lang: function () {
        return "fr";
      },
      codeLang: function () {
        return codeLang;
      },
      setCodeLang: function (l) {
        codeLang = l;
        holder.textContent = "";
        holder.append(makeAlgoViz(tmp.id, opts));
      },
    };
    holder.append(makeAlgoViz(tmp.id, opts));
    previewBox.append(holder);
  }

  btnSave.addEventListener("click", async function () {
    var doc = current.doc;
    if (!doc) return;
    var data = {
      title_fr: doc.title_fr,
      title_ar: doc.title_ar,
      group: doc.group,
      group_fr: doc.group_fr,
      group_ar: doc.group_ar,
      mode: doc.mode,
      fname: doc.fname,
      algo: doc.algo,
      python: doc.python,
      map: doc.map,
      index_vars: doc.index_vars,
      zone: doc.zone,
      detail: doc.detail,
      variantsText: doc.variantsText,
      variants: doc.variants,
      updatedAt: sdk.serverTimestamp(),
    };
    var builtins = ["tri-bulles", "tri-selection", "tri-insertion", "recherche-sequentielle", "recherche-dichotomique", "remplir-tableau"];
    if (builtins.indexOf(doc.id) >= 0) return setStatus("Cet identifiant est déjà une animation intégrée : change le nom de la fonction.", "error");
    btnSave.disabled = true;
    try {
      await sdk.setDoc(sdk.doc(db, "animations", doc.id), data);
      setStatus("Enregistré. Les élèves la verront au prochain chargement.", "ok");
      await loadList();
    } catch (e) {
      console.warn(e);
      setStatus("Impossible d’enregistrer (règles Firestore publiées ? compte admin ?).", "error");
    }
    btnSave.disabled = false;
  });

  var stored = [];
  async function loadList() {
    listBox.textContent = "";
    try {
      var snap = await sdk.getDocs(sdk.collection(db, "animations"));
      stored = snap.docs.map(function (d) {
        return Object.assign({ id: d.id }, d.data());
      });
    } catch (e) {
      listBox.append(el("p", "up-hint", "Impossible de lire la collection « animations » (règles Firestore à publier)."));
      return;
    }
    if (!stored.length) listBox.append(el("p", "up-hint", "Aucune animation ajoutée pour l’instant. Les 6 animations intégrées restent disponibles."));
    stored.forEach(function (d) {
      var row = el("div", "an-item");
      var t = el("div", "an-item-t");
      t.append(el("b", "", d.title_fr || d.id), el("small", "", d.id + " · " + (d.group_fr || d.group || "") + " · " + ((d.variants || []).length) + " exemple(s)"));
      var edit = el("button", "an-btn", "Modifier");
      edit.type = "button";
      edit.addEventListener("click", function () {
        current = { id: d.id, steps: null, doc: null };
        loadIntoForm(normalizeAnimJson(d));
        if (d.map && d.map.length) renderMap(d.map);
        setStatus("« " + (d.title_fr || d.id) + " » chargée : modifie puis Générer l’aperçu.");
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      var del = el("button", "an-btn is-danger", "Supprimer");
      del.type = "button";
      del.addEventListener("click", async function () {
        if (!confirm("Supprimer « " + (d.title_fr || d.id) + " » ?")) return;
        try {
          await sdk.deleteDoc(sdk.doc(db, "animations", d.id));
          await loadList();
        } catch (e) {
          setStatus("Impossible de supprimer.", "error");
        }
      });
      row.append(t, edit, del);
      listBox.append(row);
    });
  }

  fill("sort");
  return { reload: loadList };
}
