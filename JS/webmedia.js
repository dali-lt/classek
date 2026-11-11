/* Classek web media: the images, videos and sounds a student adds to a web exercise.

   They stay in this browser (IndexedDB), never sent anywhere. The result frame is sandboxed (its page has no origin of its own),
   so a file is given to it as a data: address, put in the page where the code names the file (src="logo.png", url(logo.png)...).

   A "scope" is the place the files belong to: one exercise, or one practical exam. */

export var MEDIA_FILE_MAX = 5 * 1024 * 1024; // one file
export var MEDIA_TOTAL_MAX = 30 * 1024 * 1024; // all the files of a scope
export var MEDIA_COUNT_MAX = 20;

// what the page accepts: pictures, videos and sounds only (never a page or a script; no SVG, which can carry a script)
var EXT = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  bmp: "image/bmp",
  ico: "image/x-icon",
  mp4: "video/mp4",
  webm: "video/webm",
  ogv: "video/ogg",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  oga: "audio/ogg",
  m4a: "audio/mp4",
  aac: "audio/aac",
};

export function kindOf(name) {
  var m = /\.([A-Za-z0-9]+)$/.exec(String(name || ""));
  var type = m ? EXT[m[1].toLowerCase()] : "";
  return type ? type.slice(0, type.indexOf("/")) : "";
}

// a name the code can write: letters, digits, - _ . only
export function cleanName(raw) {
  var base = String(raw || "").replace(/\\/g, "/");
  base = base.slice(base.lastIndexOf("/") + 1).trim();
  base = base.replace(/\s+/g, "-").replace(/[^A-Za-z0-9_.-]/g, "_");
  if (base.length > 60) {
    var dot = base.lastIndexOf(".");
    base = base.slice(0, 50) + (dot > 0 ? base.slice(dot) : "");
  }
  return base;
}

var dbPromise = null;
function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise(function (resolve) {
    try {
      var rq = window.indexedDB.open("classek-media", 1);
      rq.onupgradeneeded = function () {
        rq.result.createObjectStore("files", { keyPath: "id" });
      };
      rq.onsuccess = function () {
        resolve(rq.result);
      };
      rq.onerror = function () {
        resolve(null);
      };
    } catch (e) {
      resolve(null); // private window: the files live while the page is open
    }
  });
  return dbPromise;
}
function tx(db, mode, fn) {
  return new Promise(function (resolve) {
    if (!db) return resolve(null);
    try {
      var t = db.transaction("files", mode);
      var out = fn(t.objectStore("files"));
      t.oncomplete = function () {
        resolve(out && out.result !== undefined ? out.result : true);
      };
      t.onerror = t.onabort = function () {
        resolve(null);
      };
    } catch (e) {
      resolve(null);
    }
  });
}
function toDataUrl(blob) {
  return new Promise(function (resolve) {
    var r = new FileReader();
    r.onload = function () {
      resolve(String(r.result || ""));
    };
    r.onerror = function () {
      resolve("");
    };
    r.readAsDataURL(blob);
  });
}

var stores = {};
// the files of one scope: { items(), add(file), remove(name), onChange(fn), ready }
export function mediaStore(scope) {
  if (stores[scope]) return stores[scope];
  var list = []; // { name, kind, type, size, blob, url }
  var subs = [];
  function fire() {
    subs.forEach(function (fn) {
      try {
        fn();
      } catch (e) {}
    });
  }
  function put(rec) {
    var i = list.findIndex(function (x) {
      return x.name.toLowerCase() === rec.name.toLowerCase();
    });
    if (i >= 0) list[i] = rec;
    else list.push(rec);
    list.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }
  var api = {
    items: function () {
      return list.slice();
    },
    onChange: function (fn) {
      subs.push(fn);
    },
    // returns { name } or { error: "type" | "size" | "total" | "count" | "name" }
    add: async function (file) {
      var name = cleanName(file && file.name);
      var kind = kindOf(name);
      if (!name || !kind) return { error: "type" };
      if (file.type && !/^(image|video|audio)\//i.test(file.type)) return { error: "type" };
      if (/svg/i.test(file.type || "")) return { error: "type" };
      if (file.size > MEDIA_FILE_MAX) return { error: "size" };
      var others = list.filter(function (x) {
        return x.name.toLowerCase() !== name.toLowerCase();
      });
      if (others.length >= MEDIA_COUNT_MAX) return { error: "count" };
      var sum = others.reduce(function (n, x) {
        return n + x.size;
      }, 0);
      if (sum + file.size > MEDIA_TOTAL_MAX) return { error: "total" };
      var type = EXT[name.slice(name.lastIndexOf(".") + 1).toLowerCase()];
      var blob = file.slice(0, file.size, type);
      var rec = { name: name, kind: kind, type: type, size: file.size, blob: blob, url: await toDataUrl(blob) };
      if (!rec.url) return { error: "type" };
      put(rec);
      var db = await openDb();
      await tx(db, "readwrite", function (s) {
        return s.put({ id: scope + "/" + name.toLowerCase(), scope: scope, name: name, type: type, size: file.size, blob: blob });
      });
      fire();
      return { name: name };
    },
    remove: async function (name) {
      list = list.filter(function (x) {
        return x.name !== name;
      });
      var db = await openDb();
      await tx(db, "readwrite", function (s) {
        return s.delete(scope + "/" + name.toLowerCase());
      });
      fire();
    },
  };
  api.ready = (async function () {
    var db = await openDb();
    if (!db) return;
    var all = await new Promise(function (resolve) {
      try {
        var out = [];
        var rq = db.transaction("files", "readonly").objectStore("files").openCursor();
        rq.onsuccess = function () {
          var c = rq.result;
          if (!c) return resolve(out);
          if (c.value && c.value.scope === scope) out.push(c.value);
          c.continue();
        };
        rq.onerror = function () {
          resolve(out);
        };
      } catch (e) {
        resolve([]);
      }
    });
    for (var i = 0; i < all.length; i++) {
      var v = all[i];
      if (!v.blob || !kindOf(v.name)) continue;
      put({ name: v.name, kind: kindOf(v.name), type: v.type, size: v.size, blob: v.blob, url: await toDataUrl(v.blob) });
    }
    if (all.length) fire();
  })();
  stores[scope] = api;
  return api;
}

function esc(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// the page of the student with the files given to it: the name written in the code becomes the file itself
export function applyMedia(html, items) {
  if (!items || !items.length || !html) return html;
  var low = html.toLowerCase();
  items.forEach(function (it) {
    var n = it.name.toLowerCase();
    if (low.indexOf(n) < 0) return;
    // "logo.png", 'Images/logo.png', "./img/logo.png" (in an attribute or in a script), but never an address with a scheme
    html = html.replace(new RegExp("([\"'])((?:\\./)?(?:[A-Za-z0-9_.-]+/)*" + esc(it.name) + ")\\1", "gi"), function (all, q) {
      return q + it.url + q;
    });
    // url(logo.png) in a style
    html = html.replace(new RegExp("url\\(\\s*((?:\\./)?(?:[A-Za-z0-9_.-]+/)*" + esc(it.name) + ")\\s*\\)", "gi"), function () {
      return "url(" + it.url + ")";
    });
  });
  return html;
}

// the tag to write in the page for a file
export function snippetOf(it) {
  if (it.kind === "video") return '<video src="' + it.name + '" controls width="320"></video>';
  if (it.kind === "audio") return '<audio src="' + it.name + '" controls></audio>';
  return '<img src="' + it.name + '" alt="">';
}
