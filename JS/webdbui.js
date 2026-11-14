/* The "Base de données" panel of the code window: a small phpMyAdmin (tables, rows, structure, SQL, relations diagram).
   It works on an engine from JS/webdb.js. Everything the student wrote is put in the page with textContent, never as markup. */
import { friendly } from "./webdb.js?v=3";

var STR = {
  fr: {
    title: "Base de données",
    toggle: "Base de données",
    sideToggle: "Afficher / masquer la liste des tables",
    close: "Fermer",
    tables: "Tables",
    newTable: "Nouvelle table",
    importSql: "Importer .sql",
    exportSql: "Exporter .sql",
    browse: "Parcourir",
    structure: "Structure",
    sql: "SQL",
    designer: "Concepteur",
    empty: "Aucune table. Crée une table, importe un fichier .sql ou écris du SQL.",
    rows: "lignes",
    row: "ligne",
    insert: "Insérer",
    unique: "UNIQUE",
    uniqueSub: "pas de doublon (ex. nom, mail)",
    nulSub: "peut rester vide",
    pkSub: "identifie chaque ligne",
    aiSub: "numéro automatique 1, 2, 3… (INT + clé primaire)",
    secTable: "Table",
    secTableSub: "Le nom de la table",
    secCols: "Colonnes",
    secColsSub: "Une boîte par colonne : nom, type et options",
    colN: "Colonne",
    removeCol: "Retirer cette colonne",
    fkLabel: "Clé étrangère",
    ioTitle: "Fichier .sql",
    del: "Supprimer",
    edit: "Modifier",
    save: "Enregistrer",
    editRow: "Modifier la ligne",
    editCol: "Modifier la colonne",
    newCol: "Nouvelle colonne",
    lockedMsg: "Utilisée par {t} : le nom, le type et la clé primaire sont verrouillés (le reste se modifie).",
    lockedDel: "Cette colonne est utilisée par une autre table : on ne peut pas la supprimer.",
    aiHelp: "A_I = AUTO_INCREMENT : le numéro se met tout seul (1, 2, 3…) à chaque nouvelle ligne, il n’y a pas à le saisir. Il faut une clé primaire de type INT.",
    actions: "",
    delSure: "Confirmer ?",
    name: "Nom",
    type: "Type",
    nul: "NULL",
    pk: "PK",
    ai: "A_I",
    fk: "Clé étrangère →",
    none: "—",
    addCol: "+ Colonne",
    create: "Créer la table",
    cancel: "Annuler",
    tName: "Nom de la table",
    run: "Exécuter",
    sqlHint: "Écris une requête SQL (SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, ALTER TABLE…).",
    done: "Requête exécutée.",
    affected: "ligne(s) modifiée(s)",
    relations: "Relations",
    noRel: "Aucune relation.",
    noRows: "Aucune ligne.",
    note: "La base est enregistrée sur ton compte. Les images, vidéos et sons restent sur cet appareil.",
    loading: "Chargement du moteur SQL…",
    fail: "Le moteur SQL n’a pas pu démarrer.",
    needName: "Donne un nom à la table.",
    needCol: "Ajoute au moins une colonne avec un nom.",
    page: "Page",
    colName: "colonne",
    imported: "Fichier importé.",
    emptyDb: "(vide)",
  },
  ar: {
    title: "قاعدة البيانات",
    toggle: "قاعدة البيانات",
    sideToggle: "إظهار / إخفاء قائمة الجداول",
    close: "إغلاق",
    tables: "الجداول",
    newTable: "جدول جديد",
    importSql: "استيراد .sql",
    exportSql: "تصدير .sql",
    browse: "استعراض",
    structure: "البنية",
    sql: "SQL",
    designer: "المصمّم",
    empty: "لا توجد جداول. أنشئ جدولا أو استورد ملف .sql أو اكتب SQL.",
    rows: "أسطر",
    row: "سطر",
    insert: "إدراج",
    unique: "UNIQUE",
    uniqueSub: "بلا تكرار (مثال: الاسم، الـmail)",
    nulSub: "يمكن أن يبقى فارغا",
    pkSub: "يعرّف كل سطر",
    aiSub: "رقم تلقائي 1، 2، 3… (INT + مفتاح أساسي)",
    secTable: "الجدول",
    secTableSub: "اسم الجدول",
    secCols: "الأعمدة",
    secColsSub: "صندوق لكل عمود : الاسم، النوع و الخيارات",
    colN: "عمود",
    removeCol: "إزالة هذا العمود",
    fkLabel: "مفتاح أجنبي",
    ioTitle: "ملف .sql",
    del: "حذف",
    edit: "تعديل",
    save: "حفظ",
    editRow: "تعديل السطر",
    editCol: "تعديل العمود",
    newCol: "عمود جديد",
    lockedMsg: "هذا العمود يستعمله {t} : الاسم والنوع والمفتاح الأساسي مقفولة (الباقي يتعدّل).",
    lockedDel: "هذا العمود يستعمله جدول آخر : لا يمكن حذفه.",
    aiHelp: "A_I = AUTO_INCREMENT : الرقم يزيد وحده (1، 2، 3…) مع كل سطر جديد، ما تكتبوش. يلزم مفتاح أساسي من نوع INT.",
    actions: "",
    delSure: "تأكيد؟",
    name: "الاسم",
    type: "النوع",
    nul: "NULL",
    pk: "PK",
    ai: "A_I",
    fk: "مفتاح أجنبي ←",
    none: "—",
    addCol: "+ عمود",
    create: "إنشاء الجدول",
    cancel: "إلغاء",
    tName: "اسم الجدول",
    run: "تنفيذ",
    sqlHint: "اكتب استعلام SQL (SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, ALTER TABLE…).",
    done: "تم تنفيذ الاستعلام.",
    affected: "سطر متأثر",
    relations: "العلاقات",
    noRel: "لا توجد علاقات.",
    noRows: "لا توجد أسطر.",
    note: "القاعدة محفوظة في حسابك. الصور والفيديوهات والأصوات تبقى على هذا الجهاز.",
    loading: "جاري تحميل محرك SQL…",
    fail: "تعذّر تشغيل محرك SQL.",
    needName: "أعط اسما للجدول.",
    needCol: "أضف عمودا واحدا على الأقل بإسم.",
    page: "صفحة",
    colName: "عمود",
    imported: "تم استيراد الملف.",
    emptyDb: "(فارغة)",
  },
};

// [value, what the student reads]
var TYPES = [
  ["INT", "INT · entier"],
  ["CHAR(1)", "CHAR(1) · caractère"],
  ["CHAR(3)", "CHAR(3) · chaîne de 3"],
  ["CHAR(5)", "CHAR(5) · chaîne de 5"],
  ["VARCHAR(50)", "VARCHAR(50) · chaîne"],
  ["VARCHAR(100)", "VARCHAR(100) · chaîne"],
  ["VARCHAR(200)", "VARCHAR(200) · chaîne"],
  ["TEXT", "TEXT · texte long"],
  ["FLOAT", "FLOAT · réel"],
  ["DOUBLE", "DOUBLE · réel"],
  ["DATE", "DATE"],
  ["DATETIME", "DATETIME"],
  ["TINYINT(1)", "TINYINT(1) · oui/non"],
];
var ICO = {
  key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3 20 3M16 7l3 3"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.3 4.6"/><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.5-1.5"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 10h18M9 10v10"/>',
  side: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  up: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
  down: '<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
};
function icoHtml(name, size) {
  return '<svg viewBox="0 0 24 24" width="' + (size || 15) + '" height="' + (size || 15) + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICO[name] + "</svg>";
}
function ico(name, cls, size) {
  var n = h("span", "dbp-ico " + (cls || ""));
  n.innerHTML = icoHtml(name, size); // static, trusted SVG
  return n;
}

// a list of the site (the browser's own list cannot be styled): { el, get(), set(v) }
var openDd = null;
function dropdown(items, value, onChange, lead) {
  var cur = value;
  var wrap = h("div", "dbp-dd");
  var b = h("button", "dbp-dd-b");
  b.type = "button";
  b.setAttribute("aria-haspopup", "listbox");
  b.setAttribute("aria-expanded", "false");
  var lab = h("span", "dbp-dd-l");
  b.append(lead ? lead : document.createTextNode(""), lab);
  var chev = h("span", "dbp-dd-c");
  chev.innerHTML = icoHtml("chev", 14); // static, trusted SVG
  b.append(chev);
  var list = h("ul", "dbp-dd-list");
  list.setAttribute("role", "listbox");
  list.hidden = true;
  var opts = [];
  var act = -1;
  items.forEach(function (it, i) {
    var li = h("li", "dbp-dd-o", it[1]);
    li.setAttribute("role", "option");
    li.addEventListener("pointerdown", function (e) {
      e.preventDefault();
    });
    li.addEventListener("click", function () {
      pick(i);
    });
    opts.push(li);
    list.append(li);
  });
  function paint() {
    var i = items.findIndex(function (x) {
      return x[0] === cur;
    });
    lab.textContent = i >= 0 ? items[i][1] : "";
    opts.forEach(function (o, k) {
      o.setAttribute("aria-selected", k === i ? "true" : "false");
      o.classList.toggle("is-act", k === act);
    });
  }
  function pick(i) {
    cur = items[i][0];
    paint();
    close();
    b.focus();
    if (onChange) onChange(cur);
  }
  function place() {
    var r = b.getBoundingClientRect();
    list.style.minWidth = r.width + "px";
    var below = window.innerHeight - r.bottom;
    var maxH = Math.max(120, Math.min(260, Math.max(below, r.top) - 12));
    list.style.maxHeight = maxH + "px";
    list.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 8 - Math.max(r.width, 200))) + "px";
    if (below >= Math.min(maxH, 180) || below >= r.top) {
      list.style.top = r.bottom + 4 + "px";
      list.style.bottom = "auto";
    } else {
      list.style.bottom = window.innerHeight - r.top + 4 + "px";
      list.style.top = "auto";
    }
  }
  function onDoc(e) {
    if (!wrap.contains(e.target) && !list.contains(e.target)) close();
  }
  function onScroll(e) {
    if (!list.contains(e.target)) close();
  }
  function open() {
    if (openDd && openDd !== close) openDd();
    list.hidden = false;
    b.setAttribute("aria-expanded", "true");
    document.body.append(list); // out of the clipped panel
    list.classList.add("dbp-dd-float");
    act = items.findIndex(function (x) {
      return x[0] === cur;
    });
    paint();
    place();
    var a = opts[act];
    if (a && a.scrollIntoView) a.scrollIntoView({ block: "nearest" });
    openDd = close;
    document.addEventListener("pointerdown", onDoc, true);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", close);
  }
  function close() {
    if (list.hidden) return;
    list.hidden = true;
    b.setAttribute("aria-expanded", "false");
    wrap.append(list);
    list.classList.remove("dbp-dd-float");
    if (openDd === close) openDd = null;
    document.removeEventListener("pointerdown", onDoc, true);
    window.removeEventListener("scroll", onScroll, true);
    window.removeEventListener("resize", close);
  }
  b.addEventListener("click", function () {
    if (list.hidden) open();
    else close();
  });
  b.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !list.hidden) {
      e.stopPropagation();
      close();
      return;
    }
    var k = e.key;
    if (k !== "ArrowDown" && k !== "ArrowUp" && k !== "Enter" && k !== " ") return;
    e.preventDefault();
    if (list.hidden) return open();
    if (k === "Enter" || k === " ") return act >= 0 ? pick(act) : close();
    act = Math.max(0, Math.min(items.length - 1, act + (k === "ArrowDown" ? 1 : -1)));
    paint();
    if (opts[act].scrollIntoView) opts[act].scrollIntoView({ block: "nearest" });
  });
  wrap.append(b, list);
  paint();
  return {
    el: wrap,
    get: function () {
      return cur;
    },
    set: function (v) {
      cur = v;
      paint();
    },
    disable: function (v) {
      b.disabled = !!v;
      wrap.classList.toggle("is-off", !!v);
    },
  };
}
// an option of a column: the checkbox of the site, its name and one line that says what it does
function opt(label, sub, icon) {
  var l = h("label", "dbp-opt");
  var c = h("input");
  c.type = "checkbox";
  var box = h("span", "dbp-cb");
  box.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7"/></svg>'; // static, trusted SVG
  var tx = h("span", "dbp-opt-t");
  var top = h("b", "dbp-opt-n");
  if (icon) top.append(ico(icon, icon === "key" ? "is-pk" : "is-fk", 14));
  top.append(document.createTextNode(label));
  tx.append(top, h("small", "", sub));
  l.append(c, box, tx);
  return { l: l, c: c };
}

var PAGE = 15;
var SVGNS = "http://www.w3.org/2000/svg";

function h(tag, cls, text) {
  var n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined && text !== null) n.textContent = text;
  return n;
}
function btn(cls, text, fn) {
  var b = h("button", cls, text);
  b.type = "button";
  if (fn) b.addEventListener("click", fn);
  return b;
}
function show(v) {
  if (v === null || v === undefined) return null;
  return String(v);
}

var cssDone = false;
function ensureCss() {
  if (cssDone) return;
  cssDone = true;
  var l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = new URL("../CSS/webdb.css?v=11", import.meta.url).href;
  document.head.append(l);
}

var DB_ICON =
  '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6.5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V5.5M4.5 12v6.5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V12"/></svg>';

// opts: { lang, getEngine: () => Promise<engine>, onChange: () => void }
export function dbPanel(opts) {
  ensureCss();
  var S = STR[opts.lang === "ar" ? "ar" : "fr"];
  var eng = null;
  var isOpen = false;
  var cur = ""; // table shown
  var tab = "browse";
  var pageNo = 0;
  var creating = false;
  var armedRow = null;
  var lastSql = "";
  var sqlOut = null; // { error } | { res }
  var winEl = null;
  var sideOff = false;
  var editRow = null; // { id, vals }: the line being changed
  var editCol = ""; // the column being changed ("+" = a new one)
  var colErr = "";

  var root = h("section", "dbp");
  root.setAttribute("aria-label", S.title);
  root.setAttribute("aria-hidden", "true");
  root.setAttribute("dir", opts.lang === "ar" ? "rtl" : "ltr");
  var head = h("div", "dbp-head");
  var title = h("span", "dbp-title", S.title);
  var close = btn("dbp-x", "×", function () {
    setOpen(false);
  });
  close.setAttribute("aria-label", S.close);
  close.title = S.close;
  var sideBtn = btn("dbp-x dbp-sidebtn", "", function () {
    sideOff = !sideOff;
    body.classList.toggle("is-noside", sideOff);
    sideBtn.setAttribute("aria-expanded", sideOff ? "false" : "true");
    sideBtn.classList.toggle("is-off", sideOff);
  });
  sideBtn.innerHTML = icoHtml("side", 16); // static, trusted SVG
  sideBtn.title = S.sideToggle;
  sideBtn.setAttribute("aria-label", S.sideToggle);
  sideBtn.setAttribute("aria-expanded", "true");
  head.append(sideBtn, title, close);
  var body = h("div", "dbp-body");
  root.append(head, body);

  var button = h("button", "pg-copy pg-db-toggle");
  button.type = "button";
  button.title = S.toggle;
  button.setAttribute("aria-label", S.toggle);
  button.setAttribute("aria-expanded", "false");
  button.innerHTML = DB_ICON; // static, trusted SVG
  button.addEventListener("click", function () {
    setOpen(!isOpen);
  });

  function setOpen(v) {
    isOpen = !!v;
    root.classList.toggle("is-open", isOpen);
    root.setAttribute("aria-hidden", isOpen ? "false" : "true");
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    button.classList.toggle("is-on", isOpen);
    if (winEl) winEl.classList.toggle("db-open", isOpen);
    if (isOpen) start();
  }
  function start() {
    if (eng) return render();
    body.textContent = "";
    body.append(h("p", "dbp-msg", S.loading));
    opts.getEngine().then(
      function (e) {
        eng = e;
        eng.onChange(function () {
          if (isOpen) render();
          if (opts.onChange) opts.onChange();
        });
        render();
      },
      function () {
        body.textContent = "";
        body.append(h("p", "dbp-msg is-err", S.fail));
      }
    );
  }

  function tables() {
    return eng.tables();
  }

  /* ---------- the side list ---------- */
  function side() {
    var s = h("nav", "dbp-side");
    var dbn = h("div", "dbp-dbname");
    dbn.append(h("span", "dbp-dbico"), h("b", "", eng.name()));
    dbn.firstChild.innerHTML = DB_ICON; // static, trusted SVG
    s.append(dbn);
    var ul = h("ul", "dbp-tables");
    var list = tables();
    list.forEach(function (tb) {
      var li = h("li");
      var b = btn("dbp-t" + (!creating && tb.name === cur ? " is-cur" : ""), "", function () {
        cur = tb.name;
        creating = false;
        pageNo = 0;
        armedRow = null;
        editRow = null;
        editCol = "";
        colErr = "";
        if (tab === "designer") tab = "browse";
        render();
      });
      b.append(h("span", "dbp-tn", tb.name), h("span", "dbp-tc", String(tb.rows)));
      li.append(b);
      ul.append(li);
    });
    if (!list.length) ul.append(h("li", "dbp-none", S.emptyDb));
    s.append(ul);
    var acts = h("div", "dbp-acts");
    acts.append(
      btn("dbp-a is-main", "+ " + S.newTable, function () {
        creating = true;
        render();
      })
    );
    s.append(acts);
    s.append(h("p", "dbp-note", S.note));
    // import / export: at the bottom of the side bar
    var io = h("div", "dbp-io");
    io.setAttribute("role", "group");
    io.setAttribute("aria-label", S.ioTitle);
    var bi = btn("dbp-a is-io", "", importFile);
    bi.append(ico("up", "", 15), document.createTextNode(S.importSql));
    var be = btn("dbp-a is-io", "", exportFile);
    be.append(ico("down", "", 15), document.createTextNode(S.exportSql));
    io.append(bi, be);
    s.append(io);
    return s;
  }
  function importFile() {
    var inp = document.createElement("input");
    inp.type = "file";
    inp.accept = ".sql,text/plain";
    inp.addEventListener("change", function () {
      var f = inp.files && inp.files[0];
      if (!f) return;
      if (f.size > 700000) {
        sqlOut = { error: "Fichier trop gros (700 Ko max)." };
        tab = "sql";
        return render();
      }
      f.text().then(function (txt) {
        try {
          eng.run(txt);
          sqlOut = { ok: S.imported };
          if (!cur && tables().length) cur = tables()[0].name;
        } catch (e) {
          sqlOut = { error: friendly(e) };
        }
        creating = false;
        tab = "sql";
        render();
      });
    });
    inp.click();
  }
  function exportFile() {
    var blob = new Blob([eng.toDump()], { type: "text/plain" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = eng.name() + ".sql";
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
    }, 2000);
  }

  /* ---------- tabs ---------- */
  function tabsBar() {
    var bar = h("div", "dbp-tabs");
    bar.setAttribute("role", "tablist");
    [["browse", S.browse], ["structure", S.structure], ["sql", S.sql], ["designer", S.designer]].forEach(function (x) {
      var b = btn("dbp-tab" + (tab === x[0] ? " is-on" : ""), x[1], function () {
        tab = x[0];
        render();
      });
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", tab === x[0] ? "true" : "false");
      bar.append(b);
    });
    return bar;
  }

  function grid(colsList, rows, extra) {
    var wrap = h("div", "dbp-grid");
    var tb = h("table");
    var thead = h("thead");
    var tr = h("tr");
    if (extra) tr.append(h("th", "dbp-th-x"));
    colsList.forEach(function (c) {
      tr.append(h("th", "", c));
    });
    thead.append(tr);
    tb.append(thead);
    var tbody = h("tbody");
    rows.forEach(function (r, i) {
      var row = h("tr");
      if (extra) row.append(extra(i));
      r.forEach(function (v) {
        if (v && v.nodeType) {
          var tdn = h("td");
          tdn.append(v);
          row.append(tdn);
          return;
        }
        var s = show(v);
        row.append(s === null ? h("td", "is-null", "NULL") : h("td", "", s));
      });
      tbody.append(row);
    });
    tb.append(tbody);
    wrap.append(tb);
    return wrap;
  }

  function browse() {
    var box = h("div", "dbp-pane");
    var total = eng.count(cur);
    var pages = Math.max(1, Math.ceil(total / PAGE));
    if (pageNo >= pages) pageNo = pages - 1;
    var data = eng.page(cur, pageNo * PAGE, PAGE);
    box.append(h("p", "dbp-count", total + " " + (total === 1 ? S.row : S.rows)));
    if (!data.rows.length) box.append(h("p", "dbp-msg", S.noRows));
    else
      box.append(
        grid(data.cols, data.rows, function (i) {
          var td = h("td", "dbp-td-x");
          var id = data.ids[i];
          var key = cur + ":" + id;
          var ed = btn("dbp-ib", "", function () {
            editRow = { id: id, vals: data.rows[i] };
            render();
          });
          ed.append(ico("edit", "", 15));
          ed.title = S.edit;
          ed.setAttribute("aria-label", S.edit);
          if (editRow && editRow.id === id) ed.classList.add("is-on");
          var b = btn("dbp-ib is-del" + (armedRow === key ? " is-armed" : ""), "", function () {
            if (armedRow !== key) {
              armedRow = key;
              render();
              return;
            }
            armedRow = null;
            try {
              eng.run("DELETE FROM `" + cur + "` WHERE rowid=" + (id | 0));
            } catch (e) {
              sqlOut = { error: friendly(e) };
              tab = "sql";
              render();
            }
          });
          if (armedRow === key) b.textContent = S.delSure;
          else b.append(ico("trash", "", 15));
          b.title = S.del;
          b.setAttribute("aria-label", S.del);
          td.append(ed, b);
          return td;
        })
      );
    if (pages > 1) {
      var pg = h("div", "dbp-pager");
      pg.append(
        btn("dbp-pg", "‹", function () {
          if (pageNo > 0) {
            pageNo--;
            render();
          }
        }),
        h("span", "", S.page + " " + (pageNo + 1) + " / " + pages),
        btn("dbp-pg", "›", function () {
          if (pageNo < pages - 1) {
            pageNo++;
            render();
          }
        })
      );
      box.append(pg);
    }
    box.append(rowForm());
    return box;
  }

  function litOf(c, v) {
    return /^-?\d+(\.\d+)?$/.test(v) && !/char|text|date|time/i.test(c.type) ? v : "'" + v.replace(/'/g, "''") + "'";
  }
  // one form to add a line, or (editRow) to change one
  function rowForm() {
    var st = eng.structure(cur);
    var ed = editRow;
    var form = h("form", "dbp-ins" + (ed ? " is-edit" : ""));
    form.append(h("b", "dbp-ins-t", ed ? S.editRow : S.insert));
    var inputs = [];
    st.cols.forEach(function (c, ci) {
      var lab = h("label", "dbp-f");
      lab.append(h("span", "", c.name));
      var i = h("input");
      i.type = "text";
      i.setAttribute("dir", "ltr");
      i.autocomplete = "off";
      i.placeholder = c.ai ? "auto" : c.notnull ? "" : "NULL";
      if (ed && ed.vals[ci] !== null && ed.vals[ci] !== undefined) i.value = String(ed.vals[ci]);
      lab.append(i);
      form.append(lab);
      inputs.push({ c: c, i: i });
    });
    var ok = btn("dbp-a is-main", ed ? S.save : S.insert);
    ok.type = "submit";
    form.append(ok);
    if (ed)
      form.append(
        btn("dbp-a", S.cancel, function () {
          editRow = null;
          render();
        })
      );
    var err = h("p", "dbp-msg is-err");
    err.hidden = true;
    form.append(err);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      try {
        if (ed) {
          var sets = inputs.map(function (x) {
            var v = x.i.value;
            return "`" + x.c.name + "`=" + (v === "" && !x.c.notnull ? "NULL" : litOf(x.c, v));
          });
          eng.run("UPDATE `" + cur + "` SET " + sets.join(",") + " WHERE rowid=" + (ed.id | 0));
          editRow = null;
          render();
          return;
        }
        var names = [];
        var vals = [];
        inputs.forEach(function (x) {
          var v = x.i.value;
          if (v === "" && (x.c.ai || !x.c.notnull)) return; // left empty: auto number or NULL
          names.push("`" + x.c.name + "`");
          vals.push(litOf(x.c, v));
        });
        if (names.length) eng.run("INSERT INTO `" + cur + "` (" + names.join(",") + ") VALUES (" + vals.join(",") + ")");
        else eng.run("INSERT INTO `" + cur + "` DEFAULT VALUES");
      } catch (ex) {
        err.textContent = friendly(ex);
        err.hidden = false;
      }
    });
    return form;
  }

  // the box of one column (name, type, link, options): used to make a table and to change a column
  // init: { name, type, notnull, pk, ai, unique, fk, table }; lockedBy: names of the tables that point to this column
  // opts: { n: number shown, onRemove }
  function colRow(init, lockedBy, o) {
    init = init || {};
    o = o || {};
    var r = h("div", "dbp-colbox");
    var hd = h("div", "dbp-colbox-h");
    hd.append(h("span", "dbp-colnum", o.n ? S.colN + " " + o.n : S.colN));
    if (o.onRemove) {
      var rm = btn("dbp-ib is-del", "", o.onRemove);
      rm.append(ico("x", "", 15));
      rm.title = S.removeCol;
      rm.setAttribute("aria-label", S.removeCol);
      hd.append(rm);
    }
    var grid3 = h("div", "dbp-colgrid");
    var n = h("input");
    n.placeholder = S.colName;
    n.maxLength = 40;
    n.setAttribute("dir", "ltr");
    n.value = init.name || "";
    function field(label, node) {
      var f = h("div", "dbp-f");
      f.append(h("span", "", label), node);
      return f;
    }
    var types = TYPES.slice();
    var cur0 = String(init.type || "INT").toUpperCase();
    if (
      !types.some(function (x) {
        return x[0] === cur0;
      })
    )
      types.push([cur0, cur0]);
    var ty = dropdown(types, cur0);
    var fkItems = [["", S.none]];
    tables().forEach(function (tb) {
      if (tb.name === init.table) return;
      eng.structure(tb.name).cols.forEach(function (c) {
        if (c.pk) fkItems.push([tb.name + "." + c.name, tb.name + "." + c.name]); // a link goes to a key
      });
    });
    if (
      init.fk &&
      !fkItems.some(function (x) {
        return x[0] === init.fk;
      })
    )
      fkItems.push([init.fk, init.fk]);
    var fk = dropdown(fkItems, init.fk || "", null, ico("link", "is-fk", 14));
    fk.el.classList.add("dbp-fk");
    grid3.append(field(S.name, n), field(S.type, ty.el), field(S.fkLabel, fk.el));
    var ops = h("div", "dbp-opts");
    var cn = opt(S.nul, S.nulSub);
    var cp = opt(S.pk, S.pkSub, "key");
    var ca = opt(S.ai, S.aiSub);
    var cu = opt(S.unique, S.uniqueSub);
    cn.c.checked = init.notnull === false;
    cp.c.checked = !!init.pk;
    ca.c.checked = !!init.ai;
    cu.c.checked = !!init.unique;
    ops.append(cn.l, cp.l, ca.l, cu.l);
    r.append(hd, grid3, ops);
    if (lockedBy && lockedBy.length) {
      n.disabled = true;
      ty.disable(true);
      cp.c.disabled = true;
      cp.l.classList.add("is-off");
      var note = h("p", "dbp-lock");
      note.append(ico("lock", "", 14), document.createTextNode(S.lockedMsg.replace("{t}", lockedBy.join(", "))));
      r.append(note);
    }
    return {
      el: r,
      setNum: function (k) {
        hd.firstChild.textContent = S.colN + " " + k;
      },
      read: function () {
        return { name: n.value.trim().replace(/[^A-Za-z0-9_]/g, "_"), type: ty.get(), notnull: !cn.c.checked, pk: cp.c.checked, ai: ca.c.checked, unique: cu.c.checked, fk: fk.get() };
      },
    };
  }

  function structureTab() {
    var box = h("div", "dbp-pane");
    var st = eng.structure(cur);
    var rows = st.cols.map(function (c) {
      var fk = st.fks.filter(function (f) {
        return f.cols.indexOf(c.name) >= 0;
      })[0];
      var kc = h("span", "dbp-cell");
      if (c.pk) kc.append(ico("key", "is-pk"), document.createTextNode("PRIMARY"));
      else if (st.uniq.some(function (u) { return u.length === 1 && u[0] === c.name; })) kc.append(document.createTextNode("UNIQUE"));
      var rc = h("span", "dbp-cell");
      if (fk) rc.append(ico("link", "is-fk"), document.createTextNode(fk.ref + "." + fk.refCols[fk.cols.indexOf(c.name)]));
      return [c.name, c.type, c.notnull ? "NON" : "OUI", kc, c.ai ? "AUTO_INCREMENT" : "", rc];
    });
    box.append(
      grid(["Colonne", "Type", "Null", "Clé", "Extra", "Relation"], rows, function (i) {
        var c = st.cols[i];
        var td = h("td", "dbp-td-x");
        var ed = btn("dbp-ib" + (editCol === c.name ? " is-on" : ""), "", function () {
          editCol = c.name;
          colErr = "";
          render();
        });
        ed.append(ico("edit", "", 15));
        ed.title = S.edit;
        ed.setAttribute("aria-label", S.edit);
        var used = eng.referencedBy(cur, c.name);
        var key = "col:" + cur + ":" + c.name;
        var del = btn("dbp-ib is-del" + (armedRow === key ? " is-armed" : ""), "", function () {
          if (used.length) {
            colErr = S.lockedDel;
            render();
            return;
          }
          if (armedRow !== key) {
            armedRow = key;
            render();
            return;
          }
          armedRow = null;
          try {
            eng.dropColumn(cur, c.name);
          } catch (e) {
            colErr = friendly(e);
            render();
          }
        });
        if (armedRow === key) del.textContent = S.delSure;
        else del.append(ico(used.length ? "lock" : "trash", "", 15));
        del.title = used.length ? S.lockedDel : S.del;
        del.setAttribute("aria-label", S.del);
        td.append(ed, del);
        return td;
      })
    );
    box.append(
      btn("dbp-a is-add", "", function () {
        editCol = "+";
        colErr = "";
        render();
      })
    );
    box.lastChild.append(ico("plus", "", 14), document.createTextNode(S.newCol));
    if (editCol) {
      var cc = editCol === "+" ? null : st.cols.filter(function (x) { return x.name === editCol; })[0];
      var fk0 = cc ? st.fks.filter(function (f) { return f.cols.length === 1 && f.cols[0] === cc.name; })[0] : null;
      var form = h("div", "dbp-ins is-edit");
      form.append(h("b", "dbp-ins-t", cc ? S.editCol + " « " + cc.name + " »" : S.newCol));
      var model = eng.models().filter(function (m) { return m.name === cur; })[0];
      var def = cc && model ? model.cols.filter(function (x) { return x.name === cc.name; })[0] : null;
      var row = colRow(
        cc
          ? { table: cur, name: cc.name, type: ((def && def.def) || cc.type).replace(/\s*(NOT NULL|DEFAULT).*/i, "").trim(), notnull: cc.notnull, pk: cc.pk, ai: cc.ai, unique: st.uniq.some(function (u) { return u.length === 1 && u[0] === cc.name; }), fk: fk0 ? fk0.ref + "." + fk0.refCols[0] : "" }
          : { table: cur, type: "INT", notnull: true },
        cc ? eng.referencedBy(cur, cc.name) : null,
        {}
      );
      form.append(row.el);
      var err = h("p", "dbp-msg is-err");
      err.hidden = true;
      var acts = h("div", "dbp-acts is-row");
      acts.append(
        btn("dbp-a is-main", S.save, function () {
          try {
            eng.editColumn(cur, cc ? cc.name : null, row.read());
            editCol = "";
            colErr = "";
            render();
          } catch (e) {
            err.textContent = friendly(e);
            err.hidden = false;
          }
        }),
        btn("dbp-a", S.cancel, function () {
          editCol = "";
          render();
        })
      );
      form.append(acts, err);
      box.append(form);
    }
    if (colErr) box.append(h("p", "dbp-msg is-err", colErr));
    box.append(h("h4", "dbp-h", S.relations));
    if (!st.fks.length) box.append(h("p", "dbp-msg", S.noRel));
    else {
      var ul = h("ul", "dbp-rel");
      st.fks.forEach(function (f) {
        var li = h("li", "dbp-relrow");
        li.append(ico("link", "is-fk"), document.createTextNode(f.cols.join(", ") + " → " + f.ref + "(" + f.refCols.join(", ") + ")"));
        ul.append(li);
      });
      box.append(ul);
    }
    return box;
  }

  function sqlTab() {
    var box = h("div", "dbp-pane");
    var ta = h("textarea", "dbp-sql");
    ta.value = lastSql;
    ta.spellcheck = false;
    ta.setAttribute("dir", "ltr");
    ta.placeholder = S.sqlHint;
    ta.addEventListener("input", function () {
      lastSql = ta.value;
    });
    var run = btn("dbp-a is-main", S.run, function () {
      lastSql = ta.value;
      try {
        var r = eng.run(lastSql);
        sqlOut = r.cols && r.cols.length ? { res: r } : { ok: r.affected ? r.affected + " " + S.affected : S.done };
      } catch (e) {
        sqlOut = { error: friendly(e) };
      }
      if (cur && !eng.tables().some(function (x) { return x.name === cur; })) cur = "";
      render();
    });
    box.append(ta, run);
    if (sqlOut) {
      if (sqlOut.error) box.append(h("p", "dbp-msg is-err", sqlOut.error));
      else if (sqlOut.ok) box.append(h("p", "dbp-msg is-ok", sqlOut.ok));
      else if (sqlOut.res) {
        var r = sqlOut.res;
        box.append(h("p", "dbp-count", r.rows.length + " " + (r.rows.length === 1 ? S.row : S.rows)));
        box.append(grid(r.cols, r.rows.slice(0, 200)));
      }
    }
    return box;
  }

  // the tables and their links, drawn: the tables that point to others on the left, the ones they point to on the right
  function designer() {
    var box = h("div", "dbp-pane dbp-design");
    var models = eng.models();
    if (!models.length) {
      box.append(h("p", "dbp-msg", S.empty));
      return box;
    }
    var W = 232;
    var LH = 28;
    var HH = 42;
    var GAPX = 76;
    var GAPY = 30;
    var byName = {};
    models.forEach(function (m) {
      byName[m.name.toLowerCase()] = m;
    });
    var depthOf = {};
    function depth(m, seen) {
      var key = m.name.toLowerCase();
      if (depthOf[key] !== undefined) return depthOf[key];
      if (seen[key]) return 0;
      seen[key] = true;
      var d = 0;
      m.fks.forEach(function (f) {
        var p = byName[f.ref.toLowerCase()];
        if (p && p !== m) d = Math.max(d, 1 + depth(p, seen));
      });
      depthOf[key] = d;
      return d;
    }
    var maxD = 0;
    models.forEach(function (m) {
      maxD = Math.max(maxD, depth(m, {}));
    });
    var colsList = [];
    models.forEach(function (m) {
      var c = maxD - depthOf[m.name.toLowerCase()]; // the tables nobody points to... are on the left
      (colsList[c] = colsList[c] || []).push(m);
    });
    colsList = colsList.filter(Boolean);
    // the order of the tables in each column that crosses the fewest links
    function crossings(order) {
      var colOf = {};
      var yOf = {};
      order.forEach(function (list, ci) {
        var y = 0;
        list.forEach(function (m) {
          colOf[m.name.toLowerCase()] = ci;
          yOf[m.name.toLowerCase()] = y;
          y += HH + m.cols.length * LH + 8 + GAPY;
        });
      });
      var ls = [];
      models.forEach(function (m) {
        m.fks.forEach(function (f) {
          var a = m.name.toLowerCase();
          var b = f.ref.toLowerCase();
          if (colOf[b] === undefined || a === b) return;
          var ia = Math.max(0, m.cols.map(function (c) { return c.name; }).indexOf(f.cols[0]));
          var ib = Math.max(0, byName[b].cols.map(function (c) { return c.name; }).indexOf(f.refCols[0]));
          ls.push({ ca: colOf[a], cb: colOf[b], ya: yOf[a] + HH + ia * LH, yb: yOf[b] + HH + ib * LH });
        });
      });
      var n = 0;
      for (var i = 0; i < ls.length; i++)
        for (var j = i + 1; j < ls.length; j++) {
          var p1 = ls[i];
          var p2 = ls[j];
          if (p1.ca !== p2.ca || p1.cb !== p2.cb) continue;
          if ((p1.ya - p2.ya) * (p1.yb - p2.yb) < 0) n++;
        }
      return n;
    }
    function perms(arr) {
      if (arr.length < 2) return [arr];
      var out = [];
      arr.forEach(function (x, i) {
        perms(arr.slice(0, i).concat(arr.slice(i + 1))).forEach(function (p) {
          out.push([x].concat(p));
        });
      });
      return out;
    }
    for (var sweep = 0; sweep < 3; sweep++) {
      var improved = false;
      colsList.forEach(function (list, ci) {
        if (list.length < 2 || list.length > 6) return;
        var best = crossings(colsList);
        var bestOrder = list;
        perms(list).forEach(function (pm) {
          colsList[ci] = pm;
          var c = crossings(colsList);
          if (c < best) {
            best = c;
            bestOrder = pm;
          }
        });
        if (bestOrder !== list) improved = true;
        colsList[ci] = bestOrder;
      });
      if (!improved) break;
    }
    var pos = {};
    var width = 0;
    var height = 0;
    colsList.forEach(function (list, ci) {
      var y = 16;
      list.forEach(function (m) {
        var ht = HH + m.cols.length * LH + 8;
        pos[m.name.toLowerCase()] = { x: 16 + ci * (W + GAPX), y: y, m: m, ht: ht };
        y += ht + GAPY;
      });
      height = Math.max(height, y - GAPY + 16);
    });
    width = 32 + colsList.length * W + (colsList.length - 1) * GAPX;
    var svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    svg.style.width = "100%";
    svg.style.maxWidth = width + "px";
    svg.style.minWidth = Math.min(width, 480) + "px";
    svg.style.height = "auto";
    svg.setAttribute("role", "img");
    function mk(tag, attrs, text) {
      var n = document.createElementNS(SVGNS, tag);
      Object.keys(attrs).forEach(function (a) {
        n.setAttribute(a, attrs[a]);
      });
      if (text !== undefined) n.textContent = text;
      return n;
    }
    // an icon of the site inside the drawing
    function icoSvg(name, x, y, size, cls) {
      var g = mk("svg", { x: x, y: y, width: size, height: size, viewBox: "0 0 24 24", class: "dbp-sico " + cls });
      var tmp = document.createElementNS(SVGNS, "g");
      tmp.innerHTML = ICO[name]; // static, trusted SVG
      while (tmp.firstChild) g.append(tmp.firstChild);
      return g;
    }
    function typeOf(def) {
      var m = /^\s*([A-Za-z]+)\s*(\([^)]*\))?/.exec(def || "");
      return m ? m[1].toUpperCase() + (m[2] ? m[2].replace(/\s+/g, "") : "") : "";
    }
    var rowY = function (p, name) {
      var i = Math.max(
        0,
        p.m.cols.map(function (c) {
          return c.name;
        }).indexOf(name)
      );
      return p.y + HH + i * LH + LH / 2;
    };
    // the links first, under the cards
    models.forEach(function (m) {
      var from = pos[m.name.toLowerCase()];
      m.fks.forEach(function (f) {
        var to = pos[f.ref.toLowerCase()];
        if (!to) return;
        var y1 = rowY(from, f.cols[0]);
        var y2 = rowY(to, f.refCols[0]);
        var x1;
        var x2;
        var d;
        if (to.x > from.x) {
          x1 = from.x + W;
          x2 = to.x;
          var mx = (x1 + x2) / 2;
          d = "M" + x1 + " " + y1 + " C" + mx + " " + y1 + " " + mx + " " + y2 + " " + x2 + " " + y2;
        } else if (to.x < from.x) {
          x1 = from.x;
          x2 = to.x + W;
          var mx2 = (x1 + x2) / 2;
          d = "M" + x1 + " " + y1 + " C" + mx2 + " " + y1 + " " + mx2 + " " + y2 + " " + x2 + " " + y2;
        } else {
          x1 = from.x + W;
          x2 = to.x + W;
          d = "M" + x1 + " " + y1 + " C" + (x1 + 48) + " " + y1 + " " + (x2 + 48) + " " + y2 + " " + x2 + " " + y2;
        }
        var tag = { "data-a": m.name.toLowerCase(), "data-b": f.ref.toLowerCase() };
        svg.append(
          mk("path", Object.assign({ d: d, class: "dbp-link" }, tag)),
          mk("circle", Object.assign({ cx: x1, cy: y1, r: 4.5, class: "dbp-dot" }, tag)),
          mk("circle", Object.assign({ cx: x2, cy: y2, r: 4.5, class: "dbp-dot" }, tag))
        );
      });
    });
    Object.keys(pos).forEach(function (key) {
      var p = pos[key];
      var g = mk("g", { transform: "translate(" + p.x + "," + p.y + ")", class: "dbp-card" });
      g.addEventListener("mouseenter", function () {
        svg.classList.add("is-dim");
        svg.querySelectorAll("[data-a]").forEach(function (n) {
          n.classList.toggle("is-hot", n.getAttribute("data-a") === key || n.getAttribute("data-b") === key);
        });
      });
      g.addEventListener("mouseleave", function () {
        svg.classList.remove("is-dim");
      });
      g.append(mk("rect", { width: W, height: p.ht, rx: 16, class: "dbp-box" }));
      g.append(icoSvg("table", 14, 12, 18, "is-tbl"));
      g.append(mk("text", { x: 40, y: 27, class: "dbp-boxt" }, p.m.name));
      g.append(mk("line", { x1: 12, x2: W - 12, y1: HH - 2, y2: HH - 2, class: "dbp-sep" }));
      p.m.cols.forEach(function (c, i) {
        var isPk = p.m.pk.indexOf(c.name) >= 0;
        var isFk = p.m.fks.some(function (f) {
          return f.cols.indexOf(c.name) >= 0;
        });
        var cy = HH + i * LH + LH / 2;
        if (isPk) g.append(icoSvg("key", 14, cy - 7.5, 15, "is-pk"));
        else if (isFk) g.append(icoSvg("link", 14, cy - 7.5, 15, "is-fk"));
        g.append(mk("text", { x: 36, y: cy + 4, class: "dbp-boxc" + (isPk ? " is-pk" : "") }, c.name));
        g.append(mk("text", { x: W - 14, y: cy + 4, class: "dbp-boxty", "text-anchor": "end" }, typeOf(c.def)));
      });
      svg.append(g);
    });
    var sc = h("div", "dbp-svgwrap");
    sc.append(svg);
    box.append(sc);
    return box;
  }

  // "Nouvelle table": name, columns, keys and links
  function newTableForm() {
    var box = h("div", "dbp-pane dbp-new");
    // 1. the table
    var sec1 = h("section", "dbp-sec");
    var h1 = h("div", "dbp-sec-h");
    h1.append(h("span", "dbp-sec-n", "1"), h("b", "", S.secTable), h("small", "", S.secTableSub));
    var nameLab = h("label", "dbp-f is-wide");
    nameLab.append(h("span", "", S.tName));
    var nameIn = h("input");
    nameIn.setAttribute("dir", "ltr");
    nameIn.maxLength = 40;
    nameLab.append(nameIn);
    sec1.append(h1, nameLab);
    // 2. the columns, one box each
    var sec2 = h("section", "dbp-sec");
    var h2 = h("div", "dbp-sec-h");
    h2.append(h("span", "dbp-sec-n", "2"), h("b", "", S.secCols), h("small", "", S.secColsSub));
    var colsBox = h("div", "dbp-cols");
    var rowsData = [];
    var err = h("p", "dbp-msg is-err");
    err.hidden = true;
    function renumber() {
      rowsData.forEach(function (r, i) {
        r.setNum(i + 1);
      });
    }
    function addRow() {
      var r = colRow({ type: "INT", notnull: true }, null, {
        n: rowsData.length + 1,
        onRemove: function () {
          if (rowsData.length < 2) return;
          rowsData.splice(rowsData.indexOf(r), 1);
          r.el.remove();
          renumber();
        },
      });
      colsBox.append(r.el);
      rowsData.push(r);
    }
    addRow();
    addRow();
    var add = btn("dbp-a is-add", "", addRow);
    add.append(ico("plus", "", 14), document.createTextNode(S.addCol.replace(/^\+\s*/, "")));
    sec2.append(h2, colsBox, add);
    box.append(sec1, sec2);
    var acts = h("div", "dbp-acts is-row");
    acts.append(
      btn("dbp-a", S.addCol, addRow),
      btn("dbp-a is-main", S.create, function () {
        var name = nameIn.value.trim().replace(/[^A-Za-z0-9_]/g, "_");
        if (!name) {
          err.textContent = S.needName;
          err.hidden = false;
          return;
        }
        var model = { name: name, cols: [], pk: [], uniq: [], fks: [] };
        rowsData.forEach(function (rr) {
          var r = rr.read();
          if (!r.name) return;
          var isInt = /^(INT|TINYINT)/.test(r.type);
          model.cols.push({ name: r.name, def: r.type + (r.notnull || r.pk ? " NOT NULL" : ""), ai: r.ai && r.pk && isInt });
          if (r.pk) model.pk.push(r.name);
          else if (r.unique) model.uniq.push([r.name]);
          if (r.fk) {
            var p = r.fk.split(".");
            model.fks.push({ cols: [r.name], ref: p[0], refCols: [p[1]], tail: "" });
          }
        });
        if (!model.cols.length) {
          err.textContent = S.needCol;
          err.hidden = false;
          return;
        }
        try {
          eng.createTable(model);
          creating = false;
          cur = name;
          tab = "structure";
          render();
        } catch (e) {
          err.textContent = friendly(e);
          err.hidden = false;
        }
      }),
      btn("dbp-a", S.cancel, function () {
        creating = false;
        render();
      })
    );
    box.append(acts, err);
    return box;
  }

  function render() {
    if (!eng) return;
    body.textContent = "";
    var list = tables();
    if (cur && !list.some(function (x) { return x.name === cur; })) cur = "";
    if (!cur && list.length) cur = list[0].name;
    body.append(side());
    var main = h("div", "dbp-main");
    if (creating) main.append(newTableForm());
    else if (!list.length && tab !== "sql") {
      main.append(tabsBar(), h("p", "dbp-msg", S.empty));
    } else {
      main.append(tabsBar());
      if (tab === "sql") main.append(sqlTab());
      else if (tab === "designer") main.append(designer());
      else if (!cur) main.append(h("p", "dbp-msg", S.empty));
      else main.append(tab === "structure" ? structureTab() : browse());
    }
    body.append(main);
  }

  return {
    button: button,
    el: root,
    mount: function (win) {
      winEl = win;
      win.classList.add("has-db");
      win.append(root);
    },
    open: function () {
      setOpen(true);
    },
  };
}
