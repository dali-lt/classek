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
  },
  ar: {
    hello: "مرحبا",
    sub: "اختار فصل، تمرّن، وتابع تقدمك.",
    chapters: "الفصول",
    emptyTitle: "أول الفصول في الطريق",
    emptyText: "ارجع قريب: تمارين جديدة تتزاد.",
    signOut: "تسجيل الخروج",
    account: "حسابي",
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
  },
};

var ICON_USER =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/></svg>';
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

  if (modalIsOpen()) renderModal();
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
  $("sUser").addEventListener("click", openModal);
  $("pClose").addEventListener("click", closeModal);
  $("pOverlay").addEventListener("click", function (e) {
    if (e.target === $("pOverlay")) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalIsOpen()) closeModal();
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

  $("sSignOut").addEventListener("click", function () {
    sdk.signOut(auth);
  });

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
