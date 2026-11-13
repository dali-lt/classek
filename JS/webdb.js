/* Classek web database: a small "MySQL" for the practical exam, running in the browser.

   The engine is SQLite (sql.js, WebAssembly). Students write MySQL (phpMyAdmin style), so every script goes through a translator:
   CREATE DATABASE / USE / SET are read, ENGINE=... and KEY lines are dropped, AUTO_INCREMENT + PRIMARY KEY become INTEGER PRIMARY KEY AUTOINCREMENT,
   the ALTER TABLE lines phpMyAdmin writes after the CREATEs (ADD PRIMARY KEY, MODIFY ... AUTO_INCREMENT, ADD CONSTRAINT ... FOREIGN KEY) are merged
   into their table, and a few MySQL functions (CONCAT, NOW, IF...) exist.

   The tables are kept as a model (columns, primary key, foreign keys), which is what the "Structure" and "Concepteur" views show and what is saved:
   the whole base is saved as a text script (the "dump") that this file can read back, so it can follow the student from one device to another. */

var sqlPromise = null;
// loads sql.js (once, only when a database is opened)
export function loadSql() {
  if (sqlPromise) return sqlPromise;
  sqlPromise = new Promise(function (resolve, reject) {
    var base = new URL("./vendor/", import.meta.url).href;
    var s = document.createElement("script");
    s.src = base + "sql-wasm.js";
    s.onload = function () {
      window
        .initSqlJs({
          locateFile: function (f) {
            return base + f;
          },
        })
        .then(resolve, reject);
    };
    s.onerror = function () {
      sqlPromise = null;
      reject(new Error("sql.js"));
    };
    document.head.append(s);
  });
  return sqlPromise;
}

/* ---------- reading a script ---------- */

// the statements of a script: comments out, split on ; outside quotes, MySQL escapes in strings turned into SQL ones
export function splitScript(text) {
  var out = [];
  var cur = "";
  var s = String(text || "");
  var i = 0;
  var n = s.length;
  while (i < n) {
    var c = s[i];
    var d = s[i + 1];
    if (c === "-" && d === "-" && (s[i + 2] === " " || s[i + 2] === "\n" || s[i + 2] === "\r" || i + 2 >= n)) {
      while (i < n && s[i] !== "\n") i++;
      continue;
    }
    if (c === "#") {
      while (i < n && s[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && d === "*") {
      var end = s.indexOf("*/", i + 2);
      i = end < 0 ? n : end + 2;
      continue;
    }
    if (c === "'" || c === '"') {
      var q = c;
      var lit = q;
      i++;
      while (i < n) {
        var ch = s[i];
        if (ch === "\\" && i + 1 < n) {
          var nx = s[i + 1];
          lit += nx === "'" ? "''" : nx === "n" ? "\n" : nx === "r" ? "\r" : nx === "t" ? "\t" : nx === "0" ? "" : nx === '"' && q === '"' ? '""' : nx === "\\" ? "\\" : nx;
          i += 2;
          continue;
        }
        if (ch === q) {
          if (s[i + 1] === q) {
            lit += q + q;
            i += 2;
            continue;
          }
          lit += q;
          i++;
          break;
        }
        lit += ch;
        i++;
      }
      cur += lit;
      continue;
    }
    if (c === "`") {
      var e2 = s.indexOf("`", i + 1);
      if (e2 < 0) e2 = n - 1;
      cur += s.slice(i, e2 + 1);
      i = e2 + 1;
      continue;
    }
    if (c === ";") {
      if (cur.trim()) out.push(cur.trim());
      cur = "";
      i++;
      continue;
    }
    cur += c;
    i++;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

// a list split on the commas that are not inside ( ) or quotes
function splitTop(body) {
  var parts = [];
  var depth = 0;
  var cur = "";
  var q = "";
  for (var i = 0; i < body.length; i++) {
    var c = body[i];
    if (q) {
      cur += c;
      if (c === q) q = "";
      continue;
    }
    if (c === "'" || c === '"' || c === "`") {
      q = c;
      cur += c;
      continue;
    }
    if (c === "(") depth++;
    if (c === ")") depth--;
    if (c === "," && depth === 0) {
      parts.push(cur.trim());
      cur = "";
      continue;
    }
    cur += c;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

function unq(name) {
  return String(name || "")
    .trim()
    .replace(/^[`"\[]|[`"\]]$/g, "");
}
function cols(list) {
  return splitTop(String(list || "")).map(function (x) {
    return unq(x.replace(/\(\s*\d+\s*\)\s*$/, "").replace(/\s+(ASC|DESC)\s*$/i, ""));
  });
}
function qi(name) {
  return '"' + String(name).replace(/"/g, '""') + '"';
}
var NAME = "(`[^`]+`|\"[^\"]+\"|[A-Za-z_][A-Za-z0-9_$]*)";

/* ---------- the tables ---------- */
// model: { name, cols: [{ name, def, ai }], pk: [names], uniq: [[names]], fks: [{ cols: [], ref: "t", refCols: [], tail: "" }] }

function cleanType(def) {
  return String(def || "")
    .replace(/\bUNSIGNED\b/gi, "")
    .replace(/\bZEROFILL\b/gi, "")
    .replace(/\bCOMMENT\s+'(?:[^']|'')*'/gi, "")
    .replace(/\bCHARACTER\s+SET\s+\w+/gi, "")
    .replace(/\bCHARSET\s+\w+/gi, "")
    .replace(/\bCOLLATE\s+\w+/gi, "")
    .replace(/\bON\s+UPDATE\s+CURRENT_TIMESTAMP(?:\(\))?/gi, "")
    .replace(/\b(ENUM|SET)\s*\([^)]*\)/gi, "TEXT")
    .replace(/\b(TINYTEXT|MEDIUMTEXT|LONGTEXT)\b/gi, "TEXT")
    .replace(/\bDATETIME\b/gi, "TEXT")
    .replace(/\s+/g, " ")
    .trim();
}

function parseFk(text) {
  var m = new RegExp("FOREIGN\\s+KEY\\s*(?:" + NAME + "\\s*)?\\(([^)]*)\\)\\s*REFERENCES\\s+" + NAME + "\\s*\\(([^)]*)\\)([^]*)$", "i").exec(text);
  if (!m) return null;
  return { cols: cols(m[2]), ref: unq(m[3]), refCols: cols(m[4]), tail: (m[5] || "").trim() };
}

// one column line ("`id` int(11) NOT NULL AUTO_INCREMENT") -> { name, def, ai, pk }
function parseColumn(item) {
  var m = new RegExp("^" + NAME + "\\s*([^]*)$").exec(item);
  if (!m) return null;
  var def = m[2] || "";
  var ai = /\bAUTO_?INCREMENT\b/i.test(def);
  var pk = /\bPRIMARY\s+KEY\b/i.test(def);
  def = def.replace(/\bAUTO_?INCREMENT\b(\s*=\s*\d+)?/gi, "").replace(/\bPRIMARY\s+KEY\b/gi, "");
  return { name: unq(m[1]), def: cleanType(def), ai: ai, pk: pk };
}

// "CREATE TABLE ..." -> a model (or null)
function parseCreate(stmt) {
  var m = new RegExp("^CREATE\\s+(?:TEMPORARY\\s+)?TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?(?:" + NAME + "\\s*\\.\\s*)?" + NAME + "\\s*\\(([^]*)\\)\\s*[^()]*$", "i").exec(stmt);
  if (!m) return null;
  var model = { name: unq(m[2]), cols: [], pk: [], uniq: [], fks: [] };
  splitTop(m[3]).forEach(function (item) {
    var u = item.replace(/\s+/g, " ");
    var mm;
    if ((mm = /^PRIMARY KEY\s*(?:USING \w+\s*)?\(([^)]*)\)/i.exec(u))) model.pk = cols(mm[1]);
    else if ((mm = /^(?:CONSTRAINT\s+\S+\s+)?UNIQUE(?:\s+(?:KEY|INDEX))?\s*(?:[`"\w]+\s*)?\(([^)]*)\)/i.exec(u))) model.uniq.push(cols(mm[1]));
    else if (/^(?:FULLTEXT\s+|SPATIAL\s+)?(?:KEY|INDEX)\b/i.test(u)) return;
    else if (/FOREIGN\s+KEY/i.test(u)) {
      var fk = parseFk(u);
      if (fk) model.fks.push(fk);
    } else if (/^CONSTRAINT\b/i.test(u)) return;
    else {
      var col = parseColumn(item);
      if (col) {
        model.cols.push({ name: col.name, def: col.def, ai: col.ai });
        if (col.pk) model.pk = [col.name];
      }
    }
  });
  return model.cols.length ? model : null;
}

// the CREATE TABLE of a model, in SQLite
export function createOf(model) {
  var lines = [];
  var single = model.pk.length === 1 ? model.pk[0] : "";
  model.cols.forEach(function (c) {
    if (single && c.name === single && c.ai) {
      lines.push(qi(c.name) + " INTEGER PRIMARY KEY AUTOINCREMENT");
    } else lines.push(qi(c.name) + (c.def ? " " + c.def : ""));
  });
  var autoPk = single && model.cols.some(function (c) {
    return c.name === single && c.ai;
  });
  if (model.pk.length && !autoPk) lines.push("PRIMARY KEY (" + model.pk.map(qi).join(", ") + ")");
  model.uniq.forEach(function (u) {
    lines.push("UNIQUE (" + u.map(qi).join(", ") + ")");
  });
  model.fks.forEach(function (f) {
    lines.push("FOREIGN KEY (" + f.cols.map(qi).join(", ") + ") REFERENCES " + qi(f.ref) + " (" + f.refCols.map(qi).join(", ") + ")" + (f.tail ? " " + f.tail : ""));
  });
  return "CREATE TABLE " + qi(model.name) + " (\n  " + lines.join(",\n  ") + "\n)";
}

/* ---------- the functions MySQL has and SQLite has not ---------- */
function two(n) {
  return (n < 10 ? "0" : "") + n;
}
function dateParts(v) {
  var d = v ? new Date(String(v).replace(" ", "T")) : new Date();
  return isNaN(d.getTime()) ? null : d;
}
function addFunctions(db) {
  var f = function (name, n, fn) {
    try {
      db.create_function(name, fn);
    } catch (e) {}
  };
  f("CONCAT", 0, function () {
    var a = Array.prototype.slice.call(arguments);
    return a.some(function (x) {
      return x === null;
    })
      ? null
      : a.join("");
  });
  f("CONCAT_WS", 0, function (sep) {
    return Array.prototype.slice.call(arguments, 1)
      .filter(function (x) {
        return x !== null;
      })
      .join(sep);
  });
  f("NOW", 0, function () {
    var d = new Date();
    return d.getFullYear() + "-" + two(d.getMonth() + 1) + "-" + two(d.getDate()) + " " + two(d.getHours()) + ":" + two(d.getMinutes()) + ":" + two(d.getSeconds());
  });
  f("CURDATE", 0, function () {
    var d = new Date();
    return d.getFullYear() + "-" + two(d.getMonth() + 1) + "-" + two(d.getDate());
  });
  f("CURTIME", 0, function () {
    var d = new Date();
    return two(d.getHours()) + ":" + two(d.getMinutes()) + ":" + two(d.getSeconds());
  });
  f("YEAR", 1, function (v) {
    var d = dateParts(v);
    return d ? d.getFullYear() : null;
  });
  f("MONTH", 1, function (v) {
    var d = dateParts(v);
    return d ? d.getMonth() + 1 : null;
  });
  f("DAY", 1, function (v) {
    var d = dateParts(v);
    return d ? d.getDate() : null;
  });
  f("DATEDIFF", 2, function (a, b) {
    var x = dateParts(a);
    var y = dateParts(b);
    return x && y ? Math.round((x - y) / 86400000) : null;
  });
  f("IF", 3, function (c, a, b) {
    return c && c !== "0" ? a : b;
  });
  f("IFNULL", 2, function (a, b) {
    return a === null ? b : a;
  });
  f("LEFT", 2, function (s, n) {
    return s === null ? null : String(s).slice(0, n);
  });
  f("RIGHT", 2, function (s, n) {
    return s === null ? null : n <= 0 ? "" : String(s).slice(-n);
  });
  f("LPAD", 3, function (s, n, p) {
    s = String(s);
    while (s.length < n && p) s = p + s;
    return s.slice(0, n);
  });
  f("RPAD", 3, function (s, n, p) {
    s = String(s);
    while (s.length < n && p) s = s + p;
    return s.slice(0, n);
  });
  f("FLOOR", 1, function (x) {
    return x === null ? null : Math.floor(x);
  });
  f("CEIL", 1, function (x) {
    return x === null ? null : Math.ceil(x);
  });
  f("CEILING", 1, function (x) {
    return x === null ? null : Math.ceil(x);
  });
  f("POW", 2, function (a, b) {
    return Math.pow(a, b);
  });
  f("POWER", 2, function (a, b) {
    return Math.pow(a, b);
  });
  f("SQRT", 1, function (x) {
    return x === null ? null : Math.sqrt(x);
  });
  f("MOD", 2, function (a, b) {
    return b ? a % b : null;
  });
  f("RAND", 0, function () {
    return Math.random();
  });
  f("CHAR_LENGTH", 1, function (s) {
    return s === null ? null : String(s).length;
  });
}

// a message a student can read (SQLite's own words are close to MySQL's, but not the same)
export function friendly(err) {
  var m = String((err && err.message) || err || "");
  var x;
  if ((x = /no such table: (.+)/i.exec(m))) return "Table inconnue : " + x[1];
  if ((x = /no such column: (.+)/i.exec(m))) return "Colonne inconnue : " + x[1];
  if ((x = /table (.+) already exists/i.exec(m))) return "La table " + x[1] + " existe déjà.";
  if (/UNIQUE constraint failed: (.+)/i.test(m)) return "Doublon : la valeur existe déjà (" + /failed: (.+)/i.exec(m)[1] + ").";
  if (/FOREIGN KEY constraint failed/i.test(m)) return "Clé étrangère : la ligne liée n’existe pas (ou elle est encore utilisée).";
  if (/NOT NULL constraint failed: (.+)/i.test(m)) return "Ce champ ne peut pas être vide : " + /failed: (.+)/i.exec(m)[1];
  if (/syntax error/i.test(m)) return "Erreur de syntaxe SQL : " + m.replace(/^.*?:\s*/, "");
  return m;
}

/* ---------- the engine ---------- */
export var ROWS_MAX = 1000;

// SQL: what loadSql() gives; dump: the saved text (or "")
export function createEngine(SQL, dump) {
  var db = new SQL.Database();
  addFunctions(db);
  var models = {}; // lower-case name -> model
  var order = []; // names, in creation order
  var dbName = "ma_base";
  var subs = [];

  function fire() {
    subs.forEach(function (fn) {
      try {
        fn();
      } catch (e) {}
    });
  }
  function low(s) {
    return String(s).toLowerCase();
  }
  function setModel(m) {
    if (!models[low(m.name)]) order.push(m.name);
    models[low(m.name)] = m;
  }
  function dropModel(name) {
    delete models[low(name)];
    order = order.filter(function (n) {
      return low(n) !== low(name);
    });
  }
  function rawRun(sql) {
    db.run(sql);
  }
  function tableExists(name) {
    var r = db.exec("SELECT 1 FROM sqlite_master WHERE type='table' AND lower(name)=" + "'" + low(name).replace(/'/g, "''") + "'");
    return !!(r.length && r[0].values.length);
  }
  // a table of the model is rebuilt: after ADD PRIMARY KEY, ADD FOREIGN KEY, MODIFY ... AUTO_INCREMENT on a table that has rows
  function rebuild(model, renames) {
    renames = renames || {}; // { newName: oldName }
    var old = model.name;
    var tmp = "__tmp_" + old;
    var have = [];
    var r = db.exec('PRAGMA table_info("' + old.replace(/"/g, '""') + '")');
    if (r.length)
      r[0].values.forEach(function (row) {
        have.push(row[1]);
      });
    var shared = model.cols.filter(function (c) {
      return have.indexOf(renames[c.name] || c.name) >= 0;
    });
    var copy = shared
      .map(function (c) {
        return qi(c.name);
      })
      .join(", ");
    var from = shared
      .map(function (c) {
        return qi(renames[c.name] || c.name);
      })
      .join(", ");
    rawRun("PRAGMA foreign_keys=OFF");
    try {
      var tm = { name: tmp, cols: model.cols, pk: model.pk, uniq: model.uniq, fks: model.fks };
      rawRun(createOf(tm));
      if (copy) rawRun("INSERT INTO " + qi(tmp) + " (" + copy + ") SELECT " + from + " FROM " + qi(old));
      rawRun("DROP TABLE " + qi(old));
      rawRun("ALTER TABLE " + qi(tmp) + " RENAME TO " + qi(old));
    } catch (e) {
      try {
        rawRun("DROP TABLE IF EXISTS " + qi(tmp));
      } catch (x) {}
      throw e;
    } finally {
      rawRun("PRAGMA foreign_keys=ON");
    }
  }

  // which other tables point to this column
  function referencedBy(table, col) {
    var out = [];
    order.forEach(function (n) {
      var m = models[low(n)];
      if (!m || low(m.name) === low(table)) return;
      m.fks.forEach(function (f) {
        if (low(f.ref) === low(table) && f.refCols.some(function (c) { return low(c) === low(col); }) && out.indexOf(m.name) < 0) out.push(m.name);
      });
    });
    return out;
  }
  function isIntType(def) {
    return /^\s*(TINYINT|SMALLINT|MEDIUMINT|BIGINT|INT|INTEGER)\b/i.test(def || "");
  }

  // spec: { name, type, notnull, ai, pk, fk: "table.col" | "" }. null col = a new column.
  // A column that other tables point to keeps its name, type and key (they would break); the rest can change.
  function editColumn(table, col, spec) {
    var model = models[low(table)];
    if (!model) throw new Error("no such table: " + table);
    var snap = JSON.parse(JSON.stringify(model));
    var c = col
      ? model.cols.filter(function (x) {
          return low(x.name) === low(col);
        })[0]
      : null;
    if (col && !c) throw new Error("no such column: " + col);
    var nname = String(spec.name || "").trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(nname)) throw new Error("Nom de colonne invalide (lettres, chiffres et _).");
    var type = String(spec.type || "").trim();
    if (!type) throw new Error("Choisis un type.");
    if (
      model.cols.some(function (x) {
        return x !== c && low(x.name) === low(nname);
      })
    )
      throw new Error("Une colonne « " + nname + " » existe déjà.");
    var refs = col ? referencedBy(table, col) : [];
    var wasPk = col ? model.pk.some(function (p) { return low(p) === low(col); }) : false;
    if (refs.length) {
      var oldType = (c.def || "").replace(/\s*NOT NULL.*/i, "").replace(/\s*DEFAULT.*/i, "").trim().toUpperCase();
      if (low(nname) !== low(col) || !spec.pk || (type.toUpperCase() !== oldType && oldType)) {
        throw new Error("La colonne « " + col + " » est utilisée par " + refs.join(", ") + " : son nom, son type et sa clé primaire ne peuvent pas changer.");
      }
    }
    if (spec.ai && !spec.pk) throw new Error("A_I (numéro automatique) demande une clé primaire.");
    if (spec.ai && !isIntType(type)) throw new Error("A_I ne marche qu’avec un type entier (INT).");
    var renames = {};
    try {
      if (!c) {
        c = { name: nname, def: "", ai: false };
        model.cols.push(c);
      } else if (low(nname) !== low(col)) {
        renames[nname] = c.name;
        model.pk = model.pk.map(function (p) { return low(p) === low(col) ? nname : p; });
        model.uniq = model.uniq.map(function (u) { return u.map(function (p) { return low(p) === low(col) ? nname : p; }); });
        model.fks.forEach(function (f) {
          f.cols = f.cols.map(function (p) { return low(p) === low(col) ? nname : p; });
        });
        c.name = nname;
      }
      var dflt = /\bDEFAULT\s+('(?:[^']|'')*'|[^\s,]+)/i.exec(c.def || "");
      c.def = type + (spec.notnull || spec.pk ? " NOT NULL" : "") + (dflt ? " DEFAULT " + dflt[1] : "");
      c.ai = !!spec.ai;
      var inPk = model.pk.some(function (p) { return low(p) === low(c.name); });
      if (spec.pk && !inPk) model.pk.push(c.name);
      if (!spec.pk && inPk) model.pk = model.pk.filter(function (p) { return low(p) !== low(c.name); });
      if (c.ai && model.pk.length !== 1) throw new Error("A_I demande une clé primaire sur cette seule colonne.");
      // links of this column: replaced by the chosen one
      model.fks = model.fks.filter(function (f) {
        return !(f.cols.length === 1 && low(f.cols[0]) === low(c.name));
      });
      if (spec.fk) {
        var pr = String(spec.fk).split(".");
        if (!models[low(pr[0])]) throw new Error("no such table: " + pr[0]);
        model.fks.push({ cols: [c.name], ref: models[low(pr[0])].name, refCols: [pr[1]], tail: "" });
      }
      rebuild(model, renames);
    } catch (e) {
      models[low(table)] = snap; // nothing changed
      throw e;
    }
    void wasPk;
    fire();
  }
  function dropColumn(table, col) {
    var model = models[low(table)];
    if (!model) throw new Error("no such table: " + table);
    var refs = referencedBy(table, col);
    if (refs.length) throw new Error("La colonne « " + col + " » est utilisée par " + refs.join(", ") + " : elle ne peut pas être supprimée.");
    if (model.cols.length < 2) throw new Error("Une table garde au moins une colonne.");
    var snap = JSON.parse(JSON.stringify(model));
    try {
      model.cols = model.cols.filter(function (x) { return low(x.name) !== low(col); });
      model.pk = model.pk.filter(function (p) { return low(p) !== low(col); });
      model.uniq = model.uniq.filter(function (u) { return !u.some(function (p) { return low(p) === low(col); }); });
      model.fks = model.fks.filter(function (f) { return !f.cols.some(function (p) { return low(p) === low(col); }); });
      rebuild(model);
    } catch (e) {
      models[low(table)] = snap;
      throw e;
    }
    fire();
  }

  // one ALTER TABLE statement on a table of the base (several clauses, comma separated)
  function alterNow(stmt) {
    var m = new RegExp("^ALTER\\s+TABLE\\s+(?:" + NAME + "\\s*\\.\\s*)?" + NAME + "\\s+([^]*)$", "i").exec(stmt);
    if (!m) throw new Error("ALTER TABLE non compris : " + stmt.slice(0, 60));
    var model = models[low(unq(m[2]))];
    if (!model) throw new Error("no such table: " + unq(m[2]));
    var needRebuild = false;
    splitTop(m[3]).forEach(function (clause) {
      var c = clause.replace(/\s+/g, " ").trim();
      var x;
      if ((x = /^ADD\s+PRIMARY\s+KEY\s*(?:USING \w+\s*)?\(([^)]*)\)/i.exec(c))) {
        model.pk = cols(x[1]);
        needRebuild = true;
      } else if ((x = /^ADD\s+(?:CONSTRAINT\s+\S+\s+)?UNIQUE(?:\s+(?:KEY|INDEX))?\s*(?:[`"\w]+\s*)?\(([^)]*)\)/i.exec(c))) {
        model.uniq.push(cols(x[1]));
        needRebuild = true;
      } else if (/^ADD\s+(?:FULLTEXT\s+|SPATIAL\s+)?(?:KEY|INDEX)\b/i.test(c)) {
        return;
      } else if (/^ADD\s+(?:CONSTRAINT\s+\S+\s+)?FOREIGN\s+KEY/i.test(c)) {
        var fk = parseFk(c);
        if (!fk) throw new Error("FOREIGN KEY non compris : " + c);
        model.fks.push(fk);
        needRebuild = true;
      } else if ((x = new RegExp("^(?:MODIFY|CHANGE)\\s+(?:COLUMN\\s+)?" + NAME + "\\s+([^]*)$", "i").exec(c))) {
        var name = unq(x[1]);
        var rest = x[2];
        var chg = /^CHANGE/i.test(c);
        var target = name;
        if (chg) {
          var y = new RegExp("^" + NAME + "\\s+([^]*)$").exec(rest);
          if (y) {
            target = unq(y[1]);
            rest = y[2];
          }
        }
        var col = model.cols.filter(function (cc) {
          return low(cc.name) === low(name);
        })[0];
        if (!col) throw new Error("no such column: " + name);
        var parsed = parseColumn(qi(target) + " " + rest);
        col.name = target;
        col.def = parsed.def;
        col.ai = parsed.ai;
        if (parsed.pk) model.pk = [target];
        if (target !== name) {
          model.pk = model.pk.map(function (p) {
            return low(p) === low(name) ? target : p;
          });
        }
        needRebuild = true;
      } else if ((x = new RegExp("^ADD\\s+(?:COLUMN\\s+)?(?!CONSTRAINT|PRIMARY|UNIQUE|KEY|INDEX|FOREIGN)" + NAME + "\\s+([^]*)$", "i").exec(c))) {
        var nc = parseColumn(qi(unq(x[1])) + " " + x[2]);
        model.cols.push({ name: nc.name, def: nc.def, ai: nc.ai });
        if (nc.pk) model.pk = [nc.name];
        needRebuild = true;
      } else if ((x = new RegExp("^DROP\\s+(?:COLUMN\\s+)?" + NAME + "$", "i").exec(c)) && !/^DROP\s+(PRIMARY|FOREIGN|KEY|INDEX)/i.test(c)) {
        var gone = unq(x[1]);
        model.cols = model.cols.filter(function (cc) {
          return low(cc.name) !== low(gone);
        });
        model.pk = model.pk.filter(function (p) {
          return low(p) !== low(gone);
        });
        needRebuild = true;
      } else if (/^DROP\s+PRIMARY\s+KEY/i.test(c)) {
        model.pk = [];
        needRebuild = true;
      } else if ((x = /^DROP\s+FOREIGN\s+KEY\s+(\S+)/i.exec(c))) {
        model.fks = []; // the constraint names are not kept: all the links of the table go
        needRebuild = true;
      } else if (/^DROP\s+(?:KEY|INDEX)\b/i.test(c) || /^AUTO_INCREMENT\s*=/i.test(c) || /^(ENGINE|DEFAULT CHARSET|CHARSET|COLLATE|COMMENT)\b/i.test(c)) {
        return;
      } else if ((x = new RegExp("^RENAME\\s+(?:TO\\s+|AS\\s+)?" + NAME + "$", "i").exec(c))) {
        var to = unq(x[1]);
        rawRun("ALTER TABLE " + qi(model.name) + " RENAME TO " + qi(to));
        dropModel(model.name);
        model.name = to;
        setModel(model);
      } else {
        throw new Error("ALTER TABLE : « " + c.slice(0, 50) + " » n’est pas pris en charge ici.");
      }
    });
    if (needRebuild) rebuild(model);
  }

  // a script (several statements): the phpMyAdmin ALTERs that follow the CREATEs are merged into them first
  function runScript(text, opts) {
    var stmts = splitScript(text);
    var result = null;
    var created = {};
    var pending = [];
    var alters = {};
    stmts.forEach(function (st) {
      var up = st.replace(/\s+/g, " ").toUpperCase();
      if (/^ALTER TABLE/.test(up)) {
        var nm = new RegExp("^ALTER\\s+TABLE\\s+(?:" + NAME + "\\s*\\.\\s*)?" + NAME, "i").exec(st);
        var key = nm ? low(unq(nm[2])) : "";
        (alters[key] = alters[key] || []).push(st);
      }
    });
    var needFkOff = stmts.length > 1;
    if (needFkOff) rawRun("PRAGMA foreign_keys=OFF");
    try {
      stmts.forEach(function (st) {
        var up = st.replace(/\s+/g, " ").toUpperCase();
        var m;
        if (/^(SET|START TRANSACTION|BEGIN|COMMIT|LOCK TABLES|UNLOCK TABLES|FLUSH|GRANT|REVOKE)\b/.test(up)) return;
        if ((m = new RegExp("^CREATE\\s+(?:DATABASE|SCHEMA)\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?" + NAME, "i").exec(st))) {
          dbName = unq(m[1]);
          return;
        }
        if ((m = new RegExp("^USE\\s+" + NAME, "i").exec(st))) {
          dbName = unq(m[1]);
          return;
        }
        if (/^DROP (DATABASE|SCHEMA)\b/.test(up)) {
          db.run("PRAGMA foreign_keys=OFF");
          order.slice().forEach(function (n) {
            rawRun("DROP TABLE IF EXISTS " + qi(n));
            dropModel(n);
          });
          return;
        }
        if (/^CREATE (TEMPORARY )?TABLE\b/.test(up)) {
          var model = parseCreate(st);
          if (!model) throw new Error("CREATE TABLE non compris : " + st.slice(0, 60));
          var exists = models[low(model.name)];
          if (exists && /IF NOT EXISTS/.test(up)) return;
          if (exists) throw new Error("table " + model.name + " already exists");
          // the ALTERs of this script that belong to this table, merged into the model
          var mine = alters[low(model.name)] || [];
          setModel(model);
          created[low(model.name)] = true;
          if (mine.length) {
            // done on the model alone: the table has no row yet
            mine.forEach(function (a) {
              var save = rebuild;
              applyAlterToModel(a, model);
            });
          }
          rawRun(createOf(model));
          return;
        }
        if (/^ALTER TABLE\b/.test(up)) {
          var nm2 = new RegExp("^ALTER\\s+TABLE\\s+(?:" + NAME + "\\s*\\.\\s*)?" + NAME, "i").exec(st);
          if (nm2 && created[low(unq(nm2[2]))]) return; // already merged into its CREATE TABLE
          alterNow(st);
          return;
        }
        if (/^DROP TABLE\b/.test(up)) {
          var tn = new RegExp("^DROP\\s+TABLE\\s+(?:IF\\s+EXISTS\\s+)?(?:" + NAME + "\\s*\\.\\s*)?" + NAME, "i").exec(st);
          if (tn) {
            var nameD = unq(tn[2]);
            if (!tableExists(nameD) && /IF EXISTS/.test(up)) {
              dropModel(nameD);
              return;
            }
            rawRun("DROP TABLE " + qi(nameD));
            dropModel(nameD);
            return;
          }
        }
        if (/^TRUNCATE\b/.test(up)) {
          var tt = new RegExp("^TRUNCATE\\s+(?:TABLE\\s+)?" + NAME, "i").exec(st);
          if (tt) {
            rawRun("DELETE FROM " + qi(unq(tt[1])));
            try {
              rawRun("DELETE FROM sqlite_sequence WHERE name=" + "'" + unq(tt[1]).replace(/'/g, "''") + "'");
            } catch (e) {}
            return;
          }
        }
        if (/^(SHOW TABLES|SHOW DATABASES)\b/.test(up)) {
          result = /DATABASES/.test(up)
            ? { cols: ["Database"], rows: [[dbName]], affected: 0 }
            : { cols: ["Tables_in_" + dbName], rows: order.map(function (n) { return [n]; }), affected: 0 };
          return;
        }
        if ((m = new RegExp("^(?:DESCRIBE|DESC|SHOW\\s+COLUMNS\\s+FROM)\\s+" + NAME, "i").exec(st))) {
          var info = structure(unq(m[1]));
          result = {
            cols: ["Field", "Type", "Null", "Key", "Extra"],
            rows: info.cols.map(function (c) {
              return [c.name, c.type, c.notnull ? "NO" : "YES", c.pk ? "PRI" : "", c.ai ? "auto_increment" : ""];
            }),
            affected: 0,
          };
          return;
        }
        // an ordinary statement
        var before = db.getRowsModified();
        var res = db.exec(st);
        if (res.length) {
          var r0 = res[res.length - 1];
          result = { cols: r0.columns, rows: r0.values, affected: 0 };
        } else result = { cols: [], rows: [], affected: db.getRowsModified() };
        if (/^(INSERT|REPLACE)\b/.test(up)) {
          var li = db.exec("SELECT last_insert_rowid()");
          result.lastId = li.length ? li[0].values[0][0] : 0;
        }
      });
    } finally {
      if (needFkOff) rawRun("PRAGMA foreign_keys=ON");
    }
    if (!opts || !opts.quiet) fire();
    return result || { cols: [], rows: [], affected: 0 };
  }

  // the ALTERs written after a CREATE TABLE of the same script: only the model changes
  function applyAlterToModel(stmt, model) {
    var tmp = JSON.parse(JSON.stringify(model));
    var saved = rebuild;
    // the same code as alterNow, without touching the database: the model is changed, the CREATE comes after
    var m = new RegExp("^ALTER\\s+TABLE\\s+(?:" + NAME + "\\s*\\.\\s*)?" + NAME + "\\s+([^]*)$", "i").exec(stmt);
    if (!m) return;
    splitTop(m[3]).forEach(function (clause) {
      var c = clause.replace(/\s+/g, " ").trim();
      var x;
      if ((x = /^ADD\s+PRIMARY\s+KEY\s*(?:USING \w+\s*)?\(([^)]*)\)/i.exec(c))) model.pk = cols(x[1]);
      else if ((x = /^ADD\s+(?:CONSTRAINT\s+\S+\s+)?UNIQUE(?:\s+(?:KEY|INDEX))?\s*(?:[`"\w]+\s*)?\(([^)]*)\)/i.exec(c))) model.uniq.push(cols(x[1]));
      else if (/^ADD\s+(?:FULLTEXT\s+|SPATIAL\s+)?(?:KEY|INDEX)\b/i.test(c)) return;
      else if (/^ADD\s+(?:CONSTRAINT\s+\S+\s+)?FOREIGN\s+KEY/i.test(c)) {
        var fk = parseFk(c);
        if (fk) model.fks.push(fk);
      } else if ((x = new RegExp("^(?:MODIFY|CHANGE)\\s+(?:COLUMN\\s+)?" + NAME + "\\s+([^]*)$", "i").exec(c))) {
        var col = model.cols.filter(function (cc) {
          return low(cc.name) === low(unq(x[1]));
        })[0];
        if (col) {
          var p = parseColumn(qi(col.name) + " " + x[2]);
          col.def = p.def;
          col.ai = p.ai;
          if (p.pk) model.pk = [col.name];
        }
      }
    });
    void tmp;
    void saved;
  }

  /* ---------- reading the base ---------- */
  function structure(name) {
    var model = models[low(name)];
    var r = db.exec('PRAGMA table_info("' + String(name).replace(/"/g, '""') + '")');
    var infos = r.length ? r[0].values : [];
    if (!infos.length) throw new Error("no such table: " + name);
    return {
      name: model ? model.name : name,
      cols: infos.map(function (row) {
        var cm = model
          ? model.cols.filter(function (c) {
              return low(c.name) === low(row[1]);
            })[0]
          : null;
        return { name: row[1], type: row[2] || "", notnull: !!row[3], dflt: row[4], pk: !!row[5], ai: !!(cm && cm.ai) };
      }),
      fks: model ? model.fks.slice() : [],
      uniq: model ? model.uniq.slice() : [],
    };
  }
  function count(name) {
    var r = db.exec("SELECT COUNT(*) FROM " + qi(name));
    return r.length ? r[0].values[0][0] : 0;
  }
  function page(name, offset, limit) {
    var r = db.exec("SELECT rowid AS __rid, * FROM " + qi(name) + " LIMIT " + (limit | 0) + " OFFSET " + (offset | 0));
    if (!r.length) {
      var s = structure(name);
      return { cols: s.cols.map(function (c) { return c.name; }), rows: [], ids: [] };
    }
    return {
      cols: r[0].columns.slice(1),
      rows: r[0].values.map(function (v) { return v.slice(1); }),
      ids: r[0].values.map(function (v) { return v[0]; }),
    };
  }

  /* ---------- the saved text ---------- */
  function lit(v) {
    if (v === null || v === undefined) return "NULL";
    if (typeof v === "number") return String(v);
    if (v instanceof Uint8Array) return "NULL";
    return "'" + String(v).replace(/'/g, "''") + "'";
  }
  function toDump() {
    var out = ["-- classek-db 1", "CREATE DATABASE `" + dbName.replace(/`/g, "") + "`;"];
    order.forEach(function (n) {
      var m = models[low(n)];
      if (!m) return;
      out.push(createOf(m) + ";");
    });
    order.forEach(function (n) {
      var m = models[low(n)];
      if (!m) return;
      var r = db.exec("SELECT * FROM " + qi(n));
      if (!r.length) return;
      var names = r[0].columns.map(qi).join(", ");
      r[0].values.forEach(function (row) {
        out.push("INSERT INTO " + qi(n) + " (" + names + ") VALUES (" + row.map(lit).join(", ") + ");");
      });
    });
    return out.join("\n") + "\n";
  }

  var api = {
    name: function () {
      return dbName;
    },
    tables: function () {
      return order
        .filter(function (n) {
          return models[low(n)];
        })
        .map(function (n) {
          return { name: models[low(n)].name, rows: count(n) };
        });
    },
    structure: structure,
    page: page,
    count: count,
    models: function () {
      return order.map(function (n) {
        return models[low(n)];
      });
    },
    // returns { cols, rows, affected, lastId } or throws
    run: function (sql, opts) {
      return runScript(sql, opts);
    },
    // rows as objects: for the page in the result frame, and (later) for PHP
    query: function (sql) {
      var r = runScript(sql);
      var rows = r.rows.slice(0, ROWS_MAX).map(function (v) {
        var o = {};
        r.cols.forEach(function (c, i) {
          o[c] = v[i];
        });
        return o;
      });
      return { rows: rows, cols: r.cols, affected: r.affected, lastId: r.lastId || 0 };
    },
    // a table made by the "Nouvelle table" form: a model
    editColumn: editColumn,
    dropColumn: dropColumn,
    referencedBy: referencedBy,
    createTable: function (model) {
      if (models[low(model.name)]) throw new Error("table " + model.name + " already exists");
      rawRun(createOf(model));
      setModel(model);
      fire();
    },
    toDump: toDump,
    onChange: function (fn) {
      subs.push(fn);
    },
    // the whole base again from a saved text (the tables are dropped first)
    load: function (text) {
      order.slice().forEach(function (n) {
        try {
          rawRun("DROP TABLE IF EXISTS " + qi(n));
        } catch (e) {}
        dropModel(n);
      });
      dbName = "ma_base";
      runScript(text, { quiet: true });
      fire();
    },
    close: function () {
      try {
        db.close();
      } catch (e) {}
    },
  };
  if (dump) {
    try {
      runScript(dump, { quiet: true });
    } catch (e) {
      console.warn("The saved database could not be read:", e);
    }
  }
  rawRun("PRAGMA foreign_keys=ON");
  return api;
}
