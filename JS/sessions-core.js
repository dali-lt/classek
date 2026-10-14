/* Pure helpers for "where you're signed in" (no Firebase, no DOM), so they can be tested alone.

   One document per browser, at users/{uid}/sessions/{sid}:
     type      "phone" | "tablet" | "computer"
     os        "Android", "Windows"...      browser  "Chrome", "Safari"...
     city, country, code                    approximate place (never the IP address itself)
     createdAt, lastActive                  Firestore timestamps
     revoked, revokedAt                     set by another device that asked this one to sign out */

export var ACTIVE_NOW_MS = 15 * 60 * 1000; // heartbeat is every 10 min, so 15 min = "active now"
export var STALE_MS = 60 * 24 * 60 * 60 * 1000; // devices silent for 60 days are tidied away
export var MAX_SHOWN = 10;

var TYPES = ["phone", "tablet", "computer"];

/* Firestore Timestamp | {seconds} | Date | number | null  ->  milliseconds (null = not known yet) */
export function toMillis(v) {
  if (v == null) return null;
  if (typeof v === "number") return isFinite(v) ? v : null;
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v.getTime();
  if (typeof v.toMillis === "function") return v.toMillis();
  if (typeof v.seconds === "number") return v.seconds * 1000 + Math.round((v.nanoseconds || 0) / 1e6);
  return null;
}

function cleanText(v, max) {
  return typeof v === "string" ? v.replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, max) : "";
}

/* ---------------- what kind of device is this? ----------------
   ua    = navigator.userAgent
   hints = { maxTouchPoints, mobile (userAgentData.mobile), brave (!!navigator.brave) } */
export function parseDevice(ua, hints) {
  ua = String(ua || "");
  hints = hints || {};
  var touch = hints.maxTouchPoints || 0;

  // order matters: Android and iPhone user agents also contain "Linux" / "Mac OS X"
  var os = "";
  if (/Windows Phone/i.test(ua)) os = "Windows Phone";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPod/i.test(ua)) os = "iOS";
  else if (/iPad/i.test(ua)) os = "iPadOS";
  else if (/Macintosh|Mac OS X/i.test(ua)) os = touch > 1 ? "iPadOS" : "macOS"; // iPadOS 13+ says "Macintosh"
  else if (/CrOS/i.test(ua)) os = "ChromeOS";
  else if (/Windows/i.test(ua)) os = "Windows";
  else if (/Linux|X11/i.test(ua)) os = "Linux";

  var type = "computer";
  if (os === "iPadOS") type = "tablet";
  else if (os === "iOS" || os === "Windows Phone") type = "phone";
  else if (os === "Android") type = /Mobile/i.test(ua) ? "phone" : "tablet"; // Android tablets have no "Mobile"
  else if (hints.mobile === true) type = "phone";

  var browser = "";
  if (/FBAN|FBAV/i.test(ua)) browser = "Facebook";
  else if (/Instagram/i.test(ua)) browser = "Instagram";
  else if (/Edg(e|A|iOS)?\//.test(ua)) browser = "Edge";
  else if (/OPR\/|Opera/i.test(ua)) browser = "Opera";
  else if (/SamsungBrowser/i.test(ua)) browser = "Samsung Internet";
  else if (/Vivaldi/i.test(ua)) browser = "Vivaldi";
  else if (/Firefox\/|FxiOS/i.test(ua)) browser = "Firefox";
  else if (hints.brave === true && /Chrome\//i.test(ua)) browser = "Brave"; // Brave hides itself in the user agent
  else if (/CriOS|Chrome\//i.test(ua)) browser = "Chrome";
  else if (/Safari\//i.test(ua) && /Version\//i.test(ua)) browser = "Safari";

  return { type: type, os: os, browser: browser };
}

/* ---------------- approximate place ----------------
   Accepts what the two IP-lookup services return (or our own cached copy)
   and keeps only city, country and country code. The IP address is dropped here. */
export function normalizeGeo(raw) {
  if (!raw || typeof raw !== "object" || raw.success === false) return null;
  var code = cleanText(raw.country_code || raw.code, 2).toUpperCase();
  var out = {
    city: cleanText(raw.city, 60),
    country: cleanText(raw.country || raw.country_name, 60),
    code: /^[A-Z]{2}$/.test(code) ? code : "",
  };
  return out.city || out.country ? out : null;
}

/* "Tunis, Tunisia" (country name follows the interface language when the browser knows it) */
export function placeLabel(s, locale) {
  if (!s || (!s.city && !s.country && !s.code)) return "";
  var country = s.country;
  if (s.code && typeof Intl !== "undefined" && Intl.DisplayNames) {
    try {
      country = new Intl.DisplayNames([locale || "en"], { type: "region" }).of(s.code) || country;
    } catch (e) {}
  }
  if (s.city && country && s.city.toLowerCase() !== String(country).toLowerCase()) return s.city + ", " + country;
  return s.city || country || "";
}

/* ---------------- one stored document -> a safe object to show ---------------- */
export function readSession(id, data) {
  data = data && typeof data === "object" ? data : {};
  return {
    id: String(id),
    type: TYPES.indexOf(data.type) >= 0 ? data.type : "computer",
    os: cleanText(data.os, 30),
    browser: cleanText(data.browser, 30),
    city: cleanText(data.city, 60),
    country: cleanText(data.country, 60),
    code: /^[A-Z]{2}$/.test(String(data.code || "")) ? data.code : "",
    createdAt: toMillis(data.createdAt),
    lastActive: toMillis(data.lastActive),
    revoked: data.revoked === true,
    revokedAt: toMillis(data.revokedAt),
  };
}

/* This device: sign out only if another device asked for it AFTER this device last signed in.
   (Signing in again on purpose is newer than the request, so it must not be undone.) */
export function shouldForceSignOut(session, lastSignInMs) {
  if (!session || session.revoked !== true) return false;
  if (session.revokedAt == null) return true; // request just written, server time not back yet
  if (typeof lastSignInMs !== "number" || isNaN(lastSignInMs)) return true;
  return session.revokedAt > lastSignInMs;
}

/* This device first, then the most recently active */
export function sortSessions(list, mySid) {
  return list.slice().sort(function (a, b) {
    if ((a.id === mySid) !== (b.id === mySid)) return a.id === mySid ? -1 : 1;
    var x = a.lastActive == null ? Infinity : a.lastActive; // "not known yet" = just written = newest
    var y = b.lastActive == null ? Infinity : b.lastActive;
    return y === x ? 0 : y > x ? 1 : -1;
  });
}

/* ids of old devices that can be deleted (never this one) */
export function staleIds(list, mySid, nowMs) {
  return list
    .filter(function (s) {
      return s.id !== mySid && s.lastActive != null && nowMs - s.lastActive > STALE_MS;
    })
    .map(function (s) {
      return s.id;
    });
}

export function isActiveNow(ms, nowMs) {
  return ms == null || nowMs - ms < ACTIVE_NOW_MS;
}

/* "3 hours ago" / "قبل 3 ساعات" / "yesterday"; a plain date after a month */
export function lastSeenLabel(ms, nowMs, locale) {
  if (ms == null) return "";
  var diff = Math.max(0, nowMs - ms);
  var min = Math.floor(diff / 60000);
  var hour = Math.floor(diff / 3600000);
  var day = Math.floor(diff / 86400000);
  if (day >= 30) return new Date(ms).toLocaleDateString(locale || "en-GB", { day: "numeric", month: "short", year: "numeric" });
  var rtf = new Intl.RelativeTimeFormat(locale || "en-GB", { numeric: "auto" });
  if (day >= 1) return rtf.format(-day, "day");
  if (hour >= 1) return rtf.format(-hour, "hour");
  return rtf.format(-Math.max(1, min), "minute");
}
