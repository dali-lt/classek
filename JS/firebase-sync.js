/* ClassLedger cloud sync (optional).
   Google sign-in + Firestore. The app keeps working from localStorage; this module only
   mirrors the data to the signed-in user's own space in Firebase:
     users/{uid}/students/{studentId}   one document per student
     users/{uid}/meta/groups            one document with all groups
     users/{uid}/meta/profile           the teacher's own details (first name, last name, gender, phone, subject)
   Loaded as <script type="module">. If the config is not filled in, or Firebase can't be
   reached, nothing here runs and the app behaves exactly as before. */
import { stableStringify, diffStudents, mergeGroups } from "./sync-core.js";

var SDK_VERSION = "10.14.1";
var SDK_BASE = "https://www.gstatic.com/firebasejs/" + SDK_VERSION + "/";
var UID_KEY = "classledger:cloud-uid";
var PUSH_DELAY_MS = 600;

function idsKey(uid) {
  return "classledger:cloud-ids:" + uid;
}

var STR = {
  en: {
    hint: "Sign in to back up your data and use it on your other devices.",
    signIn: "Sign in with Google",
    createAccount: "Create account",
    accountCreated: "Account created. Your details were saved.",
    accountExists: "This Google account already exists, so you're signed in with its saved details.",
    signOut: "Sign out",
    status_syncing: "Syncing…",
    status_synced: "Saved to the cloud",
    status_offline: "Offline — changes will sync when you're back online",
    status_error: "Sync problem — your data is still safe on this device",
    switchAccount:
      "This device has data from a different account. Replace it with this account's data?",
    saveFailTitle: "Cloud save failed",
    saveFail:
      "Your data is safe on this device. Check your connection or the Firestore rules.",
    signInFail: "Sign-in failed.",
    signedIn: "Signed in. Your data is syncing.",
    domainHint:
      "This website address isn't authorized yet. Add it in Firebase → Authentication → Settings → Authorized domains.",
    rulesHint: "The cloud refused access. Check the Firestore security rules.",
    account: "My account",
        dangerTitle: "Delete account",
    dangerText:
      "This permanently deletes all your data from the cloud (students, groups, details) and closes your account. It cannot be undone. Tip: use “Export data” first to keep a backup file.",
    eraseLocal: "Also erase the data stored on this device",
    typeToConfirm: "Type DELETE to confirm",
    deleteBtn: "Delete my account",
    deleting: "Deleting…",
    deleted: "Account deleted.",
    deleteFail: "Couldn't delete the account.",
  },
  ar: {
    hint: "سجّل دخولك باش تحفظ بياناتك وتستعملها في أجهزتك الأخرى.",
    signIn: "الدخول بحساب Google",
    createAccount: "إنشاء حساب",
    accountCreated: "تم إنشاء الحساب وحفظ معلوماتك.",
    accountExists: "حساب Google هذا موجود من قبل، فدخلت بمعلوماتو المحفوظة.",
    signOut: "تسجيل الخروج",
    status_syncing: "جاري المزامنة…",
    status_synced: "محفوظ في السحابة",
    status_offline: "بلا إنترنت — التعديلات تتزامن كي ترجع الشبكة",
    status_error: "مشكل في المزامنة — بياناتك محفوظة في الجهاز",
    switchAccount:
      "الجهاز هذا فيه بيانات من حساب آخر. تحب تعوضها ببيانات الحساب هذا؟",
    saveFailTitle: "فشل الحفظ في السحابة",
    saveFail: "بياناتك محفوظة في الجهاز. تثبّت من الشبكة ولا من قواعد Firestore.",
    signInFail: "فشل تسجيل الدخول.",
    signedIn: "تم تسجيل الدخول. بياناتك تتزامن.",
    domainHint:
      "عنوان الموقع هذا موش مصرّح بيه. زيدو في Firebase ← Authentication ← Settings ← Authorized domains.",
    rulesHint: "السحابة رفضت الوصول. تثبّت من قواعد أمان Firestore.",
    account: "حسابي",
        dangerTitle: "حذف الحساب",
    dangerText:
      "هذا يمسح بياناتك كلها من السحابة نهائياً (التلاميذ، المجموعات، المعلومات) ويغلق حسابك. ما ينجمش يتراجع. نصيحة: اعمل «إخراج البيانات» قبل باش تخزّن نسخة احتياطية.",
    eraseLocal: "امسح كذلك البيانات المخزّنة في الجهاز هذا",
    typeToConfirm: "اكتب DELETE للتأكيد",
    deleteBtn: "حذف حسابي",
    deleting: "جاري الحذف…",
    deleted: "تم حذف الحساب.",
    deleteFail: "ما نجمناش نحذفو الحساب.",
  },
};

var ICON_USER =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.2"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/></svg>';
var ICON_OUT =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M16 8l4 4-4 4M20 12H9"/></svg>';

function t(key) {
  var lang = document.documentElement.lang === "ar" ? "ar" : "en";
  return STR[lang][key];
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readIds(uid) {
  try {
    return new Set(JSON.parse(window.localStorage.getItem(idsKey(uid)) || "[]"));
  } catch (e) {
    return new Set();
  }
}

async function loadSdk() {
  var mods = await Promise.all([
    import(SDK_BASE + "firebase-app.js"),
    import(SDK_BASE + "firebase-auth.js"),
    import(SDK_BASE + "firebase-firestore.js"),
  ]);
  return Object.assign({}, mods[0], mods[1], mods[2]);
}

async function main() {
  var mount = document.getElementById("cloudSync");
  var app = window.ClassLedgerApp;
  var cfg = window.CLASSLEDGER_FIREBASE_CONFIG;
  var configured =
    cfg &&
    cfg.apiKey &&
    cfg.projectId &&
    !/^PASTE/i.test(cfg.apiKey) &&
    !/^PASTE/i.test(cfg.projectId);
  if (!mount || !app || !configured) return; // stay local-only

  var sdk;
  try {
    // __CLASSLEDGER_TEST_SDK__ lets the tests plug in a fake Firebase
    sdk = window.__CLASSLEDGER_TEST_SDK__ || (await loadSdk());
  } catch (e) {
    console.warn("ClassLedger cloud sync unavailable:", e);
    return;
  }

  var fbApp = sdk.initializeApp(cfg);
  var auth = sdk.getAuth(fbApp);
  var db;
  try {
    db = sdk.initializeFirestore(fbApp, {
      localCache: sdk.persistentLocalCache({
        tabManager: sdk.persistentMultipleTabManager(),
      }),
    });
  } catch (e) {
    db = sdk.getFirestore(fbApp);
  }

  var user = null;
  var sync = null;
  var authReady = false;

  /* ---------------- UI ---------------- */
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }
  function button(label, icon, onClick) {
    var b = el("button", "data-transfer-btn");
    b.type = "button";
    var ic = el("span", "data-btn-icon");
    ic.innerHTML = icon; // static, trusted SVG
    b.append(ic, el("span", "", label));
    b.addEventListener("click", onClick);
    return b;
  }
  function currentStatus() {
    if (sync && sync.error) return "error";
    if (!window.navigator.onLine) return "offline";
    if (!sync || !sync.reconciled || sync.inflight > 0) return "syncing";
    return "synced";
  }
  var lastAccountKey = "";
  function syncAccountInfo() {
    // tells the Profile page who is signed in (photo, email)
    // profileReady: the cloud's copy of the details has arrived, so editing can't overwrite it with a stale one
    var info = user
      ? {
          email: user.email || "",
          photoURL: user.photoURL || "",
          displayName: user.displayName || "",
          profileReady: !!(sync && sync.profileReconciled) || !window.navigator.onLine,
        }
      : null;
    var key = JSON.stringify(info);
    if (key === lastAccountKey) return;
    lastAccountKey = key;
    app.setAccount(info);
  }
  function menuRow(label, icon, onClick, danger) {
    var b = el("button", "t-menu-item" + (danger ? " is-danger" : ""));
    b.type = "button";
    b.setAttribute("role", "menuitem");
    var ic = el("span", "t-menu-ic");
    ic.innerHTML = icon; // static, trusted SVG
    b.append(ic, el("span", "", label));
    b.addEventListener("click", function () {
      closeTeacherMenu();
      onClick();
    });
    return b;
  }
  var tUser = document.getElementById("tUser");
  var tMenu = document.getElementById("tMenu");
  var tWrap = document.getElementById("tUserWrap");
  function closeTeacherMenu() {
    if (!tMenu) return;
    tMenu.hidden = true;
    tUser.setAttribute("aria-expanded", "false");
  }
  function openTeacherMenu() {
    // fixed position, computed from the avatar: the top bar scrolls sideways on phones and would clip a normal dropdown
    var r = tUser.getBoundingClientRect();
    tMenu.hidden = false;
    tMenu.style.top = Math.round(r.bottom + 10) + "px";
    var rtl = document.documentElement.dir === "rtl";
    tMenu.style.left = rtl ? Math.max(8, Math.round(r.left)) + "px" : "auto";
    tMenu.style.right = rtl ? "auto" : Math.max(8, Math.round(window.innerWidth - r.right)) + "px";
    tUser.setAttribute("aria-expanded", "true");
  }
  if (tUser && tMenu) {
    tUser.addEventListener("click", function () {
      if (tMenu.hidden) openTeacherMenu();
      else closeTeacherMenu();
    });
    document.addEventListener("click", function (e) {
      if (!tMenu.hidden && !e.target.closest("#tUserWrap")) closeTeacherMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !tMenu.hidden) {
        closeTeacherMenu();
        tUser.focus();
      }
    });
    window.addEventListener("resize", closeTeacherMenu);
  }
  function paintTeacherAvatar(shownName) {
    if (!tUser) return;
    tUser.textContent = "";
    tUser.title = t("account");
    tUser.setAttribute("aria-label", t("account"));
    if (user && user.photoURL) {
      var img = el("img");
      img.alt = "";
      img.referrerPolicy = "no-referrer";
      img.src = user.photoURL;
      tUser.append(img);
    } else if (user && shownName) {
      tUser.append(el("span", "t-initial", shownName.charAt(0).toUpperCase()));
    } else {
      var ic = el("span", "t-initial");
      ic.innerHTML = ICON_USER; // static, trusted SVG
      tUser.append(ic);
    }
  }
  function render() {
    if (!authReady) return;
    syncAccountInfo();
    mount.hidden = false;
    if (tWrap) tWrap.hidden = false;
    mount.textContent = "";
    if (!user) {
      paintTeacherAvatar("");
      var row = el("div", "cloud-actions");
      row.append(
        menuRow(t("signIn"), ICON_USER, function () {
          signIn(false);
        }),
      );
      mount.append(el("p", "cloud-hint", t("hint")), row);
      return;
    }
    var own = app.getProfile();
    var shownName =
      [own.firstName, own.lastName].filter(Boolean).join(" ") || user.displayName || user.email || "";
    paintTeacherAvatar(shownName);
    var account = el("div", "cloud-account");
    if (user.photoURL) {
      var img = el("img", "cloud-avatar");
      img.alt = "";
      img.referrerPolicy = "no-referrer";
      img.src = user.photoURL;
      account.append(img);
    }
    account.append(el("span", "cloud-email", shownName));
    var status = currentStatus();
    var actions = el("div", "cloud-actions");
    actions.append(
      menuRow(t("account"), ICON_USER, function () {
        app.openProfile();
      }),
      menuRow(
        t("signOut"),
        ICON_OUT,
        function () {
          sdk.signOut(auth);
        },
        true,
      ),
    );
    mount.append(
      account,
      el("span", "cloud-status is-" + status, t("status_" + status)),
      actions,
      buildDeleteSection(),
    );
  }

  /* ---------------- delete account (collapsed section in the cloud block) ---------------- */
  var acctUi = { open: false, erase: false, text: "" }; // survives re-renders caused by sync status changes
  function buildDeleteSection() {
    var details = el("details", "acct-details");
    details.open = acctUi.open;
    details.addEventListener("toggle", function () {
      acctUi.open = details.open;
    });
    details.append(el("summary", "acct-summary", t("dangerTitle")));
    var danger = el("div", "acct-danger");
    danger.append(el("p", "acct-danger-text", t("dangerText")));
    var eraseWrap = el("label", "acct-check");
    var erase = el("input");
    erase.type = "checkbox";
    erase.checked = acctUi.erase;
    erase.addEventListener("change", function () {
      acctUi.erase = erase.checked;
    });
    eraseWrap.append(erase, el("span", "", t("eraseLocal")));
    var confirmWrap = el("label", "acct-field");
    confirmWrap.append(el("span", "acct-label", t("typeToConfirm")));
    var confirmInput = el("input", "acct-input");
    confirmInput.type = "text";
    confirmInput.autocomplete = "off";
    confirmInput.setAttribute("dir", "ltr");
    confirmInput.maxLength = 10;
    confirmInput.value = acctUi.text;
    confirmWrap.append(confirmInput);
    var del = el("button", "acct-delete", t("deleteBtn"));
    del.type = "button";
    del.disabled = acctUi.text.trim() !== "DELETE";
    confirmInput.addEventListener("input", function () {
      acctUi.text = confirmInput.value;
      del.disabled = confirmInput.value.trim() !== "DELETE";
    });
    del.addEventListener("click", function () {
      deleteAccount(erase.checked, del);
    });
    danger.append(eraseWrap, confirmWrap, del);
    details.append(danger);
    return details;
  }

  async function deleteAccount(eraseLocal, delBtn) {
    var u = auth.currentUser;
    if (!u) return;
    var label = delBtn.textContent;
    function restore() {
      delBtn.disabled = false;
      delBtn.textContent = label;
    }
    delBtn.disabled = true;
    delBtn.textContent = t("deleting");
    // deleting an account is a sensitive action: Google asks the person to sign in again
    try {
      await sdk.reauthenticateWithPopup(u, new sdk.GoogleAuthProvider());
    } catch (err) {
      restore();
      var rc = err && err.code;
      if (rc !== "auth/popup-closed-by-user" && rc !== "auth/cancelled-popup-request")
        app.toast(t("deleteFail") + (rc ? " (" + rc + ")" : ""), true);
      return;
    }
    var uid = u.uid;
    stopSync(); // stop listening and pushing, otherwise the sync would re-upload what we delete
    try {
      var snap = await sdk.getDocs(sdk.collection(db, "users", uid, "students"));
      var refs = snap.docs
        .map(function (d) {
          return d.ref;
        })
        .concat([
          sdk.doc(db, "users", uid, "meta", "groups"),
          sdk.doc(db, "users", uid, "meta", "profile"),
          sdk.doc(db, "users", uid, "meta", "account"),
        ]);
      for (var i = 0; i < refs.length; i += 400) {
        var batch = sdk.writeBatch(db);
        refs.slice(i, i + 400).forEach(function (ref) {
          batch.delete(ref);
        });
        await batch.commit();
      }
      await sdk.deleteUser(u);
    } catch (err2) {
      restore();
      var code = err2 && err2.code;
      app.toast(t("deleteFail") + (code ? " (" + code + ")" : ""), true);
      if (auth.currentUser) startSync(auth.currentUser); // nothing is lost: resume syncing
      render();
      return;
    }
    try {
      window.localStorage.removeItem(UID_KEY);
      window.localStorage.removeItem(idsKey(uid));
    } catch (e) {}
    if (eraseLocal) {
      app.applyRemote({ replaceAll: true });
      app.setProfile({}, { silent: true, forget: true });
    }
    acctUi.open = false;
    acctUi.erase = false;
    acctUi.text = "";
    app.toast(t("deleted"), false, null, "info");
    render();
  }

  /* ---------------- auth ---------------- */
  var pendingCreate = null; // details typed in the "Create account" form, kept through an account switch
  async function signIn(creating) {
    var provider = new sdk.GoogleAuthProvider();
    pendingCreate = creating ? app.getProfile() : null;
    try {
      var result = await sdk.signInWithPopup(auth, provider);
      var isNew = false;
      try {
        var extra = sdk.getAdditionalUserInfo && sdk.getAdditionalUserInfo(result);
        isNew = !!(extra && extra.isNewUser);
      } catch (e) {}
      app.toast(
        creating ? (isNew ? t("accountCreated") : t("accountExists")) : t("signedIn"),
        false,
        null,
        "info",
      );
    } catch (err) {
      var code = err && err.code;
      if (
        code === "auth/popup-blocked" ||
        code === "auth/operation-not-supported-in-this-environment"
      ) {
        try {
          await sdk.signInWithRedirect(auth, provider);
          pendingCreate = null;
          return;
        } catch (err2) {
          err = err2;
          code = err2 && err2.code;
        }
      }
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        pendingCreate = null;
        return;
      }
      app.toast(
        code === "auth/unauthorized-domain"
          ? t("domainHint")
          : t("signInFail") + (code ? " (" + code + ")" : ""),
        true,
      );
    }
    pendingCreate = null;
  }

  function stopSync() {
    if (sync) {
      clearTimeout(sync.timer);
      sync.unsubs.forEach(function (unsub) {
        try {
          unsub();
        } catch (e) {}
      });
    }
    sync = null;
    user = null;
  }

  function startSync(u) {
    stopSync();
    var prevUid = window.localStorage.getItem(UID_KEY);
    if (prevUid && prevUid !== u.uid) {
      // this device still holds another account's data: never mix it into this account
      if (!window.confirm(t("switchAccount"))) {
        sdk.signOut(auth);
        return;
      }
      app.applyRemote({ replaceAll: true });
      app.setProfile(pendingCreate || {}, { silent: true, forget: !pendingCreate }); // the old account's details stay out; the ones just typed stay in
    }
    window.localStorage.setItem(UID_KEY, u.uid);
    user = u;
    sync = {
      uid: u.uid,
      studentsCol: sdk.collection(db, "users", u.uid, "students"),
      groupsRef: sdk.doc(db, "users", u.uid, "meta", "groups"),
      profileRef: sdk.doc(db, "users", u.uid, "meta", "profile"),
      lastProfile: null, // stable string of the profile last known in the cloud
      profileReconciled: false, // the server has answered for the profile
      lastSynced: new Map(), // student id -> stable string last known in the cloud
      lastGroups: null, // stable string of the groups last known in the cloud
      previousIds: readIds(u.uid), // students this device had synced in an earlier visit
      localDirty: false, // true while edits made on this device are waiting to be pushed
      gotStudents: false,
      gotGroups: false,
      reconciled: false, // first answer from the server for students
      groupsReconciled: false, // first answer from the server for groups
      inflight: 0,
      error: null,
      timer: null,
      unsubs: [],
    };
    var current = sync;
    current.unsubs.push(
      sdk.onSnapshot(current.studentsCol, { includeMetadataChanges: true }, onStudents, onSyncError),
      sdk.onSnapshot(current.groupsRef, { includeMetadataChanges: true }, onGroups, onSyncError),
      sdk.onSnapshot(current.profileRef, { includeMetadataChanges: true }, onProfile, onSyncError),
    );
  }

  function persistIds() {
    // before the server has answered, lastSynced may be a partial cache: don't overwrite the record
    if (!sync || !sync.reconciled) return;
    try {
      window.localStorage.setItem(
        idsKey(sync.uid),
        JSON.stringify(Array.from(sync.lastSynced.keys())),
      );
    } catch (e) {}
  }

  /* ---------------- cloud -> device ---------------- */
  function onStudents(snap) {
    if (!sync) return;
    sync.gotStudents = true;
    var upserts = [];
    var removed = [];
    snap.docChanges().forEach(function (change) {
      var id = change.doc.id;
      if (change.type === "removed") {
        sync.lastSynced.delete(id);
        removed.push(id);
        return;
      }
      var student = Object.assign({}, change.doc.data(), { id: id });
      var str = stableStringify(student);
      if (sync.lastSynced.get(id) === str) return; // echo of our own write
      sync.lastSynced.set(id, str);
      upserts.push(student);
    });

    var local = app.getSnapshot().students;
    if (!sync.reconciled && !snap.metadata.fromCache) {
      sync.reconciled = true;
      // students this device synced before but the cloud no longer has were deleted elsewhere
      var cloudIds = new Set(
        snap.docs.map(function (d) {
          return d.id;
        }),
      );
      local.forEach(function (s) {
        if (
          !cloudIds.has(s.id) &&
          sync.previousIds.has(s.id) &&
          removed.indexOf(s.id) === -1
        )
          removed.push(s.id);
      });
    }
    var localIds = new Set(
      local.map(function (s) {
        return s.id;
      }),
    );
    removed = removed.filter(function (id) {
      return localIds.has(id);
    });

    if (upserts.length || removed.length)
      app.applyRemote({ upsertStudents: upserts, removeStudentIds: removed });
    persistIds();
    sync.error = null;
    render();
    schedulePush(0);
  }

  function onGroups(snap) {
    if (!sync) return;
    sync.gotGroups = true;
    var items = snap.exists() ? snap.data().items || [] : null;
    if (items) {
      var str = stableStringify(items);
      if (str !== sync.lastGroups) {
        var next = items;
        // keep this device's own groups until the server has answered, or while edits are waiting
        if ((!sync.groupsReconciled && !snap.metadata.fromCache) || sync.localDirty) {
          next = mergeGroups(items, app.getSnapshot().groups);
        }
        sync.lastGroups = str;
        app.applyRemote({ groups: next });
      }
    }
    if (!snap.metadata.fromCache) sync.groupsReconciled = true;
    sync.error = null;
    render();
    schedulePush(0);
  }

  function hasProfile(p) {
    return !!(p && (p.firstName || p.lastName || p.gender || p.phone || p.subject));
  }
  function onProfile(snap) {
    if (!sync) return;
    if (!snap.metadata.fromCache) sync.profileReconciled = true;
    if (snap.exists()) {
      var data = snap.data();
      var p = app.normalizeProfile(data); // also understands the older single "name" field
      var str = stableStringify(p);
      if (str !== sync.lastProfile) {
        sync.lastProfile = str; // also stops our own write from echoing back
        app.setProfile(p, { silent: true });
      }
    } else if (!snap.metadata.fromCache) {
      pushProfile(); // first sign-in: upload the details already typed on this device
    }
    render();
  }
  function pushProfile() {
    var current = sync;
    if (!current) return;
    var p = app.getProfile();
    var str = stableStringify(p);
    if (str === current.lastProfile) return;
    if (current.lastProfile === null && !hasProfile(p)) return;
    // online: never write before the cloud's copy has been read (a stale copy must not replace it)
    if (window.navigator.onLine && !current.profileReconciled) return;
    current.lastProfile = str;
    sdk
      .setDoc(current.profileRef, Object.assign({}, p, { updatedAt: sdk.serverTimestamp() }))
      .catch(function (err) {
        if (sync !== current) return;
        current.lastProfile = null;
        onSyncError(err);
      });
  }

  function onSyncError(err) {
    if (!sync) return;
    sync.error = err;
    if (err && err.code === "permission-denied") app.toast(t("rulesHint"), true, t("saveFailTitle"));
    render();
  }

  /* ---------------- device -> cloud ---------------- */
  function schedulePush(delay) {
    if (!sync) return;
    clearTimeout(sync.timer);
    sync.timer = setTimeout(pushNow, delay);
  }

  function pushNow() {
    var current = sync;
    if (!current) return;
    current.timer = null;
    if (!current.gotStudents || !current.gotGroups) return; // wait for the cloud's first answer
    // While online, wait until the server (not just the local cache) has answered for both,
    // so a stale copy on this device can never overwrite newer data.
    if (window.navigator.onLine && !(current.reconciled && current.groupsReconciled)) return;
    current.localDirty = false;

    var snapshot = app.getSnapshot();
    var diff = diffStudents(current.lastSynced, snapshot.students);
    var groups = clone(snapshot.groups);
    var groupsStr = stableStringify(groups);
    var pushGroups =
      groupsStr !== current.lastGroups && !(groups.length === 0 && current.lastGroups === null);
    if (!diff.upserts.length && !diff.deletes.length && !pushGroups) return;

    var batches = [];
    var batch = sdk.writeBatch(db);
    var count = 0;
    function add(fn) {
      fn(batch);
      if (++count >= 400) {
        batches.push(batch);
        batch = sdk.writeBatch(db);
        count = 0;
      }
    }
    diff.upserts.forEach(function (student) {
      add(function (b) {
        b.set(sdk.doc(current.studentsCol, student.id), clone(student));
      });
    });
    diff.deletes.forEach(function (id) {
      add(function (b) {
        b.delete(sdk.doc(current.studentsCol, id));
      });
    });
    if (pushGroups) {
      add(function (b) {
        b.set(current.groupsRef, { items: groups, updatedAt: sdk.serverTimestamp() });
      });
    }
    if (count > 0) batches.push(batch);

    // remember the new state now: Firestore queues the writes even while offline
    current.lastSynced = diff.nextSynced;
    if (pushGroups) current.lastGroups = groupsStr;
    persistIds();
    current.inflight += batches.length;
    render();
    batches.forEach(function (b) {
      b.commit().then(
        function () {
          if (sync !== current) return;
          current.inflight--;
          current.error = null;
          render();
        },
        function (err) {
          if (sync !== current) return;
          current.inflight--;
          current.error = err;
          // forget what we thought was saved so the next change uploads everything again
          current.lastSynced = new Map();
          current.lastGroups = null;
          app.toast(t("saveFail"), true, t("saveFailTitle"));
          render();
        },
      );
    });
  }

  /* ---------------- wiring ---------------- */
  window.addEventListener("classledger:data-changed", function () {
    if (sync) sync.localDirty = true;
    schedulePush(PUSH_DELAY_MS);
  });
  window.addEventListener("classledger:profile-changed", function () {
    pushProfile();
    render();
  });
  window.addEventListener("classledger:profile-applied", render);
  window.addEventListener("online", function () {
    render();
    schedulePush(0);
  });
  window.addEventListener("offline", render);
  if (typeof MutationObserver === "function") {
    new MutationObserver(render).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });
  }

  var wasSignedIn = false;
  sdk.onAuthStateChanged(auth, async function (u) {
    if (u) {
      wasSignedIn = true;
      var role = null;
      try {
        var snap = await sdk.getDoc(sdk.doc(db, "users", u.uid, "meta", "account"));
        role = snap.exists() ? snap.data().role : null;
      } catch (e) {}
      if (role === "student") {
        window.location.replace("student");
        return;
      }
    } else if (wasSignedIn) {
      window.location.replace("./");
      return;
    }
    authReady = true;
    if (u) startSync(u);
    else stopSync();
    render();
  });
}

main().catch(function (e) {
  console.warn("ClassLedger cloud sync failed to start:", e);
});
