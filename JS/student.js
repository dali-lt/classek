/* ClassLedger student space.
   Guards the page: signed out -> ./ , teacher -> teacher.
   The profile card ("My account") reuses the teacher app's modal look (style.css)
   and saves to users/{uid}/meta/profile. */

var SDK_VERSION = "10.14.1";
var SDK_BASE = "https://www.gstatic.com/firebasejs/" + SDK_VERSION + "/";
var LANG_KEY = "classledger:lang";

var STR = {
  en: {
    hello: "Hello",
    sub: "Pick a chapter, practice, and track your progress.",
    chapters: "Chapters",
    emptyTitle: "Your first chapters are on their way",
    emptyText: "Come back soon: new exercises are being added.",
    signOut: "Sign out",
    account: "My account",
    settings: "Settings",
    retakeTest: "Retake the level test",
    dangerTitle: "Delete account",
    dangerText:
      "This permanently deletes your account and your data (details, progress). It cannot be undone.",
    typeToConfirm: "Type DELETE to confirm",
    deleteBtn: "Delete my account",
    deleting: "Deleting…",
    deleteFail: "Couldn’t delete the account.",
    close: "Close",
    profileEdit: "Edit",
    profileSave: "Save",
    profileFirstName: "First name",
    profileLastName: "Last name",
    profileGender: "Gender",
    profilePhone: "Phone",
    profileLevel: "Level / section",
    profileLevelHint: "e.g. Bac Informatique",
    profileEmail: "Email",
    profileNoName: "Add your name",
    profileNotSet: "Not set",
    profileSaved: "Your profile was saved.",
    profileSyncing: "Loading your details…",
    saveFail: "Couldn’t save. Try again.",
    genderMale: "Male",
    genderFemale: "Female",
    pTitle: "Placement test",
    pIntroTitle: "Let’s see where you stand",
    pIntro:
      "10 quick questions on the basics of Programmation and STI. About 5 minutes, no grade, no pressure. It helps us suggest where to start.",
    pStart: "Start the test",
    pSkip: "Skip for now",
    pNext: "Next",
    pFinish: "Finish",
    pDontKnow: "I don’t know",
    pQuestion: "Question {n} of {total}",
    pResult: "Your result",
    pOverall: "Overall: {n} / {total}",
    pRecoWeak: "Start with {domain}.",
    pRecoBoth: "You’re solid on both sides. Pick any chapter.",
    pRecoLow: "Start with the basics of both sides.",
    pReview: "Review your answers",
    pCorrect: "Correct answer",
    pYours: "Your answer",
    pRetake: "Retake the test",
    pViewResults: "View my results",
    pOverall: "Overall",
    pNewBadge: "Start here",
    pCardTodoBtn: "Take the test",
    pCardDoneSub: "Based on your placement test",
    pRight: "Correct!",
    pWrong: "Not quite",
    pNoIdea: "No worries",
    pPerfect: "Perfect score!",
    pGreat: "Great job!",
    pGood: "Good start!",
    pKeep: "Keep going, you’ll get there!",
    pChipQ: "{n} questions",
    pChipTime: "About 5 min",
    pChipNoGrade: "No grade",
    pDone: "Done",
    pLoadFail: "Couldn’t load the questions. Try again.",
    pSaveFail: "Your result couldn’t be saved, but here it is.",
    pCardTodoTitle: "Take the placement test",
    pCardTodoText: "10 questions, about 5 minutes. We’ll suggest where to start.",
    pCardDoneTitle: "Your level",
    pLevelHigh: "Solid",
    pLevelMid: "Getting there",
    pLevelLow: "Needs the basics",
  },
  ar: {
    hello: "مرحبا",
    sub: "اختار فصل، تمرّن، وتابع تقدمك.",
    chapters: "الفصول",
    emptyTitle: "أول الفصول في الطريق",
    emptyText: "ارجع قريب: تمارين جديدة تتزاد.",
    signOut: "تسجيل الخروج",
    account: "حسابي",
    settings: "الإعدادات",
    retakeTest: "عاود اختبار المستوى",
    dangerTitle: "حذف الحساب",
    dangerText: "هذا يحذف حسابك وبياناتك (المعلومات والتقدم) نهائيا. ما ينجمش يتراجع.",
    typeToConfirm: "اكتب DELETE للتأكيد",
    deleteBtn: "حذف حسابي",
    deleting: "جاري الحذف…",
    deleteFail: "ما نجمناش نحذفو الحساب.",
    close: "إغلاق",
    profileEdit: "تعديل",
    profileSave: "حفظ",
    profileFirstName: "الاسم",
    profileLastName: "اللقب",
    profileGender: "الجنس",
    profilePhone: "الهاتف",
    profileLevel: "المستوى / الشعبة",
    profileLevelHint: "مثلا: باك إعلامية",
    profileEmail: "الإيميل",
    profileNoName: "زيد اسمك",
    profileNotSet: "موش محدد",
    profileSaved: "تم حفظ البروفايل.",
    profileSyncing: "جاري تحميل معلوماتك…",
    saveFail: "ما نجمناش نحفظو. عاود جرّب.",
    genderMale: "ذكر",
    genderFemale: "أنثى",
    pTitle: "اختبار تحديد المستوى",
    pIntroTitle: "نشوفو وين وصلت",
    pIntro:
      "10 أسئلة سريعة على أساسيات Programmation و STI. حوالي 5 دقايق، من غير نقطة ومن غير ضغط. يعاوننا نقترحو عليك من وين تبدا.",
    pStart: "ابدا الاختبار",
    pSkip: "نعملو بعد",
    pNext: "التالي",
    pFinish: "إنهاء",
    pDontKnow: "ما نعرفش",
    pQuestion: "السؤال {n} من {total}",
    pResult: "نتيجتك",
    pOverall: "المجموع: {n} / {total}",
    pRecoWeak: "ابدا بـ {domain}.",
    pRecoBoth: "مستواك مليح في الجزئين. اختار أي فصل.",
    pRecoLow: "ابدا بأساسيات الجزئين.",
    pReview: "راجع أجوبتك",
    pCorrect: "الجواب الصحيح",
    pYours: "جوابك",
    pRetake: "عاود الاختبار",
    pViewResults: "شوف النتيجة",
    pOverall: "المستوى العام",
    pNewBadge: "ابدا من هنا",
    pCardTodoBtn: "اعمل الاختبار",
    pCardDoneSub: "على أساس اختبار تحديد المستوى",
    pRight: "صحيح!",
    pWrong: "موش بالضبط",
    pNoIdea: "ما يهمش",
    pPerfect: "نتيجة ممتازة!",
    pGreat: "برافو عليك!",
    pGood: "بداية باهية!",
    pKeep: "كمّل، تتحسن شوية بشوية!",
    pChipQ: "{n} أسئلة",
    pChipTime: "تقريبا 5 دقايق",
    pChipNoGrade: "بلا نقطة",
    pDone: "تمّ",
    pLoadFail: "ما نجمناش نحمّلو الأسئلة. عاود جرّب.",
    pSaveFail: "ما نجمناش نحفظو نتيجتك، أما هاهي.",
    pCardTodoTitle: "اعمل اختبار تحديد المستوى",
    pCardTodoText: "10 أسئلة، حوالي 5 دقايق. نقترحو عليك من وين تبدا.",
    pCardDoneTitle: "مستواك",
    pLevelHigh: "قوي",
    pLevelMid: "في الطريق",
    pLevelLow: "يحتاج الأساسيات",
  },
};

var ICON_USER =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/></svg>';
var ICON_GEAR =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
var ICON_OUT =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>';
var ICON_EDIT =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
var ICON_CHECK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

var lang = "en";
try {
  lang = localStorage.getItem(LANG_KEY) === "ar" ? "ar" : "en";
} catch (e) {}

function t(key) {
  return STR[lang][key];
}
function tf(key, vars) {
  var out = STR[lang][key];
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

var currentUser = null;
var profile = { firstName: "", lastName: "", gender: "", phone: "", level: "" };
var profileLoaded = false;
var editing = false;
var justSaved = false;
var saveProfile = null; // set once Firebase is ready
var removeAccount = null; // set once Firebase is ready
var signOutNow = null; // set once Firebase is ready
var placement = null; // saved placement result / skip marker, null = never seen
var placementLoaded = false;
var savePlacement = null; // set once Firebase is ready
var testData = null; // questions loaded from data/placement-test.json
var settingsText = ""; // survives re-rendering of the settings box
var settingsOpen = false;
var isPhone = window.matchMedia("(max-width: 720px)");

function splitName(full) {
  var parts = String(full || "").trim().split(/\s+/).filter(Boolean);
  return { first: parts[0] || "", last: parts.slice(1).join(" ") };
}
function shownNames() {
  var g = splitName(currentUser && currentUser.displayName);
  var own = !!(profile.firstName || profile.lastName);
  return {
    first: own ? profile.firstName : g.first,
    last: own ? profile.lastName : g.last,
  };
}
function genderText(v) {
  return v === "female" ? t("genderFemale") : v === "male" ? t("genderMale") : "";
}

/* ---------------- page ---------------- */
function renderPage() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("#langSwitch .lang-btn").forEach(function (b) {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
  $("pClose").setAttribute("aria-label", t("close"));
  $("pGear").setAttribute("aria-label", t("settings"));
  $("pGear").title = t("settings");
  $("setClose").setAttribute("aria-label", t("close"));
  $("tClose").setAttribute("aria-label", t("close"));
  if (!currentUser) return;

  var first = shownNames().first;
  $("sGreeting").textContent = first ? t("hello") + (lang === "ar" ? " " : ", ") + first : t("hello");
  $("sSub").textContent = t("sub");
  $("sChaptersTitle").textContent = t("chapters");
  $("sSignOut").textContent = t("signOut");

  var user = $("sUser");
  user.setAttribute("aria-label", t("account"));
  user.title = t("account");
  user.textContent = "";
  if (currentUser.photoURL) {
    var img = el("img");
    img.alt = "";
    img.referrerPolicy = "no-referrer";
    img.src = currentUser.photoURL;
    user.append(img);
  } else {
    var ini = el("span", "student-initial", (first || currentUser.email || "?").charAt(0).toUpperCase());
    user.append(ini);
  }

  var list = $("sChapters");
  list.textContent = "";
  var empty = el("div", "student-empty");
  empty.append(el("b", "", t("emptyTitle")), el("span", "", t("emptyText")));
  list.append(empty);

  renderPlacementCard();
  if (testIsOpen()) renderTest();
  if (modalIsOpen()) renderModal();
  if (settingsIsOpen()) renderSettings();
  if (menuIsOpen()) renderMenu();
}

/* ---------------- profile modal ---------------- */
function modalIsOpen() {
  return $("pOverlay").classList.contains("open");
}
function openModal() {
  editing = false;
  justSaved = false;
  renderModal();
  $("pOverlay").classList.add("open");
}
function closeModal() {
  $("pOverlay").classList.remove("open");
  editing = false;
}
function row(label, value, ltr) {
  var r = el("div", "me-row");
  r.append(el("span", "me-row-label", label));
  var v = el("span", "me-row-value" + (value ? "" : " is-empty"), value || t("profileNotSet"));
  if (ltr && value) v.setAttribute("dir", "ltr");
  r.append(v);
  return r;
}
function pButton(label, icon, onClick, type) {
  var btn = el("button", "profile-edit-btn");
  btn.type = type || "button";
  var ic = el("span", "profile-edit-icon");
  ic.setAttribute("aria-hidden", "true");
  ic.innerHTML = icon; // static, trusted SVG
  btn.append(ic, el("span", "profile-edit-label", label));
  if (onClick) btn.addEventListener("click", onClick);
  return btn;
}

function renderModal() {
  var names = shownNames();
  var fullName = [names.first, names.last].filter(Boolean).join(" ");
  $("pTitle").textContent = fullName || t("profileNoName");

  var av = $("pAvatar");
  av.textContent = "";
  if (currentUser && currentUser.photoURL) {
    var img = el("img", "avatar");
    img.alt = "";
    img.referrerPolicy = "no-referrer";
    img.src = currentUser.photoURL;
    av.append(img);
  } else {
    var ini = el("div", "avatar me-initial");
    if (fullName) ini.textContent = fullName.charAt(0).toUpperCase();
    else ini.innerHTML = ICON_USER; // static, trusted SVG
    av.append(ini);
  }

  var body = $("pBody");
  body.textContent = "";

  if (!editing) {
    var g = genderText(profile.gender);
    if (g || profile.level) {
      var meta = el("div", "profile-meta");
      if (g) meta.append(el("span", "profile-chip", g));
      if (profile.level) meta.append(el("span", "profile-chip", profile.level));
      body.append(meta);
    }
    var rows = el("div", "me-rows");
    rows.append(row(t("profileGender"), g, false));
    rows.append(row(t("profilePhone"), profile.phone, true));
    rows.append(row(t("profileLevel"), profile.level, false));
    if (currentUser && currentUser.email) rows.append(row(t("profileEmail"), currentUser.email, true));
    body.append(rows);

    var editBtn = pButton(t("profileEdit"), ICON_EDIT, function () {
      editing = true;
      justSaved = false;
      renderModal();
    });
    editBtn.disabled = !profileLoaded; // wait for the cloud copy so a stale one can't overwrite it
    body.append(editBtn);
    if (!profileLoaded) body.append(el("p", "me-hint", t("profileSyncing")));
    else if (justSaved) body.append(el("p", "me-hint", t("profileSaved")));
    return;
  }

  var form = el("form", "me-form");
  function field(labelText, value, type, max, placeholder) {
    var label = el("label", "me-field");
    label.append(el("span", "me-row-label", labelText));
    var input = el("input", "me-input");
    input.type = type;
    input.value = value || "";
    input.maxLength = max;
    if (placeholder) input.placeholder = placeholder;
    label.append(input);
    return { label: label, input: input };
  }
  var fFirst = field(t("profileFirstName"), names.first, "text", 40);
  var fLast = field(t("profileLastName"), names.last, "text", 40);
  var gLabel = el("label", "me-field");
  gLabel.append(el("span", "me-row-label", t("profileGender")));
  var gSelect = el("select", "me-input");
  [
    ["", "—"],
    ["male", t("genderMale")],
    ["female", t("genderFemale")],
  ].forEach(function (pair) {
    var opt = el("option", "", pair[1]);
    opt.value = pair[0];
    gSelect.append(opt);
  });
  gSelect.value = profile.gender;
  gLabel.append(gSelect);
  var fPhone = field(t("profilePhone"), profile.phone, "tel", 30);
  fPhone.input.setAttribute("dir", "ltr");
  var fLevel = field(t("profileLevel"), profile.level, "text", 60, t("profileLevelHint"));
  var errorLine = el("p", "me-hint");
  form.append(fFirst.label, fLast.label, gLabel, fPhone.label, fLevel.label, errorLine);
  var saveBtn = pButton(t("profileSave"), ICON_CHECK, null, "submit");
  form.append(saveBtn);
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    var next = {
      firstName: fFirst.input.value.trim(),
      lastName: fLast.input.value.trim(),
      gender: gSelect.value,
      phone: fPhone.input.value.trim(),
      level: fLevel.input.value.trim(),
    };
    saveBtn.disabled = true;
    try {
      await saveProfile(next);
      profile = next;
      editing = false;
      justSaved = true;
      renderPage();
      renderModal();
    } catch (err) {
      saveBtn.disabled = false;
      errorLine.textContent = t("saveFail");
    }
  });
  body.append(form);
  fFirst.input.focus();
}

/* ---------------- placement test ---------------- */
var test = { step: "intro", i: 0, perm: {}, picks: {}, result: null, saveFailed: false, loadFailed: false };

function testIsOpen() {
  return $("tOverlay").classList.contains("open");
}
function shuffled(n) {
  var a = [];
  for (var i = 0; i < n; i++) a.push(i);
  for (var j = n - 1; j > 0; j--) {
    var k = Math.floor(Math.random() * (j + 1));
    var tmp = a[j];
    a[j] = a[k];
    a[k] = tmp;
  }
  return a;
}
async function loadTestData() {
  if (testData) return true;
  try {
    var res = await fetch("data/placement-test.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    var data = await res.json();
    if (!data || !Array.isArray(data.questions) || !data.questions.length) throw new Error("empty");
    testData = data;
    return true;
  } catch (e) {
    console.warn("Couldn’t load the placement questions:", e);
    return false;
  }
}
function domainLabel(key) {
  var d = testData && testData.domains && testData.domains[key];
  if (d && lang === "ar" && d.label_ar) return d.label_ar;
  return d && d.label ? d.label : key;
}
function pctOf(d) {
  return d && d.total ? d.correct / d.total : 0;
}
function levelWord(p) {
  return p >= 0.8 ? t("pLevelHigh") : p >= 0.4 ? t("pLevelMid") : t("pLevelLow");
}
// Two nested half-rings, like the teacher dashboard gauge: the first domain is the outer ring and
// fills from the left, the second is the inner ring and fills from the right. Overall score in the middle.
function levelGauge(res) {
  var NS = "http://www.w3.org/2000/svg";
  var keys = Object.keys(res.domains);
  var wrap = el("div", "lv-board");
  var gauge = el("div", "lv-gauge");
  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 240 126");
  svg.setAttribute("aria-hidden", "true");
  var rings = [
    { r: 100, path: "M20 120A100 100 0 0 1 220 120" },
    { r: 72, path: "M192 120A72 72 0 0 0 48 120" },
  ];
  var html = "";
  var fills = [];
  keys.slice(0, 2).forEach(function (key, i) {
    var ring = rings[i];
    var len = Math.PI * ring.r;
    html += '<path class="lv-track" d="' + ring.path + '"/>';
    html +=
      '<path class="lv-arc" data-d="' + key + '" data-len="' + len.toFixed(1) + '" d="' + ring.path +
      '" stroke-dasharray="' + len.toFixed(1) + '" stroke-dashoffset="' + len.toFixed(1) + '"/>';
  });
  svg.innerHTML = html;
  gauge.append(svg);
  var mid = el("div", "lv-mid");
  mid.append(el("b", "", String(res.correct)), el("small", "", "/ " + res.total), el("span", "", t("pOverall")));
  gauge.append(mid);
  wrap.append(gauge);

  var legend = el("div", "lv-legend");
  keys.forEach(function (key, i) {
    var d = res.domains[key];
    var p = pctOf(d);
    var item = el("div", "lv-item");
    item.dataset.d = key;
    item.append(ico(DOMAIN_ICON[key] || I_CODE, "lv-ico"));
    var txt = el("div", "lv-item-text");
    txt.append(el("b", "", domainLabel(key)));
    var line = el("span", "lv-item-line");
    line.append(el("em", "", d.correct + " / " + d.total), el("span", "tc-level " + levelClass(p), levelWord(p)));
    txt.append(line);
    item.append(txt);
    legend.append(item);
    if (i < 2)
      setTimeout(function () {
        var arc = svg.querySelector('.lv-arc[data-d="' + key + '"]');
        if (arc) {
          var len = parseFloat(arc.getAttribute("data-len"));
          arc.style.strokeDashoffset = (len * (1 - p)).toFixed(1);
        }
      }, 150 + i * 200);
  });
  wrap.append(legend);
  return wrap;
}

function renderPlacementCard() {
  var host = $("sPlacement");
  host.textContent = "";
  if (!placementLoaded) return;
  var done = placement && placement.status === "done" && placement.domains;
  var card = el("div", "placement-card " + (done ? "is-done" : "is-todo"));
  var text = el("div", "pc-text");
  var actions = el("div", "pc-actions");
  if (done) {
    var head = el("div", "pc-head");
    head.append(ico(I_CHART, "pc-ico"));
    var ht = el("div", "pc-head-text");
    ht.append(el("h3", "", t("pCardDoneTitle")), el("p", "", t("pCardDoneSub")));
    head.append(ht);
    text.append(head, levelGauge(placement));
    var view = pBtn(t("pViewResults"), "", function () {
      viewResults();
    });
    view.prepend(ico(I_EYE, "tc-ico"));
    var again = pBtn(t("pRetake"), "is-ghost", function () {
      openTest();
    });
    actions.append(view, again);
  } else {
    var halo = el("div", "pc-alert");
    halo.append(ico(I_BELL, "pc-bell"));
    var tt = el("div", "pc-head-text");
    var badge = el("span", "pc-new", t("pNewBadge"));
    tt.append(badge, el("h3", "", t("pCardTodoTitle")), el("p", "", t("pCardTodoText")));
    var row = el("div", "pc-head");
    row.append(halo, tt);
    text.append(row);
    var go = pBtn(t("pCardTodoBtn"), "is-pulse", function () {
      openTest();
    });
    go.append(ico(I_ARROW, "tc-ico tc-flip"));
    actions.append(go);
  }
  card.append(text, actions);
  host.append(card);
}

async function viewResults() {
  if (!placement || !placement.domains) return;
  if (!(await loadTestData())) return;
  var picks = {};
  testData.questions.forEach(function (q) {
    var v = placement.answers ? placement.answers[q.id] : undefined;
    picks[q.id] = typeof v === "number" ? v : -1;
  });
  test = { step: "result", i: 0, perm: {}, picks: picks, result: placement, saveFailed: false, loadFailed: false };
  if (menuIsOpen()) closeMenu();
  $("tOverlay").classList.add("open");
  renderTest("in");
}

async function openTest() {
  test = { step: "intro", i: 0, perm: {}, picks: {}, result: null, saveFailed: false, loadFailed: false };
  if (menuIsOpen()) closeMenu();
  if (modalIsOpen()) closeModal();
  $("tOverlay").classList.add("open");
  renderTest("in");
  var ok = await loadTestData();
  test.loadFailed = !ok;
  if (ok)
    testData.questions.forEach(function (q) {
      test.perm[q.id] = shuffled(q.choices.length);
    });
  renderTest();
}
async function closeTest() {
  $("tOverlay").classList.remove("open");
  // closing before finishing counts as "skip for now": the test won't pop up again by itself
  if (!placement && savePlacement) {
    placement = { status: "skipped" };
    try {
      await savePlacement(placement);
    } catch (e) {}
    renderPlacementCard();
  }
}
function scoreTest() {
  var domains = {};
  var total = 0;
  var right = 0;
  testData.questions.forEach(function (q) {
    var d = domains[q.domain] || (domains[q.domain] = { correct: 0, total: 0 });
    d.total++;
    total++;
    if (test.picks[q.id] === q.answer) {
      d.correct++;
      right++;
    }
  });
  return { correct: right, total: total, domains: domains };
}
async function finishTest() {
  var res = scoreTest();
  test.result = res;
  test.step = "result";
  var answers = {};
  testData.questions.forEach(function (q) {
    answers[q.id] = typeof test.picks[q.id] === "number" ? test.picks[q.id] : -1;
  });
  var doc = {
    status: "done",
    testId: testData.id || "placement",
    correct: res.correct,
    total: res.total,
    domains: res.domains,
    answers: answers,
  };
  placement = doc;
  renderTest("in");
  renderPlacementCard();
  try {
    await savePlacement(doc);
  } catch (e) {
    test.saveFailed = true;
    renderTest();
  }
}
function pBtn(label, cls, onClick) {
  var b = el("button", "pc-btn" + (cls ? " " + cls : ""), label);
  b.type = "button";
  b.addEventListener("click", onClick);
  return b;
}

/* ---- deck of cards: icons, colours ---- */
function ico(svg, cls) {
  var span = el("span", cls || "tc-ico");
  span.innerHTML = svg; // static, trusted SVG
  return span;
}
var S = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
var I_CODE = S + '<path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/><path d="m13.5 5-3 14"/></svg>';
var I_TERM = S + '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="m7 9 3 3-3 3"/><path d="M13 15h4"/></svg>';
var I_FLOW = S + '<circle cx="6" cy="5.5" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M6 8v4a3 3 0 0 0 3 3h6.5"/><path d="m13 12.5 2.5 2.5-2.5 2.5" transform="translate(0 -1)"/></svg>';
var I_PALETTE = S + '<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 1.6-2.2-.4-1.2.3-2.3 1.6-2.3H17a4 4 0 0 0 4-4C21 6.9 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7.5" r="1"/><circle cx="15" cy="7.8" r="1"/></svg>';
var I_BRACES = S + '<path d="M8 4c-2 0-3 1-3 3v2c0 1.5-.8 3-2 3 1.2 0 2 1.5 2 3v2c0 2 1 3 3 3"/><path d="M16 4c2 0 3 1 3 3v2c0 1.5.8 3 2 3-1.2 0-2 1.5-2 3v2c0 2-1 3-3 3"/></svg>';
var I_SERVER = S + '<rect x="3" y="4" width="18" height="6.5" rx="2"/><rect x="3" y="13.5" width="18" height="6.5" rx="2"/><path d="M7 7.3h.01M7 16.8h.01"/></svg>';
var I_DB = S + '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/><path d="M4 11.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>';
var I_GLOBE = S + '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/></svg>';
var I_CHECK = S.replace('stroke-width="2"', 'stroke-width="3"') + '<path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
var I_X = S.replace('stroke-width="2"', 'stroke-width="3"') + '<path d="m7 7 10 10M17 7 7 17"/></svg>';
var I_HELP = S + '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.4a2.6 2.6 0 1 1 3.6 2.4c-.7.4-1.1 1-1.1 1.8"/><path d="M12 17h.01"/></svg>';
var I_TROPHY = S + '<path d="M8 21h8M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>';
var I_ROCKET = S + '<path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2"/><path d="M14 4c3-1 6-1 6-1s0 3-1 6l-6 6-5-5z"/><circle cx="15" cy="9" r="1.3"/></svg>';
var I_CARDS = S + '<rect x="7" y="3" width="13" height="17" rx="2.5" transform="rotate(8 13.5 11.5)"/><rect x="4" y="4" width="13" height="17" rx="2.5"/><path d="M8 11.5h5M8 15h3"/></svg>';
var I_BELL = S + '<path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>';
var I_CHART = S + '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>';
var I_EYE = S + '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
var I_ARROW = S + '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
var TOPICS = {
  algo: { color: "#032c7b", icon: I_FLOW },
  python: { color: "#0464de", icon: I_TERM },
  html: { color: "#01092d", icon: I_CODE },
  css: { color: "#0464de", icon: I_PALETTE },
  js: { color: "#4aa52f", icon: I_BRACES },
  php: { color: "#032c7b", icon: I_SERVER },
  mysql: { color: "#4aa52f", icon: I_DB },
};
function topicOf(key) {
  return TOPICS[key] || { color: "#0464de", icon: I_CODE };
}
var DOMAIN_ICON = { programmation: I_TERM, sti: I_GLOBE };
function levelClass(p) {
  return p >= 0.8 ? "is-high" : p >= 0.4 ? "is-mid" : "is-low";
}

function testCard() {
  return document.querySelector("#tOverlay .test-modal");
}
function animateCard(cls) {
  var card = testCard();
  ["is-entering", "is-flipping", "is-leaving"].forEach(function (c) {
    card.classList.remove(c);
  });
  void card.offsetWidth; // restart the animation
  card.classList.add(cls);
  card.addEventListener(
    "animationend",
    function done() {
      card.classList.remove(cls);
      card.removeEventListener("animationend", done);
    },
  );
}
// the current card flies away, then fn() deals the next one
function leaveThen(fn) {
  var card = testCard();
  card.classList.remove("is-entering", "is-flipping");
  card.classList.add("is-leaving");
  setTimeout(function () {
    card.classList.remove("is-leaving");
    fn();
  }, 260);
}

function renderTest(anim) {
  $("tTitle").textContent = test.step === "result" ? t("pResult") : t("pTitle");
  var body = $("tBody");
  body.textContent = "";
  $("tHead").textContent = "";
  $("tHead").hidden = true;
  if (test.step === "intro") renderIntroCard(body);
  else if (test.step === "q") renderQuestionCard(body);
  else renderResultCard(body);
  if (anim) animateCard("is-entering");
}

function renderIntroCard(body) {
  var hero = el("div", "tc-hero");
  hero.append(ico(I_CARDS, "tc-hero-ico"));
  body.append(hero, el("h3", "tc-h", t("pIntroTitle")), el("p", "tc-p", t("pIntro")));
  var n = testData ? testData.questions.length : 10;
  var chips = el("div", "tc-chips");
  [
    [I_CODE, tf("pChipQ", { n: n }), "c1"],
    [I_HELP, t("pChipTime"), "c2"],
    [I_CHECK, t("pChipNoGrade"), "c3"],
  ].forEach(function (c) {
    var chip = el("span", "tc-chip " + c[2]);
    chip.append(ico(c[0]), el("span", "", c[1]));
    chips.append(chip);
  });
  body.append(chips);
  if (test.loadFailed) body.append(el("p", "set-msg", t("pLoadFail")));
  var actions = el("div", "test-actions");
  var start = pBtn(t("pStart"), "", function () {
    leaveThen(function () {
      test.step = "q";
      test.i = 0;
      renderTest("in");
    });
  });
  start.append(ico(I_ARROW, "tc-ico tc-flip"));
  start.disabled = !testData || test.loadFailed;
  actions.append(pBtn(t("pSkip"), "is-ghost", closeTest), start);
  body.append(actions);
}

function renderQuestionCard(body) {
  var qs = testData.questions;
  var q = qs[test.i];
  var topic = topicOf(q.topic);
  var card = testCard();
  card.style.setProperty("--tc", topic.color);

  // one segment per question: green / red once answered
  var segRow = el("div", "tc-segs");
  var segs = qs.map(function (item, idx) {
    var pick = test.picks[item.id];
    var cls = "tc-seg";
    if (pick !== undefined) cls += pick === item.answer ? " is-right" : " is-wrong";
    else if (idx === test.i) cls += " is-current";
    var seg = el("i", cls);
    segRow.append(seg);
    return seg;
  });
  var fixedHead = $("tHead");
  fixedHead.hidden = false;
  fixedHead.append(segRow);

  var head = el("div", "tc-head");
  var badge = el("span", "tc-topic");
  badge.append(ico(topic.icon, "tc-topic-ico"), el("span", "tc-topic-name", String(q.topic || "").toUpperCase()), el("span", "tc-topic-dom", " · " + domainLabel(q.domain)));
  head.append(badge, el("span", "tc-count", tf("pQuestion", { n: test.i + 1, total: qs.length })));
  fixedHead.append(head);

  var qText = el("p", "tc-q", q.q);
  qText.setAttribute("dir", "ltr");
  body.append(qText);
  if (q.code) {
    var codeBox = el("pre", "test-code");
    codeBox.setAttribute("dir", "ltr");
    codeBox.textContent = q.code;
    body.append(codeBox);
  }

  var list = el("div", "tc-opts");
  var opts = [];
  test.perm[q.id].forEach(function (orig, pos) {
    var b = el("button", "qopt");
    b.type = "button";
    b.setAttribute("dir", "ltr");
    var mark = el("span", "qopt-mark");
    b.append(el("span", "qopt-letter", String.fromCharCode(65 + pos)), el("span", "qopt-text", q.choices[orig]), mark);
    b.addEventListener("click", function () {
      test.picks[q.id] = orig;
      reveal(orig, true);
    });
    opts.push({ btn: b, orig: orig, mark: mark });
    list.append(b);
  });
  var skip = el("button", "qopt qopt-skip");
  skip.type = "button";
  skip.append(ico(I_HELP), el("span", "", t("pDontKnow")));
  skip.addEventListener("click", function () {
    test.picks[q.id] = -1;
    reveal(-1, true);
  });
  list.append(skip);
  body.append(list);

  var fb = el("div", "tc-fb");
  fb.hidden = true;
  fb.setAttribute("aria-live", "polite");
  body.append(fb);

  var last = test.i === qs.length - 1;
  var next = pBtn(last ? t("pFinish") : t("pNext"), "tc-next", function () {
    next.disabled = true;
    leaveThen(function () {
      if (last) finishTest();
      else {
        test.i++;
        renderTest("in");
      }
    });
  });
  next.append(ico(I_ARROW, "tc-ico tc-flip"));
  next.disabled = true;
  var actions = el("div", "test-actions");
  actions.append(next);
  body.append(actions);

  function reveal(value, animate) {
    var ok = value === q.answer;
    opts.forEach(function (o) {
      o.btn.disabled = true;
      if (o.orig === q.answer) {
        o.btn.classList.add("is-right");
        o.mark.append(ico(I_CHECK));
      } else if (o.orig === value) {
        o.btn.classList.add("is-wrong");
        o.mark.append(ico(I_X));
      } else o.btn.classList.add("is-dim");
    });
    skip.disabled = true;
    skip.classList.add(value === -1 ? "is-chosen" : "is-dim");
    segs[test.i].className = "tc-seg " + (ok ? "is-right" : "is-wrong");

    var kind = ok ? "is-right" : value === -1 ? "is-idk" : "is-wrong";
    fb.className = "tc-fb " + kind + (animate ? " pop" : "");
    fb.textContent = "";
    var badgeIcon = ico(ok ? I_CHECK : value === -1 ? I_HELP : I_X, "tc-fb-ico");
    var text = el("div", "tc-fb-text");
    text.append(el("b", "", ok ? t("pRight") : value === -1 ? t("pNoIdea") : t("pWrong")));
    if (!ok) {
      var ans = el("span", "tc-fb-ans", t("pCorrect") + ": " + q.choices[q.answer]);
      ans.setAttribute("dir", "ltr");
      text.append(ans);
    }
    if (q.explain) text.append(el("span", "tc-fb-why", q.explain));
    fb.append(badgeIcon, text);
    fb.hidden = false;
    next.disabled = false;
    if (animate) {
      next.classList.add("is-ready");
      if (!ok && value !== -1) {
        card.classList.remove("is-shaking");
        void card.offsetWidth;
        card.classList.add("is-shaking");
      }
      setTimeout(function () {
        fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }, 60);
    }
  }
  if (test.picks[q.id] !== undefined) reveal(test.picks[q.id], false);
}

function confetti(host, n) {
  var colors = ["#0464de", "#aee37b", "#032c7b", "#e9fff4", "#aee37b", "#0464de"];
  for (var i = 0; i < n; i++) {
    var piece = el("i", "tc-conf");
    piece.style.left = Math.round(Math.random() * 100) + "%";
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = (Math.random() * 0.5).toFixed(2) + "s";
    piece.style.animationDuration = (1.4 + Math.random() * 1.2).toFixed(2) + "s";
    piece.style.width = 6 + Math.round(Math.random() * 6) + "px";
    piece.style.height = 8 + Math.round(Math.random() * 8) + "px";
    host.append(piece);
  }
}

function renderResultCard(body) {
  var r = test.result;
  var pct = r.total ? r.correct / r.total : 0;
  var card = testCard();
  card.style.setProperty("--tc", "#0464de");
  var moodKey = pct >= 0.9 ? "pPerfect" : pct >= 0.6 ? "pGreat" : pct >= 0.3 ? "pGood" : "pKeep";

  var top = el("div", "tc-result-top");
  confetti(top, pct >= 0.6 ? 34 : pct >= 0.3 ? 16 : 0);

  // animated ring
  var C = 2 * Math.PI * 52;
  var ring = el("div", "tc-ring");
  var NS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 120 120");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML =
    '<defs><linearGradient id="tcGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f9bff"/><stop offset="1" stop-color="#aee37b"/></linearGradient></defs>' +
    '<circle class="tc-ring-track" cx="60" cy="60" r="52"/>' +
    '<circle class="tc-ring-fill" cx="60" cy="60" r="52" stroke="url(#tcGrad)" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '"/>';
  var num = el("div", "tc-ring-num");
  var big = el("b", "", "0");
  num.append(big, el("small", "", "/ " + r.total));
  ring.append(svg, num);
  var medal = ico(pct >= 0.6 ? I_TROPHY : I_ROCKET, "tc-medal");
  top.append(ring, medal);
  body.append(top, el("h3", "tc-h tc-mood", t(moodKey)));

  var fillCircle = svg.querySelector(".tc-ring-fill");
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      fillCircle.style.strokeDashoffset = (C * (1 - pct)).toFixed(1);
    });
  });
  var t0 = null;
  function tick(ts) {
    if (t0 === null) t0 = ts;
    var k = Math.min(1, (ts - t0) / 900);
    big.textContent = String(Math.round(r.correct * (1 - Math.pow(1 - k, 3))));
    if (k < 1 && document.body.contains(big)) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // one tile per domain
  var tiles = el("div", "tc-tiles");
  Object.keys(r.domains).forEach(function (key, idx) {
    var d = r.domains[key];
    var p = pctOf(d);
    var tile = el("div", "tc-tile");
    tile.dataset.d = key;
    tile.style.animationDelay = 0.15 + idx * 0.12 + "s";
    var th = el("div", "tc-tile-head");
    th.append(ico(DOMAIN_ICON[key] || I_CODE, "tc-tile-ico"), el("b", "", domainLabel(key)));
    var score = el("div", "tc-tile-score");
    score.append(el("b", "", String(d.correct)), el("small", "", "/ " + d.total));
    var bar = el("div", "tc-tile-bar");
    var fill = el("i");
    bar.append(fill);
    var lvl = el("span", "tc-level " + levelClass(p), levelWord(p));
    tile.append(th, score, bar, lvl);
    tiles.append(tile);
    setTimeout(function () {
      fill.style.width = Math.round(p * 100) + "%";
    }, 350 + idx * 120);
  });
  body.append(tiles);

  var keys = Object.keys(r.domains);
  var pcts = keys.map(function (k) {
    return pctOf(r.domains[k]);
  });
  var reco;
  if (pcts.every(function (p) { return p >= 0.8; })) reco = t("pRecoBoth");
  else if (pcts.every(function (p) { return p < 0.4; })) reco = t("pRecoLow");
  else {
    var weakest = keys[pcts.indexOf(Math.min.apply(null, pcts))];
    reco = tf("pRecoWeak", { domain: domainLabel(weakest) });
  }
  var banner = el("div", "tc-reco");
  banner.append(ico(I_ROCKET, "tc-reco-ico"), el("span", "", reco));
  body.append(banner);
  if (test.saveFailed) body.append(el("p", "set-msg", t("pSaveFail")));

  var missed = testData.questions.filter(function (q) {
    return test.picks[q.id] !== q.answer;
  });
  if (missed.length) {
    var det = el("details", "tc-review");
    det.append(el("summary", "", t("pReview") + " (" + missed.length + ")"));
    missed.forEach(function (q) {
      var item = el("div", "tc-rev-item");
      item.setAttribute("dir", "ltr");
      var yours = test.picks[q.id];
      var head = el("div", "tc-rev-q");
      head.append(ico(I_X, "tc-rev-x"), el("b", "", q.q));
      item.append(head);
      if (q.code) {
        var codeRev = el("pre", "test-code");
        codeRev.textContent = q.code;
        item.append(codeRev);
      }
      item.append(
        el("div", "tc-rev-yours", t("pYours") + ": " + (typeof yours === "number" && yours >= 0 ? q.choices[yours] : t("pDontKnow"))),
        el("div", "tc-rev-ok", t("pCorrect") + ": " + q.choices[q.answer]),
      );
      if (q.explain) item.append(el("div", "tc-rev-why", q.explain));
      det.append(item);
    });
    body.append(det);
  }
  var actions = el("div", "test-actions");
  actions.append(
    pBtn(t("pDone"), "", function () {
      $("tOverlay").classList.remove("open");
    }),
  );
  body.append(actions);
}

/* ---------------- avatar menu (phone) ---------------- */
function menuIsOpen() {
  return !$("sMenu").hidden;
}
function closeMenu() {
  $("sMenu").hidden = true;
  $("sUser").setAttribute("aria-expanded", "false");
}
function menuItem(label, icon, onClick) {
  var b = el("button");
  b.type = "button";
  b.setAttribute("role", "menuitem");
  var ic = el("span");
  ic.innerHTML = icon; // static, trusted SVG
  b.append(ic.firstChild, el("span", "", label));
  b.addEventListener("click", function () {
    closeMenu();
    onClick();
  });
  return b;
}
function renderMenu() {
  var m = $("sMenu");
  m.textContent = "";
  m.append(
    menuItem(t("account"), ICON_USER, openModal),
    menuItem(t("settings"), ICON_GEAR, openSettings),
    menuItem(t("signOut"), ICON_OUT, function () {
      if (signOutNow) signOutNow();
    }),
  );
}
function onAvatarClick() {
  if (!isPhone.matches) {
    openModal(); // big screens: straight to the profile card
    return;
  }
  if (menuIsOpen()) {
    closeMenu();
    return;
  }
  renderMenu();
  $("sMenu").hidden = false;
  $("sUser").setAttribute("aria-expanded", "true");
}

/* ---------------- settings box ---------------- */
function settingsIsOpen() {
  return $("setOverlay").classList.contains("open");
}
function openSettings() {
  if (modalIsOpen()) closeModal();
  settingsOpen = true;
  renderSettings();
  $("setOverlay").classList.add("open");
}
function closeSettings() {
  $("setOverlay").classList.remove("open");
  settingsOpen = false;
  settingsText = "";
}
function renderSettings() {
  $("setTitle").textContent = t("settings");
  var body = $("setBody");
  body.textContent = "";

  var retake = el("button", "set-row");
  retake.type = "button";
  retake.append(el("span", "", t("retakeTest")));
  retake.addEventListener("click", function () {
    closeSettings();
    openTest();
  });
  body.append(retake);

  // delete account (more options will join this list later)
  var details = el("details", "acct-details");
  details.append(el("summary", "acct-summary", t("dangerTitle")));
  var danger = el("div", "acct-danger");
  danger.append(el("p", "acct-danger-text", t("dangerText")));
  var confirmWrap = el("label", "acct-field");
  confirmWrap.append(el("span", "acct-label", t("typeToConfirm")));
  var input = el("input", "acct-input");
  input.type = "text";
  input.autocomplete = "off";
  input.setAttribute("dir", "ltr");
  input.maxLength = 10;
  input.value = settingsText;
  confirmWrap.append(input);
  var del = el("button", "acct-delete", t("deleteBtn"));
  del.type = "button";
  del.disabled = settingsText.trim() !== "DELETE";
  var msgLine = el("p", "set-msg");
  input.addEventListener("input", function () {
    settingsText = input.value;
    del.disabled = input.value.trim() !== "DELETE";
  });
  del.addEventListener("click", async function () {
    var label = del.textContent;
    del.disabled = true;
    del.textContent = t("deleting");
    msgLine.textContent = "";
    try {
      await removeAccount();
      window.location.replace("./");
    } catch (err) {
      del.disabled = false;
      del.textContent = label;
      var code = err && err.code;
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request")
        msgLine.textContent = t("deleteFail") + (code ? " (" + code + ")" : "");
    }
  });
  danger.append(confirmWrap, del, msgLine);
  details.append(danger);
  details.open = true;
  body.append(details);
}

/* ---------------- start ---------------- */
async function main() {
  document.querySelectorAll("#langSwitch .lang-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      lang = b.dataset.lang === "ar" ? "ar" : "en";
      try {
        localStorage.setItem(LANG_KEY, lang);
      } catch (e) {}
      renderPage();
    });
  });
  $("sUser").addEventListener("click", onAvatarClick);
  $("pClose").addEventListener("click", closeModal);
  $("pGear").addEventListener("click", openSettings);
  $("setClose").addEventListener("click", closeSettings);
  $("tClose").addEventListener("click", function () {
    if (test.step === "result") $("tOverlay").classList.remove("open");
    else closeTest();
  });
  $("setOverlay").addEventListener("click", function (e) {
    if (e.target === $("setOverlay")) closeSettings();
  });
  document.addEventListener("click", function (e) {
    if (menuIsOpen() && !e.target.closest(".student-user-wrap")) closeMenu();
  });
  $("pOverlay").addEventListener("click", function (e) {
    if (e.target === $("pOverlay")) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (settingsIsOpen()) closeSettings();
    else if (testIsOpen()) $("tClose").click();
    else if (modalIsOpen()) closeModal();
    else if (menuIsOpen()) closeMenu();
  });
  renderPage();

  var cfg = window.CLASSLEDGER_FIREBASE_CONFIG;
  if (!cfg || !cfg.apiKey || /^PASTE/i.test(cfg.apiKey)) {
    window.location.replace("./");
    return;
  }

  var mods = await Promise.all([
    import(SDK_BASE + "firebase-app.js"),
    import(SDK_BASE + "firebase-auth.js"),
    import(SDK_BASE + "firebase-firestore.js"),
  ]);
  var sdk = Object.assign({}, mods[0], mods[1], mods[2]);
  var fbApp = sdk.initializeApp(cfg);
  var auth = sdk.getAuth(fbApp);
  var db = sdk.getFirestore(fbApp);

  signOutNow = function () {
    return sdk.signOut(auth);
  };
  $("sSignOut").addEventListener("click", signOutNow);

  sdk.onAuthStateChanged(auth, async function (u) {
    if (!u) {
      window.location.replace("./");
      return;
    }
    var role = null;
    try {
      var snap = await sdk.getDoc(sdk.doc(db, "users", u.uid, "meta", "account"));
      role = snap.exists() ? snap.data().role : null;
    } catch (e) {
      window.location.replace("./");
      return;
    }
    if (role === "teacher") {
      window.location.replace("teacher");
      return;
    }
    if (role !== "student") {
      window.location.replace("./");
      return;
    }
    currentUser = u;
    $("studentApp").hidden = false;
    renderPage();

    var profileRef = sdk.doc(db, "users", u.uid, "meta", "profile");
    saveProfile = function (p) {
      return sdk.setDoc(profileRef, Object.assign({}, p, { updatedAt: sdk.serverTimestamp() }), {
        merge: true,
      });
    };
    removeAccount = async function () {
      // deleting an account is sensitive: Google asks the person to sign in again first
      await sdk.reauthenticateWithPopup(u, new sdk.GoogleAuthProvider());
      var uid = u.uid;
      var prog = await sdk.getDocs(sdk.collection(db, "users", uid, "progress"));
      var refs = prog.docs
        .map(function (d) {
          return d.ref;
        })
        .concat([profileRef, sdk.doc(db, "users", uid, "meta", "account")]);
      for (var i = 0; i < refs.length; i += 400) {
        var batch = sdk.writeBatch(db);
        refs.slice(i, i + 400).forEach(function (ref) {
          batch.delete(ref);
        });
        await batch.commit();
      }
      await sdk.deleteUser(u);
    };
    var placementRef = sdk.doc(db, "users", u.uid, "progress", "placement");
    savePlacement = function (p) {
      return sdk.setDoc(placementRef, Object.assign({}, p, { updatedAt: sdk.serverTimestamp() }));
    };
    try {
      var pl = await sdk.getDoc(placementRef);
      placement = pl.exists() ? pl.data() : null;
    } catch (e) {
      console.warn("Couldn’t load the placement result:", e);
      placement = { status: "unknown" }; // don't pop the test up when we can't tell
    }
    placementLoaded = true;
    renderPlacementCard();
    if (!placement) openTest(); // first visit: offer the test once (skippable)
    try {
      var ps = await sdk.getDoc(profileRef);
      if (ps.exists()) {
        var d = ps.data();
        profile = {
          firstName: String(d.firstName || ""),
          lastName: String(d.lastName || ""),
          gender: d.gender === "male" || d.gender === "female" ? d.gender : "",
          phone: String(d.phone || ""),
          level: String(d.level || ""),
        };
      }
    } catch (e) {
      console.warn("Couldn’t load the student profile:", e);
    }
    profileLoaded = true;
    renderPage();

  });
}

main().catch(function (e) {
  console.warn("ClassLedger student page failed to start:", e);
  window.location.replace("./");
});
