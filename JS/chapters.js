/* ClassLedger student chapters: chapter list, chapter page, exercises, solutions, progress.

   Firestore layout (content is written by the admin only, see firestore.rules):
     chapters/{chapterId}                                   level, subject, topic, title, title_ar, order, published, rappel, exerciseCount
     chapters/{chapterId}/exercises/{exId}                  order, difficulty, statement, hint
     chapters/{chapterId}/exercises/{exId}/private/solution { text }   (fetched only when the student asks for it)
   Student progress:
     users/{uid}/progress/{chapterId}                       { status: { exId: "done" | "review" } }

   The page chrome is in the student's language (EN / AR); the course content is French. */

var STR = {
  en: {
    loading: "Loading…",
    loadFail: "Couldn’t load the chapters. Check your connection.",
    retry: "Try again",
    emptyTitle: "Your first chapters are on their way",
    emptyText: "Come back soon: new exercises are being added.",
    back: "Back to {name}",
    allSubjects: "All subjects",
    subjects: "Subjects",
    exercises: "Exercises",
    exercisesCount: "{n} exercises",
    progress: "{done} / {total} done",
    rappel: "Reminder",
    hint: "Show a hint",
    hideHint: "Hide the hint",
    answerLabel: "Your answer",
    answerPlaceholder: "Try it first: write your answer here to unlock the solution.",
    showSolution: "Show the solution",
    solution: "Solution",
    gotIt: "I got it",
    reviewLater: "Review later",
    done: "Done",
    review: "To review",
    d_easy: "Easy",
    d_medium: "Medium",
    d_bac: "Bac level",
    s_prog: "Programming",
    s_sti: "STI (Web)",
    s_info: "Computer science",
    chaptersCount: "{n} chapters",
    chaptersOne: "1 chapter",
    soon: "Coming soon",
    desc_prog: "Algorithms, Python and Bac-style exercises",
    desc_sti: "Web, HTML, CSS and more",
    desc_info: "Lessons and exercises, step by step",
    saveFail: "Couldn’t save your progress. Try again.",
    solFail: "Couldn’t load the solution. Try again.",
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
    progress: "{done} / {total} مكتملة",
    rappel: "تذكير",
    hint: "شوف تلميح",
    hideHint: "خبّي التلميح",
    answerLabel: "جوابك",
    answerPlaceholder: "جرّب الأول: اكتب جوابك هنا باش يتفتح الحل.",
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

var ICON_BACK =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m11 6-6 6 6 6"/></svg>';

var ctx = null;
var S = {
  loadedKey: null, // level code the list was loaded for
  loading: false,
  failed: false,
  chapters: [],
  status: {}, // chapterId -> { exId: "done" | "review" }
  subject: null,
  cur: null, // { id, exercises, loading, failed } for the open chapter
};
var drafts = {}; // "chapterId/exId" -> typed answer (survives re-renders)
var hintOpen = {};
var revealed = {};
var solutions = {}; // "chapterId/exId" -> text
var rowError = {};

function t(key) {
  return STR[ctx && ctx.getLang() === "ar" ? "ar" : "en"][key];
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
function md(text) {
  var box = el("div", "ch-content");
  box.setAttribute("lang", "fr");
  box.setAttribute("dir", "ltr");
  String(text || "")
    .split(/```[a-zA-Z]*\n?/)
    .forEach(function (part, i) {
      if (i % 2 === 1) {
        box.append(el("pre", "test-code", part.replace(/\n+$/, "")));
        return;
      }
      part
        .split(/\n{2,}/)
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
    });
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
  S.loading = false;
  render();
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
  if (S.cur && S.cur.id === chId) S.cur.loading = false;
  render();
}

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
    var fill = el("i");
    fill.style.width = Math.min(100, Math.round((done / total) * 100)) + "%";
    bar.append(fill);
    card.append(bar, el("small", "sc-meta", tf("progress", { done: done, total: total })));
  }
  card.addEventListener("click", function () {
    openSubject(sub);
  });
  return card;
}

function chapterCard(ch) {
  var topic = ctx.topicOf(ch.topic);
  var card = el("button", "ch-card");
  card.type = "button";
  var ic = el("span", "ch-ico");
  ic.style.background = topic.color;
  ic.innerHTML = topic.icon; // static, trusted SVG from student.js
  var text = el("span", "ch-text");
  var total = Number(ch.exerciseCount) || 0;
  var done = doneCount(ch);
  var title = ctx.getLang() === "ar" && ch.title_ar ? ch.title_ar : ch.title;
  text.append(el("b", "ch-title", title || ""));
  text.append(el("small", "ch-meta", tf("exercisesCount", { n: total })));
  if (total) {
    var bar = el("span", "domain-bar ch-bar");
    var fill = el("i");
    fill.style.width = Math.min(100, Math.round((done / total) * 100)) + "%";
    bar.append(fill);
    text.append(bar, el("small", "ch-meta", tf("progress", { done: done, total: total })));
  }
  card.append(ic, text);
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
  back.addEventListener("click", closeToHome);
  row.append(back);
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
  shown.forEach(function (c) {
    host.append(chapterCard(c));
  });
}

/* ---------------- chapter page ---------------- */
function icon(svg, cls) {
  var span = el("span", cls || "ch-ico-sm");
  span.innerHTML = svg; // static, trusted SVG
  return span;
}

function exerciseCard(ch, ex, index) {
  var key = ch.id + "/" + ex.id;
  var st = statusOf(ch.id)[ex.id];
  var card = el("article", "ex-card" + (st ? " is-" + st : ""));

  var head = el("div", "ex-head");
  head.append(el("span", "ex-num", String(index + 1)));
  var diff = ex.difficulty === "bac" || ex.difficulty === "medium" ? ex.difficulty : "easy";
  head.append(el("span", "ex-diff is-" + diff, t("d_" + diff)));
  if (st) head.append(el("span", "ex-state is-" + st, t(st)));
  card.append(head, md(ex.statement));

  if (ex.hint) {
    var hintBtn = el("button", "ex-link", hintOpen[key] ? t("hideHint") : t("hint"));
    hintBtn.type = "button";
    hintBtn.addEventListener("click", function () {
      hintOpen[key] = !hintOpen[key];
      card.replaceWith(exerciseCard(ch, ex, index));
    });
    card.append(hintBtn);
    if (hintOpen[key]) {
      var hint = el("div", "ex-hint");
      hint.append(md(ex.hint));
      card.append(hint);
    }
  }

  var isOpen = !!revealed[key];
  var label = el("label", "ex-label", t("answerLabel"));
  var ta = el("textarea", "ex-answer");
  ta.rows = 5;
  ta.spellcheck = false;
  ta.setAttribute("dir", "ltr");
  ta.setAttribute("lang", "fr");
  ta.placeholder = t("answerPlaceholder");
  ta.value = drafts[key] || "";
  label.append(ta);
  card.append(label);

  if (!isOpen) {
    var actions = el("div", "ex-actions");
    var show = el("button", "pc-btn", t("showSolution"));
    show.type = "button";
    var unlocked = function () {
      return !!st || ta.value.trim().length >= MIN_ANSWER;
    };
    show.disabled = !unlocked();
    ta.addEventListener("input", function () {
      drafts[key] = ta.value;
      show.disabled = !unlocked();
    });
    show.addEventListener("click", async function () {
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
    actions.append(show);
    card.append(actions);
  } else {
    ta.addEventListener("input", function () {
      drafts[key] = ta.value;
    });
    var sol = el("div", "ex-solution");
    sol.append(el("div", "ex-sol-title", t("solution")), md(solutions[key]));
    var mark = el("div", "ex-actions");
    function choose(value) {
      return async function () {
        await setStatus(ch.id, ex.id, value);
        render();
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
    card.append(sol);
  }
  if (rowError[key]) card.append(el("p", "set-msg", rowError[key]));
  return card;
}

function renderView(view, ch) {
  view.textContent = "";
  var back = el("button", "ch-back");
  back.type = "button";
  back.append(icon(ICON_BACK, "ch-back-ico"));
  back.append(el("span", "", tf("back", { name: t("s_" + ch.subject) })));
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

  view.append(back, hero);

  if (ch.rappel) {
    var block = el("section", "ch-block ch-rappel");
    block.append(el("span", "test-chip", t("rappel")), md(ch.rappel));
    view.append(block);
  }

  var h2 = el("h2", "ch-section-title", t("exercises"));
  view.append(h2);
  var cur = S.cur;
  if (!cur || cur.loading) {
    view.append(el("div", "student-empty", t("loading")));
  } else if (cur.failed) {
    var box = el("div", "student-empty");
    box.append(el("b", "", t("loadFail")));
    var retry = el("button", "pc-btn", t("retry"));
    retry.type = "button";
    retry.addEventListener("click", function () {
      loadExercises(ch.id).then(null, function () {});
      render();
    });
    box.append(retry);
    view.append(box);
  } else {
    var list = el("div", "ex-list");
    cur.exercises.forEach(function (ex, i) {
      list.append(exerciseCard(ch, ex, i));
    });
    view.append(list);
  }
}

/* ---------------- entry points ---------------- */
function render() {
  if (!ctx) return;
  if (ctx.ready() && S.loadedKey !== ctx.getLevel() && !S.loading) {
    load();
    return;
  }
  var hero = $("sHero");
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

  if (hero) hero.hidden = !!opening;
  if (placement) placement.hidden = !!opening;
  if (section) section.hidden = !!opening;
  view.hidden = !opening;

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
    window.addEventListener("hashchange", render);
  },
  render: render,
};
