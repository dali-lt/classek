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
      "Procédure TriBulles (@T : Tab, N : entier)",
      "DEBUT",
      "  Répéter",
      "    echange ← Faux",
      "    Pour i de 1 à N-1 Faire",
      "      Si T[i] > T[i+1] Alors",
      "        aux ← T[i]",
      "        T[i] ← T[i+1]",
      "        T[i+1] ← aux",
      "        echange ← Vrai",
      "      FinSi",
      "    FinPour",
      "  Jusqu'à (echange = Faux)",
      "FIN",
    ],
    python: [
      "def tri_bulles(T, n):",
      "    while True:",
      "        echange = False",
      "        for i in range(n - 1):",
      "            if T[i] > T[i + 1]:",
      "                T[i], T[i + 1] = T[i + 1], T[i]",
      "                echange = True",
      "        if not echange:",
      "            break",
    ],
    // algo line -> python line
    map: [0, 0, 1, 2, 3, 4, 5, 5, 5, 6, 4, 3, 7, 8],
  },
  "tri-selection": {
    algo: [
      "Procédure TriSelection (@T : Tab, N : entier)",
      "DEBUT",
      "  Pour i de 1 à N-1 Faire",
      "    min ← i",
      "    Pour j de i+1 à N Faire",
      "      Si T[j] < T[min] Alors",
      "        min ← j",
      "      FinSi",
      "    FinPour",
      "    Si min ≠ i Alors",
      "      aux ← T[i]",
      "      T[i] ← T[min]",
      "      T[min] ← aux",
      "    FinSi",
      "  FinPour",
      "FIN",
    ],
    python: [
      "def tri_selection(T, n):",
      "    for i in range(n - 1):",
      "        mini = i",
      "        for j in range(i + 1, n):",
      "            if T[j] < T[mini]:",
      "                mini = j",
      "        if mini != i:",
      "            T[i], T[mini] = T[mini], T[i]",
    ],
    map: [0, 0, 1, 2, 3, 4, 5, 4, 3, 6, 7, 7, 7, 6, 1, 7],
  },
  "tri-insertion": {
    algo: [
      "Procédure TriInsertion (@T : Tab, N : entier)",
      "DEBUT",
      "  Pour i de 2 à N Faire",
      "    x ← T[i]",
      "    j ← i - 1",
      "    Tant que (j ≥ 1) ET (T[j] > x) Faire",
      "      T[j+1] ← T[j]",
      "      j ← j - 1",
      "    FinTantQue",
      "    T[j+1] ← x",
      "  FinPour",
      "FIN",
    ],
    python: [
      "def tri_insertion(T, n):",
      "    for i in range(1, n):",
      "        x = T[i]",
      "        j = i - 1",
      "        while j >= 0 and T[j] > x:",
      "            T[j + 1] = T[j]",
      "            j = j - 1",
      "        T[j + 1] = x",
    ],
    map: [0, 0, 1, 2, 3, 4, 5, 6, 4, 7, 1, 7],
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
    var pass = 0;
    var swapped;
    do {
      swapped = false;
      push({ line: 3, msg: { fr: "Nouveau passage : echange ← Faux.", ar: "دورة جديدة: echange ← Faux." } });
      for (i = 0; i < n - 1; i++) {
        c++;
        var gt = a[i] > a[i + 1];
        push({
          line: 5,
          cmp: [i, i + 1],
          msg: {
            fr: "Compare T[" + (i + 1) + "] = " + a[i] + " et T[" + (i + 2) + "] = " + a[i + 1] + " : " + (gt ? a[i] + " > " + a[i + 1] + ", il faut échanger." : "dans le bon ordre."),
            ar: "نقارن T[" + (i + 1) + "] = " + a[i] + " مع T[" + (i + 2) + "] = " + a[i + 1] + " : " + (gt ? "نبدّل لأن " + a[i] + " > " + a[i + 1] : "الترتيب صحيح."),
          },
        });
        if (gt) {
          var tmp = a[i];
          a[i] = a[i + 1];
          a[i + 1] = tmp;
          s++;
          swapped = true;
          push({
            line: 6,
            swap: [i, i + 1],
            msg: { fr: "Échange : " + a[i + 1] + " passe à droite, echange ← Vrai.", ar: "تبديل: " + a[i + 1] + " ينتقل لليمين، echange ← Vrai." },
          });
        }
      }
      done.push(n - 1 - pass);
      pass++;
      push({
        line: 12,
        msg: {
          fr: "Fin du passage " + pass + " : le plus grand reste est à sa place. " + (swapped ? "echange = Vrai, on recommence." : "echange = Faux, c'est fini."),
          ar: "نهاية الدورة " + pass + " : أكبر عنصر بقي أخذ مكانه. " + (swapped ? "echange = Vrai، نعيد." : "echange = Faux، انتهى."),
        },
      });
    } while (swapped && pass < n);
    done = [];
    for (i = 0; i < n; i++) done.push(i);
    push({ line: 13, msg: null });
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
            fr: "Compare T[" + (j + 1) + "] = " + a[j] + " au minimum " + a[mn] + " : " + (lt ? "plus petit, nouveau minimum." : "pas plus petit."),
            ar: "نقارن T[" + (j + 1) + "] = " + a[j] + " مع الأصغر " + a[mn] + " : " + (lt ? "أصغر، الأصغر الجديد." : "ليس أصغر."),
          },
        });
        if (lt) {
          mn = j;
          push({ line: 6, mark: mn, msg: { fr: "min ← " + (j + 1) + ".", ar: "min ← " + (j + 1) + "." } });
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
      push({ line: 3, held: x, hole: i, msg: { fr: "i = " + (i + 1) + " : on prend x = " + x + " et on lui cherche une place à gauche.", ar: "i = " + (i + 1) + " : نأخذ x = " + x + " ونبحث له عن مكان على اليسار." } });
      while (true) {
        if (j < 0) break;
        c++;
        var bigger = a[j] > x;
        push({
          line: 5,
          held: x,
          cmp: [j],
          msg: {
            fr: "Compare T[" + (j + 1) + "] = " + a[j] + " avec x = " + x + " : " + (bigger ? a[j] + " > " + x + ", on le décale à droite." : "pas plus grand, on s'arrête."),
            ar: "نقارن T[" + (j + 1) + "] = " + a[j] + " مع x = " + x + " : " + (bigger ? "أكبر، نزحزحه لليمين." : "ليس أكبر، نتوقف."),
          },
        });
        if (!bigger) break;
        a[j + 1] = a[j];
        a[j] = null;
        s++;
        push({ line: 6, held: x, msg: { fr: "T[" + (j + 2) + "] ← T[" + (j + 1) + "] : décalage.", ar: "T[" + (j + 2) + "] ← T[" + (j + 1) + "] : إزاحة." } });
        j--;
      }
      a[j + 1] = x;
      done = [];
      for (var k = 0; k <= i; k++) done.push(k);
      push({ line: 9, msg: { fr: "T[" + (j + 2) + "] ← x = " + x + " : le début du tableau est trié.", ar: "T[" + (j + 2) + "] ← x = " + x + " : بداية المصفوفة مرتبة." } });
    }
    push({ line: 11, msg: null });
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

  var stage = el("div", "av-stage");
  box.append(stage);
  var heldBox = el("div", "av-held");
  var msg = el("p", "av-msg");
  if (kind === "tri-insertion") box.append(heldBox);
  box.append(msg);

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
  var sel = el("select", "av-speed");
  sel.setAttribute("aria-label", u("speed"));
  [["slow", 1500], ["normal", 900], ["fast", 380]].forEach(function (o) {
    var op = el("option", "", u(o[0]));
    op.value = String(o[1]);
    if (o[1] === speed) op.selected = true;
    sel.append(op);
  });
  sel.addEventListener("change", function () {
    speed = Number(sel.value);
    if (timer) {
      stop();
      play();
    }
  });
  bar.append(bReset, bPrev, bPlay, bNext, sel, bShuf);
  box.append(bar);

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
  codeWrap.append(tabs, pre);
  box.append(codeWrap);

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
  function paintStage() {
    off = paintedLang === "python" ? 0 : 1;
    var st = steps[idx];
    var max = Math.max.apply(null, input);
    stage.textContent = "";
    st.a.forEach(function (v, k) {
      var col = el("div", "av-col");
      var cls = "av-bar";
      if (v == null) cls += " is-hole";
      if (st.done.indexOf(k) >= 0) cls += " is-sorted";
      if (st.mark === k) cls += " is-mark";
      if (st.cmp && st.cmp.indexOf(k) >= 0) cls += " is-cmp";
      if (st.swap && st.swap.indexOf(k) >= 0) cls += " is-swap";
      var b = el("div", cls);
      b.style.height = v == null ? "100%" : Math.max(14, (v / max) * 100) + "%";
      if (v != null) b.append(el("b", "", String(v)));
      col.append(b, el("small", "", String(k + off)));
      stage.append(col);
    });
    heldBox.textContent = "";
    if (st.held != null) {
      heldBox.append(el("span", "av-held-lbl", "x ="), el("span", "av-held-v", String(st.held)));
    }
    heldBox.classList.toggle("is-on", st.held != null);
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
    go(0);
  });

  box.setAttribute("lang", "fr");
  box.setAttribute("dir", "ltr");
  paintCode();
  return box;
}
