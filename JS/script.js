(function () {
  "use strict";

  var STORAGE_KEY = "classledger:students";
  var GROUPS_KEY = "classledger:groups";
  var LANG_KEY = "classledger:lang";
  var MONTH_END_NOTICE_KEY = "classledger:month-end-notice-read";

  var LEVELS = [
    "7 أساسي",
    "8 أساسي",
    "9 أساسي",
    "1 ثانوي",
    "2 ثانوي",
    "3 ثانوي",
    "4 ثانوي",
  ];
  var LEVEL_CATEGORY = {
    "7 أساسي": "college",
    "8 أساسي": "college",
    "9 أساسي": "college",
    "1 ثانوي": "lycee",
    "2 ثانوي": "lycee",
    "3 ثانوي": "lycee",
    "4 ثانوي": "lycee",
  };
  var LEVEL_SHORT_LABELS = {
    en: {
      "7 أساسي": "7th Grade",
      "8 أساسي": "8th Grade",
      "9 أساسي": "9th Grade",
      "1 ثانوي": "1st Lycée",
      "2 ثانوي": "2nd Lycée",
      "3 ثانوي": "3rd Lycée",
      "4 ثانوي": "4th / Bac",
    },
    ar: {
      "7 أساسي": "7 أساسي",
      "8 أساسي": "8 أساسي",
      "9 أساسي": "9 أساسي",
      "1 ثانوي": "1 ثانوي",
      "2 ثانوي": "2 ثانوي",
      "3 ثانوي": "3 ثانوي",
      "4 ثانوي": "4 ثانوي",
    },
  };
  var LEVEL_LABELS = {
    en: {
      "7 أساسي": "7th Grade",
      "8 أساسي": "8th Grade",
      "9 أساسي": "9th Grade",
      "1 ثانوي": "1st Form (Lycée)",
      "2 ثانوي": "2nd Form (Lycée)",
      "3 ثانوي": "3rd Form (Lycée)",
      "4 ثانوي": "4th Form / Bac",
    },
    ar: {
      "7 أساسي": "7 أساسي",
      "8 أساسي": "8 أساسي",
      "9 أساسي": "9 أساسي",
      "1 ثانوي": "1 ثانوي",
      "2 ثانوي": "2 ثانوي",
      "3 ثانوي": "3 ثانوي",
      "4 ثانوي": "4 ثانوي",
    },
  };

  var STR = {
    en: {
      navStudents: "Students",
      navCalendar: "Calendar",
      sidebarTotal: "enrolled students",
      pageTitleStudents: "Students",
      pageTitleCalendar: "Calendar",
      heroMorning: "Good morning 👋",
      heroDay: "Hello 👋",
      heroEvening: "Good evening 👋",
      heroText:
        "Track your students, add new ones, and keep every detail in one place.",
      statTotal: "Total students",
      kpiCollege: "Collège",
      kpiLycee: "Lycée",
      distributionTitle: "Collège vs Lycée",
      byLevelTitle: "Students per level",
      searchPlaceholder: "Search by first or last name...",
      allLevels: "All levels",
      addStudent: "+ Add student",
      thName: "Name",
      thLevel: "Level",
      thStart: "Start date",
      thEnd: "End date",
      thNotes: "Notes",
      edit: "Edit",
      delete: "Delete",
      editPurpose: "Edit the student's name, level, dates, or notes.",
      deletePurpose:
        "Permanently delete the student and their payment history.",
      emptyNoneTitle: "No students yet",
      emptyNoneText: "Add your first student to get started.",
      emptyFilterTitle: "No results",
      emptyFilterText: "Try a different search or level.",
      modalAddTitle: "Add student",
      modalEditTitle: "Edit student",
      studentAdded: "Student added.",
      studentUpdated: "Student information updated.",
      studentDeleted: "Student deleted.",
      stopStudying: "Stop studying",
      resumeStudying: "Resume studying",
      stoppedBadge: "Stopped",
      studentStopped: "Studies stopped.",
      studentResumed: "Studies resumed. A new month starts today.",
      stopConfirm: function (name) {
        return (
          "Stop " +
          name +
          "'s studies? They will be left out of payments, the calendar and the totals. You can resume anytime."
        );
      },
      resumeConfirm: function (name) {
        return "Resume " + name + "'s studies? A new month starts today.";
      },
      firstName: "First name",
      lastName: "Last name",
      level: "Level",
      gender: "Gender",
      genderPlaceholder: "Select...",
      genderMale: "Male",
      genderFemale: "Female",
      startDate: "Start date",
      endDate: "End date",
      optional: "(optional)",
      endDateHint:
        "Auto-set to 1 month after the start date (minus 1 day) — you can change it.",
      notes: "Notes",
      noteBadge: "Note",
      notesPlaceholder: "Any extra info about the student...",
      cancel: "Cancel",
      add: "Add",
      saveChanges: "Save changes",
      viewDetails: "Details",
      deleteConfirm: function (name) {
        return "Delete " + name + "? This can't be undone.";
      },
      detailsTitlePrefix: "",
      close: "Close",
      today: "Today",
      dow: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      dowFull: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      eventsTitle: "Day events",
      legendStart: "Start of studies",
      legendEnd: "End of studies",
      legendStudy: "Group study day",
      noEventsTitle: "No events",
      noEventsText: "Pick another day or add an end date for a student.",
      monthEndTitle: "Ended student months",
      monthEndEmpty: "No student monthly cycles have ended.",
      monthEndViewEvent: function (date, names) {
        return "View events on " + date + " for " + names;
      },
      group: "Groups",
      groupsTitle: "Groups",
      groupsHint: "Assign students, then filter calendar events by group.",
      newGroupPlaceholder: "New group name",
      addGroup: "Add",
      allGroups: "All groups",
      noGroups: "No groups yet",
      groupStudentCount: function (count) {
        return count + (count === 1 ? " student" : " students");
      },
      groupMemberHint:
        "A student can join one study-days group and one price group. Another group of the same type is disabled.",
      groupAssignedTo: "Assigned to {group}",
      groupMembershipConflict:
        "A student can only belong to one group of each type.",
      groupAlsoIn: "Also in {groups}",
      groupModeDays: "Study days (Mon-Sat)",
      groupModePrice: "Monthly price",
      groupStatStudents: "Students",
      groupStatDays: "Days / week",
      groupStatPrice: "Monthly price",
      groupStatTotal: "Monthly total",
      groupStatNext: "Next session",
      groupStudyDaysTitle: "Study days",
      groupMembersTitle: "Students",
      groupNoMembers: "No students in this group yet.",
      groupModeLabel: "Group setup",
      groupEditTitle: "Edit group",
      groupNameLabel: "Group name",
      groupStudentsLabel: "Students",
      groupSaved: "Group updated.",
      groupPriceInvalid: "Enter a valid monthly fee.",
      groupSummaryDays: function (days) {
        return "Study days: " + days;
      },
      groupSummaryNoDays: "No study days selected",
      groupSummaryPrice: function (price) {
        return "Monthly fee per student: " + price + " DT";
      },
      groupStudySchedule:
        "Choose one or more study days from Monday through Saturday. Sunday is off.",
      groupMonthlyFee: "Monthly fee per student",
      deleteGroup: "Delete group",
      deleteGroupConfirm: function (name) {
        return (
          "Delete group " + name + "? Its students will become unassigned."
        );
      },
      groupsAdded: "Group added.",
      groupDeleted: "Group deleted.",
      groupExists: "That group already exists.",
      clearAllConfirm:
        "Delete all students and their data? This can't be undone.",
      clearAllSuccess: "All data cleared.",
      clearAllButton: "Clear all data",
      exportData: "Export data",
      importData: "Import data",
      importConfirm: "Import {count} students and replace the current data?",
      importSuccess: "Data imported successfully.",
      importError: "This file is not a valid ClassLedger backup.",
      importLoadingTitle: "Importing…",
      importLoadingText: "Checking your backup file.",
      importDoneTitle: "Import complete",
      importDoneText: "{students} students and {groups} groups imported.",
      importFailTitle: "Import failed",
      exportLoadingTitle: "Exporting…",
      exportLoadingText: "Preparing your backup file.",
      exportDoneTitle: "Backup exported",
      exportDoneText: "{students} students and {groups} groups saved to your device.",
      exportFailTitle: "Export failed",
      exportFailText: "Couldn't create the backup file.",
      clearLoadingTitle: "Clearing data…",
      clearLoadingText: "Removing students and groups.",
      clearDoneTitle: "Data cleared",
      clearDoneText: "{students} students and {groups} groups removed.",
      clearFailTitle: "Couldn't clear data",
      clearFailText: "Something went wrong. Nothing was changed.",
      exportSuccess: "Backup file downloaded.",
      saveError: "Could not save data in this browser.",
      toastSuccessTitle: "Success",
      toastErrorTitle: "Error",
      navPayments: "Payments",
      pageTitlePayments: "Payments",
      profileEdit: "Edit",
      profileSave: "Save",
      netOfflineTitle: "No internet connection",
      netOfflineText: "Your data is safe on this device and will sync when you're back online.",
      netOnlineTitle: "Back online",
      netOnlineText: "The connection is restored.",
      profileFirstName: "First name",
      profileLastName: "Last name",
      profileGender: "Gender",
      profilePhone: "Phone",
      profileSubject: "Subject / specialty",
      profileEmail: "Email",
      profileNoName: "Add your name",
      profileNotSet: "Not set",
      profileSaved: "Your profile was saved.",
      profileSyncing: "Loading your details from the cloud…",
      createTitle: "Create your account",
      createIntro: "Fill in your details, then continue with Google. Your account is created with them.",
      createContinue: "Continue with Google",
      kpiMonthlyIncome: "Monthly income",
      kpiPaidAmount: "Paid amount",
      kpiUnpaidAmount: "Unpaid amount",
      paymentsRosterTitle: "Student payments",
      paymentMonthlyFee: "Monthly fee",
      paymentAmountDue: "Amount due",
      paymentHistoryTitle: "Payment history",
      paymentHistoryEmpty: "No payments recorded yet.",
      halfMonthPaymentType: "Half-month charge",
      paymentDateLabel: "Paid on",
      paymentOnTime: "On time",
      paymentSlightlyLate: "Slightly late",
      paymentVeryLate: "Very late",
      dueOn: "Due",
      dtSuffix: "DT",
      statusOverdue: "Overdue",
      statusPaidUp: "Paid up",
      statusAmountDue: "Amount due",
      statusInProgress: "Current cycle",
      markPaid: "Mark paid",
      markPaidConfirm: function (name, amount) {
        return (
          "Record " +
          name +
          " as paid for " +
          amount +
          " DT? This clears overdue monthly fees and half-month charges."
        );
      },
      markPaidSuccess: "Payment recorded.",
      halfMonthTitle: "Half-month calculator",
      halfMonthHint:
        "Choose students to add half of their monthly fee to the amount due.",
      halfMonthCalculate: "Add to amount due",
      halfMonthAddedTitle: "Added to amount due",
      halfMonthAddSuccess: function (count, amount) {
        return count + " half-month charge(s) added. Total: " + amount + " DT.";
      },
      halfMonthPickerLabel: "Select students",
      halfMonthDialogTitle: "Select students",
      halfMonthDone: "Done",
      halfMonthAll: "All",
      halfMonthAllSelected: "All students selected",
      halfMonthSelectedCount: function (count) {
        return count + " selected";
      },
      halfMonthNoStudents: "No students to select.",
      halfMonthAllLabel: "Select all students",
      halfMonthStudentLabel: function (name) {
        return "Select " + name;
      },
      halfMonthResultTitle: "Half-month amounts",
      halfMonthTotal: "Total",
      halfMonthModeHalf: "Half month",
      halfMonthModeCustom: "Custom amount",
      halfMonthAmountLabel: "Amount for each selected student",
      halfMonthAmountPlaceholder: "Amount",
      thTimeLeft: "Time left",
      moreActions: "More actions",
      daysLeft: function (n) {
        return n + (n === 1 ? " day left" : " days left");
      },
      endsToday: "Ends today",
      daysOverdue: function (n) {
        return n + (n === 1 ? " day overdue" : " days overdue");
      },
      customChargeType: "Custom charge",
      customChargeAddSuccess: function (count, amount) {
        return count + " charge(s) added. Total: " + amount + " DT.";
      },
      locale: "en-GB",
    },
    ar: {
      navStudents: "قائمة التلاميذ",
      navCalendar: "التقويم",
      sidebarTotal: "تلميذ مسجّل",
      pageTitleStudents: "قائمة التلاميذ",
      pageTitleCalendar: "التقويم",
      heroMorning: "صباح الخير 👋",
      heroDay: "مرحبا 👋",
      heroEvening: "مساء الخير 👋",
      heroText:
        "تابع تلاميذك، زيد الجداد، وأرشيف كل معلومة تحتاجها في مكان وحد.",
      statTotal: "مجموع التلاميذ",
      kpiCollege: "إعدادي",
      kpiLycee: "ثانوي",
      distributionTitle: "إعدادي مقابل ثانوي",
      byLevelTitle: "التلاميذ حسب القسم",
      searchPlaceholder: "ابحث بالاسم أو اللقب...",
      allLevels: "كل الأقسام",
      addStudent: "+ إضافة تلميذ",
      thName: "الاسم واللقب",
      thLevel: "القسم",
      thStart: "تاريخ البداية",
      thEnd: "تاريخ الانتهاء",
      thNotes: "ملاحظات",
      edit: "تعديل",
      delete: "حذف",
      editPurpose: "تعديل الاسم أو القسم أو التواريخ أو الملاحظات.",
      deletePurpose: "حذف التلميذ وسجل خلاصه نهائيًا.",
      emptyNoneTitle: "ما فماش تلاميذ ثما",
      emptyNoneText: "زيد أول تلميذ باش تبدا في التسيير.",
      emptyFilterTitle: "ما فماش نتائج",
      emptyFilterText: "جرّب كلمة بحث أو قسم آخر.",
      modalAddTitle: "إضافة تلميذ",
      modalEditTitle: "تعديل معلومات التلميذ",
      studentAdded: "تضاف التلميذ.",
      studentUpdated: "تعدّلت معلومات التلميذ.",
      studentDeleted: "تحذف التلميذ.",
      stopStudying: "وقّف الدراسة",
      resumeStudying: "رجّع الدراسة",
      stoppedBadge: "موقوف",
      studentStopped: "توقفت الدراسة.",
      studentResumed: "رجعت الدراسة. شهر جديد يبدا اليوم.",
      stopConfirm: function (name) {
        return (
          "توقّف الدراسة متاع " +
          name +
          "؟ ما يظهرش في المدفوعات والتقويم والإحصائيات، وتنجم ترجّعو وقت ما تحب."
        );
      },
      resumeConfirm: function (name) {
        return "ترجّع الدراسة متاع " + name + "؟ شهر جديد يبدا اليوم.";
      },
      firstName: "الاسم",
      lastName: "اللقب",
      level: "القسم",
      gender: "الجنس",
      genderPlaceholder: "اختر...",
      genderMale: "ذكر",
      genderFemale: "أنثى",
      startDate: "تاريخ بداية الدراسة",
      endDate: "تاريخ الانتهاء",
      optional: "(اختياري)",
      endDateHint:
        "يتحسب تلقائيًا: شهر بعد تاريخ البداية ناقص يوم — تنجم تبدّلو.",
      notes: "ملاحظات",
      noteBadge: "ملاحظة",
      notesPlaceholder: "أي معلومة إضافية على التلميذ...",
      cancel: "إلغاء",
      add: "إضافة",
      saveChanges: "حفظ التعديلات",
      viewDetails: "التفاصيل",
      deleteConfirm: function (name) {
        return "تأكد باش تحذف " + name + "؟";
      },
      detailsTitlePrefix: "",
      close: "إغلاق",
      today: "اليوم",
      dow: ["إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت", "أحد"],
      dowFull: [
        "الاثنين",
        "الثلاثاء",
        "الأربعاء",
        "الخميس",
        "الجمعة",
        "السبت",
        "الأحد",
      ],
      eventsTitle: "أحداث اليوم",
      legendStart: "بداية الدراسة",
      legendEnd: "نهاية الدراسة",
      legendStudy: "يوم دراسة للمجموعة",
      noEventsTitle: "ما فماش أحداث",
      noEventsText: "اختر يوم آخر أو زيد تاريخ انتهاء لتلميذ.",
      monthEndTitle: "انتهت أشهر التلامذة",
      monthEndEmpty: "ما فماش دورات شهرية وفات توا.",
      monthEndViewEvent: function (date, names) {
        return "عرض أحداث " + date + " للتلامذة: " + names;
      },
      group: "المجموعات",
      groupsTitle: "المجموعات",
      groupsHint: "عيّن التلامذة للمجموعات وفلتر أحداث التقويم.",
      newGroupPlaceholder: "اسم مجموعة جديدة",
      addGroup: "إضافة",
      allGroups: "كل المجموعات",
      noGroups: "ما فماش مجموعات",
      groupStudentCount: function (count) {
        return count === 1 ? "تلميذ واحد" : count + " تلامذة";
      },
      groupMemberHint:
        "التلميذ ينجم يكون في مجموعة أيام ومجموعة سعر؛ مجموعة أخرى من نفس النوع تكون مطفية.",
      groupAssignedTo: "مربوط بـ {group}",
      groupMembershipConflict: "التلميذ ينجم يكون في مجموعة وحدة من كل نوع.",
      groupAlsoIn: "وزادة في {groups}",
      groupModeDays: "أيام دراسة (الاثنين-السبت)",
      groupModePrice: "سعر شهري",
      groupStatStudents: "التلاميذ",
      groupStatDays: "أيام / أسبوع",
      groupStatPrice: "السعر الشهري",
      groupStatTotal: "المجموع الشهري",
      groupStatNext: "الحصة الجاية",
      groupStudyDaysTitle: "أيام الدراسة",
      groupMembersTitle: "التلاميذ",
      groupNoMembers: "ما فما حتى تلميذ في المجموعة هاذي.",
      groupModeLabel: "نوع المجموعة",
      groupEditTitle: "تعديل المجموعة",
      groupNameLabel: "اسم المجموعة",
      groupStudentsLabel: "التلامذة",
      groupSaved: "تم تعديل المجموعة.",
      groupPriceInvalid: "أدخل معلومًا شهريًا صحيحًا.",
      groupSummaryDays: function (days) {
        return "أيام الدراسة: " + days;
      },
      groupSummaryNoDays: "ما تحدد حتى نهار دراسة",
      groupSummaryPrice: function (price) {
        return "المعلوم الشهري لكل تلميذ: " + price + " د.ت";
      },
      groupStudySchedule: "اختار نهار ولا أكثر من الاثنين للسبت، والأحد راحة.",
      groupMonthlyFee: "المعلوم الشهري لكل تلميذ",
      deleteGroup: "حذف المجموعة",
      deleteGroupConfirm: function (name) {
        return "تحذف مجموعة " + name + "؟ التلامذة متاعها يولو بلا مجموعة.";
      },
      groupsAdded: "تضافت المجموعة.",
      groupDeleted: "تحذفت المجموعة.",
      groupExists: "المجموعة هاذي موجودة من قبل.",
      clearAllConfirm:
        "تأكد باش تحذف التلامذة الكل ومعلوماتهم؟ العملية ما تتراجعش.",
      clearAllSuccess: "تم مسح جميع البيانات.",
      clearAllButton: "مسح جميع البيانات",
      exportData: "إخراج البيانات",
      importData: "إدخال البيانات",
      importConfirm: "باش تدخل {count} تلامذة وتعوّض البيانات الحالية؟",
      importSuccess: "تم إدخال البيانات بنجاح.",
      importError: "الملف هذا موش نسخة احتياطية صالحة لـ ClassLedger.",
      importLoadingTitle: "جاري الإدخال…",
      importLoadingText: "نثبّت في ملف النسخة الاحتياطية.",
      importDoneTitle: "تم الإدخال",
      importDoneText: "تم إدخال {students} تلميذ و{groups} مجموعة.",
      importFailTitle: "فشل الإدخال",
      exportLoadingTitle: "جاري التصدير…",
      exportLoadingText: "نجهّزو ملف النسخة الاحتياطية.",
      exportDoneTitle: "تم التصدير",
      exportDoneText: "تم حفظ {students} تلميذ و{groups} مجموعة على جهازك.",
      exportFailTitle: "فشل التصدير",
      exportFailText: "ما نجّمناش نكوّنو ملف النسخة الاحتياطية.",
      clearLoadingTitle: "جاري المسح…",
      clearLoadingText: "نحيّو التلامذة والمجموعات.",
      clearDoneTitle: "تم مسح البيانات",
      clearDoneText: "تم حذف {students} تلميذ و{groups} مجموعة.",
      clearFailTitle: "فشل المسح",
      clearFailText: "صار مشكل. ما تبدّل شيء.",
      exportSuccess: "تم تحميل ملف النسخة الاحتياطية.",
      saveError: "تعذّر حفظ البيانات في هذا المتصفح.",
      toastSuccessTitle: "تم بنجاح",
      toastErrorTitle: "خطأ",
      navPayments: "المدفوعات",
      pageTitlePayments: "المدفوعات",
      profileEdit: "تعديل",
      profileSave: "حفظ",
      netOfflineTitle: "ما فماش إنترنت",
      netOfflineText: "بياناتك محفوظة في الجهاز وتتزامن كي ترجع الشبكة.",
      netOnlineTitle: "رجع الإنترنت",
      netOnlineText: "الاتصال رجع عادي.",
      profileFirstName: "الاسم",
      profileLastName: "اللقب",
      profileGender: "الجنس",
      profilePhone: "الهاتف",
      profileSubject: "المادة / الاختصاص",
      profileEmail: "الإيميل",
      profileNoName: "زيد اسمك",
      profileNotSet: "موش محدد",
      profileSaved: "تم حفظ البروفايل.",
      profileSyncing: "جاري تحميل معلوماتك من السحابة…",
      createTitle: "إنشاء حساب",
      createIntro: "عمّر معلوماتك ثم كمّل بحساب Google. يتكوّن حسابك بيهم.",
      createContinue: "المتابعة بحساب Google",
      kpiMonthlyIncome: "الدخل الشهري",
      kpiPaidAmount: "المبلغ المدفوع",
      kpiUnpaidAmount: "المتبقي غير المدفوع",
      paymentsRosterTitle: "خلاص التلامذة",
      paymentMonthlyFee: "المعلوم الشهري",
      paymentAmountDue: "المبلغ المطلوب",
      paymentHistoryTitle: "سجل الدفعات",
      paymentHistoryEmpty: "ما تسجلت حتى دفعة قبل.",
      halfMonthPaymentType: "معلوم نصف شهر",
      paymentDateLabel: "تاريخ الدفع",
      paymentOnTime: "في وقتو",
      paymentSlightlyLate: "متأخر شوية",
      paymentVeryLate: "متأخر برشة",
      dueOn: "يخلص في",
      dtSuffix: "د.ت",
      statusOverdue: "متأخر",
      statusPaidUp: "مخلّص",
      statusAmountDue: "معلوم مطلوب",
      statusInProgress: "الدورة جارية",
      markPaid: "تسجيل الخلاص",
      markPaidConfirm: function (name, amount) {
        return (
          "تأكد باش تسجل خلاص " +
          name +
          " بمبلغ " +
          amount +
          " د.ت؟ المبلغ يشمل الشهور المتأخرة ومعلوم نصف الشهر."
        );
      },
      markPaidSuccess: "تم تسجيل الخلاص.",
      halfMonthTitle: "حساب معلوم نصف شهر",
      halfMonthHint:
        "اختار التلامذة باش تزيد نصف المعلوم الشهري للمبلغ المطلوب.",
      halfMonthCalculate: "أضف للمبلغ المطلوب",
      halfMonthAddedTitle: "تزاد للمبلغ المطلوب",
      halfMonthAddSuccess: function (count, amount) {
        return (
          "تزاد معلوم نصف شهر لـ " +
          count +
          " تلميذ، المجموع " +
          amount +
          " د.ت."
        );
      },
      halfMonthPickerLabel: "اختار التلامذة",
      halfMonthDialogTitle: "اختار التلامذة",
      halfMonthDone: "تم",
      halfMonthAll: "الكل",
      halfMonthAllSelected: "تم اختيار التلامذة الكل",
      halfMonthSelectedCount: function (count) {
        return "تم اختيار " + count;
      },
      halfMonthNoStudents: "ما فماش تلامذة للاختيار.",
      halfMonthAllLabel: "اختيار التلامذة الكل",
      halfMonthStudentLabel: function (name) {
        return "اختيار " + name;
      },
      halfMonthResultTitle: "مبالغ نصف الشهر",
      halfMonthTotal: "المجموع",
      halfMonthModeHalf: "نصف شهر",
      halfMonthModeCustom: "مبلغ نكتبو",
      halfMonthAmountLabel: "المبلغ لكل تلميذ مختار",
      halfMonthAmountPlaceholder: "المبلغ",
      thTimeLeft: "المدة المتبقية",
      moreActions: "خيارات أخرى",
      daysLeft: function (n) {
        return "باقي " + arDays(n);
      },
      endsToday: "ينتهي اليوم",
      daysOverdue: function (n) {
        return "متأخر " + arDays(n);
      },
      customChargeType: "معلوم إضافي",
      customChargeAddSuccess: function (count, amount) {
        return "تزاد معلوم لـ " + count + " تلميذ، المجموع " + amount + " د.ت.";
      },
      locale: "ar-TN",
    },
  };

  function t(key) {
    return STR[currentLang][key];
  }
  function levelLabel(value) {
    return LEVEL_LABELS[currentLang][value] || value;
  }
  function shortLevelLabel(value) {
    return LEVEL_SHORT_LABELS[currentLang][value] || value;
  }

  var els = {
    pillStudentsLabel: document.getElementById("pillStudentsLabel"),
    pillCalendarLabel: document.getElementById("pillCalendarLabel"),
    pageTitle: document.getElementById("pageTitle"),
    pageDate: document.getElementById("pageDate"),
    heroGreeting: document.getElementById("heroGreeting"),
    heroText: document.getElementById("heroText"),
    actionsStudents: document.getElementById("actionsStudents"),
    actionsCalendar: document.getElementById("actionsCalendar"),
    kpiRow: document.getElementById("kpiRow"),
    barChart: document.getElementById("barChart"),
    distributionTitleEl: document.getElementById("distributionTitleEl"),
    byLevelTitleEl: document.getElementById("byLevelTitleEl"),
    donutTotalLabel: document.getElementById("donutTotalLabel"),
    legendCollegeLabel: document.getElementById("legendCollegeLabel"),
    legendLyceeLabel: document.getElementById("legendLyceeLabel"),
    tableWrap: document.getElementById("tableWrap"),
    searchInput: document.getElementById("searchInput"),
    levelFilter: document.getElementById("levelFilter"),
    groupFilter: document.getElementById("groupFilter"),
    groupFilterSummary: document.getElementById("groupFilterSummary"),
    openAddBtn: document.getElementById("openAddBtn"),
    modalOverlay: document.getElementById("modalOverlay"),
    modalTitle: document.getElementById("modalTitle"),
    studentForm: document.getElementById("studentForm"),
    studentId: document.getElementById("studentId"),
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    level: document.getElementById("level"),
    gender: document.getElementById("gender"),
    lblGender: document.getElementById("lblGender"),
    genderPlaceholderOpt: document.getElementById("genderPlaceholderOpt"),
    genderMaleOpt: document.getElementById("genderMaleOpt"),
    genderFemaleOpt: document.getElementById("genderFemaleOpt"),
    startDate: document.getElementById("startDate"),
    endDate: document.getElementById("endDate"),
    studentGroup: document.getElementById("studentGroup"),
    lblGroup: document.getElementById("lblGroup"),
    endDateHint: document.getElementById("endDateHint"),
    notes: document.getElementById("notes"),
    cancelBtn: document.getElementById("cancelBtn"),
    submitBtn: document.getElementById("submitBtn"),
    submitIcon: document.getElementById("submitIcon"),
    submitLabel: document.getElementById("submitLabel"),
    lblFirstName: document.getElementById("lblFirstName"),
    lblLastName: document.getElementById("lblLastName"),
    lblLevel: document.getElementById("lblLevel"),
    lblStartDate: document.getElementById("lblStartDate"),
    lblEndDateText: document.getElementById("lblEndDateText"),
    lblEndDateOptional: document.getElementById("lblEndDateOptional"),
    lblNotesText: document.getElementById("lblNotesText"),
    lblNotesOptional: document.getElementById("lblNotesOptional"),
    noteModalOverlay: document.getElementById("noteModalOverlay"),
    noteModalTitle: document.getElementById("noteModalTitle"),
    noteModalBody: document.getElementById("noteModalBody"),
    noteCloseBtn: document.getElementById("noteCloseBtn"),
    noteModalAvatar: document.getElementById("noteModalAvatar"),
    noteEditBtn: document.getElementById("noteEditBtn"),
    noteEditLabel: document.getElementById("noteEditLabel"),
    groupDetailOverlay: document.getElementById("groupDetailOverlay"),
    groupDetailModal: document.getElementById("groupDetailModal"),
    groupDetailClose: document.getElementById("groupDetailClose"),
    groupDetailMark: document.getElementById("groupDetailMark"),
    groupDetailTitle: document.getElementById("groupDetailTitle"),
    groupDetailBody: document.getElementById("groupDetailBody"),
    groupDetailEditBtn: document.getElementById("groupDetailEditBtn"),
    groupDetailEditLabel: document.getElementById("groupDetailEditLabel"),
    calMonthLabel: document.getElementById("calMonthLabel"),
    calGrid: document.getElementById("calGrid"),
    calPrevBtn: document.getElementById("calPrevBtn"),
    calNextBtn: document.getElementById("calNextBtn"),
    calTodayBtn: document.getElementById("calTodayBtn"),
    eventsTitle: document.getElementById("eventsTitle"),
    eventsSub: document.getElementById("eventsSub"),
    eventsList: document.getElementById("eventsList"),
    groupsTitle: document.getElementById("groupsTitle"),
    groupsHint: document.getElementById("groupsHint"),
    groupsTotal: document.getElementById("groupsTotal"),
    groupsAddForm: document.getElementById("groupsAddForm"),
    newGroupName: document.getElementById("newGroupName"),
    newGroupLabel: document.getElementById("newGroupLabel"),
    addGroupBtn: document.getElementById("addGroupBtn"),
    groupsList: document.getElementById("groupsList"),
    groupModalOverlay: document.getElementById("groupModalOverlay"),
    groupModalTitle: document.getElementById("groupModalTitle"),
    groupModalForm: document.getElementById("groupModalForm"),
    groupModalNameLabel: document.getElementById("groupModalNameLabel"),
    groupModalName: document.getElementById("groupModalName"),
    groupModalFields: document.getElementById("groupModalFields"),
    groupModalStudents: document.getElementById("groupModalStudents"),
    groupModalCancel: document.getElementById("groupModalCancel"),
    groupModalSave: document.getElementById("groupModalSave"),
    groupModalSaveLabel: document.getElementById("groupModalSaveLabel"),
    legendStartLabel: document.getElementById("legendStartLabel"),
    legendEndLabel: document.getElementById("legendEndLabel"),
    legendStudyLabel: document.getElementById("legendStudyLabel"),
    langSwitch: document.getElementById("langSwitch"),
    clearDataBtn: document.getElementById("clearDataBtn"),
    clearDataLabel: document.getElementById("clearDataLabel"),
    exportDataBtn: document.getElementById("exportDataBtn"),
    importDataBtn: document.getElementById("importDataBtn"),
    importFile: document.getElementById("importFile"),
    actionResultOverlay: document.getElementById("actionResultOverlay"),
    actionResultBox: document.getElementById("actionResultBox"),
    actionResultTitle: document.getElementById("actionResultTitle"),
    actionResultText: document.getElementById("actionResultText"),
    exportDataLabel: document.getElementById("exportDataLabel"),
    importDataLabel: document.getElementById("importDataLabel"),
    toast: document.getElementById("toast"),
    toastIcon: document.getElementById("toastIcon"),
    toastTitle: document.getElementById("toastTitle"),
    toastMessage: document.getElementById("toastMessage"),
    toastClose: document.getElementById("toastClose"),
    monthEndNotice: document.getElementById("monthEndNotice"),
    monthEndModalOverlay: document.getElementById("monthEndModalOverlay"),
    monthEndModalTitle: document.getElementById("monthEndModalTitle"),
    monthEndModalMessage: document.getElementById("monthEndModalMessage"),
    monthEndModalClose: document.getElementById("monthEndModalClose"),
    pillPaymentsLabel: document.getElementById("pillPaymentsLabel"),
    profileModalOverlay: document.getElementById("profileModalOverlay"),
    profileModalTitle: document.getElementById("profileModalTitle"),
    profileModalBody: document.getElementById("profileModalBody"),
    profileModalAvatar: document.getElementById("profileModalAvatar"),
    profileModalClose: document.getElementById("profileModalClose"),
    paymentsKpiRow: document.getElementById("paymentsKpiRow"),
    paymentsList: document.getElementById("paymentsList"),
    halfMonthTitle: document.getElementById("halfMonthTitle"),
    halfMonthHint: document.getElementById("halfMonthHint"),
    halfMonthPickerLabel: document.getElementById("halfMonthPickerLabel"),
    halfMonthPickerOptions: document.getElementById("halfMonthPickerOptions"),
    halfMonthCalculateBtn: document.getElementById("halfMonthCalculateBtn"),
    halfMonthModeHalf: document.getElementById("halfMonthModeHalf"),
    halfMonthModeCustom: document.getElementById("halfMonthModeCustom"),
    halfMonthAmountWrap: document.getElementById("halfMonthAmountWrap"),
    halfMonthAmount: document.getElementById("halfMonthAmount"),
    halfMonthAmountUnit: document.getElementById("halfMonthAmountUnit"),
    halfMonthModalOverlay: document.getElementById("halfMonthModalOverlay"),
    halfMonthModalTitle: document.getElementById("halfMonthModalTitle"),
    halfMonthModalClose: document.getElementById("halfMonthModalClose"),
    halfMonthModalX: document.getElementById("halfMonthModalX"),
    halfMonthDoneLabel: document.getElementById("halfMonthDoneLabel"),
    halfMonthResult: document.getElementById("halfMonthResult"),
  };

  var LEVEL_PRICE = { college: 40, lycee: 45 };
  var GROUP_COLORS = [
    "#0464de",
    "#d4535b",
    "#5c9b46",
    "#a06a16",
    "#168c91",
    "#8459a6",
  ];

  var PAGE_TITLE_KEY = {
    students: "pageTitleStudents",
    calendar: "pageTitleCalendar",
    payments: "pageTitlePayments",
  };

  var students = [];
  var groups = [];
  var activeGroup = "";
  var expandedGroup = "";
  var editingGroupIndex = -1;
  var calendarCursor = new Date();
  var selectedDate = new Date();
  var currentLang = "en";
  var currentPage = "students";
  var selectedPaymentId = null;
  var selectedHalfMonthIds = [];
  var donutStats = null;
  var halfMonthCalculated = false;
  var halfMonthMode = "half"; // "half" | "custom"
  var halfMonthResultItems = [];
  var monthEndNoticeReadKey = "";
  var activeMonthEndNoticeKey = "";
  var revealedEventGroupKey = "";
  var suppressDataEvents = false;

  // Tells the optional cloud-sync module (JS/firebase-sync.js) that local data changed
  function emitDataChanged() {
    if (suppressDataEvents) return;
    try {
      window.dispatchEvent(new CustomEvent("classledger:data-changed"));
    } catch (e) {}
  }

  /* ---------------- profile (account details) ---------------- */
  var PROFILE_KEY = "classledger:profile";
  var profile = { firstName: "", lastName: "", gender: "", phone: "", subject: "" };

  function cleanProfile(raw) {
    raw = raw && typeof raw === "object" ? raw : {};
    function field(value, max) {
      return typeof value === "string" ? value.trim().slice(0, max) : "";
    }
    var firstName = field(raw.firstName, 40);
    var lastName = field(raw.lastName, 40);
    if (!firstName && !lastName && typeof raw.name === "string") {
      // older saves had a single "name" field: the last word is the family name
      var split = splitFullName(raw.name);
      firstName = split.firstName.slice(0, 40);
      lastName = split.lastName.slice(0, 40);
    }
    return {
      firstName: firstName,
      lastName: lastName,
      gender: raw.gender === "male" || raw.gender === "female" ? raw.gender : "",
      phone: field(raw.phone, 30),
      subject: field(raw.subject, 60),
    };
  }
  function splitFullName(full) {
    var words = String(full || "").trim().split(/\s+/).filter(Boolean);
    if (words.length < 2) return { firstName: words[0] || "", lastName: "" };
    return {
      firstName: words.slice(0, -1).join(" "),
      lastName: words[words.length - 1],
    };
  }
  function profileFullName(p) {
    return [p.firstName, p.lastName].filter(Boolean).join(" ");
  }
  // A copy of the last filled-in profile, kept on this device. The personal details can never be
  // blanked by accident (an empty copy arriving from the cloud, an empty import...): the copy is
  // put back. Only the person saving an empty form, or leaving the account, clears it.
  var PROFILE_BACKUP_KEY = "classledger:profile-backup";
  function profileHasContent(p) {
    return !!(p && (p.firstName || p.lastName || p.gender || p.phone || p.subject));
  }
  function readProfileBackup() {
    try {
      var saved = cleanProfile(JSON.parse(localStorage.getItem(PROFILE_BACKUP_KEY) || "null"));
      return profileHasContent(saved) ? saved : null;
    } catch (e) {
      return null;
    }
  }
  function loadProfile() {
    try {
      profile = cleanProfile(JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}"));
    } catch (e) {
      profile = cleanProfile(null);
    }
    if (!profileHasContent(profile)) {
      var saved = readProfileBackup();
      if (saved) {
        profile = saved;
        try {
          localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        } catch (e) {}
      }
    }
  }
  // opts.silent: the change came from the cloud, don't send it back
  // opts.forget: really empty it (saving an empty form, switching or leaving the account)
  function setProfile(next, opts) {
    opts = opts || {};
    profile = cleanProfile(next);
    try {
      if (profileHasContent(profile)) {
        localStorage.setItem(PROFILE_BACKUP_KEY, JSON.stringify(profile));
      } else if (opts.forget) {
        localStorage.removeItem(PROFILE_BACKUP_KEY);
      } else {
        var saved = readProfileBackup();
        if (saved) {
          profile = saved; // an accidental blank: keep the details and let the cloud get them back
          opts = { silent: false };
        }
      }
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {}
    if (typeof setHeaderDate === "function" && els.heroGreeting) setHeaderDate();
    if (!opts.silent) {
      try {
        window.dispatchEvent(new CustomEvent("classledger:profile-changed"));
      } catch (e) {}
    } else {
      try {
        window.dispatchEvent(new CustomEvent("classledger:profile-applied"));
      } catch (e) {}
    }
  }

  /* ---------------- stopped students ---------------- */
  // a student who stopped studying keeps their data (and payment history) but is left
  // out of the totals, payments, calendar and groups until they resume
  function isStopped(student) {
    return !!(student && student.stoppedAt);
  }
  function activeStudents() {
    return students.filter(function (student) {
      return !isStopped(student);
    });
  }
  // a stopped student's debt is frozen on the day they stopped (no new months pile up)
  function paymentReferenceDate(student) {
    return isStopped(student) ? student.stoppedAt : toDateKey(new Date());
  }
  function amountOwed(student) {
    var cycles = countDueMonthlyCycles(
      student.endDate,
      paymentReferenceDate(student),
    );
    return studentFee(student) * cycles + halfMonthChargeTotals(student).due;
  }
  // payments list: everyone who studies, plus stopped students who still owe money
  function paymentStudents() {
    return students.filter(function (student) {
      return !isStopped(student) || amountOwed(student) > 0;
    });
  }

  /* ---------------- storage ---------------- */
  function loadStudents() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      students = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(students)) students = [];
      var avatarIndexes = { male: 0, female: 0 };
      students.forEach(function (student) {
        sanitizeHalfMonthCharges(student);
        if (!student.avatar) {
          student.avatar = getNextAvatar(
            student.gender,
            avatarIndexes[student.gender] || 0,
          );
          if (avatarIndexes[student.gender] !== undefined)
            avatarIndexes[student.gender]++;
        }
      });
      assignAvatarBackgrounds(students, []);
      saveStudents();
    } catch (e) {
      students = [];
    }
  }
  var toastTimer = null;
  var TOAST_ICON_OK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 13l4 4L19 7"/></svg>';
  var TOAST_ICON_ERR =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var TOAST_ICON_INFO =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7h.01"/></svg>';
  var TOAST_ICON_ADD =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
  var TOAST_ICON_EDIT =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 4 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z"/></svg>';
  var TOAST_ICON_DELETE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"/></svg>';
  function showToast(message, isError, title, variant) {
    if (!els.toast) return;
    if (els.toastIcon)
      els.toastIcon.innerHTML = isError
        ? TOAST_ICON_ERR
        : variant === "add"
          ? TOAST_ICON_ADD
          : variant === "edit"
            ? TOAST_ICON_EDIT
            : variant === "delete"
              ? TOAST_ICON_DELETE
              : variant === "info"
                ? TOAST_ICON_INFO
                : TOAST_ICON_OK;
    if (els.toastTitle)
      els.toastTitle.textContent =
        title || (isError ? t("toastErrorTitle") : t("toastSuccessTitle"));
    if (els.toastMessage) els.toastMessage.textContent = message;
    els.toast.classList.toggle("toast-error", !!isError);
    els.toast.classList.toggle("toast-info", variant === "info");
    els.toast.classList.toggle("toast-add", variant === "add");
    els.toast.classList.toggle("toast-edit", variant === "edit");
    els.toast.classList.toggle("toast-delete", variant === "delete");
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      els.toast.classList.remove("show");
    }, 2600);
  }

  function getEndedMonthGroups() {
    var today = toDateKey(new Date());
    var studentsByDate = {};
    students.forEach(function (student) {
      if (isStopped(student)) return;
      if (!student.endDate || student.endDate > today) return;
      studentsByDate[student.endDate] = studentsByDate[student.endDate] || [];
      studentsByDate[student.endDate].push(student);
    });
    return Object.keys(studentsByDate)
      .sort()
      .map(function (date) {
        return { date: date, students: studentsByDate[date] };
      });
  }

  function endedMonthGroupsKey(eventGroups) {
    return eventGroups.length
      ? "ended:" +
          eventGroups
            .map(function (group) {
              return (
                group.date +
                ":" +
                group.students
                  .map(function (student) {
                    return student.id;
                  })
                  .sort()
                  .join(",")
              );
            })
            .join("|")
      : "";
  }

  function monthEndNoticeMarkup(eventGroups) {
    if (!eventGroups.length) {
      return (
        '<p class="month-end-notice-empty">' +
        escapeHtml(t("monthEndEmpty")) +
        "</p>"
      );
    }
    return eventGroups
      .map(function (group) {
        var names = group.students.map(function (student) {
          return student.firstName + " " + student.lastName;
        });
        var avatars = group.students
          .slice(0, 4)
          .map(function (student) {
            return (
              '<span class="event-avatar">' + avatarMarkup(student) + "</span>"
            );
          })
          .join("");
        if (group.students.length > 4) {
          avatars +=
            '<span class="event-avatar-overflow" aria-hidden="true">+' +
            (group.students.length - 4) +
            "</span>";
        }
        return (
          '<button type="button" class="month-end-event" data-action="open-month-end-event" data-date="' +
          group.date +
          '" aria-label="' +
          escapeHtml(
            t("monthEndViewEvent")(formatDate(group.date), names.join(", ")),
          ) +
          '"><span class="month-end-event-date">' +
          escapeHtml(formatDate(group.date)) +
          '</span><span class="event-avatars" aria-hidden="true">' +
          avatars +
          '</span><span class="event-count">' +
          group.students.length +
          "</span></button>"
        );
      })
      .join("");
  }

  function refreshMonthEndNotice() {
    if (!els.monthEndNotice) return;
    var eventGroups = getEndedMonthGroups();
    var noticeKey = endedMonthGroupsKey(eventGroups);
    var savedReadKey = "";
    try {
      savedReadKey = localStorage.getItem(MONTH_END_NOTICE_KEY) || "";
    } catch (e) {}
    var totalStudents = eventGroups.reduce(function (count, group) {
      return count + group.students.length;
    }, 0);
    var isRead =
      !noticeKey ||
      monthEndNoticeReadKey === noticeKey ||
      savedReadKey === noticeKey;
    var noticeLabel = t("monthEndTitle");
    noticeLabel += totalStudents
      ? ": " + t("groupStudentCount")(totalStudents)
      : ": " + t("monthEndEmpty");
    els.monthEndNotice.dataset.noticeKey = noticeKey;
    els.monthEndNotice.classList.toggle("has-unread", !isRead);
    els.monthEndNotice.setAttribute("aria-label", noticeLabel);
    els.monthEndNotice.title = noticeLabel;
  }

  function openMonthEndNotice() {
    var eventGroups = getEndedMonthGroups();
    activeMonthEndNoticeKey = endedMonthGroupsKey(eventGroups);
    els.monthEndModalTitle.textContent = t("monthEndTitle");
    els.monthEndModalMessage.innerHTML = monthEndNoticeMarkup(eventGroups);
    els.monthEndModalClose.setAttribute("aria-label", t("close"));
    els.monthEndModalOverlay.classList.add("open");
    els.monthEndModalClose.focus();
  }

  function closeMonthEndNotice(returnFocus) {
    if (!els.monthEndModalOverlay.classList.contains("open")) return;
    if (activeMonthEndNoticeKey) {
      monthEndNoticeReadKey = activeMonthEndNoticeKey;
      try {
        localStorage.setItem(MONTH_END_NOTICE_KEY, activeMonthEndNoticeKey);
      } catch (e) {}
    }
    els.monthEndModalOverlay.classList.remove("open");
    refreshMonthEndNotice();
    activeMonthEndNoticeKey = "";
    if (returnFocus !== false) els.monthEndNotice.focus();
  }

  function handleMonthEndEventClick(e) {
    var button = e.target.closest('[data-action="open-month-end-event"]');
    if (!button) return;
    var parts = button.dataset.date.split("-").map(Number);
    selectedDate = new Date(parts[0], parts[1] - 1, parts[2]);
    calendarCursor = new Date(parts[0], parts[1] - 1, 1);
    revealedEventGroupKey = button.dataset.date + ":end";
    activeGroup = "";
    closeMonthEndNotice(false);
    switchPage("calendar");
    els.eventsTitle.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scheduleMonthEndNoticeRefresh() {
    var now = new Date();
    var nextDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );
    window.setTimeout(function () {
      refreshMonthEndNotice();
      scheduleMonthEndNoticeRefresh();
    }, nextDay.getTime() - now.getTime());
  }

  function saveStudents() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      showToast(t("saveError"), true);
    }
    refreshMonthEndNotice();
    emitDataChanged();
  }
  function saveGroups() {
    try {
      localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
    } catch (e) {
      showToast(t("saveError"), true);
    }
    emitDataChanged();
  }
  function normalizeGroup(value) {
    var source = typeof value === "string" ? { name: value } : value;
    if (!source || typeof source.name !== "string" || !source.name.trim()) {
      return null;
    }
    var price = Number(source.price);
    var days = Array.isArray(source.days)
      ? source.days
          .map(Number)
          .filter(function (day, index, list) {
            return day >= 1 && day <= 6 && list.indexOf(day) === index;
          })
          .sort()
      : [1, 2, 3, 4, 5, 6];
    return {
      name: source.name.trim(),
      type: source.type === "price" ? "price" : "days",
      price: isFinite(price) && price >= 0 ? price : 0,
      days: days,
    };
  }
  function groupRecord(name) {
    var normalizedName = name.trim().toLowerCase();
    return (
      groups.find(function (group) {
        return group.name.toLowerCase() === normalizedName;
      }) || null
    );
  }
  function studentGroupNames(student) {
    var source = Array.isArray(student.groups)
      ? student.groups
      : typeof student.group === "string" && student.group.trim()
        ? [student.group]
        : [];
    var names = Array.isArray(student.groups)
      ? []
      : student.group
        ? [student.group]
        : [];
    source.forEach(function (name) {
      if (typeof name !== "string" || !name.trim()) return;
      var group = findGroup(name);
      var canonicalName = group || name.trim();
      if (names.indexOf(canonicalName) === -1) names.push(canonicalName);
    });
    return names;
  }
  function setStudentGroupNames(student, names) {
    var normalizedNames = [];
    names.forEach(function (name) {
      var group = findGroup(name);
      var canonicalName = group || name.trim();
      if (canonicalName && normalizedNames.indexOf(canonicalName) === -1) {
        normalizedNames.push(canonicalName);
      }
    });
    student.groups = normalizedNames;
    student.group = normalizedNames[0] || "";
  }
  function loadGroups() {
    try {
      var raw = localStorage.getItem(GROUPS_KEY);
      groups = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(groups)) groups = [];
    } catch (e) {
      groups = [];
    }
    groups = groups.map(normalizeGroup).filter(function (group, index, list) {
      return (
        group &&
        list.findIndex(function (candidate) {
          return (
            candidate &&
            candidate.name.toLowerCase() === group.name.toLowerCase()
          );
        }) === index
      );
    });
    students.forEach(function (student) {
      var names = studentGroupNames(student);
      names.forEach(function (name) {
        if (!findGroup(name)) groups.push(normalizeGroup(name));
      });
      setStudentGroupNames(student, names);
    });
    saveGroups();
    saveStudents();
  }
  function findGroup(name) {
    var group = groupRecord(name);
    return group ? group.name : "";
  }
  function addGroup(name) {
    var trimmedName = name.trim();
    if (!trimmedName) return "";
    var existing = findGroup(trimmedName);
    if (existing) return existing;
    groups.push(normalizeGroup({ name: trimmedName, days: [] }));
    saveGroups();
    return trimmedName;
  }
  function clearAllData() {
    if (!confirm(t("clearAllConfirm"))) return;
    var removed = fmtCounts(t("clearDoneText"), students.length, groups.length);
    playActionResult({
      kind: "delete",
      ok: true,
      loadingTitle: t("clearLoadingTitle"),
      loadingText: t("clearLoadingText"),
      doneTitle: t("clearDoneTitle"),
      doneText: removed,
      failTitle: t("clearFailTitle"),
      failText: t("clearFailText"),
      apply: function () {
        students = [];
        groups = [];
        activeGroup = "";
        expandedGroup = "";
        saveStudents();
        saveGroups();
        renderStudentsPage();
        if (currentPage === "calendar") renderCalendar();
        if (currentPage === "payments") renderPaymentsPage();
      },
    });
  }
  function exportData() {
    var ok = true;
    try {
      var backup = {
        app: "ClassLedger",
        version: 5,
        exportedAt: new Date().toISOString(),
        students: students,
        groups: groups,
        profile: profile,
        lang: currentLang,
      };
      var blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
      });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "classledger-backup-" + toDateKey(new Date()) + ".json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (e) {
      ok = false;
    }
    playActionResult({
      kind: "export",
      ok: ok,
      loadingTitle: t("exportLoadingTitle"),
      loadingText: t("exportLoadingText"),
      doneTitle: t("exportDoneTitle"),
      doneText: fmtCounts(t("exportDoneText"), students.length, groups.length),
      failTitle: t("exportFailTitle"),
      failText: t("exportFailText"),
    });
  }
  function sanitizePaymentHistory(student) {
    if (!Array.isArray(student.paymentHistory)) {
      student.paymentHistory = [];
      return student;
    }
    student.paymentHistory = student.paymentHistory
      .filter(function (p) {
        return (
          p &&
          typeof p.dueDate === "string" &&
          typeof p.paidAt === "string" &&
          typeof p.amount === "number"
        );
      })
      .map(function (p) {
        return {
          dueDate: p.dueDate,
          paidAt: p.paidAt,
          amount: p.amount,
          timing:
            p.timing === "slightly-late" || p.timing === "very-late"
              ? p.timing
              : "on-time",
          kind: p.kind === "half-month" ? "half-month" : "monthly",
          custom: p.custom === true,
        };
      });
    return student;
  }

  function sanitizeHalfMonthCharges(student) {
    student.halfMonthCharges = Array.isArray(student.halfMonthCharges)
      ? student.halfMonthCharges
          .filter(function (charge) {
            return (
              charge &&
              typeof charge.amount === "number" &&
              isFinite(charge.amount) &&
              charge.amount > 0 &&
              typeof charge.addedAt === "string"
            );
          })
          .map(function (charge) {
            return {
              amount: charge.amount,
              addedAt: charge.addedAt,
              paidAt: typeof charge.paidAt === "string" ? charge.paidAt : "",
              custom: charge.custom === true,
            };
          })
      : [];
    return student;
  }

  /* ---- import feedback: loading → success (green ✓) / failure (red ✕) ---- */
  function fmtCounts(template, studentCount, groupCount) {
    return template
      .replace("{students}", studentCount)
      .replace("{groups}", groupCount)
      .replace(/\b1 students\b/, "1 student")
      .replace(/\b1 groups\b/, "1 group");
  }
  var ACTION_LOADING_MS = 1100;
  var actionResultTimer = null;
  var actionResultBusy = false;

  function setActionResult(state, title, text) {
    els.actionResultBox.setAttribute("data-state", state);
    els.actionResultTitle.textContent = title;
    els.actionResultText.textContent = text;
  }
  function closeActionResult() {
    if (actionResultBusy) return;
    clearTimeout(actionResultTimer);
    els.actionResultOverlay.classList.remove("open");
  }
  function playActionResult(o) {
    clearTimeout(actionResultTimer);
    actionResultBusy = true;
    els.actionResultBox.setAttribute("data-kind", o.kind);
    setActionResult("loading", o.loadingTitle, o.loadingText);
    els.actionResultOverlay.classList.add("open");
    actionResultTimer = setTimeout(function () {
      var success = o.ok;
      if (success && o.apply) {
        try {
          o.apply();
        } catch (e) {
          success = false;
        }
      }
      if (success) {
        setActionResult("success", o.doneTitle, o.doneText);
      } else {
        setActionResult("error", o.failTitle, o.failText);
      }
      actionResultBusy = false;
      actionResultTimer = setTimeout(closeActionResult, success ? 1600 : 2400);
    }, ACTION_LOADING_MS);
  }

  function importData(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var backup = JSON.parse(reader.result);
        var importedStudents = backup && backup.students;
        var valid =
          backup &&
          backup.app === "ClassLedger" &&
          Array.isArray(importedStudents) &&
          importedStudents.every(function (student) {
            return (
              student &&
              typeof student.id === "string" &&
              typeof student.firstName === "string" &&
              typeof student.lastName === "string" &&
              typeof student.level === "string" &&
              typeof student.startDate === "string"
            );
          });
        if (!valid) throw new Error("Invalid backup");
        importedStudents = importedStudents.map(function (student) {
          var names = Array.isArray(student.groups)
            ? student.groups
            : typeof student.group === "string"
              ? [student.group]
              : [];
          student.groups = names
            .filter(function (name) {
              return typeof name === "string" && name.trim();
            })
            .map(function (name) {
              return name.trim();
            })
            .filter(function (name, index, list) {
              return list.indexOf(name) === index;
            });
          student.group = student.groups[0] || "";
          return sanitizeHalfMonthCharges(sanitizePaymentHistory(student));
        });
        var importedGroups = Array.isArray(backup.groups)
          ? backup.groups.map(normalizeGroup).filter(Boolean)
          : [];
        importedGroups = importedGroups.filter(function (group, index, list) {
          return (
            list.findIndex(function (candidate) {
              return candidate.name.toLowerCase() === group.name.toLowerCase();
            }) === index
          );
        });
        importedStudents.forEach(function (student) {
          student.groups = student.groups.map(function (name) {
            var matchingGroup = importedGroups.find(function (group) {
              return group.name.toLowerCase() === name.toLowerCase();
            });
            if (!matchingGroup) {
              matchingGroup = normalizeGroup(name);
              importedGroups.push(matchingGroup);
            }
            return matchingGroup.name;
          });
          student.group = student.groups[0] || "";
        });
        assignAvatarBackgrounds(importedStudents, []);
        if (
          !confirm(
            t("importConfirm").replace("{count}", importedStudents.length),
          )
        )
          return;
        var summary = fmtCounts(
          t("importDoneText"),
          importedStudents.length,
          importedGroups.length,
        );
        playActionResult({
          kind: "import",
          ok: true,
          loadingTitle: t("importLoadingTitle"),
          loadingText: t("importLoadingText"),
          doneTitle: t("importDoneTitle"),
          doneText: summary,
          failTitle: t("importFailTitle"),
          failText: t("importError"),
          apply: function () {
            if (
              backup.profile &&
              typeof backup.profile === "object" &&
              profileHasContent(cleanProfile(backup.profile))
            )
              setProfile(backup.profile); // an empty profile in the file never wipes the current one
            students = importedStudents;
            groups = importedGroups;
            activeGroup = "";
            expandedGroup = "";
            saveStudents();
            saveGroups();
            renderStudentsPage();
            if (currentPage === "calendar") renderCalendar();
            if (currentPage === "payments") renderPaymentsPage();
          },
        });
      } catch (e) {
        playActionResult({
          kind: "import",
          ok: false,
          loadingTitle: t("importLoadingTitle"),
          loadingText: t("importLoadingText"),
          failTitle: t("importFailTitle"),
          failText: t("importError"),
        });
      } finally {
        els.importFile.value = "";
      }
    };
    reader.readAsText(file);
  }
  function loadLang() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved === "ar" || saved === "en") currentLang = saved;
    } catch (e) {}
  }
  function saveLang() {
    try {
      localStorage.setItem(LANG_KEY, currentLang);
    } catch (e) {}
  }
  function makeId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }

  /* ---------------- helpers ---------------- */
  function formatDate(iso) {
    if (!iso) return "—";
    var parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return currentLang === "ar"
      ? parts[2] + "/" + parts[1] + "/" + parts[0]
      : parts[2] + "/" + parts[1] + "/" + parts[0];
  }
  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }
  function autoEndDate(startIso) {
    var parts = startIso.split("-");
    var y = Number(parts[0]),
      m = Number(parts[1]),
      d = Number(parts[2]);
    if (!y || !m || !d) return "";
    var dt = new Date(y, m, d); // same day, next month (m is 0-indexed next month)
    dt.setDate(dt.getDate() - 1); // minus 1 day
    var yy = dt.getFullYear(),
      mm = String(dt.getMonth() + 1).padStart(2, "0"),
      dd = String(dt.getDate()).padStart(2, "0");
    return yy + "-" + mm + "-" + dd;
  }
  function toDateKey(d) {
    var y = d.getFullYear(),
      m = String(d.getMonth() + 1).padStart(2, "0"),
      day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }
  function sameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function populateLevelSelects() {
    var filterHtml = '<option value="">' + t("allLevels") + "</option>";
    var formHtml = "";
    LEVELS.forEach(function (l) {
      filterHtml += '<option value="' + l + '">' + levelLabel(l) + "</option>";
      formHtml += '<option value="' + l + '">' + levelLabel(l) + "</option>";
    });
    els.levelFilter.innerHTML = filterHtml;
    els.level.innerHTML = formHtml;
  }

  function setHeaderDate() {
    var now = new Date();
    els.pageDate.textContent = now.toLocaleDateString(t("locale"), {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    var hour = now.getHours();
    var greeting =
      hour < 12
        ? t("heroMorning")
        : hour < 18
          ? t("heroDay")
          : t("heroEvening");
    // signed in: greet the account owner by first name; otherwise keep the generic greeting
    var owner = accountInfo
      ? profile.firstName || splitFullName(accountInfo.displayName).firstName
      : "";
    if (owner) {
      var wave = " \u{1F44B}";
      var base = greeting.replace(wave, "");
      greeting = base + (currentLang === "ar" ? " " : ", ") + owner + wave;
    }
    els.heroGreeting.textContent = greeting;
  }

  /* ---------------- language ---------------- */
  function applyStaticText() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

    if (els.langSwitch) {
      els.langSwitch.querySelectorAll(".lang-btn").forEach(function (b) {
        b.classList.toggle("active", b.dataset.lang === currentLang);
      });
    }

    els.pillStudentsLabel.textContent = t("navStudents");
    els.pillCalendarLabel.textContent = t("navCalendar");
    els.pillPaymentsLabel.textContent = t("navPayments");
    els.profileModalClose.setAttribute("aria-label", t("close"));
    if (netBanner) renderNetBanner();
    if (els.toastClose) els.toastClose.setAttribute("aria-label", t("close"));
    els.distributionTitleEl.textContent = t("distributionTitle");
    els.byLevelTitleEl.textContent = t("byLevelTitle");
    els.legendCollegeLabel.textContent = t("kpiCollege");
    els.legendLyceeLabel.textContent = t("kpiLycee");
    els.heroText.textContent = t("heroText");
    els.openAddBtn.textContent = t("addStudent");
    els.clearDataLabel.textContent = t("clearAllButton");
    els.clearDataBtn.setAttribute("aria-label", t("clearAllButton"));
    els.clearDataBtn.setAttribute("title", t("clearAllButton"));
    els.exportDataLabel.textContent = t("exportData");
    els.importDataLabel.textContent = t("importData");
    els.exportDataBtn.setAttribute("title", t("exportData"));
    els.importDataBtn.setAttribute("title", t("importData"));
    els.searchInput.placeholder = t("searchPlaceholder");
    els.eventsTitle.textContent = t("eventsTitle");
    refreshMonthEndNotice();
    els.monthEndModalTitle.textContent = t("monthEndTitle");
    els.monthEndModalClose.setAttribute("aria-label", t("close"));
    if (els.monthEndModalOverlay.classList.contains("open")) {
      els.monthEndModalMessage.innerHTML = monthEndNoticeMarkup(
        getEndedMonthGroups(),
      );
    }
    els.groupsTitle.textContent = t("groupsTitle");
    els.groupsHint.textContent = t("groupsHint");
    els.newGroupLabel.textContent = t("newGroupPlaceholder");
    els.newGroupName.placeholder = t("newGroupPlaceholder");
    els.addGroupBtn.textContent = t("addGroup");
    els.lblGroup.textContent = t("group");
    els.legendStartLabel.textContent = t("legendStart");
    els.legendEndLabel.textContent = t("legendEnd");
    els.legendStudyLabel.textContent = t("legendStudy");
    els.calTodayBtn.textContent = t("today");
    els.calPrevBtn.setAttribute(
      "aria-label",
      currentLang === "ar" ? "الشهر السابق" : "Previous month",
    );
    els.calNextBtn.setAttribute(
      "aria-label",
      currentLang === "ar" ? "الشهر القادم" : "Next month",
    );

    els.lblFirstName.textContent = t("firstName");
    els.lblLastName.textContent = t("lastName");
    els.lblLevel.textContent = t("level");
    els.lblGender.textContent = t("gender");
    els.genderPlaceholderOpt.textContent = t("genderPlaceholder");
    els.genderMaleOpt.textContent = t("genderMale");
    els.genderFemaleOpt.textContent = t("genderFemale");
    els.lblStartDate.textContent = t("startDate");
    els.lblEndDateText.textContent = t("endDate");
    els.lblEndDateOptional.textContent = t("optional");
    els.endDateHint.textContent = t("endDateHint");
    els.lblNotesText.textContent = t("notes");
    els.lblNotesOptional.textContent = t("optional");
    els.notes.placeholder = t("notesPlaceholder");
    els.cancelBtn.setAttribute("aria-label", t("close"));
    els.noteCloseBtn.setAttribute("aria-label", t("close"));
    els.noteEditLabel.textContent = t("edit");
    els.groupDetailClose.setAttribute("aria-label", t("close"));
    els.groupDetailEditLabel.textContent = t("edit");
    els.halfMonthTitle.textContent = t("halfMonthTitle");
    els.halfMonthHint.textContent = t("halfMonthHint");
    els.halfMonthCalculateBtn.textContent = t("halfMonthCalculate");
    els.halfMonthModeHalf.textContent = t("halfMonthModeHalf");
    els.halfMonthModeCustom.textContent = t("halfMonthModeCustom");
    els.halfMonthAmount.placeholder = t("halfMonthAmountPlaceholder");
    els.halfMonthAmount.setAttribute("aria-label", t("halfMonthAmountLabel"));
    els.halfMonthAmountUnit.textContent = t("dtSuffix");
    els.halfMonthModalTitle.textContent = t("halfMonthDialogTitle");
    els.halfMonthDoneLabel.textContent = t("halfMonthDone");
    els.halfMonthModalX.setAttribute("aria-label", t("close"));

    els.pageTitle.textContent = t(PAGE_TITLE_KEY[currentPage]);

    populateLevelSelects();
    renderGroups();
  }

  function setLang(lang) {
    currentLang = lang;
    saveLang();
    applyStaticText();
    renderStudentsPage();
    if (currentPage === "calendar") renderCalendar();
    if (currentPage === "payments") renderPaymentsPage();
    if (profileModalIsOpen()) renderProfileModal();
    setHeaderDate();
  }

  /* ---------------- navigation ---------------- */
  function switchPage(pageName) {
    currentPage = pageName;
    document.querySelectorAll(".nav-target").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.page === pageName);
    });
    document.querySelectorAll(".page").forEach(function (sec) {
      sec.classList.toggle("active", sec.id === "page-" + pageName);
    });
    els.pageTitle.textContent = t(PAGE_TITLE_KEY[pageName]);
    els.actionsStudents.style.display =
      pageName === "students" ? "flex" : "none";
    els.actionsCalendar.style.display =
      pageName === "calendar" ? "flex" : "none";
    if (pageName === "calendar") renderCalendar();
    if (pageName === "payments") renderPaymentsPage();
  }

  /* ---------------- teacher profile modal (My account) ---------------- */
  var profileEditing = false;
  var accountInfo = null; // set by the cloud-sync module when someone is signed in

  function pEl(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }
  var PROFILE_ICON_USER =
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/></svg>';
  var PROFILE_ICON_EDIT =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
  var PROFILE_ICON_CHECK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

  function profileModalIsOpen() {
    return els.profileModalOverlay.classList.contains("open");
  }
  // opts.create: the "Create account" form (details first, then Google); opts.onSubmit runs after it
  var profileCreate = null;
  function openProfileModal(opts) {
    profileCreate = opts && opts.create ? { onSubmit: opts.onSubmit } : null;
    profileEditing = !!profileCreate;
    renderProfileModal();
    els.profileModalOverlay.classList.add("open");
  }
  function closeProfileModal() {
    els.profileModalOverlay.classList.remove("open");
    profileEditing = false;
    profileCreate = null;
  }
  function profileRow(label, value, ltr) {
    var row = pEl("div", "me-row");
    row.appendChild(pEl("span", "me-row-label", label));
    var val = pEl("span", "me-row-value" + (value ? "" : " is-empty"), value || t("profileNotSet"));
    if (ltr && value) val.setAttribute("dir", "ltr");
    row.appendChild(val);
    return row;
  }
  function profileButton(label, icon, onClick, type) {
    var btn = pEl("button", "profile-edit-btn");
    btn.type = type || "button";
    var ic = pEl("span", "profile-edit-icon");
    ic.setAttribute("aria-hidden", "true");
    ic.innerHTML = icon; // static, trusted SVG
    btn.append(ic, pEl("span", "profile-edit-label", label));
    if (onClick) btn.addEventListener("click", onClick);
    return btn;
  }

  function renderProfileModal() {
    // the Google name is only a fallback until the teacher saves their own
    var creating = !!profileCreate;
    var google = creating ? { firstName: "", lastName: "" } : splitFullName(accountInfo && accountInfo.displayName);
    var hasOwn = !!(profile.firstName || profile.lastName);
    var shownFirst = hasOwn ? profile.firstName : google.firstName;
    var shownLast = hasOwn ? profile.lastName : google.lastName;
    var shownName = [shownFirst, shownLast].filter(Boolean).join(" ");
    els.profileModalTitle.textContent = creating ? t("createTitle") : shownName || t("profileNoName");

    // avatar: Google photo when signed in, otherwise the first letter / a person icon
    els.profileModalAvatar.textContent = "";
    if (!creating && accountInfo && accountInfo.photoURL) {
      var img = pEl("img", "avatar");
      img.alt = "";
      img.referrerPolicy = "no-referrer";
      img.src = accountInfo.photoURL;
      els.profileModalAvatar.appendChild(img);
    } else {
      var initial = pEl("div", "avatar me-initial");
      if (shownName && !creating) initial.textContent = shownName.trim().charAt(0).toUpperCase();
      else initial.innerHTML = PROFILE_ICON_USER; // static, trusted SVG
      els.profileModalAvatar.appendChild(initial);
    }

    var body = els.profileModalBody;
    body.textContent = "";

    if (!profileEditing) {
      var genderText =
        profile.gender === "female"
          ? t("genderFemale")
          : profile.gender === "male"
            ? t("genderMale")
            : "";
      if (profile.subject || genderText) {
        var meta = pEl("div", "profile-meta");
        if (genderText) meta.appendChild(pEl("span", "profile-chip", genderText));
        if (profile.subject) meta.appendChild(pEl("span", "profile-chip", profile.subject));
        body.appendChild(meta);
      }
      var rows = pEl("div", "me-rows");
      rows.appendChild(profileRow(t("profileGender"), genderText, false));
      rows.appendChild(profileRow(t("profilePhone"), profile.phone, true));
      rows.appendChild(profileRow(t("profileSubject"), profile.subject, false));
      if (accountInfo && accountInfo.email)
        rows.appendChild(profileRow(t("profileEmail"), accountInfo.email, true));
      body.appendChild(rows);
      var editBtn = profileButton(t("profileEdit"), PROFILE_ICON_EDIT, function () {
        profileEditing = true;
        renderProfileModal();
      });
      if (accountInfo && accountInfo.profileReady === false) {
        // wait for the cloud copy so a stale one can't be saved over it
        editBtn.disabled = true;
        body.appendChild(editBtn);
        body.appendChild(pEl("p", "me-hint", t("profileSyncing")));
      } else {
        body.appendChild(editBtn);
      }
      return;
    }

    var form = pEl("form", "me-form");
    if (creating) form.appendChild(pEl("p", "me-hint me-intro", t("createIntro")));
    function field(labelText, value, type, max) {
      var label = pEl("label", "me-field");
      label.appendChild(pEl("span", "me-row-label", labelText));
      var input = pEl("input", "me-input");
      input.type = type;
      input.value = value || "";
      input.maxLength = max;
      label.appendChild(input);
      return { label: label, input: input };
    }
    var fFirst = field(t("profileFirstName"), shownFirst, "text", 40);
    var fLast = field(t("profileLastName"), shownLast, "text", 40);
    var genderLabel = pEl("label", "me-field");
    genderLabel.appendChild(pEl("span", "me-row-label", t("profileGender")));
    var genderSelect = pEl("select", "me-input");
    [
      ["", "—"],
      ["male", t("genderMale")],
      ["female", t("genderFemale")],
    ].forEach(function (pair) {
      var opt = pEl("option", "", pair[1]);
      opt.value = pair[0];
      genderSelect.appendChild(opt);
    });
    genderSelect.value = profile.gender;
    genderLabel.appendChild(genderSelect);
    if (creating) {
      fFirst.input.required = true;
      fLast.input.required = true;
    }
    var fPhone = field(t("profilePhone"), profile.phone, "tel", 30);
    fPhone.input.setAttribute("dir", "ltr");
    var fSubject = field(t("profileSubject"), profile.subject, "text", 60);
    form.append(
      fFirst.label,
      fLast.label,
      genderLabel,
      fPhone.label,
      fSubject.label,
      creating
        ? profileButton(t("createContinue"), PROFILE_ICON_USER, null, "submit")
        : profileButton(t("profileSave"), PROFILE_ICON_CHECK, null, "submit"),
    );
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      setProfile({
        firstName: fFirst.input.value,
        lastName: fLast.input.value,
        gender: genderSelect.value,
        phone: fPhone.input.value,
        subject: fSubject.input.value,
      }, { forget: true }); // saving an empty form is a deliberate choice
      if (creating) {
        // details are kept on this device first; Google sign-in then creates the account with them
        var next = profileCreate.onSubmit;
        closeProfileModal();
        if (next) next();
        return;
      }
      profileEditing = false;
      renderProfileModal();
      showToast(t("profileSaved"), false, null, "info");
    });
    body.appendChild(form);
    fFirst.input.focus();
  }

  /* ---------------- students rendering ---------------- */
  var KPI_ICON_STUDENTS =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
  var KPI_ICON_GROUPS =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/><path d="m3 17.5 9 5 9-5" opacity=".55"/></svg>';

  function renderStats() {
    var activeList = activeStudents();
    var total = activeList.length;
    var counts = {};
    LEVELS.forEach(function (l) {
      counts[l] = 0;
    });
    activeList.forEach(function (s) {
      if (counts[s.level] !== undefined) counts[s.level]++;
    });

    var totalCollege = 0,
      totalLycee = 0;
    LEVELS.forEach(function (l) {
      if (LEVEL_CATEGORY[l] === "lycee") totalLycee += counts[l];
      else totalCollege += counts[l];
    });

    /* ---- KPI cards ---- */
    els.kpiRow.innerHTML =
      '<div class="kpi-card kpi-total"><span class="kpi-icon" aria-hidden="true">' +
      KPI_ICON_STUDENTS +
      '</span><span class="kpi-label">' +
      t("statTotal") +
      '</span><span class="kpi-value">' +
      total +
      "</span></div>" +
      '<div class="kpi-card kpi-groups"><span class="kpi-icon" aria-hidden="true">' +
      KPI_ICON_GROUPS +
      '</span><span class="kpi-label">' +
      t("groupsTitle") +
      '</span><span class="kpi-value">' +
      groups.length +
      "</span></div>";

    /* ---- Half-donut chart ---- */
    var bigKey = totalCollege >= totalLycee ? "college" : "lycee";
    var smallKey = bigKey === "college" ? "lycee" : "college";
    var counts2 = { college: totalCollege, lycee: totalLycee };
    var bigPct = total ? Math.round((counts2[bigKey] / total) * 100) : 0;
    donutStats = {
      total: total,
      big: bigKey,
      college: { count: totalCollege, pct: 0 },
      lycee: { count: totalLycee, pct: 0 },
    };
    donutStats[bigKey].pct = bigPct;
    donutStats[smallKey].pct = total ? 100 - bigPct : 0;

    // arcs have round ends: a round cap sticks out half the stroke width past
    // each end of its dash, so every dash is shrunk by that amount on both sides
    var CAP = (13 / (Math.PI * 80)) * 100; // stroke-width 26 / 2, in % of the arc
    var GAP = 3; // visual gap between the two arcs (in % of the half circle)
    var share = {
      college: total ? (totalCollege / total) * 100 : 0,
      lycee: total ? (totalLycee / total) * 100 : 0,
    };
    var twoArcs = share.college > 0 && share.lycee > 0;
    var visual = {
      college: {
        from: 0,
        to: twoArcs ? share.college - GAP / 2 : share.college,
      },
      lycee: {
        from: twoArcs ? share.college + GAP / 2 : 0,
        to: 100,
      },
    };
    // the grey track only shows when there is nothing to draw
    document.querySelector(".donut-track").style.display = total ? "none" : "";
    ["college", "lycee"].forEach(function (key) {
      var seg = document.getElementById(
        key === "college" ? "donutCollege" : "donutLycee",
      );
      var dot = document.getElementById(
        key === "college" ? "legendCollegeDot" : "legendLyceeDot",
      );
      var isBig = key === bigKey;
      var visible = share[key] > 0;
      var len = Math.max(visual[key].to - visual[key].from - 2 * CAP, 0.01);
      seg.style.display = visible ? "" : "none"; // a 0-length round dash would still draw a dot
      seg.setAttribute("stroke-dasharray", len + " 200");
      seg.setAttribute("stroke-dashoffset", String(-(visual[key].from + CAP)));
      seg.classList.toggle("is-big", isBig);
      seg.classList.toggle("is-small", !isBig);
      seg.classList.remove("is-active");
      seg.setAttribute(
        "aria-label",
        t(key === "college" ? "kpiCollege" : "kpiLycee") + ": " + counts2[key],
      );
      dot.classList.toggle("is-big", isBig);
      dot.classList.toggle("is-small", !isBig);
    });
    document.getElementById("legendCollegeValue").textContent = totalCollege;
    document.getElementById("legendLyceeValue").textContent = totalLycee;
    showDonutSegment(null);

    /* ---- Bar chart ---- */
    var maxCount = Math.max.apply(
      null,
      LEVELS.map(function (l) {
        return counts[l];
      }).concat([1]),
    );
    // top 3 distinct counts get the greens (1 = most vivid); the rest stay pale
    var topCounts = LEVELS.map(function (l) {
      return counts[l];
    })
      .filter(function (n, i, all) {
        return n > 0 && all.indexOf(n) === i;
      })
      .sort(function (x, y) {
        return y - x;
      })
      .slice(0, 3);
    els.barChart.innerHTML = LEVELS.map(function (l) {
      var pct = Math.round((counts[l] / maxCount) * 100);
      var rank = topCounts.indexOf(counts[l]); // -1 = not in the top 3
      var tone = rank === -1 ? "rest" : String(rank + 1);
      return (
        '<div class="bar-col" tabindex="0" role="img" aria-label="' +
        escapeHtml(shortLevelLabel(l)) +
        ": " +
        counts[l] +
        '">' +
        '<div class="bar-track">' +
        '<div class="bar-shape tone-' +
        tone +
        '" style="height:' +
        pct +
        '%"><span class="bar-tip">' +
        counts[l] +
        "</span></div>" +
        "</div>" +
        '<span class="bar-label">' +
        shortLevelLabel(l) +
        "</span>" +
        "</div>"
      );
    }).join("");
  }

  // centre text of the half-donut: the big share by default, or the hovered one
  function showDonutSegment(key) {
    if (!donutStats) return;
    var big = donutStats.big;
    var k = key || big;
    var pctEl = document.getElementById("donutTotal");
    var labelEl = document.getElementById("donutTotalLabel");
    var subEl = document.getElementById("donutSub");
    if (donutStats.total === 0) {
      pctEl.textContent = "0";
      labelEl.textContent = t("statTotal");
      subEl.textContent = "";
    } else {
      pctEl.textContent = donutStats[k].pct + "%";
      labelEl.textContent = t(k === "college" ? "kpiCollege" : "kpiLycee");
      subEl.textContent = donutStats[k].count + " / " + donutStats.total;
    }
    var focusSmall = !!key && key !== big && donutStats.total > 0;
    document
      .querySelector(".donut-card")
      .classList.toggle("is-focus-small", focusSmall);
    ["college", "lycee"].forEach(function (name) {
      document
        .getElementById(name === "college" ? "donutCollege" : "donutLycee")
        .classList.toggle("is-active", focusSmall && name === key);
    });
  }

  function getFilteredStudents() {
    var query = els.searchInput.value.trim().toLowerCase();
    var levelFilterVal = els.levelFilter.value;
    var groupFilterVal = els.groupFilter.value;
    return students
      .filter(function (s) {
        var matchesQuery =
          !query ||
          (s.firstName + " " + s.lastName).toLowerCase().indexOf(query) !== -1;
        var matchesLevel = !levelFilterVal || s.level === levelFilterVal;
        var matchesGroup =
          !groupFilterVal ||
          studentGroupNames(s).indexOf(groupFilterVal) !== -1;
        return matchesQuery && matchesLevel && matchesGroup;
      })
      .sort(function (a, b) {
        var aStopped = isStopped(a) ? 1 : 0,
          bStopped = isStopped(b) ? 1 : 0;
        if (aStopped !== bStopped) return aStopped - bStopped;
        var ai = LEVELS.indexOf(a.level),
          bi = LEVELS.indexOf(b.level);
        if (ai !== bi) return ai - bi;
        return a.lastName.localeCompare(b.lastName);
      });
  }

  function populateGroupFilter() {
    var selectedGroup = els.groupFilter.value;
    var groupOptions =
      '<option value="">' + escapeHtml(t("allGroups")) + "</option>";
    groups.forEach(function (group) {
      groupOptions +=
        '<option value="' +
        escapeHtml(group.name) +
        '">' +
        escapeHtml(group.name) +
        "</option>";
    });
    els.groupFilter.innerHTML = groupOptions;
    if (
      groups.some(function (group) {
        return group.name === selectedGroup;
      })
    )
      els.groupFilter.value = selectedGroup;
  }

  var NOTE_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>';
  var GROUP_MARK_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
  var GROUP_DAYS_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>';
  var GROUP_PRICE_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 12.5V5a1.5 1.5 0 0 1 1.5-1.5h7.5l8 8a1.5 1.5 0 0 1 0 2.1l-6.9 6.9a1.5 1.5 0 0 1-2.1 0z"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor"/></svg>';

  function renderGroupFilterSummary() {
    var group = groupRecord(els.groupFilter.value);
    if (!group) {
      els.groupFilterSummary.hidden = true;
      els.groupFilterSummary.innerHTML = "";
      return;
    }
    var groupIndex = groups.indexOf(group);
    var color = GROUP_COLORS[groupIndex % GROUP_COLORS.length];
    var details =
      group.type === "price"
        ? t("groupSummaryPrice")(
            group.price.toLocaleString(t("locale"), {
              maximumFractionDigits: 2,
            }),
          )
        : group.days.length
          ? t("groupSummaryDays")(
              group.days
                .map(function (day) {
                  return t("dowFull")[day - 1];
                })
                .join(", "),
            )
          : t("groupSummaryNoDays");
    els.groupFilterSummary.style.setProperty("--group-summary-color", color);
    els.groupFilterSummary.innerHTML =
      '<span class="group-filter-summary-icon" aria-hidden="true">' +
      (group.type === "price" ? GROUP_PRICE_ICON : GROUP_DAYS_ICON) +
      "</span><div><b>" +
      escapeHtml(group.name) +
      "</b><span>" +
      escapeHtml(details) +
      "</span></div>";
    els.groupFilterSummary.hidden = false;
  }

  var MALE_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="7.5" r="3.3"/><path d="M5 20c0-3.9 3.1-6.4 7-6.4s7 2.5 7 6.4"/></svg>';
  var FEMALE_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="7.5" r="3.3"/><path d="M12 10.8c-3.2 0-5.4 2.1-6 4.9-.1.6.4 1.1 1 1.1h3l-.4 3.2h4.8l-.4-3.2h3c.6 0 1.1-.5 1-1.1-.6-2.8-2.8-4.9-6-4.9Z"/></svg>';
  var MALE_AVATARS = [1, 3, 5, 7, 9];
  var FEMALE_AVATARS = [2, 4, 6, 8, 10];
  var AVATAR_BACKGROUNDS = [
    "#e6f0fc",
    "#d6e6fb",
    "#c3dbfa",
    "#edf4fd",
    "#f1f6fd",
    "#eef9e3",
    "#dff3c9",
    "#cfeaa8",
  ];

  function getNextAvatar(gender, index) {
    var avatars = gender === "female" ? FEMALE_AVATARS : MALE_AVATARS;
    return "Images/slide-" + avatars[index % avatars.length] + ".svg";
  }

  function assignAvatarBackgrounds(targetStudents, existingStudents) {
    var usedColors = (existingStudents || [])
      .concat(targetStudents)
      .map(function (student) {
        return student.avatarBackground;
      })
      .filter(function (color) {
        return AVATAR_BACKGROUNDS.indexOf(color) !== -1;
      });

    targetStudents.forEach(function (student) {
      if (AVATAR_BACKGROUNDS.indexOf(student.avatarBackground) !== -1) return;
      var unusedColors = AVATAR_BACKGROUNDS.filter(function (color) {
        return usedColors.indexOf(color) === -1;
      });
      var choices = unusedColors.length ? unusedColors : AVATAR_BACKGROUNDS;
      var color = choices[Math.floor(Math.random() * choices.length)];
      student.avatarBackground = color;
      usedColors.push(color);
    });
  }

  function avatarMarkup(student) {
    var background =
      AVATAR_BACKGROUNDS.indexOf(student.avatarBackground) !== -1
        ? student.avatarBackground
        : AVATAR_BACKGROUNDS[0];
    return (
      '<img class="avatar" style="background-color:' +
      background +
      '" src="' +
      student.avatar +
      '" alt="">'
    );
  }

  function arDays(n) {
    if (n === 1) return "يوم";
    if (n === 2) return "يومين";
    if (n >= 3 && n <= 10) return n + " أيام";
    return n + " يوم";
  }

  // whole days from today until the given YYYY-MM-DD (negative = already past)
  function daysUntil(iso) {
    var p = String(iso || "")
      .split("-")
      .map(Number);
    if (p.length !== 3 || !p[0] || !p[1] || !p[2]) return null;
    var now = new Date();
    var target = Date.UTC(p[0], p[1] - 1, p[2]);
    var today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((target - today) / 86400000);
  }

  function timeLeftMarkup(student) {
    if (isStopped(student))
      return (
        '<span class="sc-days tl-stopped">' + t("stoppedBadge") + "</span>"
      );
    var d = daysUntil(student.endDate);
    if (d === null) return '<span class="sc-days tl-none">—</span>';
    if (d < 0)
      return (
        '<span class="sc-days tl-late">' + t("daysOverdue")(-d) + "</span>"
      );
    if (d === 0)
      return '<span class="sc-days tl-soon">' + t("endsToday") + "</span>";
    return (
      '<span class="sc-days ' +
      (d <= 7 ? "tl-soon" : "tl-ok") +
      '">' +
      t("daysLeft")(d) +
      "</span>"
    );
  }

  function renderTable() {
    populateGroupFilter();
    renderGroupFilterSummary();
    var list = getFilteredStudents();

    if (students.length === 0) {
      els.tableWrap.innerHTML =
        '<div class="empty"><b>' +
        t("emptyNoneTitle") +
        "</b>" +
        t("emptyNoneText") +
        "</div>";
      return;
    }
    if (list.length === 0) {
      els.tableWrap.innerHTML =
        '<div class="empty"><b>' +
        t("emptyFilterTitle") +
        "</b>" +
        t("emptyFilterText") +
        "</div>";
      return;
    }

    var head =
      '<div class="students-head" aria-hidden="true"><span></span><span>' +
      t("thName") +
      "</span><span>" +
      t("thLevel") +
      "</span><span>" +
      t("thTimeLeft") +
      "</span><span></span></div>";

    els.tableWrap.innerHTML =
      head +
      list
        .map(function (s) {
          var badgeClass =
            LEVEL_CATEGORY[s.level] === "lycee"
              ? "badge-lycee"
              : "badge-college";
          var hasNotes = s.notes && s.notes.trim().length > 0;
          var fullName = escapeHtml(s.firstName) + " " + escapeHtml(s.lastName);
          return (
            '<div class="student-card' +
            (isStopped(s) ? " is-stopped" : "") +
            '" data-id="' +
            s.id +
            '">' +
            avatarMarkup(s) +
            '<p class="sc-name"><button type="button" class="sc-name-btn" data-action="details" data-id="' +
            s.id +
            '">' +
            fullName +
            "</button>" +
            (hasNotes
              ? '<span class="sc-note">' +
                NOTE_ICON +
                "<span>" +
                t("noteBadge") +
                "</span></span>"
              : "") +
            "</p>" +
            '<div class="sc-meta">' +
            '<span class="badge ' +
            badgeClass +
            '">' +
            escapeHtml(levelLabel(s.level)) +
            "</span>" +
            "</div>" +
            timeLeftMarkup(s) +
            '<div class="card-menu">' +
            '<button type="button" class="kebab-btn" data-action="kebab" data-id="' +
            s.id +
            '" aria-label="' +
            t("moreActions") +
            '">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>' +
            "</button>" +
            '<div class="kebab-menu" data-menu-id="' +
            s.id +
            '">' +
            '<button type="button" data-action="edit" data-id="' +
            s.id +
            '">' +
            t("edit") +
            "</button>" +
            '<button type="button" data-action="' +
            (isStopped(s) ? "resume" : "stop") +
            '" data-id="' +
            s.id +
            '">' +
            (isStopped(s) ? t("resumeStudying") : t("stopStudying")) +
            "</button>" +
            '<button type="button" data-action="delete" data-id="' +
            s.id +
            '">' +
            t("delete") +
            "</button>" +
            "</div>" +
            "</div>" +
            "</div>"
          );
        })
        .join("");
  }

  function renderStudentsPage() {
    renderStats();
    renderTable();
  }

  /* ---------------- payments ---------------- */
  function studentFee(student) {
    var priceGroup = studentGroupNames(student)
      .map(groupRecord)
      .find(function (group) {
        return group && group.type === "price";
      });
    if (priceGroup) return priceGroup.price;
    var category = LEVEL_CATEGORY[student.level];
    return LEVEL_PRICE[category] || 0;
  }

  function halfMonthChargeTotals(student) {
    return (
      Array.isArray(student.halfMonthCharges) ? student.halfMonthCharges : []
    ).reduce(
      function (totals, charge) {
        if (!charge || typeof charge.amount !== "number") return totals;
        totals.total += charge.amount;
        if (charge.paidAt) totals.paid += charge.amount;
        else totals.due += charge.amount;
        return totals;
      },
      { total: 0, paid: 0, due: 0 },
    );
  }

  function isPastDue(iso) {
    if (!iso) return false;
    return iso < toDateKey(new Date());
  }

  function nextDate(iso) {
    var parts = iso.split("-").map(Number);
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return iso;
    return toDateKey(new Date(parts[0], parts[1] - 1, parts[2] + 1));
  }

  function countDueMonthlyCycles(endDate, today) {
    if (!endDate) return 0;
    var boundary = endDate;
    var count = 0;
    while (boundary < today && count < 1200) {
      var nextBoundary = advanceOneMonth(boundary);
      if (nextBoundary <= boundary) break;
      count++;
      boundary = nextBoundary;
    }
    return count;
  }

  function currentCycleStart(student, today) {
    var endDate = student.endDate;
    if (!endDate) return student.startDate || today;
    if (!isPastDue(endDate)) {
      var coveringPayment = (
        Array.isArray(student.paymentHistory) ? student.paymentHistory : []
      ).filter(function (payment) {
        return (
          payment &&
          payment.kind !== "half-month" &&
          payment.dueDate &&
          advanceOneMonth(payment.dueDate) === endDate
        );
      })[0];
      return coveringPayment
        ? nextDate(coveringPayment.dueDate)
        : student.startDate || endDate;
    }

    var boundary = endDate;
    var lastExpiredBoundary = endDate;
    var count = 0;
    while (boundary < today && count < 1200) {
      lastExpiredBoundary = boundary;
      var nextBoundary = advanceOneMonth(boundary);
      if (nextBoundary <= boundary) break;
      boundary = nextBoundary;
      count++;
    }
    return nextDate(lastExpiredBoundary);
  }

  function paidAmountForCycle(student, cycleStart, today, fee, cyclePaid) {
    var monthlyPaid = 0;
    var halfMonthPaid = 0;
    (Array.isArray(student.paymentHistory)
      ? student.paymentHistory
      : []
    ).forEach(function (payment) {
      if (
        !payment ||
        typeof payment.paidAt !== "string" ||
        payment.paidAt < cycleStart ||
        payment.paidAt > today ||
        typeof payment.amount !== "number"
      )
        return;
      if (payment.kind === "half-month") halfMonthPaid += payment.amount;
      else monthlyPaid += payment.amount;
    });
    if (!monthlyPaid && cyclePaid) monthlyPaid = fee;
    return monthlyPaid + halfMonthPaid;
  }

  function isCurrentCyclePaid(student) {
    if (!student.endDate || isPastDue(student.endDate)) return false;
    return (
      Array.isArray(student.paymentHistory) ? student.paymentHistory : []
    ).some(function (payment) {
      return (
        payment.kind !== "half-month" &&
        payment.dueDate &&
        advanceOneMonth(payment.dueDate) === student.endDate
      );
    });
  }

  function advanceOneMonth(iso) {
    var parts = iso.split("-");
    var y = Number(parts[0]),
      m = Number(parts[1]),
      d = Number(parts[2]);
    if (!y || !m || !d) return iso;
    var dt = new Date(y, m, d); // m is 1-indexed current month -> Date's 0-indexed next month
    var yy = dt.getFullYear(),
      mm = String(dt.getMonth() + 1).padStart(2, "0"),
      dd = String(dt.getDate()).padStart(2, "0");
    return yy + "-" + mm + "-" + dd;
  }

  function paymentTiming(dueDate, paidAt) {
    if (!dueDate || paidAt <= dueDate) return "on-time";
    var dueParts = dueDate.split("-").map(Number);
    var paidParts = paidAt.split("-").map(Number);
    var delayDays =
      (Date.UTC(paidParts[0], paidParts[1] - 1, paidParts[2]) -
        Date.UTC(dueParts[0], dueParts[1] - 1, dueParts[2])) /
      86400000;
    return delayDays <= 7 ? "slightly-late" : "very-late";
  }

  function formatPaymentMonth(iso) {
    if (!iso) return "—";
    var parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return new Intl.DateTimeFormat(t("locale"), {
      month: "long",
      year: "numeric",
    }).format(new Date(Number(parts[0]), Number(parts[1]) - 1, 1));
  }

  function markPaid(id) {
    var student = students.filter(function (s) {
      return s.id === id;
    })[0];
    if (!student) return;
    var paidAt = toDateKey(new Date());
    var monthlyDueCycles = countDueMonthlyCycles(
      student.endDate,
      paymentReferenceDate(student),
    );
    var monthlyDue = studentFee(student) * monthlyDueCycles;
    var unpaidCharges = (
      Array.isArray(student.halfMonthCharges) ? student.halfMonthCharges : []
    ).filter(function (charge) {
      return charge && !charge.paidAt;
    });
    var halfMonthDue = unpaidCharges.reduce(function (sum, charge) {
      return sum + charge.amount;
    }, 0);
    var amountDue = monthlyDue + halfMonthDue;
    if (amountDue <= 0) return;
    if (
      !confirm(
        t("markPaidConfirm")(
          student.firstName + " " + student.lastName,
          amountDue.toLocaleString(t("locale"), { maximumFractionDigits: 2 }),
        ),
      )
    )
      return;
    if (!Array.isArray(student.paymentHistory)) student.paymentHistory = [];
    if (monthlyDueCycles > 0) {
      var base = student.endDate;
      for (var i = 0; i < monthlyDueCycles; i++) {
        var dueDate = base;
        student.paymentHistory.unshift({
          dueDate: dueDate,
          paidAt: paidAt,
          amount: studentFee(student),
          timing: paymentTiming(dueDate, paidAt),
        });
        base = advanceOneMonth(base);
      }
      student.endDate = base;
    }
    unpaidCharges.forEach(function (charge) {
      charge.paidAt = paidAt;
      student.paymentHistory.unshift({
        dueDate: charge.addedAt,
        paidAt: paidAt,
        amount: charge.amount,
        timing: paymentTiming(charge.addedAt, paidAt),
        kind: "half-month",
        custom: charge.custom === true,
      });
    });
    saveStudents();
    renderPaymentsPage();
    renderStudentsPage();
    if (currentPage === "calendar") renderCalendar();
    showToast(t("markPaidSuccess"), false, null, "add");
  }

  function paymentDetailMarkup(selected) {
    var student = selected.student;
    var selectedStatusClass =
      selected.amountDue > 0
        ? "overdue"
        : selected.cyclePaid
          ? "ok"
          : "in-progress";
    var selectedStatusLabel = selected.overdue
      ? t("statusOverdue")
      : selected.halfMonthDue > 0
        ? t("statusAmountDue")
        : selected.cyclePaid
          ? t("statusPaidUp")
          : t("statusInProgress");
    var paymentHistory = Array.isArray(student.paymentHistory)
      ? stu
