/* The "Base de données" panel of the code window: a small phpMyAdmin (tables, rows, structure, SQL, relations diagram).
   It works on an engine from JS/webdb.js. Everything the student wrote is put in the page with textContent, never as markup. */
import { friendly } from "./webdb.js?v=1";

var STR = {
  fr: {
    title: "Base de données",
    toggle: "Base de données",
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

var TYPES = ["INT", "VARCHAR(50)", "VARCHAR(255)", "TEXT", "FLOAT", "DOUBLE", "DATE", "DATETIME", "TINYINT(1)"];
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
  l.href = new URL("../CSS/webdb.css?v=1", import.meta.url).href;
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
  head.append(title, close);
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
      return [c.name, c.type, c.notnull ? "NON" : "OUI", c.pk ? "PRIMARY" : "", c.ai ? "AUTO_INCREMENT" : "", fk ? "→ " + fk.ref + "." + fk.refCols[fk.cols.indexOf(c.name)] : ""];
    });
    box.append(grid(["Colonne", "Type", "Null", "Clé", "Extra", "Relation"], rows));
    box.append(h("h4", "dbp-h", S.relations));
    if (!st.fks.length) box.append(h("p", "dbp-msg", S.noRel));
    else {
      var ul = h("ul", "dbp-rel");
      st.fks.forEach(function (f) {
        ul.append(h("li", "", f.cols.join(", ") + " → " + f.ref + "(" + f.refCols.join(", ") + ")"));
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

  // the tables and their links, drawn
  function designer() {
    var box = h("div", "dbp-pane dbp-design");
    var models = eng.models();
    if (!models.length) {
      box.append(h("p", "dbp-msg", S.empty));
      return box;
    }
    var W = 168;
    var LH = 18;
    var HH = 26;
    var GAP = 44;
    var per = 2;
    var pos = {};
    var rowY = [];
    models.forEach(function (m, i) {
      var c = i % per;
      var r = Math.floor(i / per);
      var ht = HH + m.cols.length * LH + 8;
      rowY[r] = Math.max(rowY[r] || 0, ht);
    });
    var yAcc = [0];
    for (var k = 1; k < rowY.length; k++) yAcc[k] = yAcc[k - 1] + rowY[k - 1] + GAP;
    models.forEach(function (m, i) {
      pos[m.name.toLowerCase()] = { x: 12 + (i % per) * (W + GAP), y: 12 + yAcc[Math.floor(i / per)], m: m };
    });
    var width = 24 + Math.min(per, models.length) * (W + GAP) - GAP;
    var height = 24 + yAcc[yAcc.length - 1] + rowY[rowY.length - 1];
    var svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("role", "img");
    function mk(tag, attrs, text) {
      var n = document.createElementNS(SVGNS, tag);
      Object.keys(attrs).forEach(function (a) {
        n.setAttribute(a, attrs[a]);
      });
      if (text !== undefined) n.textContent = text;
      return n;
    }
    // links first (under the boxes)
    models.forEach(function (m) {
      var from = pos[m.name.toLowerCase()];
      m.fks.forEach(function (f) {
        var to = pos[f.ref.toLowerCase()];
        if (!to) return;
        var ci = Math.max(0, m.cols.map(function (c) { return c.name; }).indexOf(f.cols[0]));
        var cj = Math.max(0, to.m.cols.map(function (c) { return c.name; }).indexOf(f.refCols[0]));
        var y1 = from.y + HH + ci * LH + LH / 2;
        var y2 = to.y + HH + cj * LH + LH / 2;
        var right = to.x > from.x;
        var left = to.x < from.x;
        var x1 = right ? from.x + W : from.x;
        var x2 = right ? to.x : to.x + W;
        if (!right && !left) {
          x1 = from.x + W;
          x2 = to.x + W;
          svg.append(mk("path", { d: "M" + x1 + " " + y1 + " C" + (x1 + 30) + " " + y1 + " " + (x2 + 30) + " " + y2 + " " + x2 + " " + y2, class: "dbp-link" }));
        } else {
          var mx = (x1 + x2) / 2;
          svg.append(mk("path", { d: "M" + x1 + " " + y1 + " C" + mx + " " + y1 + " " + mx + " " + y2 + " " + x2 + " " + y2, class: "dbp-link" }));
        }
        svg.append(mk("circle", { cx: x1, cy: y1, r: 3.5, class: "dbp-dot" }), mk("circle", { cx: x2, cy: y2, r: 3.5, class: "dbp-dot is-one" }));
      });
    });
    Object.keys(pos).forEach(function (key) {
      var p = pos[key];
      var ht = HH + p.m.cols.length * LH + 8;
      var g = mk("g", { transform: "translate(" + p.x + "," + p.y + ")" });
      g.append(mk("rect", { width: W, height: ht, rx: 10, class: "dbp-box" }));
      g.append(mk("path", { d: "M0 " + HH + "V10a10 10 0 0 1 10-10h" + (W - 20) + "a10 10 0 0 1 10 10V" + HH + "Z", class: "dbp-boxh" }));
      g.append(mk("text", { x: 10, y: 17, class: "dbp-boxt" }, p.m.name));
      p.m.cols.forEach(function (c, i) {
        var isPk = p.m.pk.indexOf(c.name) >= 0;
        var isFk = p.m.fks.some(function (f) {
          return f.cols.indexOf(c.name) >= 0;
        });
        g.append(mk("text", { x: 10, y: HH + i * LH + 13, class: "dbp-boxc" + (isPk ? " is-pk" : "") }, (isPk ? "🔑 " : isFk ? "🔗 " : "") + c.name));
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
      var ty = h("select");
      TYPES.forEach(function (x) {
        var o = h("option", "", x);
        o.value = x;
        ty.append(o);
      });
      function chk(label) {
        var l = h("label", "dbp-chk");
        var c = h("input");
        c.type = "checkbox";
        l.append(c, h("span", "", label));
        return { l: l, c: c };
      }
      var cn = chk(S.nul);
      var cp = chk(S.pk);
      var ca = chk(S.ai);
      var fk = h("select", "dbp-fk");
      var o0 = h("option", "", S.fk + " " + S.none);
      o0.value = "";
      fk.append(o0);
      others.forEach(function (tn) {
        eng.structure(tn).cols.forEach(function (c) {
          if (!c.pk) return; // a link goes to a key
          var o = h("option", "", tn + "." + c.name);
          o.value = tn + "." + c.name;
          fk.append(o);
        });
      });
      r.append(n, ty, cn.l, cp.l, ca.l, fk);
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
          var isInt = /^(INT|TINYINT)/.test(r.ty.value);
          model.cols.push({ name: cn, def: r.ty.value + (r.nul.checked || r.pk.checked ? (r.pk.checked ? " NOT NULL" : "") : " NOT NULL"), ai: r.ai.checked && isInt });
          if (r.pk.checked) model.pk.push(cn);
          if (r.fk.value) {
            var p = r.fk.value.split(".");
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
