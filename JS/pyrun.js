/* Classek: runs the Python of a practical exam of Programmation in the browser (Pyodide).

   Pyodide is loaded once, only when the student first clicks "Exécuter" (about 10 MB, then cached by the browser).
   JS/qtshim.py is a small PyQt5 look-alike (QApplication, uic.loadUi, QPushButton...): the windows are drawn as HTML in the result panel.
   The files of the exam (the .py files and the .ui files) are written in the working folder before each run, so that
   `import Evaluation` and `loadUi("interface.ui")` find them, exactly like in Thonny. */

var PY_BASE = window.PYODIDE_BASE || "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
var SHIM_DIR = "/opt/classek";
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

// Python + the PyQt5 look-alike (once)
export function getPython(setStatus) {
  if (pyReady) return pyReady;
  pyReady = (async function () {
    setStatus("loadPython");
    if (!window.loadPyodide) await loadScript(PY_BASE + "pyodide.js");
    var py = await window.loadPyodide({ indexURL: PY_BASE });
    var shim = await (await fetch(new URL("./qtshim.py?v=1", import.meta.url).href)).text();
    py.FS.mkdirTree(SHIM_DIR);
    py.FS.writeFile(SHIM_DIR + "/_classek_qt.py", shim);
    py.runPython("import sys\nsys.path.append('" + SHIM_DIR + "')");
    return py;
  })();
  pyReady.catch(function () {
    pyReady = null;
  });
  return pyReady;
}

var busy = false;

/* opts: { files: [{ name, code }], main: name of the file to run, host: the element the windows are drawn in,
           onOut(text, isError), setStatus(key) }
   Resolves when the script has finished (its windows stay alive: their buttons keep working). */
export async function runPython(opts) {
  if (busy) return;
  busy = true;
  try {
    var py = await getPython(opts.setStatus || function () {});
    window.__qtHost = opts.host;
    py.setStdout({
      batched: function (s) {
        opts.onOut(s + "\n", false);
      },
    });
    py.setStderr({
      batched: function (s) {
        opts.onOut(s + "\n", true);
      },
    });
    opts.files.forEach(function (f) {
      py.FS.writeFile("/home/pyodide/" + f.name, f.code);
    });
    var main = opts.files.filter(function (f) {
      return f.name === opts.main;
    })[0];
    if (!main) throw new Error("Fichier introuvable : " + opts.main);
    // a fresh run: the modules of the student imported by the previous run are forgotten, the old windows are closed
    py.globals.set(
      "_names",
      py.toPy(
        opts.files.map(function (f) {
          return f.name.replace(/\.py$/, "");
        })
      )
    );
    py.globals.set("_src", main.code);
    py.globals.set("_fn", main.name);
    await py.runPythonAsync(
      [
        "import sys, os",
        "os.chdir('/home/pyodide')",
        "for _m in list(sys.modules):",
        "    if _m in _names: del sys.modules[_m]",
        "import _classek_qt as _q",
        "_q.reset()",
        "_q.install()",
        "_q.run(_src, _fn)",
        "None",
      ].join("\n")
    );
  } catch (e) {
    opts.onOut(String((e && e.message) || e) + "\n", true);
  } finally {
    busy = false;
  }
}
