/* Classek student space.
   Guards the page: signed out -> ./ , teacher -> teacher.
   The profile card ("My account") reuses the teacher app's modal look (style.css)
   and saves to users/{uid}/meta/profile. */

import { Chapters } from "./chapters.js?v=96";
import * as Cy from "./cycle.js?v=68";
import {
  MAX_SHOWN,
  parseDevice,
  normalizeGeo,
  placeLabel,
  readSession,
  shouldForceSignOut,
  sortSessions,
  staleIds,
  isActiveNow,
  lastSeenLabel,
} from "./sessions-core.js?v=1";

var SDK_VERSION = "10.14.1";
var SDK_BASE = "https://www.gstatic.com/firebasejs/" + SDK_VERSION + "/";
var LANG_KEY = "classledger:lang";

var STR = {
  fr: {
    hello: "Bonjour",
    sub: "Choisis un chapitre, entraîne-toi et suis ta progression.",
    chapters: "Chapitres",
    emptyTitle: "Tes premiers chapitres arrivent",
    emptyText: "Reviens bientôt : de nouveaux exercices sont ajoutés.",
    signOut: "Se déconnecter",
    home: "Accueil",
    language: "Langue",
    account: "Mon compte",
    settings: "Paramètres",
    retakeTest: "Refaire le test de niveau",
    dangerTitle: "Supprimer le compte",
    dangerText:
      "Cette action supprime définitivement ton compte et tes données (informations, progression). Elle est irréversible.",
    typeToConfirm: "Écris DELETE pour confirmer",
    deleteBtn: "Supprimer mon compte",
    deleting: "Suppression…",
    deleteFail: "Impossible de supprimer le compte.",
    devTitle: "Où tu es connecté",
    devHint: "Appareils où ton compte est ouvert. Si tu ne reconnais pas l’un d’eux, déconnecte-le.",
    devThis: "Cet appareil",
    devNow: "Actif maintenant",
    devOutBtn: "Déconnecter",
    devOutAll: "Déconnecter tous les autres appareils",
    devSure: "Appuie encore pour confirmer",
    devPending: "Déconnexion…",
    devPendingWait: "L’appareil sera déconnecté dès qu’il sera de nouveau en ligne.",
    devNone: "Aucun autre appareil n’est connecté.",
    devLoading: "Chargement de tes appareils…",
    devFail: "Impossible de charger tes appareils.",
    devOutFail: "Impossible de déconnecter cet appareil. Réessaie.",
    devWhereUnknown: "Lieu indisponible",
    devGeoNote: "Le lieu est approximatif, d’après le réseau. Nous ne gardons pas ton adresse IP.",
    devPhone: "Téléphone",
    devTablet: "Tablette",
    devComputer: "Ordinateur",
    devBrowserOn: "{browser} sur {os}",
    close: "Fermer",
    fbTitle: "Boîte à idées",
    fbIntro: "Dis-nous ce qui t’aide ou te bloque. Chaque message est lu.",
    fbType: "De quoi s’agit-il ?",
    fbtDifficulty: "Un exercice est trop facile ou trop difficile",
    fbtClarity: "Je n’ai pas compris",
    fbtMotivation: "Je manque de motivation",
    fbtIdea: "Une idée pour améliorer le site",
    fbtBug: "Un problème technique",
    fbtOther: "Autre",
    fbAbout: "À propos de",
    fbPlaceholder: "Écris ton message ici…",
    fbSend: "Envoyer",
    fbSending: "Envoi…",
    fbThanksTitle: "Merci !",
    fbThanksText: "Ton message est bien arrivé. On le lit et on s’en sert pour améliorer le site.",
    fbAgain: "Envoyer un autre message",
    inboxTitle: "Mes idées et réponses",
    inboxIntro: "Tes messages à l’équipe Classek et ses réponses.",
    inboxNew: "Nouvelle idée",
    inboxWaiting: "En attente de réponse",
    inboxReplied: "Réponse reçue",
    inboxYou: "Ton message",
    inboxAnswer: "Réponse de l’équipe Classek",
    inboxBack: "Retour",
    inboxNewBadge: "Nouveau",
    inboxProgress: "En cours de traitement",
    inboxDone: "Traité",
    inboxProgressText: "L’équipe Classek a lu ton message et s’en occupe.",
    inboxDoneText: "L’équipe Classek a traité ton message. Merci !",
    fbTooMany: "Tu as déjà envoyé plusieurs messages aujourd’hui. Reviens demain.",
    fbFailMsg: "Impossible d’envoyer. Réessaie.",
    fbPickType: "Choisis d’abord de quoi il s’agit.",
    ideas: "Boîte à idées",

    profileEdit: "Modifier",
    profileSave: "Enregistrer",
    profileFirstName: "Prénom",
    profileLastName: "Nom",
    profileGender: "Genre",
    profilePhone: "Téléphone",
    profilePhoto: "Photo de profil",
    avUpload: "Importer une photo",
    avChoose: "Choisir un avatar",
    avGoogle: "Utiliser ma photo Google",
    avPickGender: "Choisis d’abord ton genre pour voir les avatars.",
    avFail: "Impossible d’utiliser cette image. Essaie-en une autre.",
    avPicked: "Sélectionné",
    avBg: "Couleur de fond",
    profileLevel: "Niveau / section",
    profileLevelHint: "ex. Bac Informatique",
    profileEmail: "E-mail",
    profileNoName: "Ajoute ton nom",
    profileNotSet: "Non renseigné",
    profileSaved: "Ton profil a été enregistré.",
    profileSyncing: "Chargement de tes informations…",
    profileWelcome: "Bienvenue sur Classek ! Complète ton profil pour commencer.",
    saveFail: "Enregistrement impossible. Réessaie.",
    genderMale: "Garçon",
    genderFemale: "Fille",
    pTitle: "Test de niveau",
    pIntroTitle: "Voyons où tu en es",
    pIntro:
      "10 questions choisies selon ton niveau et ton moment de l’année scolaire. Environ 5 minutes, sans note, sans pression. Cela nous aide à te proposer par où commencer.",
    pLevelPick: "Ton niveau",
    pChipStage: "Trimestre {n}",
    pRecoOneHigh: "Bon départ. Choisis n’importe quel chapitre.",
    pRecoOneLow: "Commence par les bases.",
    pStart: "Commencer le test",
    pSkip: "Passer pour l’instant",
    pNext: "Suivant",
    pFinish: "Terminer",
    pDontKnow: "Je ne sais pas",
    pQuestion: "Question {n} sur {total}",
    pResult: "Ton résultat",
    pRecoWeak: "Commence par {domain}.",
    pRecoBoth: "Tu es solide des deux côtés. Choisis n’importe quel chapitre.",
    pRecoLow: "Commence par les bases des deux côtés.",
    pReview: "Revoir tes réponses",
    pCorrect: "Bonne réponse",
    pYours: "Ta réponse",
    pRetake: "Refaire le test",
    pViewResults: "Voir mes résultats",
    pLevelTest: "Test de niveau",
    pOverall: "Global",
    pNewBadge: "Commence ici",
    pCardTodoBtn: "Passer le test",
    pCardDoneSub: "D’après ton test de niveau",
    pRight: "Correct !",
    pWrong: "Pas tout à fait",
    pNoIdea: "Pas de souci",
    pTimeUp: "Temps écoulé !",
    pChipTimed: "Questions chronométrées",
    pPerfect: "Score parfait !",
    pGreat: "Bravo !",
    pGood: "Bon début !",
    pKeep: "Continue, tu vas y arriver !",
    pChipQ: "{n} questions",
    pChipTime: "Environ 5 min",
    pChipNoGrade: "Sans note",
    pDone: "Terminé",
    bPill: "Bilan · {n}/7 jours",
    bPillReady: "7/7 jours",
    bGo: "Commencer le bilan",
    bNote: "Un exercice terminé = un jour compté. Au 7ᵉ jour, ton bilan arrive.",
    bNoteReady: "Une dizaine de questions. Il t’attend : ton compteur ne bouge pas tant que tu ne l’as pas passé.",
    bCardTitle: "Ton niveau et tes bilans",
    bCardLast: "Dernier bilan : {c}/{t}{d}",
    bCardReady: "Ton bilan est prêt à passer",
    bPlacement: "Test de niveau",
    bTitle: "Bilan de la semaine",
    bResultTitle: "Bilan n°{n}",
    bIntroTitle: "C’est l’heure du bilan",
    bIntro: "Des questions sur ce que tu as travaillé cette semaine, avec quelques-unes d’avant pour voir ce qui est resté. Pas de pression : le but est de mesurer ton progrès.",
    bChipChap: "{n} chapitre(s)",
    bLater: "Plus tard",
    bStart: "Commencer",
    bLoading: "Préparation du bilan…",
    bNoQuestions: "Pas encore de questions pour tes chapitres. Reviens bientôt !",
    bMix: "Mélange",
    bFirst: "Premier bilan : c’est ton point de départ.",
    bUpTxt: "▲ +{d} pts par rapport au bilan précédent",
    bDownTxt: "▼ −{d} pts par rapport au bilan précédent",
    bSameTxt: "= Même score que le bilan précédent",
    bEvo: "Ton évolution par chapitre",
    bPrevMark: "Le trait noir = ton bilan précédent",
    bRevoir: "À revoir",
    bRevoirGo: "Revoir ›",
    bPts: "pts",
    bRecoUp: "Tu progresses : continue sur cette lancée.",
    bRecoFlat: "Stable. Reprends les chapitres à revoir pour monter d’un cran.",
    bRecoDown: "Un petit recul, c’est normal. Revois les points ci-dessous, puis relance une semaine.",
    bRecoFirst: "Voilà ta base. Au prochain bilan, tu verras ton évolution.",
    bNewWeek: "Nouvelle semaine : 0 / 7",
    pLoadFail: "Impossible de charger les questions. Réessaie.",
    pSaveFail: "Ton résultat n’a pas pu être enregistré, mais le voici.",
    pCardTodoTitle: "Passe le test de niveau",
    pCardTodoText: "10 questions, environ 5 minutes. Nous te proposerons par où commencer.",
    pCardDoneTitle: "Ton niveau",
    pLevelHigh: "Excellent",
    pLevelMid: "Moyen",
    pLevelLow: "Faible",
  },
  ar: {
    hello: "مرحبا",
    sub: "اختار فصل، تمرّن، وتابع تقدمك.",
    chapters: "الفصول",
    emptyTitle: "أول الفصول في الطريق",
    emptyText: "ارجع قريب: تمارين جديدة تتزاد.",
    signOut: "تسجيل الخروج",
    home: "الرئيسية",
    language: "اللغة",
    account: "حسابي",
    settings: "الإعدادات",
    retakeTest: "عاود اختبار المستوى",
    dangerTitle: "حذف الحساب",
    dangerText: "هذا يحذف حسابك وبياناتك (المعلومات والتقدم) نهائيا. ما ينجمش يتراجع.",
    typeToConfirm: "اكتب DELETE للتأكيد",
    deleteBtn: "حذف حسابي",
    deleting: "جاري الحذف…",
    deleteFail: "ما نجمناش نحذفو الحساب.",
    devTitle: "الأجهزة اللي دخلت بيها",
    devHint: "الأجهزة اللي حسابك مفتوح فيها. كان فما جهاز ما تعرفوش، سجّل منو الخروج.",
    devThis: "هذا الجهاز",
    devNow: "نشط توّا",
    devOutBtn: "تسجيل الخروج",
    devOutAll: "تسجيل الخروج من الأجهزة الأخرى",
    devSure: "اضغط مرة أخرى للتأكيد",
    devPending: "جاري الخروج…",
    devPendingWait: "يخرج كي يتحل الجهاز هذا وتكون فيه شبكة.",
    devNone: "ما فما حتى جهاز آخر داخل بحسابك.",
    devLoading: "جاري تحميل الأجهزة…",
    devFail: "ما نجمناش نحمّلو الأجهزة.",
    devOutFail: "ما نجمناش نسجّلو الخروج من الجهاز هذا. عاود جرّب.",
    devWhereUnknown: "الموقع غير متوفر",
    devGeoNote: "المكان تقريبي حسب الشبكة. ما نخزّنوش عنوان الـ IP متاعك.",
    devPhone: "هاتف",
    devTablet: "تابلت",
    devComputer: "كمبيوتر",
    devBrowserOn: "{browser} على {os}",
    close: "إغلاق",
    fbTitle: "صندوق الأفكار",
    fbIntro: "قلّنا شنوة يعاونك وشنوة يعطّلك. كل رسالة تتقرا.",
    fbType: "علاش تكتب؟",
    fbtDifficulty: "تمرين سهل برشا ولا صعب برشا",
    fbtClarity: "ما فهمتش",
    fbtMotivation: "ما نتحمّسش",
    fbtIdea: "فكرة باش يتطوّر الموقع",
    fbtBug: "مشكل تقني",
    fbtOther: "أخرى",
    fbAbout: "بخصوص",
    fbPlaceholder: "اكتب رسالتك هنا…",
    fbSend: "ابعث",
    fbSending: "نبعثوها…",
    fbThanksTitle: "يعطيك الصحة!",
    fbThanksText: "رسالتك وصلت. نقراوها ونستعملوها باش نحسّنو الموقع.",
    fbAgain: "ابعث رسالة أخرى",
    inboxTitle: "أفكاري والردود",
    inboxIntro: "رسائلك لفريق Classek وردوده عليها.",
    inboxNew: "فكرة جديدة",
    inboxWaiting: "في انتظار الرد",
    inboxReplied: "وصلك رد",
    inboxYou: "رسالتك",
    inboxAnswer: "رد فريق Classek",
    inboxBack: "رجوع",
    inboxNewBadge: "جديد",
    inboxProgress: "في طور المعالجة",
    inboxDone: "تمّت المعالجة",
    inboxProgressText: "فريق Classek قرا رسالتك وراهو يخدم عليها.",
    inboxDoneText: "فريق Classek عالج رسالتك. يعطيك الصحة!",
    fbTooMany: "بعثت برشا رسائل اليوم. ارجع غدوة.",
    fbFailMsg: "ما نجّمناش نبعثوها. عاود.",
    fbPickType: "اختار علاش تكتب قبل.",
    ideas: "صندوق الأفكار",

    profileEdit: "تعديل",
    profileSave: "حفظ",
    profileFirstName: "الاسم",
    profileLastName: "اللقب",
    profileGender: "الجنس",
    profilePhone: "الهاتف",
    profilePhoto: "صورة البروفيل",
    avUpload: "حمّل صورة من جهازك",
    avChoose: "اختار صورة",
    avGoogle: "استعمل صورة Google",
    avPickGender: "اختار الجنس الأول باش تظهرلك الصور.",
    avFail: "ما نجمتش نستعمل هالصورة. جرّب وحدة أخرى.",
    avPicked: "مختارة",
    avBg: "لون الخلفية",
    profileLevel: "المستوى / الشعبة",
    profileLevelHint: "مثلا: باك إعلامية",
    profileEmail: "الإيميل",
    profileNoName: "زيد اسمك",
    profileNotSet: "موش محدد",
    profileSaved: "تم حفظ البروفايل.",
    profileSyncing: "جاري تحميل معلوماتك…",
    profileWelcome: "مرحبا بيك في Classek ! كمّل البروفايل متاعك باش تبدأ.",
    saveFail: "ما نجمناش نحفظو. عاود جرّب.",
    genderMale: "ذكر",
    genderFemale: "أنثى",
    pTitle: "اختبار تحديد المستوى",
    pIntroTitle: "نشوفو وين وصلت",
    pIntro:
      "10 أسئلة مختارة على حسب مستواك ووقت السنة الدراسية. حوالي 5 دقايق، من غير نقطة ومن غير ضغط. يعاوننا نقترحو عليك من وين تبدا.",
    pLevelPick: "مستواك الدراسي",
    pChipStage: "الثلاثي {n}",
    pRecoOneHigh: "بداية قوية. اختار أي فصل.",
    pRecoOneLow: "ابدا بالأساسيات.",
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
    pLevelTest: "اختبار المستوى",
    pOverall: "المستوى العام",
    pNewBadge: "ابدا من هنا",
    pCardTodoBtn: "اعمل الاختبار",
    pCardDoneSub: "على أساس اختبار تحديد المستوى",
    pRight: "صحيح!",
    pWrong: "موش بالضبط",
    pNoIdea: "ما يهمش",
    pTimeUp: "الوقت خلص!",
    pChipTimed: "وقت لكل سؤال",
    pPerfect: "نتيجة ممتازة!",
    pGreat: "برافو عليك!",
    pGood: "بداية باهية!",
    pKeep: "كمّل، تتحسن شوية بشوية!",
    pChipQ: "{n} أسئلة",
    pChipTime: "تقريبا 5 دقايق",
    pChipNoGrade: "بلا نقطة",
    pDone: "تمّ",
    bPill: "تقييم · {n}/7 أيام",
    bPillReady: "7/7 أيام",
    bGo: "ابدا التقييم",
    bNote: "تمرين كامل = يوم محسوب. في اليوم السابع يطلعلك التقييم.",
    bNoteReady: "نحو 10 أسئلة. التقييم ينتظر فيك، والعداد ما يتحركش حتى تعدّيه.",
    bCardTitle: "مستواك وتقييماتك",
    bCardLast: "آخر تقييم: {c}/{t}{d}",
    bCardReady: "تقييمك جاهز",
    bPlacement: "اختبار المستوى",
    bTitle: "تقييم الأسبوع",
    bResultTitle: "التقييم رقم {n}",
    bIntroTitle: "حان وقت التقييم",
    bIntro: "أسئلة على الي خدمتو في الأسبوع هذا، وبعضها من دروس قبل باش نشوفو شنوة ثبت. بلا ضغط: الهدف نقيسو تقدمك.",
    bChipChap: "{n} دروس",
    bLater: "بعد شوية",
    bStart: "ابدا",
    bLoading: "نحضّرو في التقييم…",
    bNoQuestions: "مازال ما فماش أسئلة لدروسك. ارجع قريب!",
    bMix: "مزيج",
    bFirst: "أول تقييم: هو نقطة البداية متاعك.",
    bUpTxt: "▲ +{d} نقطة مقارنة بالتقييم الي قبل",
    bDownTxt: "▼ −{d} نقطة مقارنة بالتقييم الي قبل",
    bSameTxt: "= نفس النتيجة متاع التقييم الي قبل",
    bEvo: "تطورك حسب الدرس",
    bPrevMark: "الخط الأسود = التقييم الي قبل",
    bRevoir: "للمراجعة",
    bRevoirGo: "راجع ›",
    bPts: "ن",
    bRecoUp: "تتقدم، كمّل هكا.",
    bRecoFlat: "ثابت. راجع الدروس الي للمراجعة باش تطلع.",
    bRecoDown: "تراجع صغير عادي. راجع النقاط الي تحت وبدّل أسبوع جديد.",
    bRecoFirst: "هذي قاعدتك. في التقييم الجاي تشوف تطورك.",
    bNewWeek: "أسبوع جديد: 0 / 7",
    pLoadFail: "ما نجمناش نحمّلو الأسئلة. عاود جرّب.",
    pSaveFail: "ما نجمناش نحفظو نتيجتك، أما هاهي.",
    pCardTodoTitle: "اعمل اختبار تحديد المستوى",
    pCardTodoText: "10 أسئلة، حوالي 5 دقايق. نقترحو عليك من وين تبدا.",
    pCardDoneTitle: "مستواك",
    pLevelHigh: "رائع",
    pLevelMid: "متوسط",
    pLevelLow: "ضعيف",
  },
};

var ICON_USER =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/></svg>';
var ICON_GEAR =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
var ICON_BULB =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg>';
var ICON_OUT =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>';
var ICON_EDIT =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
var ICON_CHECK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

var lang = "fr";
try {
  lang = localStorage.getItem(LANG_KEY) === "ar" ? "ar" : "fr";
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

// ---- profile photo: one of the 10 site avatars, a small photo from the device, or the Google photo ----
var AVATARS = {
  male: [1, 3, 5, 7, 9],
  female: [2, 4, 6, 8, 10],
};
var LEVELS = ["2ème Informatique", "3ème Informatique", "4ème Informatique (Bac)"];
function cleanAvatar(v) {
  v = typeof v === "string" ? v : "";
  if (/^Images\/slide-(10|[1-9])\.svg$/.test(v)) return v;
  if (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(v) && v.length < 200000) return v;
  return "";
}
// code with line numbers (CSS counter on .cl), plain text only
function numberedCode(pre, code) {
  pre.classList.add("has-ln");
  String(code)
    .split("\n")
    .forEach(function (l, i) {
      if (i) pre.append(document.createTextNode("\n"));
      pre.append(el("span", "cl", l));
    });
}

// background colours for the site avatars: the brand colours except the darkest one, plus a rose red
var AVATAR_BGS = { azure: "#032c7b", royal: "#0464de", lime: "#aee37b", frost: "#e9fff4", rose: "#e64d6b" };
function cleanBg(v) {
  return typeof v === "string" && AVATAR_BGS[v] ? v : "";
}
function avatarBgFor(src, bg) {
  return src && src.indexOf("Images/") === 0 ? bg || "frost" : "";
}
function tintCover(src, bg) {
  var banner = document.querySelector("#pOverlay .profile-banner");
  if (!banner) return;
  var k = avatarBgFor(src, bg);
  if (k) banner.setAttribute("data-bg", k);
  else banner.removeAttribute("data-bg");
}
function avatarSrc() {
  return profile.avatar || (currentUser && currentUser.photoURL) || "";
}
function levelOption(v) {
  v = String(v || "");
  if (LEVELS.indexOf(v) >= 0) return v;
  if (/bac|4/i.test(v)) return LEVELS[2];
  if (/3/.test(v)) return LEVELS[1];
  if (/2/.test(v)) return LEVELS[0];
  return "";
}
// photo from the device -> small square JPEG (about 15-30 KB) that fits in the profile document
function photoToDataUrl(file) {
  return new Promise(function (resolve, reject) {
    if (!file || !/^image\//.test(file.type) || file.size > 12 * 1024 * 1024) return reject(new Error("bad file"));
    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () {
      try {
        var size = 256;
        var c = document.createElement("canvas");
        c.width = c.height = size;
        var ctx = c.getContext("2d");
        var side = Math.min(img.naturalWidth, img.naturalHeight);
        var sx = (img.naturalWidth - side) / 2;
        var sy = (img.naturalHeight - side) / 2;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
        var out = c.toDataURL("image/jpeg", 0.85);
        URL.revokeObjectURL(url);
        resolve(out);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = function () {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}
function paintAvatar(host, src, initialText, bg) {
  host.textContent = "";
  if (src) {
    var img = el("img", "avatar" + (src.indexOf("Images/") === 0 ? " is-preset" : ""));
    img.alt = "";
    img.referrerPolicy = "no-referrer";
    img.src = src;
    var bgKey = avatarBgFor(src, bg);
    if (bgKey) img.style.background = AVATAR_BGS[bgKey];
    host.append(img);
  } else {
    var ini = el("div", "avatar me-initial");
    if (initialText) ini.textContent = initialText.charAt(0).toUpperCase();
    else ini.innerHTML = ICON_USER; // static, trusted SVG
    host.append(ini);
  }
}

var currentUser = null;
var profile = { firstName: "", lastName: "", gender: "", phone: "", level: "", avatar: "", avatarBg: "" };
var profileLoaded = false;
var editing = false;
var justSaved = false;
var saveProfile = null; // set once Firebase is ready
var removeAccount = null; // set once Firebase is ready
var signOutNow = null; // set once Firebase is ready
var placement = null; // saved placement result / skip marker, null = never seen
var placementLoaded = false;
var savePlacement = null; // set once Firebase is ready
var testData = null; // placement questions: Firestore tests/placement (uploaded from the admin page), else data/placement-test.json
var loadRemoteTest = null; // set once Firebase is ready
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

/* ---------------- study cycle: 7 study days, then the weekly bilan ---------------- */
var cycle = null; // { no, days[], chapters{}, recent[] } from users/{uid}/progress/cycle
var bilans = { items: [] }; // users/{uid}/progress/bilans
var cycleOk = false; // false until the cloud copy is read: never count (or save) before that, so nothing gets overwritten
var saveCycle = null;
var saveBilans = null;

function recordStudyDay(chId) {
  if (!cycleOk || !saveCycle) return;
  var r = Cy.countDay(cycle, Cy.tunisDate(new Date()), chId);
  if (!r.changed) return;
  cycle = r.cycle;
  paintWeek();
  renderPlacementCard();
  saveCycle(cycle).catch(function (e) {
    console.warn("Couldn’t save the study days:", e);
  });
}
function ymd(d) {
  var p = function (n) {
    return (n < 10 ? "0" : "") + n;
  };
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}
function lastBilan() {
  return bilans.items.length ? bilans.items[bilans.items.length - 1] : null;
}
function deltaText(d) {
  return d === null || d === 0 ? "" : " · " + (d > 0 ? "▲ +" : "▼ −") + Math.abs(d) + " " + t("bPts");
}

/* ---------------- week strip (today highlighted) ---------------- */
function paintWeek() {
  var host = $("sWeek");
  if (!host) return;
  var loc = lang === "ar" ? "ar-TN-u-nu-latn" : "fr-FR";
  var now = new Date();
  var mon = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  mon.setDate(mon.getDate() - 3); // today always sits in the middle: 3 days before, 3 after
  var wd = new Intl.DateTimeFormat(loc, { weekday: "short" });
  host.textContent = "";
  var studied = cycleOk ? Cy.studiedDates(cycle) : {};
  var ready = cycleOk && Cy.isReady(cycle);
  host.classList.toggle("is-ready", ready);
  var cap = el("div", "week-cap");
  var narrow = window.matchMedia("(max-width: 560px)").matches; // on a phone the year goes, so the date and the circles share one line
  cap.textContent = new Intl.DateTimeFormat(loc, narrow ? { weekday: "long", day: "numeric", month: "long" } : { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(now);
  var row = el("div", "week-row");
  for (var i = 0; i < 7; i++) {
    var d = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + i);
    var isToday = d.toDateString() === now.toDateString();
    var isDone = !!studied[ymd(d)];
    var isPast = !isToday && d < new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var cell = el("div", "week-day" + (isToday ? " is-today" : "") + (isPast ? " is-past" : "") + (isDone ? " is-done" : ""));
    if (isToday) cell.setAttribute("aria-current", "date");
    // the day name above a rounded pill holding the number and, on a study day, a small tick
    var pd = el("span", "wk-pd");
    pd.append(el("span", "week-num", String(d.getDate())), el("span", "wk-mark" + (isDone ? " is-on" : "")));
    cell.append(el("span", "week-name", wd.format(d)), pd);
    row.append(cell);
  }
  if (cycleOk) {
    var n = cycle.days.length;
    var top = el("div", "wk-top");
    var dots = el("span", "wk-dots");
    for (var k = 0; k < Cy.CYCLE_DAYS; k++) dots.append(el("i", (k < n ? "is-on" : "") + (ready && k === Cy.CYCLE_DAYS - 1 ? " is-blink" : "")));
    var pill;
    if (ready) {
      // day 7: the last circle blinks, and the circles turn into the start button when the mouse comes over them (always shown as a button on touch screens)
      pill = el("button", "wk-pill is-ready");
      pill.type = "button";
      pill.setAttribute("aria-label", t("bGo"));
      pill.append(dots, el("span", "wk-label", t("bGo")));
      pill.addEventListener("click", openBilan);
    } else {
      pill = el("span", "wk-pill");
      var pillText = tf("bPill", { n: n });
      pill.setAttribute("role", "img");
      pill.setAttribute("aria-label", pillText); // only the circles show; the words are for screen readers and the tooltip
      pill.title = pillText;
      pill.append(dots);
    }
    top.append(pill);
    host.append(top);
  }
  host.append(cap, row);
  if (cycleOk) host.append(el("p", "wk-note", ready ? t("bNoteReady") : t("bNote")));
}
document.addEventListener("visibilitychange", function () {
  if (!document.hidden) paintWeek();
});
window.matchMedia("(max-width: 560px)").addEventListener("change", paintWeek);


// the profile picture (or the first letter of the name) as a node; used in the top bar and in the home box
function buildAvatarNode() {
  var first = shownNames().first;
  var hSrc = avatarSrc();
  if (hSrc) {
    var img = el("img", hSrc.indexOf("Images/") === 0 ? "is-preset" : "");
    img.alt = "";
    img.referrerPolicy = "no-referrer";
    img.src = hSrc;
    var hBg = avatarBgFor(hSrc, profile.avatarBg);
    if (hBg) img.style.background = AVATAR_BGS[hBg];
    return img;
  }
  return el("span", "student-initial", (first || (currentUser && currentUser.email) || "?").charAt(0).toUpperCase());
}


/* ---------------- Boîte à idées: a message to the teacher (read in the admin page) ---------------- */
var FB_TYPES = [
  ["difficulty", "fbtDifficulty"],
  ["clarity", "fbtClarity"],
  ["motivation", "fbtMotivation"],
  ["idea", "fbtIdea"],
  ["bug", "fbtBug"],
  ["other", "fbtOther"],
];
var FB_MAX = 1000;
var FB_PER_DAY = 5;
var fb = { type: "", text: "", context: null, sending: false, done: false, error: "", view: "form", detail: "" };
var inbox = []; // the student's own messages, newest first: { id, type, message, createdAt, adminReply, repliedAt, replySeen }
function hasNews(m) {
  return !!m.adminReply || m.status === "progress" || m.status === "done";
}
function unreadCount() {
  return inbox.filter(function (m) {
    return hasNews(m) && !m.replySeen;
  }).length;
}
function fbTodayKey() {
  return "classledger:fb:" + new Date().toISOString().slice(0, 10);
}
function fbSentToday() {
  try {
    return Number(localStorage.getItem(fbTodayKey()) || 0);
  } catch (e) {
    return 0;
  }
}
function fbIsOpen() {
  return $("fbOverlay").classList.contains("open");
}
function openFeedback(context, forceForm) {
  var hasReplies = inbox.some(hasNews);
  fb = {
    type: context ? "difficulty" : "",
    text: "",
    context: context || null,
    sending: false,
    done: false,
    error: "",
    view: !context && !forceForm && hasReplies ? "inbox" : "form",
    detail: "",
    fresh: {}, // replies that were unread when the box opened: they stay highlighted during this visit
  };
  if (fb.view === "inbox") {
    inbox.forEach(function (m) {
      if (hasNews(m) && !m.replySeen) {
        fb.fresh[m.id] = true;
        markSeen(m);
      }
    });
  }
  renderFeedback();
  $("fbOverlay").classList.add("open");
  setTimeout(function () {
    var ta = $("fbText");
    if (ta) ta.focus();
  }, 60);
}
function closeFeedback() {
  $("fbOverlay").classList.remove("open");
}
function renderFeedback() {
  $("fbClose").setAttribute("aria-label", t("close"));
  $("fbTitle").textContent = t("fbTitle");
  var body = $("fbBody");
  body.textContent = "";
  if (fb.view === "inbox") return renderInbox(body);
  if (fb.view === "detail") return renderInboxDetail(body);
  if (fb.done) {
    var ok = el("div", "fb-done");
    ok.append(el("b", "", t("fbThanksTitle")), el("p", "", t("fbThanksText")));
    var again = pBtn(t("fbAgain"), "is-ghost", function () {
      openFeedback(null, true);
    });
    var close = pBtn(t("close"), "", closeFeedback);
    var row = el("div", "fb-actions");
    row.append(again, close);
    ok.append(row);
    body.append(ok);
    return;
  }
  body.append(el("p", "fb-intro", t("fbIntro")));
  if (fb.context) {
    var ctxRow = el("div", "fb-context");
    ctxRow.append(el("span", "", t("fbAbout") + " : " + fb.context.label));
    var x = el("button", "fb-ctx-x", "×");
    x.type = "button";
    x.setAttribute("aria-label", t("close"));
    x.addEventListener("click", function () {
      fb.context = null;
      renderFeedback();
    });
    ctxRow.append(x);
    body.append(ctxRow);
  }
  body.append(el("div", "fb-label", t("fbType")));
  var types = el("div", "fb-types");
  types.setAttribute("role", "radiogroup");
  FB_TYPES.forEach(function (ty) {
    var b = el("button", "fb-type" + (fb.type === ty[0] ? " is-on" : ""), t(ty[1]));
    b.type = "button";
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", fb.type === ty[0] ? "true" : "false");
    b.addEventListener("click", function () {
      fb.type = ty[0];
      fb.error = "";
      var ta0 = $("fbText");
      if (ta0) fb.text = ta0.value;
      renderFeedback();
    });
    types.append(b);
  });
  body.append(types);
  var ta = el("textarea", "fb-text");
  ta.id = "fbText";
  ta.rows = 5;
  ta.maxLength = FB_MAX;
  ta.placeholder = t("fbPlaceholder");
  ta.value = fb.text;
  ta.setAttribute("dir", "auto");
  var count = el("small", "fb-count", fb.text.length + " / " + FB_MAX);
  ta.addEventListener("input", function () {
    fb.text = ta.value;
    count.textContent = ta.value.length + " / " + FB_MAX;
    send.disabled = !canSend();
  });
  body.append(ta, count);
  var msg = el("p", "fb-error", fb.error);
  body.append(msg);
  function canSend() {
    return !fb.sending && !!fb.type && fb.text.trim().length >= 3;
  }
  var send = pBtn(fb.sending ? t("fbSending") : t("fbSend"), "", submitFeedback);
  send.disabled = !canSend();
  var cancel = pBtn(t("close"), "is-ghost", closeFeedback);
  var actions = el("div", "fb-actions");
  actions.append(cancel, send);
  body.append(actions);
}
function fbDate(ts) {
  var d = ts && ts.toDate ? ts.toDate() : null;
  if (!d) return "";
  return d.toLocaleDateString(lang === "ar" ? "ar-TN-u-nu-latn" : "fr-FR", { day: "numeric", month: "short" });
}
function fbTypeLabel(type) {
  var f = FB_TYPES.filter(function (x) {
    return x[0] === type;
  })[0];
  return f ? t(f[1]) : "";
}
function stateLabel(m) {
  if (m.adminReply) return t("inboxReplied");
  if (m.status === "done") return t("inboxDone");
  if (m.status === "progress") return t("inboxProgress");
  return t("inboxWaiting");
}
function renderInbox(body) {
  $("fbTitle").textContent = t("inboxTitle");
  body.append(el("p", "fb-intro", t("inboxIntro")));
  var list = el("div", "ib-list");
  inbox.forEach(function (m) {
    var unread = hasNews(m) && (!m.replySeen || !!fb.fresh[m.id]);
    var box = el("button", "ib-box" + (unread ? " is-new" : ""));
    box.type = "button";
    var top = el("div", "ib-top");
    top.append(el("b", "", fbTypeLabel(m.type)), el("small", "", fbDate(m.createdAt)));
    var prev = el("p", "ib-prev", m.message);
    var label = stateLabel(m);
    var state = el("span", "ib-state" + (hasNews(m) ? " is-replied" : ""), unread ? t("inboxNewBadge") + " · " + label : label);
    box.append(top, prev, state);
    box.addEventListener("click", function () {
      fb.view = "detail";
      fb.detail = m.id;
      renderFeedback();
    });
    list.append(box);
  });
  body.append(list);
  var actions = el("div", "fb-actions");
  actions.append(
    pBtn(t("inboxNew"), "", function () {
      openFeedback(null, true);
    }),
  );
  body.append(actions);
}
function renderInboxDetail(body) {
  $("fbTitle").textContent = t("inboxTitle");
  var m = inbox.filter(function (x) {
    return x.id === fb.detail;
  })[0];
  if (!m) {
    fb.view = "inbox";
    return renderInbox(body);
  }
  var back = el("button", "ib-back", "← " + t("inboxBack"));
  back.type = "button";
  back.addEventListener("click", function () {
    fb.view = "inbox";
    renderFeedback();
  });
  body.append(back);
  var mine = el("div", "ib-card");
  mine.append(el("small", "", t("inboxYou") + " · " + fbTypeLabel(m.type) + " · " + fbDate(m.createdAt)), el("p", "", m.message));
  body.append(mine);
  var ans = el("div", "ib-card is-answer");
  if (m.adminReply) {
    ans.append(el("small", "", t("inboxAnswer") + " · " + fbDate(m.repliedAt)), el("p", "", m.adminReply));
  } else {
    ans.append(el("small", "", stateLabel(m)));
    if (m.status === "done") ans.append(el("p", "", t("inboxDoneText")));
    else if (m.status === "progress") ans.append(el("p", "", t("inboxProgressText")));
  }
  body.append(ans);
}
async function markSeen(m) {
  if (!hasNews(m) || m.replySeen) return;
  m.replySeen = true;
  paintNotif();
  try {
    await sdkRef.updateDoc(sdkRef.doc(dbRef, "feedback", m.id), { replySeen: true });
  } catch (e) {
    console.warn("Couldn’t mark the reply as read:", e);
  }
}
async function loadInbox() {
  if (!sdkRef || !currentUser) return;
  try {
    var q = sdkRef.query(
      sdkRef.collection(dbRef, "feedback"),
      sdkRef.where("uid", "==", currentUser.uid),
      sdkRef.where("kind", "==", "message"),
    );
    var snap = await sdkRef.getDocs(q);
    inbox = snap.docs
      .map(function (d) {
        var v = d.data();
        return {
          id: d.id,
          type: v.type,
          message: v.message || "",
          createdAt: v.createdAt,
          status: v.status || "new",
          adminReply: v.adminReply || "",
          repliedAt: v.repliedAt,
          replySeen: !!v.replySeen,
        };
      })
      .sort(function (a, b) {
        var x = a.createdAt && a.createdAt.toMillis ? a.createdAt.toMillis() : 0;
        var y = b.createdAt && b.createdAt.toMillis ? b.createdAt.toMillis() : 0;
        return y - x;
      })
      .slice(0, 30);
  } catch (e) {
    console.warn("Couldn’t load the ideas inbox:", e);
    return;
  }
  paintNotif();
  if (menuIsOpen()) renderMenu();
  if (fbIsOpen() && fb.view !== "form") renderFeedback();
}
/* red dot with the number of unread replies: on the avatar (and the phone menu button); inside the menu it sits on "Boîte à idées" */
function paintNotif() {
  var n = unreadCount();
  [$("sUser"), $("sMenuBtn")].forEach(function (host) {
    if (!host) return;
    var old = host.querySelector(".notif-dot");
    if (old) old.remove();
    if (n > 0) {
      var dot = el("span", "notif-dot", String(n > 9 ? "9+" : n));
      dot.setAttribute("aria-hidden", "true");
      host.append(dot);
    }
  });
  var u = $("sUser");
  if (u) u.title = t("account") + (n > 0 ? " (" + n + ")" : "");
}
async function submitFeedback() {
  if (fb.sending) return;
  if (fbSentToday() >= FB_PER_DAY) {
    fb.error = t("fbTooMany");
    renderFeedback();
    return;
  }
  fb.sending = true;
  fb.error = "";
  renderFeedback();
  try {
    var data = {
      kind: "message",
      uid: currentUser.uid,
      role: "student",
      name: shownNames().first || "",
      level: levelOption(profile.level),
      type: fb.type,
      message: fb.text.trim().slice(0, FB_MAX),
      status: "new",
      createdAt: sdkRef.serverTimestamp(),
    };
    if (fb.context) {
      data.chapterId = fb.context.chapterId;
      data.exerciseId = fb.context.exerciseId;
    }
    await sdkRef.addDoc(sdkRef.collection(dbRef, "feedback"), data);
    try {
      localStorage.setItem(fbTodayKey(), String(fbSentToday() + 1));
    } catch (e) {}
    fb.done = true;
    loadInbox();
  } catch (e) {
    console.warn("Couldn’t send the message:", e);
    fb.error = t("fbFailMsg");
  }
  fb.sending = false;
  renderFeedback();
}
var sdkRef = null;
var dbRef = null;
async function sendRating(chapterId, exerciseId, rating) {
  var data = {
    kind: "rating",
    uid: currentUser.uid,
    role: "student",
    name: shownNames().first || "",
    level: levelOption(profile.level),
    chapterId: chapterId,
    exerciseId: exerciseId,
    rating: rating,
    status: "new",
    createdAt: sdkRef.serverTimestamp(),
  };
  await sdkRef.setDoc(sdkRef.doc(dbRef, "feedback", "r_" + currentUser.uid + "_" + chapterId + "_" + exerciseId), data);
}
async function loadRatings(chapterId) {
  var q = sdkRef.query(
    sdkRef.collection(dbRef, "feedback"),
    sdkRef.where("uid", "==", currentUser.uid),
    sdkRef.where("kind", "==", "rating"),
    sdkRef.where("chapterId", "==", chapterId),
  );
  var snap = await sdkRef.getDocs(q);
  var out = {};
  snap.docs.forEach(function (d) {
    var v = d.data();
    if (v.exerciseId && v.rating) out[v.exerciseId] = v.rating;
  });
  return out;
}

/* ---------------- page ---------------- */
function renderPage() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  $("pClose").setAttribute("aria-label", t("close"));
  $("pGear").setAttribute("aria-label", t("settings"));
  $("pGear").title = t("settings");
  $("setClose").setAttribute("aria-label", t("close"));
  $("tClose").setAttribute("aria-label", t("close"));
  if (!currentUser) return;

  var first = shownNames().first;
  paintWeek();
  $("sChaptersTitle").textContent = t("chapters");
  $("rBrandLabel").textContent = t("home");
  $("rBrand").setAttribute("aria-label", t("home"));
  $("rBrand").title = t("home");

  var user = $("sUser");
  user.setAttribute("aria-label", t("account"));
  user.title = t("account");
  user.textContent = "";
  user.append(buildAvatarNode());
  paintTopLang();

  Chapters.render();

  renderPlacementCard();
  if (testIsOpen()) renderTest();
  if (modalIsOpen()) renderModal();
  if (settingsIsOpen()) renderSettings();
  if (fbIsOpen()) renderFeedback();
  if (menuIsOpen()) renderMenu();
  paintNotif();
}

/* ---------------- profile modal ---------------- */
function modalIsOpen() {
  return $("pOverlay").classList.contains("open");
}
// first visit of a new account: the profile form opens by itself (right after the Google account is chosen),
// then the level test is offered
var setupPending = false;
function openSetup() {
  setupPending = true;
  editing = true;
  justSaved = false;
  renderModal();
  $("pOverlay").classList.add("open");
}
function afterSetup() {
  if (!setupPending) return;
  setupPending = false;
  if (placementLoaded && !placement) openTest();
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
  afterSetup();
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

  paintAvatar($("pAvatar"), avatarSrc(), fullName, profile.avatarBg);
  tintCover(avatarSrc(), profile.avatarBg);

  var body = $("pBody");
  body.textContent = "";

  if (!editing) {
    var g = genderText(profile.gender);
    var plDone = placement && placement.status === "done" && placement.total;
    if (profile.level || plDone) {
      var meta = el("div", "profile-meta");
      if (profile.level) meta.append(el("span", "profile-chip", profile.level));
      if (plDone) {
        var pp = placement.correct / placement.total;
        var lb = levelBadge(pp, placement.correct + "/" + placement.total, "profile-chip is-level");
        lb.title = t("pLevelTest");
        meta.append(lb);
      }
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
  if (setupPending) form.append(el("p", "me-welcome", t("profileWelcome")));
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
  var lLabel = el("label", "me-field");
  lLabel.append(el("span", "me-row-label", t("profileLevel")));
  var lSelect = el("select", "me-input");
  var legacy = String(profile.level || "");
  var chosen = levelOption(legacy);
  var optList = [["", "—"]].concat(
    LEVELS.map(function (v) {
      return [v, v];
    }),
  );
  if (legacy && !chosen) optList.push([legacy, legacy]); // keep an old free-text value instead of losing it
  optList.forEach(function (pair) {
    var opt = el("option", "", pair[1]);
    opt.value = pair[0];
    lSelect.append(opt);
  });
  lSelect.value = chosen || legacy;
  lLabel.append(lSelect);
  var errorLine = el("p", "me-hint");

  // ---- profile photo picker ----
  var pending = profile.avatar;
  var pendingBg = profile.avatarBg;
  var photoBox = el("div", "av-box");
  photoBox.append(el("span", "me-row-label", t("profilePhoto")));
  var avRow = el("div", "av-row");
  var avPreview = el("div", "av-preview");
  var avBtns = el("div", "av-btns");
  var fileIn = el("input");
  fileIn.type = "file";
  fileIn.accept = "image/*";
  fileIn.hidden = true;
  function avBtn(label, icon, onClick) {
    var b = el("button", "av-btn");
    b.type = "button";
    b.append(ico(icon, "av-btn-ico"), el("span", "", label));
    b.addEventListener("click", onClick);
    return b;
  }
  var panel = el("div", "av-panel");
  panel.hidden = true;
  function previewNow() {
    var src = pending || (currentUser && currentUser.photoURL) || "";
    var nm = (fFirst.input.value || names.first || "").trim();
    paintAvatar(avPreview, src, nm, pendingBg);
    paintAvatar($("pAvatar"), src, nm, pendingBg);
    tintCover(src, pendingBg);
  }
  function drawGrid() {
    panel.textContent = "";
    var list = AVATARS[gSelect.value];
    if (!list) {
      panel.append(el("p", "av-hint", t("avPickGender")));
      return;
    }
    var grid = el("div", "av-grid");
    list.forEach(function (n) {
      var path = "Images/slide-" + n + ".svg";
      var b = el("button", "av-opt" + (pending === path ? " is-on" : ""));
      b.type = "button";
      b.setAttribute("aria-label", t("avChoose") + " " + n);
      b.setAttribute("aria-pressed", pending === path ? "true" : "false");
      var im = el("img");
      im.alt = "";
      im.src = path;
      b.style.background = AVATAR_BGS[pendingBg || "frost"];
      b.append(im);
      b.addEventListener("click", function () {
        pending = path;
        previewNow();
        drawGrid();
      });
      grid.append(b);
    });
    panel.append(grid);
    panel.append(el("span", "av-bg-label", t("avBg")));
    var sw = el("div", "av-swatches");
    Object.keys(AVATAR_BGS).forEach(function (key) {
      var b = el("button", "av-sw" + ((pendingBg || "frost") === key ? " is-on" : ""));
      b.type = "button";
      b.style.background = AVATAR_BGS[key];
      b.setAttribute("aria-label", key);
      b.setAttribute("aria-pressed", (pendingBg || "frost") === key ? "true" : "false");
      b.addEventListener("click", function () {
        pendingBg = key;
        previewNow();
        drawGrid();
      });
      sw.append(b);
    });
    panel.append(sw);
  }
  var upBtn = avBtn(t("avUpload"), I_UPLOAD, function () {
    fileIn.click();
  });
  var chooseBtn = avBtn(t("avChoose"), I_SMILE, function () {
    panel.hidden = !panel.hidden;
    chooseBtn.classList.toggle("is-open", !panel.hidden);
    if (!panel.hidden) drawGrid();
  });
  avBtns.append(upBtn, chooseBtn);
  if (currentUser && currentUser.photoURL) {
    var gBtn = avBtn(t("avGoogle"), I_GLOBE, function () {
      pending = "";
      previewNow();
      if (!panel.hidden) drawGrid();
    });
    avBtns.append(gBtn);
  }
  fileIn.addEventListener("change", async function () {
    var f = fileIn.files && fileIn.files[0];
    fileIn.value = "";
    if (!f) return;
    try {
      pending = await photoToDataUrl(f);
      errorLine.textContent = "";
      previewNow();
      if (!panel.hidden) drawGrid();
    } catch (e) {
      errorLine.textContent = t("avFail");
    }
  });
  gSelect.addEventListener("change", function () {
    if (!panel.hidden) drawGrid();
  });
  avRow.append(avPreview, avBtns);
  photoBox.append(avRow, panel, fileIn);
  previewNow();
  form.append(photoBox, fFirst.label, fLast.label, gLabel, fPhone.label, lLabel, errorLine);
  var saveBtn = pButton(t("profileSave"), ICON_CHECK, null, "submit");
  form.append(saveBtn);
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    var next = {
      firstName: fFirst.input.value.trim(),
      lastName: fLast.input.value.trim(),
      gender: gSelect.value,
      phone: fPhone.input.value.trim(),
      level: lSelect.value,
      avatar: cleanAvatar(pending),
      avatarBg: cleanBg(pendingBg),
    };
    saveBtn.disabled = true;
    try {
      await saveProfile(next);
      profile = next;
      editing = false;
      justSaved = !setupPending;
      renderPage();
      if (setupPending) {
        closeModal(); // the profile is ready: on to the level test
        return;
      }
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
var test = { step: "intro", i: 0, perm: {}, picks: {}, timeouts: {}, result: null, saveFailed: false, loadFailed: false };

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
  var okShape = function (d) {
    return d && Array.isArray(d.questions) && d.questions.length;
  };
  if (loadRemoteTest) {
    try {
      var remote = await loadRemoteTest();
      if (okShape(remote)) {
        testData = remote;
        return true;
      }
    } catch (e) {
      console.warn("Couldn’t read the placement test from Firestore, using the bundled file:", e);
    }
  }
  try {
    var res = await fetch("data/placement-test.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    var data = await res.json();
    if (!okShape(data)) throw new Error("empty");
    testData = data;
    return true;
  } catch (e) {
    console.warn("Couldn’t load the placement questions:", e);
    return false;
  }
}
function domainLabel(key) {
  if (test && test.kind === "bilan") return (test.labels && test.labels[key]) || (key === "mix" ? t("bMix") : key);
  var d = testData && testData.domains && testData.domains[key];
  if (d && lang === "ar" && d.label_ar) return d.label_ar;
  return d && d.label ? d.label : key;
}
function topicLabel(key) {
  var tp = testData && testData.topics && testData.topics[key];
  if (tp && lang === "ar" && tp.label_ar) return tp.label_ar;
  return tp && tp.label ? tp.label : String(key || "");
}
function domainOf(q) {
  var tp = testData && testData.topics && testData.topics[q.topic];
  return (tp && tp.domain) || q.domain || "programmation";
}
// level code ("2" / "3" / "4") from the profile's level text
function levelCodeOf(v) {
  var opt = levelOption(v);
  var i = LEVELS.indexOf(opt);
  return i < 0 ? "" : String(i + 2);
}
// school year in Tunisia: term 1 = Sep-Dec, term 2 = Jan-Mar, term 3 = Apr-Aug
function currentStage() {
  var m = new Date().getMonth();
  return m >= 8 ? "1" : m <= 2 ? "2" : "3";
}
function blueprintFor(code, stage) {
  var cfg = testData && testData.levels && testData.levels[code];
  return cfg && cfg.stages ? cfg.stages[stage] || cfg.stages["3"] : null;
}
function plannedCount(code, stage) {
  var bp = blueprintFor(code, stage);
  if (!bp) return testData ? testData.questions.length : 10;
  return Object.keys(bp).reduce(function (n, k) {
    return n + bp[k];
  }, 0);
}
// pick the questions: what this level has studied by this term, drawn at random, easy to hard
function buildQuestions(code, stage) {
  var bp = blueprintFor(code, stage);
  if (!bp) return testData.questions.slice();
  var range = (testData.difficulty && testData.difficulty[code]) || [1, 3];
  var chosen = [];
  Object.keys(bp).forEach(function (tp) {
    var all = testData.questions.filter(function (q) {
      return q.topic === tp;
    });
    var inRange = all.filter(function (q) {
      var d = q.d || 2;
      return d >= range[0] && d <= range[1];
    });
    var pool = inRange.length >= bp[tp] ? inRange : all;
    shuffled(pool.length)
      .slice(0, bp[tp])
      .forEach(function (i) {
        chosen.push(pool[i]);
      });
  });
  var tie = {};
  chosen.forEach(function (q) {
    tie[q.id] = Math.random();
  });
  chosen.sort(function (a, b) {
    return (a.d || 2) - (b.d || 2) || tie[a.id] - tie[b.id];
  });
  return chosen;
}
function pctOf(d) {
  return d && d.total ? d.correct / d.total : 0;
}
// One scale for the whole app: under 5/10 weak, 5-6/10 average, 7/10 and up excellent.
function levelKey(p) {
  return p >= 0.7 ? "high" : p >= 0.5 ? "mid" : "low";
}
function levelWord(p) {
  var k = levelKey(p);
  return k === "high" ? t("pLevelHigh") : k === "mid" ? t("pLevelMid") : t("pLevelLow");
}
function levelIcon(p) {
  var k = levelKey(p);
  return k === "high" ? I_TROPHY : k === "mid" ? I_TARGET : I_SPROUT;
}
function levelBadge(p, extra, cls) {
  var b = el("span", "tc-level is-" + levelKey(p) + (cls ? " " + cls : ""));
  b.append(ico(levelIcon(p), "tc-level-ico"), el("span", "", levelWord(p) + (extra ? " · " + extra : "")));
  return b;
}
// Two nested half-rings, like the teacher dashboard gauge: the first domain is the outer ring and
// fills from the left, the second is the inner ring and fills from the right. Overall score in the middle.
function orderedKeys(domains) {
  return Object.keys(domains).sort(function (a, b) {
    return (a === "programmation" ? 0 : 1) - (b === "programmation" ? 0 : 1);
  });
}
function levelGauge(res) {
  var NS = "http://www.w3.org/2000/svg";
  var keys = orderedKeys(res.domains);
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
  mid.append(el("b", "", String(res.correct)), el("small", "", "/ " + res.total));
  var overallBadge = levelBadge(res.total ? res.correct / res.total : 0, "", "lv-overall");
  mid.append(overallBadge);
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
    line.append(el("em", "", d.correct + " / " + d.total), levelBadge(p));
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
    var lastB = lastBilan();
    var cardSub = t("pCardDoneSub");
    if (cycleOk && Cy.isReady(cycle)) cardSub = t("bCardReady");
    else if (lastB) cardSub = tf("bCardLast", { c: lastB.correct, t: lastB.total, d: deltaText(Cy.deltaPoints(lastB, lastB.prev)) });
    ht.append(el("h3", "", cycleOk ? t("bCardTitle") : t("pCardDoneTitle")), el("p", "", cardSub));
    head.append(ht);
    text.append(head);
    var view = pBtn("", "is-ghost is-mini", function () {
      if (lastB) viewBilan(lastB);
      else viewResults();
    });
    view.setAttribute("aria-label", t("pViewResults"));
    view.title = t("pViewResults");
    view.append(ico(I_EYE, "tc-ico"), el("span", "pc-btn-label", t("pViewResults")));
    actions.append(view);
    if (lastB) {
      var plc = pBtn(t("bPlacement"), "is-ghost is-mini", function () {
        viewResults();
      });
      actions.append(plc);
    }
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
  var byId = {};
  testData.questions.forEach(function (q) {
    byId[q.id] = q;
  });
  var qs = (placement.qids || [])
    .map(function (id) {
      return byId[id];
    })
    .filter(Boolean);
  qs.forEach(function (q) {
    var v = placement.answers ? placement.answers[q.id] : undefined;
    picks[q.id] = typeof v === "number" ? v : -1;
  });
  test = { step: "result", i: 0, perm: {}, picks: picks, timeouts: {}, qs: qs, result: placement, saveFailed: false, loadFailed: false };
  if (menuIsOpen()) closeMenu();
  $("tOverlay").classList.add("open");
  renderTest("in");
}

async function openTest() {
  test = { step: "intro", i: 0, perm: {}, picks: {}, timeouts: {}, qs: [], level: levelCodeOf(profile.level), stage: currentStage(), result: null, saveFailed: false, loadFailed: false };
  if (menuIsOpen()) closeMenu();
  if (modalIsOpen()) closeModal();
  $("tOverlay").classList.add("open");
  renderTest("in");
  var ok = await loadTestData();
  test.loadFailed = !ok;
  renderTest();
}
async function closeTest() {
  stopTimer();
  $("tOverlay").classList.remove("open");
  // closing before finishing counts as "skip for now": the test won't pop up again by itself
  if (!placement && savePlacement && !(test && test.kind === "bilan")) {
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
  test.qs.forEach(function (q) {
    var dk = domainOf(q);
    var d = domains[dk] || (domains[dk] = { correct: 0, total: 0 });
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
  if (test.kind === "bilan") return finishBilan();
  var res = scoreTest();
  test.result = res;
  test.step = "result";
  var answers = {};
  test.qs.forEach(function (q) {
    answers[q.id] = typeof test.picks[q.id] === "number" ? test.picks[q.id] : -1;
  });
  var doc = {
    status: "done",
    testId: testData.id || "placement",
    correct: res.correct,
    total: res.total,
    domains: res.domains,
    answers: answers,
    qids: test.qs.map(function (q) {
      return q.id;
    }),
    level: test.level || "",
    stage: test.stage || "",
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
var I_SPROUT = S + '<path d="M12 21v-9"/><path d="M12 12c0-4 2.5-6 7-6 0 4-2.5 6-7 6z"/><path d="M12 15c0-3-2-5-6-5 0 3 2 5 6 5z"/></svg>';
var I_TARGET = S + '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/></svg>';
var I_CLOCK = S + '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2"/><path d="M9.5 3h5"/></svg>';
var I_UPLOAD = S + '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>';
var I_SMILE = S + '<circle cx="12" cy="12" r="9"/><path d="M8.5 14a4.2 4.2 0 0 0 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/></svg>';
var I_ARROW = S + '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
var I_CUBE = S + '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>';
var I_LAYERS = S + '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/></svg>';
var I_FILE = S + '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>';
var I_LOOP = S + '<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/></svg>';
var I_GRID = S + '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>';
var I_PHONE = S + '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>';
var I_TABLET = S + '<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M11 17.5h2"/></svg>';
var I_LAPTOP = S + '<rect x="4.5" y="5" width="15" height="10.5" rx="2"/><path d="M2.5 19h19"/></svg>';
var I_SHIELD = S + '<path d="M12 3 5 6v5.5c0 4.3 2.9 7.6 7 9.5 4.1-1.9 7-5.2 7-9.5V6z"/><path d="m9.2 12 2 2 3.6-4"/></svg>';
var I_PIN = S + '<path d="M12 21s6.5-5.6 6.5-11A6.5 6.5 0 0 0 5.5 10c0 5.4 6.5 11 6.5 11z"/><circle cx="12" cy="10" r="2.2"/></svg>';
var TOPICS = {
  algo: { color: "#032c7b", icon: I_FLOW },
  python: { color: "#0464de", icon: I_TERM },
  html: { color: "#01092d", icon: I_CODE },
  css: { color: "#0464de", icon: I_PALETTE },
  js: { color: "#4aa52f", icon: I_BRACES },
  php: { color: "#032c7b", icon: I_SERVER },
  mysql: { color: "#4aa52f", icon: I_DB },
  modular: { color: "#0464de", icon: I_CUBE },
  records: { color: "#032c7b", icon: I_LAYERS },
  files: { color: "#4aa52f", icon: I_FILE },
  recursion: { color: "#01092d", icon: I_LOOP },
  numeric: { color: "#0464de", icon: I_TARGET },
  binary: { color: "#032c7b", icon: I_GRID },
  arrays: { color: "#0464de", icon: I_GRID },
  sorting: { color: "#4aa52f", icon: I_CHART },
  qt: { color: "#032c7b", icon: I_CARDS },
  integration: { color: "#4aa52f", icon: I_CARDS },
};
function topicOf(key) {
  return TOPICS[key] || { color: "#0464de", icon: I_CODE };
}
var DOMAIN_ICON = { programmation: I_TERM, sti: I_GLOBE };
function levelClass(p) {
  return "is-" + levelKey(p);
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
  stopTimer();
  if (test.kind === "bilan") $("tTitle").textContent = test.step === "result" ? tf("bResultTitle", { n: test.no || 1 }) : t("bTitle");
  else $("tTitle").textContent = test.step === "result" ? t("pResult") : t("pTitle");
  var body = $("tBody");
  body.textContent = "";
  $("tHead").textContent = "";
  $("tHead").hidden = true;
  if (test.step === "intro") (test.kind === "bilan" ? renderBilanIntro : renderIntroCard)(body);
  else if (test.step === "q") renderQuestionCard(body);
  else renderResultCard(body);
  var deckEl = document.querySelector("#tOverlay .deck");
  if (deckEl) deckEl.classList.toggle("no-ghost", test.step === "result");
  if (anim) animateCard("is-entering");
}

function renderIntroCard(body) {
  var hero = el("div", "tc-hero");
  hero.append(ico(I_CARDS, "tc-hero-ico"));
  body.append(hero, el("h3", "tc-h", t("pIntroTitle")), el("p", "tc-p", t("pIntro")));

  // which year the student is in decides which questions they get
  var pick = el("div", "tc-levelpick");
  pick.append(el("span", "tc-levelpick-label", t("pLevelPick")));
  var pills = el("div", "tc-levelpills");
  var start;
  var chips = el("div", "tc-chips");
  function paintChips() {
    chips.textContent = "";
    var n = testData ? plannedCount(test.level, test.stage) : 10;
    [
      [I_CODE, tf("pChipQ", { n: n }), "c1"],
      [I_TARGET, tf("pChipStage", { n: test.stage }), "c1"],
      [I_CLOCK, t("pChipTimed"), "c2"],
      [I_CHECK, t("pChipNoGrade"), "c3"],
    ].forEach(function (c) {
      var chip = el("span", "tc-chip " + c[2]);
      chip.append(ico(c[0]), el("span", "", c[1]));
      chips.append(chip);
    });
  }
  ["2", "3", "4"].forEach(function (code, i) {
    var b = el("button", "tc-pill" + (test.level === code ? " is-on" : ""));
    b.type = "button";
    b.append(el("b", "", ["2ème", "3ème", "4ème"][i]), el("small", "", i === 2 ? "Bac" : "Info"));
    b.addEventListener("click", function () {
      test.level = code;
      pills.querySelectorAll(".tc-pill").forEach(function (x) {
        x.classList.toggle("is-on", x === b);
      });
      paintChips();
      if (start) start.disabled = !testData || test.loadFailed;
    });
    pills.append(b);
  });
  pick.append(pills);
  body.append(pick);
  paintChips();
  body.append(chips);
  if (test.loadFailed) body.append(el("p", "set-msg", t("pLoadFail")));

  var actions = el("div", "test-actions");
  start = pBtn(t("pStart"), "", function () {
    test.qs = buildQuestions(test.level, test.stage);
    test.qs.forEach(function (q) {
      test.perm[q.id] = shuffled(q.choices.length);
    });
    // remember the level on the profile (only once the cloud copy is loaded, so nothing gets overwritten)
    var label = LEVELS[Number(test.level) - 2];
    if (label && label !== profile.level && profileLoaded && saveProfile) {
      var next = Object.assign({}, profile, { level: label });
      saveProfile(next)
        .then(function () {
          profile = next;
          renderPage();
        })
        .catch(function () {});
    }
    leaveThen(function () {
      test.step = "q";
      test.i = 0;
      renderTest("in");
    });
  });
  start.append(ico(I_ARROW, "tc-ico tc-flip"));
  start.disabled = !testData || test.loadFailed || !test.level;
  if (!test.level) start.title = t("pLevelPick");
  actions.append(pBtn(t("pSkip"), "is-ghost", closeTest), start);
  body.append(actions);
}

// Time for one question, from how much there is to read: wording, code lines and answer length.
function timeFor(q) {
  if (typeof q.time === "number" && q.time > 0) return q.time;
  var words = String(q.q || "").split(/\s+/).length;
  var lines = q.code ? String(q.code).split("\n").filter(Boolean).length : 0;
  var chars = (q.choices || []).reduce(function (n, c) {
    return n + String(c).length;
  }, 0);
  var sec = 15 + words * 0.8 + lines * 8 + chars / 20;
  return Math.max(25, Math.min(90, Math.round(sec / 5) * 5));
}
var qTimer = null;
function stopTimer() {
  if (qTimer) {
    clearInterval(qTimer);
    qTimer = null;
  }
}

function renderQuestionCard(body) {
  var qs = test.qs;
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
  badge.append(ico(topic.icon, "tc-topic-ico"), el("span", "tc-topic-name", q._tl || topicLabel(q.topic)), el("span", "tc-topic-dom", q._tl ? "" : " · " + (test.kind === "bilan" ? t("bMix") : domainLabel(domainOf(q)))));
  var right = el("span", "tc-right");
  var clock = el("span", "tc-clock");
  clock.append(ico(I_CLOCK, "tc-clock-ico"), el("b", "", ""));
  right.append(el("span", "tc-count", tf("pQuestion", { n: test.i + 1, total: qs.length })), clock);
  head.append(badge, right);
  var tbar = el("div", "tc-timer");
  var tfill = el("i");
  var trest = el("b");
  tbar.append(tfill, trest);
  fixedHead.append(head, tbar);
  var limit = timeFor(q);
  clock.querySelector("b").textContent = limit + "s";

  var qText = el("p", "tc-q", q.q);
  qText.setAttribute("dir", "ltr");
  body.append(qText);
  if (q.code) {
    var codeBox = el("pre", "test-code");
    codeBox.setAttribute("dir", "ltr");
    numberedCode(codeBox, q.code);
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
    stopTimer();
    tbar.classList.add("is-stopped");
    var ok = value === q.answer;
    var timedOut = !!(test.timeouts && test.timeouts[q.id]);
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
    skip.classList.add(value === -1 && !timedOut ? "is-chosen" : "is-dim");
    segs[test.i].className = "tc-seg " + (ok ? "is-right" : "is-wrong");

    var kind = ok ? "is-right" : value === -1 ? "is-idk" : "is-wrong";
    fb.className = "tc-fb " + kind + (animate ? " pop" : "");
    fb.textContent = "";
    var badgeIcon = ico(ok ? I_CHECK : value === -1 ? I_HELP : I_X, "tc-fb-ico");
    var text = el("div", "tc-fb-text");
    text.append(el("b", "", ok ? t("pRight") : timedOut ? t("pTimeUp") : value === -1 ? t("pNoIdea") : t("pWrong")));
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
  if (test.picks[q.id] !== undefined) {
    reveal(test.picks[q.id], false);
    tfill.style.width = "0";
  } else {
    var endAt = Date.now() + limit * 1000;
    stopTimer();
    qTimer = setInterval(function () {
      if (!document.body.contains(tbar)) return stopTimer();
      var left = Math.max(0, endAt - Date.now());
      var tp = (left / (limit * 1000)) * 100;
      tfill.style.flexBasis = tp.toFixed(1) + "%";
      tfill.style.display = tp <= 0.5 ? "none" : "";
      trest.style.display = tp >= 99.5 ? "none" : "";
      clock.querySelector("b").textContent = Math.ceil(left / 1000) + "s";
      var low = left <= Math.min(10000, limit * 1000 * 0.3);
      tbar.classList.toggle("is-low", low);
      clock.classList.toggle("is-low", low);
      if (left <= 0) {
        stopTimer();
        test.picks[q.id] = -1;
        test.timeouts[q.id] = true;
        reveal(-1, true);
      }
    }, 200);
    tfill.style.width = "100%";
  }
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
  var lk = levelKey(pct);
  var LV = {
    high: { tc: "#4aa52f", g1: "#4f9bff", g2: "#aee37b" },
    mid: { tc: "#0464de", g1: "#6aa9ff", g2: "#cfe3ff" },
    low: { tc: "#e0473e", g1: "#ff8a80", g2: "#ffd0cc" },
  }[lk];
  card.style.setProperty("--tc", LV.tc);
  var moodKey = lk === "high" ? (pct >= 0.9 ? "pPerfect" : "pGreat") : lk === "mid" ? "pGood" : "pKeep";

  var top = el("div", "tc-result-top is-" + lk);
  confetti(top, lk === "high" ? 34 : lk === "mid" ? 14 : 0);

  // animated ring
  var C = 2 * Math.PI * 52;
  var ring = el("div", "tc-ring");
  var NS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 120 120");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML =
    '<defs><linearGradient id="tcGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + LV.g1 + '"/><stop offset="1" stop-color="' + LV.g2 + '"/></linearGradient></defs>' +
    '<circle class="tc-ring-rest" cx="60" cy="60" r="52"/>' +
    '<circle class="tc-ring-fill" cx="60" cy="60" r="52" stroke="url(#tcGrad)"/>';
  var num = el("div", "tc-ring-num");
  var big = el("b", "", "0");
  num.append(big, el("small", "", "/ " + r.total));
  ring.append(svg, num);
  var medal = ico(levelIcon(pct), "tc-medal is-" + lk);
  top.append(ring, medal);
  var moodBox = el("div", "tc-mood-box");
  moodBox.append(el("h3", "tc-h tc-mood", t(moodKey)), levelBadge(pct, r.correct + "/" + r.total, "tc-mood-badge"));
  body.append(top, moodBox);

  // two arcs with round ends and a small gap: the empty part never runs under the filled one.
  // A round cap sticks out half the stroke width past each end of its dash, so each dash is shortened by that on both sides.
  var fillCircle = svg.querySelector(".tc-ring-fill");
  var restCircle = svg.querySelector(".tc-ring-rest");
  var CAPW = 5;
  var GAPW = 9;
  function setArc(c, from, to, visible) {
    c.style.opacity = visible ? "1" : "0";
    c.style.strokeDasharray = Math.max(to - from - 2 * CAPW, 0.01).toFixed(1) + " " + (C * 2).toFixed(1);
    c.style.strokeDashoffset = (-(from + CAPW)).toFixed(1);
  }
  var cut = C * pct;
  setArc(fillCircle, 0, 0, false); // starts empty, then grows
  setArc(restCircle, 0, C, true);
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      if (pct <= 0) {
        setArc(restCircle, 0, C, true);
      } else if (pct >= 1) {
        setArc(fillCircle, 0, C, true);
        setArc(restCircle, C, C, false);
      } else {
        // the same gap at both meeting points: where the fill stops and where the ring starts again at the top
        setArc(fillCircle, GAPW / 2, cut - GAPW / 2, true);
        setArc(restCircle, cut + GAPW / 2, C - GAPW / 2, true);
      }
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
  var tiles = el("div", "tc-tiles" + (Object.keys(r.domains).length === 1 ? " is-one" : ""));
  orderedKeys(r.domains).forEach(function (key, idx) {
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
    if (p < 1) bar.append(el("b", "tc-tile-rest")); // the empty part is its own pill, with a gap after the filled one
    var lvl = levelBadge(p);
    tile.append(th, score, bar, lvl);
    tiles.append(tile);
    setTimeout(function () {
      fill.style.width = p > 0 ? "calc(" + Math.round(p * 100) + "% - " + (p < 1 ? 2 : 0) + "px)" : "0";
      if (p > 0 && p < 1) bar.classList.add("has-fill");
    }, 350 + idx * 120);
  });
  body.append(tiles);

  var keys = Object.keys(r.domains);
  var pcts = keys.map(function (k) {
    return pctOf(r.domains[k]);
  });
  var reco;
  if (test.kind === "bilan") {
    var bd = Cy.deltaPoints(r, test.prev);
    reco = bd === null ? t("bRecoFirst") : bd > 0 ? t("bRecoUp") : bd < 0 ? t("bRecoDown") : t("bRecoFlat");
  } else if (keys.length === 1) reco = pcts[0] >= 0.7 ? t("pRecoOneHigh") : t("pRecoOneLow");
  else if (pcts.every(function (p) { return p >= 0.7; })) reco = t("pRecoBoth");
  else if (pcts.every(function (p) { return p < 0.5; })) reco = t("pRecoLow");
  else {
    var weakest = keys[pcts.indexOf(Math.min.apply(null, pcts))];
    reco = tf("pRecoWeak", { domain: domainLabel(weakest) });
  }
  var banner = el("div", "tc-reco");
  banner.append(ico(I_ROCKET, "tc-reco-ico"), el("span", "", reco));
  if (test.kind === "bilan") renderBilanExtras(body, r);
  body.append(banner);
  if (test.saveFailed) body.append(el("p", "set-msg", t("pSaveFail")));

  var missed = test.qs.filter(function (q) {
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
        numberedCode(codeRev, q.code);
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
  // no "Terminé" button: the cross at the top already closes the result
  if (test.kind === "bilan" && test.fresh) body.append(el("p", "bl-hint bl-newweek", t("bNewWeek")));
}

/* ---------------- weekly bilan: built on the same deck of cards as the level test ---------------- */
function bilanTitleOf(ch) {
  return lang === "ar" && ch.title_ar ? ch.title_ar : ch.title;
}
async function openBilan() {
  if (!cycleOk) return;
  test = { kind: "bilan", step: "intro", i: 0, perm: {}, picks: {}, timeouts: {}, qs: [], result: null, prev: null, labels: {}, building: true, empty: false, saveFailed: false, loadFailed: false };
  if (menuIsOpen()) closeMenu();
  if (modalIsOpen()) closeModal();
  $("tOverlay").classList.add("open");
  renderTest("in");
  var mine = test;
  try {
    await Chapters.ensure();
  } catch (e) {}
  var snap = Chapters.snapshot();
  var banks = {};
  var labels = {};
  var topics = {};
  snap.chapters.forEach(function (ch) {
    if (Array.isArray(ch.quiz) && ch.quiz.length) banks[ch.id] = ch.quiz;
    labels[ch.id] = bilanTitleOf(ch);
    topics[ch.id] = ch.topic;
  });
  var touched = Object.keys(cycle.chapters).sort(function (a, b) {
    return cycle.chapters[b] - cycle.chapters[a];
  });
  var others = Object.keys(snap.status || {}).filter(function (id) {
    var st = snap.status[id] || {};
    return touched.indexOf(id) < 0 && Object.keys(st).some(function (k) {
      return st[k] === "done";
    });
  });
  var avoid = {};
  var last = lastBilan();
  if (last && Array.isArray(last.qids))
    last.qids.forEach(function (id) {
      avoid[id] = true;
    });
  var qs = Cy.pickBilan({ touched: touched, others: others, banks: banks, avoid: avoid, n: 10 }).map(function (q) {
    return Object.assign({}, q, { topic: topics[q._chap] || q.topic, _tl: labels[q._chap] });
  });
  if (!qs.length && (await loadTestData())) {
    // no quiz written for these chapters yet: the level-test questions keep the bilan useful
    qs = buildQuestions(levelCodeOf(profile.level) || "4", currentStage()).map(function (q) {
      return Object.assign({}, q, { _chap: "mix" });
    });
  }
  if (test !== mine) return; // closed while it was loading
  test.qs = qs;
  test.labels = labels;
  test.building = false;
  test.empty = !qs.length;
  renderTest();
}
function renderBilanIntro(body) {
  var hero = el("div", "tc-hero");
  hero.append(ico(I_CHART, "tc-hero-ico"));
  body.append(hero, el("h3", "tc-h", t("bIntroTitle")));
  var actions = el("div", "test-actions");
  if (test.building) {
    body.append(el("p", "tc-p", t("bLoading")));
  } else if (test.empty) {
    body.append(el("p", "tc-p", t("bNoQuestions")));
    actions.append(pBtn(t("pDone"), "is-ghost", closeTest));
    body.append(actions);
    return;
  } else {
    body.append(el("p", "tc-p", t("bIntro")));
    var seen = {};
    test.qs.forEach(function (q) {
      seen[q._chap] = true;
    });
    var chips = el("div", "tc-chips");
    [
      [I_CODE, tf("pChipQ", { n: test.qs.length }), "c1"],
      [I_LAYERS, tf("bChipChap", { n: Object.keys(seen).length }), "c1"],
      [I_CLOCK, t("pChipTimed"), "c2"],
    ].forEach(function (c) {
      var chip = el("span", "tc-chip " + c[2]);
      chip.append(ico(c[0]), el("span", "", c[1]));
      chips.append(chip);
    });
    body.append(chips);
  }
  var start = pBtn(t("bStart"), "", function () {
    test.qs.forEach(function (q) {
      test.perm[q.id] = shuffled(q.choices.length);
    });
    leaveThen(function () {
      test.step = "q";
      test.i = 0;
      renderTest("in");
    });
  });
  start.append(ico(I_ARROW, "tc-ico tc-flip"));
  start.disabled = !!test.building;
  actions.append(pBtn(t("bLater"), "is-ghost", closeTest), start);
  body.append(actions);
}
async function finishBilan() {
  var res = Cy.scoreByChapter(test.qs, test.picks);
  var prevItem = lastBilan();
  test.prev = prevItem ? { correct: prevItem.correct, total: prevItem.total, chapters: prevItem.chapters || {} } : null;
  test.result = res;
  test.step = "result";
  test.fresh = true;
  test.no = prevItem && prevItem.no ? prevItem.no + 1 : bilans.items.length + 1;
  var answers = {};
  test.qs.forEach(function (q) {
    answers[q.id] = typeof test.picks[q.id] === "number" ? test.picks[q.id] : -1;
  });
  var labels = {};
  Object.keys(res.domains).forEach(function (k) {
    if (test.labels && test.labels[k]) labels[k] = test.labels[k];
  });
  var item = {
    no: test.no,
    at: Date.now(),
    correct: res.correct,
    total: res.total,
    chapters: res.domains,
    labels: labels,
    qids: test.qs.map(function (q) {
      return q.id;
    }),
    answers: answers,
    prev: test.prev,
  };
  bilans = { items: bilans.items.concat([item]).slice(-12) };
  cycle = Cy.resetCycle(cycle); // a new week starts now
  renderTest("in");
  paintWeek();
  renderPlacementCard();
  try {
    await saveBilans(bilans);
    await saveCycle(cycle);
  } catch (e) {
    console.warn("Couldn’t save the bilan:", e);
    test.saveFailed = true;
    renderTest();
  }
}
async function viewBilan(item) {
  if (!item) return;
  try {
    await Chapters.ensure();
  } catch (e) {}
  await loadTestData();
  var byId = {};
  var snap = Chapters.snapshot();
  snap.chapters.forEach(function (ch) {
    (Array.isArray(ch.quiz) ? ch.quiz : []).forEach(function (q) {
      byId[q.id] = Object.assign({}, q, { _chap: ch.id, _tl: bilanTitleOf(ch), topic: ch.topic || q.topic });
    });
  });
  if (testData)
    testData.questions.forEach(function (q) {
      if (!byId[q.id]) byId[q.id] = Object.assign({}, q, { _chap: "mix" });
    });
  var qs = (item.qids || [])
    .map(function (id) {
      return byId[id];
    })
    .filter(Boolean);
  var picks = {};
  qs.forEach(function (q) {
    var v = item.answers ? item.answers[q.id] : undefined;
    picks[q.id] = typeof v === "number" ? v : -1;
  });
  test = { kind: "bilan", step: "result", i: 0, perm: {}, picks: picks, timeouts: {}, qs: qs, result: { correct: item.correct, total: item.total, domains: item.chapters || {} }, prev: item.prev || null, labels: item.labels || {}, no: item.no || 1, fresh: false, saveFailed: false, loadFailed: false };
  if (menuIsOpen()) closeMenu();
  $("tOverlay").classList.add("open");
  renderTest("in");
}
function renderBilanExtras(body, r) {
  var prev = test.prev;
  var wrap = el("div", "bl-evo");
  var d = Cy.deltaPoints(r, prev);
  var line = el("p", "bl-delta " + (d === null ? "is-first" : d > 0 ? "is-up" : d < 0 ? "is-down" : "is-same"));
  line.textContent = d === null ? t("bFirst") : d > 0 ? tf("bUpTxt", { d: d }) : d < 0 ? tf("bDownTxt", { d: Math.abs(d) }) : t("bSameTxt");
  wrap.append(line);
  var keys = orderedKeys(r.domains);
  wrap.append(el("p", "bl-sec", t("bEvo")));
  var list = el("div", "bl-list");
  keys.forEach(function (k) {
    var p = pctOf(r.domains[k]);
    var pv = prev && prev.chapters && prev.chapters[k] ? pctOf(prev.chapters[k]) : null;
    var dir = pv === null ? "" : p > pv ? " is-up" : p < pv ? " is-down" : "";
    var row = el("div", "bl-row");
    var head = el("div", "bl-row-head");
    head.append(el("b", "", domainLabel(k)), el("span", "bl-val" + dir, (dir === " is-up" ? "▲ " : dir === " is-down" ? "▼ " : "") + Math.round(p * 100) + "%"));
    var bar = el("div", "bl-bar");
    var fill = el("i", dir.trim());
    fill.style.width = Math.round(p * 100) + "%";
    bar.append(fill);
    if (pv !== null) {
      var mark = el("b", "bl-mark");
      mark.style.insetInlineStart = Math.round(pv * 100) + "%";
      bar.append(mark);
    }
    row.append(head, bar);
    list.append(row);
  });
  wrap.append(list);
  if (prev) wrap.append(el("p", "bl-hint", t("bPrevMark")));
  var weak = keys.filter(function (k) {
    return k !== "mix" && r.domains[k].correct < r.domains[k].total;
  });
  if (weak.length) {
    wrap.append(el("p", "bl-sec", t("bRevoir")));
    weak.forEach(function (k) {
      var row = el("div", "bl-rev");
      row.append(el("span", "", domainLabel(k) + " · " + r.domains[k].correct + "/" + r.domains[k].total));
      var go = el("button", "bl-rev-go", t("bRevoirGo"));
      go.type = "button";
      go.addEventListener("click", function () {
        $("tOverlay").classList.remove("open");
        window.location.hash = "c=" + encodeURIComponent(k);
      });
      row.append(go);
      wrap.append(row);
    });
  }
  body.append(wrap);
}

/* ---------------- avatar menu (phone) ---------------- */
function menuIsOpen() {
  return !$("sMenu").hidden;
}
function closeMenu() {
  $("sMenu").hidden = true;
  $("sUser").setAttribute("aria-expanded", "false");
  if (drawerIsOpen()) closeDrawer();
}

/* ---------------- phone drawer: the rail slides in from the side behind the menu button ---------------- */
var drawerMQ = window.matchMedia("(max-width: 800px)");
function drawerIsOpen() {
  return document.documentElement.classList.contains("s-drawer-open");
}
function openDrawer() {
  if (!drawerMQ.matches) return;
  renderMenu();
  $("sMenu").hidden = false; // on phones the account items are listed inside the drawer
  $("sRail").removeAttribute("inert");
  document.documentElement.classList.add("s-drawer-open");
  $("sMenuBtn").setAttribute("aria-expanded", "true");
  $("sDrawerClose").focus({ preventScroll: true });
}
function closeDrawer() {
  document.documentElement.classList.remove("s-drawer-open");
  $("sMenuBtn").setAttribute("aria-expanded", "false");
  if (drawerMQ.matches) {
    $("sMenu").hidden = true;
    $("sRail").setAttribute("inert", ""); // a closed drawer is out of the tab order
  }
}
function syncDrawerMode() {
  if (drawerMQ.matches) {
    if (!drawerIsOpen()) $("sRail").setAttribute("inert", "");
  } else {
    document.documentElement.classList.remove("s-drawer-open");
    $("sRail").removeAttribute("inert");
    $("sMenu").hidden = true;
    $("sMenuBtn").setAttribute("aria-expanded", "false");
  }
}
function menuItem(label, icon, onClick, badge) {
  var b = el("button");
  b.type = "button";
  b.setAttribute("role", "menuitem");
  var ic = el("span");
  ic.innerHTML = icon; // static, trusted SVG
  b.append(ic.firstChild, el("span", "", label));
  if (badge) b.append(el("span", "menu-badge", String(badge > 9 ? "9+" : badge)));
  b.addEventListener("click", function () {
    closeMenu();
    onClick();
  });
  return b;
}
function setLang(code) {
  lang = code === "ar" ? "ar" : "fr";
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (e) {}
  renderPage();
}
function paintTopLang() {
  var host = $("sTopLang");
  if (!host) return;
  host.textContent = "";
  var sw = el("div", "lang-switch");
  ["fr", "ar"].forEach(function (code) {
    var b = el("button", "lang-btn" + (lang === code ? " active" : ""), code.toUpperCase());
    b.type = "button";
    b.dataset.lang = code;
    b.addEventListener("click", function () {
      setLang(code);
    });
    sw.append(b);
  });
  host.append(sw);
}
function langRow() {
  var row = el("div", "menu-lang");
  row.append(el("span", "menu-lang-label", t("language")));
  var sw = el("div", "lang-switch");
  sw.id = "langSwitch";
  ["fr", "ar"].forEach(function (code) {
    var b = el("button", "lang-btn" + (lang === code ? " active" : ""), code.toUpperCase());
    b.type = "button";
    b.dataset.lang = code;
    b.addEventListener("click", function (e) {
      e.stopPropagation(); // the menu stays open while the language changes
      setLang(code);
    });
    sw.append(b);
  });
  row.append(sw);
  return row;
}
function renderMenu() {
  var m = $("sMenu");
  m.textContent = "";
  m.append(
    menuItem(t("account"), ICON_USER, openModal),
    menuItem(
      t("ideas"),
      ICON_BULB,
      function () {
        openFeedback(null);
      },
      unreadCount(),
    ),
    menuItem(t("settings"), ICON_GEAR, openSettings),
    langRow(),
    menuItem(t("signOut"), ICON_OUT, function () {
      if (signOutNow) signOutNow();
    }),
  );
  m.lastChild.classList.add("is-danger");
}
function onAvatarClick() {
  if (menuIsOpen()) {
    closeMenu();
    return;
  }
  renderMenu();
  $("sMenu").hidden = false;
  $("sUser").setAttribute("aria-expanded", "true");
}

/* ---------------- devices: where the account is open ----------------
   Every browser writes users/{uid}/sessions/{sid}: device type, approximate place, last activity.
   "Sign out" on another device sets revoked:true on THAT device's document. That device is listening
   to it (or checks it the next time it opens) and signs itself out.
   Firebase can't cancel another device's login from a browser, so this is enforced by the app and not
   by Firebase: it is made for "I forgot to log out over there", not for a stolen account. */
var SID_KEY = "classledger:sid";
var GEO_KEY = "classledger:geo";
var NOTICE_KEY = "classledger:notice";
var BEAT_MS = 10 * 60 * 1000; // an open page says "still here" this often
var GEO_TTL_MS = 6 * 60 * 60 * 1000; // look the place up again after 6 hours
var GEO_SERVICES = [
  "https://ipwho.is/?fields=success,city,country,country_code",
  "https://get.geojs.io/v1/ip/geo.json",
];
var sess = {
  active: false,
  sdk: null,
  db: null,
  auth: null,
  user: null,
  sid: "",
  ref: null,
  col: null,
  list: null, // null = not loaded yet
  failed: false,
  unsub: null,
  timer: null,
  lastBeat: 0,
  signInMs: NaN,
  geo: null,
};
var devTick = null;
var devMsg = "";

function deviceId() {
  var id = "";
  try {
    id = localStorage.getItem(SID_KEY) || "";
  } catch (e) {}
  if (!/^[A-Za-z0-9-]{16,64}$/.test(id)) {
    id =
      window.crypto && crypto.randomUUID
        ? crypto.randomUUID()
        : "d-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
    try {
      localStorage.setItem(SID_KEY, id);
    } catch (e) {}
  }
  return id;
}
function deviceHints() {
  var uad = navigator.userAgentData;
  return {
    maxTouchPoints: navigator.maxTouchPoints || 0,
    mobile: uad && typeof uad.mobile === "boolean" ? uad.mobile : undefined,
    brave: !!navigator.brave,
  };
}
async function fetchPlace(url) {
  var ctl = typeof AbortController === "function" ? new AbortController() : null;
  var timer = ctl
    ? setTimeout(function () {
        ctl.abort();
      }, 4500)
    : null;
  try {
    // a plain GET (no custom headers) so the browser doesn't need a CORS preflight
    var res = await fetch(url, {
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: ctl ? ctl.signal : undefined,
    });
    if (!res.ok) return null;
    return normalizeGeo(await res.json()); // keeps city + country only, never the IP
  } catch (e) {
    return null; // offline, blocked by an ad blocker, slow...
  } finally {
    if (timer) clearTimeout(timer);
  }
}
async function lookupGeo() {
  var now = Date.now();
  if (!sess.geo) {
    try {
      var c = JSON.parse(localStorage.getItem(GEO_KEY) || "null");
      var cp = c && typeof c.at === "number" ? normalizeGeo(c.place) : null;
      if (cp) sess.geo = { at: c.at, place: cp };
    } catch (e) {}
  }
  if (sess.geo && now - sess.geo.at < GEO_TTL_MS) return sess.geo.place;
  for (var i = 0; i < GEO_SERVICES.length; i++) {
    var place = await fetchPlace(GEO_SERVICES[i]);
    if (place) {
      sess.geo = { at: now, place: place };
      try {
        localStorage.setItem(GEO_KEY, JSON.stringify(sess.geo));
      } catch (e) {}
      return place;
    }
  }
  return sess.geo ? sess.geo.place : null; // keep the last known place when the lookup fails
}

// write (or refresh) this device's entry; existed=false also stamps createdAt
async function announce(existed) {
  var sdk = sess.sdk;
  var d = parseDevice(navigator.userAgent, deviceHints());
  var place = await lookupGeo();
  var data = {
    type: d.type,
    os: d.os,
    browser: d.browser,
    city: place ? place.city : "",
    country: place ? place.country : "",
    code: place ? place.code : "",
    lastActive: sdk.serverTimestamp(),
    revoked: false, // a fresh start here (see startSessions) cancels an old sign-out request
    revokedAt: sdk.deleteField(),
  };
  if (!existed) data.createdAt = sdk.serverTimestamp();
  sess.lastBeat = Date.now();
  await sdk.setDoc(sess.ref, data, { merge: true });
}

// "still here": only touches lastActive (+ place), so it can never undo a sign-out request from another device
async function beat(force) {
  if (!sess.active || !sess.ref) return;
  var now = Date.now();
  if (!force && now - sess.lastBeat < BEAT_MS / 2) return;
  sess.lastBeat = now;
  var ref = sess.ref;
  try {
    var place = await lookupGeo();
    var data = { lastActive: sess.sdk.serverTimestamp() };
    if (place) {
      data.city = place.city;
      data.country = place.country;
      data.code = place.code;
    }
    await sess.sdk.updateDoc(ref, data);
  } catch (err) {
    if (err && err.code === "not-found" && sess.ref === ref) announce(false).catch(function () {});
  }
}
function onVisible() {
  if (document.visibilityState === "visible") beat(false);
}

function onSessions(snap) {
  if (!sess.active) return;
  var list = [];
  snap.forEach(function (d) {
    list.push(readSession(d.id, d.data()));
  });
  sess.list = list;
  sess.failed = false;
  var me = null;
  list.forEach(function (x) {
    if (x.id === sess.sid) me = x;
  });
  if (me && shouldForceSignOut(me, sess.signInMs)) {
    remoteSignOut();
    return;
  }
  staleIds(list, sess.sid, Date.now()).forEach(function (id) {
    sess.sdk.deleteDoc(sess.sdk.doc(sess.db, "users", sess.user.uid, "sessions", id)).catch(function () {});
  });
  paintDevices();
}

function stopSessions() {
  sess.active = false;
  if (sess.unsub) {
    sess.unsub();
    sess.unsub = null;
  }
  if (sess.timer) {
    clearInterval(sess.timer);
    sess.timer = null;
  }
  document.removeEventListener("visibilitychange", onVisible);
  sess.ref = null;
}

async function startSessions(sdk, db, auth, user) {
  stopSessions();
  sess.active = true;
  sess.sdk = sdk;
  sess.db = db;
  sess.auth = auth;
  sess.user = user;
  sess.sid = deviceId();
  sess.col = sdk.collection(db, "users", user.uid, "sessions");
  sess.ref = sdk.doc(db, "users", user.uid, "sessions", sess.sid);
  sess.signInMs = Date.parse(user.metadata && user.metadata.lastSignInTime);
  sess.list = null;
  sess.failed = false;
  var ref = sess.ref;
  try {
    // 1) another device may have asked this one to sign out while it was closed
    var snap = await sdk.getDoc(ref);
    if (sess.ref !== ref) return;
    var existed = snap.exists();
    if (existed && shouldForceSignOut(readSession(snap.id, snap.data()), sess.signInMs)) {
      remoteSignOut();
      return;
    }
    // 2) say "this device is here"
    await announce(existed);
    if (sess.ref !== ref) return;
    // 3) live list of devices (this is also what notices a sign-out request while the page is open)
    sess.unsub = sdk.onSnapshot(sess.col, onSessions, function (err) {
      console.warn("Couldn’t read the devices list:", err);
      sess.failed = true;
      paintDevices();
    });
    sess.timer = setInterval(function () {
      beat(false);
    }, BEAT_MS);
    document.addEventListener("visibilitychange", onVisible);
  } catch (err) {
    console.warn("Couldn’t register this device:", err);
    sess.failed = true;
    paintDevices();
  }
}

// asked to sign out from another device
async function remoteSignOut() {
  if (!sess.active) return;
  var sdk = sess.sdk;
  var auth = sess.auth;
  var ref = sess.ref;
  stopSessions();
  try {
    sessionStorage.setItem(NOTICE_KEY, "remote"); // the welcome page tells the person why
  } catch (e) {}
  try {
    await sdk.deleteDoc(ref);
  } catch (e) {}
  try {
    await sdk.signOut(auth);
  } catch (e) {}
  window.location.replace("./");
}

// normal sign out on this device: remove its entry first, so it doesn't linger in the list
async function leaveSession() {
  if (!sess.active || !sess.ref) return;
  var sdk = sess.sdk;
  var ref = sess.ref;
  stopSessions();
  try {
    await sdk.deleteDoc(ref);
  } catch (e) {}
}

// ask other devices to sign out (one or many); a device that is already gone is simply skipped
function signOutDevices(ids) {
  var sdk = sess.sdk;
  return Promise.all(
    ids.map(function (id) {
      return sdk
        .updateDoc(sdk.doc(sess.db, "users", sess.user.uid, "sessions", id), {
          revoked: true,
          revokedAt: sdk.serverTimestamp(),
        })
        .catch(function (err) {
          if (!err || err.code !== "not-found") throw err;
        });
    }),
  );
}

// two taps: the first one arms the button, the second one runs it
function confirmButton(label, cls, run) {
  var b = el("button", cls, label);
  b.type = "button";
  var armed = false;
  var timer = null;
  function reset() {
    armed = false;
    b.textContent = label;
    b.classList.remove("is-armed");
  }
  b.addEventListener("click", async function () {
    if (!armed) {
      armed = true;
      devMsg = "";
      b.textContent = t("devSure");
      b.classList.add("is-armed");
      timer = setTimeout(reset, 4000);
      return;
    }
    clearTimeout(timer);
    b.disabled = true;
    b.classList.remove("is-armed"); // a confirmed button must not block the list from repainting
    b.textContent = t("devPending");
    try {
      await run();
    } catch (err) {
      console.warn("Sign-out request failed:", err);
      devMsg = t("devOutFail");
      b.disabled = false;
      reset();
      paintDevices();
    }
  });
  return b;
}

function deviceRow(s, now) {
  var mine = s.id === sess.sid;
  var loc = lang === "ar" ? "ar-TN" : "fr-FR";
  var kind = s.type === "phone" ? "devPhone" : s.type === "tablet" ? "devTablet" : "devComputer";
  var li = el("li", "dev-row" + (mine ? " is-mine" : "") + (s.revoked ? " is-pending" : ""));
  var icon = ico(s.type === "phone" ? I_PHONE : s.type === "tablet" ? I_TABLET : I_LAPTOP, "dev-ico");
  icon.setAttribute("role", "img");
  icon.setAttribute("aria-label", t(kind));

  var main = el("div", "dev-main");
  var title = el("div", "dev-title");
  var name =
    s.browser && s.os ? tf("devBrowserOn", { browser: s.browser, os: s.os }) : s.browser || s.os || t(kind);
  title.append(el("b", "", name));
  if (mine) title.append(el("span", "dev-badge", t("devThis")));

  var meta = el("div", "dev-meta");
  var where = el("span", "dev-where");
  where.append(ico(I_PIN, "dev-pin"), el("span", "", placeLabel(s, loc) || t("devWhereUnknown")));
  var live = mine || isActiveNow(s.lastActive, now);
  var when = el("span", "dev-when" + (live ? " is-live" : ""));
  if (live) when.append(el("i", "dev-dot"));
  when.append(el("span", "", live ? t("devNow") : lastSeenLabel(s.lastActive, now, loc)));
  meta.append(where, when);
  main.append(title, meta);
  if (s.revoked) main.append(el("div", "dev-hint", t("devPendingWait")));
  li.append(icon, main);

  if (!mine) {
    var act = el("div", "dev-act");
    if (s.revoked) act.append(el("span", "dev-pending", t("devPending")));
    else
      act.append(
        confirmButton(t("devOutBtn"), "dev-btn", function () {
          return signOutDevices([s.id]);
        }),
      );
    li.append(act);
  }
  return li;
}

function paintDevices() {
  var host = $("setDevices");
  if (!host || !settingsOpen) return;
  if (host.querySelector(".dev-btn.is-armed")) return; // don't wipe a confirmation in progress
  host.textContent = "";

  var head = el("div", "dev-head");
  var headText = el("div", "dev-head-text");
  headText.append(el("h3", "", t("devTitle")), el("p", "", t("devHint")));
  head.append(ico(I_SHIELD, "dev-head-ico"), headText);
  host.append(head);

  if (sess.failed) {
    host.append(el("p", "set-msg", t("devFail")));
    return;
  }
  if (!sess.list) {
    host.append(el("p", "me-hint", t("devLoading")));
    return;
  }
  var now = Date.now();
  var rows = sortSessions(sess.list, sess.sid);
  var list = el("ul", "dev-list");
  list.setAttribute("aria-label", t("devTitle"));
  rows.slice(0, MAX_SHOWN).forEach(function (s) {
    list.append(deviceRow(s, now));
  });
  host.append(list);

  var others = rows.filter(function (s) {
    return s.id !== sess.sid && !s.revoked;
  });
  if (!others.length) host.append(el("p", "dev-none", t("devNone")));
  else if (others.length > 1)
    host.append(
      confirmButton(t("devOutAll"), "dev-btn dev-btn-all", function () {
        return signOutDevices(
          others.map(function (s) {
            return s.id;
          }),
        );
      }),
    );
  if (devMsg) host.append(el("p", "set-msg", devMsg));
  host.append(el("p", "dev-note", t("devGeoNote")));
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
  if (devTick) clearInterval(devTick);
  devTick = setInterval(paintDevices, 30000); // keeps "5 minutes ago" fresh while the box is open
}
function closeSettings() {
  $("setOverlay").classList.remove("open");
  settingsOpen = false;
  settingsText = "";
  devMsg = "";
  if (devTick) {
    clearInterval(devTick);
    devTick = null;
  }
}
function renderSettings() {
  $("setTitle").textContent = t("settings");
  var body = $("setBody");
  body.textContent = "";

  // where the account is open (live list, filled by paintDevices)
  var devHost = el("section", "dev-section");
  devHost.id = "setDevices";
  body.append(devHost);
  paintDevices();

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
  $("sUser").addEventListener("click", onAvatarClick);
  $("rBrand").addEventListener("click", function () {
    closeMenu();
    Chapters.home();
  });
  $("sPhoneLogo").addEventListener("click", function () {
    Chapters.home();
  });
  $("fbClose").addEventListener("click", closeFeedback);
  $("fbOverlay").addEventListener("click", function (e) {
    if (e.target === $("fbOverlay")) closeFeedback();
  });
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
    if (!drawerMQ.matches && menuIsOpen() && !e.target.closest(".student-user-wrap")) closeMenu();
  });
  $("sMenuBtn").addEventListener("click", function () {
    if (drawerIsOpen()) closeDrawer();
    else openDrawer();
  });
  $("sDrawerClose").addEventListener("click", closeDrawer);
  $("sScrim").addEventListener("click", closeDrawer);
  $("rNav").addEventListener("click", closeDrawer); // choosing Course / Exercises / Notes closes the drawer
  window.addEventListener("hashchange", closeDrawer);
  if (drawerMQ.addEventListener) drawerMQ.addEventListener("change", syncDrawerMode);
  else if (drawerMQ.addListener) drawerMQ.addListener(syncDrawerMode);
  syncDrawerMode();
  $("pOverlay").addEventListener("click", function (e) {
    if (e.target === $("pOverlay")) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (fbIsOpen()) closeFeedback();
    else if (settingsIsOpen()) closeSettings();
    else if (testIsOpen()) $("tClose").click();
    else if (modalIsOpen()) closeModal();
    else if (drawerIsOpen()) closeDrawer();
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

  signOutNow = async function () {
    await leaveSession(); // remove this device from the list first
    return sdk.signOut(auth);
  };

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
    sdkRef = sdk;
    dbRef = db;
    loadInbox();
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) loadInbox();
    });
    setInterval(function () {
      if (!document.hidden) loadInbox();
    }, 120000);
    Chapters.init({
      sdk: sdk,
      db: db,
      uid: u.uid,
      getLang: function () {
        return lang;
      },
      getLevel: function () {
        return levelCodeOf(profile.level);
      },
      ready: function () {
        return profileLoaded;
      },
      topicOf: topicOf,
      onDone: recordStudyDay,
      sendRating: sendRating,
      loadRatings: loadRatings,
      openFeedback: openFeedback,
      me: function () {
        return { first: shownNames().first, avatar: buildAvatarNode(), level: levelOption(profile.level) };
      },
      subjectIcon: function (sub) {
        return sub === "sti" ? I_GLOBE : I_TERM;
      },
    });
    $("studentApp").hidden = false;
    renderPage();
    startSessions(sdk, db, auth, u); // devices list (runs on its own, never blocks the page)

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
      stopSessions(); // otherwise the "still here" signal would write the device entry back after the delete
      try {
        var prog = await sdk.getDocs(sdk.collection(db, "users", uid, "progress"));
        var notesSnap = await sdk.getDocs(sdk.collection(db, "users", uid, "notes"));
        var devs = await sdk.getDocs(sdk.collection(db, "users", uid, "sessions"));
        var refs = prog.docs
          .concat(notesSnap.docs)
          .concat(devs.docs)
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
      } catch (err) {
        startSessions(sdk, db, auth, u); // the account is still there: keep the devices list running
        throw err;
      }
    };
    loadRemoteTest = async function () {
      var snap = await sdk.getDoc(sdk.doc(db, "tests", "placement"));
      return snap.exists() ? snap.data() : null;
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
    var cycleRef = sdk.doc(db, "users", u.uid, "progress", "cycle");
    var bilansRef = sdk.doc(db, "users", u.uid, "progress", "bilans");
    saveCycle = function (c) {
      return sdk.setDoc(cycleRef, Object.assign({}, c, { updatedAt: sdk.serverTimestamp() }));
    };
    saveBilans = function (b) {
      return sdk.setDoc(bilansRef, Object.assign({}, b, { updatedAt: sdk.serverTimestamp() }));
    };
    try {
      var cs = await sdk.getDoc(cycleRef);
      cycle = Cy.normalizeCycle(cs.exists() ? cs.data() : null);
      var bs = await sdk.getDoc(bilansRef);
      bilans = Cy.normalizeBilans(bs.exists() ? bs.data() : null);
      cycleOk = true;
    } catch (e) {
      console.warn("Couldn’t load the study days:", e); // no counter this time rather than a wrong one
    }
    paintWeek();
    renderPlacementCard();
    var profileChecked = false;
    try {
      var ps = await sdk.getDoc(profileRef);
      profileChecked = true;
      if (ps.exists()) {
        var d = ps.data();
        profile = {
          firstName: String(d.firstName || ""),
          lastName: String(d.lastName || ""),
          gender: d.gender === "male" || d.gender === "female" ? d.gender : "",
          phone: String(d.phone || ""),
          level: String(d.level || ""),
          avatar: cleanAvatar(d.avatar),
          avatarBg: cleanBg(d.avatarBg),
        };
      }
    } catch (e) {
      console.warn("Couldn’t load the student profile:", e);
    }
    profileLoaded = true;
    renderPage();
    // a new account (no name and no level saved yet): the profile form comes first, asked once per account on this device
    var setupKey = "cl.setup." + u.uid;
    var seenSetup = false;
    try {
      seenSetup = !!window.localStorage.getItem(setupKey);
    } catch (e) {}
    if (profileChecked && !seenSetup && !profile.firstName && !profile.lastName && !profile.level) {
      try {
        window.localStorage.setItem(setupKey, "1");
      } catch (e) {}
      openSetup();
    } else if (!placement) openTest(); // first visit: offer the test once (skippable)
  });
}

main().catch(function (e) {
  console.warn("Classek student page failed to start:", e);
  window.location.replace("./");
});
