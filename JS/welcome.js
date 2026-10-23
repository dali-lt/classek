/* Classek welcome page: Google sign-in, then teacher / student routing.

   The role lives in users/{uid}/meta/account (written once, at first sign-in).
   Accounts created before this page existed have no role document: they are
   asked once, then land in the teacher app as before. */

var SDK_VERSION = "10.14.1";
var SDK_BASE = "https://www.gstatic.com/firebasejs/" + SDK_VERSION + "/";
var LANG_KEY = "classledger:lang";
var PICK_KEY = "classledger:picked-role";
var NOTICE_KEY = "classledger:notice"; // set by the student page when another device signed this one out
var HOME = { teacher: "teacher", student: "student" };
// New accounts are students for now (only the student space is open). Set to true to bring back the teacher / student choice at sign-up.
var TEACHER_SIGNUP = false;

var STR = {
  fr: {
    title: "Bienvenue ! On s’y met.",
    sub: "Connecte-toi ou crée un compte. Ici, ton avis compte : propose un exercice, une couleur, une correction.",
    createTitle: "Crée ton compte",
    createSub: "Tu es enseignant ou élève ?",
    signInBtn: "Se connecter avec Google",
    createBtn: "Créer un compte",
    back: "Retour",
    chooseTitle: "Dernière étape",
    chooseSub: "Dis-nous qui tu es pour afficher le bon espace.",
    roleTeacher: "Je suis enseignant",
    roleTeacherHint: "Gérer élèves, calendrier et paiements",
    roleStudent: "Je suis élève",
    roleStudentHint: "T’entraîner avec des exercices et suivre ta progression",
    google: "Continuer avec Google",
    cont: "Continuer",
    other: "Utiliser un autre compte",
    loading: "Un instant…",
    noConfig: "La connexion cloud n’est pas encore configurée.",
    sdkFail: "Impossible de joindre Firebase. Vérifie ta connexion.",
    signInFail: "Échec de la connexion.",
    domainHint:
      "Cette adresse n’est pas encore autorisée. Ajoute-la dans Firebase → Authentication → Settings → Authorized domains.",
    rulesHint: "Le cloud a refusé l’accès. Vérifie les règles de sécurité Firestore.",
    saveFail: "Impossible d’enregistrer ton choix. Réessaie.",
    remoteOut: "Tu as été déconnecté depuis un autre appareil.",
  },
  ar: {
    title: "مرحبا! يلا نبداو",
    sub: "ادخل بحسابك ولا اعمل حساب جديد. هنا رأيك يهمّ: اقترح تمرين، لون ولا تصحيح.",
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
    remoteOut: "تم تسجيل خروجك من جهاز آخر.",
  },
};

var ICON_TEACHER =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
var ICON_STUDENT =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>';

var SVG_OPEN =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
var ICON_LOGIN = SVG_OPEN + '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/></svg>';
var ICON_USER_PLUS =
  SVG_OPEN + '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>';
var ICON_ARROW_RIGHT = SVG_OPEN + '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
var ICON_ARROW_LEFT = SVG_OPEN + '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/></svg>';
var ICON_SWITCH =
  SVG_OPEN + '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>';
// Google "G" (brand colours) on a white chip so it reads on blue and navy buttons
var ICON_GOOGLE =
  '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>';

function icon(svg, cls) {
  var span = document.createElement("span");
  span.className = "welcome-ico" + (cls ? " " + cls : "");
  span.innerHTML = svg; // static, trusted SVG
  return span;
}

var lang = readLang();
var state = { view: "loading", picked: null };
var handlers = {}; // filled in once Firebase is ready

function readLang() {
  try {
    return localStorage.getItem(LANG_KEY) === "ar" ? "ar" : "fr";
  } catch (e) {
    return "fr";
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
// one-shot message left by the student page; read once, then forgotten
function takeNotice() {
  try {
    var v = sessionStorage.getItem(NOTICE_KEY);
    sessionStorage.removeItem(NOTICE_KEY);
    return v;
  } catch (e) {
    return null;
  }
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
  card.append(ic, text);
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
    var next = el("button", "welcome-btn is-solid");
    next.type = "button";
    next.disabled = !state.picked;
    next.append(icon(ICON_GOOGLE, "is-google"), el("span", "", t("google")));
    next.addEventListener("click", function () {
      if (handlers.signIn) handlers.signIn("create");
    });
    var back = el("button", "welcome-link");
    back.append(icon(ICON_ARROW_LEFT), el("span", "", t("back")));
    back.type = "button";
    back.addEventListener("click", function () {
      state.view = "signedout";
      state.picked = null;
      render();
    });
    panel.append(next, back);
  } else if (choosing) {
    var go = el("button", "welcome-btn is-solid");
    go.append(el("span", "", t("cont")), icon(ICON_ARROW_RIGHT, "flip-rtl"));
    go.type = "button";
    go.disabled = !state.picked;
    go.addEventListener("click", function () {
      if (handlers.saveRole) handlers.saveRole();
    });
    var other = el("button", "welcome-link");
    other.append(icon(ICON_SWITCH), el("span", "", t("other")));
    other.type = "button";
    other.addEventListener("click", function () {
      if (handlers.signOut) handlers.signOut();
    });
    panel.append(go, other);
  } else {
    var google = el("button", "welcome-btn");
    google.type = "button";
    google.append(icon(ICON_LOGIN, "flip-rtl"), el("span", "", t("signInBtn")));
    google.addEventListener("click", function () {
      if (handlers.signIn) handlers.signIn("signin");
    });
    var create = el("button", "welcome-btn is-solid");
    create.append(icon(ICON_USER_PLUS), el("span", "", t("createBtn")));
    create.type = "button";
    create.addEventListener("click", function () {
      if (!TEACHER_SIGNUP) {
        state.picked = "student";
        savePick("student");
        if (handlers.signIn) handlers.signIn("create");
        return;
      }
      state.view = "create";
      state.picked = null;
      render();
    });
    panel.append(google, create);
  }
}

function setLang(next, persist) {
  lang = next === "ar" ? "ar" : "fr";
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
  var notice = takeNotice();

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
      if (notice === "remote") {
        msg(t("remoteOut"), false);
        notice = null;
      }
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
  console.warn("Classek welcome page failed to start:", e);
});
