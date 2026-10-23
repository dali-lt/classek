/* Classek algorithm animations (used by chapters.js).
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
    title: { "tri-bulles": "Tri à bulles", "tri-selection": "Tri par sélection", "tri-insertion": "Tri par insertion", "recherche-sequentielle": "Recherche séquentielle", "recherche-dichotomique": "Recherche dichotomique", "remplir-tableau": "Remplir un tableau" },
    target: "Chercher x =",
    badge: "Animation",
    pick: "Choisir un algorithme",
    libTitle: "Visualiser",
    groups: { tris: "Tris", recherche: "Recherche", tableaux: "Tableaux" },
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
    title: { "tri-bulles": "Tri à bulles", "tri-selection": "Tri par sélection", "tri-insertion": "Tri par insertion", "recherche-sequentielle": "Recherche séquentielle", "recherche-dichotomique": "Recherche dichotomique", "remplir-tableau": "Remplir un tableau" },
    target: "نبحث عن x =",
    badge: "رسم متحرك",
    pick: "اختر خوارزمية",
    libTitle: "عرض مرئي",
    groups: { tris: "الترتيب", recherche: "البحث", tableaux: "الجداول" },
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
  "recherche-sequentielle": {
    algo: [
      "Fonction recherche_seq (T : Tab, n, x : Entier) : Booléen",
      "DEBUT",
      "   i ← 1",
      "   Tant que (i ≤ n) ET (T[i] ≠ x) Faire",
      "      i ← i + 1",
      "   FinTantQue",
      "   Retourner (i ≤ n)",
      "FIN",
    ],
    python: [
      "def recherche_seq(T, n, x):",
      "    i = 0",
      "    while i < n and T[i] != x:",
      "        i = i + 1",
      "    return i < n",
    ],
    map: [0, 0, 1, 2, 3, 2, 4, 4],
  },
  "recherche-dichotomique": {
    algo: [
      "Fonction recherche_dicho (T : Tab, n, x : Entier) : Booléen",
      "DEBUT",
      "   d ← 1",
      "   f ← n",
      "   trouve ← Faux",
      "   Tant que (d ≤ f) ET (NON trouve) Faire",
      "      m ← (d + f) div 2",
      "      Si T[m] = x Alors",
      "         trouve ← Vrai",
      "      Sinon",
      "         Si T[m] < x Alors",
      "            d ← m + 1",
      "         Sinon",
      "            f ← m - 1",
      "         FinSi",
      "      FinSi",
      "   FinTantQue",
      "   Retourner trouve",
      "FIN",
    ],
    python: [
      "def recherche_dicho(T, n, x):",
      "    d = 0",
      "    f = n - 1",
      "    trouve = False",
      "    while d <= f and not trouve:",
      "        m = (d + f) // 2",
      "        if T[m] == x:",
      "            trouve = True",
      "        elif T[m] < x:",
      "            d = m + 1",
      "        else:",
      "            f = m - 1",
      "    return trouve",
    ],
    map: [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 10, 11, 8, 6, 4, 12, 12],
  },
  "remplir-tableau": {
    algo: [
      "Procédure remplir (@T : Tab, n : Entier)",
      "DEBUT",
      "   Pour i de 1 à n Faire",
      "      Écrire (\"T[\", i, \"] = \")",
      "      Lire (T[i])",
      "   FinPour",
      "FIN",
    ],
    python: [
      "def remplir(T, n):",
      "    for i in range(n):",
      "        T[i] = int(input(\"T[\" + str(i) + \"] = \"))",
    ],
    map: [0, 0, 1, 2, 2, 1, 2],
  },
};

/* ---------------- step generators ----------------
   a step: { a: array (null = empty slot), cmp: [i, j], swap: [i, j], mark: index, done: [indexes], held: value|null,
             line: algo line index, msg: {fr, ar}, c: comparisons so far, s: swaps so far } */
function gen(kind, input, x) {
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
  var vals = input.slice();
  if (kind === "remplir-tableau") a = a.map(function () {
    return null;
  });
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
  } else if (kind === "tri-insertion") {
    done = [0];
    for (i = 1; i < n; i++) {
      var xv = a[i];
      a[i] = null;
      j = i - 1;
      push({ line: 3, held: xv, hole: i, msg: { fr: "i = " + (i + 1) + " : x ← T[" + (i + 1) + "] = " + xv + ". On lui cherche une place à gauche.", ar: "i = " + (i + 1) + " : x ← T[" + (i + 1) + "] = " + xv + ". نبحث له عن مكان على اليسار." } });
      while (j >= 0) {
        c++;
        var bigger = a[j] > xv;
        push({
          line: 7,
          held: xv,
          cmp: [j],
          msg: {
            fr: "Si T[" + (j + 1) + "] > x ? " + a[j] + " > " + xv + " : " + (bigger ? "oui, on le décale à droite." : "non."),
            ar: "هل T[" + (j + 1) + "] > x ؟ " + a[j] + " > " + xv + " : " + (bigger ? "نعم، نزحزحه لليمين." : "لا."),
          },
        });
        if (!bigger) {
          push({ line: 11, held: xv, msg: { fr: "place ← Vrai : x a trouvé sa place.", ar: "place ← Vrai : x وجد مكانه." } });
          break;
        }
        a[j + 1] = a[j];
        a[j] = null;
        s++;
        push({ line: 8, held: xv, msg: { fr: "T[" + (j + 2) + "] ← T[" + (j + 1) + "] : décalage, puis j ← j - 1.", ar: "T[" + (j + 2) + "] ← T[" + (j + 1) + "] : إزاحة، ثم j ← j - 1." } });
        j--;
      }
      a[j + 1] = xv;
      done = [];
      for (var k = 0; k <= i; k++) done.push(k);
      push({ line: 14, msg: { fr: "T[" + (j + 2) + "] ← x = " + xv + " : le début du tableau est trié.", ar: "T[" + (j + 2) + "] ← x = " + xv + " : بداية المصفوفة مرتبة." } });
    }
    push({ line: 16, msg: null });
  } else if (kind === "recherche-sequentielle") {
    var found = false;
    function tg(k) {
      var o = {};
      o[k] = "i";
      return o;
    }
    push({ line: 2, target: x, tags: tg(0), msg: { fr: "i ← 1 : on commence par la première case.", ar: "i ← 1 : نبدأ من الخانة الأولى." } });
    for (i = 0; i < n; i++) {
      c++;
      var eq = a[i] === x;
      push({
        line: 3,
        target: x,
        cmp: [i],
        eq: eq,
        tags: tg(i),
        msg: {
          fr: "T[" + (i + 1) + "] = " + a[i] + " " + (eq ? "= " : "≠ ") + x + (eq ? " : trouvé, on s'arrête." : " : pas encore, on continue."),
          ar: "T[" + (i + 1) + "] = " + a[i] + (eq ? " = " : " ≠ ") + x + (eq ? " : وجدناه، نتوقف." : " : ليس بعد، نواصل."),
        },
      });
      if (eq) {
        found = true;
        done = [i];
        push({ line: 6, target: x, tags: tg(i), msg: { fr: "Retourner Vrai : " + x + " est en T[" + (i + 1) + "], après " + (i + 1) + " comparaison(s).", ar: "نرجع Vrai : " + x + " موجود في T[" + (i + 1) + "] بعد " + (i + 1) + " مقارنة." } });
        break;
      }
      if (i < n - 1) push({ line: 4, target: x, tags: tg(i + 1), msg: { fr: "i ← i + 1.", ar: "i ← i + 1." } });
    }
    if (!found) push({ line: 6, target: x, msg: { fr: "i > n : tout le tableau est parcouru, " + x + " n'y est pas. Retourner Faux.", ar: "i > n : مررنا على كامل المصفوفة و" + x + " غير موجود. نرجع Faux." } });
  } else if (kind === "recherche-dichotomique") {
    var d = 0;
    var f = -1;
    var foundD = false;
    function marks(extra) {
      var o = {};
      function put(k, ch) {
        if (k < 0 || k > n - 1) return;
        o[k] = o[k] ? o[k] + "·" + ch : ch;
      }
      put(d, "d");
      if (extra != null) put(extra, "m");
      put(f, "f");
      return o;
    }
    function outside() {
      var o = [];
      for (var q = 0; q < n; q++) if (q < d || q > f) o.push(q);
      return o;
    }
    push({ line: 2, target: x, tags: marks(), msg: { fr: "d ← 1 : début de la zone de recherche.", ar: "d ← 1 : بداية منطقة البحث." } });
    d = 0;
    f = n - 1;
    push({ line: 3, target: x, tags: marks(), msg: { fr: "f ← n : fin de la zone de recherche.", ar: "f ← n : نهاية منطقة البحث." } });
    push({ line: 4, target: x, tags: marks(), msg: { fr: "trouve ← Faux.", ar: "trouve ← Faux." } });
    while (d <= f && !foundD) {
      push({ line: 5, target: x, tags: marks(), out: outside(), msg: { fr: "d ≤ f : il reste " + (f - d + 1) + " case(s) à examiner.", ar: "d ≤ f : بقيت " + (f - d + 1) + " خانة للفحص." } });
      var m = Math.floor((d + f) / 2);
      push({ line: 6, target: x, tags: marks(m), out: outside(), msg: { fr: "m ← (d + f) div 2 = " + (m + 1) + " : on regarde la case du milieu.", ar: "m ← (d + f) div 2 = " + (m + 1) + " : ننظر للخانة الوسطى." } });
      c++;
      var same = a[m] === x;
      push({
        line: 7,
        target: x,
        cmp: [m],
        eq: same,
        tags: marks(m),
        out: outside(),
        msg: { fr: "T[" + (m + 1) + "] = " + a[m] + " " + (same ? "= " : "≠ ") + x + (same ? " : trouvé !" : " : pas égal."), ar: "T[" + (m + 1) + "] = " + a[m] + (same ? " = " : " ≠ ") + x + (same ? " : وجدناه !" : " : غير متساويين.") },
      });
      if (same) {
        foundD = true;
        done = [m];
        push({ line: 8, target: x, tags: marks(m), out: outside(), msg: { fr: "trouve ← Vrai : " + x + " est en T[" + (m + 1) + "].", ar: "trouve ← Vrai : " + x + " موجود في T[" + (m + 1) + "]." } });
      } else {
        var less = a[m] < x;
        push({
          line: 10,
          target: x,
          cmp: [m],
          sign: less ? "<" : ">",
          tags: marks(m),
          out: outside(),
          msg: { fr: "T[" + (m + 1) + "] = " + a[m] + (less ? " < " : " > ") + x + " : " + (less ? "x est à droite, on garde la partie droite." : "x est à gauche, on garde la partie gauche."), ar: "T[" + (m + 1) + "] = " + a[m] + (less ? " < " : " > ") + x + " : " + (less ? "x على اليمين، نحتفظ بالجزء الأيمن." : "x على اليسار، نحتفظ بالجزء الأيسر.") },
        });
        if (less) {
          d = m + 1;
          push({ line: 11, target: x, tags: marks(), out: outside(), msg: { fr: "d ← m + 1 = " + (d + 1) + " : on élimine la moitié gauche.", ar: "d ← m + 1 = " + (d + 1) + " : نحذف النصف الأيسر." } });
        } else {
          f = m - 1;
          push({ line: 13, target: x, tags: marks(), out: outside(), msg: { fr: "f ← m - 1 = " + (f + 1) + " : on élimine la moitié droite.", ar: "f ← m - 1 = " + (f + 1) + " : نحذف النصف الأيمن." } });
        }
      }
    }
    push({
      line: 17,
      target: x,
      tags: {},
      out: foundD ? [] : outside(),
      msg: foundD ? { fr: "Retourner Vrai : " + x + " est trouvé en " + c + " comparaison(s) seulement.", ar: "نرجع Vrai : " + x + " موجود بعد " + c + " مقارنة فقط." } : { fr: "d > f : la zone est vide, " + x + " n'est pas dans le tableau. Retourner Faux.", ar: "d > f : المنطقة فارغة و" + x + " غير موجود. نرجع Faux." },
    });
  } else if (kind === "remplir-tableau") {
    for (i = 0; i < n; i++) {
      var only = {};
      only[i] = "i";
      push({ line: 2, tags: only, msg: { fr: "i = " + (i + 1) + " : on va remplir la case T[" + (i + 1) + "].", ar: "i = " + (i + 1) + " : سنملأ الخانة T[" + (i + 1) + "]." } });
      push({ line: 3, tags: only, msg: { fr: "Écrire : l'ordinateur affiche « T[" + (i + 1) + "] = » et attend une valeur.", ar: "Écrire : يعرض الحاسوب « T[" + (i + 1) + "] = » وينتظر قيمة." } });
      a[i] = vals[i];
      push({ line: 4, tags: only, msg: { fr: "Lire (T[" + (i + 1) + "]) : l'utilisateur tape " + vals[i] + ", la valeur est rangée dans la case.", ar: "Lire (T[" + (i + 1) + "]) : المستعمل كتب " + vals[i] + " والقيمة تتخزن في الخانة." } });
    }
    done = [];
    push({ line: 6, tags: {}, msg: { fr: "Le tableau est rempli : " + n + " cases, de T[1] à T[" + n + "].", ar: "المصفوفة ممتلئة : " + n + " خانات من T[1] إلى T[" + n + "]." } });
  }
  return steps;
}

// the library: groups shown in the picker, in this order
var LIB = [
  { key: "tris", kinds: ["tri-bulles", "tri-selection", "tri-insertion"] },
  { key: "recherche", kinds: ["recherche-sequentielle", "recherche-dichotomique"] },
  { key: "tableaux", kinds: ["remplir-tableau"] },
];

function randomArray(n) {
  var pool = [];
  for (var i = 1; i <= 12; i++) pool.push(i);
  var out = [];
  while (out.length < n) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  return out;
}

/* ---------------- animation definitions ----------------
   Every animation is described by one record, built-in or stored by the admin:
     META[kind] = { mode: "sort" | "search" | "fill" | "other", size, start: [...], target, markLabel,
                    run(input, target) -> steps,  next(state) -> { input, target } }
   A stored animation (registerAnimations) carries its own recorded steps ("variants"), nothing is computed in the browser. */
var META = {};
function builtinMeta(kind, mode, size, start, target, extra) {
  META[kind] = Object.assign(
    {
      mode: mode,
      size: size,
      start: start,
      target: target,
      run: function (input, x) {
        return gen(kind, input, x);
      },
      next: function () {
        var input = randomArray(size);
        if (extra && extra.sorted)
          input.sort(function (p, q) {
            return p - q;
          });
        var t = target;
        if (mode === "search") {
          var miss = [];
          for (var mv = 1; mv <= 12; mv++) if (input.indexOf(mv) < 0) miss.push(mv);
          var wantMiss = Math.random() < 0.3 && miss.length;
          t = wantMiss ? miss[Math.floor(Math.random() * miss.length)] : input[Math.floor(Math.random() * input.length)];
        }
        return { input: input, target: t };
      },
    },
    extra || {}
  );
}
var UNSORTED = [5, 3, 8, 1, 9, 2];
var SEARCHABLE = [4, 9, 2, 7, 5, 1];
builtinMeta("tri-bulles", "sort", 6, UNSORTED, 0);
builtinMeta("tri-selection", "sort", 6, UNSORTED, 0, { markLabel: "im" });
builtinMeta("tri-insertion", "sort", 6, UNSORTED, 0);
builtinMeta("recherche-sequentielle", "search", 6, SEARCHABLE, 7);
builtinMeta("recherche-dichotomique", "search", 7, [2, 5, 8, 11, 14, 17, 20], 14, { sorted: true });
builtinMeta("remplir-tableau", "fill", 6, SEARCHABLE, 0);

function cleanSteps(list) {
  return (list || []).map(function (st) {
    var o = Object.assign({}, st);
    o.a = (st.a || []).slice();
    o.done = (st.done || []).slice();
    o.c = st.c || 0;
    o.s = st.s || 0;
    if (!o.msg) o.msg = null;
    return o;
  });
}
// the animations the admin stored (Firestore "animations"): they join the library, the picker and the Run buttons
export function registerAnimations(list) {
  (list || []).forEach(function (d) {
    var id = String(d.id || "").trim();
    var vars = (d.variants || []).filter(function (v) {
      return v && v.input && v.steps && v.steps.length;
    });
    if (!id || !vars.length || !d.algo || !d.python) return;
    if (CODE[id] && !CODE[id].custom) return; // never replace a built-in one
    CODE[id] = { algo: d.algo.slice(), python: d.python.slice(), map: (d.map || []).slice(), custom: true };
    UI.fr.title[id] = d.title_fr || id;
    UI.ar.title[id] = d.title_ar || d.title_fr || id;
    var prepared = vars.map(function (v) {
      return { input: v.input.slice(), target: v.target == null ? null : v.target, steps: cleanSteps(v.steps) };
    });
    var at = 0;
    META[id] = {
      mode: d.mode || "other",
      size: prepared[0].input.length,
      start: prepared[0].input,
      target: prepared[0].target,
      run: function (input) {
        var hit = prepared.filter(function (v) {
          return v.input.join(",") === input.join(",");
        })[0];
        return (hit || prepared[0]).steps;
      },
      next: function () {
        at = (at + 1) % prepared.length;
        return { input: prepared[at].input.slice(), target: prepared[at].target };
      },
      variants: prepared.length,
    };
    var gk = d.group || "autres";
    LIB.forEach(function (g) {
      var i = g.kinds.indexOf(id);
      if (i >= 0) g.kinds.splice(i, 1);
    });
    var grp = LIB.filter(function (g) {
      return g.key === gk;
    })[0];
    if (!grp) {
      grp = { key: gk, label: { fr: d.group_fr || gk, ar: d.group_ar || d.group_fr || gk }, kinds: [] };
      LIB.push(grp);
    }
    grp.kinds.push(id);
  });
}
// a built-in animation as a stored record (what the admin page saves): used to check that the generic player reproduces it
export function exportAnimation(kind, inputs) {
  var m = META[kind];
  var c = CODE[kind];
  if (!m || !c) return null;
  var list = (inputs && inputs.length ? inputs : [{ input: m.start, target: m.target }]).map(function (v) {
    return { input: v.input.slice(), target: v.target == null ? null : v.target, steps: m.run(v.input.slice(), v.target) };
  });
  return { id: kind, mode: m.mode, algo: c.algo, python: c.python, map: c.map, variants: list };
}

export function makeAlgoViz(kind, opts) {
  var el = opts.el;
  var code = CODE[kind];
  var box = el("div", "av");
  if (!code) {
    box.textContent = "viz: " + kind;
    return box;
  }
  var meta = META[kind];
  var isSearch = meta.mode === "search";
  var isSort = meta.mode === "sort";
  var size = meta.size;
  var input = meta.start.slice();
  var target = meta.target;
  var steps = meta.run(input, target);
  var idx = 0;
  var timer = null;
  var speed = 900;

  function u(key) {
    return UI[opts.lang() === "ar" ? "ar" : "fr"][key];
  }
  function titleOf(k) {
    return UI[opts.lang() === "ar" ? "ar" : "fr"].title[k] || k;
  }

  function buildPicker() {
    var wrap = el("div", "av-pick");
    var btn = el("button", "av-pick-b");
    btn.type = "button";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-label", u("pick"));
    btn.append(el("span", "", titleOf(kind)), el("i", "av-pick-i", "▾"));
    var menu = el("div", "av-menu");
    menu.hidden = true;
    menu.setAttribute("role", "listbox");
    LIB.forEach(function (g) {
      menu.append(el("div", "av-menu-g", g.label ? g.label[opts.lang() === "ar" ? "ar" : "fr"] : u("groups")[g.key]));
      g.kinds.forEach(function (k) {
        var it = el("button", "av-menu-it" + (k === kind ? " is-on" : ""));
        it.type = "button";
        it.setAttribute("role", "option");
        it.setAttribute("aria-selected", k === kind ? "true" : "false");
        it.append(el("span", "av-menu-d"), el("span", "av-menu-t", titleOf(k)), el("small", "", u("badge")));
        it.addEventListener("click", function () {
          menu.hidden = true;
          if (k !== kind) opts.onPick(k);
        });
        menu.append(it);
      });
    });
    function closeMenu(e) {
      if (e && (wrap.contains(e.target) || menu.contains(e.target))) return;
      menu.hidden = true;
      document.removeEventListener("mousedown", closeMenu);
    }
    btn.addEventListener("click", function () {
      if (!menu.hidden) return closeMenu();
      var r = btn.getBoundingClientRect();
      menu.style.top = r.bottom + 8 + "px";
      menu.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 348)) + "px";
      menu.style.maxHeight = Math.max(160, window.innerHeight - r.bottom - 24) + "px";
      menu.hidden = false;
      document.addEventListener("mousedown", closeMenu);
    });
    wrap.append(btn, menu);
    return wrap;
  }
  var counters = el("span", "av-counters");
  var lhead = el("div", "av-lhead");
  lhead.append(opts.onPick ? buildPicker() : el("span", "test-chip", titleOf(kind)));
  var split = el("div", "av-split");
  var left = el("div", "av-left");
  var right = el("div", "av-right");
  var rhead = el("div", "av-rhead");
  rhead.append(counters);
  right.append(rhead);

  var stage = el("div", "av-stage");
  var targetBox = el("span", "av-target");
  targetBox.hidden = true;
  right.append(targetBox, stage);
  var msg = el("p", "av-msg");
  right.append(msg);

  var bar = el("div", "av-ctl");
  function btn(cls, label, svg) {
    var b = el("button", "avz-btn " + cls);
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
  var row = el("div", "avz-row");
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
  lhead.append(tabs);
  codeWrap.append(win);
  left.append(lhead, codeWrap);
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
      sl.append(el("i"), el("em"));
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
    w.append(c, dn);
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
      if (st.done.indexOf(k) >= 0) cls += isSort ? " is-sorted" : " is-sorted is-found";
      if (st.out && st.out.indexOf(k) >= 0) cls += " is-out";
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
    // small labels under the slots: i, d / m / f, the current minimum
    var tg = Object.assign({}, st.tags || {});
    if (meta.markLabel && st.mark != null) tg[st.mark] = meta.markLabel;
    var slotEls = field.querySelectorAll(".av-slot");
    Array.prototype.forEach.call(slotEls, function (sl, k) {
      var em = sl.querySelector("em");
      em.textContent = tg[k] || "";
      em.classList.toggle("is-on", !!tg[k]);
    });
    targetBox.hidden = st.target == null;
    if (st.target != null) targetBox.textContent = u("target") + " " + st.target;
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
    if (st.target != null && st.cmp && st.cmp.length === 1 && st.held == null) {
      var one = cards[st.a[st.cmp[0]]];
      var sign = st.sign || (st.eq ? "=" : "≠");
      if (one) {
        var b1 = el("span", "av-pair is-above" + (st.eq ? " is-hit" : ""));
        b1.textContent = sign;
        one.append(b1);
      }
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
    var langKey = opts.lang() === "ar" ? "ar" : "fr";
    var text = idx === 0 ? u("start") : last && isSort ? u("done") : st.msg ? st.msg[langKey] : "";
    msg.textContent = text;
    msg.classList.toggle("is-done", last);
    counters.textContent = u("step") + " " + idx + "/" + (steps.length - 1) + (isSort || isSearch ? " · " + u("cmp") + " " + st.c : "") + (isSort ? " · " + u("swp") + " " + st.s : "");
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
    var nx = meta.next();
    input = nx.input;
    target = nx.target;
    steps = meta.run(input, target);
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
  var holder = el("div", "av-holder");
  var close = el("button", "av-modal-x");
  close.type = "button";
  close.setAttribute("aria-label", "×");
  close.innerHTML = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>';
  var prevOverflow = document.body.style.overflow;
  function shut() {
    ov.remove();
    document.body.style.overflow = prevOverflow;
    document.removeEventListener("keydown", onKey);
  }
  function onKey(e) {
    if (e.key === "Escape") shut();
  }
  function show(k) {
    var o = Object.assign({}, opts, { onPick: show });
    holder.textContent = "";
    holder.append(makeAlgoViz(k, o));
  }
  close.addEventListener("click", shut);
  ov.addEventListener("mousedown", function (e) {
    if (e.target === ov) shut();
  });
  document.addEventListener("keydown", onKey);
  show(kind || LIB[0].kinds[0]);
  card.append(holder);
  card.append(close);
  ov.append(card);
  document.body.append(ov);
  document.body.style.overflow = "hidden";
  close.focus();
}
// the library: the same box, opened from the round button, on the first algorithm
export function openAlgoLibrary(opts, kind) {
  openAlgoViz(kind || LIB[0].kinds[0], opts);
}
export function libraryLabel(lang) {
  return UI[lang === "ar" ? "ar" : "fr"].libTitle;
}
export function makeAlgoLauncher(kind, opts) {
  var el = opts.el;
  var lang = opts.lang() === "ar" ? "ar" : "fr";
  var row = el("div", "av-launch");
  var txt = el("div", "av-launch-t");
  txt.append(el("b", "", algoTitle(kind, lang)), el("small", "", lang === "ar" ? "رسم متحرك خطوة بخطوة" : "Animation pas à pas"));
  var b = el("button", "pc-btn av-launch-btn");
  b.type = "button";
  b.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg>';
  b.append(el("span", "", lang === "ar" ? "فتح الرسم" : "Ouvrir l’animation"));
  b.addEventListener("click", function () {
    openAlgoViz(kind, opts);
  });
  row.append(txt, b);
  return row;
}

// which animation (if any) a block of code is: its first line must be the signature of one of the algorithms
export function kindForCode(text) {
  var first = String(text || "")
    .split("\n")
    .map(function (l) {
      return l.trim();
    })
    .filter(Boolean)[0];
  if (!first) return "";
  var found = "";
  Object.keys(CODE).forEach(function (k) {
    var a = /^(?:Procédure|Fonction)\s+([A-Za-z_0-9]+)/.exec(CODE[k].algo[0]);
    var p = /^def\s+([A-Za-z_0-9]+)/.exec(CODE[k].python[0]);
    var m = /^(?:Procédure|Fonction|def)\s+([A-Za-z_0-9]+)/.exec(first);
    if (m && ((a && a[1] === m[1]) || (p && p[1] === m[1]))) found = k;
  });
  return found;
}
export function hasAlgoViz(kind) {
  return !!CODE[kind];
}
