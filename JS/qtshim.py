"""Classek: a small PyQt5 look-alike that runs in the browser (Pyodide).

Only what the Bac programme uses: the windows are drawn as HTML in the result panel,
`uic.loadUi` reads a real Qt Designer .ui file. It is NOT Qt: always check on Thonny/PyQt5 before the exam.
PyQt6 is deliberately missing, like on the exam computers.
"""
import inspect
import re
import sys
import traceback
import types
import xml.etree.ElementTree as ET

import js

try:
    from pyodide.ffi import create_proxy
except ImportError:  # outside the browser (tests)
    def create_proxy(f):
        return f

_doc = js.document
_warned = set()
_timers = []
_windows = []


def _warn(msg):
    if msg not in _warned:
        _warned.add(msg)
        print("[Classek] " + msg, file=sys.stderr)


# ---------------------------------------------------------------- signals / slots
def _nparams(f):
    """How many positional arguments a slot accepts (None = any), like PyQt does."""
    try:
        n = 0
        for p in inspect.signature(f).parameters.values():
            if p.kind == p.VAR_POSITIONAL:
                return None
            if p.kind in (p.POSITIONAL_ONLY, p.POSITIONAL_OR_KEYWORD):
                n += 1
        return n
    except (TypeError, ValueError):
        return None


def _call(slot, *args):
    try:
        n = _nparams(slot)
        slot(*(args if n is None else args[:n]))
    except SystemExit:
        raise
    except Exception:
        et, ev, tb = sys.exc_info()
        traceback.print_exception(et, ev, tb.tb_next)  # tb_next: hide this helper


class _BoundSignal:
    def __init__(self):
        self._slots = []

    def connect(self, slot):
        self._slots.append(slot)

    def disconnect(self, slot=None):
        if slot is None:
            self._slots = []
        elif slot in self._slots:
            self._slots.remove(slot)

    def emit(self, *args):
        for s in list(self._slots):
            _call(s, *args)


class pyqtSignal:
    def __init__(self, *types_, **kw):
        self._name = None

    def __set_name__(self, owner, name):
        self._name = name

    def __get__(self, obj, cls=None):
        if obj is None:
            return self
        d = obj.__dict__.setdefault("_signals", {})
        if self._name not in d:
            d[self._name] = _BoundSignal()
        return d[self._name]


def pyqtSlot(*a, **k):
    return lambda f: f


# ---------------------------------------------------------------- constants and small value classes
class Qt:
    AlignLeft = 1
    AlignRight = 2
    AlignHCenter = 4
    AlignJustify = 8
    AlignTop = 32
    AlignBottom = 64
    AlignVCenter = 128
    AlignCenter = 132
    Unchecked = 0
    PartiallyChecked = 1
    Checked = 2
    Horizontal = 1
    Vertical = 2


_ENUMS = {
    "AlignLeft": 1, "AlignRight": 2, "AlignHCenter": 4, "AlignJustify": 8, "AlignTop": 32,
    "AlignBottom": 64, "AlignVCenter": 128, "AlignCenter": 132, "AlignLeading": 1, "AlignTrailing": 2,
    "Horizontal": 1, "Vertical": 2,
    "Normal": 0, "NoEcho": 1, "Password": 2, "PasswordEchoOnEdit": 3,
}


def _enum(v):
    """'Qt::AlignHCenter|Qt::AlignTop' -> 36 ; unknown names stay strings."""
    if not isinstance(v, str):
        return v
    total, ok = 0, True
    for part in v.split("|"):
        key = part.strip().split("::")[-1]
        if key in _ENUMS:
            total |= _ENUMS[key]
        else:
            ok = False
    return total if ok else v


class QRect:
    def __init__(self, x=0, y=0, w=0, h=0):
        self._v = (x, y, w, h)

    def x(self): return self._v[0]
    def y(self): return self._v[1]
    def width(self): return self._v[2]
    def height(self): return self._v[3]


class QSize:
    def __init__(self, w=0, h=0):
        self._w, self._h = w, h

    def width(self): return self._w
    def height(self): return self._h


class QPoint:
    def __init__(self, x=0, y=0):
        self._x, self._y = x, y

    def x(self): return self._x
    def y(self): return self._y


class QFont:
    Normal = 50
    Bold = 75

    def __init__(self, family="", pointSize=-1, weight=-1, italic=False):
        self._family, self._size, self._weight, self._italic = family, pointSize, weight, italic

    def setFamily(self, f): self._family = f
    def setPointSize(self, n): self._size = n
    def setBold(self, b): self._weight = 75 if b else 50
    def setItalic(self, b): self._italic = bool(b)
    def family(self): return self._family
    def pointSize(self): return self._size
    def bold(self): return self._weight >= 75

    def _css(self):
        s = []
        if self._family:
            s.append("font-family:'%s',sans-serif" % self._family)
        if self._size and self._size > 0:
            s.append("font-size:%spt" % self._size)
        if self._weight is not None and self._weight >= 0:
            s.append("font-weight:%s" % ("700" if self._weight >= 75 else "400"))
        if self._italic:
            s.append("font-style:italic")
        return ";".join(s)


class QColor:
    def __init__(self, r=0, g=0, b=0, a=255):
        if isinstance(r, str):
            self._hex = r
        else:
            self._hex = "#%02x%02x%02x" % (r, g, b)

    def name(self): return self._hex


class QPixmap:
    def __init__(self, path=""):
        self._path = path


class QIcon:
    def __init__(self, *a):
        pass


class QIntValidator:
    def __init__(self, lo=-2147483648, hi=2147483647, parent=None):
        self.lo, self.hi, self.kind = lo, hi, "int"


class QDoubleValidator:
    def __init__(self, lo=-1e300, hi=1e300, decimals=1000, parent=None):
        self.lo, self.hi, self.kind = lo, hi, "float"


# ---------------------------------------------------------------- base classes
class QObject:
    _kind = "QObject"

    def __init__(self, parent=None, *a, **k):
        self._parent = parent
        self._objname = ""
        self._proxies = []

    def objectName(self): return self._objname
    def setObjectName(self, n): self._objname = n
    def parent(self): return self._parent

    def __getattr__(self, name):
        # an unsimulated setter does nothing (and says so once); anything else is a real AttributeError
        if name.startswith("set") and name[3:4].isupper():
            def noop(*a, **k):
                _warn("%s.%s() n'est pas simulé ici (sans effet)." % (type(self).__name__, name))
            return noop
        raise AttributeError("'%s' object has no attribute '%s'" % (type(self).__name__, name))

    def _on(self, el, event, fn):
        p = create_proxy(fn)
        self._proxies.append(p)
        el.addEventListener(event, p)


def _decls(css, kind):
    """The declarations of a Qt style sheet that apply to this widget: 'color: red;' or 'QPushButton { color: red; }'."""
    css = css or ""
    if "{" not in css:
        return css
    out = []
    for sel, body in re.findall(r"([^{}]*)\{([^}]*)\}", css):
        sel = sel.strip()
        if sel in ("", "*", kind):
            out.append(body)
    return ";".join(out)


class QWidget(QObject):
    _kind = "QWidget"
    _tag = "div"

    def __init__(self, parent=None, *a, **k):
        QObject.__init__(self, parent)
        self._el = _doc.createElement(self._tag)
        self._el.className = "qt-w qt-" + self._kind
        self._top = parent is None
        self._flowing = False
        self._enabled = True
        self._visible = True
        self._css = ""
        self._font = ""
        self._title = ""
        self._applied = []
        if parent is not None and hasattr(parent, "_adopt"):
            parent._adopt(self)
        self._init()

    def _init(self):
        pass

    @property
    def _box(self):
        return self._el

    def _adopt(self, child):
        self._box.appendChild(child._el)

    # geometry
    def setGeometry(self, x, y=None, w=None, h=None):
        if isinstance(x, QRect):
            x, y, w, h = x._v
        self._geo = (x, y, w, h)
        s = self._el.style
        if not self._top:
            s.left, s.top = "%spx" % x, "%spx" % y
        s.width, s.height = "%spx" % w, "%spx" % h

    def geometry(self):
        return QRect(*getattr(self, "_geo", (0, 0, 640, 480)))

    def resize(self, w, h=None):
        if isinstance(w, QSize):
            w, h = w.width(), w.height()
        g = getattr(self, "_geo", (0, 0, w, h))
        self.setGeometry(g[0], g[1], w, h)

    def move(self, x, y):
        g = getattr(self, "_geo", (0, 0, 100, 30))
        self.setGeometry(x, y, g[2], g[3])

    def width(self): return self.geometry().width()
    def height(self): return self.geometry().height()
    def x(self): return self.geometry().x()
    def y(self): return self.geometry().y()
    def setFixedSize(self, w, h=None): self.resize(w, h)

    def _flow(self):
        """Inside a layout the widget is placed by the layout, not by its geometry."""
        self._flowing = True
        s = self._el.style
        s.position, s.left, s.top = "static", "", ""
        if not getattr(self, "_geo", None):
            s.width, s.height = "", ""

    # state
    def setEnabled(self, b):
        self._enabled = bool(b)
        self._apply_enabled()

    def _apply_enabled(self):
        self._el.classList.toggle("qt-off", not self._enabled)

    def isEnabled(self): return self._enabled

    def setVisible(self, b):
        self._visible = bool(b)
        if self._top:
            if b:
                _show_window(self)
            else:
                _hide_window(self)
        else:
            self._el.style.display = "" if b else "none"

    def show(self): self.setVisible(True)
    def hide(self): self.setVisible(False)
    def close(self): self.setVisible(False); return True
    def isVisible(self): return self._visible
    def setFocus(self, *a): pass
    def update(self): pass
    def repaint(self): pass
    def setToolTip(self, t): self._el.title = t
    def setWindowTitle(self, t): self._title = t
    def windowTitle(self): return self._title

    # look
    def setStyleSheet(self, css):
        self._css = css or ""
        self._restyle()

    def styleSheet(self): return self._css

    def setFont(self, f):
        self._font = f._css() if isinstance(f, QFont) else ""
        self._restyle()

    def _restyle(self):
        s = self._el.style
        for k in self._applied:
            s.removeProperty(k)
        self._applied = []
        css = (self._font + ";" if self._font else "") + _decls(self._css, self._kind)
        for decl in css.split(";"):
            if ":" in decl:
                k, v = decl.split(":", 1)
                k = k.strip()
                if k:
                    s.setProperty(k, v.strip())
                    self._applied.append(k)

    def setLayout(self, layout):
        layout._owner = self
        self._box.appendChild(layout._el)

    def layout(self): return getattr(self, "_layout", None)


# ---------------------------------------------------------------- windows
class QMainWindow(QWidget):
    _kind = "QMainWindow"

    def _init(self):
        self._el.classList.add("qt-main")
        self._status = None

    def _adopt(self, child):
        if child._kind == "QWidget":  # the central widget fills the window unless the .ui gives it a geometry
            s = child._el.style
            s.left, s.top, s.width, s.height = "0px", "0px", "100%", "100%"
        self._box.appendChild(child._el)

    def setCentralWidget(self, w):
        w._top = False
        self._adopt(w)

    def centralWidget(self): return getattr(self, "centralwidget", None)

    def statusBar(self):
        if self._status is None:
            self._status = QStatusBar(self)
        return self._status

    def setStatusBar(self, s): self._status = s
    def menuBar(self): return QMenuBar(self)
    def setMenuBar(self, m): pass


class QDialog(QWidget):
    _kind = "QDialog"
    Accepted = 1
    Rejected = 0

    accepted = pyqtSignal()
    rejected = pyqtSignal()
    finished = pyqtSignal(int)

    def exec_(self):
        self.show()
        return 0  # the browser cannot wait here: the window stays open and its slots keep working

    exec = exec_
    def open(self): self.show()
    def accept(self): self.hide(); self.accepted.emit(); self.finished.emit(1)
    def reject(self): self.hide(); self.rejected.emit(); self.finished.emit(0)
    def setModal(self, b): pass


class QStatusBar(QWidget):
    _kind = "QStatusBar"

    def _init(self):
        self._el.classList.add("qt-status")

    def showMessage(self, text, timeout=0):
        self._el.textContent = text

    def clearMessage(self): self._el.textContent = ""


class QMenuBar(QWidget):
    _kind = "QMenuBar"

    def _init(self):
        self._el.style.display = "none"

    def addMenu(self, *a): return QMenu()


class QMenu(QObject):
    def addAction(self, *a): return QAction()
    def addMenu(self, *a): return QMenu()
    def addSeparator(self): pass


class QAction(QObject):
    triggered = pyqtSignal(bool)

    def __init__(self, *a, **k):
        QObject.__init__(self)


class QApplication(QObject):
    _inst = None

    def __init__(self, argv=None, *a):
        QObject.__init__(self)
        QApplication._inst = self

    def exec_(self): return 0
    exec = exec_
    def quit(self): _close_all()
    def exit(self, code=0): _close_all()
    def processEvents(self): pass
    @staticmethod
    def instance(): return QApplication._inst
    def setStyle(self, *a): pass


# ---------------------------------------------------------------- layouts
class QLayout(QObject):
    _kind = "QLayout"

    def __init__(self, parent=None):
        QObject.__init__(self, None)
        self._el = _doc.createElement("div")
        self._el.className = "qt-layout qt-" + self._kind
        self._owner = None
        if parent is not None:
            parent.setLayout(self)

    def setSpacing(self, n): self._el.style.gap = "%spx" % n
    def setContentsMargins(self, l, t, r, b): self._el.style.padding = "%spx %spx %spx %spx" % (t, r, b, l)

    def addLayout(self, lay, *a):
        lay._el.style.position = "static"
        lay._el.style.flex = "1 1 auto"
        self._el.appendChild(lay._el)

    def addSpacing(self, n): self.addStretch()

    def addStretch(self, *a):
        sp = _doc.createElement("div")
        sp.style.flex = "1 1 auto"
        self._el.appendChild(sp)

    def addSpacer(self): self.addStretch()

    def addWidget(self, w, *a, **k):
        w._top = False
        w._flow()
        self._el.appendChild(w._el)
        self._place(w, a)

    def _place(self, w, a):
        pass


class QVBoxLayout(QLayout):
    _kind = "QVBoxLayout"


class QHBoxLayout(QLayout):
    _kind = "QHBoxLayout"


class QGridLayout(QLayout):
    _kind = "QGridLayout"

    def _place(self, w, a):
        row, col = (a + (0, 0))[:2] if a else (0, 0)
        rs = a[2] if len(a) > 2 else 1
        cs = a[3] if len(a) > 3 else 1
        s = w._el.style
        s.gridRow = "%d / span %d" % (row + 1, rs)
        s.gridColumn = "%d / span %d" % (col + 1, cs)


# ---------------------------------------------------------------- simple widgets
class QLabel(QWidget):
    _kind = "QLabel"

    def __init__(self, text="", parent=None, *a, **k):
        if not isinstance(text, str):
            text, parent = "", text
        QWidget.__init__(self, parent)
        self.setText(text)

    def _init(self):
        self._text = ""

    def setText(self, t):
        self._text = str(t)
        self._el.textContent = self._text

    def text(self): return self._text
    def clear(self): self.setText("")
    def setNum(self, n): self.setText(str(n))

    def setAlignment(self, a):
        a = _enum(a)
        h = "center" if a & 4 else "right" if a & 2 else "left"
        v = "center" if a & 128 else "flex-end" if a & 64 else "flex-start"
        s = self._el.style
        s.display, s.textAlign = "flex", h
        s.justifyContent = {"center": "center", "right": "flex-end", "left": "flex-start"}[h]
        s.alignItems = v

    def setWordWrap(self, b):
        self._el.style.whiteSpace = "normal" if b else "nowrap"

    def setPixmap(self, p): pass


class QAbstractButton(QWidget):
    clicked = pyqtSignal(bool)
    toggled = pyqtSignal(bool)
    pressed = pyqtSignal()
    released = pyqtSignal()

    def _init(self):
        self._text = ""
        self._checked = False
        self._checkable = False

    def text(self): return self._text
    def isChecked(self): return self._checked
    def setCheckable(self, b): self._checkable = bool(b)
    def setIcon(self, i): pass
    def click(self): getattr(self, "_inp", self._el).click()

    def setChecked(self, b):
        b = bool(b)
        if b != self._checked:
            self._checked = b
            self._sync_checked()
            self.toggled.emit(b)

    def _sync_checked(self):
        pass

    def _on_click(self, ev):
        if self._checkable and not self._enabled:
            return
        self.clicked.emit(self._checked)


class QPushButton(QAbstractButton):
    _kind = "QPushButton"
    _tag = "button"

    def __init__(self, text="", parent=None, *a, **k):
        if not isinstance(text, str):  # QPushButton(parent)
            text, parent = "", text
        QAbstractButton.__init__(self, parent)
        self.setText(text)

    def _init(self):
        QAbstractButton._init(self)
        self._on(self._el, "click", self._pressed)

    def _pressed(self, ev):
        if not self._enabled:
            return
        if self._checkable:
            self.setChecked(not self._checked)
        self.clicked.emit(self._checked)

    def setText(self, t):
        self._text = str(t)
        self._el.textContent = self._text

    def _apply_enabled(self):
        QWidget._apply_enabled(self)
        self._el.disabled = not self._enabled

    def _sync_checked(self):
        self._el.classList.toggle("qt-on", self._checked)


class _Check(QAbstractButton):
    _tag = "label"
    _type = "checkbox"

    def __init__(self, text="", parent=None, *a, **k):
        if not isinstance(text, str):
            text, parent = "", text
        QAbstractButton.__init__(self, parent)
        self.setText(text)

    def _init(self):
        QAbstractButton._init(self)
        self._checkable = True
        self._inp = _doc.createElement("input")
        self._inp.type = self._type
        self._span = _doc.createElement("span")
        self._el.appendChild(self._inp)
        self._el.appendChild(self._span)
        self._on(self._inp, "change", self._changed)

    def setText(self, t):
        self._text = str(t)
        self._span.textContent = self._text

    def _changed(self, ev):
        new = bool(self._inp.checked)
        if new != self._checked:
            self._checked = new
            self.toggled.emit(new)
            self._after_toggle()
        self.clicked.emit(new)

    def _after_toggle(self):
        pass

    def _sync_checked(self):
        self._inp.checked = self._checked

    def _apply_enabled(self):
        QWidget._apply_enabled(self)
        self._inp.disabled = not self._enabled


class QCheckBox(_Check):
    _kind = "QCheckBox"
    stateChanged = pyqtSignal(int)

    def _after_toggle(self):
        self.stateChanged.emit(2 if self._checked else 0)

    def checkState(self): return 2 if self._checked else 0
    def setCheckState(self, s): self.setChecked(s == 2)
    def setTristate(self, b): pass


class QRadioButton(_Check):
    _kind = "QRadioButton"
    _type = "radio"

    def _adopt_name(self):
        # radio buttons with the same parent exclude each other, like in Qt
        p = self._parent
        self._inp.name = "qt-radio-%d" % (id(p) if p is not None else 0)

    def __init__(self, text="", parent=None, *a, **k):
        _Check.__init__(self, text, parent)
        self._adopt_name()


class _Field(QWidget):
    """Common to the editable widgets."""

    def _apply_enabled(self):
        QWidget._apply_enabled(self)
        self._ctl.disabled = not self._enabled


class QLineEdit(_Field):
    _kind = "QLineEdit"
    Normal, NoEcho, Password, PasswordEchoOnEdit = 0, 1, 2, 3
    textChanged = pyqtSignal(str)
    textEdited = pyqtSignal(str)
    returnPressed = pyqtSignal()
    editingFinished = pyqtSignal()

    def __init__(self, text="", parent=None, *a, **k):
        if not isinstance(text, str):
            text, parent = "", text
        _Field.__init__(self, parent)
        self.setText(text)

    def _init(self):
        self._ctl = _doc.createElement("input")
        self._ctl.type = "text"
        self._el.appendChild(self._ctl)
        self._valid = None
        self._last = ""
        self._on(self._ctl, "input", self._input)
        self._on(self._ctl, "keydown", self._key)
        self._on(self._ctl, "change", lambda ev: self.editingFinished.emit())

    def _ok(self, v):
        if self._valid is None or v in ("", "-"):
            return True
        try:
            n = int(v) if self._valid.kind == "int" else float(v)
        except ValueError:
            return False
        return self._valid.lo <= n <= self._valid.hi

    def _input(self, ev):
        v = str(self._ctl.value)
        if not self._ok(v):
            self._ctl.value = self._last
            return
        self._last = v
        self.textEdited.emit(v)
        self.textChanged.emit(v)

    def _key(self, ev):
        if ev.key == "Enter":
            self.returnPressed.emit()

    def text(self): return str(self._ctl.value)

    def setText(self, t):
        t = str(t)
        self._last = t
        changed = t != str(self._ctl.value)
        self._ctl.value = t
        if changed:
            self.textChanged.emit(t)

    def clear(self): self.setText("")
    def setPlaceholderText(self, t): self._ctl.placeholder = t
    def setMaxLength(self, n): self._ctl.maxLength = n
    def setReadOnly(self, b): self._ctl.readOnly = bool(b)
    def setValidator(self, v): self._valid = v
    def selectAll(self): self._ctl.select()

    def setEchoMode(self, m):
        m = _enum(m)
        self._ctl.type = "password" if m in (2, 3) else "text"


class QTextEdit(_Field):
    _kind = "QTextEdit"
    textChanged = pyqtSignal()

    def _init(self):
        self._ctl = _doc.createElement("textarea")
        self._el.appendChild(self._ctl)
        self._on(self._ctl, "input", lambda ev: self.textChanged.emit())

    def toPlainText(self): return str(self._ctl.value)
    def setPlainText(self, t): self._ctl.value = str(t); self.textChanged.emit()
    def setText(self, t): self.setPlainText(t)
    def setHtml(self, t): self.setPlainText(re.sub(r"<[^>]+>", "", str(t)))
    def clear(self): self.setPlainText("")
    def setReadOnly(self, b): self._ctl.readOnly = bool(b)
    def setPlaceholderText(self, t): self._ctl.placeholder = t

    def append(self, t):
        cur = self.toPlainText()
        self.setPlainText(cur + ("\n" if cur else "") + str(t))

    def insertPlainText(self, t): self.setPlainText(self.toPlainText() + str(t))
    appendPlainText = append


class QPlainTextEdit(QTextEdit):
    _kind = "QPlainTextEdit"


class _Spin(_Field):
    valueChanged = pyqtSignal(int)
    _num = int

    def __init__(self, parent=None, *a, **k):
        _Field.__init__(self, parent)

    def _init(self):
        self._ctl = _doc.createElement("input")
        self._ctl.type = "number"
        self._min, self._max, self._step, self._v = self._lo(), self._hi(), self._st(), self._num(0)
        self._prefix = self._suffix = ""
        self._sync()
        self._el.appendChild(self._ctl)
        self._on(self._ctl, "input", self._input)

    def _lo(self): return 0
    def _hi(self): return 99
    def _st(self): return 1

    def _sync(self):
        self._ctl.min, self._ctl.max, self._ctl.step = self._min, self._max, self._step
        self._ctl.value = self._fmt(self._v)

    def _fmt(self, v): return str(v)

    def _clamp(self, v):
        return self._num(min(max(v, self._min), self._max))

    def _input(self, ev):
        try:
            v = self._clamp(float(self._ctl.value))
        except ValueError:
            return
        if v != self._v:
            self._v = v
            self.valueChanged.emit(v)

    def value(self): return self._v

    def setValue(self, v):
        v = self._clamp(v)
        changed = v != self._v
        self._v = v
        self._sync()
        if changed:
            self.valueChanged.emit(v)

    def setMinimum(self, v): self._min = self._num(v); self.setValue(self._v)
    def setMaximum(self, v): self._max = self._num(v); self.setValue(self._v)
    def setRange(self, lo, hi): self._min, self._max = self._num(lo), self._num(hi); self.setValue(self._v)
    def setSingleStep(self, s): self._step = s; self._sync()
    def minimum(self): return self._min
    def maximum(self): return self._max
    def setPrefix(self, p): self._prefix = p
    def setSuffix(self, s): self._suffix = s
    def setReadOnly(self, b): self._ctl.readOnly = bool(b)


class QSpinBox(_Spin):
    _kind = "QSpinBox"
    _num = int


class QDoubleSpinBox(_Spin):
    _kind = "QDoubleSpinBox"
    valueChanged = pyqtSignal(float)
    _num = float

    def _lo(self): return 0.0
    def _hi(self): return 99.99
    def _st(self): return 1.0

    def _init(self):
        self._dec = 2
        _Spin._init(self)

    def _fmt(self, v): return "%.*f" % (self._dec, v)
    def setDecimals(self, n): self._dec = n; self._sync()
    def decimals(self): return self._dec


class QSlider(_Field):
    _kind = "QSlider"
    valueChanged = pyqtSignal(int)

    def __init__(self, orient=1, parent=None, *a, **k):
        if not isinstance(orient, int):
            orient, parent = 1, orient
        _Field.__init__(self, parent)
        self.setOrientation(orient)

    def _init(self):
        self._ctl = _doc.createElement("input")
        self._ctl.type = "range"
        self._ctl.min, self._ctl.max, self._ctl.value = 0, 99, 0
        self._v = 0
        self._el.appendChild(self._ctl)
        self._on(self._ctl, "input", self._input)

    def _input(self, ev):
        v = int(float(self._ctl.value))
        if v != self._v:
            self._v = v
            self.valueChanged.emit(v)

    def value(self): return self._v

    def setValue(self, v):
        v = int(v)
        changed = v != self._v
        self._v = v
        self._ctl.value = v
        if changed:
            self.valueChanged.emit(v)

    def setMinimum(self, v): self._ctl.min = v
    def setMaximum(self, v): self._ctl.max = v
    def setRange(self, lo, hi): self._ctl.min, self._ctl.max = lo, hi
    def setSingleStep(self, s): self._ctl.step = s

    def setOrientation(self, o):
        self._vertical = _enum(o) == 2
        self._el.classList.toggle("qt-vert", self._vertical)


class QProgressBar(QWidget):
    _kind = "QProgressBar"
    valueChanged = pyqtSignal(int)

    def _init(self):
        self._ctl = _doc.createElement("progress")
        self._ctl.max, self._ctl.value = 100, 0
        self._v = 0
        self._el.appendChild(self._ctl)

    def value(self): return self._v

    def setValue(self, v):
        self._v = int(v)
        self._ctl.value = self._v
        self.valueChanged.emit(self._v)

    def setMaximum(self, v): self._ctl.max = v
    def setMinimum(self, v): pass
    def setRange(self, lo, hi): self._ctl.max = hi
    def setTextVisible(self, b): pass
    def reset(self): self.setValue(0)


class QLCDNumber(QWidget):
    _kind = "QLCDNumber"

    def _init(self):
        self._v = 0
        self._el.textContent = "0"

    def display(self, v):
        self._v = v
        self._el.textContent = str(v)

    def value(self): return self._v
    def intValue(self): return int(self._v)
    def setDigitCount(self, n): pass


class QGroupBox(QWidget):
    _kind = "QGroupBox"

    def __init__(self, title="", parent=None, *a, **k):
        if not isinstance(title, str):
            title, parent = "", title
        QWidget.__init__(self, parent)
        self.setTitle(title)

    def _init(self):
        self._cap = _doc.createElement("span")
        self._cap.className = "qt-gb-title"
        self._el.appendChild(self._cap)

    def setTitle(self, t):
        self._tt = str(t)
        self._cap.textContent = self._tt

    def title(self): return self._tt
    def setCheckable(self, b): pass


class QComboBox(_Field):
    _kind = "QComboBox"
    currentIndexChanged = pyqtSignal(int)
    currentTextChanged = pyqtSignal(str)
    activated = pyqtSignal(int)

    def _init(self):
        self._ctl = _doc.createElement("select")
        self._el.appendChild(self._ctl)
        self._items = []
        self._idx = -1
        self._on(self._ctl, "change", self._changed)

    def _render(self):
        self._ctl.replaceChildren()
        for t in self._items:
            o = _doc.createElement("option")
            o.textContent = t
            self._ctl.appendChild(o)
        if self._items:
            self._ctl.selectedIndex = self._idx

    def _changed(self, ev):
        self._set(int(self._ctl.selectedIndex))
        self.activated.emit(self._idx)

    def _set(self, i):
        i = i if -1 <= i < len(self._items) else self._idx
        if i != self._idx:
            self._idx = i
            self.currentIndexChanged.emit(i)
            self.currentTextChanged.emit(self.currentText())

    def addItem(self, text, *a):
        self._items.append(str(text))
        self._render()
        if self._idx == -1:
            self._set(0)
            self._render()

    def addItems(self, texts):
        for t in texts:
            self.addItem(t)

    def insertItem(self, i, text):
        self._items.insert(i, str(text))
        if self._idx == -1:
            self._idx = 0
        self._render()

    def removeItem(self, i):
        if 0 <= i < len(self._items):
            del self._items[i]
            self._idx = min(self._idx, len(self._items) - 1)
            self._render()

    def clear(self):
        self._items, self._idx = [], -1
        self._render()
        self.currentIndexChanged.emit(-1)

    def count(self): return len(self._items)
    def currentIndex(self): return self._idx
    def currentText(self): return self._items[self._idx] if 0 <= self._idx < len(self._items) else ""
    def itemText(self, i): return self._items[i] if 0 <= i < len(self._items) else ""
    def findText(self, t, *a): return self._items.index(t) if t in self._items else -1
    def setCurrentIndex(self, i): self._set(i); self._render()
    def setCurrentText(self, t): self.setCurrentIndex(self.findText(t))
    def setEditable(self, b): pass


class QListWidgetItem:
    def __init__(self, text="", *a):
        self._text = str(text)
        self._lw = None

    def text(self): return self._text

    def setText(self, t):
        self._text = str(t)
        if self._lw is not None:
            self._lw._render()


class QListWidget(QWidget):
    _kind = "QListWidget"
    itemClicked = pyqtSignal(object)
    itemDoubleClicked = pyqtSignal(object)
    currentRowChanged = pyqtSignal(int)
    currentTextChanged = pyqtSignal(str)
    itemSelectionChanged = pyqtSignal()

    def _init(self):
        self._items = []
        self._cur = -1

    def _render(self):
        self._el.replaceChildren()
        for i, it in enumerate(self._items):
            row = _doc.createElement("div")
            row.className = "qt-li" + (" qt-sel" if i == self._cur else "")
            row.textContent = it._text
            self._on(row, "click", lambda ev, i=i: self._pick(i, True))
            self._on(row, "dblclick", lambda ev, i=i: self.itemDoubleClicked.emit(self._items[i]))
            self._el.appendChild(row)

    def _pick(self, i, click=False):
        changed = i != self._cur
        self._cur = i
        self._render()
        if changed:
            self.currentRowChanged.emit(i)
            self.currentTextChanged.emit(self._items[i]._text if 0 <= i < len(self._items) else "")
            self.itemSelectionChanged.emit()
        if click and 0 <= i < len(self._items):
            self.itemClicked.emit(self._items[i])

    def addItem(self, it):
        it = it if isinstance(it, QListWidgetItem) else QListWidgetItem(it)
        it._lw = self
        self._items.append(it)
        self._render()

    def addItems(self, texts):
        for t in texts:
            self.addItem(t)

    def insertItem(self, i, it):
        it = it if isinstance(it, QListWidgetItem) else QListWidgetItem(it)
        it._lw = self
        self._items.insert(i, it)
        self._render()

    def takeItem(self, i):
        if not 0 <= i < len(self._items):
            return None
        it = self._items.pop(i)
        self._cur = min(self._cur, len(self._items) - 1)
        self._render()
        return it

    def clear(self):
        self._items, self._cur = [], -1
        self._render()

    def count(self): return len(self._items)
    def item(self, i): return self._items[i] if 0 <= i < len(self._items) else None
    def currentRow(self): return self._cur
    def currentItem(self): return self.item(self._cur)
    def setCurrentRow(self, i): self._pick(i)


class QTableWidgetItem:
    def __init__(self, text=""):
        self._text = str(text)

    def text(self): return self._text
    def setText(self, t): self._text = str(t)


class QTableWidget(QWidget):
    _kind = "QTableWidget"
    cellClicked = pyqtSignal(int, int)
    cellChanged = pyqtSignal(int, int)
    itemChanged = pyqtSignal(object)

    def __init__(self, *a, **k):
        parent = a[-1] if a and isinstance(a[-1], QObject) else None
        QWidget.__init__(self, parent)
        if len(a) >= 2 and isinstance(a[0], int):
            self.setRowCount(a[0])
            self.setColumnCount(a[1])

    def _init(self):
        self._rows, self._cols = 0, 0
        self._cells = {}
        self._hh, self._vh = [], []
        self._cr, self._cc = -1, -1
        self._tbl = _doc.createElement("table")
        self._el.appendChild(self._tbl)

    def _render(self):
        self._tbl.replaceChildren()
        head = _doc.createElement("tr")
        corner = _doc.createElement("th")
        head.appendChild(corner)
        for c in range(self._cols):
            th = _doc.createElement("th")
            th.textContent = (self._hh[c] if c < len(self._hh) else "") or str(c + 1)
            head.appendChild(th)
        self._tbl.appendChild(head)
        for r in range(self._rows):
            tr = _doc.createElement("tr")
            th = _doc.createElement("th")
            th.textContent = (self._vh[r] if r < len(self._vh) else "") or str(r + 1)
            tr.appendChild(th)
            for c in range(self._cols):
                td = _doc.createElement("td")
                td.contentEditable = "true"
                it = self._cells.get((r, c))
                td.textContent = it._text if it else ""
                if r == self._cr and c == self._cc:
                    td.className = "qt-sel"
                self._on(td, "input", lambda ev, r=r, c=c, td=td: self._edited(r, c, td))
                self._on(td, "focus", lambda ev, r=r, c=c: self._focus(r, c))
                tr.appendChild(td)
            self._tbl.appendChild(tr)

    def _edited(self, r, c, td):
        it = self._cells.get((r, c))
        if it is None:
            it = self._cells[(r, c)] = QTableWidgetItem("")
        it._text = str(td.textContent)
        self.cellChanged.emit(r, c)
        self.itemChanged.emit(it)

    def _focus(self, r, c):
        self._cr, self._cc = r, c
        self.cellClicked.emit(r, c)

    def setRowCount(self, n):
        self._rows = int(n)
        self._cells = {k: v for k, v in self._cells.items() if k[0] < self._rows}
        self._render()

    def setColumnCount(self, n):
        self._cols = int(n)
        self._cells = {k: v for k, v in self._cells.items() if k[1] < self._cols}
        self._render()

    def rowCount(self): return self._rows
    def columnCount(self): return self._cols
    def setItem(self, r, c, it): self._cells[(r, c)] = it; self._render()
    def item(self, r, c): return self._cells.get((r, c))
    def setHorizontalHeaderLabels(self, labels): self._hh = list(labels); self._render()
    def setVerticalHeaderLabels(self, labels): self._vh = list(labels); self._render()
    def currentRow(self): return self._cr
    def currentColumn(self): return self._cc
    def clearContents(self): self._cells = {}; self._render()
    def clear(self): self._cells = {}; self._render()

    def insertRow(self, i):
        self._cells = {((r + 1 if r >= i else r), c): v for (r, c), v in self._cells.items()}
        self._rows += 1
        self._render()

    def removeRow(self, i):
        self._cells = {((r - 1 if r > i else r), c): v for (r, c), v in self._cells.items() if r != i}
        self._rows = max(0, self._rows - 1)
        self._render()

    def horizontalHeader(self): return _Anything()
    def verticalHeader(self): return _Anything()


class _Anything:
    """horizontalHeader().setStretchLastSection(True) and friends: accepted, nothing to do."""

    def __getattr__(self, name):
        return lambda *a, **k: None


# ---------------------------------------------------------------- dialogs
class QMessageBox:
    Ok, Cancel, Yes, No, Close = 0x400, 0x400000, 0x4000, 0x10000, 0x200000
    Information, Warning, Critical, Question = 1, 2, 3, 4

    def __init__(self, *a):
        self._title, self._text = "", ""

    def setText(self, t): self._text = str(t)
    def setWindowTitle(self, t): self._title = str(t)
    def setIcon(self, i): pass
    def setInformativeText(self, t): self._text += "\n" + str(t)
    def setStandardButtons(self, b): pass
    def exec_(self): js.alert((self._title + "\n\n" if self._title else "") + self._text); return QMessageBox.Ok
    exec = exec_

    @staticmethod
    def _box(title, text):
        js.alert("%s\n\n%s" % (title, text))
        return QMessageBox.Ok

    @staticmethod
    def information(parent, title, text, *a): return QMessageBox._box(title, text)
    @staticmethod
    def warning(parent, title, text, *a): return QMessageBox._box(title, text)
    @staticmethod
    def critical(parent, title, text, *a): return QMessageBox._box(title, text)
    @staticmethod
    def about(parent, title, text): return QMessageBox._box(title, text)

    @staticmethod
    def question(parent, title, text, *a):
        return QMessageBox.Yes if js.confirm("%s\n\n%s" % (title, text)) else QMessageBox.No


class QInputDialog:
    @staticmethod
    def getText(parent, title, label, *a, **k):
        r = js.prompt("%s\n%s" % (title, label), "")
        return ("", False) if r is None else (str(r), True)

    @staticmethod
    def getInt(parent, title, label, value=0, *a, **k):
        r = js.prompt("%s\n%s" % (title, label), str(value))
        try:
            return (int(r), True)
        except (TypeError, ValueError):
            return (value, False)

    @staticmethod
    def getDouble(parent, title, label, value=0.0, *a, **k):
        r = js.prompt("%s\n%s" % (title, label), str(value))
        try:
            return (float(r), True)
        except (TypeError, ValueError):
            return (value, False)


class QFileDialog:
    @staticmethod
    def getOpenFileName(*a, **k):
        _warn("QFileDialog n'est pas simulé ici : écris le nom du fichier directement dans le code.")
        return ("", "")

    getSaveFileName = getOpenFileName


class QTimer(QObject):
    timeout = pyqtSignal()

    def __init__(self, parent=None):
        QObject.__init__(self, parent)
        self._id, self._single = None, False
        _timers.append(self)

    def setSingleShot(self, b): self._single = bool(b)
    def isActive(self): return self._id is not None

    def start(self, ms=None):
        self.stop()
        fn = create_proxy(self._tick)
        self._proxies.append(fn)
        self._id = js.setInterval(fn, ms or 0)

    def _tick(self, *a):
        if self._single:
            self.stop()
        self.timeout.emit()

    def stop(self):
        if self._id is not None:
            js.clearInterval(self._id)
            self._id = None

    @staticmethod
    def singleShot(ms, slot):
        t = QTimer()
        t.setSingleShot(True)
        t.timeout.connect(slot)
        t.start(ms)


# ---------------------------------------------------------------- the windows on screen



def _ensure_css():
    # the look lives in CSS/qtlook.css (student.html already links it: id "classek-qtlook"); load it if the page does not
    if _doc.getElementById("classek-qtlook") is None:
        lk = _doc.createElement("link")
        lk.id = "classek-qtlook"
        lk.rel = "stylesheet"
        lk.href = "CSS/qtlook.css?v=1"
        _doc.head.appendChild(lk)


def _host():
    h = getattr(js.window, "__qtHost", None)
    if h is None:
        raise RuntimeError("Classek: pas de zone d'affichage pour la fenêtre.")
    return h


def _show_window(w):
    if getattr(w, "_frame", None) is not None:
        return
    host = _host()
    host.classList.add("qt-host")
    frame = _doc.createElement("div")
    frame.className = "qt-win"
    bar = _doc.createElement("div")
    bar.className = "qt-bar"
    ttl = _doc.createElement("b")
    ttl.textContent = w._title or "Fenêtre"
    x = _doc.createElement("button")
    x.className = "qt-x"
    x.textContent = "×"
    x.title = "Fermer"
    w._on(x, "click", lambda ev: w.close())
    bar.appendChild(ttl)
    bar.appendChild(x)
    body = _doc.createElement("div")
    body.className = "qt-body"
    gw, gh = getattr(w, "_geo", (0, 0, 640, 480))[2:4]
    body.style.width, body.style.height = "%spx" % gw, "%spx" % gh
    w._el.style.position = "relative"
    w._el.style.width, w._el.style.height = "100%", "100%"
    w._el.classList.add("qt-top")
    body.appendChild(w._el)
    frame.appendChild(bar)
    frame.appendChild(body)
    host.appendChild(frame)
    w._frame = frame
    _windows.append(w)


def _hide_window(w):
    fr = getattr(w, "_frame", None)
    if fr is not None:
        fr.remove()
        w._frame = None
    w._visible = False
    if w in _windows:
        _windows.remove(w)


def _close_all():
    for w in list(_windows):
        _hide_window(w)


# ---------------------------------------------------------------- uic.loadUi : reads a real Qt Designer .ui file
_UI_CLASSES = {
    "QWidget": QWidget, "QMainWindow": QMainWindow, "QDialog": QDialog, "QLabel": QLabel,
    "QPushButton": QPushButton, "QToolButton": QPushButton, "QCheckBox": QCheckBox, "QRadioButton": QRadioButton,
    "QLineEdit": QLineEdit, "QTextEdit": QTextEdit, "QPlainTextEdit": QPlainTextEdit, "QSpinBox": QSpinBox,
    "QDoubleSpinBox": QDoubleSpinBox, "QComboBox": QComboBox, "QListWidget": QListWidget,
    "QTableWidget": QTableWidget, "QGroupBox": QGroupBox, "QSlider": QSlider, "QProgressBar": QProgressBar,
    "QLCDNumber": QLCDNumber, "QMenuBar": QMenuBar, "QStatusBar": QStatusBar, "QFrame": QWidget,
}
_LAYOUTS = {"QVBoxLayout": QVBoxLayout, "QHBoxLayout": QHBoxLayout, "QGridLayout": QGridLayout}
_LATE = ("value", "currentIndex", "checked")


def _val(v):
    t = v.tag
    if t == "string":
        return v.text or ""
    if t == "bool":
        return (v.text or "").strip() == "true"
    if t in ("number", "uint", "int"):
        return int(v.text)
    if t == "double":
        return float(v.text)
    if t in ("enum", "set"):
        return _enum((v.text or "").strip())
    if t == "rect":
        return tuple(int(v.find(k).text) for k in ("x", "y", "width", "height"))
    if t == "size":
        return (int(v.find("width").text), int(v.find("height").text))
    if t == "font":
        return {c.tag: (c.text or "") for c in v}
    if t == "stringlist":
        return [s.text or "" for s in v.findall("string")]
    return None


def _apply(obj, pnode):
    name = pnode.get("name")
    if len(pnode) == 0:
        return
    val = _val(pnode[0])
    if name == "geometry" and isinstance(val, tuple):
        obj.setGeometry(*val)
        return
    if name == "font" and isinstance(val, dict):
        f = QFont(val.get("family", ""), int(val.get("pointsize", -1) or -1), 75 if val.get("bold") == "true" else 50,
                  val.get("italic") == "true")
        obj.setFont(f)
        return
    setter = "set" + name[0].upper() + name[1:]
    if hasattr(type(obj), setter) and val is not None:
        getattr(obj, setter)(val)


def _build_widget(node, parent, base, owner):
    cname = node.get("class")
    name = node.get("name") or ""
    if base is not None and owner is None:
        obj = base
    else:
        cls = _UI_CLASSES.get(cname)
        if cls is None:
            _warn("Le widget %s (%s) n'est pas simulé : il est remplacé par un conteneur vide." % (name, cname))
            cls = QWidget
        obj = cls(parent)
    obj.setObjectName(name)
    if owner is None:
        owner = obj
    elif name:
        setattr(owner, name, obj)
    props = node.findall("property")
    props.sort(key=lambda p: p.get("name") in _LATE)
    for p in props:
        _apply(obj, p)
    for w in node.findall("widget"):
        _build_widget(w, obj, None, owner)
    for lay in node.findall("layout"):
        _build_layout(lay, obj, owner)
    _items(obj, node)
    return obj


def _build_layout(node, widget, owner, attach=True):
    cls = _LAYOUTS.get(node.get("class"), QVBoxLayout)
    lay = cls()
    if node.get("name"):
        setattr(owner, node.get("name"), lay)
    if attach:
        widget.setLayout(lay)
    for it in node.findall("item"):
        w = it.find("widget")
        if w is not None:
            ch = _build_widget(w, widget, None, owner)
            lay.addWidget(ch, int(it.get("row", 0)), int(it.get("column", 0)),
                          int(it.get("rowspan", 1)), int(it.get("colspan", 1)))
        elif it.find("layout") is not None:
            sub = _build_layout(it.find("layout"), widget, owner, attach=False)
            lay.addLayout(sub)
        elif it.find("spacer") is not None:
            lay.addSpacer()
    return lay


def _items(obj, node):
    """<item> children of a combo box / list, <column> and <row> of a table."""
    if isinstance(obj, (QComboBox, QListWidget)):
        for it in node.findall("item"):
            p = {q.get("name"): _val(q[0]) for q in it.findall("property") if len(q)}
            obj.addItem(p.get("text", ""))
    elif isinstance(obj, QTableWidget):
        cols = node.findall("column")
        rows = node.findall("row")
        obj.setColumnCount(len(cols))
        obj.setRowCount(len(rows))
        label = lambda n: next((_val(q[0]) for q in n.findall("property") if q.get("name") == "text" and len(q)), "")
        obj.setHorizontalHeaderLabels([label(c) for c in cols])
        obj.setVerticalHeaderLabels([label(r) for r in rows])
        for it in node.findall("item"):
            obj.setItem(int(it.get("row")), int(it.get("column")), QTableWidgetItem(label(it)))


def loadUi(path, baseinstance=None, *a, **k):
    try:
        root = ET.parse(path).getroot()
    except FileNotFoundError:
        raise FileNotFoundError("[Errno 2] No such file or directory: '%s' (le fichier .ui doit être dans le dossier de travail)" % path)
    top = root.find("widget")
    if top is None:
        raise ValueError("%s : fichier .ui invalide (aucun widget)" % path)
    return _build_widget(top, None, baseinstance, None)


# ---------------------------------------------------------------- install / run
def install():
    """Registers PyQt5 (and only PyQt5) so that the students' imports work."""
    def mod(name, **attrs):
        m = types.ModuleType(name)
        m.__dict__.update(attrs)
        sys.modules[name] = m
        return m

    widgets = {c.__name__: c for c in (
        QWidget, QMainWindow, QDialog, QApplication, QLabel, QPushButton, QCheckBox, QRadioButton, QLineEdit, QTextEdit,
        QPlainTextEdit, QSpinBox, QDoubleSpinBox, QComboBox, QListWidget, QListWidgetItem, QTableWidget,
        QTableWidgetItem, QGroupBox, QSlider, QProgressBar, QLCDNumber, QMessageBox, QInputDialog, QFileDialog,
        QVBoxLayout, QHBoxLayout, QGridLayout, QStatusBar, QMenuBar, QMenu, QAction)}
    pkg = mod("PyQt5")
    pkg.__path__ = []
    core = mod("PyQt5.QtCore", Qt=Qt, QTimer=QTimer, QObject=QObject, QRect=QRect, QSize=QSize, QPoint=QPoint,
               pyqtSignal=pyqtSignal, pyqtSlot=pyqtSlot, PYQT_VERSION_STR="5.15")
    gui = mod("PyQt5.QtGui", QFont=QFont, QColor=QColor, QPixmap=QPixmap, QIcon=QIcon,
              QIntValidator=QIntValidator, QDoubleValidator=QDoubleValidator)
    wid = mod("PyQt5.QtWidgets", **widgets)
    uic = mod("PyQt5.uic", loadUi=loadUi)
    pkg.QtCore, pkg.QtGui, pkg.QtWidgets, pkg.uic = core, gui, wid, uic
    _ensure_css()


def reset():
    """Before each run: stop the timers, close the windows, forget the one-time notes."""
    for t in list(_timers):
        t.stop()
    del _timers[:]
    _close_all()
    _warned.clear()
    QApplication._inst = None


def run(src, filename):
    """Runs the student's file like `python file.py`; errors are printed as a normal traceback."""
    g = {"__name__": "__main__", "__file__": filename}
    try:
        exec(compile(src, filename, "exec"), g)
    except SystemExit:
        pass
    except BaseException:
        et, ev, tb = sys.exc_info()
        traceback.print_exception(et, ev, tb.tb_next)  # tb_next: hide this helper
    return g
