// weblint.js: finds the mistakes a student makes in HTML, CSS and JavaScript while typing
// (a tag that is never closed, a CSS property that does not exist, a missing bracket...).
// lintWeb(code, lang, ui) -> [{ line, msg }]: line starts at 1, at most one entry per line, sorted. ui is "fr" or "ar".
// Nothing here runs the student's code: JavaScript is only compiled (new Function) to read the syntax errors.

var MSG = {
  fr: {
    tagUnknown: "Balise inconnue : <{a}>{s}",
    tagUnclosed: "Balise <{a}> jamais fermée : il manque </{a}>",
    tagUnclosedBefore: "Balise <{a}> non fermée : il manque </{a}> avant </{b}> (ligne {l})",
    closeNoOpen: "Balise fermante </{a}> sans balise ouvrante",
    tagNotEnded: "Balise <{a}> incomplète : il manque le signe >",
    quoteMissing: "Guillemet fermant manquant dans <{a}>",
    commentOpen: "Commentaire non fermé : il manque {a}",
    jsAttr: "Erreur dans {a} : {b}",
    braceOpen: "Accolade { jamais fermée : il manque }",
    braceClose: "Accolade } en trop : rien à fermer",
    selectorMissing: "Sélecteur manquant avant {",
    declOutside: "Cette déclaration doit être entre { et }",
    colonMissing: "Il manque « : » entre la propriété et sa valeur",
    propUnknown: "Propriété CSS inconnue : {a}{s}",
    valueMissing: "Valeur manquante pour {a}",
    semicolonMissing: "Il manque « ; » à la fin de cette ligne",
    hexBad: "Couleur invalide : {a} (3, 4, 6 ou 8 caractères après #)",
    ruleIncomplete: "Règle incomplète : il manque { }",
    strOpen: "Guillemet fermant manquant",
    closerExtra: "« {a} » en trop : rien à fermer",
    closerMismatch: "« {a} » trouvée, mais « {b} » était attendue (ouverte ligne {l})",
    openerUnclosed: "« {a} » jamais fermée : il manque « {b} »",
    syntax: "Erreur de syntaxe : vérifie les virgules, parenthèses et guillemets",
    synMissingParen: "Il manque une parenthèse « ) » ou une virgule",
    synIdentifier: "Mot inattendu : il manque peut-être une virgule, un opérateur ou un point-virgule avant",
    synString: "Texte inattendu : il manque peut-être un « + » ou une virgule",
    synInvalid: "Caractère invalide (guillemets « » copiés ? symbole étrange ?)",
    synEnd: "Le code s'arrête trop tôt : il manque la suite de l'instruction",
    synNumber: "Nombre inattendu : il manque peut-être un opérateur (+, -, *) ou une virgule avant",
    synToken: "Symbole inattendu sur cette ligne : vérifie ce qui précède (virgule, parenthèse, accolade)",
    didYouMean: " (vouliez-vous écrire « {x} » ?)",
  },
  ar: {
    tagUnknown: "balise ما نعرفهاش : <{a}>{s}",
    tagUnclosed: "Balise <{a}> ما تسكّرتش : ناقص </{a}>",
    tagUnclosedBefore: "Balise <{a}> ما تسكّرتش : ناقص </{a}> قبل </{b}> (السطر {l})",
    closeNoOpen: "سكّرت </{a}> من غير ما تفتح <{a}>",
    tagNotEnded: "Balise <{a}> ناقصها العلامة >",
    quoteMissing: "ناقصة الڤيّمة (guillemet) الي تسكّر في <{a}>",
    commentOpen: "Commentaire ما تسكّرش : ناقص {a}",
    jsAttr: "غلطة في {a} : {b}",
    braceOpen: "Accolade { ما تسكّرتش : ناقصة }",
    braceClose: "Accolade } زايدة : ما فما شيء يتسكّر",
    selectorMissing: "ناقص selector قبل {",
    declOutside: "الـ déclaration هذي لازم تكون بين { و }",
    colonMissing: "ناقصة « : » بين الـ propriété والـ valeur",
    propUnknown: "propriété CSS ما نعرفهاش : {a}{s}",
    valueMissing: "ناقصة valeur لـ {a}",
    semicolonMissing: "ناقصة « ; » في آخر السطر هذا",
    hexBad: "لون غالط : {a} (3 أو 4 أو 6 أو 8 حروف بعد #)",
    ruleIncomplete: "règle ناقصة : ناقص { }",
    strOpen: "ناقصة الڤيّمة (guillemet) الي تسكّر",
    closerExtra: "« {a} » زايدة : ما فما شيء يتسكّر",
    closerMismatch: "لقيت « {a} » أما كنت نستنّى « {b} » (مفتوحة في السطر {l})",
    openerUnclosed: "« {a} » ما تسكّرتش : ناقصة « {b} »",
    syntax: "غلطة syntaxe : شوف الفواصل والأقواس والـ guillemets",
    synMissingParen: "ناقصة قوس « ) » ولا فاصلة",
    synIdentifier: "كلمة في غير بلاصتها : يمكن ناقصة فاصلة ولا opérateur ولا « ; » قبلها",
    synString: "نص في غير بلاصتو : يمكن ناقصة « + » ولا فاصلة",
    synInvalid: "حرف غير صالح (guillemets منسوخة ؟ رمز غريب ؟)",
    synEnd: "الكود وقف بكري : ناقصة بقية الـ instruction",
    synNumber: "رقم في غير بلاصتو : يمكن ناقص opérateur (+ ، - ، *) ولا فاصلة قبلو",
    synToken: "رمز في غير بلاصتو في السطر هذا : شوف اللي قبلو (فاصلة، قوس، accolade)",
    didYouMean: " (تقصد « {x} » ؟)",
  },
};
function say(ui, e) {
  var T = MSG[ui] || MSG.fr;
  var s = (T[e.key] || e.key).replace(/\{(\w)\}/g, function (all, k) {
    return e[k] === undefined ? "" : String(e[k]);
  });
  return s;
}
function suggestion(ui, x) {
  return x ? (MSG[ui] || MSG.fr).didYouMean.replace("{x}", x) : "";
}
function wordSet(list) {
  var o = Object.create(null);
  list.split(" ").forEach(function (w) {
    if (w) o[w] = true;
  });
  return o;
}
function dist(a, b) {
  var prev = [];
  for (var j = 0; j <= b.length; j++) prev[j] = j;
  for (var i = 1; i <= a.length; i++) {
    var cur = [i];
    for (var k = 1; k <= b.length; k++) cur[k] = Math.min(prev[k] + 1, cur[k - 1] + 1, prev[k - 1] + (a[i - 1] === b[k - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}
function closest(word, set) {
  var best = "";
  var bd = 99;
  var lim = word.length >= 7 ? 3 : 2;
  Object.keys(set).forEach(function (k) {
    if (Math.abs(k.length - word.length) > lim) return;
    var d = dist(word, k);
    if (d < bd) {
      bd = d;
      best = k;
    }
  });
  return bd <= lim && bd < word.length ? best : "";
}
function countNl(s) {
  var n = 0;
  for (var i = 0; i < s.length; i++) if (s.charAt(i) === "\n") n++;
  return n;
}

// ---------- HTML ----------
var VOID = wordSet("area base br col embed hr img input link meta param source track wbr");
var AUTO = wordSet("p li dt dd tr td th thead tbody tfoot option optgroup colgroup"); // may be closed by the browser
var SOFT = wordSet("html head body"); // the student may not have reached the end of the page yet
var TAGS = wordSet(
  "html head body title meta link style script noscript base header footer nav main section article aside h1 h2 h3 h4 h5 h6 hgroup " +
    "p div span a img ul ol li dl dt dd table thead tbody tfoot tr th td caption colgroup col form input button select option optgroup " +
    "textarea label fieldset legend datalist output progress meter br hr pre code em strong b i u s small sub sup mark q blockquote cite " +
    "abbr time address figure figcaption video audio source track iframe canvas svg picture map area object embed param details summary " +
    "dialog template slot menu bdi bdo ruby rt rp data kbd samp var wbr del ins center font big strike tt marquee acronym dir frame " +
    "frameset noframes applet basefont search"
);
var SVG = wordSet(
  "svg g path circle rect ellipse line polyline polygon text tspan defs use symbol lineargradient radialgradient stop clippath mask " +
    "pattern image title desc filter fegaussianblur animate animatetransform marker foreignobject"
);

function lintHtml(code, ui) {
  var errs = [];
  var stack = [];
  var segs = [];
  var starts = [0];
  for (var p = code.indexOf("\n"); p >= 0; p = code.indexOf("\n", p + 1)) starts.push(p + 1);
  function lineAt(pos) {
    var lo = 0;
    var hi = starts.length - 1;
    while (lo < hi) {
      var mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= pos) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  }
  var i = 0;
  var n = code.length;
  while (i < n) {
    var lt = code.indexOf("<", i);
    if (lt < 0) break;
    i = lt;
    if (code.substr(i, 4) === "<!--") {
      var ce = code.indexOf("-->", i + 4);
      if (ce < 0) {
        errs.push({ line: lineAt(i), key: "commentOpen", a: "-->" });
        break;
      }
      i = ce + 3;
      continue;
    }
    var nx = code.charAt(i + 1);
    if (nx === "!" || nx === "?") {
      var gt = code.indexOf(">", i);
      i = gt < 0 ? n : gt + 1;
      continue;
    }
    var closing = nx === "/";
    var nm = /^<\/?([A-Za-z][\w:-]*)/.exec(code.substr(i, 80));
    if (!nm) {
      i++; // a lone < in the text
      continue;
    }
    var name = nm[1].toLowerCase();
    var tagLine = lineAt(i);
    var j = i + nm[0].length;
    var q = "";
    var ended = false;
    var broke = "";
    while (j < n) {
      var ch = code.charAt(j);
      if (q) {
        if (ch === q) q = "";
        else if (ch === "<" && /^<\/?([A-Za-z][A-Za-z0-9]*)[\s>\/]/.test(code.substr(j, 40)) && TAGS[RegExp.$1.toLowerCase()]) {
          broke = "quote"; // a new tag starts inside the quotes: the closing quote is missing
          break;
        }
        j++;
        continue;
      }
      if (ch === '"' || ch === "'") {
        q = ch;
        j++;
        continue;
      }
      if (ch === ">") {
        ended = true;
        break;
      }
      if (ch === "<") {
        broke = "gt";
        break;
      }
      j++;
    }
    if (!ended) {
      errs.push({ line: tagLine, key: broke === "gt" ? "tagNotEnded" : "quoteMissing", a: name });
      i = j < n ? j : n;
      continue;
    }
    var inner = code.slice(i + nm[0].length, j);
    var selfClose = /\/\s*$/.test(inner);
    var after = j + 1;
    if (closing) {
      i = after;
      if (VOID[name]) continue;
      var k = stack.length - 1;
      while (k >= 0 && stack[k].name !== name) k--;
      if (k < 0) errs.push({ line: tagLine, key: "closeNoOpen", a: name });
      else {
        for (var m = stack.length - 1; m > k; m--) {
          var it = stack[m];
          if (!AUTO[it.name]) errs.push({ line: it.line, key: "tagUnclosedBefore", a: it.name, b: name, l: tagLine });
        }
        stack.length = k;
      }
      continue;
    }
    var inSvg = name === "svg" || stack.some(function (s) {
      return s.name === "svg";
    });
    if (!TAGS[name] && !(inSvg && SVG[name]) && name.indexOf("-") < 0) {
      errs.push({ line: tagLine, key: "tagUnknown", a: name, s: suggestion(ui, closest(name, TAGS)) });
    }
    // inline handlers (onclick="...") hold JavaScript
    var ar = /\b(on[a-z]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
    var am;
    while ((am = ar.exec(inner))) {
      var js = lintJs(am[2] !== undefined ? am[2] : am[3], 1, ui);
      if (js.length) errs.push({ line: tagLine, key: "jsAttr", a: am[1], b: js[0].msg });
    }
    i = after;
    if (!VOID[name] && !selfClose) stack.push({ name: name, line: tagLine });
    if (name === "style" || name === "script") {
      var end = new RegExp("</" + name + "\\b", "i").exec(code.slice(after));
      var stop = end ? after + end.index : n;
      var body = code.slice(after, stop);
      if (body.trim()) segs.push({ kind: name === "style" ? "css" : "js", code: body, base: lineAt(after) });
      i = stop;
    }
  }
  stack.forEach(function (it) {
    if (!AUTO[it.name] && !SOFT[it.name]) errs.push({ line: it.line, key: "tagUnclosed", a: it.name });
  });
  return { errs: errs, segs: segs };
}

// ---------- CSS ----------
var CSS_PROPS = wordSet(
  "accelerator accent-color additive-symbols align-content align-items align-self alignment-baseline all alt " +
  "anchor-name anchor-scope animation animation-composition animation-delay animation-direction " +
  "animation-duration animation-fill-mode animation-iteration-count animation-name animation-play-state " +
  "animation-range animation-range-end animation-range-start animation-timeline animation-timing-function " +
  "animation-trigger animation-trigger-behavior animation-trigger-exit-range animation-trigger-exit-range-end " +
  "animation-trigger-exit-range-start animation-trigger-range animation-trigger-range-end " +
  "animation-trigger-range-start animation-trigger-timeline app-region appearance ascent-override aspect-ratio " +
  "audio-level azimuth backdrop-filter backface-visibility background background-attachment background-blend-mode " +
  "background-clip background-color background-image background-origin background-position background-position-x " +
  "background-position-y background-repeat background-repeat-x background-repeat-y background-size base-palette " +
  "baseline-shift baseline-source behavior block-ellipsis block-size block-step block-step-align " +
  "block-step-insert block-step-round block-step-size bookmark-label bookmark-level bookmark-state border " +
  "border-block border-block-color border-block-end border-block-end-color border-block-end-style " +
  "border-block-end-width border-block-start border-block-start-color border-block-start-style " +
  "border-block-start-width border-block-style border-block-width border-bottom border-bottom-color " +
  "border-bottom-left-radius border-bottom-right-radius border-bottom-style border-bottom-width border-boundary " +
  "border-collapse border-color border-end-end-radius border-end-start-radius border-image border-image-outset " +
  "border-image-repeat border-image-slice border-image-source border-image-width border-inline " +
  "border-inline-color border-inline-end border-inline-end-color border-inline-end-style border-inline-end-width " +
  "border-inline-start border-inline-start-color border-inline-start-style border-inline-start-width " +
  "border-inline-style border-inline-width border-left border-left-color border-left-style border-left-width " +
  "border-radius border-right border-right-color border-right-style border-right-width border-spacing " +
  "border-start-end-radius border-start-start-radius border-style border-top border-top-color " +
  "border-top-left-radius border-top-right-radius border-top-style border-top-width border-width bottom " +
  "box-decoration-break box-shadow box-sizing box-snap break-after break-before break-inside buffered-rendering " +
  "caption-side caret caret-animation caret-color caret-shape chains clear clip clip-path clip-rule color " +
  "color-adjust color-interpolation color-interpolation-filters color-profile color-rendering color-scheme " +
  "column-count column-fill column-gap column-height column-progression column-rule column-rule-break " +
  "column-rule-color column-rule-outset column-rule-style column-rule-width column-span column-width column-wrap " +
  "columns contain contain-intrinsic-block-size contain-intrinsic-height contain-intrinsic-inline-size " +
  "contain-intrinsic-size contain-intrinsic-width container container-name container-type content " +
  "content-visibility continue counter-increment counter-reset counter-set cue cue-after cue-before cursor cx cy " +
  "d descent-override direction display display-align dominant-baseline dynamic-range-limit elevation empty-cells " +
  "enable-background epub-caption-side epub-hyphens epub-text-combine epub-text-emphasis epub-text-emphasis-color " +
  "epub-text-emphasis-style epub-text-orientation epub-text-transform epub-word-break epub-writing-mode fallback " +
  "field-sizing fill fill-break fill-color fill-image fill-opacity fill-origin fill-position fill-repeat " +
  "fill-rule fill-size filter flex flex-basis flex-direction flex-flow flex-grow flex-shrink flex-wrap float " +
  "float-defer float-offset float-reference flood-color flood-opacity flow flow-from flow-into font font-display " +
  "font-family font-feature-settings font-kerning font-language-override font-optical-sizing font-palette " +
  "font-size font-size-adjust font-stretch font-style font-synthesis font-synthesis-position " +
  "font-synthesis-small-caps font-synthesis-style font-synthesis-weight font-variant font-variant-alternates " +
  "font-variant-caps font-variant-east-asian font-variant-emoji font-variant-ligatures font-variant-numeric " +
  "font-variant-position font-variation-settings font-weight font-width footnote-display footnote-policy " +
  "forced-color-adjust gap glyph-orientation-horizontal glyph-orientation-vertical grid grid-area " +
  "grid-auto-columns grid-auto-flow grid-auto-rows grid-column grid-column-end grid-column-gap grid-column-start " +
  "grid-gap grid-row grid-row-end grid-row-gap grid-row-start grid-template grid-template-areas " +
  "grid-template-columns grid-template-rows hanging-punctuation height hyphenate-character hyphenate-limit-chars " +
  "hyphenate-limit-last hyphenate-limit-lines hyphenate-limit-zone hyphens image-orientation image-rendering " +
  "image-resolution ime-mode inherits initial-letter initial-letter-align initial-letter-wrap initial-value " +
  "inline-size inline-sizing input-format input-security inset inset-area inset-block inset-block-end " +
  "inset-block-start inset-inline inset-inline-end inset-inline-start interactivity interpolate-size isolation " +
  "item-cross item-direction item-flow item-pack item-slack item-track item-wrap justify-content justify-items " +
  "justify-self kerning layout-flow layout-grid layout-grid-char layout-grid-line layout-grid-mode " +
  "layout-grid-type left letter-spacing lighting-color line-break line-clamp line-fit-edge line-gap-override " +
  "line-grid line-height line-height-step line-increment line-padding line-snap list-style list-style-image " +
  "list-style-position list-style-type margin margin-block margin-block-end margin-block-start margin-bottom " +
  "margin-break margin-inline margin-inline-end margin-inline-start margin-left margin-right margin-top " +
  "margin-trim marker marker-end marker-knockout-left marker-knockout-right marker-mid marker-offset " +
  "marker-pattern marker-segment marker-side marker-start marks mask mask-border mask-border-mode " +
  "mask-border-outset mask-border-repeat mask-border-slice mask-border-source mask-border-width mask-clip " +
  "mask-composite mask-image mask-mode mask-origin mask-position mask-position-x mask-position-y mask-repeat " +
  "mask-size mask-source-type mask-type math-depth math-shift math-style max-block-size max-height " +
  "max-inline-size max-lines max-width max-zoom min-block-size min-height min-inline-size min-intrinsic-sizing " +
  "min-width min-zoom mix-blend-mode motion motion-offset motion-path motion-rotation nav-down nav-index nav-left " +
  "nav-right nav-up navigation negative object-fit object-position object-view-box offset offset-anchor " +
  "offset-block-end offset-block-start offset-distance offset-inline-end offset-inline-start offset-path " +
  "offset-position offset-rotate offset-rotation opacity order orientation orphans outline outline-color " +
  "outline-offset outline-style outline-width overflow overflow-anchor overflow-block overflow-clip-margin " +
  "overflow-clip-margin-block overflow-clip-margin-block-end overflow-clip-margin-block-start " +
  "overflow-clip-margin-bottom overflow-clip-margin-inline overflow-clip-margin-inline-end " +
  "overflow-clip-margin-inline-start overflow-clip-margin-left overflow-clip-margin-right " +
  "overflow-clip-margin-top overflow-inline overflow-wrap overflow-x overflow-y overlay override-colors " +
  "overscroll-behavior overscroll-behavior-block overscroll-behavior-inline overscroll-behavior-x " +
  "overscroll-behavior-y pad padding padding-block padding-block-end padding-block-start padding-bottom " +
  "padding-inline padding-inline-end padding-inline-start padding-left padding-right padding-top page " +
  "page-break-after page-break-before page-break-inside page-orientation paint-order pause pause-after " +
  "pause-before pen-action perspective perspective-origin perspective-origin-x perspective-origin-y pitch " +
  "pitch-range place-content place-items place-self play-during pointer-events position position-anchor " +
  "position-area position-try position-try-fallbacks position-try-options position-try-order position-visibility " +
  "prefix print-color-adjust property-name quotes r range reading-flow reading-order region-fragment resize rest " +
  "rest-after rest-before richness right rotate row-gap row-rule row-rule-break row-rule-color row-rule-outset " +
  "row-rule-style row-rule-width ruby-align ruby-merge ruby-overhang ruby-position rule rule-break rule-color " +
  "rule-outset rule-paint-order rule-style rule-width running rx ry scale scroll-behavior scroll-initial-target " +
  "scroll-margin scroll-margin-block scroll-margin-block-end scroll-margin-block-start scroll-margin-bottom " +
  "scroll-margin-inline scroll-margin-inline-end scroll-margin-inline-start scroll-margin-left " +
  "scroll-margin-right scroll-margin-top scroll-marker-group scroll-padding scroll-padding-block " +
  "scroll-padding-block-end scroll-padding-block-start scroll-padding-bottom scroll-padding-inline " +
  "scroll-padding-inline-end scroll-padding-inline-start scroll-padding-left scroll-padding-right " +
  "scroll-padding-top scroll-snap-align scroll-snap-coordinate scroll-snap-destination scroll-snap-margin " +
  "scroll-snap-margin-bottom scroll-snap-margin-left scroll-snap-margin-right scroll-snap-margin-top " +
  "scroll-snap-points-x scroll-snap-points-y scroll-snap-stop scroll-snap-type scroll-snap-type-x " +
  "scroll-snap-type-y scroll-start-target scroll-target-group scroll-timeline scroll-timeline-axis " +
  "scroll-timeline-name scrollbar-arrow-color scrollbar-base-color scrollbar-color scrollbar-dark-shadow-color " +
  "scrollbar-darkshadow-color scrollbar-face-color scrollbar-gutter scrollbar-highlight-color " +
  "scrollbar-shadow-color scrollbar-track-color scrollbar-width scrollbar3d-light-color scrollbar3dlight-color " +
  "shape-image-threshold shape-inside shape-margin shape-outside shape-rendering size size-adjust " +
  "slider-orientation snap-height solid-color solid-opacity spatial-navigation-action spatial-navigation-contain " +
  "spatial-navigation-function speak speak-as speak-header speak-numeral speak-punctuation speech-rate src " +
  "stop-color stop-opacity stress string-set stroke stroke-align stroke-alignment stroke-break stroke-color " +
  "stroke-dash-corner stroke-dash-justify stroke-dashadjust stroke-dasharray stroke-dashcorner stroke-dashoffset " +
  "stroke-image stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-origin stroke-position " +
  "stroke-repeat stroke-size stroke-width suffix supported-color-schemes symbols syntax system tab-size " +
  "table-layout text-align text-align-all text-align-last text-anchor text-autospace text-box text-box-edge " +
  "text-box-trim text-combine-upright text-decoration text-decoration-blink text-decoration-color " +
  "text-decoration-line text-decoration-line-through text-decoration-none text-decoration-overline " +
  "text-decoration-skip text-decoration-skip-box text-decoration-skip-ink text-decoration-skip-inset " +
  "text-decoration-skip-self text-decoration-skip-spaces text-decoration-style text-decoration-thickness " +
  "text-decoration-trim text-decoration-underline text-emphasis text-emphasis-color text-emphasis-position " +
  "text-emphasis-skip text-emphasis-style text-group-align text-indent text-justify text-justify-trim " +
  "text-kashida text-kashida-space text-line-through text-line-through-color text-line-through-mode " +
  "text-line-through-style text-line-through-width text-orientation text-overflow text-overline " +
  "text-overline-color text-overline-mode text-overline-style text-overline-width text-rendering text-shadow " +
  "text-size-adjust text-spacing text-spacing-trim text-transform text-underline text-underline-color " +
  "text-underline-mode text-underline-offset text-underline-position text-underline-style text-underline-width " +
  "text-wrap text-wrap-mode text-wrap-style timeline-scope top touch-action touch-action-delay transform " +
  "transform-box transform-origin transform-origin-x transform-origin-y transform-origin-z transform-style " +
  "transition transition-behavior transition-delay transition-duration transition-property " +
  "transition-timing-function translate types uc-alt-skin uc-skin unicode-bidi unicode-range user-select " +
  "user-zoom vector-effect vertical-align view-timeline view-timeline-axis view-timeline-inset view-timeline-name " +
  "view-transition-class view-transition-group view-transition-name viewport-fill viewport-fill-opacity " +
  "viewport-fit visibility voice-balance voice-duration voice-family voice-pitch voice-range voice-rate " +
  "voice-stress voice-volume volume white-space white-space-collapse white-space-trim widows width will-change " +
  "word-break word-space-transform word-spacing word-wrap wrap-after wrap-before wrap-flow wrap-inside " +
  "wrap-through writing-mode x y z-index zoom "
);
var RULE_AT = /^(media|supports|layer|container|document|scope|starting-style|keyframes|-webkit-keyframes|-moz-keyframes)$/;

function lintCss(code, base, ui) {
  var errs = [];
  var stack = [];
  var cur = "";
  var curLine = 0;
  var line = 1;
  var i = 0;
  var n = code.length;
  function note(key, ln, a, s) {
    errs.push({ line: base + ln - 1, key: key, a: a, s: s });
  }
  function declOne(piece, ln) {
    piece = piece.trim();
    if (!piece) return;
    var depth = 0;
    var q = "";
    var idx = -1;
    for (var k = 0; k < piece.length; k++) {
      var ch = piece.charAt(k);
      if (q) {
        if (ch === q) q = "";
      } else if (ch === '"' || ch === "'") q = ch;
      else if (ch === "(") depth++;
      else if (ch === ")") depth--;
      else if (ch === ":" && depth === 0) {
        idx = k;
        break;
      }
    }
    if (idx < 0) {
      note("colonMissing", ln);
      return;
    }
    var name = piece.slice(0, idx).trim();
    var value = piece.slice(idx + 1).trim();
    var lower = name.toLowerCase();
    if (!/^-{0,2}[A-Za-z][\w-]*$/.test(name)) note("propUnknown", ln, name, "");
    else if (lower.charAt(0) !== "-" && !CSS_PROPS[lower]) note("propUnknown", ln, name, suggestion(ui, closest(lower, CSS_PROPS)));
    else if (!value) note("valueMissing", ln, name);
    else {
      var plain = value.replace(/url\([^)]*\)/gi, "").replace(/"[^"]*"|'[^']*'/g, "");
      var hx = /#([0-9a-fA-F]+)\b/g;
      var hm;
      while ((hm = hx.exec(plain))) {
        if ([3, 4, 6, 8].indexOf(hm[1].length) < 0) {
          note("hexBad", ln, hm[0]);
          break;
        }
      }
    }
  }
  // a declaration, or several that miss their ";" (the next one starts on a new line with "name:")
  function decl(text, ln) {
    var t = text.replace(/^\s+/, "");
    if (!t.trim()) return;
    ln += countNl(text.slice(0, text.length - t.length));
    var re = /\n[ \t]*(-{0,2}[A-Za-z][\w-]*)[ \t]*:(?!:)/g;
    var m;
    var first = true;
    var pieceStart = 0;
    while ((m = re.exec(t))) {
      if (first && /^\s*$/.test(t.slice(0, m.index))) continue;
      var piece = t.slice(pieceStart, m.index);
      var pl = ln + countNl(t.slice(0, pieceStart));
      declOne(piece, pl);
      note("semicolonMissing", pl + countNl(piece));
      pieceStart = m.index + 1;
      first = false;
    }
    declOne(t.slice(pieceStart), ln + countNl(t.slice(0, pieceStart)));
  }
  function top() {
    return stack.length ? stack[stack.length - 1] : null;
  }
  while (i < n) {
    var c = code.charAt(i);
    if (c === "\n") {
      line++;
      cur += c;
      i++;
      continue;
    }
    if (c === "/" && code.charAt(i + 1) === "*") {
      var e = code.indexOf("*/", i + 2);
      var seg = e < 0 ? code.slice(i) : code.slice(i, e + 2);
      line += countNl(seg);
      i = e < 0 ? n : e + 2;
      continue;
    }
    if (c === '"' || c === "'") {
      var s0 = i;
      var sl = line;
      i++;
      var closed = false;
      while (i < n) {
        var d = code.charAt(i);
        if (d === "\\") {
          i += 2;
          continue;
        }
        if (d === c) {
          closed = true;
          i++;
          break;
        }
        if (d === "\n") break;
        i++;
      }
      if (!closed) note("strOpen", sl);
      if (!curLine) curLine = sl;
      cur += code.slice(s0, i);
      continue;
    }
    if (c === "(") {
      var depth = 0;
      var s1 = i;
      var pl2 = line;
      while (i < n) {
        var d2 = code.charAt(i);
        if (d2 === "\n") line++;
        if (d2 === "(") depth++;
        else if (d2 === ")") {
          depth--;
          if (depth === 0) {
            i++;
            break;
          }
        } else if ((d2 === "{" || d2 === "}") && depth === 1 && !/url\(\s*$/i.test(code.slice(Math.max(0, s1 - 5), s1 + 1))) {
          break; // a ( that is never closed: stop at the next brace so the rest is still read
        }
        i++;
      }
      if (!curLine) curLine = pl2;
      cur += code.slice(s1, i);
      continue;
    }
    if (c === "{") {
      var pre = cur.trim();
      var kind = "decl";
      if (!pre) note("selectorMissing", line);
      else if (pre.charAt(0) === "@") {
        var am = /^@([\w-]+)/.exec(pre);
        if (am && RULE_AT.test(am[1].toLowerCase())) kind = "rules";
      }
      stack.push({ kind: kind, line: curLine || line });
      cur = "";
      curLine = 0;
      i++;
      continue;
    }
    if (c === "}") {
      var t0 = top();
      if (!t0) note("braceClose", line);
      else {
        if (t0.kind === "decl") decl(cur, curLine || line);
        else if (cur.trim()) note("ruleIncomplete", curLine || line);
        stack.pop();
      }
      cur = "";
      curLine = 0;
      i++;
      continue;
    }
    if (c === ";") {
      var t1 = top();
      if (t1 && t1.kind === "decl") decl(cur, curLine || line);
      else if (cur.trim() && cur.trim().charAt(0) !== "@") note("declOutside", curLine || line);
      cur = "";
      curLine = 0;
      i++;
      continue;
    }
    if (!curLine && /\S/.test(c)) curLine = line;
    cur += c;
    i++;
  }
  var tl = top();
  if (cur.trim()) {
    if (tl && tl.kind === "decl") decl(cur, curLine || line);
    else if (cur.trim().charAt(0) !== "@") note("ruleIncomplete", curLine || line);
  }
  stack.forEach(function (s) {
    note("braceOpen", s.line);
  });
  return errs;
}

// ---------- JavaScript ----------
var CLOSE = { "(": ")", "[": "]", "{": "}" };
var REGEX_AFTER = wordSet("return typeof case in of delete void throw new do else");

// brackets, quotes and comments: where a bracket is missing or in excess
function scanJs(code) {
  var errs = [];
  var stack = [];
  var line = 1;
  var i = 0;
  var n = code.length;
  var prev = "";
  while (i < n) {
    var c = code.charAt(i);
    if (c === "\n") {
      line++;
      i++;
      continue;
    }
    if (c === " " || c === "\t" || c === "\r") {
      i++;
      continue;
    }
    if (c === "/" && code.charAt(i + 1) === "/") {
      while (i < n && code.charAt(i) !== "\n") i++;
      continue;
    }
    if (c === "/" && code.charAt(i + 1) === "*") {
      var e = code.indexOf("*/", i + 2);
      if (e < 0) {
        errs.push({ line: line, key: "commentOpen", a: "*/" });
        return { errs: errs, stack: stack };
      }
      line += countNl(code.slice(i, e));
      i = e + 2;
      continue;
    }
    if (c === '"' || c === "'") {
      var sl = line;
      i++;
      var closed = false;
      while (i < n) {
        var d = code.charAt(i);
        if (d === "\\") {
          if (code.charAt(i + 1) === "\n") line++;
          i += 2;
          continue;
        }
        if (d === c) {
          closed = true;
          i++;
          break;
        }
        if (d === "\n") break;
        i++;
      }
      if (!closed) {
        errs.push({ line: sl, key: "strOpen" });
        return { errs: errs, stack: stack };
      }
      prev = "s";
      continue;
    }
    if (c === "`") {
      var tl = line;
      i++;
      var ok = false;
      var td = 0;
      while (i < n) {
        var t = code.charAt(i);
        if (t === "\\") {
          if (code.charAt(i + 1) === "\n") line++;
          i += 2;
          continue;
        }
        if (t === "\n") line++;
        if (td === 0 && t === "`") {
          ok = true;
          i++;
          break;
        }
        if (t === "$" && code.charAt(i + 1) === "{") {
          td++;
          i += 2;
          continue;
        }
        if (td > 0) {
          if (t === "{") td++;
          else if (t === "}") td--;
        }
        i++;
      }
      if (!ok) {
        errs.push({ line: tl, key: "strOpen" });
        return { errs: errs, stack: stack };
      }
      prev = "s";
      continue;
    }
    if (c === "/") {
      var regexOk = prev === "" || "(,=:[!&|?{};+-*%<>~^}".indexOf(prev) >= 0 || REGEX_AFTER[prev];
      if (regexOk) {
        var j = i + 1;
        var cls = false;
        var okr = false;
        while (j < n) {
          var rc = code.charAt(j);
          if (rc === "\\") {
            j += 2;
            continue;
          }
          if (rc === "\n") break;
          if (rc === "[") cls = true;
          else if (rc === "]") cls = false;
          else if (rc === "/" && !cls) {
            okr = true;
            j++;
            break;
          }
          j++;
        }
        if (okr) {
          while (j < n && /[a-z]/i.test(code.charAt(j))) j++;
          i = j;
          prev = "s";
          continue;
        }
      }
      prev = "/";
      i++;
      continue;
    }
    if (c === "(" || c === "[" || c === "{") {
      stack.push({ ch: c, line: line });
      prev = c;
      i++;
      continue;
    }
    if (c === ")" || c === "]" || c === "}") {
      var top = stack.length ? stack[stack.length - 1] : null;
      if (!top) {
        errs.push({ line: line, key: "closerExtra", a: c });
        return { errs: errs, stack: stack };
      }
      if (CLOSE[top.ch] !== c) {
        errs.push({ line: line, key: "closerMismatch", a: c, b: CLOSE[top.ch], l: top.line });
        return { errs: errs, stack: stack };
      }
      stack.pop();
      prev = c;
      i++;
      continue;
    }
    if (/[A-Za-z0-9_$]/.test(c)) {
      var w = i;
      while (i < n && /[A-Za-z0-9_$]/.test(code.charAt(i))) i++;
      var word = code.slice(w, i);
      prev = REGEX_AFTER[word] ? word : "w";
      continue;
    }
    prev = c;
    i++;
  }
  return { errs: errs, stack: stack };
}
function compileErr(src) {
  try {
    new Function(src); // only compiled, never run
    return null;
  } catch (e) {
    return e instanceof SyntaxError ? e : null; // another kind of error (eval forbidden...): nothing to say
  }
}
function syntaxKey(message) {
  var m = String(message || "");
  if (/missing \) after argument list|expected '\)'|expected '\]'|expected '\}'/i.test(m)) return "synMissingParen";
  if (/unexpected identifier|unexpected token: identifier|identifier/i.test(m)) return "synIdentifier";
  if (/unexpected string|string literal/i.test(m)) return "synString";
  if (/unexpected number/i.test(m)) return "synNumber";
  if (/invalid or unexpected token|illegal character|invalid character/i.test(m)) return "synInvalid";
  if (/end of input|end of script|unexpected eof/i.test(m)) return "synEnd";
  if (/unexpected token|unexpected keyword|expected expression/i.test(m)) return "synToken";
  return "syntax";
}
function lintJs(code, base, ui) {
  var out = [];
  if (!String(code).trim()) return out;
  var sc = scanJs(code);
  if (sc.errs.length) {
    sc.errs.forEach(function (e) {
      out.push({ line: base + e.line - 1, msg: say(ui, e) });
    });
    return out;
  }
  sc.stack.forEach(function (s) {
    out.push({ line: base + s.line - 1, msg: say(ui, { key: "openerUnclosed", a: s.ch, b: CLOSE[s.ch] }) });
  });
  if (out.length) return out.slice(0, 3);
  var err = compileErr(code);
  if (!err) return out;
  var lines = code.split("\n");
  var culprit = lines.length;
  if (lines.length <= 150) {
    var last = 0;
    for (var k = 1; k <= lines.length; k++) {
      var pre = lines.slice(0, k).join("\n");
      var ps = scanJs(pre);
      if (ps.errs.length) continue;
      var closers = ps.stack
        .slice()
        .reverse()
        .map(function (s) {
          return CLOSE[s.ch];
        })
        .join("");
      if (!compileErr(pre + "\n" + closers)) last = k;
    }
    culprit = Math.min(lines.length, last + 1);
    while (culprit < lines.length && !lines[culprit - 1].trim()) culprit++;
  }
  out.push({ line: base + culprit - 1, msg: say(ui, { key: syntaxKey(err.message) }) });
  return out;
}

// ---------- entry point ----------
export function lintWeb(code, lang, ui) {
  ui = ui === "ar" ? "ar" : "fr";
  var kind = lang === "htmlsrc" ? "html" : lang;
  var src = String(code || "");
  if (!src.trim() || src.length > 20000) return [];
  var found = [];
  var all = function (e) {
    found.push({ line: e.line, msg: e.msg || say(ui, e) });
  };
  try {
    if (kind === "html") {
      var h = lintHtml(src, ui);
      h.errs.forEach(all);
      h.segs.forEach(function (s) {
        if (s.kind === "css") lintCss(s.code, s.base, ui).forEach(all);
        else lintJs(s.code, s.base, ui).forEach(all);
      });
    } else if (kind === "css") lintCss(src, 1, ui).forEach(all);
    else if (kind === "js") lintJs(src, 1, ui).forEach(all);
  } catch (err) {
    return []; // a checker that fails must never get in the student's way
  }
  found.sort(function (a, b) {
    return a.line - b.line;
  });
  var seen = {};
  return found
    .filter(function (e) {
      if (seen[e.line]) return false;
      seen[e.line] = true;
      return true;
    })
    .slice(0, 12);
}
