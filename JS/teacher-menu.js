/* ClassLedger teacher page: phone menu (fixed button + side drawer).
   On phones the nav pills, language switch and account icon of the top bar move into the drawer. */
(function () {
  var btn = document.getElementById("tMenuBtn");
  var drawer = document.getElementById("tDrawer");
  var scrim = document.getElementById("tScrim");
  var closeBtn = document.getElementById("tDrawerClose");
  var slot = document.getElementById("tDrawerSlot");
  var mount = document.getElementById("cloudSync");
  var popover = document.getElementById("tMenu");
  var dLang = document.getElementById("tDrawerLang");
  if (!btn || !drawer) return;
  var mq = window.matchMedia("(max-width: 720px)");
  var root = document.documentElement;

  function isOpen() {
    return root.classList.contains("t-drawer-open");
  }
  function labels() {
    Array.prototype.forEach.call(drawer.querySelectorAll("[data-from]"), function (sp) {
      var src = document.getElementById(sp.dataset.from);
      if (src) sp.textContent = src.textContent;
    });
    var ar = root.lang === "ar";
    document.getElementById("tDrawerLangLabel").textContent = ar ? "اللغة" : "Language";
    btn.setAttribute("aria-label", ar ? "القائمة" : "Menu");
    closeBtn.setAttribute("aria-label", ar ? "إغلاق" : "Close");
    Array.prototype.forEach.call(dLang.querySelectorAll(".lang-btn"), function (b) {
      b.classList.toggle("active", b.dataset.lang === (ar ? "ar" : "en"));
    });
  }
  function open() {
    if (!mq.matches) return;
    labels();
    drawer.removeAttribute("inert");
    root.classList.add("t-drawer-open");
    btn.setAttribute("aria-expanded", "true");
    closeBtn.focus({ preventScroll: true });
  }
  function close() {
    root.classList.remove("t-drawer-open");
    btn.setAttribute("aria-expanded", "false");
    drawer.setAttribute("inert", "");
  }
  function place() {
    // the account block lives in the drawer on phones and in the avatar popover elsewhere
    if (!mount) return;
    if (mq.matches) {
      slot.append(mount);
    } else {
      if (popover) popover.append(mount);
      close();
    }
  }
  btn.addEventListener("click", function () {
    if (isOpen()) close();
    else open();
  });
  closeBtn.addEventListener("click", close);
  scrim.addEventListener("click", close);
  drawer.querySelector(".t-drawer-nav").addEventListener("click", close);
  document.addEventListener("classledger:menu-pick", close);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) close();
  });
  dLang.addEventListener("click", function (e) {
    var b = e.target.closest(".lang-btn");
    if (!b) return;
    var real = document.querySelector('#langSwitch .lang-btn[data-lang="' + b.dataset.lang + '"]');
    if (real) real.click();
    labels();
  });
  if (typeof MutationObserver === "function") {
    new MutationObserver(labels).observe(root, { attributes: true, attributeFilter: ["lang"] });
  }
  if (mq.addEventListener) mq.addEventListener("change", place);
  else if (mq.addListener) mq.addListener(place);
  place();
  labels();
})();
