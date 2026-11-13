/* The "Base de données" panel of the code window: a small phpMyAdmin (tables, rows, structure, SQL, relations diagram).
   It works on an engine from JS/webdb.js. Everything the student wrote is put in the page with textContent, never as markup. */
import { friendly } from "./webdb.js?v=1";

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
    del: "Supprimer",
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
    del: "حذف",
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
  };
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
  l.href = new URL("../CSS/webdb.css?v=4", import.meta.url).href;
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
      }),
      btn("dbp-a", S.importSql, importFile),
      btn("dbp-a", S.exportSql, exportFile)
    );
    s.append(acts);
    s.append(h("p", "dbp-note", S.note));
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
          var b = btn("dbp-del" + (armedRow === key ? " is-armed" : ""), armedRow === key ? S.delSure : "🗑", function () {
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
          b.title = S.del;
          td.append(b);
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
    box.append(insertForm());
    return box;
  }

  function insertForm() {
    var st = eng.structure(cur);
    var form = h("form", "dbp-ins");
    form.append(h("b", "dbp-ins-t", S.insert));
    var inputs = [];
    st.cols.forEach(function (c) {
      var lab = h("label", "dbp-f");
      lab.append(h("span", "", c.name));
      var i = h("input");
      i.type = "text";
      i.setAttribute("dir", "ltr");
      i.autocomplete = "off";
      i.placeholder = c.ai ? "auto" : c.notnull ? "" : "NULL";
      lab.append(i);
      form.append(lab);
      inputs.push({ c: c, i: i });
    });
    var ok = btn("dbp-a is-main", S.insert);
    ok.type = "submit";
    form.append(ok);
    var err = h("p", "dbp-msg is-err");
    err.hidden = true;
    form.append(err);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var names = [];
      var vals = [];
      inputs.forEach(function (x) {
        var v = x.i.value;
        if (v === "" && (x.c.ai || !x.c.notnull)) return; // left empty: auto number or NULL
        names.push("`" + x.c.name + "`");
        vals.push(/^-?\d+(\.\d+)?$/.test(v) && !/char|text|date|time/i.test(x.c.type) ? v : "'" + v.replace(/'/g, "''") + "'");
      });
      try {
        if (names.length) eng.run("INSERT INTO `" + cur + "` (" + names.join(",") + ") VALUES (" + vals.join(",") + ")");
        else eng.run("INSERT INTO `" + cur + "` DEFAULT VALUES");
      } catch (ex) {
        err.textContent = friendly(ex);
        err.hidden = false;
      }
    });
    return form;
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
      var rc = h("span", "dbp-cell");
      if (fk) rc.append(ico("link", "is-fk"), document.createTextNode(fk.ref + "." + fk.refCols[fk.cols.indexOf(c.name)]));
      return [c.name, c.type, c.notnull ? "NON" : "OUI", kc, c.ai ? "AUTO_INCREMENT" : "", rc];
    });
    box.append(grid(["Colonne", "Type", "Null", "Clé", "Extra", "Relation"], rows));
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
        svg.append(mk("path", { d: d, class: "dbp-link" }), mk("circle", { cx: x1, cy: y1, r: 4.5, class: "dbp-dot" }), mk("circle", { cx: x2, cy: y2, r: 4.5, class: "dbp-dot" }));
      });
    });
    Object.keys(pos).forEach(function (key) {
      var p = pos[key];
      var g = mk("g", { transform: "translate(" + p.x + "," + p.y + ")" });
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
    var box = h("div", "dbp-pane");
    box.append(h("h4", "dbp-h", S.newTable));
    var nameLab = h("label", "dbp-f is-wide");
    nameLab.append(h("span", "", S.tName));
    var nameIn = h("input");
    nameIn.setAttribute("dir", "ltr");
    nameIn.maxLength = 40;
    nameLab.append(nameIn);
    box.append(nameLab);
    var colsBox = h("div", "dbp-cols");
    var rowsData = [];
    var others = tables().map(function (x) {
      return x.name;
    });
    var err = h("p", "dbp-msg is-err");
    err.hidden = true;
    function addRow() {
      var r = h("div", "dbp-col");
      var n = h("input");
      n.placeholder = S.colName;
      n.maxLength = 40;
      n.setAttribute("dir", "ltr");
      var ty = dropdown(TYPES, "INT");
      function chk(label, icon) {
        var l = h("label", "dbp-chk");
        var c = h("input");
        c.type = "checkbox";
        l.append(c);
        if (icon) l.append(ico(icon, icon === "key" ? "is-pk" : "is-fk", 14));
        l.append(h("span", "", label));
        return { l: l, c: c };
      }
      var cn = chk(S.nul);
      var cp = chk(S.pk, "key");
      var ca = chk(S.ai);
      var fkItems = [["", S.fk + " " + S.none]];
      others.forEach(function (tn) {
        eng.structure(tn).cols.forEach(function (c) {
          if (c.pk) fkItems.push([tn + "." + c.name, tn + "." + c.name]); // a link goes to a key
        });
      });
      var fk = dropdown(fkItems, "", null, ico("link", "is-fk", 14));
      fk.el.classList.add("dbp-fk");
      r.append(n, ty.el, cn.l, cp.l, ca.l, fk.el);
      colsBox.append(r);
      rowsData.push({ n: n, ty: ty, nul: cn.c, pk: cp.c, ai: ca.c, fk: fk });
    }
    addRow();
    addRow();
    box.append(colsBox);
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
        rowsData.forEach(function (r) {
          var cn = r.n.value.trim().replace(/[^A-Za-z0-9_]/g, "_");
          if (!cn) return;
          var isInt = /^(INT|TINYINT)/.test(r.ty.get());
          model.cols.push({ name: cn, def: r.ty.get() + (r.nul.checked || r.pk.checked ? (r.pk.checked ? " NOT NULL" : "") : " NOT NULL"), ai: r.ai.checked && isInt });
          if (r.pk.checked) model.pk.push(cn);
          if (r.fk.get()) {
            var p = r.fk.get().split(".");
            model.fks.push({ cols: [cn], ref: p[0], refCols: [p[1]], tail: "" });
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
