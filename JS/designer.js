/* Classek: a small Qt Designer look-alike for the practical exams of Programmation.

   The student draws the window like in the real software: a widget box on the left (drag a widget onto the form, or click it),
   the form in the middle (move, resize, double-click to edit a text, Delete, arrows, Ctrl+Z / Ctrl+Y), the object inspector and the
   property editor on the right (objectName is the name used in the Python code: self.mon_bouton, fenetre.zone_texte...).
   What it writes is a real .ui file: JS/qtshim.py runs it in the browser, and Thonny/Qt Designer can open it (import / export).

   What it does not do (yet): layouts (a .ui that uses them is kept untouched, read-only), menus, tabs.
   The look of the form is CSS/qtlook.css (the same as the result of "Exécuter"), the look of the tool is CSS/designer.css. */

var GRID = 8;
var MIN_SIZE = 8;
var RESERVED = ["centralwidget", "menubar", "statusbar"];

var CLASSES = {
  QPushButton: { glyph: "OK", label: "Push Button", base: "pushButton", w: 104, h: 32 },
  QCheckBox: { glyph: "☑", label: "Check Box", base: "checkBox", w: 104, h: 24 },
  QRadioButton: { glyph: "◉", label: "Radio Button", base: "radioButton", w: 120, h: 24 },
  QLineEdit: { glyph: "I", label: "Line Edit", base: "lineEdit", w: 152, h: 28 },
  QTextEdit: { glyph: "¶", label: "Text Edit", base: "textEdit", w: 184, h: 96 },
  QSpinBox: { glyph: "1↕", label: "Spin Box", base: "spinBox", w: 80, h: 28 },
  QDoubleSpinBox: { glyph: "1.5", label: "Double Spin Box", base: "doubleSpinBox", w: 96, h: 28 },
  QComboBox: { glyph: "▾", label: "Combo Box", base: "comboBox", w: 136, h: 28 },
  QSlider: { glyph: "⊸", label: "Horizontal Slider", base: "horizontalSlider", w: 160, h: 24 },
  QLabel: { glyph: "A", label: "Label", base: "label", w: 96, h: 24 },
  QProgressBar: { glyph: "▰", label: "Progress Bar", base: "progressBar", w: 152, h: 24 },
  QLCDNumber: { glyph: "88", label: "LCD Number", base: "lcdNumber", w: 96, h: 32 },
  QListWidget: { glyph: "☰", label: "List Widget", base: "listWidget", w: 168, h: 112 },
  QTableWidget: { glyph: "▦", label: "Table Widget", base: "tableWidget", w: 272, h: 136 },
  QGroupBox: { glyph: "▭", label: "Group Box", base: "groupBox", w: 208, h: 128 },
};
var GROUPS = [
  ["buttons", ["QPushButton", "QCheckBox", "QRadioButton"]],
  ["inputs", ["QLineEdit", "QTextEdit", "QSpinBox", "QDoubleSpinBox", "QComboBox", "QSlider"]],
  ["display", ["QLabel", "QProgressBar", "QLCDNumber"]],
  ["items", ["QListWidget", "QTableWidget"]],
  ["containers", ["QGroupBox"]],
];
var TEXT_KEY = { QPushButton: "text", QCheckBox: "text", QRadioButton: "text", QLabel: "text", QGroupBox: "title" };
var FORMS = { QMainWindow: [800, 600], QWidget: [400, 300], QDialog: [400, 300] };
// what the editor handles itself; every other property of a .ui is kept as it is
var HANDLED = {
  _all: ["geometry", "enabled", "styleSheet", "font"],
  QPushButton: ["text"],
  QCheckBox: ["text", "checked"],
  QRadioButton: ["text", "checked"],
  QLabel: ["text", "alignment"],
  QGroupBox: ["title"],
  QLineEdit: ["placeholderText", "echoMode", "readOnly"],
  QTextEdit: ["plainText", "readOnly"],
  QSpinBox: ["minimum", "maximum", "value", "readOnly"],
  QDoubleSpinBox: ["minimum", "maximum", "value", "decimals", "readOnly"],
  QComboBox: [],
  QSlider: ["minimum", "maximum", "value", "orientation"],
  QProgressBar: ["minimum", "maximum", "value"],
  QLCDNumber: [],
  QListWidget: [],
  QTableWidget: [],
};
var ALIGN = {
  left: "Qt::AlignLeading|Qt::AlignLeft|Qt::AlignVCenter",
  center: "Qt::AlignCenter",
  right: "Qt::AlignRight|Qt::AlignTrailing|Qt::AlignVCenter",
};

var L = {
  fr: {
    bar: "Qt Designer",
    undo: "Annuler",
    redo: "Rétablir",
    dup: "Dupliquer",
    del: "Supprimer",
    imp: "Importer .ui",
    exp: "Exporter .ui",
    close: "Terminer",
    palette: "Boîte de widgets",
    hint: "Glisse un widget sur la fenêtre, ou clique dessus.",
    g_buttons: "Boutons",
    g_inputs: "Champs de saisie",
    g_display: "Affichage",
    g_items: "Listes et tableaux",
    g_containers: "Conteneurs",
    inspector: "Inspecteur d’objets",
    props: "Propriétés",
    form: "Fenêtre",
    objname: "objectName",
    geometry: "geometry",
    x: "x",
    y: "y",
    w: "largeur",
    h: "hauteur",
    text: "text",
    title: "title",
    winTitle: "windowTitle",
    ftype: "Type de fenêtre",
    placeholder: "placeholderText",
    readonly: "readOnly",
    enabled: "enabled",
    checked: "checked",
    echo: "echoMode",
    echo_n: "Normal",
    echo_p: "Password",
    align: "alignment",
    al_l: "Gauche",
    al_c: "Centre",
    al_r: "Droite",
    min: "minimum",
    max: "maximum",
    value: "value",
    dec: "decimals",
    orient: "orientation",
    o_h: "Horizontal",
    o_v: "Vertical",
    items: "items (un par ligne)",
    cols: "colonnes (une par ligne)",
    rows: "lignes (une par ligne)",
    plain: "plainText",
    fsize: "Taille du texte (pt)",
    bold: "Gras",
    css: "styleSheet",
    nameBad: "Nom invalide : lettres, chiffres et _ , sans commencer par un chiffre.",
    nameUsed: "Ce nom est déjà utilisé.",
    opaque: "Non modifiable ici",
    locked: "Ce fichier utilise des mises en page (layouts) : le Designer de Classek ne sait pas encore les modifier. Le fichier reste intact.",
    invalid: "Ce fichier .ui est illisible : on repart d’une fenêtre vide (l’ancien contenu sera remplacé à la première modification).",
    fresh: "Repartir d’une fenêtre vide",
    phone: "Le Designer est prévu pour un grand écran : sur téléphone, c’est difficile.",
    none: "Aucun widget : glisse-en un depuis la boîte de gauche.",
    status: "barre d’état",
  },
  ar: {
    bar: "Qt Designer",
    undo: "تراجع",
    redo: "إعادة",
    dup: "تكرار",
    del: "حذف",
    imp: "استيراد .ui",
    exp: "تصدير .ui",
    close: "تمّ",
    palette: "صندوق الـ widgets",
    hint: "اسحب widget على النافذة، ولا كليكي عليه.",
    g_buttons: "أزرار",
    g_inputs: "خانات الإدخال",
    g_display: "عرض",
    g_items: "قوائم وجداول",
    g_containers: "حاويات",
    inspector: "مفتش الكائنات",
    props: "الخصائص",
    form: "النافذة",
    objname: "objectName",
    geometry: "geometry",
    x: "x",
    y: "y",
    w: "العرض",
    h: "الطول",
    text: "text",
    title: "title",
    winTitle: "windowTitle",
    ftype: "نوع النافذة",
    placeholder: "placeholderText",
    readonly: "readOnly",
    enabled: "enabled",
    checked: "checked",
    echo: "echoMode",
    echo_n: "Normal",
    echo_p: "Password",
    align: "alignment",
    al_l: "يسار",
    al_c: "وسط",
    al_r: "يمين",
    min: "minimum",
    max: "maximum",
    value: "value",
    dec: "decimals",
    orient: "orientation",
    o_h: "أفقي",
    o_v: "عمودي",
    items: "items (واحد في كل سطر)",
    cols: "الأعمدة (واحد في كل سطر)",
    rows: "الصفوف (واحد في كل سطر)",
    plain: "plainText",
    fsize: "حجم الخط (pt)",
    bold: "غليظ",
    css: "styleSheet",
    nameBad: "اسم غير صالح: حروف وأرقام و _ ، وما يبداش برقم.",
    nameUsed: "هذا الاسم مستعمل من قبل.",
    opaque: "ما ينجمش يتبدّل هنا",
    locked: "هذا الملف يستعمل layouts: Designer متاع Classek ما يعرفش يبدّلهم توّا. الملف يبقى كيما هو.",
    invalid: "ملف .ui هذا ما ينقراش: نبداو بنافذة فارغة (المحتوى القديم يتبدّل عند أول تعديل).",
    fresh: "ابدأ بنافذة فارغة",
    phone: "Designer مخصص للشاشات الكبيرة: في التلفون صعيب.",
    none: "ما فما حتى widget: اسحب واحد من الصندوق اللي على اليسار.",
    status: "شريط الحالة",
  },
};

// ---------------------------------------------------------------- the model
var uid = 0;

function newForm(cls) {
  var size = FORMS[cls] || FORMS.QMainWindow;
  return {
    cls: cls || "QMainWindow",
    name: cls === "QDialog" ? "Dialog" : cls === "QWidget" ? "Form" : "MainWindow",
    title: cls === "QDialog" ? "Dialog" : cls === "QWidget" ? "Form" : "MainWindow",
    w: size[0],
    h: size[1],
    children: [],
    extra: [],
    tail: [],
    locked: false,
  };
}

function newWidget(cls) {
  var c = CLASSES[cls];
  var m = { id: ++uid, cls: cls, name: "", x: 0, y: 0, w: c.w, h: c.h, props: {}, items: [], cols: [], rows: [], cells: [], children: [], extra: [], parent: null, opaque: false };
  if (cls === "QPushButton") m.props.text = "PushButton";
  if (cls === "QCheckBox") m.props.text = "CheckBox";
  if (cls === "QRadioButton") m.props.text = "RadioButton";
  if (cls === "QLabel") m.props.text = "TextLabel";
  if (cls === "QGroupBox") m.props.title = "GroupBox";
  if (cls === "QSpinBox") m.props = { minimum: 0, maximum: 99, value: 0 };
  if (cls === "QDoubleSpinBox") m.props = { minimum: 0, maximum: 99.99, value: 0, decimals: 2 };
  if (cls === "QSlider") m.props = { minimum: 0, maximum: 99, value: 0, orientation: "Qt::Horizontal" };
  if (cls === "QProgressBar") m.props = { minimum: 0, maximum: 100, value: 24 };
  return m;
}

function walk(list, fn, parent) {
  list.forEach(function (m) {
    fn(m, parent);
    walk(m.children, fn, m);
  });
}

function usedNames(form, skip) {
  var names = RESERVED.concat([form.name]);
  walk(form.children, function (m) {
    if (m !== skip) names.push(m.name);
  });
  return names;
}

function uniqueName(form, base) {
  var names = usedNames(form);
  if (names.indexOf(base) < 0) return base;
  var i = 2;
  while (names.indexOf(base + "_" + i) >= 0) i++;
  return base + "_" + i;
}

function absPos(m) {
  var x = 0;
  var y = 0;
  for (var p = m; p; p = p.parent) {
    x += p.x;
    y += p.y;
  }
  return { x: x, y: y };
}

// the deepest group box under the point (form coordinates), not counting `skip` and what it holds
function containerAt(list, px, py, ox, oy, skip) {
  for (var i = list.length - 1; i >= 0; i--) {
    var m = list[i];
    if (m === skip || m.cls !== "QGroupBox") continue;
    var x = ox + m.x;
    var y = oy + m.y;
    if (px >= x && px < x + m.w && py >= y && py < y + m.h) return containerAt(m.children, px, py, x, y, skip) || m;
  }
  return null;
}

function snap(n) {
  return Math.round(n / GRID) * GRID;
}

// ---------------------------------------------------------------- reading a .ui
function kids(el, tag) {
  var out = [];
  for (var n = el.firstElementChild; n; n = n.nextElementSibling) if (!tag || n.tagName === tag) out.push(n);
  return out;
}
function propValue(p) {
  var v = p.firstElementChild;
  if (!v) return null;
  var t = v.tagName;
  var txt = v.textContent;
  if (t === "string") return txt;
  if (t === "bool") return txt.trim() === "true";
  if (t === "number" || t === "uint" || t === "int") return parseInt(txt, 10);
  if (t === "double") return parseFloat(txt);
  if (t === "enum" || t === "set") return txt.trim();
  if (t === "rect") {
    var r = {};
    kids(v).forEach(function (k) {
      r[k.tagName] = parseInt(k.textContent, 10);
    });
    return r;
  }
  if (t === "font") {
    var f = {};
    kids(v).forEach(function (k) {
      f[k.tagName] = k.textContent.trim();
    });
    return f;
  }
  return null;
}
function itemText(it) {
  var p = kids(it, "property").filter(function (q) {
    return q.getAttribute("name") === "text";
  })[0];
  var v = p && p.firstElementChild;
  return v ? v.textContent : "";
}

function readWidget(node, parent) {
  var cls = node.getAttribute("class");
  var known = !!CLASSES[cls];
  var m = { id: ++uid, cls: cls, name: node.getAttribute("name") || "", x: 0, y: 0, w: 104, h: 32, props: {}, items: [], cols: [], rows: [], cells: [], children: [], extra: [], parent: parent || null, opaque: false };
  var hasLayout = kids(node, "layout").length > 0;
  var geo = null;
  kids(node, "property").forEach(function (p) {
    if (p.getAttribute("name") === "geometry") geo = propValue(p);
  });
  if (geo) {
    m.x = geo.x || 0;
    m.y = geo.y || 0;
    m.w = geo.width || m.w;
    m.h = geo.height || m.h;
  }
  if (!known || hasLayout) {
    m.opaque = true;
    m.node = node.cloneNode(true);
    return m;
  }
  var handled = HANDLED._all.concat(HANDLED[cls] || []);
  kids(node, "property").forEach(function (p) {
    var name = p.getAttribute("name");
    if (handled.indexOf(name) < 0) return m.extra.push(p.cloneNode(true));
    var v = propValue(p);
    if (name === "geometry") return;
    if (name === "font") {
      m.props.font = v || {};
    } else {
      m.props[name] = v;
    }
  });
  if (cls === "QComboBox" || cls === "QListWidget") {
    kids(node, "item").forEach(function (it) {
      m.items.push(itemText(it));
    });
  }
  if (cls === "QTableWidget") {
    m.cols = kids(node, "column").map(itemText);
    m.rows = kids(node, "row").map(itemText);
    m.cells = kids(node, "item").map(function (it) {
      return it.cloneNode(true);
    });
  }
  kids(node, "widget").forEach(function (w) {
    m.children.push(readWidget(w, m));
  });
  return m;
}

// text of a .ui -> form model ({ form, invalid })
export function readUi(xml) {
  xml = String(xml || "").trim();
  if (!xml) return { form: newForm("QMainWindow"), invalid: false };
  var doc = new DOMParser().parseFromString(xml, "application/xml");
  var ui = doc.documentElement;
  if (!ui || ui.tagName !== "ui" || doc.getElementsByTagName("parsererror").length) return { form: newForm("QMainWindow"), invalid: true };
  var top = kids(ui, "widget")[0];
  if (!top) return { form: newForm("QMainWindow"), invalid: true };
  var cls = top.getAttribute("class");
  var form = newForm(FORMS[cls] ? cls : "QWidget");
  form.name = top.getAttribute("name") || form.name;
  var handled = ["geometry", "windowTitle"];
  kids(top, "property").forEach(function (p) {
    var n = p.getAttribute("name");
    var v = propValue(p);
    if (n === "geometry" && v) {
      form.w = v.width || form.w;
      form.h = v.height || form.h;
    } else if (n === "windowTitle") {
      form.title = v == null ? "" : v;
    } else if (handled.indexOf(n) < 0) form.extra.push(p.cloneNode(true));
  });
  if (!FORMS[cls]) form.locked = true; // an unknown kind of top-level widget
  var holder = top;
  if (form.cls === "QMainWindow") {
    var central = kids(top, "widget").filter(function (w) {
      return w.getAttribute("name") === "centralwidget";
    })[0];
    if (central) holder = central;
    kids(top, "widget").forEach(function (w) {
      var n = w.getAttribute("name");
      if (w !== central && n !== "menubar" && n !== "statusbar") form.tail.push(w.cloneNode(true));
    });
  }
  if (kids(holder, "layout").length) form.locked = true;
  if (!form.locked) {
    kids(holder, "widget").forEach(function (w) {
      form.children.push(readWidget(w, null));
    });
  } else {
    form.raw = xml; // untouched
  }
  return { form: form, invalid: false };
}

// ---------------------------------------------------------------- writing a .ui
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function ser(node) {
  return new XMLSerializer().serializeToString(node);
}
function pad(n) {
  return new Array(n + 1).join(" ");
}
function sProp(name, kind, val, ind) {
  return pad(ind) + '<property name="' + name + '"><' + kind + ">" + esc(val) + "</" + kind + "></property>";
}
function rectProp(x, y, w, h, ind) {
  return (
    pad(ind) + '<property name="geometry">\n' + pad(ind + 1) + "<rect>\n" +
    pad(ind + 2) + "<x>" + x + "</x>\n" + pad(ind + 2) + "<y>" + y + "</y>\n" +
    pad(ind + 2) + "<width>" + w + "</width>\n" + pad(ind + 2) + "<height>" + h + "</height>\n" +
    pad(ind + 1) + "</rect>\n" + pad(ind) + "</property>"
  );
}
function itemXml(text, tag, ind) {
  return pad(ind) + "<" + tag + ">\n" + sProp("text", "string", text, ind + 1) + "\n" + pad(ind) + "</" + tag + ">";
}

function writeWidget(m, ind) {
  if (m.opaque) {
    var node = m.node;
    node.setAttribute("name", m.name);
    var geo = kids(node, "property").filter(function (p) {
      return p.getAttribute("name") === "geometry";
    })[0];
    if (geo) {
      var rect = geo.firstElementChild;
      var set = { x: m.x, y: m.y, width: m.w, height: m.h };
      kids(rect).forEach(function (k) {
        if (set[k.tagName] != null) k.textContent = String(set[k.tagName]);
      });
    }
    return pad(ind) + ser(node);
  }
  var c = m.cls;
  var p = m.props;
  var out = [pad(ind) + '<widget class="' + c + '" name="' + esc(m.name) + '">'];
  var i = ind + 1;
  out.push(rectProp(m.x, m.y, m.w, m.h, i));
  if (p.enabled === false) out.push(pad(i) + '<property name="enabled"><bool>false</bool></property>');
  if (p.text != null && (c === "QPushButton" || c === "QCheckBox" || c === "QRadioButton" || c === "QLabel")) out.push(sProp("text", "string", p.text, i));
  if (c === "QGroupBox") out.push(sProp("title", "string", p.title == null ? "" : p.title, i));
  if (c === "QLabel" && p.alignment) out.push(sProp("alignment", "set", p.alignment, i));
  if ((c === "QCheckBox" || c === "QRadioButton") && p.checked) out.push(pad(i) + '<property name="checked"><bool>true</bool></property>');
  if (c === "QLineEdit") {
    if (p.placeholderText) out.push(sProp("placeholderText", "string", p.placeholderText, i));
    if (p.echoMode && p.echoMode !== "QLineEdit::Normal") out.push(sProp("echoMode", "enum", p.echoMode, i));
  }
  if (c === "QTextEdit" && p.plainText) out.push(sProp("plainText", "string", p.plainText, i));
  if ((c === "QLineEdit" || c === "QTextEdit" || c === "QSpinBox" || c === "QDoubleSpinBox") && p.readOnly) out.push(pad(i) + '<property name="readOnly"><bool>true</bool></property>');
  if (c === "QSpinBox" || c === "QSlider" || c === "QProgressBar") {
    ["minimum", "maximum", "value"].forEach(function (k) {
      if (p[k] != null) out.push(sProp(k, "number", p[k], i));
    });
  }
  if (c === "QDoubleSpinBox") {
    if (p.decimals != null) out.push(sProp("decimals", "number", p.decimals, i));
    ["minimum", "maximum", "value"].forEach(function (k) {
      if (p[k] != null) out.push(sProp(k, "double", p[k], i));
    });
  }
  if (c === "QSlider" && p.orientation) out.push(sProp("orientation", "enum", p.orientation, i));
  if (p.font && (p.font.pointsize || p.font.bold === "true" || p.font.family)) {
    var f = p.font;
    var fx = [];
    if (f.family) fx.push(pad(i + 2) + "<family>" + esc(f.family) + "</family>");
    if (f.pointsize) fx.push(pad(i + 2) + "<pointsize>" + f.pointsize + "</pointsize>");
    if (f.italic === "true") fx.push(pad(i + 2) + "<italic>true</italic>");
    if (f.bold === "true") fx.push(pad(i + 2) + "<weight>75</weight>", pad(i + 2) + "<bold>true</bold>");
    out.push(pad(i) + '<property name="font">\n' + pad(i + 1) + "<font>\n" + fx.join("\n") + "\n" + pad(i + 1) + "</font>\n" + pad(i) + "</property>");
  }
  if (p.styleSheet) out.push(sProp("styleSheet", "string", p.styleSheet, i));
  m.extra.forEach(function (e) {
    out.push(pad(i) + ser(e));
  });
  if (c === "QComboBox" || c === "QListWidget") m.items.forEach(function (t) {
    out.push(itemXml(t, "item", i));
  });
  if (c === "QTableWidget") {
    m.cols.forEach(function (t) {
      out.push(itemXml(t, "column", i));
    });
    m.rows.forEach(function (t) {
      out.push(itemXml(t, "row", i));
    });
    m.cells.forEach(function (e) {
      out.push(pad(i) + ser(e));
    });
  }
  m.children.forEach(function (ch) {
    out.push(writeWidget(ch, i));
  });
  out.push(pad(ind) + "</widget>");
  return out.join("\n");
}

// form model -> text of the .ui (the same shape as the one written by Qt Designer)
export function writeUi(form) {
  if (form.locked && form.raw) return form.raw;
  var main = form.cls === "QMainWindow";
  var out = ['<?xml version="1.0" encoding="UTF-8"?>', '<ui version="4.0">', " <class>" + esc(form.name) + "</class>"];
  out.push(' <widget class="' + form.cls + '" name="' + esc(form.name) + '">');
  out.push(rectProp(0, 0, form.w, form.h, 2));
  out.push(sProp("windowTitle", "string", form.title, 2));
  form.extra.forEach(function (e) {
    out.push("  " + ser(e));
  });
  if (main) {
    out.push('  <widget class="QWidget" name="centralwidget">');
    form.children.forEach(function (m) {
      out.push(writeWidget(m, 3));
    });
    out.push("  </widget>");
    out.push('  <widget class="QMenuBar" name="menubar">');
    out.push(rectProp(0, 0, form.w, 21, 3));
    out.push("  </widget>");
    out.push('  <widget class="QStatusBar" name="statusbar"/>');
    form.tail.forEach(function (e) {
      out.push("  " + ser(e));
    });
  } else {
    form.children.forEach(function (m) {
      out.push(writeWidget(m, 2));
    });
  }
  out.push(" </widget>", " <resources/>", " <connections/>", "</ui>", "");
  return out.join("\n");
}

// ---------------------------------------------------------------- drawing a widget (the same DOM as qtshim.py, so what you draw is what runs)
function mk(tag, cls, text) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
function cssOf(m) {
  var out = [];
  var f = m.props.font;
  if (f && f.family) out.push("font-family:'" + f.family.replace(/['"]/g, "") + "',sans-serif");
  if (f && f.pointsize) out.push("font-size:" + parseInt(f.pointsize, 10) + "pt");
  if (f && f.bold === "true") out.push("font-weight:700");
  var s = m.props.styleSheet;
  if (s && s.indexOf("{") < 0) out.push(s);
  return out.join(";");
}

function drawWidget(m) {
  var c = m.cls;
  var p = m.props;
  var el;
  if (m.opaque) {
    el = mk("div", "qt-w qd-opaque");
    var b = mk("b", "", m.cls);
    el.append(b, mk("span", "", m.name));
  } else if (c === "QPushButton") {
    el = mk("button", "qt-w qt-QPushButton");
    el.type = "button";
    el.textContent = p.text || "";
  } else if (c === "QLabel") {
    el = mk("div", "qt-w qt-QLabel");
    el.textContent = p.text || "";
    var a = p.alignment || "";
    if (a) {
      var center = /AlignCenter|AlignHCenter/.test(a);
      var right = !center && /AlignRight|AlignTrailing/.test(a);
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = center ? "center" : right ? "flex-end" : "flex-start";
    }
  } else if (c === "QCheckBox" || c === "QRadioButton") {
    el = mk("label", "qt-w qt-" + c);
    var inp = mk("input");
    inp.type = c === "QCheckBox" ? "checkbox" : "radio";
    inp.checked = !!p.checked;
    inp.tabIndex = -1;
    el.append(inp, mk("span", "", p.text || ""));
  } else if (c === "QLineEdit") {
    el = mk("div", "qt-w qt-QLineEdit");
    var i1 = mk("input");
    i1.type = p.echoMode === "QLineEdit::Password" ? "password" : "text";
    i1.placeholder = p.placeholderText || "";
    i1.readOnly = true;
    i1.tabIndex = -1;
    el.append(i1);
  } else if (c === "QTextEdit") {
    el = mk("div", "qt-w qt-QTextEdit");
    var ta = mk("textarea");
    ta.value = p.plainText || "";
    ta.readOnly = true;
    ta.tabIndex = -1;
    el.append(ta);
  } else if (c === "QSpinBox" || c === "QDoubleSpinBox") {
    el = mk("div", "qt-w qt-" + c);
    var i2 = mk("input");
    i2.type = "number";
    i2.value = c === "QDoubleSpinBox" ? Number(p.value || 0).toFixed(p.decimals == null ? 2 : p.decimals) : String(p.value || 0);
    i2.tabIndex = -1;
    el.append(i2);
  } else if (c === "QComboBox") {
    el = mk("div", "qt-w qt-QComboBox");
    var sel = mk("select");
    m.items.forEach(function (t) {
      var o = mk("option");
      o.textContent = t;
      sel.append(o);
    });
    sel.tabIndex = -1;
    el.append(sel);
  } else if (c === "QSlider") {
    var vert = p.orientation === "Qt::Vertical";
    el = mk("div", "qt-w qt-QSlider" + (vert ? " qt-vert" : ""));
    var r = mk("input");
    r.type = "range";
    r.min = p.minimum == null ? 0 : p.minimum;
    r.max = p.maximum == null ? 99 : p.maximum;
    r.value = p.value == null ? 0 : p.value;
    r.tabIndex = -1;
    el.append(r);
  } else if (c === "QProgressBar") {
    el = mk("div", "qt-w qt-QProgressBar");
    var pr = mk("progress");
    pr.max = p.maximum == null ? 100 : p.maximum;
    pr.value = p.value == null ? 0 : p.value;
    el.append(pr);
  } else if (c === "QLCDNumber") {
    el = mk("div", "qt-w qt-QLCDNumber");
    el.textContent = "0";
  } else if (c === "QListWidget") {
    el = mk("div", "qt-w qt-QListWidget");
    m.items.forEach(function (t) {
      el.append(mk("div", "qt-li", t));
    });
  } else if (c === "QTableWidget") {
    el = mk("div", "qt-w qt-QTableWidget");
    var tbl = mk("table");
    var head = mk("tr");
    head.append(mk("th"));
    m.cols.forEach(function (t, k) {
      head.append(mk("th", "", t || String(k + 1)));
    });
    tbl.append(head);
    m.rows.forEach(function (t, k) {
      var tr = mk("tr");
      tr.append(mk("th", "", t || String(k + 1)));
      m.cols.forEach(function () {
        tr.append(mk("td"));
      });
      tbl.append(tr);
    });
    el.append(tbl);
  } else if (c === "QGroupBox") {
    el = mk("div", "qt-w qt-QGroupBox");
    el.append(mk("span", "qt-gb-title", p.title || ""));
  } else {
    el = mk("div", "qt-w");
  }
  if (p.enabled === false) el.classList.add("qt-off");
  var extra = cssOf(m);
  if (extra) {
    extra.split(";").forEach(function (d) {
      var k = d.indexOf(":");
      if (k > 0) el.style.setProperty(d.slice(0, k).trim(), d.slice(k + 1).trim());
    });
  }
  el.dataset.id = String(m.id);
  el.style.left = m.x + "px";
  el.style.top = m.y + "px";
  el.style.width = m.w + "px";
  el.style.height = m.h + "px";
  m.children.forEach(function (ch) {
    el.append(drawWidget(ch));
  });
  return el;
}

// ---------------------------------------------------------------- the tool
export function openDesigner(opts) {
  var tr = L[opts.lang === "ar" ? "ar" : "fr"];
  var read = readUi(opts.xml);
  var form = read.form;
  var notice = read.invalid ? tr.invalid : form.locked ? tr.locked : "";
  var selected = null; // a widget model, or null for the window itself
  var history = [];
  var hix = -1;
  var op = null; // the drag in progress
  var editing = null; // the inline editor

  // ---- the shell
  var modal = mk("div", "qd-modal");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", tr.bar);
  var app = mk("div", "qd-app");
  app.tabIndex = -1;
  var top = mk("div", "qd-top");
  var ttl = mk("b", "qd-title", tr.bar + " · " + (opts.fileName || "interface.ui"));
  var tools = mk("div", "qd-tools");
  var main = mk("div", "qd-main");
  var palette = mk("aside", "qd-palette");
  var stage = mk("div", "qd-stage");
  var side = mk("aside", "qd-side");
  var inspector = mk("div", "qd-inspector");
  var panel = mk("div", "qd-props");
  side.append(inspector, panel);
  main.append(palette, stage, side);
  app.append(top, main);
  modal.append(app);
  top.append(ttl, tools);

  function btn(label, title, fn, cls) {
    var b = mk("button", "qd-btn" + (cls ? " " + cls : ""), label);
    b.type = "button";
    b.title = title;
    b.setAttribute("aria-label", title);
    b.addEventListener("click", fn);
    return b;
  }
  var bUndo = btn("↶", tr.undo, undo);
  var bRedo = btn("↷", tr.redo, redo);
  var bDup = btn("⧉", tr.dup, duplicate);
  var bDel = btn("🗑", tr.del, removeSelected);
  var bImp = btn("⇪ " + tr.imp, tr.imp, function () {
    file.click();
  });
  var bExp = btn("⇩ " + tr.exp, tr.exp, exportUi);
  var bClose = btn(tr.close, tr.close, close, "is-primary");
  var file = mk("input");
  file.type = "file";
  file.accept = ".ui,.xml,text/xml";
  file.hidden = true;
  file.addEventListener("change", function () {
    var f = file.files && file.files[0];
    if (!f) return;
    f.text().then(function (txt) {
      var r = readUi(txt);
      read = r;
      form = r.form;
      notice = r.invalid ? tr.invalid : form.locked ? tr.locked : "";
      selected = null;
      commit();
      renderAll();
    });
    file.value = "";
  });
  tools.append(bUndo, bRedo, bDup, bDel, bImp, bExp, bClose, file);

  // ---- history / saving
  function snapshot() {
    return writeUi(form);
  }
  function commit() {
    if (form.locked) return;
    var x = snapshot();
    if (history[hix] === x) return;
    history = history.slice(0, hix + 1);
    history.push(x);
    if (history.length > 120) history.shift();
    hix = history.length - 1;
    if (opts.onChange) opts.onChange(x);
    syncButtons();
  }
  function restore(i) {
    var keep = selected ? selected.name : null;
    var r = readUi(history[i]);
    form = r.form;
    hix = i;
    selected = null;
    if (keep) walk(form.children, function (m) {
      if (m.name === keep) selected = m;
    });
    if (opts.onChange) opts.onChange(history[i]);
    renderAll();
  }
  function undo() {
    if (hix > 0) restore(hix - 1);
  }
  function redo() {
    if (hix < history.length - 1) restore(hix + 1);
  }
  function syncButtons() {
    bUndo.disabled = hix <= 0;
    bRedo.disabled = hix >= history.length - 1;
    bDel.disabled = !selected || form.locked;
    bDup.disabled = !selected || form.locked;
  }
  function exportUi() {
    var blob = new Blob([snapshot()], { type: "text/xml" });
    var a = mk("a");
    a.href = URL.createObjectURL(blob);
    a.download = opts.fileName || "interface.ui";
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
    }, 2000);
  }

  // ---- the widget box
  var ghost = null;
  var pdrag = null;
  palette.append(mk("h3", "qd-h3", tr.palette), mk("p", "qd-hint", tr.hint));
  GROUPS.forEach(function (g) {
    var sec = mk("section", "qd-group");
    sec.append(mk("h4", "", tr["g_" + g[0]]));
    g[1].forEach(function (cls) {
      var b = mk("button", "qd-item");
      b.type = "button";
      b.append(mk("i", "qd-glyph", CLASSES[cls].glyph), mk("span", "", CLASSES[cls].label));
      b.title = cls;
      b.dataset.cls = cls;
      b.addEventListener("pointerdown", function (e) {
        if (e.button > 0 || form.locked) return;
        pdrag = { cls: cls, sx: e.clientX, sy: e.clientY, moved: false };
        e.preventDefault();
      });
      b.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          addWidget(cls, null);
        }
      });
      sec.append(b);
    });
    palette.append(sec);
  });

  // ---- adding / removing
  function addWidget(cls, at) {
    if (form.locked) return;
    var m = newWidget(cls);
    m.name = uniqueName(form, CLASSES[cls].base);
    var parent = null;
    var pos;
    if (at) {
      parent = containerAt(form.children, at.x, at.y, 0, 0, null);
      var o = parent ? absPos(parent) : { x: 0, y: 0 };
      pos = { x: Math.max(0, snap(at.x - o.x)), y: Math.max(0, snap(at.y - o.y)) };
    } else {
      parent = selected && selected.cls === "QGroupBox" ? selected : null;
      var n = (parent ? parent.children : form.children).length;
      pos = parent ? { x: 16 + (n % 6) * 16, y: 32 + (n % 6) * 16 } : { x: 24 + (n % 12) * 16, y: 24 + (n % 12) * 16 };
    }
    m.x = pos.x;
    m.y = pos.y;
    m.parent = parent;
    (parent ? parent.children : form.children).push(m);
    selected = m;
    commit();
    renderAll();
  }
  function removeSelected() {
    if (!selected || form.locked) return;
    var list = selected.parent ? selected.parent.children : form.children;
    list.splice(list.indexOf(selected), 1);
    selected = null;
    commit();
    renderAll();
  }
  function clone(m, parent) {
    var c = CLASSES[m.cls] ? newWidget(m.cls) : { id: ++uid, cls: m.cls, props: {}, children: [], parent: null };
    c.items = [];
    c.cols = [];
    c.rows = [];
    c.cells = [];
    c.extra = [];
    c.opaque = m.opaque;
    if (m.node) c.node = m.node.cloneNode(true);
    c.props = JSON.parse(JSON.stringify(m.props));
    c.items = m.items.slice();
    c.cols = m.cols.slice();
    c.rows = m.rows.slice();
    c.cells = m.cells.map(function (e) {
      return e.cloneNode(true);
    });
    c.extra = m.extra.map(function (e) {
      return e.cloneNode(true);
    });
    c.w = m.w;
    c.h = m.h;
    c.x = m.x;
    c.y = m.y;
    c.parent = parent;
    c.name = uniqueName(form, (m.name || "widget").replace(/_\d+$/, ""));
    if (!parent) form.children.push(c);
    else parent.children.push(c);
    m.children.forEach(function (ch) {
      clone(ch, c);
    });
    return c;
  }
  function duplicate() {
    if (!selected || form.locked) return;
    var c = clone(selected, selected.parent);
    c.x += 16;
    c.y += 16;
    if (c.node) c.node.setAttribute("name", c.name);
    selected = c;
    commit();
    renderAll();
  }

  // ---- the form on the stage
  var frame = null;
  var body = null;
  function renderStage() {
    stage.textContent = "";
    if (notice) {
      var nb = mk("div", "qd-notice");
      nb.append(mk("span", "", notice));
      if (read.invalid || form.locked) {
        var fresh = btn(tr.fresh, tr.fresh, function () {
          form = newForm("QMainWindow");
          read = { form: form, invalid: false };
          notice = "";
          selected = null;
          commit();
          renderAll();
        });
        nb.append(fresh);
      }
      stage.append(nb);
    }
    if (window.innerWidth < 760) stage.append(mk("div", "qd-notice", tr.phone));
    frame = mk("div", "qt-win qd-form");
    var bar = mk("div", "qt-bar");
    bar.append(mk("b", "", form.title || form.name), mk("span", "qt-x", "×"));
    body = mk("div", "qt-body qd-body");
    body.style.width = form.w + "px";
    body.style.height = form.h + "px";
    if (form.locked) {
      body.append(mk("div", "qd-locked", tr.locked));
    } else {
      form.children.forEach(function (m) {
        body.append(drawWidget(m));
      });
      if (form.cls === "QMainWindow") body.append(mk("div", "qt-w qt-status qd-status", ""));
      if (!form.children.length) body.append(mk("div", "qd-empty", tr.none));
    }
    frame.append(bar, body);
    stage.append(frame);
    drawSelection();
  }
  function elOf(m) {
    return m && body ? body.querySelector('[data-id="' + m.id + '"]') : null;
  }
  function drawSelection() {
    Array.prototype.forEach.call(body.querySelectorAll(".qd-sel"), function (e) {
      e.classList.remove("qd-sel");
    });
    Array.prototype.forEach.call(body.querySelectorAll(".qd-h"), function (e) {
      e.remove();
    });
    var el = elOf(selected);
    if (!el) return;
    el.classList.add("qd-sel");
    ["nw", "n", "ne", "e", "se", "s", "sw", "w"].forEach(function (d) {
      var h = mk("i", "qd-h qd-h-" + d);
      h.dataset.h = d;
      el.append(h);
    });
  }

  // ---- inspector + properties
  function renderInspector() {
    inspector.textContent = "";
    inspector.append(mk("h3", "qd-h3", tr.inspector));
    var list = mk("div", "qd-tree");
    var row = function (label, cls, depth, m) {
      var b = mk("button", "qd-node" + (selected === m ? " is-on" : ""));
      b.type = "button";
      b.style.paddingInlineStart = 8 + depth * 14 + "px";
      b.append(mk("b", "", label), mk("small", "", cls));
      b.addEventListener("click", function () {
        select(m);
      });
      list.append(b);
    };
    row(form.name, form.cls, 0, null);
    if (!form.locked) {
      walk(form.children, function (m) {
        var d = 1;
        for (var p = m.parent; p; p = p.parent) d++;
        row(m.name, m.cls, d, m);
      });
    }
    inspector.append(list);
  }

  function field(label, control, note) {
    var r = mk("label", "qd-row");
    r.append(mk("span", "", label), control);
    if (note) r.append(mk("em", "qd-note", note));
    return r;
  }
  function textInput(value, onInput, onChange) {
    var i = mk("input", "qd-in");
    i.type = "text";
    i.value = value == null ? "" : value;
    i.dir = "ltr";
    i.addEventListener("input", function () {
      onInput(i.value, i);
    });
    i.addEventListener("change", function () {
      (onChange || commit)(i);
    });
    return i;
  }
  function numInput(value, onInput, step) {
    var i = mk("input", "qd-in");
    i.type = "number";
    i.step = step || 1;
    i.value = value == null ? "" : value;
    i.addEventListener("input", function () {
      if (i.value === "" || isNaN(Number(i.value))) return;
      onInput(Number(i.value));
    });
    i.addEventListener("change", function () {
      commit();
    });
    return i;
  }
  function boolInput(value, onInput) {
    var i = mk("input");
    i.type = "checkbox";
    i.checked = !!value;
    i.addEventListener("change", function () {
      onInput(i.checked);
      commit();
      renderStage();
    });
    return i;
  }
  function selectInput(value, options, onInput) {
    var s = mk("select", "qd-in");
    options.forEach(function (o) {
      var op2 = mk("option", "", o[1]);
      op2.value = o[0];
      if (o[0] === value) op2.selected = true;
      s.append(op2);
    });
    s.addEventListener("change", function () {
      onInput(s.value);
      commit();
      renderAll();
    });
    return s;
  }
  function areaInput(lines, onInput) {
    var a = mk("textarea", "qd-in qd-area");
    a.rows = 4;
    a.dir = "ltr";
    a.value = lines.join("\n");
    a.addEventListener("input", function () {
      onInput(
        a.value.split("\n").map(function (s) {
          return s.replace(/\r/g, "");
        })
      );
    });
    a.addEventListener("change", function () {
      commit();
    });
    return a;
  }
  function live() {
    // a property changed while typing: the form is redrawn (the panel is left alone so the caret stays)
    renderStage();
    renderInspectorSoft();
  }
  function renderInspectorSoft() {
    renderInspector();
  }
  function nameInput(m) {
    var cur = m ? m.name : form.name;
    var wrap = mk("div", "qd-namewrap");
    var msg = mk("em", "qd-note is-bad");
    var i = textInput(cur, function (v, inp) {
      var bad = !/^[A-Za-z_][A-Za-z0-9_]*$/.test(v);
      var names = usedNames(form, m).filter(function (n) {
        return m || n !== form.name;
      });
      var used = !bad && names.indexOf(v) >= 0;
      inp.classList.toggle("is-bad", bad || used);
      msg.textContent = bad ? tr.nameBad : used ? tr.nameUsed : "";
      if (bad || used) return;
      if (m) m.name = v;
      else form.name = v;
      live();
    }, function (inp) {
      if (inp.classList.contains("is-bad")) {
        inp.value = m ? m.name : form.name;
        inp.classList.remove("is-bad");
        msg.textContent = "";
      }
      commit();
      renderAll();
    });
    wrap.append(i, msg);
    return wrap;
  }

  function renderProps() {
    panel.textContent = "";
    panel.append(mk("h3", "qd-h3", tr.props + " · " + (selected ? selected.name : form.name)));
    if (form.locked) return;
    var m = selected;
    if (!m) {
      panel.append(field(tr.objname, nameInput(null)));
      panel.append(
        field(tr.ftype, selectInput(form.cls, [["QMainWindow", "QMainWindow"], ["QWidget", "QWidget"], ["QDialog", "QDialog"]], function (v) {
          form.cls = v;
        }))
      );
      panel.append(
        field(tr.winTitle, textInput(form.title, function (v) {
          form.title = v;
          live();
        }))
      );
      var g = mk("div", "qd-geo");
      g.append(
        numInput(form.w, function (v) {
          form.w = Math.max(80, Math.round(v));
          live();
        }),
        numInput(form.h, function (v) {
          form.h = Math.max(60, Math.round(v));
          live();
        })
      );
      panel.append(field(tr.w + " × " + tr.h, g));
      return;
    }
    var p = m.props;
    panel.append(mk("p", "qd-cls", m.cls));
    panel.append(field(tr.objname, nameInput(m)));
    var geo = mk("div", "qd-geo");
    ["x", "y", "w", "h"].forEach(function (k) {
      var i = numInput(m[k], function (v) {
        m[k] = Math.max(k === "w" || k === "h" ? MIN_SIZE : 0, Math.round(v));
        live();
        drawSelection();
      });
      i.title = tr[k];
      i.placeholder = tr[k];
      geo.append(i);
    });
    panel.append(field(tr.geometry, geo));
    if (m.opaque) return panel.append(mk("p", "qd-note", tr.opaque));
    var tk = TEXT_KEY[m.cls];
    if (tk) {
      panel.append(
        field(tr[tk === "title" ? "title" : "text"], textInput(p[tk], function (v) {
          p[tk] = v;
          live();
        }))
      );
    }
    if (m.cls === "QLabel") {
      var cur = !p.alignment ? "left" : /AlignCenter|AlignHCenter/.test(p.alignment) ? "center" : /AlignRight|AlignTrailing/.test(p.alignment) ? "right" : "left";
      panel.append(
        field(tr.align, selectInput(cur, [["left", tr.al_l], ["center", tr.al_c], ["right", tr.al_r]], function (v) {
          p.alignment = v === "left" ? null : ALIGN[v];
        }))
      );
    }
    if (m.cls === "QCheckBox" || m.cls === "QRadioButton") panel.append(field(tr.checked, boolInput(p.checked, function (v) { p.checked = v; })));
    if (m.cls === "QLineEdit") {
      panel.append(field(tr.placeholder, textInput(p.placeholderText, function (v) { p.placeholderText = v; live(); })));
      panel.append(
        field(tr.echo, selectInput(p.echoMode === "QLineEdit::Password" ? "p" : "n", [["n", tr.echo_n], ["p", tr.echo_p]], function (v) {
          p.echoMode = v === "p" ? "QLineEdit::Password" : null;
        }))
      );
    }
    if (m.cls === "QTextEdit") {
      panel.append(field(tr.plain, areaInput((p.plainText || "").split("\n"), function (v) { p.plainText = v.join("\n"); live(); })));
    }
    if (m.cls === "QLineEdit" || m.cls === "QTextEdit" || m.cls === "QSpinBox" || m.cls === "QDoubleSpinBox") {
      panel.append(field(tr.readonly, boolInput(p.readOnly, function (v) { p.readOnly = v; })));
    }
    if (m.cls === "QSpinBox" || m.cls === "QDoubleSpinBox" || m.cls === "QSlider" || m.cls === "QProgressBar") {
      var dbl = m.cls === "QDoubleSpinBox";
      ["minimum", "maximum", "value"].forEach(function (k) {
        panel.append(field(tr[k === "minimum" ? "min" : k === "maximum" ? "max" : "value"], numInput(p[k], function (v) { p[k] = dbl ? v : Math.round(v); live(); }, dbl ? 0.1 : 1)));
      });
    }
    if (m.cls === "QDoubleSpinBox") panel.append(field(tr.dec, numInput(p.decimals, function (v) { p.decimals = Math.max(0, Math.round(v)); live(); })));
    if (m.cls === "QSlider") {
      panel.append(
        field(tr.orient, selectInput(p.orientation || "Qt::Horizontal", [["Qt::Horizontal", tr.o_h], ["Qt::Vertical", tr.o_v]], function (v) {
          var wasVert = p.orientation === "Qt::Vertical";
          p.orientation = v;
          if ((v === "Qt::Vertical") !== wasVert) {
            var t = m.w;
            m.w = m.h;
            m.h = t;
          }
        }))
      );
    }
    if (m.cls === "QComboBox" || m.cls === "QListWidget") panel.append(field(tr.items, areaInput(m.items, function (v) { m.items = v.filter(function (s) { return s.trim() !== ""; }); live(); })));
    if (m.cls === "QTableWidget") {
      panel.append(field(tr.cols, areaInput(m.cols, function (v) { m.cols = v.filter(function (s) { return s.trim() !== ""; }); live(); })));
      panel.append(field(tr.rows, areaInput(m.rows, function (v) { m.rows = v.filter(function (s) { return s.trim() !== ""; }); live(); })));
    }
    var f = p.font || (p.font = {});
    panel.append(field(tr.fsize, numInput(f.pointsize || "", function (v) { f.pointsize = v > 0 ? String(Math.round(v)) : ""; live(); })));
    panel.append(field(tr.bold, boolInput(f.bold === "true", function (v) { f.bold = v ? "true" : "false"; })));
    panel.append(field(tr.enabled, boolInput(p.enabled !== false, function (v) { p.enabled = v; })));
    panel.append(field(tr.css, areaInput((p.styleSheet || "").split("\n"), function (v) { p.styleSheet = v.join("\n").trim(); live(); })));
  }

  function select(m) {
    selected = m;
    renderInspector();
    renderProps();
    drawSelection();
    syncButtons();
  }
  function renderAll() {
    renderStage();
    renderInspector();
    renderProps();
    syncButtons();
  }

  // ---- pointer: move, resize, drop from the widget box
  function formPoint(e) {
    var r = body.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function modelOf(el) {
    var id = el && el.dataset ? Number(el.dataset.id) : 0;
    var found = null;
    walk(form.children, function (m) {
      if (m.id === id) found = m;
    });
    return found;
  }
  stage.addEventListener("pointerdown", function (e) {
    if (e.button > 0 || form.locked || !body) return;
    var t = e.target;
    var h = t.closest ? t.closest(".qd-h") : null;
    var w = t.closest ? t.closest(".qt-w[data-id]") : null;
    if (editing) finishEdit(true);
    if (h && selected) {
      var m0 = selected;
      op = { kind: "resize", m: m0, dir: h.dataset.h, sx: e.clientX, sy: e.clientY, x: m0.x, y: m0.y, w: m0.w, h: m0.h, moved: false };
      e.preventDefault();
    } else if (w && body.contains(w)) {
      var m = modelOf(w);
      if (m) {
        if (m !== selected) select(m);
        op = { kind: "move", m: m, sx: e.clientX, sy: e.clientY, x: m.x, y: m.y, moved: false };
        e.preventDefault();
      }
    } else if (t.closest && (t.closest(".qd-body") || t.closest(".qd-form"))) {
      select(null);
    }
    app.focus();
  });
  function onMove(e) {
    if (pdrag) {
      if (!pdrag.moved && Math.abs(e.clientX - pdrag.sx) + Math.abs(e.clientY - pdrag.sy) > 5) {
        pdrag.moved = true;
        ghost = mk("div", "qd-ghost", CLASSES[pdrag.cls].label);
        document.body.append(ghost);
      }
      if (ghost) {
        ghost.style.left = e.clientX + 8 + "px";
        ghost.style.top = e.clientY + 8 + "px";
      }
      return;
    }
    if (!op) return;
    var dx = e.clientX - op.sx;
    var dy = e.clientY - op.sy;
    if (!op.moved && Math.abs(dx) + Math.abs(dy) < 3) return;
    op.moved = true;
    var m = op.m;
    if (op.kind === "move") {
      m.x = Math.max(0, snap(op.x + dx));
      m.y = Math.max(0, snap(op.y + dy));
    } else {
      var x = op.x;
      var y = op.y;
      var w = op.w;
      var h = op.h;
      var d = op.dir;
      if (d.indexOf("e") >= 0) w = Math.max(MIN_SIZE, snap(op.w + dx));
      if (d.indexOf("s") >= 0) h = Math.max(MIN_SIZE, snap(op.h + dy));
      if (d.indexOf("w") >= 0) {
        var nx = Math.min(snap(op.x + dx), op.x + op.w - MIN_SIZE);
        w = op.w + (op.x - nx);
        x = nx;
      }
      if (d.indexOf("n") >= 0) {
        var ny = Math.min(snap(op.y + dy), op.y + op.h - MIN_SIZE);
        h = op.h + (op.y - ny);
        y = ny;
      }
      m.x = Math.max(0, x);
      m.y = Math.max(0, y);
      m.w = w;
      m.h = h;
    }
    var el = elOf(m);
    if (el) {
      el.style.left = m.x + "px";
      el.style.top = m.y + "px";
      el.style.width = m.w + "px";
      el.style.height = m.h + "px";
    }
  }
  function onUp(e) {
    if (pdrag) {
      var cls = pdrag.cls;
      var moved = pdrag.moved;
      pdrag = null;
      if (ghost) {
        ghost.remove();
        ghost = null;
      }
      if (!moved) return addWidget(cls, null);
      if (body) {
        var r = body.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) addWidget(cls, formPoint(e));
      }
      return;
    }
    if (!op) return;
    var cur = op;
    op = null;
    if (!cur.moved) return;
    var m = cur.m;
    if (cur.kind === "move") {
      // dropped on another group box (or out of one): the widget changes parent, keeping its place on screen
      var p = formPoint(e);
      var target = containerAt(form.children, p.x, p.y, 0, 0, m);
      if (target !== m.parent) {
        var ap = m.parent ? absPos(m.parent) : { x: 0, y: 0 };
        var absX = ap.x + m.x;
        var absY = ap.y + m.y;
        var list = m.parent ? m.parent.children : form.children;
        list.splice(list.indexOf(m), 1);
        var no = target ? absPos(target) : { x: 0, y: 0 };
        m.x = Math.max(0, absX - no.x);
        m.y = Math.max(0, absY - no.y);
        m.parent = target;
        (target ? target.children : form.children).push(m);
      }
    }
    commit();
    renderAll();
  }
  document.addEventListener("pointermove", onMove);
  document.addEventListener("pointerup", onUp);
  document.addEventListener("pointercancel", onUp);

  // ---- double click: edit the text of the widget on the spot
  stage.addEventListener("dblclick", function (e) {
    if (form.locked || !body) return;
    var w = e.target.closest ? e.target.closest(".qt-w[data-id]") : null;
    var m = w ? modelOf(w) : null;
    if (!m || m.opaque) return;
    var key = TEXT_KEY[m.cls];
    if (!key) return;
    var r = w.getBoundingClientRect();
    var sr = stage.getBoundingClientRect();
    var i = mk("input", "qd-inline");
    i.type = "text";
    i.value = m.props[key] || "";
    i.style.left = r.left - sr.left + stage.scrollLeft + "px";
    i.style.top = r.top - sr.top + stage.scrollTop + "px";
    i.style.width = Math.max(r.width, 90) + "px";
    stage.append(i);
    editing = { m: m, key: key, input: i };
    i.focus();
    i.select();
    i.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") {
        ev.preventDefault();
        finishEdit(true);
      } else if (ev.key === "Escape") {
        ev.stopPropagation();
        finishEdit(false);
      }
    });
    i.addEventListener("blur", function () {
      finishEdit(true);
    });
  });
  function finishEdit(save) {
    if (!editing) return;
    var e = editing;
    editing = null;
    var v = e.input.value;
    e.input.remove();
    if (save && v !== (e.m.props[e.key] || "")) {
      e.m.props[e.key] = v;
      commit();
      renderAll();
    }
  }

  // ---- keyboard
  app.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    var typing = tag === "input" || tag === "textarea" || tag === "select";
    var mod = e.ctrlKey || e.metaKey;
    if (e.key === "Escape" && !editing) {
      e.stopPropagation();
      return close();
    }
    if (mod && !typing && (e.key === "z" || e.key === "Z")) {
      e.preventDefault();
      return e.shiftKey ? redo() : undo();
    }
    if (mod && !typing && (e.key === "y" || e.key === "Y")) {
      e.preventDefault();
      return redo();
    }
    if (typing || form.locked) return;
    if (mod && (e.key === "d" || e.key === "D")) {
      e.preventDefault();
      return duplicate();
    }
    if (!selected) return;
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      return removeSelected();
    }
    var step = e.shiftKey ? GRID : 1;
    var d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (d) {
      e.preventDefault();
      selected.x = Math.max(0, selected.x + d[0]);
      selected.y = Math.max(0, selected.y + d[1]);
      commit();
      renderAll();
    }
  });

  function close() {
    finishEdit(false);
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerup", onUp);
    document.removeEventListener("pointercancel", onUp);
    if (ghost) ghost.remove();
    modal.remove();
    if (opts.onClose) opts.onClose();
  }

  // ---- go
  document.body.append(modal);
  if (!form.locked) {
    history = [snapshot()];
    hix = 0;
  }
  renderAll();
  app.focus();
  return { close: close, getXml: snapshot, element: modal };
}
