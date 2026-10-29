// Decorative background: a faint grid and a few squares that light up and fade, each time in another place.
// It is only a decoration (aria-hidden, no pointer events) and it stays out of the way:
//  - prefers-reduced-motion: the grid is drawn but nothing moves;
//  - data-saver, hidden tab: no animation;
//  - few squares on a phone, and only opacity is animated (cheap for the GPU).
(function () {
  if (window.__bgGrid) return;
  window.__bgGrid = true;
  var root = document.documentElement;
  var grid = document.createElement("div");
  grid.className = "bg-grid";
  grid.setAttribute("aria-hidden", "true");
  document.body.insertBefore(grid, document.body.firstChild);

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  var saver = navigator.connection && navigator.connection.saveData;
  var cell = 56;
  var cols = 0;
  var rows = 0;
  var cells = [];

  function rand(n) {
    return Math.floor(Math.random() * n);
  }
  function place(el) {
    el.style.left = rand(cols) * cell + "px";
    el.style.top = rand(rows) * cell + "px";
    el.style.setProperty("--dur", 5 + Math.random() * 5 + "s");
    el.style.setProperty("--delay", Math.random() * 4 + "s");
    el.classList.toggle("is-blue", Math.random() < 0.4);
  }
  function build() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    cell = w < 700 ? 44 : 56;
    grid.style.setProperty("--cell", cell + "px");
    cols = Math.ceil(w / cell);
    rows = Math.ceil(h / cell);
    grid.textContent = "";
    cells = [];
    if ((reduce && reduce.matches) || saver) return; // the grid alone
    var count = Math.min(w < 700 ? 6 : 12, Math.round((cols * rows) / 45));
    for (var i = 0; i < count; i++) {
      var c = document.createElement("span");
      c.className = "bg-grid-cell";
      place(c);
      // when a square has faded away, it comes back somewhere else
      c.addEventListener("animationiteration", function (e) {
        place(e.target);
      });
      grid.append(c);
      cells.push(c);
    }
  }
  var timer = 0;
  window.addEventListener("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(build, 250);
  });
  document.addEventListener("visibilitychange", function () {
    root.classList.toggle("bg-paused", document.hidden); // nothing runs in a background tab
  });
  if (reduce && reduce.addEventListener) reduce.addEventListener("change", build);
  build();
})();
