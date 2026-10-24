/* Classek study cycle: pure helpers (no DOM, no Firebase), so they can be tested alone.
   A "study day" is a calendar day (Tunisia time) on which the student finished at least one exercise.
   After 7 study days (not necessarily in a row) the weekly bilan is ready; once it is taken the count starts again. */

export var CYCLE_DAYS = 7;
export var RECENT_KEEP = 14; // study dates kept across cycles, only to mark the calendar strip
var CHAP_KEEP = 40;

// "YYYY-MM-DD" in Tunisia time, whatever the device clock says
export function tunisDate(now) {
  var d = now || new Date();
  try {
    var s = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Tunis", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  } catch (e) {}
  var p = function (n) {
    return (n < 10 ? "0" : "") + n;
  };
  return d.getUTCFullYear() + "-" + p(d.getUTCMonth() + 1) + "-" + p(d.getUTCDate());
}

export function emptyCycle(no) {
  return { no: no || 1, days: [], chapters: {}, recent: [] };
}

function isDate(s) {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

// whatever came from the cloud becomes a safe cycle object
export function normalizeCycle(raw) {
  var c = emptyCycle(raw && Number(raw.no) > 0 ? Math.floor(Number(raw.no)) : 1);
  if (!raw) return c;
  if (Array.isArray(raw.days)) {
    raw.days.forEach(function (d) {
      if (isDate(d) && c.days.indexOf(d) < 0 && c.days.length < CYCLE_DAYS) c.days.push(d);
    });
    c.days.sort();
  }
  if (raw.chapters && typeof raw.chapters === "object") {
    Object.keys(raw.chapters)
      .slice(0, CHAP_KEEP)
      .forEach(function (k) {
        var n = Number(raw.chapters[k]);
        if (n > 0) c.chapters[k] = Math.floor(n);
      });
  }
  if (Array.isArray(raw.recent)) {
    raw.recent.forEach(function (d) {
      if (isDate(d) && c.recent.indexOf(d) < 0) c.recent.push(d);
    });
    c.recent.sort();
    c.recent = c.recent.slice(-RECENT_KEEP);
  }
  return c;
}

export function isReady(c) {
  return !!c && c.days.length >= CYCLE_DAYS;
}

/* An exercise was just finished on `date` in chapter `chId`.
   Returns { cycle, changed, newDay, becameReady }; the input is never modified. */
export function countDay(cycle, date, chId) {
  var c = normalizeCycle(cycle);
  var changed = false;
  var newDay = false;
  var becameReady = false;
  if (chId && Object.keys(c.chapters).length < CHAP_KEEP + 1) {
    c.chapters[chId] = (c.chapters[chId] || 0) + 1;
    changed = true;
  }
  if (isDate(date) && c.recent.indexOf(date) < 0) {
    c.recent.push(date);
    c.recent.sort();
    c.recent = c.recent.slice(-RECENT_KEEP);
    changed = true;
  }
  if (isDate(date) && c.days.indexOf(date) < 0 && c.days.length < CYCLE_DAYS) {
    c.days.push(date);
    c.days.sort();
    newDay = true;
    changed = true;
    becameReady = c.days.length >= CYCLE_DAYS;
  }
  return { cycle: c, changed: changed, newDay: newDay, becameReady: becameReady };
}

// after a bilan: day count back to zero, same recent dates, next cycle number
export function resetCycle(cycle) {
  var c = normalizeCycle(cycle);
  var next = emptyCycle(c.no + 1);
  next.recent = c.recent.slice();
  return next;
}

export function studiedDates(cycle) {
  var c = normalizeCycle(cycle);
  var out = {};
  c.days.concat(c.recent).forEach(function (d) {
    out[d] = true;
  });
  return out;
}

function shuffleCopy(list, rand) {
  var a = list.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(rand() * (i + 1));
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

/* Choose the bilan questions.
   opts: { touched: [chapterId], others: [chapterId], banks: { chapterId: [question] }, avoid: { questionId: true }, n, rand }
   Mostly the chapters worked on this cycle, plus a couple from older chapters the student already started (is it still there?).
   Questions the student did not see in the last bilan come first. Every returned question carries _chap. */
export function pickBilan(opts) {
  var n = opts.n || 10;
  var rand = opts.rand || Math.random;
  var avoid = opts.avoid || {};
  var banks = opts.banks || {};
  function pool(id) {
    var all = (banks[id] || []).filter(function (q) {
      return q && q.id && Array.isArray(q.choices) && typeof q.answer === "number";
    });
    var fresh = shuffleCopy(
      all.filter(function (q) {
        return !avoid[q.id];
      }),
      rand,
    );
    var old = shuffleCopy(
      all.filter(function (q) {
        return avoid[q.id];
      }),
      rand,
    );
    return fresh.concat(old);
  }
  var touched = (opts.touched || []).filter(function (id) {
    return (banks[id] || []).length;
  });
  var others = (opts.others || []).filter(function (id) {
    return touched.indexOf(id) < 0 && (banks[id] || []).length;
  });
  var reviewN = touched.length && others.length ? Math.min(2, Math.floor(n * 0.2)) : 0;
  var mainIds = touched.length ? touched : others;
  var pools = {};
  mainIds.concat(touched.length ? others : []).forEach(function (id) {
    pools[id] = pool(id);
  });
  var chosen = [];
  function take(ids, count) {
    var got = 0;
    var guard = 0;
    while (got < count && guard++ < 500) {
      var any = false;
      for (var i = 0; i < ids.length && got < count; i++) {
        var q = pools[ids[i]].shift();
        if (q) {
          chosen.push(Object.assign({}, q, { _chap: ids[i] }));
          got++;
          any = true;
        }
      }
      if (!any) break;
    }
  }
  take(mainIds, n - reviewN);
  if (reviewN) take(shuffleCopy(others, rand), reviewN);
  if (chosen.length < n) take(mainIds.concat(touched.length ? others : []), n - chosen.length); // leftovers fill the gaps
  var tie = {};
  chosen.forEach(function (q) {
    tie[q.id] = rand();
  });
  chosen.sort(function (a, b) {
    return (a.d || 2) - (b.d || 2) || tie[a.id] - tie[b.id];
  });
  return chosen;
}

// per chapter { correct, total } from a list of questions and the picks
export function scoreByChapter(qs, picks) {
  var domains = {};
  var right = 0;
  qs.forEach(function (q) {
    var k = q._chap || "mix";
    var d = domains[k] || (domains[k] = { correct: 0, total: 0 });
    d.total++;
    if (picks[q.id] === q.answer) {
      d.correct++;
      right++;
    }
  });
  return { correct: right, total: qs.length, domains: domains };
}

// compare with the previous bilan: whole-score change in points (null when there is nothing to compare)
export function deltaPoints(cur, prev) {
  if (!prev || !prev.total || !cur || !cur.total) return null;
  return Math.round((cur.correct / cur.total - prev.correct / prev.total) * 100);
}

// keep the saved history small and safe
export function normalizeBilans(raw) {
  var items = raw && Array.isArray(raw.items) ? raw.items : [];
  return {
    items: items
      .filter(function (it) {
        return it && typeof it === "object" && Number(it.total) > 0;
      })
      .slice(-12),
  };
}
