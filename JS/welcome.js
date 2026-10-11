/* ClassLedger welcome page: Google sign-in, then teacher / student routing.

   The role lives in users/{uid}/meta/account (written once, at first sign-in).
   Accounts created before this page existed have no role document: they are
   asked once, then land in the teacher app as before. */

var SDK_VERSION = "10.14.1";
var SDK_BASE = "https://www.gstatic.com/firebasejs/" + SDK_VERSION + "/";
var LANG_KEY = "classledger:lang";
var PICK_KEY = "classledger:picked-role";
var HOME = { teacher: "teacher", student: "student" };

var STR = {
  en: {
    title: "Welcome! Let’s get to it.",
    sub: "Sign in, or create a new account.",
    createTitle: "Create your account",
    createSub: "Are you a teacher or a student?",
    signInBtn: "Sign in with Google",
    createBtn: "Create account",
    back: "Back",
    chooseTitle: "One last step",
    chooseSub: "Tell us who you are so we show you the right space.",
    roleTeacher: "I’m a teacher",
    roleTeacherHint: "Manage students, calendar and payments",
    roleStudent: "I’m a student",
    roleStudentHint: "Practice exercises and track your progress",
    google: "Continue with Google",
    cont: "Continue",
    other: "Use another account",
    loading: "Just a moment…",
    noConfig: "Cloud sign-in isn’t set up yet.",
    sdkFail: "Couldn’t reach Firebase. Check your connection.",
    signInFail: "Sign-in failed.",
    domainHint:
      "This website address isn’t authorized yet. Add it in Firebase → Authentication → Settings → Authorized domains.",
    rulesHint: "The cloud refused access. Check the Firestore security rules.",
    saveFail: "Couldn’t save your choice. Try again.",
  },
  ar: {
    title: "مرحبا! يلا نبداو",
    sub: "ادخل بحسابك، ولا اعمل حساب جديد.",
    createTitle: "إنشاء حساب",
    createSub: "أنت أستاذ ولا تلميذ؟",
    signInBtn: "الدخول بحساب Google",
    createBtn: "إنشاء حساب",
    back: "رجوع",
    chooseTitle: "خطوة أخيرة",
    chooseSub: "قلنا شكون أنت باش نوروك المساحة المناسبة.",
    roleTeacher: "أنا أستاذ",
    roleTeacherHint: "سيّر تلامذتك، التقويم والمدفوعات",
    roleStudent: "أنا تلميذ",
    roleStudentHint: "تمرّن على التمارين وتابع تقدمك",
    google: "المتابعة بحساب Google",
    cont: "كمّل",
    other: "بدّل الحساب",
    loading: "لحظة…",
    noConfig: "تسجيل الدخول بالسحابة موش مفعّل توّا.",
    sdkFail: "ما نجمناش نوصلو لـ Firebase. تثبّت من الإنترنت.",
    signInFail: "فشل تسجيل الدخول.",
    domainHint:
      "عنوان الموقع هذا موش مصرّح بيه. زيدو في Firebase ← Authentication ← Settings ← Authorized domains.",
    rulesHint: "السحابة رفضت الوصول. تثبّت من قواعد أمان Firestore.",
    saveFail: "ما نجمناش نحفظو اختيارك. عاود جرّب.",
  },
};

var ICON_TEACHER =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
var ICON_STUDENT =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>';

var ICON_GOOGLE =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>';
var ICON_CREATE =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>';
var ICON_NEXT =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
var ICON_BACK =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
var ICON_SWITCH =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>';
var ICON_CHECK =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

var lang = readLang();
var state = { view: "loading", picked: null };
var handlers = {}; // filled in once Firebase is ready

function readLang() {
  try {
    return localStorage.getItem(LANG_KEY) === "ar" ? "ar" : "en";
  } catch (e) {
    return "en";
  }
}
function readPick() {
  try {
    var v = sessionStorage.getItem(PICK_KEY);
    return v === "teacher" || v === "student" ? v : null;
  } catch (e) {
    return null;
  }
}
function savePick(role) {
  try {
    sessionStorage.setItem(PICK_KEY, role);
  } catch (e) {}
}
function clearPick() {
  try {
    sessionStorage.removeItem(PICK_KEY);
  } catch (e) {}
}
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
// decorative icon for a button (the text next to it carries the meaning)
function icon(svg, extraClass) {
  var node = el("span", "wl-icon" + (extraClass ? " " + extraClass : ""));
  node.setAttribute("aria-hidden", "true");
  node.innerHTML = svg; // static, trusted SVG
  return node;
}
function msg(text, isError) {
  var node = $("wMsg");
  node.textContent = text || "";
  node.classList.toggle("is-error", !!isError);
}

function roleCard(role, titleKey, hintKey, icon) {
  var picked = state.picked === role;
  var card = el("button", "role-card" + (picked ? " is-picked" : ""));
  card.type = "button";
  card.setAttribute("aria-pressed", String(picked));
  var ic = el("span", "role-icon");
  ic.innerHTML = icon; // static, trusted SVG
  var text = el("span", "role-text");
  text.append(el("b", "", t(titleKey)), el("small", "", t(hintKey)));
  var tick = el("span", "role-check");
  tick.setAttribute("aria-hidden", "true");
  tick.innerHTML = ICON_CHECK; // static, trusted SVG
  card.append(tick, ic, text);
  card.addEventListener("click", function () {
    state.picked = role;
    savePick(role);
    render();
  });
  return card;
}

function render() {
  var choosing = state.view === "choose";
  var creating = state.view === "create";
  $("wTitle").textContent = choosing ? t("chooseTitle") : creating ? t("createTitle") : t("title");
  $("wSub").textContent = choosing ? t("chooseSub") : creating ? t("createSub") : t("sub");
  var panel = $("wPanel");
  panel.textContent = "";

  if (state.view === "loading") {
    panel.append(el("p", "welcome-loading", t("loading")));
    return;
  }

  if (choosing || creating) {
    var cards = el("div", "role-cards");
    cards.append(
      roleCard("teacher", "roleTeacher", "roleTeacherHint", ICON_TEACHER),
      roleCard("student", "roleStudent", "roleStudentHint", ICON_STUDENT),
    );
    panel.append(cards);
  }

  if (creating) {
    var next = el("button", "welcome-btn");
    next.type = "button";
    next.disabled = !state.picked;
    next.append(icon(ICON_GOOGLE), el("span", "", t("google")));
    next.addEventListener("click", function () {
      if (handlers.signIn) handlers.signIn("create");
    });
    var back = el("button", "welcome-link");
    back.type = "button";
    back.append(icon(ICON_BACK, "icon-dir"), el("span", "", t("back")));
    back.addEventListener("click", function () {
      state.view = "signedout";
      state.picked = null;
      render();
    });
    panel.append(next, back);
  } else if (choosing) {
    var go = el("button", "welcome-btn is-solid");
    go.type = "button";
    go.append(el("span", "", t("cont")), icon(ICON_NEXT, "icon-dir"));
    go.disabled = !state.picked;
    go.addEventListener("click", function () {
      if (handlers.saveRole) handlers.saveRole();
    });
    var other = el("button", "welcome-link");
    other.type = "button";
    other.append(icon(ICON_SWITCH), el("span", "", t("other")));
    other.addEventListener("click", function () {
      if (handlers.signOut) handlers.signOut();
    });
    panel.append(go, other);
  } else {
    var google = el("button", "welcome-btn");
    google.type = "button";
    google.append(icon(ICON_GOOGLE), el("span", "", t("signInBtn")));
    google.addEventListener("click", function () {
      if (handlers.signIn) handlers.signIn("signin");
    });
    var create = el("button", "welcome-btn is-solid");
    create.type = "button";
    create.append(icon(ICON_CREATE), el("span", "", t("createBtn")));
    create.addEventListener("click", function () {
      state.view = "create";
      state.picked = null;
      render();
    });
    panel.append(google, create);
  }
}

function setLang(next, persist) {
  lang = next === "ar" ? "ar" : "en";
  if (persist) {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {}
  }
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("#langSwitch .lang-btn").forEach(function (b) {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
  render();
}

function go(role) {
  clearPick();
  window.location.replace(HOME[role]);
}

async function main() {
  document.querySelectorAll("#langSwitch .lang-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      setLang(b.dataset.lang, true);
    });
  });
  var hero = $("wHero");
  hero.addEventListener("error", function () {
    hero.classList.add("is-fallback");
    hero.src = "Images/logo-icon.svg";
  });
  setLang(lang, false);
  clearPick();

  var cfg = window.CLASSLEDGER_FIREBASE_CONFIG;
  if (!cfg || !cfg.apiKey || !cfg.projectId || /^PASTE/i.test(cfg.apiKey)) {
    state.view = "signedout";
    render();
    msg(t("noConfig"), true);
    return;
  }

  var sdk;
  try {
    var mods = await Promise.all([
      import(SDK_BASE + "firebase-app.js"),
      import(SDK_BASE + "firebase-auth.js"),
      import(SDK_BASE + "firebase-firestore.js"),
    ]);
    sdk = Object.assign({}, mods[0], mods[1], mods[2]);
  } catch (e) {
    state.view = "signedout";
    render();
    msg(t("sdkFail"), true);
    return;
  }

  var fbApp = sdk.initializeApp(cfg);
  var auth = sdk.getAuth(fbApp);
  var db = sdk.getFirestore(fbApp);

  function accountRef(uid) {
    return sdk.doc(db, "users", uid, "meta", "account");
  }
  async function readRole(uid) {
    var snap = await sdk.getDoc(accountRef(uid));
    if (!snap.exists()) return null;
    var role = snap.data().role;
    return role === "teacher" || role === "student" ? role : null;
  }

  handlers.signIn = async function (mode) {
    msg("");
    if (mode === "signin") {
      state.picked = null; // plain sign-in never assigns a role
      clearPick();
    }
    try {
      await sdk.signInWithPopup(auth, new sdk.GoogleAuthProvider());
      // onAuthStateChanged below takes it from here
    } catch (err) {
      var code = err && err.code;
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      msg(
        code === "auth/unauthorized-domain"
          ? t("domainHint")
          : t("signInFail") + (code ? " (" + code + ")" : ""),
        true,
      );
    }
  };

  handlers.signOut = async function () {
    msg("");
    try {
      await sdk.signOut(auth);
    } catch (e) {}
  };

  handlers.saveRole = async function () {
    var u = auth.currentUser;
    if (!u || !state.picked) return;
    var role = state.picked;
    state.view = "loading";
    render();
    try {
      await sdk.setDoc(accountRef(u.uid), {
        role: role,
        createdAt: sdk.serverTimestamp(),
      });
      go(role);
    } catch (err) {
      state.view = "choose";
      render();
      msg(err && err.code === "permission-denied" ? t("rulesHint") : t("saveFail"), true);
    }
  };

  sdk.onAuthStateChanged(auth, async function (u) {
    if (!u) {
      state.view = "signedout";
      state.picked = null;
      render();
      return;
    }
    state.view = "loading";
    render();
    var role = null;
    try {
      role = await readRole(u.uid);
    } catch (err) {
      state.view = "signedout";
      render();
      msg(err && err.code === "permission-denied" ? t("rulesHint") : t("saveFail"), true);
      return;
    }
    if (role) return go(role);
    if (state.picked) return handlers.saveRole();
    state.view = "choose";
    render();
  });
}

main().catch(function (e) {
  console.warn("ClassLedger welcome page failed to start:", e);
});
