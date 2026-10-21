/* ClassLedger student chapters: chapter list, chapter page, exercises, solutions, progress.

   Firestore layout (content is written by the admin only, see firestore.rules):
     chapters/{chapterId}                                   level, subject, topic, title, title_ar, order, published, rappel, exerciseCount
     chapters/{chapterId}/exercises/{exId}                  order, difficulty, lang (algo | python, optional), statement, hints[]  (hint: legacy single string)
     chapters/{chapterId}/exercises/{exId}/private/solution { text }   (fetched only when the student asks for it)
   Student progress:
     users/{uid}/progress/{chapterId}                       { status: { exId: "done" | "review" } }

   The page chrome is in the student's language (EN / AR); the course content is French. */

import { makeAlgoLauncher, openAlgoViz, openAlgoLibrary, libraryLabel, algoTitle, hasAlgoViz } from "./algoviz.js?v=62";

var STR = {
  fr: {
    loading: "Chargement…",
    loadFail: "Impossible de charger les chapitres. Vérifie ta connexion.",
    retry: "Réessayer",
    emptyTitle: "Tes premiers chapitres arrivent",
    emptyText: "Reviens bientôt : de nouveaux exercices sont ajoutés.",
    back: "Retour à {name}",
    allSubjects: "Toutes les matières",
    subjects: "Matières",
    exercises: "Exercices",
    exercisesCount: "{n} exercices",
    thinkWait: "Réfléchis encore {t}",
    thinkStart: "Commencer à réfléchir · {t}",
    thinkStop: "Arrêter et recommencer",
    fbAsk: "Ton avis sur cet exercice ?",
    fbEasy: "Facile",
    fbOk: "Bien",
    fbHard: "Difficile",
    fbThanks: "Merci !",
    fbComment: "Écrire un commentaire",
    fbFail: "Impossible d’envoyer. Réessaie.",
    navHome: "Accueil",
    hello: "Bonjour",
    meSub: "Voici où tu en es.",
    meNote: "À revoir = les exercices que tu as marqués « pas encore compris ».",
    mePct: "de progression totale",
    stDone: "Terminés",
    stReview: "À revoir",
    stLeft: "Restants",
    resumeCap: "Reprendre où tu t’es arrêté",
    resumeStartCap: "Commence ici",
    resumeBtn: "Continuer",
    resumeStartBtn: "Commencer",
    resumeAllDone: "Tout est terminé !",
    resumeAllDoneSub: "Tu as fini tous les exercices disponibles. D’autres arrivent bientôt.",
    resumeNone: "Les premiers exercices arrivent bientôt.",
    partN: "Partie {n}",
    doneOf: "{d} / {n} exercices",
    exLocked: "Termine l’exercice précédent pour débloquer celui-ci",
    weightCore: "Essentiel",
    weightMajor: "Important",
    weightMinor: "Complémentaire",
    weightTip: "Couleur du dossier = importance du chapitre pour l’examen",
    progress: "{done} / {total} terminés",
    rappel: "Rappel",
    hint: "Afficher un indice",
    hideHint: "Masquer l’indice",
    hintNext: "Indice suivant ({n}/{total})",
    hintLabel: "Indice {n}/{total}",
    hintLabelOne: "Indice",
    lesson: "Cours",
    tabCourse: "Cours",
    tabNotes: "Notes",
    lessonOpen: "Ouvrir le cours",
    lessonClose: "Masquer le cours",
    lessonSections: "{n} sections",
    answerLabel: "Ta réponse",
    answerPlaceholder: "Essaie d’abord : écris ta réponse ici pour débloquer la solution.",
    qPlaceholder: "Ta réponse à la question {n}…",
    saving: "Enregistrement…",
    savedAns: "Enregistré",
    saveAnsFail: "Impossible d’enregistrer ta réponse. Nouvel essai en cours.",
    hintsUsed: "Indices {n}/{total}",
    indent: "Indenter",
    outdent: "Désindenter",
    showSolution: "Afficher la solution",
    solution: "Solution",
    gotIt: "J’ai compris",
    reviewLater: "À revoir",
    done: "Terminé",
    review: "À revoir",
    d_easy: "Facile",
    d_medium: "Moyen",
    d_bac: "Niveau Bac",
    s_prog: "Programmation",
    s_sti: "STI (Web)",
    s_info: "Informatique",
    chaptersCount: "{n} chapitres",
    chaptersOne: "1 chapitre",
    soon: "Bientôt disponible",
    notes: "Mes notes",
    notesHint: "Écris ce qui compte pour toi dans ce cours.",
    newNote: "Nouvelle note",
    noteEdit: "Modifier la note",
    noteColor: "Couleur",
    nc_lime: "Vert",
    nc_blue: "Bleu",
    nc_pink: "Rose",
    nc_azure: "Marine",
    noteTitle: "Titre",
    noteBody: "Écris ta note ici…",
    save: "Enregistrer",
    cancel: "Annuler",
    del: "Supprimer",
    confirmDelete: "Supprimer cette note ?",
    untitled: "Sans titre",
    notesCount: "{n} notes",
    noteOne: "1 note",
    notesFail: "Les notes sont indisponibles pour le moment.",
    desc_prog: "Algorithmique, Python et exercices type Bac",
    desc_sti: "Web, HTML, CSS et plus encore",
    desc_info: "Cours et exercices, pas à pas",
    saveFail: "Impossible d’enregistrer ta progression. Réessaie.",
    solFail: "Impossible de charger la solution. Réessaie.",
  },
  ar: {
    loading: "لحظة…",
    loadFail: "ما نجمناش نحمّلو الفصول. تثبّت من الإنترنت.",
    retry: "عاود جرّب",
    emptyTitle: "أول الفصول جايين في الطريق",
    emptyText: "ارجع قريب: تمارين جديدة تتزاد.",
    back: "رجوع إلى {name}",
    allSubjects: "كل المواد",
    subjects: "المواد",
    exercises: "التمارين",
    exercisesCount: "{n} تمارين",
    thinkWait: "فكّر زادة {t}",
    thinkStart: "ابدأ التفكير · {t}",
    thinkStop: "أوقف وابدأ من جديد",
    fbAsk: "رأيك في التمرين؟",
    fbEasy: "سهل",
    fbOk: "مناسب",
    fbHard: "صعب",
    fbThanks: "يعطيك الصحة!",
    fbComment: "اكتب تعليق",
    fbFail: "ما نجّمناش نبعثوه. عاود.",
    navHome: "الرئيسية",
    hello: "مرحبا",
    meSub: "هذا وين وصلت.",
    meNote: "للمراجعة = التمارين اللي حطّيتها «ما فهمتهاش مليح».",
    mePct: "من التقدّم الكلي",
    stDone: "منجزة",
    stReview: "للمراجعة",
    stLeft: "المتبقية",
    resumeCap: "كمّل من وين وقفت",
    resumeStartCap: "ابدأ من هنا",
    resumeBtn: "كمّل",
    resumeStartBtn: "ابدأ",
    resumeAllDone: "كلشي مكتمل!",
    resumeAllDoneSub: "كمّلت كل التمارين المتوفرة. جاية أخرى قريب.",
    resumeNone: "أول التمارين جاية قريب.",
    partN: "الجزء {n}",
    doneOf: "{d} / {n} تمارين",
    exLocked: "كمّل التمرين اللي قبل باش يتفتح هذا",
    weightCore: "أساسي",
    weightMajor: "مهم",
    weightMinor: "تكميلي",
    weightTip: "لون الملف = أهمية الدرس في الامتحان",
    progress: "{done} / {total} مكتملة",
    rappel: "تذكير",
    hint: "شوف تلميح",
    hideHint: "خبّي التلميح",
    hintNext: "التلميح الموالي ({n}/{total})",
    hintLabel: "تلميح {n}/{total}",
    hintLabelOne: "تلميح",
    lesson: "الدرس",
    tabCourse: "الدرس",
    tabNotes: "ملاحظات",
    lessonOpen: "شوف الدرس",
    lessonClose: "خبّي الدرس",
    lessonSections: "{n} أقسام",
    answerLabel: "جوابك",
    answerPlaceholder: "جرّب الأول: اكتب جوابك هنا باش يتفتح الحل.",
    qPlaceholder: "جوابك على السؤال {n}…",
    saving: "نحفظو…",
    savedAns: "تمّ الحفظ",
    saveAnsFail: "ما نجمناش نحفظو جوابك. باش نعاودو المحاولة.",
    hintsUsed: "تلميحات {n}/{total}",
    indent: "إزاحة",
    outdent: "تراجع",
    showSolution: "شوف الحل",
    solution: "الحل",
    gotIt: "نجحت",
    reviewLater: "نراجعو بعد",
    done: "مكتمل",
    review: "للمراجعة",
    d_easy: "سهل",
    d_medium: "متوسط",
    d_bac: "مستوى الباك",
    s_prog: "البرمجة",
    s_sti: "STI (الويب)",
    s_info: "الإعلامية",
    chaptersCount: "{n} فصول",
    chaptersOne: "فصل واحد",
    soon: "قريبا",
    notes: "ملاحظاتي",
    notesHint: "اكتب اللي يهمك من الدرس.",
    newNote: "ملاحظة جديدة",
    noteEdit: "تعديل الملاحظة",
    noteColor: "اللون",
    nc_lime: "أخضر",
    nc_blue: "أزرق",
    nc_pink: "وردي",
    nc_azure: "كحلي",
    noteTitle: "العنوان",
    noteBody: "اكتب ملاحظتك هنا…",
    save: "حفظ",
    cancel: "إلغاء",
    del: "حذف",
    confirmDelete: "تحب تحذف الملاحظة هذي؟",
    untitled: "بلا عنوان",
    notesCount: "{n} ملاحظات",
    noteOne: "ملاحظة وحدة",
    notesFail: "الملاحظات موش متوفرة توّا.",
    desc_prog: "خوارزميات وPython وتمارين على نمط الباك",
    desc_sti: "الويب وHTML وCSS وأكثر",
    desc_info: "دروس وتمارين خطوة بخطوة",
    saveFail: "ما نجمناش نحفظو تقدمك. عاود جرّب.",
    solFail: "ما نجمناش نحمّلو الحل. عاود جرّب.",
  },
};

var LEVEL_ID = { "2": "2eme", "3": "3eme", "4": "bac" }; // from levelCodeOf() in student.js
var SUBJECTS = ["prog", "sti", "info"];
var SUBJECTS_BY_LEVEL = { "2eme": ["info"], "3eme": ["prog", "sti"], bac: ["prog", "sti"] };
var SUBJECT_COLOR = { prog: "#0464de", sti: "#aee37b", info: "#0464de" };
var MIN_ANSWER = 10; // characters typed before the solution unlocks
/* Thinking time before the solution button unlocks (seconds), by difficulty. An exercise can set its own with "think" (0 = no wait). */
var THINK_DEFAULT = { easy: 60, medium: 180, bac: 360 };
var THINK_KEY = "classledger:think:";
var thinkSpent = {}; // "chapterId/exId" -> seconds the exercise has been open and on screen
var thinkTimers = {}; // "chapterId/exId" -> { card, update }
var thinkTick = 0;
function thinkNeed(ex, diff) {
  if (ex.think != null && ex.think !== "" && isFinite(Number(ex.think)) && Number(ex.think) >= 0) {
    return Math.min(3600, Math.round(Number(ex.think)));
  }
  return THINK_DEFAULT[diff] || 0;
}
function mmss(sec) {
  sec = Math.max(0, Math.ceil(sec));
  var m = Math.floor(sec / 60);
  var r = sec % 60;
  return m + ":" + (r < 10 ? "0" : "") + r;
}
function loadThink() {
  try {
    thinkSpent = JSON.parse(localStorage.getItem(THINK_KEY + ctx.uid) || "{}") || {};
  } catch (e) {
    thinkSpent = {};
  }
}
function saveThink() {
  try {
    localStorage.setItem(THINK_KEY + ctx.uid, JSON.stringify(thinkSpent));
  } catch (e) {}
}
function startThinkTicker() {
  setInterval(function () {
    if (document.hidden) return; // time only counts while the page is on screen
    thinkTick++;
    Object.keys(thinkTimers).forEach(function (k) {
      var tm = thinkTimers[k];
      if (!tm.card.isConnected) {
        delete thinkTimers[k];
        return;
      }
      if (thinkSpent[k] === undefined) return; // the student has not pressed "start" yet
      if (tm.card.classList.contains("is-collapsed")) return; // a closed exercise does not count
      thinkSpent[k] = (thinkSpent[k] || 0) + 1;
      tm.update();
    });
    if (thinkTick % 5 === 0) saveThink();
  }, 1000);
}
var ratings = {}; // "chapterId/exId" -> "easy" | "ok" | "hard" (the student's own opinion)

var ICON_RESET =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3.5 4.5v4.8h4.8"/></svg>';
var ICON_LOCK =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
var ICON_BACK =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m11 6-6 6 6 6"/></svg>';

var ctx = null;
var S = {
  loadedKey: null, // level code the list was loaded for
  loading: false,
  failed: false,
  chapters: [],
  status: {}, // chapterId -> { exId: "done" | "review" }
  notes: [], // all of the student's notes, newest first
  notesOk: true,
  subject: null,
  cur: null, // { id, exercises, loading, failed } for the open chapter
};
var drafts = {}; // "chapterId/exId#box" -> typed answer (survives re-renders; box "0" = the only box, "1".."n" = one per question)
var answersLoaded = {}; // chapterId -> the saved answers were read from Firestore
var saveTimers = {}; // "chapterId/exId" -> pending save (debounce)
var saveState = {}; // "chapterId/exId" -> "saving" | "saved" | "error"
var saveVer = {}; // "chapterId/exId" -> counter, to know if more was typed while a save was running
var hintShown = {}; // "chapterId/exId" -> how many hints the student has revealed (one per click)
var deskOpen = {}; // "chapterId/exId" -> true/false once the student opened/closed an exercise on a wide screen (until then: only finished exercises are closed)
var openEx = {}; // chapterId -> id of the exercise that is open on phones (the others are one row each)
var tabs = {}; // chapterId -> "course" | "ex" | "notes": what the middle of the chapter page shows
var notesWide = window.matchMedia("(min-width: 1101px)"); // wide: notes sit in a column on the right; narrower: they are a third tab
var lessonOpen = {}; // chapterId -> the lesson is open (it is closed until the student asks)
var sectionOpen = {}; // "chapterId#index" -> that lesson section is open
var revealed = {};
var solutions = {}; // "chapterId/exId" -> text
var rowError = {};
var editing = null; // note id, "new", or null
var noteDraft = { title: "", body: "" };
var noteError = "";
var NOTE_COLORS = { lime: "#aee37b", blue: "#0464de", pink: "#e64d6b", azure: "#032c7b" }; // the site palette
var NOTE_ORDER = ["lime", "blue", "pink", "azure"];
var NOTE_INK = { lime: "#1f4a0c", blue: "#ffffff", pink: "#ffffff", azure: "#ffffff" }; // text on top of each colour
var NOTE_COLOR_KEY = "classledger:noteColors";
var NOTE_TITLE_MAX = 100;
var NOTE_BODY_MAX = 4000;
var ANSWER_MAX = 4000; // characters per answer box
var MIN_Q = 5; // characters typed in each question box before the solution unlocks

function t(key) {
  return STR[ctx && ctx.getLang() === "ar" ? "ar" : "fr"][key];
}
function tf(key, vars) {
  var out = t(key);
  Object.keys(vars || {}).forEach(function (k) {
    out = out.replace("{" + k + "}", vars[k]);
  });
  return out;
}
function $(id) {
  return document.getElementById(id);
}
function el(tag, cls, text) {
  var node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

/* ---------------- tiny safe markdown: ## title, **bold**, `code`, ``` fences ``` ---------------- */
function inline(parent, text) {
  String(text)
    .split(/(\*\*[^*]+\*\*|`[^`]+`)/)
    .forEach(function (part) {
      if (!part) return;
      if (part.slice(0, 2) === "**" && part.slice(-2) === "**" && part.length > 4) {
        parent.append(el("strong", "", part.slice(2, -2)));
      } else if (part.charAt(0) === "`" && part.slice(-1) === "`" && part.length > 2) {
        parent.append(el("code", "ch-inline-code", part.slice(1, -1)));
      } else {
        parent.append(document.createTextNode(part));
      }
    });
}
// code blocks: ```algo and ```python written one after the other become one block with two tabs
// (Algorithme is the default, the choice is remembered); a block with no language stays as it is (traces, outputs)
var CODE_LABEL = { algo: "Algorithme", python: "Python" };
var codeLang = "algo";
try {
  var savedLang = window.localStorage.getItem("cl.codeLang");
  if (savedLang === "python" || savedLang === "algo") codeLang = savedLang;
} catch (e) {}

function setCodeLang(l) {
  codeLang = l;
  try {
    window.localStorage.setItem("cl.codeLang", l);
  } catch (e) {}
  Array.prototype.forEach.call(document.querySelectorAll(".code-pair"), function (p) {
    p.setAttribute("data-lang", l);
    Array.prototype.forEach.call(p.querySelectorAll(".code-tab"), function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-l") === l ? "true" : "false");
    });
  });
}

function wordSet(list) {
  var o = Object.create(null);
  list.split(" ").forEach(function (w) {
    o[w] = true;
  });
  return o;
}
var KEYWORDS = {
  algo: wordSet("Fonction Procédure DEBUT FIN Si Alors Sinon FinSi Pour de à Faire FinPour Tant que FinTantQue Répéter Jusqu'à Vrai Faux div mod ET OU NON Retourner Lire Écrire"),
  python: wordSet("def if elif else return for while in range and or not True False break"),
};
// light colouring (keywords, comments) built with DOM nodes only; the text itself is never changed
function codeBlock(code, lang) {
  var pre = el("pre", "test-code" + (lang ? " code-" + lang : ""));
  var kw = KEYWORDS[lang];
  if (!kw) {
    pre.textContent = code;
    return pre;
  }
  var re =
    lang === "python"
      ? /(#[^\n]*)|([A-Za-zÀ-ÿ_'][A-Za-zÀ-ÿ_0-9']*)|([\s\S])/g
      : /(\{[^}]*\})|([A-Za-zÀ-ÿ_'][A-Za-zÀ-ÿ_0-9']*)|([\s\S])/g;
  pre.classList.add("has-ln"); // line numbers (CSS counter on .cl)
  var line = el("span", "cl");
  pre.append(line);
  var m;
  while ((m = re.exec(code))) {
    if (m[1]) line.append(el("span", "tk-com", m[1]));
    else if (m[2] && kw[m[2]]) line.append(el("span", "tk-kw", m[2]));
    else if (m[0] === "\n") {
      pre.append(document.createTextNode("\n"));
      line = el("span", "cl");
      pre.append(line);
    } else line.append(document.createTextNode(m[0]));
  }
  return pre;
}
// one coloured line of code, for the animations
function codeLine(text, lang) {
  var frag = document.createDocumentFragment();
  var kw = KEYWORDS[lang];
  var re =
    lang === "python"
      ? /(#[^\n]*)|([A-Za-zÀ-ÿ_'][A-Za-zÀ-ÿ_0-9']*)|([\s\S])/g
      : /(\{[^}]*\})|([A-Za-zÀ-ÿ_'][A-Za-zÀ-ÿ_0-9']*)|([\s\S])/g;
  var m;
  while ((m = re.exec(text))) {
    if (m[1]) frag.append(el("span", "tk-com", m[1]));
    else if (m[2] && kw[m[2]]) frag.append(el("span", "tk-kw", m[2]));
    else frag.append(document.createTextNode(m[0]));
  }
  return frag;
}
function codePair(a, b) {
  var wrap = el("div", "code-pair");
  wrap.setAttribute("data-lang", codeLang);
  var tabs = el("div", "code-tabs");
  tabs.setAttribute("role", "group");
  ["algo", "python"].forEach(function (l) {
    var btn = el("button", "code-tab", CODE_LABEL[l]);
    btn.type = "button";
    btn.setAttribute("data-l", l);
    btn.setAttribute("aria-pressed", codeLang === l ? "true" : "false");
    btn.addEventListener("click", function () {
      setCodeLang(l);
    });
    tabs.append(btn);
  });
  wrap.append(tabs, codeBlock(a.v, a.lang), codeBlock(b.v, b.lang));
  return wrap;
}

function vizOpts() {
  return {
    el: el,
    codeLine: codeLine,
    lang: function () {
      return ctx.getLang();
    },
    codeLang: function () {
      return codeLang;
    },
    setCodeLang: setCodeLang,
  };
}
// the animations a lesson contains (```viz blocks), in order, without duplicates
function vizKinds(text) {
  var out = [];
  var re = /```viz\s*\n?\s*([a-z-]+)/g;
  var m;
  while ((m = re.exec(String(text || "")))) if (out.indexOf(m[1]) < 0) out.push(m[1]);
  return out;
}
// buttons above the lesson: they open the split-screen animation box
function vizBar(ch) {
  var kinds = vizKinds(ch.rappel);
  if (!kinds.length) return null;
  var ar = ctx.getLang() === "ar";
  var bar = el("div", "av-bar-top");
  bar.append(el("span", "av-bar-top-l", ar ? "رسوم متحركة" : "Animations"));
  kinds.forEach(function (k) {
    var b = el("button", "pc-btn av-top-btn", algoTitle(k, ctx.getLang()));
    b.type = "button";
    b.addEventListener("click", function () {
      openAlgoViz(k, vizOpts());
    });
    bar.append(b);
  });
  return bar;
}

function md(text) {
  var box = el("div", "ch-content");
  box.setAttribute("lang", "fr");
  box.setAttribute("dir", "ltr");
  var src = String(text || "");
  var segs = [];
  var fence = /```([a-zA-Z]*)\n?([\s\S]*?)```/g;
  var last = 0;
  var f;
  while ((f = fence.exec(src))) {
    if (f.index > last) segs.push({ code: false, v: src.slice(last, f.index) });
    segs.push({ code: true, lang: f[1], v: f[2].replace(/\n+$/, "") });
    last = fence.lastIndex;
  }
  if (last < src.length) segs.push({ code: false, v: src.slice(last) });

  function words(v) {
    v.split(/\n{2,}/)
      .map(function (p) {
        return p.replace(/^\n+|\n+$/g, "");
      })
      .filter(Boolean)
      .forEach(function (para) {
        if (para.slice(0, 3) === "## ") {
          var h = el("h3", "ch-h");
          inline(h, para.slice(3));
          box.append(h);
        } else {
          var p = el("p", "ch-p");
          inline(p, para);
          box.append(p);
        }
      });
  }
  for (var i = 0; i < segs.length; i++) {
    var s = segs[i];
    if (!s.code) {
      words(s.v);
      continue;
    }
    if (s.lang === "viz") {
      box.append(makeAlgoLauncher(s.v.trim(), vizOpts()));
      continue;
    }
    var known = s.lang === "algo" || s.lang === "python";
    var j = i + 1;
    if (j < segs.length && !segs[j].code && !segs[j].v.trim()) j++;
    var nx = segs[j];
    if (known && nx && nx.code && (nx.lang === "algo" || nx.lang === "python") && nx.lang !== s.lang) {
      box.append(codePair(s, nx));
      i = j;
    } else if (known) {
      var one = el("div", "code-one");
      one.append(el("span", "code-label", CODE_LABEL[s.lang]), codeBlock(s.v, s.lang));
      box.append(one);
    } else {
      box.append(codeBlock(s.v, ""));
    }
  }
  return box;
}

/* ---------------- data ---------------- */
function statusOf(chId) {
  return S.status[chId] || {};
}
function doneCount(ch) {
  var st = statusOf(ch.id);
  return Object.keys(st).filter(function (k) {
    return st[k] === "done";
  }).length;
}

async function load() {
  var sdk = ctx.sdk;
  var key = ctx.getLevel();
  S.loadedKey = key;
  S.loading = true;
  S.failed = false;
  render();
  try {
    var cons = [sdk.where("published", "==", true)];
    var levelId = LEVEL_ID[key];
    if (levelId) cons.push(sdk.where("level", "==", levelId));
    var q = sdk.query.apply(null, [sdk.collection(ctx.db, "chapters")].concat(cons));
    var snap = await sdk.getDocs(q);
    if (S.loadedKey !== key) return; // the level changed while loading
    S.chapters = snap.docs
      .map(function (d) {
        return Object.assign({ id: d.id }, d.data());
      })
      .sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
      });
    var pr = await sdk.getDocs(sdk.collection(ctx.db, "users", ctx.uid, "progress"));
    S.status = {};
    pr.docs.forEach(function (d) {
      if (d.id !== "placement" && d.data().status) S.status[d.id] = d.data().status;
    });
  } catch (e) {
    console.warn("Couldn’t load the chapters:", e);
    S.failed = true;
  }
  try {
    var nsnap = await sdk.getDocs(sdk.collection(ctx.db, "users", ctx.uid, "notes"));
    S.notes = nsnap.docs
      .map(function (d) {
        return Object.assign({ id: d.id }, d.data());
      })
      .sort(function (a, b) {
        return (b.updatedAt || 0) - (a.updatedAt || 0);
      });
    S.notesOk = true;
  } catch (e) {
    console.warn("Couldn’t load the notes:", e);
    S.notes = [];
    S.notesOk = false;
  }
  S.loading = false;
  render();
}

/* ---------------- notes ---------------- */
function notesOf(chId) {
  return S.notes.filter(function (n) {
    return n.chapterId === chId;
  });
}
function notesLabel(n) {
  return n === 1 ? t("noteOne") : tf("notesCount", { n: n });
}
function localNoteColors() {
  try {
    return JSON.parse(localStorage.getItem(NOTE_COLOR_KEY) || "{}") || {};
  } catch (e) {
    return {};
  }
}
function rememberNoteColor(id, color) {
  try {
    var m = localNoteColors();
    m[id] = color;
    localStorage.setItem(NOTE_COLOR_KEY, JSON.stringify(m));
  } catch (e) {}
}
function noteColorOf(n, i) {
  var c = n.color || localNoteColors()[n.id];
  return NOTE_COLORS[c] ? c : NOTE_ORDER[i % NOTE_ORDER.length];
}
async function saveNote(chId, id) {
  var sdk = ctx.sdk;
  var color = NOTE_COLORS[noteDraft.color] ? noteDraft.color : NOTE_ORDER[0];
  var data = {
    chapterId: chId,
    title: noteDraft.title.trim().slice(0, NOTE_TITLE_MAX),
    body: noteDraft.body.slice(0, NOTE_BODY_MAX),
    color: color,
    updatedAt: Date.now(),
  };
  var ref = id
    ? sdk.doc(ctx.db, "users", ctx.uid, "notes", id)
    : sdk.doc(sdk.collection(ctx.db, "users", ctx.uid, "notes"));
  try {
    try {
      await sdk.setDoc(ref, data);
    } catch (e1) {
      // the Firestore rules may not know the "color" field yet: save the note without it and keep the colour on this device
      var plain = Object.assign({}, data);
      delete plain.color;
      await sdk.setDoc(ref, plain);
      rememberNoteColor(ref.id, color);
    }
    var saved = Object.assign({ id: ref.id }, data);
    S.notes = [saved].concat(
      S.notes.filter(function (n) {
        return n.id !== ref.id;
      }),
    );
    noteError = "";
    editing = null;
  } catch (e) {
    console.warn("Couldn’t save the note:", e);
    noteError = t("saveFail");
  }
}
async function removeNote(id) {
  try {
    await ctx.sdk.deleteDoc(ctx.sdk.doc(ctx.db, "users", ctx.uid, "notes", id));
    S.notes = S.notes.filter(function (n) {
      return n.id !== id;
    });
    noteError = "";
    editing = null;
  } catch (e) {
    console.warn("Couldn’t delete the note:", e);
    noteError = t("saveFail");
  }
}
function dateLabel(ms) {
  try {
    return new Date(ms).toLocaleDateString(ctx.getLang() === "ar" ? "ar-TN" : "fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  } catch (e) {
    return "";
  }
}

async function loadExercises(chId) {
  var sdk = ctx.sdk;
  S.cur = { id: chId, exercises: null, loading: true, failed: false };
  try {
    var snap = await sdk.getDocs(sdk.collection(ctx.db, "chapters", chId, "exercises"));
    if (!S.cur || S.cur.id !== chId) return;
    S.cur.exercises = snap.docs
      .map(function (d) {
        return Object.assign({ id: d.id }, d.data());
      })
      .sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
      });
  } catch (e) {
    console.warn("Couldn’t load the exercises:", e);
    if (S.cur && S.cur.id === chId) S.cur.failed = true;
  }
  if (S.cur && S.cur.id === chId && !S.cur.failed) await loadAnswers(chId);
  if (S.cur && S.cur.id === chId && !S.cur.failed && ctx.loadRatings) {
    try {
      var mine = await ctx.loadRatings(chId);
      Object.keys(mine).forEach(function (k) {
        ratings[chId + "/" + k] = mine[k];
      });
    } catch (e) {} // rules not published yet: the buttons still show, a failed send says so
  }
  if (S.cur && S.cur.id === chId) S.cur.loading = false;
  render();
}

/* ---------------- saved answers: users/{uid}/answers/{chapterId} = { items: { exId: { a: { "1": text, ... }, h: hints } } } ---------------- */
async function loadAnswers(chId) {
  if (answersLoaded[chId]) return;
  try {
    var snap = await ctx.sdk.getDoc(ctx.sdk.doc(ctx.db, "users", ctx.uid, "answers", chId));
    var items = snap.exists() ? snap.data().items || {} : {};
    Object.keys(items).forEach(function (exId) {
      var it = items[exId] || {};
      var key = chId + "/" + exId;
      var a = it.a || {};
      Object.keys(a).forEach(function (n) {
        var dk = key + "#" + n;
        if (drafts[dk] === undefined && typeof a[n] === "string") drafts[dk] = a[n]; // what is typed now wins
      });
      if (typeof it.h === "number") hintShown[key] = Math.max(hintShown[key] || 0, it.h);
    });
    answersLoaded[chId] = true;
  } catch (e) {
    console.warn("Couldn’t load the saved answers:", e);
  }
}
function paintSaved(key) {
  var exId = key.slice(key.indexOf("/") + 1);
  var node = document.querySelector("#ex-" + exId + " .ex-saved");
  if (!node) return;
  var st = saveState[key];
  node.textContent = st === "saving" ? t("saving") : st === "saved" ? "✓ " + t("savedAns") : st === "error" ? t("saveAnsFail") : "";
  node.classList.toggle("is-error", st === "error");
}
function queueSave(chId, exId) {
  var key = chId + "/" + exId;
  saveVer[key] = (saveVer[key] || 0) + 1;
  saveState[key] = "saving";
  paintSaved(key);
  clearTimeout(saveTimers[key]);
  saveTimers[key] = setTimeout(function () {
    flushSave(chId, exId);
  }, 1500);
}
async function flushSave(chId, exId) {
  var key = chId + "/" + exId;
  clearTimeout(saveTimers[key]);
  saveTimers[key] = null;
  if (saveState[key] !== "saving" && saveState[key] !== "error") return;
  var ver = saveVer[key];
  var a = {};
  var prefix = key + "#";
  Object.keys(drafts).forEach(function (k) {
    if (k.indexOf(prefix) === 0) a[k.slice(prefix.length)] = drafts[k];
  });
  var items = {};
  items[exId] = { a: a, h: hintShown[key] || 0 };
  try {
    await ctx.sdk.setDoc(
      ctx.sdk.doc(ctx.db, "users", ctx.uid, "answers", chId),
      { items: items, updatedAt: ctx.sdk.serverTimestamp() },
      { merge: true },
    );
    if (saveVer[key] === ver) saveState[key] = "saved";
  } catch (e) {
    console.warn("Couldn’t save the answer:", e);
    saveState[key] = "error";
    saveTimers[key] = setTimeout(function () {
      flushSave(chId, exId);
    }, 8000);
  }
  paintSaved(key);
}
window.addEventListener("pagehide", function () {
  Object.keys(saveTimers).forEach(function (key) {
    if (saveTimers[key]) {
      var i = key.indexOf("/");
      flushSave(key.slice(0, i), key.slice(i + 1));
    }
  });
});

async function loadSolution(chId, exId) {
  var key = chId + "/" + exId;
  var snap = await ctx.sdk.getDoc(
    ctx.sdk.doc(ctx.db, "chapters", chId, "exercises", exId, "private", "solution"),
  );
  solutions[key] = snap.exists() ? String(snap.data().text || "") : "";
}

async function setStatus(chId, exId, value) {
  var sdk = ctx.sdk;
  var before = S.status[chId];
  var next = {};
  next[exId] = value;
  S.status[chId] = Object.assign({}, before, next);
  try {
    await sdk.setDoc(
      sdk.doc(ctx.db, "users", ctx.uid, "progress", chId),
      { status: S.status[chId], updatedAt: sdk.serverTimestamp() },
      { merge: true },
    );
    rowError[chId + "/" + exId] = "";
  } catch (e) {
    console.warn("Couldn’t save the progress:", e);
    S.status[chId] = before;
    rowError[chId + "/" + exId] = t("saveFail");
  }
}

/* ---------------- route: #c=<chapterId> ---------------- */
function readRoute() {
  var h = window.location.hash || "";
  var c = /(?:^|[#&])c=([^&]+)/.exec(h);
  var sub = /(?:^|[#&])s=([^&]+)/.exec(h);
  return { c: c ? decodeURIComponent(c[1]) : "", s: sub ? decodeURIComponent(sub[1]) : "" };
}
function go(hash) {
  window.location.hash = hash; // fires hashchange, which re-renders
}
function openChapter(id) {
  go("c=" + encodeURIComponent(id));
}
function openSubject(sub) {
  go("s=" + encodeURIComponent(sub));
}
function closeToHome() {
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    render();
  } else {
    go("");
  }
}

/* ---------------- list ---------------- */
function subjectsPresent() {
  return SUBJECTS.filter(function (s) {
    return S.chapters.some(function (c) {
      return c.subject === s;
    });
  });
}

// the subjects of the student's level are always shown, even when one has no chapter yet
function subjectList() {
  var id = LEVEL_ID[ctx.getLevel()];
  if (SUBJECTS_BY_LEVEL[id]) return SUBJECTS_BY_LEVEL[id];
  // level not set yet: Prog and STI always, plus any other subject that has chapters
  var list = ["prog", "sti"];
  if (subjectsPresent().indexOf("info") >= 0) list.push("info");
  return list;
}

/* A progress bar made of two pills (done / remaining) that meet with round ends, instead of a fill sliding under the track. */
function segBar(bar, pct) {
  pct = Math.max(0, Math.min(100, Math.round(pct)));
  bar.classList.add("seg");
  bar.textContent = "";
  if (pct > 0) {
    var fill = el("i");
    fill.style.width = pct + "%";
    bar.append(fill);
  }
  if (pct < 100) bar.append(el("b", "seg-rest"));
}

function subjectCard(sub) {
  var chs = S.chapters.filter(function (c) {
    return c.subject === sub;
  });
  var done = 0;
  var total = 0;
  chs.forEach(function (c) {
    done += doneCount(c);
    total += Number(c.exerciseCount) || 0;
  });
  var card = el("button", "subject-card is-" + sub);
  card.type = "button";
  var ic = el("span", "sc-ico");
  ic.innerHTML = ctx.subjectIcon ? ctx.subjectIcon(sub) : ""; // static, trusted SVG
  var label =
    chs.length === 1
      ? t("chaptersOne")
      : chs.length
        ? tf("chaptersCount", { n: chs.length })
        : t("soon");
  card.append(ic, el("b", "sc-title", t("s_" + sub)), el("span", "sc-desc", t("desc_" + sub)));
  card.append(el("span", "sc-pill" + (chs.length ? "" : " is-soon"), label));
  if (total) {
    var bar = el("span", "domain-bar sc-bar");
    segBar(bar, (done / total) * 100);
    card.append(bar, el("small", "sc-meta", tf("progress", { done: done, total: total })));
  }
  card.addEventListener("click", function () {
    openSubject(sub);
  });
  return card;
}

/* How much a chapter matters for the exam: core / major / minor.
   The chapter's own `weight` field (set in its json) wins; this table is only the fallback. */
var WEIGHT_DEFAULT = {
  "bac-prog-tableaux": "core",
  "bac-prog-matrices": "core",
  "bac-prog-enregistrements": "core",
  "bac-prog-fichiers-types": "core",
  "bac-prog-fichiers-textes": "core",
  "bac-prog-tris-simples": "major",
  recursivite: "major",
  "bac-prog-iteratif-recursif": "major",
  "bac-prog-suites": "major",
  "bac-prog-python": "major",
  "bac-prog-tri-shell": "minor",
  "bac-prog-pgcd-bases": "minor",
  "bac-prog-approximation": "minor",
  "bac-prog-qt": "minor",
};
function weightOf(ch) {
  var w = String(ch.weight || WEIGHT_DEFAULT[ch.id] || "");
  return w === "core" || w === "major" || w === "minor" ? w : "";
}

/* A chapter is a folder; its notes are the sheets peeking out of it.
   Folder colours are picked among the brand colours: stable for a given chapter, never the same as the previous folder. */
var FOLDER_COLORS = 4;
var lastFolderColor = -1;
function folderColor(id) {
  var h = 0;
  for (var i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  var c = h % FOLDER_COLORS;
  if (c === lastFolderColor) c = (c + 1) % FOLDER_COLORS;
  lastFolderColor = c;
  return c;
}
var ICON_FOLDER_BOOK =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.4C10.4 5.2 8.3 4.6 5.4 4.6H3.5v13.9h1.9c2.9 0 5 .6 6.6 1.8 1.6-1.2 3.7-1.8 6.6-1.8h1.9V4.6h-1.9c-2.9 0-5 .6-6.6 1.8z"/><path d="M12 6.4v13.9"/></svg>';
/* half-circle progress with round ends, the percentage in the middle */
function halfGauge(pct) {
  pct = Math.max(0, Math.min(100, Math.round(pct)));
  var ns = "http://www.w3.org/2000/svg";
  var wrap = el("span", "fd-gauge");
  var svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 64 38");
  svg.setAttribute("aria-hidden", "true");
  var d = "M7 33 A25 25 0 0 1 57 33";
  // like the half-donut on the teacher page: two arcs with round ends and a small gap, the rest never runs under the colour.
  // A round cap sticks out half the stroke width past each end of its dash, so every dash is shortened by that on both sides.
  var CAP = (4.5 / (Math.PI * 25)) * 100;
  var GAP = 4;
  function arc(cls, from, to) {
    var path = document.createElementNS(ns, "path");
    path.setAttribute("d", d);
    path.setAttribute("class", cls);
    path.setAttribute("pathLength", "100");
    path.setAttribute("stroke-dasharray", Math.max(to - from - 2 * CAP, 0.01) + " 200");
    path.setAttribute("stroke-dashoffset", String(-(from + CAP)));
    svg.appendChild(path);
  }
  if (pct === 0) arc("fg-rest", 0, 100);
  else if (pct === 100) arc("fg-bar", 0, 100);
  else {
    arc("fg-bar", 0, pct - GAP / 2);
    arc("fg-rest", pct + GAP / 2, 100);
  }
  wrap.appendChild(svg);
  wrap.appendChild(el("b", "fd-gauge-n", pct + "%"));
  wrap.setAttribute("role", "img");
  wrap.setAttribute("aria-label", pct + "%");
  return wrap;
}
function chapterCard(ch) {
  var total = Number(ch.exerciseCount) || 0;
  var done = doneCount(ch);
  var nNotes = notesOf(ch.id).length;
  var title = ctx.getLang() === "ar" && ch.title_ar ? ch.title_ar : ch.title;
  var soon = total === 0; // listed in the programme, exercises not written yet
  var card = el("button", "folder fc" + folderColor(ch.id) + (soon ? " is-soon" : ""));
  card.type = "button";
  card.disabled = soon;
  card.append(el("span", "fd-tab"));
  var back = el("span", "fd-back");
  var sheets = Math.max(1, Math.min(3, nNotes));
  var recent = notesOf(ch.id); // newest first: the newest note is the sheet on top
  for (var i = 1; i <= sheets; i++) {
    var note = nNotes ? recent[sheets - i] : null;
    var sheet = el("span", "fd-sheet s" + i + (nNotes ? " has-note" : " is-blank"));
    if (note) {
      var st = el("b", "fd-sheet-t", note.title || note.body || t("untitled"));
      st.setAttribute("dir", "auto");
      sheet.append(st);
    }
    back.append(sheet);
  }
  card.append(back);
  var front = el("span", "fd-front");
  var row = el("span", "fd-row");
  var ic = el("span", "fd-ico");
  ic.innerHTML = ICON_FOLDER_BOOK; // static, trusted SVG
  row.append(ic);
  if (total) row.append(halfGauge((done / total) * 100));
  front.append(row, el("b", "fd-title", title || ""));
  var meta = soon ? t("soon") : tf("doneOf", { d: done, n: total });
  if (nNotes) meta += " · " + notesLabel(nNotes);
  front.append(el("small", "fd-meta", meta));
  card.append(front);
  card.addEventListener("click", function () {
    openChapter(ch.id);
  });
  return card;
}

/* The back row above the list (only shown inside a subject) */
function setBackRow(host, show) {
  var row = $("sChapterTabs");
  if (!row) {
    row = el("div", "ch-tabs");
    row.id = "sChapterTabs";
    host.parentNode.insertBefore(row, host);
  }
  row.textContent = "";
  row.hidden = !show;
  if (!show) return;
  var back = el("button", "ch-back");
  back.type = "button";
  back.append(icon(ICON_BACK, "ch-back-ico"), el("span", "", t("allSubjects")));
  back.setAttribute("aria-label", t("allSubjects"));
  back.addEventListener("click", closeToHome);
  row.append(back);
  backTargets.list = { label: t("allSubjects"), fn: closeToHome };
  syncBackButton();
}

function message(host, titleKey, textKey, retry) {
  var box = el("div", "student-empty");
  box.append(el("b", "", t(titleKey)));
  if (textKey) box.append(el("span", "", t(textKey)));
  if (retry) {
    var btn = el("button", "pc-btn", t("retry"));
    btn.type = "button";
    btn.addEventListener("click", load);
    box.append(btn);
  }
  host.append(box);
}

function renderList(host, route) {
  host.textContent = "";
  host.classList.remove("is-subjects");
  var title = $("sChaptersTitle");
  if (S.loading || !ctx.ready()) {
    setBackRow(host, false);
    host.append(el("div", "student-empty", t("loading")));
    return;
  }
  if (S.failed) {
    setBackRow(host, false);
    message(host, "loadFail", "", true);
    return;
  }
  var list = subjectList();
  var single = list.length === 1;
  var sub = single ? list[0] : list.indexOf(route.s) >= 0 ? route.s : "";

  if (!sub) {
    // home: the subjects of the level
    setBackRow(host, false);
    if (title) title.textContent = t("subjects");
    host.classList.add("is-subjects");
    list.forEach(function (x) {
      host.append(subjectCard(x));
    });
    return;
  }

  // inside a subject: its chapters
  setBackRow(host, !single);
  if (title) title.textContent = t("s_" + sub);
  var shown = S.chapters.filter(function (c) {
    return c.subject === sub;
  });
  if (!shown.length) {
    message(host, "emptyTitle", "emptyText", false);
    return;
  }
  lastFolderColor = -1;
  var lastPart = null;
  shown.forEach(function (c) {
    // chapters grouped by part of the programme (when the chapter file says which part it belongs to)
    if (c.part && c.part !== lastPart) {
      var pt = ctx.getLang() === "ar" && c.part_title_ar ? c.part_title_ar : c.part_title;
      if (pt) {
        var head = el("h3", "part-title");
        head.append(el("span", "part-num", String(c.part)), el("span", "", pt));
        host.append(head);
      }
    }
    lastPart = c.part || null;
    host.append(chapterCard(c));
  });
}

/* ---------------- chapter page ---------------- */
function icon(svg, cls) {
  var span = el("span", cls || "ch-ico-sm");
  span.innerHTML = svg; // static, trusted SVG
  return span;
}

var ICON_CHECK_PIN =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
var ICON_REVIEW_PIN =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/></svg>';

// first line of the statement in plain text, for the one-line preview of a closed exercise on phones
function previewOf(text) {
  var lines = String(text || "").split("\n");
  var inFence = false;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence || !line) continue;
    line = line.replace(/\*\*/g, "").replace(/`/g, "");
    return line.length > 110 ? line.slice(0, 107).trimEnd() + "…" : line;
  }
  return "";
}

// an exercise has hints[] (1 to 3 by habit: easy 1, medium 2, bac 3); the old single `hint` still works
function hintsOf(ex) {
  var list = Array.isArray(ex.hints) ? ex.hints : ex.hint ? [ex.hint] : [];
  return list.filter(function (h) {
    return typeof h === "string" && h.trim();
  });
}

// the lesson is split on its "## " headings (outside code fences) so it can be read one section at a time
function lessonSections(text) {
  var out = [];
  var cur = null;
  var inFence = false;
  String(text || "")
    .split("\n")
    .forEach(function (line) {
      if (/^```/.test(line)) inFence = !inFence;
      if (!inFence && line.slice(0, 3) === "## ") {
        cur = { title: line.slice(3).trim(), lines: [] };
        out.push(cur);
        return;
      }
      if (!cur) {
        cur = { title: "", lines: [] };
        out.push(cur);
      }
      cur.lines.push(line);
    });
  return out
    .map(function (s) {
      return { title: s.title, body: s.lines.join("\n").trim() };
    })
    .filter(function (s) {
      return s.title || s.body;
    });
}

// closed by default: the student opens the lesson (and then each section) only if they want it
function lessonBlock(ch, always) {
  // always: the Course tab of the chapter page, where the lesson is simply open (no "open" button)
  var sections = lessonSections(ch.rappel);
  var open = always || !!lessonOpen[ch.id];
  var block = el("section", "ch-block ch-rappel" + (open ? " is-open" : ""));
  var panelR = el("div", "ch-panel");
  var head = el("div", "lesson-head");
  var titles = el("div", "lesson-title");
  titles.append(el("span", "test-chip", t("lesson")));
  var named = sections.filter(function (s) {
    return s.title;
  }).length;
  if (named > 1) titles.append(el("small", "ch-meta", tf("lessonSections", { n: named })));
  var toggle = el("button", "pc-btn lesson-toggle" + (open ? " is-ghost" : ""), open ? t("lessonClose") : t("lessonOpen"));
  toggle.type = "button";
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  toggle.addEventListener("click", function () {
    lessonOpen[ch.id] = !open;
    render();
  });
  head.append(titles);
  if (!always) head.append(toggle);
  panelR.append(head);
  if (open) {
    var body = el("div", "lesson-body");
    var firstNamed = -1;
    sections.forEach(function (s, i) {
      if (firstNamed < 0 && s.title) firstNamed = i;
    });
    sections.forEach(function (s, i) {
      if (!s.title) {
        body.append(md(s.body));
        return;
      }
      var k = ch.id + "#" + i;
      var d = el("details", "lesson-sec");
      d.setAttribute("lang", "fr");
      d.setAttribute("dir", "ltr");
      d.open = sectionOpen[k] !== undefined ? !!sectionOpen[k] : !!always && i === firstNamed;
      d.append(el("summary", "", s.title), md(s.body));
      d.addEventListener("toggle", function () {
        sectionOpen[k] = d.open;
        if (!d.open) return;
        // one section at a time: opening this one closes the others
        body.querySelectorAll("details.lesson-sec[open]").forEach(function (o) {
          if (o !== d) o.open = false;
        });
        // closing a section above can push this one off screen: bring it back to the top
        requestAnimationFrame(function () {
          if (d.getBoundingClientRect().top < 70) d.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
      body.append(d);
    });
    panelR.append(body);
  }
  block.append(el("span", "ch-tape"), panelR);
  return block;
}

// the ribbon between two cards (same thick, round-ended green line as the welcome page); it runs
// behind the cards, so each card looks like a piece laid on top of it. Paler until the card above is done
function exPath(index, prevDone) {
  var p = el("div", "ex-path " + (index % 2 ? "is-a" : "is-b") + (prevDone ? " is-done" : ""));
  p.setAttribute("aria-hidden", "true");
  p.innerHTML =
    '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 0 C0 85, 100 15, 100 100"/></svg>';
  return p;
}

/* ---------------- statement: "intro, then 1) 2) 3)" -> one answer box per question ---------------- */
function splitQuestions(text) {
  var lines = String(text || "").split("\n");
  var inFence = false;
  var intro = [];
  var qs = [];
  var cur = null;
  lines.forEach(function (line) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    var m = !inFence ? /^\s*(\d+)\)\s+(.*)$/.exec(line) : null;
    if (m && Number(m[1]) === qs.length + 1) {
      cur = { n: qs.length + 1, lines: [m[2]] };
      qs.push(cur);
      return;
    }
    (cur ? cur.lines : intro).push(line);
  });
  if (qs.length < 2) return null;
  return {
    intro: intro.join("\n").trim(),
    questions: qs.map(function (q) {
      return { n: q.n, text: q.lines.join("\n").trim() };
    }),
  };
}

/* ---------------- code-friendly textarea: Tab indents, Enter keeps the indentation ---------------- */
var INDENT = "    ";
var OPENER = /(:|\b(alors|sinon|faire|début|debut|répéter|repeter))\s*$/i; // a line ending like this opens a block
function lineStartOf(v, pos) {
  return v.lastIndexOf("\n", pos - 1) + 1;
}
function editText(ta, text) {
  // goes through the browser's editing command so Ctrl+Z still works; falls back to setRangeText
  ta.focus();
  var ok = false;
  try {
    ok = document.execCommand("insertText", false, text);
  } catch (e) {}
  if (!ok) {
    ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, "end");
    ta.dispatchEvent(new Event("input", { bubbles: true }));
  }
}
function shiftLines(ta, dir) {
  var v = ta.value;
  var s = ta.selectionStart;
  var e = ta.selectionEnd;
  var from = lineStartOf(v, s);
  var end = e > s && v.charAt(e - 1) === "\n" ? e - 1 : e;
  var to = v.indexOf("\n", end);
  if (to < 0) to = v.length;
  var lines = v.slice(from, to).split("\n");
  var out = lines.map(function (l) {
    return dir > 0 ? INDENT + l : l.replace(/^( {1,4}|\t)/, "");
  });
  var block = lines.join("\n");
  var next = out.join("\n");
  if (next === block) return;
  ta.setSelectionRange(from, to);
  editText(ta, next);
  var first = out[0].length - lines[0].length;
  ta.setSelectionRange(Math.max(from, s + first), Math.max(from, e + next.length - block.length));
}
function tabAction(ta, dir) {
  var multi = ta.value.slice(ta.selectionStart, ta.selectionEnd).indexOf("\n") >= 0;
  if (dir < 0 || multi) shiftLines(ta, dir);
  else editText(ta, INDENT);
}
function codeEditor(ta) {
  ta.addEventListener("keydown", function (e) {
    if (e.isComposing || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Escape") {
      ta.dataset.free = "1"; // the next Tab leaves the box (keyboard users are never trapped)
      return;
    }
    if (e.key === "Tab") {
      if (ta.dataset.free) {
        delete ta.dataset.free;
        return;
      }
      e.preventDefault();
      tabAction(ta, e.shiftKey ? -1 : 1);
      return;
    }
    delete ta.dataset.free;
    var v = ta.value;
    var s = ta.selectionStart;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      var before = v.slice(lineStartOf(v, s), s);
      var indent = /^[ \t]*/.exec(before)[0];
      editText(ta, "\n" + indent + (OPENER.test(before) ? INDENT : ""));
      return;
    }
    if (e.key === "Backspace" && s === ta.selectionEnd && s > 0) {
      var lead = v.slice(lineStartOf(v, s), s);
      if (lead.length > 1 && /^ +$/.test(lead)) {
        e.preventDefault(); // delete back to the previous indentation step
        ta.setSelectionRange(s - (lead.length % 4 || 4), s);
        editText(ta, "");
      }
    }
  });
  ta.addEventListener("blur", function () {
    delete ta.dataset.free;
  });
}

function autoGrow(ta) {
  // starts small and grows with what is typed (up to a limit, then it scrolls)
  if (!ta.scrollHeight) return; // not on screen (a closed exercise): try again when it opens
  ta.style.height = "auto";
  ta.style.height = Math.min(ta.scrollHeight + 2, 380) + "px";
}

function answerBox(ch, ex, boxId, placeholder, onInput, rows) {
  var dk = ch.id + "/" + ex.id + "#" + boxId;
  var ta = el("textarea", "ex-answer");
  ta.rows = rows || 2;
  ta.maxLength = ANSWER_MAX;
  ta.spellcheck = false;
  ta.setAttribute("autocapitalize", "off");
  ta.setAttribute("autocorrect", "off");
  ta.setAttribute("autocomplete", "off");
  ta.setAttribute("dir", "ltr");
  ta.setAttribute("lang", "fr");
  ta.placeholder = placeholder;
  ta.value = drafts[dk] || "";
  codeEditor(ta);
  ta.addEventListener("input", function () {
    drafts[dk] = ta.value;
    autoGrow(ta);
    queueSave(ch.id, ex.id);
    onInput();
  });
  setTimeout(function () {
    autoGrow(ta); // once it is in the page (a saved answer comes back already long)
  }, 0);
  ta.addEventListener("blur", function () {
    flushSave(ch.id, ex.id);
  });
  // phones have no Tab key: two small buttons (shown on touch screens only)
  var tools = el("div", "ex-tools");
  [
    ["indent", 1],
    ["outdent", -1],
  ].forEach(function (b) {
    var btn = el("button", "ex-tool", (b[1] > 0 ? "⇥ " : "⇤ ") + t(b[0]));
    btn.type = "button";
    btn.addEventListener("pointerdown", function (e) {
      e.preventDefault(); // keep the keyboard open and the caret where it is
    });
    btn.addEventListener("click", function () {
      ta.focus();
      tabAction(ta, b[1]);
    });
    tools.append(btn);
  });
  var wrap = el("div", "ex-box");
  wrap.append(ta, tools);
  return { wrap: wrap, ta: ta };
}

// the exercise the student has reached: the first one that is neither finished nor marked "to review"
function currentExerciseId(ch) {
  var list = S.cur && S.cur.id === ch.id && S.cur.exercises ? S.cur.exercises : [];
  var st = statusOf(ch.id);
  for (var i = 0; i < list.length; i++) {
    if (!st[list[i].id]) return list[i].id;
  }
  return null;
}

function exerciseCard(ch, ex, index) {
  var key = ch.id + "/" + ex.id;
  var st = statusOf(ch.id)[ex.id];
  var diff = ex.difficulty === "bac" || ex.difficulty === "medium" ? ex.difficulty : "easy";
  var wide = !!(window.matchMedia && window.matchMedia("(min-width: 801px)").matches);
  // only the exercise the student has reached is open; every other one is a row that opens on a click (answers included).
  // Wide screens: any number can be open. Phones: one at a time (null = the student closed them all)
  var reached = currentExerciseId(ch) === ex.id;
  var isOpenCard = wide
    ? deskOpen[key] !== undefined
      ? deskOpen[key]
      : reached
    : openEx[ch.id] !== undefined
      ? openEx[ch.id] === ex.id
      : reached;
  // exercises come one at a time: the ones after the one the student has reached stay locked until it is finished
  var reachedId = currentExerciseId(ch);
  var locked = !st && !!reachedId && !reached;
  if (locked) isOpenCard = false;
  var card = el(
    "article",
    "ex-card d-" + diff + (index % 2 ? " is-b" : " is-a") + (st ? " is-" + st : "") + (isOpenCard ? "" : " is-collapsed") + (locked ? " is-locked" : "")
  );
  card.id = "ex-" + ex.id;
  var pin = el("span", "ex-pin");
  pin.innerHTML = st === "done" ? ICON_CHECK_PIN : st === "review" ? ICON_REVIEW_PIN : ""; // static, trusted SVG
  var panel = el("div", "ex-panel");
  var work = el("div", "ex-work");
  var hints = hintsOf(ex);
  var usedN = Math.min(hintShown[key] || 0, hints.length);
  var usedTxt = usedN ? tf("hintsUsed", { n: usedN, total: hints.length }) : "";

  var head = el("div", "ex-head");
  head.append(el("span", "ex-num", (index < 9 ? "0" : "") + (index + 1)));
  head.append(el("span", "ex-diff is-" + diff, t("d_" + diff)));
  if (st) head.append(el("span", "ex-state is-" + st, t(st)));
  if (usedTxt) head.append(el("span", "ex-hints-used", usedTxt));
  // phones: a tappable row (number, level, state, one-line preview); only one exercise is open at a time
  var sum = el("button", "ex-sum");
  sum.type = "button";
  sum.setAttribute("aria-expanded", isOpenCard ? "true" : "false");
  sum.append(el("span", "ex-num", (index < 9 ? "0" : "") + (index + 1)), el("span", "ex-diff is-" + diff, t("d_" + diff)));
  if (st) sum.append(el("span", "ex-state is-" + st, t(st)));
  sum.append(el("span", "ex-chev"));
  if (locked) {
    // no statement, no answers: just the row, with a lock and the reason
    sum.disabled = true;
    sum.setAttribute("aria-expanded", "false");
    sum.title = t("exLocked");
    var lockIco = el("span", "ex-lock");
    lockIco.innerHTML = ICON_LOCK; // static, trusted SVG
    sum.append(lockIco, el("span", "ex-preview ex-locked-text", t("exLocked")));
    panel.append(sum);
    card.append(pin, panel);
    return card;
  }
  var split = splitQuestions(ex.statement);
  var prev = previewOf(ex.statement);
  if (prev) sum.append(el("span", "ex-preview", prev));
  sum.addEventListener("click", function () {
    if (wide) deskOpen[key] = !isOpenCard;
    else openEx[ch.id] = isOpenCard ? null : ex.id;
    render();
    if (!isOpenCard) {
      setTimeout(function () {
        var c = document.getElementById("ex-" + ex.id);
        if (c) c.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  });
  panel.append(sum, head, md(split ? split.intro : ex.statement));
  // an exercise can point to an animation ("viz": "tri-bulles"): a round button opens the same split-screen box as in the course
  if (ex.viz && hasAlgoViz(ex.viz)) {
    var vz = el("button", "ex-viz");
    vz.type = "button";
    vz.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
    vz.append(el("span", "", (ctx.getLang() === "ar" ? "رسم متحرك · " : "Animation · ") + algoTitle(ex.viz, ctx.getLang())));
    vz.addEventListener("click", function () {
      openAlgoViz(ex.viz, vizOpts());
    });
    panel.append(vz);
  }
  card.append(pin, panel, work);

  // hints come one at a time: each click puts the next hint on screen in place of the previous one
  if (hints.length) {
    var shown = Math.min(hintShown[key] || 0, hints.length);
    if (shown > 0) {
      var hint = el("div", "ex-hint");
      hint.append(
        el("span", "ex-hint-tag", hints.length > 1 ? tf("hintLabel", { n: shown, total: hints.length }) : t("hintLabelOne")),
        md(hints[shown - 1])
      );
      panel.append(hint);
    }
    if (shown < hints.length) {
      var hintBtn = el(
        "button",
        "ex-link",
        shown === 0 ? t("hint") : tf("hintNext", { n: shown + 1, total: hints.length })
      );
      hintBtn.type = "button";
      hintBtn.addEventListener("click", function () {
        hintShown[key] = shown + 1;
        queueSave(ch.id, ex.id);
        flushSave(ch.id, ex.id);
        card.replaceWith(exerciseCard(ch, ex, index));
      });
      panel.append(hintBtn);
    }
  }

  var isOpen = !!revealed[key];
  var boxes = [];
  var refresh = function () {};
  var onType = function () {
    refresh();
  };
  if (split) {
    split.questions.forEach(function (q) {
      var item = el("div", "ex-q");
      var qh = el("div", "ex-q-head");
      qh.append(el("span", "ex-q-n", String(q.n)), md(q.text));
      var bx = answerBox(ch, ex, String(q.n), tf("qPlaceholder", { n: q.n }), onType);
      item.append(qh, bx.wrap);
      work.append(item);
      boxes.push(bx.ta);
    });
  } else {
    var label = el(
      "label",
      "ex-label",
      t("answerLabel") + (CODE_LABEL[ex.lang] ? " · " + CODE_LABEL[ex.lang] : "")
    );
    var bx1 = answerBox(ch, ex, "0", t("answerPlaceholder"), onType, 4);
    label.append(bx1.wrap);
    work.append(label);
    boxes.push(bx1.ta);
  }
  var savedLine = el("small", "ex-saved");
  work.append(savedLine);
  if (saveState[key]) {
    var sv = saveState[key];
    savedLine.textContent = sv === "saving" ? t("saving") : sv === "saved" ? "✓ " + t("savedAns") : t("saveAnsFail");
    savedLine.classList.toggle("is-error", sv === "error");
  }

  if (!isOpen) {
    var actions = el("div", "ex-actions");
    var show = el("button", "pc-btn", t("showSolution"));
    show.type = "button";
    var needT = st ? 0 : thinkNeed(ex, diff);
    var started = function () {
      return thinkSpent[key] !== undefined;
    };
    var timeLeft = function () {
      return Math.max(0, needT - (thinkSpent[key] || 0));
    };
    var unlocked = function () {
      if (st || needT <= 0) return true;
      return started() && timeLeft() <= 0;
    };
    // icon-only button while the countdown runs: stops it and goes back to "Commencer"
    var stopBtn = el("button", "pc-stop");
    stopBtn.type = "button";
    stopBtn.hidden = true;
    stopBtn.title = t("thinkStop");
    stopBtn.setAttribute("aria-label", t("thinkStop"));
    stopBtn.innerHTML = ICON_RESET; // static, trusted SVG
    stopBtn.addEventListener("click", function () {
      delete thinkSpent[key];
      saveThink();
      paintShow();
    });
    var paintShow = function () {
      var l = timeLeft();
      var waiting = !st && needT > 0 && started() && l > 0;
      stopBtn.hidden = !waiting;
      var notYet = !st && needT > 0 && !started();
      show.disabled = !unlocked() && !notYet;
      show.textContent = notYet ? tf("thinkStart", { t: mmss(needT) }) : waiting ? tf("thinkWait", { t: mmss(l) }) : t("showSolution");
      show.classList.toggle("is-timing", waiting);
      show.classList.toggle("is-start", notYet);
      show.style.setProperty("--tp", Math.min(100, ((needT - l) / needT) * 100) + "%");
    };
    paintShow();
    refresh = paintShow;
    if (needT > 0) thinkTimers[key] = { card: card, update: paintShow };
    show.addEventListener("click", async function () {
      if (!st && needT > 0 && !started()) {
        thinkSpent[key] = 0; // "start": the countdown begins now
        saveThink();
        paintShow();
        return;
      }
      show.disabled = true;
      try {
        if (solutions[key] === undefined) await loadSolution(ch.id, ex.id);
        revealed[key] = true;
        rowError[key] = "";
      } catch (e) {
        console.warn("Couldn’t load the solution:", e);
        rowError[key] = t("solFail");
      }
      card.replaceWith(exerciseCard(ch, ex, index));
    });
    actions.append(show, stopBtn);
    work.append(actions);
  } else {
    var sol = el("div", "ex-solution");
    sol.append(el("div", "ex-sol-title", t("solution")), md(solutions[key]));
    var mark = el("div", "ex-actions");
    function choose(value) {
      return async function () {
        await setStatus(ch.id, ex.id, value);
        delete deskOpen[key]; // back to the default: the exercise the student has reached is the open one
        openEx[ch.id] = undefined;
        render();
        var nextId = currentExerciseId(ch);
        if (nextId) {
          setTimeout(function () {
            var nx = document.getElementById("ex-" + nextId);
            if (nx) nx.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 0);
        }
      };
    }
    var ok = el("button", "pc-btn", t("gotIt"));
    ok.type = "button";
    ok.addEventListener("click", choose("done"));
    var later = el("button", "pc-btn is-ghost", t("reviewLater"));
    later.type = "button";
    later.addEventListener("click", choose("review"));
    mark.append(ok, later);
    sol.append(mark);
    work.append(sol);
  }
  if ((isOpen || st) && ctx.sendRating) work.append(feedbackRow(ch, ex, key, index));
  if (rowError[key]) work.append(el("p", "set-msg", rowError[key]));
  return card;
}

/* "Ton avis ?": one tap to say the exercise was easy / fine / hard (read in the admin page), plus a link to write more */
var FB_CHOICES = [
  ["easy", "😀", "fbEasy"],
  ["ok", "🙂", "fbOk"],
  ["hard", "😣", "fbHard"],
];
function feedbackRow(ch, ex, key, index) {
  var row = el("div", "ex-fb");
  row.append(el("span", "ex-fb-ask", t("fbAsk")));
  var chips = el("div", "ex-fb-chips");
  var msg = el("small", "ex-fb-msg");
  FB_CHOICES.forEach(function (c) {
    var b = el("button", "fb-chip" + (ratings[key] === c[0] ? " is-on" : ""));
    b.type = "button";
    b.setAttribute("aria-pressed", ratings[key] === c[0] ? "true" : "false");
    b.append(el("span", "fb-emo", c[1]), document.createTextNode(t(c[2])));
    b.addEventListener("click", async function () {
      var prev = ratings[key];
      ratings[key] = c[0];
      chips.querySelectorAll(".fb-chip").forEach(function (x, i) {
        var on = FB_CHOICES[i][0] === c[0];
        x.classList.toggle("is-on", on);
        x.setAttribute("aria-pressed", on ? "true" : "false");
      });
      msg.textContent = "";
      try {
        await ctx.sendRating(ch.id, ex.id, c[0]);
        msg.textContent = "✓ " + t("fbThanks");
      } catch (e) {
        console.warn("Couldn’t send the rating:", e);
        if (prev === undefined) delete ratings[key];
        else ratings[key] = prev;
        chips.querySelectorAll(".fb-chip").forEach(function (x, i) {
          var on = FB_CHOICES[i][0] === ratings[key];
          x.classList.toggle("is-on", on);
          x.setAttribute("aria-pressed", on ? "true" : "false");
        });
        msg.textContent = t("fbFail");
      }
    });
    chips.append(b);
  });
  row.append(chips);
  var more = el("button", "ex-link", t("fbComment"));
  more.type = "button";
  more.addEventListener("click", function () {
    ctx.openFeedback({ chapterId: ch.id, exerciseId: ex.id, label: chapterTitle(ch) + " · #" + (index + 1) });
  });
  row.append(more, msg);
  return row;
}

var ICON_X =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';

function openNoteEditor(id, n) {
  editing = id;
  noteDraft = n
    ? { title: n.title || "", body: n.body || "", color: noteColorOf(n, 0) }
    : { title: "", body: "", color: NOTE_ORDER[S.notes.length % NOTE_ORDER.length] }; // a new note starts with the next colour in the cycle
  noteError = "";
  render();
}

function noteCard(ch, n, i) {
  var card = el("button", "note-card");
  card.type = "button";
  var color = noteColorOf(n, i);
  card.style.setProperty("--nc", NOTE_COLORS[color]);
  card.style.setProperty("--tape", NOTE_COLORS[color]);
  var title = el("b", "note-title", n.title || t("untitled"));
  title.setAttribute("dir", "auto");
  var body = el("span", "note-body", n.body || "");
  body.setAttribute("dir", "auto");
  var foot = el("span", "note-foot");
  foot.append(el("small", "note-date", dateLabel(n.updatedAt)), el("i", "note-dots"));
  card.append(title, body, foot);
  card.addEventListener("click", function () {
    openNoteEditor(n.id, n);
  });
  return card;
}

/* The note editor is a box in the middle of the screen (like the profile card), not a form inside the page */
var noteOverlay = null;
var noteKey = "";
var noteDownOnBackdrop = false;
function closeNote() {
  editing = null;
  noteError = "";
  render();
}
function noteModalBox(ch) {
  var isNew = editing === "new";
  var box = el("div", "modal modal-fixed note-modal");
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", isNew ? t("newNote") : t("noteEdit"));
  function paint() {
    box.style.setProperty("--nc", NOTE_COLORS[noteDraft.color]);
    box.style.setProperty("--nc-ink", NOTE_INK[noteDraft.color]);
  }
  paint();

  var x = el("button", "modal-x");
  x.type = "button";
  x.setAttribute("aria-label", t("cancel"));
  x.innerHTML = ICON_X; // static, trusted SVG
  x.addEventListener("click", closeNote);
  var band = el("div", "note-band");
  band.append(el("span", "note-band-title", isNew ? t("newNote") : t("noteEdit")));

  var form = el("div", "modal-scroll note-form");
  var title = el("input", "note-input");
  title.type = "text";
  title.maxLength = NOTE_TITLE_MAX;
  title.placeholder = t("noteTitle");
  title.value = noteDraft.title;
  title.setAttribute("dir", "auto");
  title.addEventListener("input", function () {
    noteDraft.title = title.value;
  });
  var body = el("textarea", "note-input note-textarea");
  body.maxLength = NOTE_BODY_MAX;
  body.rows = 8;
  body.placeholder = t("noteBody");
  body.value = noteDraft.body;
  body.setAttribute("dir", "auto");
  body.addEventListener("input", function () {
    noteDraft.body = body.value;
  });

  var colors = el("div", "note-colors");
  colors.setAttribute("role", "radiogroup");
  colors.setAttribute("aria-label", t("noteColor"));
  colors.append(el("span", "note-colors-label", t("noteColor")));
  var swatches = [];
  NOTE_ORDER.forEach(function (key) {
    var sw = el("button", "note-swatch");
    sw.type = "button";
    sw.setAttribute("role", "radio");
    sw.setAttribute("aria-label", t("nc_" + key));
    sw.title = t("nc_" + key);
    sw.style.setProperty("--sw", NOTE_COLORS[key]);
    sw.style.setProperty("--sw-ink", NOTE_INK[key]);
    sw.dataset.color = key;
    sw.addEventListener("click", function () {
      noteDraft.color = key;
      paint();
      swatches.forEach(function (o) {
        o.setAttribute("aria-checked", o.dataset.color === key ? "true" : "false");
      });
    });
    swatches.push(sw);
    colors.append(sw);
  });
  swatches.forEach(function (o) {
    o.setAttribute("aria-checked", o.dataset.color === noteDraft.color ? "true" : "false");
  });

  var actions = el("div", "ex-actions note-actions");
  var save = el("button", "pc-btn", t("save"));
  save.type = "button";
  save.addEventListener("click", async function () {
    if (!noteDraft.title.trim() && !noteDraft.body.trim()) {
      closeNote();
      return;
    }
    save.disabled = true;
    await saveNote(ch.id, isNew ? null : editing);
    render();
  });
  var cancel = el("button", "pc-btn is-ghost", t("cancel"));
  cancel.type = "button";
  cancel.addEventListener("click", closeNote);
  actions.append(save, cancel);
  if (!isNew) {
    var del = el("button", "ex-link is-danger", t("del"));
    del.type = "button";
    del.addEventListener("click", async function () {
      if (!window.confirm(t("confirmDelete"))) return;
      await removeNote(editing);
      render();
    });
    actions.append(del);
  }
  form.append(title, body, colors, actions);
  if (noteError) form.append(el("p", "set-msg", noteError));
  box.append(x, band, form);
  return box;
}
function syncNoteModal(ch) {
  if (!noteOverlay) {
    noteOverlay = el("div", "modal-overlay note-overlay");
    noteOverlay.addEventListener("mousedown", function (e) {
      noteDownOnBackdrop = e.target === noteOverlay;
    });
    noteOverlay.addEventListener("click", function (e) {
      if (e.target === noteOverlay && noteDownOnBackdrop) closeNote(); // a drag that started inside the box must not close it
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && editing) closeNote();
    });
    document.body.append(noteOverlay);
  }
  if (!ch || !editing) {
    noteOverlay.classList.remove("open");
    noteOverlay.textContent = "";
    noteKey = "";
    return;
  }
  var key = [editing, ctx.getLang(), noteError, ch.id].join("|");
  if (key === noteKey && noteOverlay.classList.contains("open")) return; // already showing: keep what is being typed
  noteKey = key;
  noteOverlay.textContent = "";
  noteOverlay.append(noteModalBox(ch));
  noteOverlay.classList.add("open");
  var first = noteOverlay.querySelector(".note-input");
  if (first && !noteDraft.title && !noteDraft.body) setTimeout(function () { first.focus(); }, 0);
}

function notesSection(ch, col) {
  var sec = el("section", "notes-section" + (col ? " is-col" : ""));
  var head = el("div", "notes-head");
  var list = notesOf(ch.id);
  var h = el("h2", "ch-section-title", t("tabNotes"));
  if (list.length) h.append(el("span", "notes-count", String(list.length)));
  var add = el("button", "note-add", "+");
  add.type = "button";
  add.setAttribute("aria-label", t("newNote"));
  add.title = t("newNote");
  add.disabled = !S.notesOk;
  add.addEventListener("click", function () {
    openNoteEditor("new", null);
  });
  head.append(h, add);
  sec.append(head);
  if (!S.notesOk) {
    sec.append(el("p", "set-msg", t("notesFail")));
    return sec;
  }
  var grid = el("div", "note-grid" + (col ? " is-col" : ""));
  list.forEach(function (n, i) {
    grid.append(noteCard(ch, n, i));
  });
  if (!list.length) grid.append(el("p", "note-empty", t("notesHint")));
  sec.append(grid);
  return sec;
}

// the back button stays on screen while the page scrolls; once the page has moved it shrinks to a round arrow
/* The round "back" arrow that follows the scroll. It lives directly under <body> (not inside the page), so no
   parent with a transform / overflow / stacking rule can carry it off screen. It shows once the real back
   button of the current page has scrolled out of view. */
var backTargets = { view: null, list: null }; // { label, fn } for the chapter page / the chapters list
var floatBack = null;
function getFloatBack() {
  if (floatBack) return floatBack;
  floatBack = el("button", "ch-back ch-back-float");
  floatBack.type = "button";
  floatBack.append(icon(ICON_BACK, "ch-back-ico"));
  floatBack.addEventListener("click", function () {
    var tg = floatBack.__target;
    if (tg) tg.fn();
  });
  document.body.append(floatBack);
  return floatBack;
}
function syncBackButton() {
  var fb = getFloatBack();
  var view = $("sChapterView");
  var tabs = $("sChapterTabs");
  var slot = null;
  var target = null;
  if (view && !view.hidden && view.offsetParent) {
    slot = view.querySelector(".ch-back-slot");
    target = backTargets.view;
  } else if (tabs && !tabs.hidden && tabs.offsetParent) {
    slot = tabs;
    target = backTargets.list;
  }
  var on = !!(slot && target && slot.getBoundingClientRect().bottom <= 8);
  if (on) {
    fb.__target = target;
    fb.setAttribute("aria-label", target.label);
    fb.title = target.label;
  }
  fb.classList.toggle("is-on", on);
  fb.tabIndex = on ? 0 : -1;
  // wide screens: the back button stays at the top while scrolling and shrinks to its arrow
  var compact = window.scrollY > 24;
  document.querySelectorAll(".ch-back:not(.ch-back-float)").forEach(function (b) {
    b.classList.toggle("is-compact", compact);
  });
}

/* What the middle of the chapter page shows. Exercises first: that is why a student comes. */
function curTab(ch) {
  var tab = tabs[ch.id] || "ex";
  if (tab === "course" && !ch.rappel) tab = "ex";
  if (tab === "notes" && notesWide.matches) tab = "ex"; // wide screens already show the notes in their own column
  return tab;
}

/* The side rail (or the bottom bar on phones): Course / Exercises / Notes buttons exist only inside a chapter */
var RAIL_BTNS = [
  ["rCourse", "course", "tabCourse"],
  ["rEx", "ex", "exercises"],
  ["rNotes", "notes", "tabNotes"],
];
var HOME_BTNS = [
  ["rHome", "home", "navHome"],
  ["rSubjects", "subjects", "subjects"],
];
/* where: "home" | "subject" | "chapter". Home / Subjects buttons outside a chapter, Course / Exercises / Notes inside one. */
function syncRail(ch, where) {
  var nav = $("rNav");
  if (!nav) return;
  var inCh = !!ch;
  nav.hidden = false;
  var tab = ch ? curTab(ch) : "";
  HOME_BTNS.forEach(function (b) {
    var btn = $(b[0]);
    if (!btn) return;
    var label = t(b[2]);
    btn.querySelector(".s-rail-label").textContent = label;
    btn.setAttribute("aria-label", label);
    btn.title = label;
    btn.hidden = inCh;
    var on = !inCh && (b[1] === "home" ? where !== "subject" : where === "subject");
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });
  RAIL_BTNS.forEach(function (b) {
    var btn = $(b[0]);
    if (!btn) return;
    var label = t(b[2]);
    btn.querySelector(".s-rail-label").textContent = label;
    btn.setAttribute("aria-label", label);
    btn.title = label;
    btn.hidden = !inCh;
    var on = inCh && tab === b[1];
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.disabled = inCh && b[1] === "course" && !ch.rappel;
  });
}
function currentChapter() {
  var id = readRoute().c;
  if (!id) return null;
  return (
    S.chapters.filter(function (c) {
      return c.id === id;
    })[0] || null
  );
}
function pickTab(tab) {
  var ch = currentChapter();
  if (!ch) return;
  if (tab === "notes" && notesWide.matches) return;
  tabs[ch.id] = tab;
  render();
  window.scrollTo(0, 0);
}

function exercisesPart(ch) {
  var box = el("div", "ch-ex");
  box.append(el("h2", "ch-section-title", t("exercises")));
  var cur = S.cur;
  if (!cur || cur.loading) {
    box.append(el("div", "student-empty", t("loading")));
  } else if (cur.failed) {
    var fail = el("div", "student-empty");
    fail.append(el("b", "", t("loadFail")));
    var retry = el("button", "pc-btn", t("retry"));
    retry.type = "button";
    retry.addEventListener("click", function () {
      loadExercises(ch.id).then(null, function () {});
      render();
    });
    fail.append(retry);
    box.append(fail);
  } else {
    var list = el("div", "ex-list");
    cur.exercises.forEach(function (ex, i) {
      if (i) list.append(exPath(i, statusOf(ch.id)[cur.exercises[i - 1].id] === "done"));
      list.append(exerciseCard(ch, ex, i));
    });
    box.append(list);
  }
  return box;
}

function renderView(view, ch) {
  view.textContent = "";
  var side = notesWide.matches;
  view.className = "ch-grid" + (side ? " has-side" : "");
  var tab = curTab(ch);
  syncRail(ch, "chapter");

  var main = el("div", "ch-main");
  var back = el("button", "ch-back");
  back.type = "button";
  back.append(icon(ICON_BACK, "ch-back-ico"));
  back.append(el("span", "", tf("back", { name: t("s_" + ch.subject) })));
  back.setAttribute("aria-label", tf("back", { name: t("s_" + ch.subject) }));
  back.addEventListener("click", function () {
    openSubject(ch.subject);
  });

  var hero = el("section", "student-hero");
  var mark = el("img", "hero-watermark");
  mark.src = "Images/logo-icon.svg";
  mark.alt = "";
  mark.setAttribute("aria-hidden", "true");
  var title = ctx.getLang() === "ar" && ch.title_ar ? ch.title_ar : ch.title;
  var total = Number(ch.exerciseCount) || 0;
  hero.append(mark, el("h1", "", title || ""));
  hero.append(el("p", "", total ? tf("progress", { done: doneCount(ch), total: total }) : ""));

  backTargets.view = {
    label: tf("back", { name: t("s_" + ch.subject) }),
    fn: function () {
      openSubject(ch.subject);
    },
  };
  var slot = el("div", "ch-back-slot");
  slot.append(back);
  main.append(slot, hero);

  if (tab === "course") {
    var vb = vizBar(ch);
    if (vb) main.append(vb);
    main.append(lessonBlock(ch, true));
  }
  else if (tab === "notes") main.append(notesSection(ch, false));
  else main.append(exercisesPart(ch));
  view.append(main);

  if (side) {
    var aside = el("aside", "ch-side");
    aside.append(notesSection(ch, true));
    view.append(aside);
  }
  syncBackButton();
}

/* ---------------- entry points ---------------- */
/* ---------------- home boxes: progress (left) and "pick up where you stopped" (blue) ---------------- */
function summary() {
  var total = 0;
  var done = 0;
  var review = 0;
  var resume = null;
  var started = null;
  var firstOpen = null;
  S.chapters.forEach(function (c) {
    var n = Number(c.exerciseCount) || 0;
    if (!n) return;
    var st = statusOf(c.id);
    var keys = Object.keys(st);
    var d = keys.filter(function (k) {
      return st[k] === "done";
    }).length;
    var r = keys.filter(function (k) {
      return st[k] === "review";
    }).length;
    total += n;
    done += d;
    review += r;
    if (d + r < n) {
      if (!firstOpen) firstOpen = c;
      if (!started && d + r > 0) started = c;
    }
  });
  resume = started || firstOpen;
  return {
    total: total,
    done: done,
    review: review,
    left: Math.max(0, total - done - review),
    chapter: resume,
    started: !!started,
  };
}

function chapterTitle(ch) {
  return ctx.getLang() === "ar" && ch.title_ar ? ch.title_ar : ch.title;
}

function paintMe() {
  var box = $("sMe");
  if (!box || !ctx || !ctx.me) return;
  var m = ctx.me();
  var sum = summary();
  var pct = sum.total ? Math.round((sum.done / sum.total) * 100) : 0;
  box.textContent = "";

  var ring = el("div", "me-ring");
  var R = 60;
  var C = 2 * Math.PI * R;
  var svgNS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 132 132");
  svg.setAttribute("aria-hidden", "true");
  function circle(cls) {
    var c = document.createElementNS(svgNS, "circle");
    c.setAttribute("cx", "66");
    c.setAttribute("cy", "66");
    c.setAttribute("r", String(R));
    c.setAttribute("class", cls);
    return c;
  }
  if (pct <= 0) {
    svg.append(circle("me-ring-bg")); // nothing done yet: the whole track
  } else if (pct >= 100) {
    svg.append(circle("me-ring-fg"));
  } else {
    // two arcs with round ends that meet with a small gap (not a fill sliding under the track)
    var GAP = 13;
    var L1 = (C * pct) / 100;
    var rest = C - L1 - 2 * GAP;
    var arc = circle("me-ring-fg");
    arc.setAttribute("stroke-linecap", "round");
    arc.setAttribute("stroke-dasharray", Math.max(0.1, L1 - 0) + " " + C);
    svg.append(arc);
    if (rest > 1) {
      var tr = circle("me-ring-bg is-cap");
      tr.setAttribute("stroke-linecap", "round");
      tr.setAttribute("stroke-dasharray", rest + " " + C);
      tr.setAttribute("stroke-dashoffset", String(-(L1 + GAP)));
      svg.append(tr);
    }
  }
  var face = el("div", "me-avatar");
  face.append(m.avatar);
  ring.append(svg, face);
  if (m.level) ring.append(el("span", "me-lvl", m.level));

  var hello = t("hello") + (m.first ? (ctx.getLang() === "ar" ? " " : ", ") + m.first : "");
  var pctRow = el("div", "me-pct");
  pctRow.append(el("b", "", pct + "%"), el("span", "", t("mePct")));
  var bar = el("span", "me-bar");
  segBar(bar, pct);
  var stats = el("div", "me-stats");
  [
    [sum.done, "stDone"],
    [sum.review, "stReview"],
    [sum.left, "stLeft"],
  ].forEach(function (x) {
    var cell = el("div", "me-st");
    cell.append(el("b", "", String(x[0])), el("span", "", t(x[1])));
    stats.append(cell);
  });
  box.append(ring, el("h2", "me-hello", hello), el("p", "me-sub", t("meSub")), pctRow, bar, stats, el("p", "me-note", t("meNote")));
}

function paintResume() {
  var box = $("sResume");
  if (!box) return;
  box.textContent = "";
  box.className = "s-resume";
  var mark = el("img", "rs-mark");
  mark.src = "Images/logo-icon.svg";
  mark.alt = "";
  box.append(mark);
  if (S.loading || !ctx || !ctx.ready()) {
    box.append(el("span", "rs-cap", t("loading")));
    return;
  }
  var sum = summary();
  var ch = sum.chapter;
  if (!ch) {
    box.classList.add("is-quiet");
    box.append(
      el("span", "rs-cap", t(sum.total ? "resumeAllDone" : "resumeNone")),
      el("p", "rs-sub", sum.total ? t("resumeAllDoneSub") : ""),
    );
    return;
  }
  var n = Number(ch.exerciseCount) || 0;
  var d = doneCount(ch);
  box.append(el("span", "rs-cap", t(sum.started ? "resumeCap" : "resumeStartCap")));
  var h = el("h2", "rs-title", chapterTitle(ch) || "");
  h.setAttribute("dir", "auto");
  box.append(h);
  var chips = el("div", "rs-chips");
  chips.append(el("span", "rs-chip", t("s_" + ch.subject)));
  if (ch.part) chips.append(el("span", "rs-chip is-lime", tf("partN", { n: ch.part })));
  box.append(chips);
  var bottom = el("div", "rs-bottom");
  var meter = el("div", "rs-meter");
  meter.append(el("span", "rs-meta", tf("progress", { done: d, total: n })));
  var bar = el("span", "rs-bar");
  segBar(bar, (d / n) * 100);
  meter.append(bar);
  var btn = el("button", "rs-btn", t(sum.started ? "resumeBtn" : "resumeStartBtn") + " →");
  btn.type = "button";
  btn.addEventListener("click", function () {
    openChapter(ch.id);
  });
  bottom.append(meter, btn);
  box.append(bottom);
}

function goSubjects() {
  var r = readRoute();
  if (r.c || r.s) closeToHome();
  var sec = $("sChaptersSection");
  if (sec && sec.scrollIntoView) sec.scrollIntoView({ behavior: "smooth", block: "start" });
}

var FAB_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="8" height="11" rx="2"/><rect x="13" y="9" width="8" height="11" rx="2"/><path d="M7 19h3"/></svg>';
// round button, always on screen inside Programmation: opens the algorithm library
function syncFab(show) {
  var f = document.getElementById("avFab");
  if (!show) {
    if (f) f.remove();
    return;
  }
  var label = libraryLabel(ctx.getLang());
  if (!f) {
    f = el("div", "av-fab");
    f.id = "avFab";
    var b = el("button", "av-fab-b");
    b.type = "button";
    b.innerHTML = FAB_ICON; // static, trusted SVG
    b.addEventListener("click", function () {
      openAlgoLibrary(vizOpts());
    });
    f.append(b, el("span", "av-fab-l"));
    document.body.append(f);
    var seen = false;
    try {
      seen = window.localStorage.getItem("cl.fabSeen") === "1";
    } catch (e) {}
    if (seen) f.classList.add("is-quiet");
    else
      setTimeout(function () {
        f.classList.add("is-quiet");
        try {
          window.localStorage.setItem("cl.fabSeen", "1");
        } catch (e) {}
      }, 7000);
  }
  f.querySelector(".av-fab-b").setAttribute("aria-label", label);
  f.querySelector(".av-fab-l").textContent = label;
}

function render() {
  if (!ctx) return;
  if (ctx.ready() && S.loadedKey !== ctx.getLevel() && !S.loading) {
    load();
    return;
  }
  var homeGrid = $("sHomeGrid");
  var meBox = $("sMe");
  var resumeBox = $("sResume");
  var placement = $("sPlacement");
  var section = $("sChaptersSection");
  var view = $("sChapterView");
  var list = $("sChapters");
  if (!list || !view) return;

  var route = readRoute();
  var id = route.c;
  var ch = id
    ? S.chapters.filter(function (c) {
        return c.id === id;
      })[0]
    : null;
  var opening = !!id && (ch || S.loading || !ctx.ready());

  // greeting, calendar and level card belong to the home page only (not inside a subject, not inside a chapter)
  var subs = subjectList();
  var inSubject = !opening && subs.length > 1 && subs.indexOf(route.s) >= 0;
  var onHome = !opening && !inSubject;
  var week = $("sWeek");
  if (homeGrid) {
    homeGrid.hidden = !!opening;
    homeGrid.classList.toggle("is-solo", !onHome);
  }
  var sideBox = $("sHomeSide");
  if (sideBox) sideBox.hidden = !onHome;
  if (meBox) meBox.hidden = !onHome;
  if (resumeBox) resumeBox.hidden = !onHome;
  if (onHome) {
    paintMe();
    paintResume();
  }
  if (placement) placement.hidden = !onHome;
  if (week) week.hidden = !onHome;
  if (section) section.hidden = !!opening;
  view.hidden = !opening;
  syncRail(opening && ch ? ch : null, inSubject ? "subject" : "home");
  syncNoteModal(opening && ch ? ch : null);
  syncFab((inSubject && route.s === "prog") || (opening && !!ch && ch.subject === "prog"));

  if (!opening) {
    if (id) {
      closeToHome(); // unknown chapter id in the address
      return;
    }
    S.cur = null;
    renderList(list, route);
    return;
  }
  if (!ch) {
    view.textContent = "";
    view.append(el("div", "student-empty", t("loading")));
    return;
  }
  if (!S.cur || S.cur.id !== id) {
    loadExercises(id);
    window.scrollTo(0, 0);
  }
  renderView(view, ch);
}

export var Chapters = {
  /* c: { sdk, db, uid, getLang(), getLevel(), ready(), topicOf(key), subjectIcon(subject) } */
  init: function (c) {
    ctx = c;
    loadThink();
    startThinkTicker();
    /* a reload always starts on the subjects page */
    if (window.location.hash && window.history && window.history.replaceState) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.addEventListener("hashchange", render);
    window.addEventListener("scroll", syncBackButton, { passive: true });
    RAIL_BTNS.forEach(function (b) {
      var btn = $(b[0]);
      if (btn) {
        btn.addEventListener("click", function () {
          pickTab(b[1]);
        });
      }
    });
    var rh = $("rHome");
    if (rh) rh.addEventListener("click", closeToHome);
    var rs = $("rSubjects");
    if (rs) rs.addEventListener("click", goSubjects);
    var onResize = function () {
      if (readRoute().c) render(); // the notes move between their column and the tab bar when the width crosses the breakpoint
    };
    if (notesWide.addEventListener) notesWide.addEventListener("change", onResize);
    else if (notesWide.addListener) notesWide.addListener(onResize);
  },
  home: closeToHome,
  render: render,
};
