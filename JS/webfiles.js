/* Classek web files: the files of an HTML exercise (index.html + style.css, script.js, folders...).

   - the model of the files (names, folders, limits) and how it is saved inside the student's answer;
   - the page the browser would build from those files (assembleWeb);
   - the explorer ("Fichiers du projet"): a drawer, like the side bar of VS Code, to create a file or a folder, rename or delete one.

   Saved answer of an exercise (users/{uid}/answers/{chapterId}, items[exId].a):
     "0"   the text of index.html
     "1".. the text of each other file (the number is the id of the file, never reused)
     "fs"  the list of files and folders: {"f":[[1,"style.css"],[2,"css/app.css"]],"d":["css"],"n":3}
   An exercise saved before this existed has no "fs": its files come from the names in the statement. */

export var FS_MAX_FILES = 8; // files other than index.html
export var FS_MAX_DIRS = 6;
export var FS_MAX_DEPTH = 2; // folders inside folders

var SEG = /^[A-Za-z0-9_-]{1,30}$/;
var FILE_EXT = /^(html|css|js|php)$/i;

export function langOfName(name) {
  var m = /\.([A-Za-z0-9]+)$/.exec(String(name || ""));
  var e = m ? m[1].toLowerCase() : "";
  return e === "css" ? "css" : e === "js" ? "js" : e === "php" ? "php" : "html";
}

function normSlashes(raw) {
  return String(raw == null ? "" : raw)
    .trim()
    .replace(/\\/g, "/")
    .replace(/^(?:\.\/)+/, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
}

// a clean relative path, or an error code: empty | badname | dirdot | ext | depth
export function checkPath(raw, kind) {
  var p = normSlashes(raw);
  if (!p) return { error: "empty" };
  var parts = p.split("/");
  if ((kind === "dir" ? parts.length : parts.length - 1) > FS_MAX_DEPTH) return { error: "depth" };
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    var isFile = kind === "file" && i === parts.length - 1;
    if (!isFile) {
      if (!SEG.test(part)) return { error: hasDot(part) ? "dirdot" : "badname" };
      continue;
    }
    if (!/^[A-Za-z0-9_.-]+$/.test(part)) return { error: "badname" };
    var dot = part.lastIndexOf(".");
    if (dot < 1) return { error: "ext" };
    if (!SEG.test(part.slice(0, dot))) return { error: "badname" };
    if (!FILE_EXT.test(part.slice(dot + 1))) return { error: "ext" };
  }
  return { path: p };
}

// a name with a dot and nothing else wrong ("my.dir", "style.css" typed as a name), as opposed to ".." or a name with spaces
function hasDot(part) {
  return /[A-Za-z0-9_-]/.test(part) && /\./.test(part) && /^[A-Za-z0-9_.-]+$/.test(part);
}
function low(s) {
  return String(s).toLowerCase();
}
function parentsOf(path) {
  var parts = path.split("/");
  var out = [];
  for (var i = 1; i < parts.length; i++) out.push(parts.slice(0, i).join("/"));
  return out;
}
function dirName(path) {
  var i = path.lastIndexOf("/");
  return i < 0 ? "" : path.slice(0, i);
}
function fileAt(m, path) {
  for (var i = 0; i < m.files.length; i++) if (low(m.files[i].path) === low(path)) return m.files[i];
  return null;
}
function hasDir(m, path) {
  return m.dirs.some(function (d) {
    return low(d) === low(path);
  });
}
function taken(m, path) {
  return low(path) === "index.html" || !!fileAt(m, path) || hasDir(m, path);
}
function ensureDirs(m, path) {
  parentsOf(path).forEach(function (d) {
    if (!hasDir(m, d)) m.dirs.push(d);
  });
}

// the files of an exercise that has never been changed: the names its statement gives
export function fsNew(names) {
  var m = { files: [], dirs: [], n: 1 };
  (names || []).forEach(function (nm) {
    var c = checkPath(nm, "file");
    if (c.path && !taken(m, c.path) && m.files.length < FS_MAX_FILES) {
      m.files.push({ id: m.n++, path: c.path });
      ensureDirs(m, c.path);
    }
  });
  return m;
}

// the saved "fs" text (never trusted: every name is checked again)
export function fsParse(raw, names) {
  if (typeof raw !== "string" || !raw) return fsNew(names);
  try {
    var d = JSON.parse(raw);
    var m = { files: [], dirs: [], n: 1 };
    var maxId = 0;
    (Array.isArray(d.f) ? d.f : []).forEach(function (pair) {
      if (!Array.isArray(pair)) return;
      var id = pair[0];
      var c = checkPath(pair[1], "file");
      if (!Number.isInteger(id) || id < 1 || !c.path || taken(m, c.path) || m.files.length >= FS_MAX_FILES) return;
      if (
        m.files.some(function (f) {
          return f.id === id;
        })
      )
        return;
      m.files.push({ id: id, path: c.path });
      ensureDirs(m, c.path);
      if (id > maxId) maxId = id;
    });
    (Array.isArray(d.d) ? d.d : []).forEach(function (dp) {
      var c = checkPath(dp, "dir");
      if (!c.path || hasDir(m, c.path) || fileAt(m, c.path) || low(c.path) === "index.html") return;
      m.dirs.push(c.path);
      parentsOf(c.path).forEach(function (p) {
        if (!hasDir(m, p)) m.dirs.push(p);
      });
    });
    m.dirs = m.dirs.slice(0, FS_MAX_DIRS);
    m.n = Math.max(Number.isInteger(d.n) ? d.n : 1, maxId + 1, 1);
    return m;
  } catch (e) {
    return fsNew(names);
  }
}

export function fsToDraft(m) {
  return JSON.stringify({
    f: m.files.map(function (f) {
      return [f.id, f.path];
    }),
    d: m.dirs,
    n: m.n,
  });
}

export function fsClone(m) {
  return {
    files: m.files.map(function (f) {
      return { id: f.id, path: f.path };
    }),
    dirs: m.dirs.slice(),
    n: m.n,
  };
}

// each of these changes the model and returns { evt } (to tell the other windows) or { error }
export function fsAddFile(m, raw, parent) {
  var full = parent ? parent + "/" + normSlashes(raw) : raw;
  var c = checkPath(full, "file");
  if (c.error) return { error: c.error };
  if (taken(m, c.path)) return { error: "dup" };
  if (m.files.length >= FS_MAX_FILES) return { error: "limit" };
  var fresh = parentsOf(c.path).filter(function (d) {
    return !hasDir(m, d);
  });
  for (var i = 0; i < fresh.length; i++) if (fileAt(m, fresh[i])) return { error: "dup" };
  if (m.dirs.length + fresh.length > FS_MAX_DIRS) return { error: "limit" };
  var id = m.n++;
  m.files.push({ id: id, path: c.path });
  fresh.forEach(function (d) {
    m.dirs.push(d);
  });
  return { evt: { t: "file", id: id, path: c.path } };
}
export function fsAddDir(m, raw, parent) {
  var full = parent ? parent + "/" + normSlashes(raw) : raw;
  var c = checkPath(full, "dir");
  if (c.error) return { error: c.error };
  if (taken(m, c.path)) return { error: "dup" };
  var fresh = parentsOf(c.path)
    .concat([c.path])
    .filter(function (d) {
      return !hasDir(m, d);
    });
  for (var i = 0; i < fresh.length; i++) if (fileAt(m, fresh[i])) return { error: "dup" };
  if (m.dirs.length + fresh.length > FS_MAX_DIRS) return { error: "limit" };
  fresh.forEach(function (d) {
    m.dirs.push(d);
  });
  return { evt: { t: "dir", path: c.path } };
}
export function fsRemove(m, path, kind) {
  if (kind === "file") {
    var f = fileAt(m, path);
    if (!f) return { error: "none" };
    m.files = m.files.filter(function (x) {
      return x !== f;
    });
    return { evt: { t: "del", kind: "file", path: f.path, ids: [f.id] } };
  }
  if (!hasDir(m, path)) return { error: "none" };
  var pre = low(path) + "/";
  var ids = [];
  m.files = m.files.filter(function (x) {
    if (low(x.path).indexOf(pre) === 0) {
      ids.push(x.id);
      return false;
    }
    return true;
  });
  m.dirs = m.dirs.filter(function (d) {
    return low(d) !== low(path) && low(d).indexOf(pre) !== 0;
  });
  return { evt: { t: "del", kind: "dir", path: path, ids: ids } };
}
// a new name for a file (its extension stays the same) or for a folder: only the last part of the path changes.
// The id of a file stays, so its text, saved under that id, follows it.
export function fsRename(m, path, kind, rawBase) {
  var base = String(rawBase == null ? "" : rawBase).trim();
  if (!base) return { error: "empty" };
  if (!SEG.test(base)) return { error: hasDot(base) ? (kind === "file" ? "noext" : "dirdot") : "badname" };
  var dir = dirName(path);
  var oldLast = path.slice(path.lastIndexOf("/") + 1);
  var ext = kind === "file" ? oldLast.slice(oldLast.lastIndexOf(".")) : "";
  var to = (dir ? dir + "/" : "") + base + ext;
  if (to === path) return { same: true };
  var self = kind === "file" ? fileAt(m, path) : null;
  if (kind === "file" && !self) return { error: "none" };
  if (kind === "dir" && !hasDir(m, path)) return { error: "none" };
  // a name that only differs by upper/lower case from its own is allowed; any other name already used is not
  if (low(to) !== low(path) && taken(m, to)) return { error: "dup" };
  var evt = { t: "ren", kind: kind, path: path, to: to };
  if (self) {
    evt.id = self.id;
    self.path = to;
  } else {
    movePrefix(m, path, to);
  }
  return { evt: evt };
}
function movePrefix(m, from, to) {
  var pre = low(from) + "/";
  var swap = function (p) {
    if (low(p) === low(from)) return to;
    return low(p).indexOf(pre) === 0 ? to + p.slice(from.length) : p;
  };
  m.files.forEach(function (f) {
    f.path = swap(f.path);
  });
  m.dirs = m.dirs.map(swap);
}
// the same change, made by another window: harmless if the model already has it
export function fsApply(m, evt) {
  if (!evt) return;
  if (evt.t === "file") {
    if (
      !m.files.some(function (f) {
        return f.id === evt.id;
      })
    ) {
      m.files.push({ id: evt.id, path: evt.path });
      ensureDirs(m, evt.path);
    }
    if (evt.id >= m.n) m.n = evt.id + 1;
  } else if (evt.t === "dir") {
    if (!hasDir(m, evt.path)) m.dirs.push(evt.path);
    ensureDirs(m, evt.path);
  } else if (evt.t === "ren") {
    if (evt.kind === "file") {
      m.files.forEach(function (f) {
        if (f.id === evt.id) f.path = evt.to;
      });
    } else if (hasDir(m, evt.path)) {
      movePrefix(m, evt.path, evt.to);
    }
  } else if (evt.t === "del") {
    var ids = evt.ids || [];
    m.files = m.files.filter(function (f) {
      return ids.indexOf(f.id) < 0;
    });
    if (evt.kind === "dir") {
      var pre = low(evt.path) + "/";
      m.dirs = m.dirs.filter(function (d) {
        return low(d) !== low(evt.path) && low(d).indexOf(pre) !== 0;
      });
    }
  }
}

function byName(a, b) {
  return low(a).localeCompare(low(b));
}
// what is directly inside a folder ("" = the top)
export function fsChildren(m, dir) {
  return {
    dirs: m.dirs
      .filter(function (d) {
        return dirName(d) === dir;
      })
      .sort(byName),
    files: m.files
      .filter(function (f) {
        return dirName(f.path) === dir;
      })
      .sort(function (a, b) {
        return byName(a.path, b.path);
      }),
  };
}

/* ---------------- the page the browser would build ---------------- */
function attrOf(text, name) {
  var m = new RegExp("(?:^|[\\s\"'/])" + name + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s\"'>]+))", "i").exec(text);
  return m ? (m[1] !== undefined ? m[1] : m[2] !== undefined ? m[2] : m[3]) : null;
}
function normHref(h) {
  var s = String(h || "")
    .trim()
    .split("#")[0]
    .split("?")[0];
  while (/^\.\//.test(s)) s = s.slice(2);
  return s.replace(/^\/+/, "");
}
// list[0] is index.html; the other files replace the <link rel="stylesheet" href="..."> and <script src="..."> that point to them.
// A file that the page never links to is not applied, and neither is a link without rel="stylesheet": like in a real browser.
export function assembleWeb(list) {
  var html = String((list[0] && list[0].code) || "");
  var by = {};
  list.slice(1).forEach(function (f) {
    by[normHref(f.name)] = String(f.code || "");
  });
  html = html.replace(/<link\b[^>]*>/gi, function (tag) {
    var rel = attrOf(tag, "rel");
    var href = attrOf(tag, "href");
    if (rel === null || href === null || !/\bstylesheet\b/i.test(rel)) return tag;
    var k = normHref(href);
    if (!Object.prototype.hasOwnProperty.call(by, k) || !/\.css$/i.test(k)) return tag;
    return "<style>\n" + by[k].replace(/<\/style/gi, "<\\/style") + "\n</style>";
  });
  html = html.replace(/<script\b([^>]*)>\s*<\/script\s*>/gi, function (all, attrs) {
    var src = attrOf(attrs, "src");
    if (src === null) return all;
    var k = normHref(src);
    if (!Object.prototype.hasOwnProperty.call(by, k) || !/\.js$/i.test(k)) return all;
    return "<script>\n" + by[k].replace(/<\/script/gi, "<\\/script") + "\n</scr" + "ipt>";
  });
  return html;
}

/* ---------------- the explorer ---------------- */
var STR = {
  fr: {
    files: "Fichiers du projet",
    newFile: "Nouveau fichier",
    newDir: "Nouveau dossier",
    btnFile: "Fichier",
    btnDir: "Dossier",
    close: "Fermer",
    toggle: "Fichiers du projet",
    rename: "Renommer",
    more: "Options",
    del: "Supprimer",
    sure: "Sûr ?",
    holderFile: "nom.css",
    holderDir: "nom-du-dossier",
    holderRename: "nouveau nom",
    hintFile: "Le nom finit par .html, .css, .js ou .php",
    hintDir: "Un dossier s’écrit sans extension",
    hintRename: "Seul le nom change, pas l’extension",
    err: {
      empty: "Écris un nom.",
      badname: "Nom invalide : lettres, chiffres, - et _ seulement.",
      ext: "Le fichier doit finir par .html, .css, .js ou .php.",
      noext: "Écris seulement le nom : l’extension ne change pas.",
      dirdot: "Un dossier s’écrit sans extension (pas de point).",
      depth: "Trop de dossiers imbriqués (2 au maximum).",
      dup: "Ce nom existe déjà.",
      limit: "Nombre maximal de fichiers atteint.",
      none: "Introuvable.",
    },
  },
  ar: {
    files: "ملفات المشروع",
    newFile: "ملف جديد",
    newDir: "مجلد جديد",
    btnFile: "ملف",
    btnDir: "مجلد",
    close: "إغلاق",
    toggle: "ملفات المشروع",
    rename: "إعادة تسمية",
    more: "خيارات",
    del: "حذف",
    sure: "متأكد؟",
    holderFile: "nom.css",
    holderDir: "nom-du-dossier",
    holderRename: "الاسم الجديد",
    hintFile: "ينتهي الاسم بـ .html أو .css أو .js أو .php",
    hintDir: "اسم المجلد بدون امتداد",
    hintRename: "يتغير الاسم فقط، وليس الامتداد",
    err: {
      empty: "اكتب اسماً.",
      badname: "اسم غير صالح: حروف لاتينية وأرقام و - و _ فقط.",
      ext: "يجب أن ينتهي الملف بـ .html أو .css أو .js أو .php",
      noext: "اكتب الاسم فقط: الامتداد لا يتغير.",
      dirdot: "اسم المجلد بدون امتداد (بدون نقطة).",
      depth: "مجلدات متداخلة أكثر من اللازم (2 على الأكثر).",
      dup: "هذا الاسم موجود بالفعل.",
      limit: "وصلت إلى الحد الأقصى من الملفات.",
      none: "غير موجود.",
    },
  },
};

var cssDone = false;
function ensureCss() {
  if (cssDone || typeof document === "undefined") return;
  cssDone = true;
  try {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL("../CSS/webfiles.css?v=2", import.meta.url).href;
    document.head.append(link);
  } catch (e) {}
}

function h(tag, cls, text) {
  var n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}
var NS = "http://www.w3.org/2000/svg";
function svg(paths, width) {
  var s = document.createElementNS(NS, "svg");
  s.setAttribute("viewBox", "0 0 24 24");
  s.setAttribute("width", "17");
  s.setAttribute("height", "17");
  s.setAttribute("fill", "none");
  s.setAttribute("stroke", "currentColor");
  s.setAttribute("stroke-width", String(width || 1.9));
  s.setAttribute("stroke-linecap", "round");
  s.setAttribute("stroke-linejoin", "round");
  s.setAttribute("aria-hidden", "true");
  paths.forEach(function (d) {
    var p = document.createElementNS(NS, "path");
    p.setAttribute("d", d);
    s.append(p);
  });
  return s;
}
var FILE_PATHS = ["M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z", "M13 2v7h7"];
var DIR_PATHS = ["M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"];
var ICON = {
  tree: DIR_PATHS,
  newFile: FILE_PATHS.concat(["M12 18v-6M9 15h6"]),
  newDir: DIR_PATHS.concat(["M12 11v6M9 14h6"]),
  close: ["m6 6 12 12M18 6 6 18"], // the same cross as the one that closes the playground
  pencil: ["M12 20h9", "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"], // the pencil used elsewhere on the site
  trash: ["M3 6h18", "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6", "M10 11v6M14 11v6", "M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"],
  dots: ["M5 12h.01M12 12h.01M19 12h.01"],
  dir: DIR_PATHS,
  file: FILE_PATHS,
};

// opts: { model, lang, canEdit(), current() -> id, onOpen(id), onChange(evt), icon(path) -> trusted svg text (optional) }
export function fileExplorer(opts) {
  ensureCss();
  var S = STR[opts.lang === "ar" ? "ar" : "fr"];
  var model = opts.model;
  var sel = ""; // the folder where a new file or folder goes
  var adding = null; // { kind: "file" | "dir", parent }
  var renaming = null; // { kind, path }
  var menu = null; // { kind, path, left, top }: the little menu of the three dots
  var armed = ""; // the path whose "Supprimer" waits for a second click
  var armTimer = 0;
  var isOpen = false;
  var bar = null;
  var winEl = null;

  var drawer = h("aside", "fx");
  drawer.setAttribute("aria-label", S.files);
  drawer.setAttribute("aria-hidden", "true");
  drawer.setAttribute("dir", opts.lang === "ar" ? "rtl" : "ltr");
  var head = h("div", "fx-head");
  var title = h("span", "fx-title", S.files);
  // the same round cross as the one that closes the playground
  var bClose = h("button", "fx-x");
  bClose.type = "button";
  bClose.title = S.close;
  bClose.setAttribute("aria-label", S.close);
  bClose.append(svg(ICON.close, 2.2));
  head.append(title, bClose);
  // the two ways to create something: a file or a folder
  var toolsRow = h("div", "fx-tools");
  function toolBtn(cls, icon, label, text) {
    var b = h("button", "fx-btn " + cls);
    b.type = "button";
    b.title = label;
    b.setAttribute("aria-label", label);
    b.append(svg(ICON[icon]), h("span", "fx-btn-text", text));
    return b;
  }
  var bFile = toolBtn("fx-new-file", "newFile", S.newFile, S.btnFile);
  var bDir = toolBtn("fx-new-dir", "newDir", S.newDir, S.btnDir);
  toolsRow.append(bFile, bDir);
  var tree = h("ul", "fx-tree");
  tree.setAttribute("role", "tree");
  var hint = h("p", "fx-hint");
  hint.hidden = true;
  var err = h("p", "fx-err");
  err.setAttribute("role", "alert");
  err.hidden = true;
  var menuEl = h("div", "fx-menu");
  menuEl.setAttribute("role", "menu");
  menuEl.hidden = true;
  drawer.append(head, toolsRow, tree, hint, err, menuEl);

  var button = h("button", "pg-copy pg-fx-toggle");
  button.type = "button";
  button.title = S.toggle;
  button.setAttribute("aria-label", S.toggle);
  button.setAttribute("aria-expanded", "false");
  button.append(svg(ICON.tree));

  function canEdit() {
    return !opts.canEdit || !!opts.canEdit();
  }
  function showErr(code) {
    err.textContent = S.err[code] || S.err.badname;
    err.hidden = false;
  }
  function hideErr() {
    err.hidden = true;
    err.textContent = "";
  }
  // the icon of a file follows its language; a name that is not finished yet has the plain file icon
  function paintIcon(box, path) {
    box.textContent = "";
    var markup = opts.icon ? opts.icon(path) : "";
    if (markup) box.innerHTML = markup; // static, trusted SVG from the page
    else box.append(svg(ICON.file));
  }
  function iconFor(path) {
    var box = h("span", "fx-ico");
    paintIcon(box, path);
    return box;
  }
  function dirIcon() {
    var b = h("span", "fx-ico");
    b.append(svg(ICON.dir));
    return b;
  }
  function row(kind, path, depth) {
    var li = h("li", "fx-row is-" + kind);
    li.style.setProperty("--d", String(depth));
    li.setAttribute("role", "treeitem");
    li.setAttribute("data-path", path);
    if (menu && low(menu.path) === low(path)) li.classList.add("is-menu");
    return li;
  }
  function nameBtn(li, icon, text, onClick) {
    var b = h("button", "fx-name");
    b.type = "button";
    var t = h("span", "fx-text", text);
    t.setAttribute("dir", "ltr");
    b.append(icon, t);
    b.addEventListener("click", onClick);
    li.append(b);
    return b;
  }

  /* the three dots of a row and their little menu: Renommer, Supprimer */
  function closeMenu() {
    if (!menu) return;
    menu = null;
    armed = "";
    clearTimeout(armTimer);
    renderMenu();
    render();
  }
  function moreBtn(li, path, kind) {
    var b = h("button", "fx-more");
    b.type = "button";
    b.title = S.more;
    b.setAttribute("aria-label", S.more + " " + path);
    b.setAttribute("aria-haspopup", "menu");
    b.append(svg(ICON.dots, 3.2));
    b.addEventListener("click", function () {
      if (!canEdit()) return;
      if (menu && low(menu.path) === low(path)) {
        closeMenu();
        return;
      }
      var dr = drawer.getBoundingClientRect();
      var br = b.getBoundingClientRect();
      var mw = 176;
      var mh = 96;
      var left = Math.min(Math.max(8, br.right - dr.left - mw), Math.max(8, dr.width - mw - 8));
      var top = br.bottom - dr.top + 4;
      if (dr.height && top + mh > dr.height - 8) top = Math.max(8, br.top - dr.top - mh - 4); // not enough room below: above
      adding = null;
      renaming = null;
      hideErr();
      armed = "";
      clearTimeout(armTimer);
      menu = { kind: kind, path: path, left: left, top: top };
      render();
      renderMenu();
      var first = menuEl.querySelector("button");
      if (first) first.focus();
    });
    li.append(b);
  }
  function menuItem(cls, icon, text, onClick) {
    var b = h("button", "fx-item " + cls);
    b.type = "button";
    b.setAttribute("role", "menuitem");
    b.append(svg(ICON[icon]), h("span", "fx-item-text", text));
    b.addEventListener("click", onClick);
    return b;
  }
  function renderMenu() {
    menuEl.textContent = "";
    menuEl.hidden = !menu;
    if (!menu) return;
    menuEl.style.left = menu.left + "px";
    menuEl.style.top = menu.top + "px";
    var info = menu;
    menuEl.append(
      menuItem("fx-item-ren", "pencil", S.rename, function () {
        menu = null;
        startRename(info.kind, info.path);
        renderMenu();
      }),
      (function () {
        var del = menuItem("fx-item-del" + (armed === info.path ? " is-armed" : ""), "trash", armed === info.path ? S.sure : S.del, function () {
          if (!canEdit()) return;
          if (armed !== info.path) {
            // a first click asks "Sûr ?", a second one deletes
            armed = info.path;
            clearTimeout(armTimer);
            armTimer = setTimeout(function () {
              armed = "";
              renderMenu();
            }, 3000);
            renderMenu();
            var again = menuEl.querySelector(".fx-item-del");
            if (again) again.focus();
            return;
          }
          clearTimeout(armTimer);
          armed = "";
          menu = null;
          var r = fsRemove(model, info.path, info.kind);
          if (!r.error) {
            if (sel && (low(sel) === low(info.path) || low(sel).indexOf(low(info.path) + "/") === 0)) sel = "";
            render();
            renderMenu();
            if (opts.onChange) opts.onChange(r.evt);
          }
          render();
          renderMenu();
        });
        return del;
      })()
    );
  }

  // a text field in a row: Enter keeps it, Escape or leaving it cancels
  function inputRow(depth, icon, value, placeholder, label, onInput, onEnter) {
    var li = h("li", "fx-row fx-add");
    li.style.setProperty("--d", String(depth));
    var input = h("input", "fx-input");
    input.type = "text";
    input.maxLength = 64;
    input.spellcheck = false;
    input.value = value;
    input.placeholder = placeholder;
    input.setAttribute("autocapitalize", "off");
    input.setAttribute("autocomplete", "off");
    input.setAttribute("autocorrect", "off");
    input.setAttribute("dir", "ltr");
    input.setAttribute("aria-label", label);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        onEnter(input.value);
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        cancel();
      }
    });
    input.addEventListener("input", function () {
      hideErr();
      if (onInput) onInput(input.value);
    });
    input.addEventListener("blur", function () {
      setTimeout(function () {
        if ((adding || renaming) && document.activeElement !== input && !drawer.contains(document.activeElement)) cancel();
      }, 120);
    });
    li.append(icon, input);
    return li;
  }
  function addRow(depth) {
    var kind = adding.kind;
    var box = h("span", "fx-ico");
    if (kind === "dir") box.append(svg(ICON.dir));
    else paintIcon(box, ""); // the plain file icon, until the name ends with .html, .css, .js or .php
    return inputRow(
      depth,
      box,
      "",
      kind === "dir" ? S.holderDir : S.holderFile,
      kind === "dir" ? S.newDir : S.newFile,
      kind === "file"
        ? function (v) {
            paintIcon(box, /\.(html|css|js|php)$/i.test(v.trim()) ? v.trim() : "");
          }
        : null,
      submitAdd
    );
  }
  function renameRow(kind, path, depth) {
    var last = path.slice(path.lastIndexOf("/") + 1);
    var dot = kind === "file" ? last.lastIndexOf(".") : -1;
    var base = dot > 0 ? last.slice(0, dot) : last;
    var ext = dot > 0 ? last.slice(dot) : "";
    var li = inputRow(depth, kind === "file" ? iconFor(path) : dirIcon(), base, S.holderRename, S.rename + " " + path, null, submitRename);
    li.classList.add("fx-rename");
    if (ext) {
      var suffix = h("span", "fx-ext", ext); // the extension stays: it is shown, not editable
      suffix.setAttribute("dir", "ltr");
      li.append(suffix);
    }
    return li;
  }
  function submitAdd(value) {
    if (!adding || !canEdit()) return;
    var r = adding.kind === "dir" ? fsAddDir(model, value, adding.parent) : fsAddFile(model, value, adding.parent);
    if (r.error) {
      showErr(r.error);
      return;
    }
    adding = null;
    hideErr();
    render();
    if (opts.onChange) opts.onChange(r.evt);
    if (r.evt.t === "file" && opts.onOpen) opts.onOpen(r.evt.id); // the new file opens in the code window
    render();
  }
  function submitRename(value) {
    if (!renaming || !canEdit()) return;
    var info = renaming;
    var r = fsRename(model, info.path, info.kind, value);
    if (r.error) {
      showErr(r.error);
      return;
    }
    renaming = null;
    hideErr();
    if (r.same) {
      render();
      return;
    }
    if (info.kind === "dir" && sel && (low(sel) === low(info.path) || low(sel).indexOf(low(info.path) + "/") === 0)) sel = r.evt.to + sel.slice(info.path.length);
    render();
    if (opts.onChange) opts.onChange(r.evt);
    render();
  }
  function cancel() {
    adding = null;
    renaming = null;
    hideErr();
    render();
  }
  function startAdd(kind) {
    if (!canEdit()) return;
    hideErr();
    renaming = null;
    menu = null;
    armed = "";
    renderMenu();
    adding = { kind: kind, parent: sel };
    render();
    var input = tree.querySelector(".fx-input");
    if (input) input.focus();
  }
  function startRename(kind, path) {
    if (!canEdit()) return;
    adding = null;
    armed = "";
    clearTimeout(armTimer);
    renaming = { kind: kind, path: path };
    hideErr();
    render();
    var input = tree.querySelector(".fx-input");
    if (input) {
      input.focus();
      input.select();
    }
  }

  function render() {
    tree.textContent = "";
    drawer.classList.toggle("is-readonly", !canEdit());
    hint.hidden = !(adding || renaming);
    hint.textContent = adding ? (adding.kind === "dir" ? S.hintDir : S.hintFile) : renaming ? S.hintRename : "";
    var cur = opts.current ? opts.current() : 0;
    var top = row("file", "index.html", 0);
    top.classList.toggle("is-cur", cur === 0);
    top.classList.toggle("is-root-sel", sel === "");
    nameBtn(top, iconFor("index.html"), "index.html", function () {
      sel = "";
      if (opts.onOpen) opts.onOpen(0);
      render();
    });
    tree.append(top);
    if (adding && adding.parent === "") tree.append(addRow(0));
    (function walk(dir, depth) {
      var kids = fsChildren(model, dir);
      kids.dirs.forEach(function (d) {
        if (renaming && renaming.kind === "dir" && low(renaming.path) === low(d)) {
          tree.append(renameRow("dir", d, depth));
        } else {
          var li = row("dir", d, depth);
          li.classList.toggle("is-sel", low(sel) === low(d));
          nameBtn(li, dirIcon(), d.slice(d.lastIndexOf("/") + 1), function () {
            sel = low(sel) === low(d) ? dirName(d) : d;
            render();
          });
          moreBtn(li, d, "dir");
          tree.append(li);
        }
        if (adding && adding.parent === d) tree.append(addRow(depth + 1));
        walk(d, depth + 1);
      });
      kids.files.forEach(function (f) {
        if (renaming && renaming.kind === "file" && low(renaming.path) === low(f.path)) {
          tree.append(renameRow("file", f.path, depth));
          return;
        }
        var li = row("file", f.path, depth);
        li.classList.toggle("is-cur", cur === f.id);
        nameBtn(li, iconFor(f.path), f.path.slice(f.path.lastIndexOf("/") + 1), function () {
          sel = dirName(f.path);
          if (opts.onOpen) opts.onOpen(f.id);
          render();
        });
        moreBtn(li, f.path, "file");
        tree.append(li);
      });
    })("", 0);
  }

  // a click anywhere else closes the little menu, and a click outside the drawer closes the drawer
  function onDocDown(e) {
    var t = e.target;
    if (menu && !menuEl.contains(t) && !(t.closest && t.closest(".fx-more"))) closeMenu();
    if (isOpen && !drawer.contains(t) && !button.contains(t)) setOpen(false);
  }
  function setOpen(v) {
    v = !!v;
    if (v === isOpen) return;
    isOpen = v;
    drawer.classList.toggle("is-open", isOpen);
    drawer.setAttribute("aria-hidden", isOpen ? "false" : "true");
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    button.classList.toggle("is-on", isOpen);
    if (winEl) winEl.classList.toggle("fx-open", isOpen); // a short code window grows while the drawer is open
    if (isOpen) {
      if (bar && bar.offsetHeight) drawer.style.top = bar.offsetHeight + "px";
      document.addEventListener("pointerdown", onDocDown, true);
      render();
    } else {
      document.removeEventListener("pointerdown", onDocDown, true);
      if (menu) {
        menu = null;
        armed = "";
        clearTimeout(armTimer);
        renderMenu();
      }
      if (adding || renaming) cancel();
    }
  }
  button.addEventListener("click", function () {
    setOpen(!isOpen);
  });
  bClose.addEventListener("click", function () {
    setOpen(false);
    button.focus();
  });
  bFile.addEventListener("click", function () {
    startAdd("file");
  });
  bDir.addEventListener("click", function () {
    startAdd("dir");
  });
  drawer.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || !isOpen) return;
    e.stopPropagation(); // the playground behind must stay open
    if (menu) {
      var path = menu.path;
      closeMenu();
      var back = tree.querySelector('[data-path="' + path.replace(/"/g, "") + '"] .fx-more');
      if (back) back.focus();
      return;
    }
    setOpen(false);
    button.focus();
  });

  render();
  return {
    el: drawer,
    button: button,
    // the window the drawer belongs to: it opens over its code, under its title bar
    mount: function (win) {
      win.classList.add("has-fx");
      winEl = win;
      bar = win.querySelector(".pg-bar");
      win.append(drawer);
    },
    refresh: render,
    open: function () {
      setOpen(true);
    },
    close: function () {
      setOpen(false);
    },
    isOpen: function () {
      return isOpen;
    },
  };
}
