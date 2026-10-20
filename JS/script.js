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
      stoppedToggle: "Stopped",
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
      stoppedToggle: "الموقوفون",
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
    stoppedToggle: document.getElementById("stoppedToggle"),
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

  var showStopped = false;
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
        // a student who stopped is hidden everywhere except Payments (while money is owed); this toggle lists only them
        return matchesQuery && matchesLevel && matchesGroup && isStopped(s) === showStopped;
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
  // same backgrounds as the student page (without the pink one)
  var AVATAR_BACKGROUNDS = ["#032c7b", "#0464de", "#aee37b", "#e9fff4"];
  var ROSE_BACKGROUND = "#e64d6b"; // offered to girls only (as on the student page)
  function backgroundChoicesFor(student) {
    return student && student.gender === "female" ? AVATAR_BACKGROUNDS.concat([ROSE_BACKGROUND]) : AVATAR_BACKGROUNDS;
  }
  // older students keep the pastel colour they were given before: show them in the matching new colour
  var LEGACY_AVATAR_BACKGROUNDS = ["#e6f0fc", "#d6e6fb", "#c3dbfa", "#edf4fd", "#f1f6fd", "#eef9e3", "#dff3c9", "#cfeaa8"];
  function avatarColorOf(student) {
    var c = student.avatarBackground;
    if (AVATAR_BACKGROUNDS.indexOf(c) !== -1 || c === ROSE_BACKGROUND) return c;
    var i = LEGACY_AVATAR_BACKGROUNDS.indexOf(c);
    return AVATAR_BACKGROUNDS[(i === -1 ? 0 : i) % AVATAR_BACKGROUNDS.length];
  }

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
        return AVATAR_BACKGROUNDS.indexOf(color) !== -1 || color === ROSE_BACKGROUND;
      });

    targetStudents.forEach(function (student) {
      if (
        AVATAR_BACKGROUNDS.indexOf(student.avatarBackground) !== -1 ||
        student.avatarBackground === ROSE_BACKGROUND ||
        LEGACY_AVATAR_BACKGROUNDS.indexOf(student.avatarBackground) !== -1
      )
        return;
      var palette = backgroundChoicesFor(student);
      var unusedColors = palette.filter(function (color) {
        return usedColors.indexOf(color) === -1;
      });
      var choices = unusedColors.length ? unusedColors : palette;
      var color = choices[Math.floor(Math.random() * choices.length)];
      student.avatarBackground = color;
      usedColors.push(color);
    });
  }

  function avatarMarkup(student) {
    var background = avatarColorOf(student);
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
    var stoppedCount = students.filter(isStopped).length;
    if (!stoppedCount) showStopped = false;
    els.stoppedToggle.hidden = !stoppedCount;
    els.stoppedToggle.textContent = t("stoppedToggle") + " (" + stoppedCount + ")";
    els.stoppedToggle.setAttribute("aria-pressed", showStopped ? "true" : "false");
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
            (isStopped(s) ? "" : timeLeftMarkup(s)) +
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
      ? student.paymentHistory.slice().sort(function (a, b) {
          return (b.paidAt || "").localeCompare(a.paidAt || "");
        })
      : [];
    var historyMarkup = paymentHistory.length
      ? paymentHistory
          .map(function (payment) {
            var timing = payment.timing || "on-time";
            var timingLabel =
              timing === "slightly-late"
                ? t("paymentSlightlyLate")
                : timing === "very-late"
                  ? t("paymentVeryLate")
                  : t("paymentOnTime");
            var badgeClass =
              timing === "slightly-late"
                ? "slightly-late"
                : timing === "very-late"
                  ? "very-late"
                  : "on-time";
            return (
              '<article class="payment-history-item"><div class="payment-history-copy"><b>' +
              formatPaymentMonth(payment.dueDate || payment.paidAt) +
              "</b><span>" +
              (payment.kind === "half-month"
                ? payment.custom
                  ? t("customChargeType")
                  : t("halfMonthPaymentType")
                : t("paymentMonthlyFee")) +
              "</span><span>" +
              t("paymentDateLabel") +
              " " +
              formatDate(payment.paidAt) +
              "</span><span>" +
              payment.amount.toLocaleString(t("locale"), {
                maximumFractionDigits: 2,
              }) +
              " " +
              t("dtSuffix") +
              '</span></div><span class="payment-history-badge ' +
              badgeClass +
              '">' +
              timingLabel +
              "</span></article>"
            );
          })
          .join("")
      : '<p class="payment-history-empty">' + t("paymentHistoryEmpty") + "</p>";

    return (
      '<div class="payment-details-heading">' +
      avatarMarkup(student) +
      '<div><p class="payment-detail-label">' +
      t("thName") +
      '</p><h2 class="payment-detail-name">' +
      escapeHtml(student.firstName + " " + student.lastName) +
      '</h2></div><span class="payment-status ' +
      selectedStatusClass +
      '">' +
      selectedStatusLabel +
      '</span></div><div class="payment-detail-grid"><div class="payment-detail-tile"><span>' +
      t("thLevel") +
      "</span><b>" +
      escapeHtml(levelLabel(student.level)) +
      '</b></div><div class="payment-detail-tile"><span>' +
      t("paymentMonthlyFee") +
      "</span><b>" +
      selected.fee +
      " " +
      t("dtSuffix") +
      '</b></div><div class="payment-detail-tile"><span>' +
      t("paymentAmountDue") +
      "</span><b>" +
      selected.amountDue.toLocaleString(t("locale"), {
        maximumFractionDigits: 2,
      }) +
      " " +
      t("dtSuffix") +
      '</b></div><div class="payment-detail-tile"><span>' +
      t("thEnd") +
      "</span><b>" +
      formatDate(student.endDate) +
      '</b></div></div><div class="payment-history"><h3>' +
      t("paymentHistoryTitle") +
      '</h3><div class="payment-history-list">' +
      historyMarkup +
      "</div></div>"
    );
  }

  function isMobilePaymentsView() {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(max-width: 920px)").matches
    );
  }

  function renderPaymentsPage() {
    if (!els.paymentsKpiRow || !els.paymentsList) return;

    selectedHalfMonthIds = selectedHalfMonthIds.filter(function (id) {
      return paymentStudents().some(function (student) {
        return student.id === id;
      });
    });
    renderHalfMonthPicker();
    updateHalfMonthCalcState();

    var rows = paymentStudents().map(function (s) {
      var charges = halfMonthChargeTotals(s);
      var today = paymentReferenceDate(s);
      var dueCycles = countDueMonthlyCycles(s.endDate, today);
      var cyclePaid = dueCycles === 0 && isCurrentCyclePaid(s);
      return {
        student: s,
        fee: studentFee(s),
        overdue: dueCycles > 0,
        dueCycles: dueCycles,
        cyclePaid: cyclePaid,
        cycleStart: currentCycleStart(s, today),
        halfMonthTotals: charges,
        halfMonthDue: charges.due,
        amountDue: studentFee(s) * dueCycles + charges.due,
      };
    });

    var expected = rows.reduce(function (sum, r) {
      return isStopped(r.student) ? sum : sum + r.fee;
    }, 0);
    var paidAmount = rows.reduce(function (sum, r) {
      if (isStopped(r.student)) return sum;
      return (
        sum +
        paidAmountForCycle(
          r.student,
          r.cycleStart,
          toDateKey(new Date()),
          r.fee,
          r.cyclePaid,
        )
      );
    }, 0);
    var unpaidAmount = rows.reduce(function (sum, r) {
      return sum + r.amountDue;
    }, 0);

    els.paymentsKpiRow.innerHTML =
      '<div class="kpi-card kpi-total"><span class="kpi-label">' +
      t("kpiMonthlyIncome") +
      '</span><span class="kpi-value">' +
      expected +
      " " +
      t("dtSuffix") +
      "</span></div>" +
      '<div class="kpi-card kpi-college"><span class="kpi-label">' +
      t("kpiPaidAmount") +
      '</span><span class="kpi-value">' +
      paidAmount +
      " " +
      t("dtSuffix") +
      "</span></div>" +
      '<div class="kpi-card kpi-danger"><span class="kpi-label">' +
      t("kpiUnpaidAmount") +
      '</span><span class="kpi-value">' +
      unpaidAmount +
      " " +
      t("dtSuffix") +
      "</span></div>";

    if (rows.length === 0) {
      els.paymentsList.innerHTML =
        '<div class="payments-board empty-board"><div class="empty"><b>' +
        t("emptyNoneTitle") +
        "</b>" +
        t("emptyNoneText") +
        "</div></div>";
      halfMonthCalculated = false;
      renderHalfMonthResult();
      return;
    }

    rows.sort(function (a, b) {
      if (a.amountDue > 0 !== b.amountDue > 0) return a.amountDue > 0 ? -1 : 1;
      return (a.student.endDate || "").localeCompare(b.student.endDate || "");
    });

    var mobileView = isMobilePaymentsView();
    var selected = rows.filter(function (r) {
      return r.student.id === selectedPaymentId;
    })[0];
    if (!selected && !mobileView) {
      selected = rows[0];
      selectedPaymentId = rows[0].student.id;
    }

    var roster = rows
      .map(function (r) {
        var s = r.student;
        var isSelected = s.id === selectedPaymentId;
        var rowClass =
          "payment-row" +
          (r.amountDue > 0 ? " is-overdue" : "") +
          (isSelected ? " is-selected" : "");
        var statusClass =
          r.amountDue > 0 ? "overdue" : r.cyclePaid ? "ok" : "in-progress";
        var statusLabel = r.overdue
          ? t("statusOverdue")
          : r.halfMonthDue > 0
            ? t("statusAmountDue")
            : r.cyclePaid
              ? t("statusPaidUp")
              : t("statusInProgress");
        var articleHtml =
          '<article class="' +
          rowClass +
          '" data-id="' +
          s.id +
          '">' +
          '<button type="button" class="payment-select" data-action="select-payment" data-id="' +
          s.id +
          '" aria-pressed="' +
          isSelected +
          '">' +
          avatarMarkup(s) +
          '<span class="payment-info-text">' +
          '<p class="payment-name">' +
          escapeHtml(s.firstName + " " + s.lastName) +
          "</p>" +
          '<p class="payment-due">' +
          t("dueOn") +
          " " +
          formatDate(s.endDate) +
          (isStopped(s) ? " · " + t("stoppedBadge") : "") +
          "</p></span>" +
          '<span class="payment-fee">' +
          (r.amountDue > 0 ? r.amountDue : r.fee) +
          " " +
          t("dtSuffix") +
          "</span>" +
          '<span class="payment-status ' +
          statusClass +
          '">' +
          statusLabel +
          "</span></button>" +
          '<div class="payment-actions"><button type="button" class="btn btn-primary" data-action="mark-paid" data-id="' +
          s.id +
          '"' +
          (r.amountDue > 0 ? "" : " disabled") +
          ">" +
          t("markPaid") +
          "</button>" +
          "</div></article>";

        if (isSelected && selected) {
          articleHtml +=
            '<div class="payment-details-inline is-open">' +
            paymentDetailMarkup(selected) +
            "</div>";
        }
        return articleHtml;
      })
      .join("");

    var detailsSectionHtml = selected
      ? '<section class="payment-details">' +
        paymentDetailMarkup(selected) +
        "</section>"
      : "";

    els.paymentsList.innerHTML =
      '<div class="payments-board"><section class="payments-roster"><h2 class="payments-board-title">' +
      t("paymentsRosterTitle") +
      '</h2><div class="payments-roster-list">' +
      roster +
      "</div></section>" +
      detailsSectionHtml +
      "</div>";
    renderHalfMonthResult();
  }

  function renderHalfMonthPicker() {
    var pickList = paymentStudents();
    var allSelected =
      pickList.length > 0 && selectedHalfMonthIds.length === pickList.length;
    var options =
      '<label class="half-month-option"><input type="checkbox" data-action="select-half-month-all" aria-label="' +
      t("halfMonthAllLabel") +
      '"' +
      (allSelected ? " checked" : "") +
      "><span>" +
      t("halfMonthAll") +
      "</span></label>";
    if (pickList.length) {
      options += pickList
        .map(function (student) {
          var selected = selectedHalfMonthIds.indexOf(student.id) !== -1;
          var name = escapeHtml(student.firstName + " " + student.lastName);
          return (
            '<label class="half-month-option"><input type="checkbox" data-action="select-half-month-student" data-id="' +
            student.id +
            '" aria-label="' +
            t("halfMonthStudentLabel")(name) +
            '"' +
            (selected ? " checked" : "") +
            "><span>" +
            name +
            "</span></label>"
          );
        })
        .join("");
    } else {
      options +=
        '<span class="half-month-no-students">' +
        t("halfMonthNoStudents") +
        "</span>";
    }
    els.halfMonthPickerOptions.innerHTML = options;
    updateHalfMonthPickerLabel();
  }

  function updateHalfMonthPickerLabel() {
    if (selectedHalfMonthIds.length === 0) {
      els.halfMonthPickerLabel.textContent = t("halfMonthPickerLabel");
    } else if (selectedHalfMonthIds.length === paymentStudents().length) {
      els.halfMonthPickerLabel.textContent = t("halfMonthAllSelected");
    } else {
      els.halfMonthPickerLabel.textContent = t("halfMonthSelectedCount")(
        selectedHalfMonthIds.length,
      );
    }
    var allCheckbox = els.halfMonthPickerOptions.querySelector(
      'input[data-action="select-half-month-all"]',
    );
    if (allCheckbox) {
      allCheckbox.checked =
        paymentStudents().length > 0 &&
        selectedHalfMonthIds.length === paymentStudents().length;
    }
  }

  function renderHalfMonthResult() {
    if (!halfMonthCalculated || halfMonthResultItems.length === 0) {
      els.halfMonthResult.hidden = true;
      els.halfMonthResult.innerHTML = "";
      return;
    }
    var total = halfMonthResultItems.reduce(function (sum, item) {
      return sum + item.amount;
    }, 0);
    var rows = halfMonthResultItems
      .map(function (item) {
        return (
          "<li><span>" +
          escapeHtml(item.name) +
          "</span><b>" +
          item.amount.toLocaleString(t("locale"), {
            maximumFractionDigits: 2,
          }) +
          " " +
          t("dtSuffix") +
          "</b></li>"
        );
      })
      .join("");
    els.halfMonthResult.innerHTML =
      "<h3>" +
      t("halfMonthAddedTitle") +
      "</h3><ul>" +
      rows +
      "</ul><p><b>" +
      t("halfMonthTotal") +
      ": " +
      total.toLocaleString(t("locale"), { maximumFractionDigits: 2 }) +
      " " +
      t("dtSuffix") +
      "</b></p>";
    els.halfMonthResult.hidden = false;
  }

  function customAmountValue() {
    var v = parseFloat(String(els.halfMonthAmount.value).replace(",", "."));
    return isFinite(v) && v > 0 ? Math.round(v * 100) / 100 : 0;
  }

  function updateHalfMonthCalcState() {
    var needsAmount = halfMonthMode === "custom";
    els.halfMonthCalculateBtn.disabled =
      selectedHalfMonthIds.length === 0 ||
      (needsAmount && customAmountValue() <= 0);
  }

  function setHalfMonthMode(mode) {
    halfMonthMode = mode === "custom" ? "custom" : "half";
    var isCustom = halfMonthMode === "custom";
    els.halfMonthModeHalf.classList.toggle("active", !isCustom);
    els.halfMonthModeCustom.classList.toggle("active", isCustom);
    els.halfMonthModeHalf.setAttribute("aria-pressed", String(!isCustom));
    els.halfMonthModeCustom.setAttribute("aria-pressed", String(isCustom));
    els.halfMonthAmountWrap.hidden = !isCustom;
    if (isCustom) els.halfMonthAmount.focus();
    halfMonthCalculated = false;
    els.halfMonthResult.hidden = true;
    els.halfMonthResult.innerHTML = "";
    updateHalfMonthCalcState();
  }

  function addHalfMonthDue() {
    var selectedStudents = students.filter(function (student) {
      return selectedHalfMonthIds.indexOf(student.id) !== -1;
    });
    if (selectedStudents.length === 0) return;
    var isCustom = halfMonthMode === "custom";
    var customAmount = customAmountValue();
    if (isCustom && customAmount <= 0) return;
    var addedAt = toDateKey(new Date());
    halfMonthResultItems = selectedStudents.map(function (student) {
      var amount = isCustom ? customAmount : studentFee(student) / 2;
      if (!Array.isArray(student.halfMonthCharges))
        student.halfMonthCharges = [];
      student.halfMonthCharges.push({
        amount: amount,
        addedAt: addedAt,
        paidAt: "",
        custom: isCustom,
      });
      return {
        name: student.firstName + " " + student.lastName,
        amount: amount,
      };
    });
    selectedHalfMonthIds = [];
    halfMonthCalculated = true;
    if (isCustom) els.halfMonthAmount.value = "";
    saveStudents();
    renderPaymentsPage();
    var total = halfMonthResultItems.reduce(function (sum, item) {
      return sum + item.amount;
    }, 0);
    showToast(
      t(isCustom ? "customChargeAddSuccess" : "halfMonthAddSuccess")(
        halfMonthResultItems.length,
        total.toLocaleString(t("locale"), { maximumFractionDigits: 2 }),
      ),
      false,
      null,
      "add",
    );
    renderHalfMonthResult();
  }

  function handleHalfMonthSelectionChange(e) {
    var checkbox = e.target.closest('input[data-action^="select-half-month"]');
    if (!checkbox) return;
    if (checkbox.dataset.action === "select-half-month-all") {
      selectedHalfMonthIds = checkbox.checked
        ? paymentStudents().map(function (student) {
            return student.id;
          })
        : [];
      renderHalfMonthPicker();
    } else {
      var id = checkbox.getAttribute("data-id");
      if (checkbox.checked && selectedHalfMonthIds.indexOf(id) === -1) {
        selectedHalfMonthIds.push(id);
      } else if (!checkbox.checked) {
        selectedHalfMonthIds = selectedHalfMonthIds.filter(function (item) {
          return item !== id;
        });
      }
      updateHalfMonthPickerLabel();
    }
    halfMonthCalculated = false;
    updateHalfMonthCalcState();
    els.halfMonthResult.hidden = true;
    els.halfMonthResult.innerHTML = "";
  }

  function openHalfMonthModal() {
    els.halfMonthModalOverlay.classList.add("open");
    els.halfMonthPickerLabel.setAttribute("aria-expanded", "true");
    els.halfMonthModalClose.focus();
  }

  function closeHalfMonthModal() {
    els.halfMonthModalOverlay.classList.remove("open");
    els.halfMonthPickerLabel.setAttribute("aria-expanded", "false");
    els.halfMonthPickerLabel.focus();
  }

  function handlePaymentsClick(e) {
    var btn = e.target.closest('button[data-action="mark-paid"]');
    if (btn) {
      markPaid(btn.getAttribute("data-id"));
      return;
    }
    var selectBtn = e.target.closest('button[data-action="select-payment"]');
    if (!selectBtn) return;
    var id = selectBtn.getAttribute("data-id");
    if (isMobilePaymentsView() && selectedPaymentId === id) {
      selectedPaymentId = null;
    } else {
      selectedPaymentId = id;
    }
    renderPaymentsPage();
  }

  /* ---------------- modal (add/edit) ---------------- */
  var SUBMIT_ICON_ADD =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>';
  var SUBMIT_ICON_SAVE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  function openModal(mode, student) {
    els.studentForm.reset();
    if (mode === "edit" && student) {
      els.modalTitle.textContent = t("modalEditTitle");
      els.submitLabel.textContent = t("saveChanges");
      els.submitIcon.innerHTML = SUBMIT_ICON_SAVE;
      els.studentId.value = student.id;
      els.firstName.value = student.firstName;
      els.lastName.value = student.lastName;
      els.level.value = student.level;
      els.gender.value = student.gender || "";
      els.startDate.value = student.startDate;
      els.endDate.value = student.endDate || "";
      els.notes.value = student.notes || "";
      els.studentGroup.value = studentGroupNames(student).join(", ");
      els.endDate.dataset.auto = student.endDate ? "false" : "true";
    } else {
      els.modalTitle.textContent = t("modalAddTitle");
      els.submitLabel.textContent = t("add");
      els.submitIcon.innerHTML = SUBMIT_ICON_ADD;
      els.studentId.value = "";
      els.level.value = LEVELS[0];
      els.gender.value = "";
      els.studentGroup.value = "";
      els.endDate.dataset.auto = "true";
    }
    els.modalOverlay.classList.add("open");
    els.firstName.focus();
  }
  function closeModal() {
    els.modalOverlay.classList.remove("open");
  }

  function handleSubmit(e) {
    e.preventDefault();
    var id = els.studentId.value;
    var data = {
      firstName: els.firstName.value.trim(),
      lastName: els.lastName.value.trim(),
      level: els.level.value,
      gender: els.gender.value,
      startDate: els.startDate.value,
      endDate: els.endDate.value || "",
      notes: els.notes.value.trim(),
    };
    if (
      !data.firstName ||
      !data.lastName ||
      !data.level ||
      !data.gender ||
      !data.startDate
    )
      return;

    if (id) {
      students = students.map(function (s) {
        return s.id === id ? Object.assign({}, s, data) : s;
      });
    } else {
      data.id = makeId();
      data.avatar = getNextAvatar(
        data.gender,
        students.filter(function (s) {
          return s.gender === data.gender;
        }).length,
      );
      assignAvatarBackgrounds([data], students);
      students.push(data);
    }
    saveStudents();
    renderGroups();
    closeModal();
    renderStudentsPage();
    if (currentPage === "calendar") renderCalendar();
    if (currentPage === "payments") renderPaymentsPage();
    showToast(
      t(id ? "studentUpdated" : "studentAdded"),
      false,
      null,
      id ? "edit" : "add",
    );
  }

  var noteStudent = null;

  function profileGroupsMarkup(student) {
    var names = studentGroupNames(student);
    if (!names.length) return "";
    var out = "";
    names.forEach(function (name) {
      var group = groupRecord(name);
      var color = group
        ? GROUP_COLORS[groups.indexOf(group) % GROUP_COLORS.length]
        : GROUP_COLORS[0];
      var detail = "";
      if (group) {
        detail =
          group.type === "price"
            ? group.price.toLocaleString(t("locale"), {
                maximumFractionDigits: 2,
              }) +
              " " +
              t("dtSuffix")
            : (group.days || [])
                .map(function (day) {
                  return t("dow")[day - 1];
                })
                .join(" · ");
      }
      out +=
        '<span class="profile-group" style="--gc:' +
        color +
        '"><b>' +
        escapeHtml(name) +
        "</b>" +
        (detail ? "<small>" + escapeHtml(detail) + "</small>" : "") +
        "</span>";
    });
    return out;
  }

  function openNoteModal(student) {
    noteStudent = student;
    els.noteModalTitle.textContent = student.firstName + " " + student.lastName;
    els.noteModalAvatar.innerHTML = avatarMarkup(student);
    var bannerKey = {
      "#032c7b": "azure",
      "#0464de": "royal",
      "#aee37b": "lime",
      "#e9fff4": "frost",
      "#e64d6b": "rose",
    }[avatarColorOf(student)];
    var noteBanner = els.noteModalAvatar.parentNode.querySelector(".profile-banner");
    if (noteBanner) {
      if (bannerKey) noteBanner.setAttribute("data-bg", bannerKey);
      else noteBanner.removeAttribute("data-bg");
    }
    var badgeClass =
      LEVEL_CATEGORY[student.level] === "lycee"
        ? "badge-lycee"
        : "badge-college";
    var genderLabel =
      student.gender === "female"
        ? t("genderFemale")
        : student.gender === "male"
          ? t("genderMale")
          : "";
    var html =
      '<div class="profile-meta"><span class="badge ' +
      badgeClass +
      '">' +
      escapeHtml(levelLabel(student.level)) +
      "</span>" +
      (genderLabel
        ? '<span class="profile-chip">' + escapeHtml(genderLabel) + "</span>"
        : "") +
      profileGroupsMarkup(student) +
      "</div>" +
      '<div class="profile-stats">' +
      '<div class="profile-stat"><b>' +
      escapeHtml(formatDate(student.startDate)) +
      "</b><span>" +
      t("thStart") +
      "</span></div>" +
      '<div class="profile-stat"><b>' +
      escapeHtml(formatDate(student.endDate)) +
      "</b><span>" +
      t("thEnd") +
      "</span></div>" +
      '<div class="profile-stat"><b>' +
      timeLeftMarkup(student) +
      "</b><span>" +
      t("thTimeLeft") +
      "</span></div>" +
      "</div>";
    if (student.notes && student.notes.trim()) {
      html +=
        '<div class="profile-notes">' + escapeHtml(student.notes) + "</div>";
    }
    els.noteModalBody.innerHTML = html;
    els.noteModalOverlay.classList.add("open");
  }
  function closeNoteModal() {
    els.noteModalOverlay.classList.remove("open");
    noteStudent = null;
  }

  function closeAllKebabMenus() {
    document.querySelectorAll(".kebab-menu.open").forEach(function (m) {
      m.classList.remove("open");
    });
  }

  function refreshAfterStatusChange() {
    saveStudents();
    renderGroups();
    renderStudentsPage();
    if (currentPage === "calendar") renderCalendar();
    if (currentPage === "payments") renderPaymentsPage();
  }

  function handleTableClick(e) {
    var btn = e.target.closest("button[data-action]");
    if (!btn) {
      var row = e.target.closest(".student-card");
      var inMenu = e.target.closest(".card-menu");
      closeAllKebabMenus();
      if (row && !inMenu) {
        var rowStudent = students.filter(function (s) {
          return s.id === row.getAttribute("data-id");
        })[0];
        if (rowStudent) openNoteModal(rowStudent);
      }
      return;
    }
    var id = btn.getAttribute("data-id");
    var student = students.filter(function (s) {
      return s.id === id;
    })[0];

    if (btn.dataset.action === "kebab") {
      var menu = document.querySelector(
        '.kebab-menu[data-menu-id="' + id + '"]',
      );
      var wasOpen = menu && menu.classList.contains("open");
      closeAllKebabMenus();
      if (menu && !wasOpen) menu.classList.add("open");
      return;
    }
    if (!student) return;

    if (btn.dataset.action === "edit") {
      closeAllKebabMenus();
      openModal("edit", student);
    } else if (btn.dataset.action === "stop") {
      closeAllKebabMenus();
      if (
        confirm(t("stopConfirm")(student.firstName + " " + student.lastName))
      ) {
        students = students.map(function (s) {
          return s.id === id
            ? Object.assign({}, s, { stoppedAt: toDateKey(new Date()) })
            : s;
        });
        refreshAfterStatusChange();
        showToast(t("studentStopped"));
      }
    } else if (btn.dataset.action === "resume") {
      closeAllKebabMenus();
      if (
        confirm(t("resumeConfirm")(student.firstName + " " + student.lastName))
      ) {
        var resumeDate = toDateKey(new Date());
        students = students.map(function (s) {
          if (s.id !== id) return s;
          var next = Object.assign({}, s, {
            startDate: resumeDate,
            endDate: autoEndDate(resumeDate),
          });
          delete next.stoppedAt;
          return next;
        });
        refreshAfterStatusChange();
        showToast(t("studentResumed"));
      }
    } else if (btn.dataset.action === "delete") {
      closeAllKebabMenus();
      if (
        confirm(t("deleteConfirm")(student.firstName + " " + student.lastName))
      ) {
        students = students.filter(function (s) {
          return s.id !== id;
        });
        saveStudents();
        renderStudentsPage();
        if (currentPage === "payments") renderPaymentsPage();
        showToast(t("studentDeleted"), false, null, "delete");
      }
    } else if (btn.dataset.action === "details") {
      openNoteModal(student);
    }
  }

  /* ---------------- calendar ---------------- */
  function buildEventsMap() {
    var map = {};
    var year = calendarCursor.getFullYear();
    var month = calendarCursor.getMonth();
    var firstOfMonth = new Date(year, month, 1);
    var startOffset = (firstOfMonth.getDay() + 6) % 7;
    var gridStart = new Date(year, month, 1 - startOffset);
    students.forEach(function (s) {
      if (isStopped(s)) return;
      var memberships = studentGroupNames(s);
      if (activeGroup && memberships.indexOf(activeGroup) === -1) return;
      if (s.startDate) {
        map[s.startDate] = map[s.startDate] || [];
        map[s.startDate].push({ student: s, type: "start" });
      }
      if (s.endDate) {
        map[s.endDate] = map[s.endDate] || [];
        map[s.endDate].push({ student: s, type: "end" });
      }
      memberships.forEach(function (membership) {
        var group = groupRecord(membership);
        if (!group || group.type !== "days") return;
        for (var dayOffset = 0; dayOffset < 42; dayOffset++) {
          var studyDate = new Date(
            gridStart.getFullYear(),
            gridStart.getMonth(),
            gridStart.getDate() + dayOffset,
          );
          if (!group.days.includes(studyDate.getDay())) continue;
          var studyKey = toDateKey(studyDate);
          if (s.startDate && studyKey < s.startDate) continue;
          if (s.endDate && studyKey > s.endDate) continue;
          map[studyKey] = map[studyKey] || [];
          map[studyKey].push({
            student: s,
            type: "study",
            groupName: group.name,
          });
        }
      });
    });
    return map;
  }

  function renderCalendar() {
    renderGroups();
    var eventsMap = buildEventsMap();
    var year = calendarCursor.getFullYear();
    var month = calendarCursor.getMonth();

    els.calMonthLabel.textContent = calendarCursor.toLocaleDateString(
      t("locale"),
      { month: "long", year: "numeric" },
    );

    var firstOfMonth = new Date(year, month, 1);
    var startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
    var gridStart = new Date(year, month, 1 - startOffset);
    var today = new Date();
    var dow = t("dow");
    var cellsHtml = dow
      .map(function (d) {
        return '<div class="cal-dow">' + d + "</div>";
      })
      .join("");

    // enrollment ranges (start date -> end date) of the visible students
    var ranges = students
      .filter(function (s) {
        if (isStopped(s)) return false;
        if (!s.startDate || !s.endDate || s.endDate < s.startDate) return false;
        var memberships = studentGroupNames(s);
        return !activeGroup || memberships.indexOf(activeGroup) !== -1;
      })
      .map(function (s) {
        return { start: s.startDate, end: s.endDate };
      });
    function inEnrollmentRange(date) {
      if (date.getMonth() !== month) return false;
      var k = toDateKey(date);
      return ranges.some(function (r) {
        return k >= r.start && k <= r.end;
      });
    }
    function addDays(date, n) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
    }

    for (var i = 0; i < 42; i++) {
      var cellDate = new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + i,
      );
      var isOutside = cellDate.getMonth() !== month;
      var key = toDateKey(cellDate);
      var dayEvents = eventsMap[key] || [];
      var hasStart = dayEvents.some(function (ev) {
        return ev.type === "start";
      });
      var hasEnd = dayEvents.some(function (ev) {
        return ev.type === "end";
      });
      var hasStudy = dayEvents.some(function (ev) {
        return ev.type === "study";
      });

      var classes = ["cal-cell"];
      if (isOutside) classes.push("outside");
      if (!isOutside && cellDate.getDate() === 1) {
        classes.push("month-start");
      }
      if (
        !isOutside &&
        cellDate.getDate() === new Date(year, month + 1, 0).getDate()
      ) {
        classes.push("month-end");
      }
      if (inEnrollmentRange(cellDate)) {
        classes.push("in-range");
        // round the band at the start/end of a range and at the row edges
        if (i % 7 === 0 || !inEnrollmentRange(addDays(cellDate, -1))) {
          classes.push("range-start");
        }
        if (i % 7 === 6 || !inEnrollmentRange(addDays(cellDate, 1))) {
          classes.push("range-end");
        }
      }
      if (sameDay(cellDate, today)) classes.push("today");
      if (sameDay(cellDate, selectedDate)) classes.push("selected");

      var dotsHtml = "";
      if (hasStart || hasEnd || hasStudy) {
        dotsHtml =
          '<div class="cal-dots">' +
          (hasStart ? '<span class="cal-dot dot-start"></span>' : "") +
          (hasEnd ? '<span class="cal-dot dot-end"></span>' : "") +
          (hasStudy ? '<span class="cal-dot dot-study"></span>' : "") +
          "</div>";
      }
      cellsHtml +=
        '<div class="' +
        classes.join(" ") +
        '" data-date="' +
        key +
        '"><span>' +
        cellDate.getDate() +
        "</span>" +
        dotsHtml +
        "</div>";
    }

    els.calGrid.innerHTML = cellsHtml;
    renderEventsList(eventsMap);
  }

  function renderEventsList(eventsMap) {
    var key = toDateKey(selectedDate);
    var dayEvents = eventsMap[key] || [];
    els.eventsSub.textContent = selectedDate.toLocaleDateString(t("locale"), {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    if (dayEvents.length === 0) {
      els.eventsList.innerHTML =
        '<div class="empty" style="padding:30px 10px;"><b>' +
        t("noEventsTitle") +
        "</b>" +
        t("noEventsText") +
        "</div>";
      return;
    }

    var groupedEvents = [];
    dayEvents.forEach(function (ev) {
      var groupKey =
        ev.type === "study" ? ev.type + ":" + ev.groupName : ev.type;
      var eventGroup = groupedEvents.find(function (group) {
        return group.key === groupKey;
      });
      if (!eventGroup) {
        eventGroup = {
          key: groupKey,
          type: ev.type,
          groupName: ev.groupName || "",
          students: [],
        };
        groupedEvents.push(eventGroup);
      }
      if (
        !eventGroup.students.some(function (student) {
          return student.id === ev.student.id;
        })
      ) {
        eventGroup.students.push(ev.student);
      }
    });

    els.eventsList.innerHTML = groupedEvents
      .map(function (eventGroup) {
        var color;
        if (eventGroup.type === "start") {
          color = "var(--color-primary)";
        } else if (eventGroup.type === "end") {
          color = "var(--color-danger)";
        } else {
          var groupColorIndex = eventGroup.groupName.split("").reduce(function (
            sum,
            character,
          ) {
            return sum + character.charCodeAt(0);
          }, 0);
          color = GROUP_COLORS[groupColorIndex % GROUP_COLORS.length];
        }
        var label =
          eventGroup.type === "start"
            ? t("legendStart")
            : eventGroup.type === "end"
              ? t("legendEnd")
              : t("legendStudy") + " — " + eventGroup.groupName;
        var names = eventGroup.students.map(function (student) {
          return student.firstName + " " + student.lastName;
        });
        var showNames = revealedEventGroupKey === key + ":" + eventGroup.type;
        var namesMarkup = names
          .map(function (name) {
            return '<span role="listitem">' + escapeHtml(name) + "</span>";
          })
          .join("");
        var visibleAvatars = eventGroup.students
          .slice(0, 4)
          .map(function (student) {
            var name = student.firstName + " " + student.lastName;
            return (
              '<span class="event-avatar" title="' +
              escapeHtml(name) +
              '">' +
              avatarMarkup(student) +
              "</span>"
            );
          })
          .join("");
        if (eventGroup.students.length > 4) {
          visibleAvatars +=
            '<span class="event-avatar-overflow" aria-hidden="true">+' +
            (eventGroup.students.length - 4) +
            "</span>";
        }
        return (
          '<div class="event-item" style="--event-color:' +
          color +
          '"><div class="event-copy"><b>' +
          escapeHtml(label) +
          '</b></div><div class="event-members' +
          (showNames ? " is-open" : "") +
          '"><button type="button" class="event-avatars event-avatars-trigger" aria-label="' +
          escapeHtml(names.join(", ")) +
          '">' +
          visibleAvatars +
          '</button><button type="button" class="event-count" aria-label="' +
          escapeHtml(
            t("groupStudentCount")(eventGroup.students.length) +
              ": " +
              names.join(", "),
          ) +
          '">' +
          eventGroup.students.length +
          '</button><div class="event-member-names" role="list">' +
          namesMarkup +
          "</div></div></div>"
        );
      })
      .join("");
  }

  var groupDetailIndex = -1;

  function nextGroupSession(group) {
    if (!group.days || !group.days.length) return null;
    var now = new Date();
    for (var i = 0; i < 7; i++) {
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      if (group.days.indexOf(d.getDay()) !== -1) {
        return { date: toDateKey(d), today: i === 0 };
      }
    }
    return null;
  }

  function openGroupDetail(index) {
    var group = groups[index];
    if (!group) return;
    groupDetailIndex = index;
    var color = GROUP_COLORS[index % GROUP_COLORS.length];
    var members = students.filter(function (student) {
      return (
        !isStopped(student) &&
        studentGroupNames(student).indexOf(group.name) !== -1
      );
    });
    var isPrice = group.type === "price";
    var priceText =
      group.price.toLocaleString(t("locale"), { maximumFractionDigits: 2 }) +
      " " +
      t("dtSuffix");
    var totalText =
      (group.price * members.length).toLocaleString(t("locale"), {
        maximumFractionDigits: 2,
      }) +
      " " +
      t("dtSuffix");

    els.groupDetailModal.style.setProperty("--gc", color);
    els.groupDetailTitle.textContent = group.name;
    els.groupDetailMark.innerHTML =
      '<span class="group-mark">' + GROUP_MARK_ICON + "</span>";

    var stat = function (value, label) {
      return (
        '<div class="profile-stat"><b>' +
        value +
        "</b><span>" +
        escapeHtml(label) +
        "</span></div>"
      );
    };
    var statsHtml = stat(members.length, t("groupStatStudents"));
    if (isPrice) {
      statsHtml += stat(escapeHtml(priceText), t("groupStatPrice"));
      statsHtml += stat(escapeHtml(totalText), t("groupStatTotal"));
    } else {
      var next = nextGroupSession(group);
      statsHtml += stat(group.days.length, t("groupStatDays"));
      statsHtml += stat(
        next
          ? next.today
            ? escapeHtml(t("today"))
            : escapeHtml(formatDate(next.date))
          : "—",
        t("groupStatNext"),
      );
    }

    var html =
      '<div class="profile-meta"><span class="profile-group"><b>' +
      escapeHtml(isPrice ? t("groupModePrice") : t("groupModeDays")) +
      "</b></span></div>" +
      '<div class="profile-stats">' +
      statsHtml +
      "</div>";

    if (!isPrice) {
      html +=
        '<div class="profile-section"><div class="profile-section-title">' +
        escapeHtml(t("groupStudyDaysTitle")) +
        '</div><div class="group-week">' +
        t("dow")
          .slice(0, 6)
          .map(function (label, i) {
            return (
              '<span class="group-day' +
              (group.days.indexOf(i + 1) !== -1 ? " on" : "") +
              '">' +
              escapeHtml(label) +
              "</span>"
            );
          })
          .join("") +
        "</div></div>";
    }

    html +=
      '<div class="profile-section"><div class="profile-section-title">' +
      escapeHtml(t("groupMembersTitle")) +
      "<em>" +
      members.length +
      "</em></div>";
    if (members.length) {
      html +=
        '<div class="group-detail-members">' +
        members
          .map(function (student) {
            var badgeClass =
              LEVEL_CATEGORY[student.level] === "lycee"
                ? "badge-lycee"
                : "badge-college";
            return (
              '<button type="button" class="group-detail-member" data-member-id="' +
              escapeHtml(student.id) +
              '">' +
              avatarMarkup(student) +
              "<span>" +
              escapeHtml(student.firstName + " " + student.lastName) +
              '</span><span class="badge ' +
              badgeClass +
              '">' +
              escapeHtml(levelLabel(student.level)) +
              "</span></button>"
            );
          })
          .join("") +
        "</div>";
    } else {
      html +=
        '<p class="group-detail-empty">' +
        escapeHtml(t("groupNoMembers")) +
        "</p>";
    }
    html += "</div>";

    els.groupDetailBody.innerHTML = html;
    els.groupDetailOverlay.classList.add("open");
  }
  function closeGroupDetail() {
    els.groupDetailOverlay.classList.remove("open");
    groupDetailIndex = -1;
  }

  function renderGroups() {
    if (!els.groupsList) return;
    populateGroupFilter();
    els.groupsTotal.textContent = groups.length;
    var html =
      '<button type="button" class="group-filter group-filter-all' +
      (activeGroup ? "" : " active") +
      '" data-group-filter=""><span>' +
      escapeHtml(t("allGroups")) +
      "</span><b>" +
      groups.length +
      "</b></button>";
    groups.forEach(function (group, index) {
      var groupMembers = students.filter(function (student) {
        return (
          !isStopped(student) &&
          studentGroupNames(student).indexOf(group.name) !== -1
        );
      });
      var count = groupMembers.length;
      var dayNames = Array.isArray(group.days)
        ? group.days.map(function (day) {
            return t("dow")[day - 1];
          })
        : [];
      var summary =
        group.type === "price"
          ? t("groupSummaryPrice")(group.price)
          : dayNames.length
            ? t("groupSummaryDays")(dayNames.join(", "))
            : t("groupSummaryNoDays");
      var avatarHtml = groupMembers
        .slice(0, 3)
        .map(function (student) {
          return (
            '<span class="group-avatar" aria-hidden="true" title="' +
            escapeHtml(student.firstName + " " + student.lastName) +
            '">' +
            avatarMarkup(student) +
            "</span>"
          );
        })
        .join("");
      html +=
        '<div class="group-item"><div class="group-row' +
        (activeGroup === group.name ? " active" : "") +
        '"><button type="button" class="group-filter group-card" data-group-filter="' +
        index +
        '"><span class="group-card-top"><i aria-hidden="true" style="--group-color:' +
        GROUP_COLORS[index % GROUP_COLORS.length] +
        '">' +
        GROUP_MARK_ICON +
        '</i><span class="group-card-type">' +
        escapeHtml(
          group.type === "price" ? t("groupModePrice") : t("groupModeDays"),
        ) +
        '</span></span><strong class="group-card-name">' +
        escapeHtml(group.name) +
        '</strong><span class="group-card-members"><span class="group-avatars">' +
        avatarHtml +
        "</span><small>" +
        escapeHtml(t("groupStudentCount")(count)) +
        '</small></span><span class="group-card-summary">' +
        escapeHtml(summary) +
        '</span></button><button type="button" class="group-edit" data-edit-group="' +
        index +
        '" aria-label="' +
        escapeHtml(t("groupEditTitle")) +
        '" title="' +
        escapeHtml(t("groupEditTitle")) +
        '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg></button><button type="button" class="group-delete" data-delete-group="' +
        index +
        '" aria-label="' +
        escapeHtml(t("deleteGroup")) +
        '" title="' +
        escapeHtml(t("deleteGroup")) +
        '">&times;</button></div>';
      html += "</div>";
    });
    if (groups.length === 0) {
      html += '<p class="groups-empty">' + escapeHtml(t("noGroups")) + "</p>";
    }
    els.groupsList.innerHTML = html;
  }

  function openGroupModal(index) {
    var group = groups[index];
    if (!group) return;
    editingGroupIndex = index;
    els.groupModalTitle.textContent = t("groupEditTitle");
    els.groupModalNameLabel.textContent = t("groupNameLabel");
    els.groupModalName.value = group.name;
    els.groupModalCancel.setAttribute("aria-label", t("close"));
    els.groupModalSaveLabel.textContent = t("saveChanges");

    els.groupModalFields.innerHTML =
      '<div class="group-settings"><label><span>' +
      escapeHtml(t("groupModeLabel")) +
      '</span><select id="groupModalType"><option value="days"' +
      (group.type === "days" ? " selected" : "") +
      ">" +
      escapeHtml(t("groupModeDays")) +
      '</option><option value="price"' +
      (group.type === "price" ? " selected" : "") +
      ">" +
      escapeHtml(t("groupModePrice")) +
      "</option></select></label>" +
      '<label id="groupModalPriceField"><span>' +
      escapeHtml(t("groupMonthlyFee")) +
      '</span><span class="group-price-input"><input id="groupModalPrice" type="number" min="0" step="0.01" value="' +
      escapeHtml(String(group.price)) +
      '" /><b>DT</b></span></label>' +
      '<fieldset class="group-days-setting" id="groupModalDaysField"><legend>' +
      escapeHtml(t("groupStudySchedule")) +
      '</legend><div class="group-day-options">' +
      [1, 2, 3, 4, 5, 6]
        .map(function (day) {
          return (
            '<label class="group-day-option"><input type="checkbox" data-group-modal-day value="' +
            day +
            '"' +
            (group.days.includes(day) ? " checked" : "") +
            " /><span>" +
            escapeHtml(t("dow")[day - 1]) +
            "</span></label>"
          );
        })
        .join("") +
      "</div></fieldset></div>";

    els.groupModalStudents.innerHTML =
      '<div class="group-modal-students"><h3>' +
      escapeHtml(t("groupStudentsLabel")) +
      "</h3><p>" +
      escapeHtml(t("groupMemberHint")) +
      '</p><div class="group-modal-student-list">' +
      (activeStudents().length
        ? students
            .map(function (student, studentIndex) {
              if (isStopped(student)) return ""; // a stopped student is not offered for groups
              var memberships = studentGroupNames(student);
              var conflictingMembership = memberships
                .map(groupRecord)
                .find(function (membership) {
                  return (
                    membership &&
                    membership.name !== group.name &&
                    membership.type === group.type
                  );
                });
              var otherMemberships = memberships.filter(function (name) {
                return name !== group.name;
              });
              var detail = conflictingMembership
                ? t("groupAssignedTo").replace(
                    "{group}",
                    conflictingMembership.name,
                  )
                : otherMemberships.length
                  ? t("groupAlsoIn").replace(
                      "{groups}",
                      otherMemberships.join(", "),
                    )
                  : levelLabel(student.level);
              var isMember = memberships.indexOf(group.name) !== -1;
              return (
                '<label class="group-member' +
                (conflictingMembership ? " unavailable" : "") +
                '"><input type="checkbox" data-group-modal-member="' +
                studentIndex +
                '"' +
                (isMember ? " checked" : "") +
                (conflictingMembership && !isMember ? " disabled" : "") +
                " /><span><b>" +
                escapeHtml(student.firstName + " " + student.lastName) +
                '</b><small data-group-modal-detail="' +
                studentIndex +
                '">' +
                escapeHtml(detail) +
                "</small></span></label>"
              );
            })
            .join("")
        : '<p class="groups-empty">' + escapeHtml(t("noStudents")) + "</p>") +
      "</div></div>";

    updateGroupModalMemberAvailability();
    els.groupModalOverlay.classList.add("open");
    els.groupModalName.focus();
  }

  function updateGroupModalMemberAvailability() {
    var group = groups[editingGroupIndex];
    var typeSelect = document.getElementById("groupModalType");
    if (!group || !typeSelect) return;
    var nextType = typeSelect.value;
    document.getElementById("groupModalPriceField").hidden =
      nextType !== "price";
    document.getElementById("groupModalDaysField").hidden =
      nextType === "price";
    els.groupModalStudents
      .querySelectorAll("[data-group-modal-member]")
      .forEach(function (checkbox) {
        var student = students[Number(checkbox.dataset.groupModalMember)];
        if (!student) return;
        var memberships = studentGroupNames(student);
        var otherMemberships = memberships.filter(function (name) {
          return name !== group.name;
        });
        var conflict = otherMemberships
          .map(groupRecord)
          .find(function (membership) {
            return membership && membership.type === nextType;
          });
        checkbox.disabled = !!conflict && !checkbox.checked;
        checkbox
          .closest(".group-member")
          .classList.toggle("unavailable", !!conflict);
        var detail = checkbox.parentElement.querySelector(
          '[data-group-modal-detail="' +
            checkbox.dataset.groupModalMember +
            '"]',
        );
        if (detail) {
          detail.textContent = conflict
            ? t("groupAssignedTo").replace("{group}", conflict.name)
            : otherMemberships.length
              ? t("groupAlsoIn").replace(
                  "{groups}",
                  otherMemberships.join(", "),
                )
              : levelLabel(student.level);
        }
      });
  }

  function closeGroupModal() {
    editingGroupIndex = -1;
    els.groupModalOverlay.classList.remove("open");
  }

  function handleGroupModalSubmit(e) {
    e.preventDefault();
    var group = groups[editingGroupIndex];
    if (!group) return closeGroupModal();
    var nextName = els.groupModalName.value.trim();
    var duplicate = groups.some(function (candidate, index) {
      return (
        index !== editingGroupIndex &&
        candidate.name.toLowerCase() === nextName.toLowerCase()
      );
    });
    if (duplicate) return showToast(t("groupExists"), true);

    var typeSelect = document.getElementById("groupModalType");
    var nextType = typeSelect.value === "price" ? "price" : "days";
    var selectedMembers = {};
    els.groupModalStudents
      .querySelectorAll("[data-group-modal-member]")
      .forEach(function (checkbox) {
        selectedMembers[checkbox.dataset.groupModalMember] = checkbox.checked;
      });
    var hasConflict = students.some(function (student, studentIndex) {
      if (!selectedMembers[studentIndex]) return false;
      return studentGroupNames(student).some(function (name) {
        var membership = groupRecord(name);
        return (
          name !== group.name && membership && membership.type === nextType
        );
      });
    });
    if (hasConflict) return showToast(t("groupMembershipConflict"), true);

    var nextPrice = Number(document.getElementById("groupModalPrice").value);
    var priceValue = document.getElementById("groupModalPrice").value.trim();
    if (
      nextType === "price" &&
      (!priceValue || !isFinite(nextPrice) || nextPrice < 0)
    ) {
      return showToast(t("groupPriceInvalid"), true);
    }
    var oldName = group.name;
    var membershipsByStudent = students.map(studentGroupNames);
    group.name = nextName || oldName;
    group.type = nextType;
    if (nextType === "price") {
      group.price = nextPrice;
    } else {
      group.days = Array.from(
        els.groupModalFields.querySelectorAll("[data-group-modal-day]:checked"),
      )
        .map(function (checkbox) {
          return Number(checkbox.value);
        })
        .sort();
    }
    students.forEach(function (student, studentIndex) {
      if (isStopped(student)) return; // their groups stay as they were
      var names = membershipsByStudent[studentIndex].filter(function (name) {
        return name !== oldName;
      });
      if (selectedMembers[studentIndex]) names.push(group.name);
      setStudentGroupNames(student, names);
    });
    if (activeGroup === oldName) activeGroup = group.name;
    expandedGroup = "";
    saveGroups();
    saveStudents();
    closeGroupModal();
    renderStudentsPage();
    renderCalendar();
    if (currentPage === "payments") renderPaymentsPage();
    showToast(t("groupSaved"), false, null, "edit");
  }

  function handleGroupsClick(e) {
    var editButton = e.target.closest("[data-edit-group]");
    if (editButton) {
      openGroupModal(Number(editButton.dataset.editGroup));
      return;
    }
    var deleteButton = e.target.closest("[data-delete-group]");
    if (deleteButton) {
      var groupToDelete = groups[Number(deleteButton.dataset.deleteGroup)];
      if (!groupToDelete) return;
      var name = groupToDelete.name;
      if (!confirm(t("deleteGroupConfirm")(name))) return;
      groups = groups.filter(function (group) {
        return group.name !== name;
      });
      students.forEach(function (student) {
        setStudentGroupNames(
          student,
          studentGroupNames(student).filter(function (membership) {
            return membership !== name;
          }),
        );
      });
      if (activeGroup === name) activeGroup = "";
      if (expandedGroup === name) expandedGroup = "";
      saveGroups();
      saveStudents();
      renderStudentsPage();
      renderCalendar();
      showToast(t("groupDeleted"), false, null, "delete");
      return;
    }
    var filterButton = e.target.closest("[data-group-filter]");
    if (!filterButton) return;
    var groupIndex = filterButton.dataset.groupFilter;
    if (groupIndex === "") {
      activeGroup = "";
      expandedGroup = "";
    } else {
      var group = groups[Number(groupIndex)];
      if (!group) return;
      activeGroup = group.name;
      expandedGroup = "";
    }
    renderCalendar();
    if (groupIndex !== "") openGroupDetail(Number(groupIndex));
  }

  function handleAddGroup(e) {
    e.preventDefault();
    var name = els.newGroupName.value.trim();
    if (!name) return;
    if (findGroup(name)) {
      showToast(t("groupExists"), true);
      return;
    }
    addGroup(name);
    expandedGroup = name;
    activeGroup = name;
    els.newGroupName.value = "";
    renderCalendar();
    showToast(t("groupsAdded"), false, null, "add");
  }

  function handleCalGridClick(e) {
    var cell = e.target.closest(".cal-cell");
    if (!cell || cell.classList.contains("outside")) return;
    var parts = cell.dataset.date.split("-");
    selectedDate = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2]),
    );
    revealedEventGroupKey = "";
    renderCalendar();
  }

  /* ---------------- connection banner ---------------- */
  // Stays visible while the connection is down; when it returns it turns green, says so, then leaves.
  var netState = "hidden"; // "hidden" | "offline" | "online"
  var netTimer = null;
  var netBanner = null;
  var NET_ICON_OFF =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 8.8a15 15 0 0 1 4.2-2.6M9 5.2a15 15 0 0 1 13 3.6M5 12.5a10 10 0 0 1 3.1-2M12.8 10.2a10 10 0 0 1 6.2 2.3M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r=".6" fill="currentColor"/><path d="m3 3 18 18"/></svg>';
  var NET_ICON_ON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r=".6" fill="currentColor"/></svg>';

  function ensureNetBanner() {
    if (netBanner) return netBanner;
    netBanner = pEl("div", "net-banner");
    netBanner.setAttribute("role", "status");
    netBanner.setAttribute("aria-live", "polite");
    var icon = pEl("span", "net-banner-icon");
    var text = pEl("div", "net-banner-text");
    text.append(pEl("b"), pEl("span"));
    netBanner.append(icon, text);
    document.body.appendChild(netBanner);
    return netBanner;
  }
  function renderNetBanner() {
    var banner = ensureNetBanner();
    var online = netState === "online";
    banner.classList.toggle("show", netState !== "hidden");
    banner.classList.toggle("is-online", online);
    banner.classList.toggle("is-offline", netState === "offline");
    banner.querySelector(".net-banner-icon").innerHTML = online ? NET_ICON_ON : NET_ICON_OFF; // static, trusted SVG
    banner.querySelector("b").textContent = t(online ? "netOnlineTitle" : "netOfflineTitle");
    banner.querySelector("span:not(.net-banner-icon)").textContent = t(
      online ? "netOnlineText" : "netOfflineText",
    );
  }
  function setNetState(next) {
    clearTimeout(netTimer);
    netState = next;
    renderNetBanner();
    if (next === "online") {
      netTimer = setTimeout(function () {
        netState = "hidden";
        renderNetBanner();
      }, 3500);
    }
  }
  window.addEventListener("offline", function () {
    setNetState("offline");
  });
  window.addEventListener("online", function () {
    if (netState === "offline") setNetState("online");
  });
  if (window.navigator && window.navigator.onLine === false) setNetState("offline");

  /* ---------------- events ---------------- */
  window.addEventListener("classledger:profile-applied", function () {
    if (profileModalIsOpen() && !profileEditing) renderProfileModal();
  });
  els.profileModalClose.addEventListener("click", closeProfileModal);
  els.profileModalOverlay.addEventListener("click", function (e) {
    if (e.target === els.profileModalOverlay) closeProfileModal();
  });
  document.querySelectorAll(".nav-target").forEach(function (btn) {
    btn.addEventListener("click", function () {
      switchPage(btn.dataset.page);
    });
  });
  els.monthEndNotice.addEventListener("click", openMonthEndNotice);
  els.monthEndModalClose.addEventListener("click", closeMonthEndNotice);
  els.monthEndModalMessage.addEventListener("click", handleMonthEndEventClick);
  els.monthEndModalOverlay.addEventListener("click", function (e) {
    if (e.target === els.monthEndModalOverlay) closeMonthEndNotice();
  });
  if (els.langSwitch) {
    els.langSwitch.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.dataset.lang);
      });
    });
  }

  els.startDate.addEventListener("input", function () {
    if (els.endDate.dataset.auto !== "false" && els.startDate.value) {
      els.endDate.value = autoEndDate(els.startDate.value);
    }
  });
  els.endDate.addEventListener("input", function () {
    els.endDate.dataset.auto = "false";
  });

  els.openAddBtn.addEventListener("click", function () {
    openModal("add");
  });
  els.cancelBtn.addEventListener("click", closeModal);
  els.modalOverlay.addEventListener("click", function (e) {
    if (e.target === els.modalOverlay) closeModal();
  });
  els.groupModalCancel.addEventListener("click", closeGroupModal);
  els.groupModalOverlay.addEventListener("click", function (e) {
    if (e.target === els.groupModalOverlay) closeGroupModal();
  });
  els.groupModalForm.addEventListener("submit", handleGroupModalSubmit);
  els.groupModalFields.addEventListener("change", function (e) {
    if (e.target.id === "groupModalType") updateGroupModalMemberAvailability();
  });
  els.groupModalStudents.addEventListener("change", function (e) {
    if (e.target.matches("[data-group-modal-member]"))
      updateGroupModalMemberAvailability();
  });
  els.studentForm.addEventListener("submit", handleSubmit);
  els.tableWrap.addEventListener("click", handleTableClick);
  (function bindDonutHover() {
    var card = document.querySelector(".donut-card");
    function segOf(e) {
      return e.target.closest ? e.target.closest("[data-seg]") : null;
    }
    card.addEventListener("mouseover", function (e) {
      var el = segOf(e);
      if (el) showDonutSegment(el.getAttribute("data-seg"));
    });
    card.addEventListener("mouseout", function (e) {
      var el = segOf(e);
      if (el && !el.contains(e.relatedTarget)) showDonutSegment(null);
    });
    card.addEventListener("focusin", function (e) {
      var el = segOf(e);
      if (el) showDonutSegment(el.getAttribute("data-seg"));
    });
    card.addEventListener("focusout", function (e) {
      if (segOf(e)) showDonutSegment(null);
    });
  })();

  if (els.paymentsList)
    els.paymentsList.addEventListener("click", handlePaymentsClick);
  if (els.halfMonthPickerOptions)
    els.halfMonthPickerOptions.addEventListener(
      "change",
      handleHalfMonthSelectionChange,
    );
  els.halfMonthPickerLabel.addEventListener("click", openHalfMonthModal);
  els.halfMonthModalClose.addEventListener("click", closeHalfMonthModal);
  els.halfMonthModalX.addEventListener("click", closeHalfMonthModal);
  els.halfMonthModalOverlay.addEventListener("click", function (e) {
    if (e.target === els.halfMonthModalOverlay) closeHalfMonthModal();
  });
  els.halfMonthCalculateBtn.addEventListener("click", addHalfMonthDue);
  els.halfMonthModeHalf.addEventListener("click", function () {
    setHalfMonthMode("half");
  });
  els.halfMonthModeCustom.addEventListener("click", function () {
    setHalfMonthMode("custom");
  });
  els.halfMonthAmount.addEventListener("input", function () {
    halfMonthCalculated = false;
    updateHalfMonthCalcState();
  });
  els.halfMonthAmount.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !els.halfMonthCalculateBtn.disabled) {
      e.preventDefault();
      addHalfMonthDue();
    }
  });
  var paymentsResizeTimer = null;
  window.addEventListener("resize", function () {
    if (currentPage !== "payments") return;
    clearTimeout(paymentsResizeTimer);
    paymentsResizeTimer = setTimeout(renderPaymentsPage, 150);
  });
  if (els.toastClose)
    els.toastClose.addEventListener("click", function () {
      els.toast.classList.remove("show");
    });
  els.searchInput.addEventListener("input", renderTable);
  els.levelFilter.addEventListener("change", renderTable);
  els.groupFilter.addEventListener("change", renderTable);
  els.stoppedToggle.addEventListener("click", function () {
    showStopped = !showStopped;
    renderTable();
  });

  els.noteCloseBtn.addEventListener("click", closeNoteModal);
  els.noteEditBtn.addEventListener("click", function () {
    var st = noteStudent;
    closeNoteModal();
    if (st) openModal("edit", st);
  });
  els.noteModalOverlay.addEventListener("click", function (e) {
    if (e.target === els.noteModalOverlay) closeNoteModal();
  });

  /* Lock page scroll while any modal/notification overlay is open,
     and put the page back exactly where it was when the last one closes */
  var lockedScrollY = 0;
  function syncScrollLock() {
    var root = document.documentElement;
    var anyOpen = !!document.querySelector(".modal-overlay.open");
    if (anyOpen === root.classList.contains("modal-open")) return;
    if (anyOpen) {
      lockedScrollY = window.pageYOffset || root.scrollTop || 0;
      var gap = window.innerWidth - root.clientWidth;
      root.style.setProperty(
        "--scrollbar-gap",
        (gap > 0 && gap < 40 ? gap : 0) + "px",
      );
      root.classList.add("modal-open");
    } else {
      root.style.removeProperty("--scrollbar-gap");
      root.classList.remove("modal-open");
      try {
        if (Math.abs((window.pageYOffset || 0) - lockedScrollY) > 1) {
          window.scrollTo(0, lockedScrollY);
        }
      } catch (e) {}
    }
  }
  if (typeof MutationObserver === "function") {
    var scrollLockObserver = new MutationObserver(syncScrollLock);
    document.querySelectorAll(".modal-overlay").forEach(function (overlay) {
      scrollLockObserver.observe(overlay, {
        attributes: true,
        attributeFilter: ["class"],
      });
    });
  }
  els.actionResultOverlay.addEventListener("click", closeActionResult);
  els.groupDetailClose.addEventListener("click", closeGroupDetail);
  els.groupDetailOverlay.addEventListener("click", function (e) {
    if (e.target === els.groupDetailOverlay) closeGroupDetail();
  });
  els.groupDetailEditBtn.addEventListener("click", function () {
    var idx = groupDetailIndex;
    closeGroupDetail();
    if (idx >= 0) openGroupModal(idx);
  });
  els.groupDetailBody.addEventListener("click", function (e) {
    var row = e.target.closest("[data-member-id]");
    if (!row) return;
    var member = students.filter(function (s) {
      return s.id === row.getAttribute("data-member-id");
    })[0];
    if (!member) return;
    closeGroupDetail();
    openNoteModal(member);
  });
  els.calGrid.addEventListener("click", handleCalGridClick);
  els.groupsList.addEventListener("click", function (e) {
    e.stopPropagation();
    handleGroupsClick(e);
  });
  els.groupsAddForm.addEventListener("submit", handleAddGroup);
  els.calPrevBtn.addEventListener("click", function () {
    revealedEventGroupKey = "";
    calendarCursor = new Date(
      calendarCursor.getFullYear(),
      calendarCursor.getMonth() - 1,
      1,
    );
    renderCalendar();
  });
  els.calNextBtn.addEventListener("click", function () {
    revealedEventGroupKey = "";
    calendarCursor = new Date(
      calendarCursor.getFullYear(),
      calendarCursor.getMonth() + 1,
      1,
    );
    renderCalendar();
  });
  els.calTodayBtn.addEventListener("click", function () {
    revealedEventGroupKey = "";
    calendarCursor = new Date();
    selectedDate = new Date();
    renderCalendar();
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".card-menu")) closeAllKebabMenus();
    if (expandedGroup && !els.groupsList.contains(e.target)) {
      expandedGroup = "";
      renderGroups();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "x") {
      e.preventDefault();
      els.clearDataBtn.click();
      return;
    }
    if (e.key !== "Escape") return;
    if (els.modalOverlay.classList.contains("open")) closeModal();
    if (els.groupModalOverlay.classList.contains("open")) closeGroupModal();
    if (els.noteModalOverlay.classList.contains("open")) closeNoteModal();
    if (profileModalIsOpen()) closeProfileModal();
    if (els.groupDetailOverlay.classList.contains("open")) closeGroupDetail();
    if (els.actionResultOverlay.classList.contains("open")) closeActionResult();
    if (els.halfMonthModalOverlay.classList.contains("open"))
      closeHalfMonthModal();
    if (els.monthEndModalOverlay.classList.contains("open"))
      closeMonthEndNotice();
    closeAllKebabMenus();
  });
  els.clearDataBtn.addEventListener("click", clearAllData);
  els.exportDataBtn.addEventListener("click", exportData);
  els.importDataBtn.addEventListener("click", function () {
    els.importFile.click();
  });
  els.importFile.addEventListener("change", function () {
    importData(els.importFile.files[0]);
  });

  /* ---------------- cloud sync bridge ---------------- */
  // Used by JS/firebase-sync.js. The app works the same without it.
  function applyRemoteChanges(change) {
    change = change || {};
    if (change.replaceAll) {
      students = [];
      groups = [];
      activeGroup = "";
    }
    var indexById = {};
    students.forEach(function (student, index) {
      indexById[student.id] = index;
    });
    (change.upsertStudents || []).forEach(function (incoming) {
      if (!incoming || typeof incoming.id !== "string") return;
      sanitizeHalfMonthCharges(sanitizePaymentHistory(incoming));
      if (indexById[incoming.id] !== undefined) {
        students[indexById[incoming.id]] = incoming;
      } else {
        indexById[incoming.id] = students.length;
        students.push(incoming);
      }
    });
    var removeIds = change.removeStudentIds || [];
    if (removeIds.length) {
      students = students.filter(function (student) {
        return removeIds.indexOf(student.id) === -1;
      });
    }
    if (Array.isArray(change.groups)) {
      groups = change.groups
        .map(normalizeGroup)
        .filter(function (group, index, list) {
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
    }
    // every group a student belongs to must exist
    students.forEach(function (student) {
      var names = studentGroupNames(student);
      names.forEach(function (name) {
        if (!findGroup(name)) groups.push(normalizeGroup(name));
      });
      setStudentGroupNames(student, names);
    });
    // avatars are assigned locally when missing
    var avatarIndexes = { male: 0, female: 0 };
    students.forEach(function (student) {
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

    suppressDataEvents = true;
    try {
      saveStudents();
      saveGroups();
    } finally {
      suppressDataEvents = false;
    }
    renderStudentsPage();
    if (currentPage === "calendar") renderCalendar();
    if (currentPage === "payments") renderPaymentsPage();
  }

  window.ClassLedgerApp = {
    getSnapshot: function () {
      return { students: students.slice(), groups: groups.slice() };
    },
    applyRemote: applyRemoteChanges,
    getProfile: function () {
      return Object.assign({}, profile);
    },
    normalizeProfile: cleanProfile,
    setProfile: setProfile,
    openProfile: openProfileModal,
    setAccount: function (info) {
      accountInfo = info || null;
      setHeaderDate();
      if (profileModalIsOpen() && !profileEditing) renderProfileModal();
    },
    toast: showToast,
  };

  /* ---------------- init ---------------- */
  loadLang();
  loadProfile();
  loadStudents();
  loadGroups();
  applyStaticText();
  setHeaderDate();
  renderStudentsPage();
  scheduleMonthEndNoticeRefresh();
})();
