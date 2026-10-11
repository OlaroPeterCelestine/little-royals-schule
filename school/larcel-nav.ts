// @ts-nocheck
(function () {
  const ICONS = {"squares-2x2": "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z", "inbox": "M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z", "bell": "M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0", "magnifying-glass": "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z", "lifebuoy": "M16.712 4.33a9.027 9.027 0 0 1 1.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 0 0-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 0 1 0 9.424m-4.138-5.976a3.736 3.736 0 0 0-.88-1.388 3.737 3.737 0 0 0-1.388-.88m2.268 2.268a3.765 3.765 0 0 1 0 2.528m-2.268-4.796a3.765 3.765 0 0 0-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 0 1-1.388.88m2.268-2.268 4.138 3.448m0 0a9.027 9.027 0 0 1-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0-3.448-4.138m3.448 4.138a9.014 9.014 0 0 1-9.424 0m5.976-4.138a3.765 3.765 0 0 1-2.528 0m0 0a3.736 3.736 0 0 1-1.388-.88 3.737 3.737 0 0 1-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 0 1-1.652-1.306 9.027 9.027 0 0 1-1.306-1.652m0 0 4.138-3.448M4.33 16.712a9.014 9.014 0 0 1 0-9.424m4.138 5.976a3.765 3.765 0 0 1 0-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 0 1 1.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 0 0-1.652 1.306A9.025 9.025 0 0 0 4.33 7.288", "user-circle": "M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z", "building-office-2": "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z", "book-open": "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25", "banknotes": "M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z", "users": "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z", "truck": "M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12", "heart": "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z", "academic-cap": "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5", "user-group": "M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z", "chart-bar": "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z", "document-text": "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z", "squares-plus": "M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z", "shield-check": "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z", "chevron-down": "m19.5 8.25-7.5 7.5-7.5-7.5", "lock-closed": "M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z", "chat-bubble-left-right": "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"};
  const GLOBALS = [{"id": "dashboard", "label": "Dashboard", "icon": "squares-2x2", "view": "dashboard"}, {"id": "inbox", "label": "My Inbox & Approvals", "icon": "inbox", "view": "inbox", "header": true}, {"id": "notifications", "label": "Notifications", "icon": "bell", "view": "notifications", "header": true}, {"id": "profile", "label": "My Profile", "icon": "user-circle", "view": "profile", "header": true}, {"id": "users", "label": "Users", "icon": "users", "view": "users", "header": true}, {"id": "audit", "label": "Audit logs", "icon": "shield-check", "view": "audit", "header": true}];
  const APPS = [
    { id: "admissions", name: "Admissions", label: "Admissions", icon: "inbox", modules: [
      { id: "main", name: "Admissions", label: "Admissions", pages: ["Enquiries", "Applications", "Decisions"] }
    ]},
    { id: "students", name: "Students", label: "Students", icon: "users", modules: [
      { id: "main", name: "Students", label: "Students", pages: ["All Students", "Student 360", "Guardians"] }
    ]},
    { id: "classes", name: "Classes", label: "Classes", icon: "building-office-2", modules: [
      { id: "main", name: "Classes", label: "Classes", pages: ["Classes & Streams", "Teacher Classes", "Timetable", "Teacher Workload"] }
    ]},
    { id: "attendance", name: "Attendance", label: "Attendance", icon: "squares-2x2", modules: [
      { id: "main", name: "Attendance", label: "Attendance", pages: ["Daily Attendance", "Corrections"] }
    ]},
    { id: "exams", name: "Exams", label: "Exams", icon: "academic-cap", modules: [
      { id: "main", name: "Exams", label: "Exams", pages: ["Exam Setup", "Marks", "Report Cards"] }
    ]},
    { id: "fees", name: "Fees", label: "Fees", icon: "banknotes", modules: [
      { id: "main", name: "Fees", label: "Fees", pages: ["Fee Structures", "Invoices", "Record Payment", "Receipts"] }
    ]},
    { id: "staff", name: "Staff", label: "Staff", icon: "user-circle", modules: [
      { id: "main", name: "Staff", label: "Staff", keep: 3, pages: ["All Teachers", "Leave", "Pay Runs", "Full Profile"] }
    ]},
    { id: "messages", name: "Messages", label: "Messages", icon: "chat-bubble-left-right", modules: [
      { id: "main", name: "Messages", label: "Messages", pages: ["Announcements", "Meetings"] }
    ]},
    { id: "front", name: "Front Office", label: "Front office", icon: "bell", modules: [
      { id: "main", name: "Front Office", label: "Front office", pages: ["Visitors", "Late and Early"] }
    ]},
    { id: "more", name: "More", label: "More", icon: "squares-plus", modules: [
      { id: "library", name: "Library", label: "Library", pages: ["Borrowing & Returns"] },
      { id: "transport", name: "Transport", label: "Transport", pages: ["Vehicles", "Routes & Stops"] },
      { id: "clinic", name: "Clinic", label: "Clinic", restricted: true, pages: ["Clinic Visits"] },
      { id: "store", name: "Store", label: "Store", pages: ["Stock Items"] },
      { id: "learn", name: "Learning", label: "Learning", pages: ["Course Catalog", "Ask AI Tutor", "Assignments"] }
    ]},
    { id: "settings", name: "Settings", label: "Settings", icon: "shield-check", modules: [
      { id: "main", name: "Settings", label: "Settings", pages: ["General Settings", "Branding", "Academic Years & Terms", "Users", "Audit Logs"] }
    ]}
  ];
  const VIEWS = {
    "Students|Students|All Students": "students",
    "Students|Students|Student 360": "student360",
    "Classes|Classes|Teacher Classes": "teachermap",
    "Classes|Classes|Timetable": "schedules",
    "Classes|Classes|Teacher Workload": "workload",
    "Attendance|Attendance|Daily Attendance": "attendance",
    "Exams|Exams|Exam Setup": "exams",
    "Exams|Exams|Report Cards": "reportcards",
    "Staff|Staff|All Teachers": "faculty",
    "Staff|Staff|Full Profile": "teacherprofile",
    "More|Learning|Ask AI Tutor": "copilot",
    "Settings|Settings|General Settings": "settings",
    "Settings|Settings|Branding": "branding",
    "Settings|Settings|Users": "users",
    "Settings|Settings|Audit Logs": "audit"
  };
  const LEGACY = {
    "school-students-all-students": "students-main-all-students",
    "school-students-student-360": "students-main-student-360",
    "school-students-student-profiles": "students-main-student-360",
    "school-day-student-360": "students-main-student-360",
    "school-students-guardians-and-families": "students-main-guardians",
    "school-classes-classes-and-streams": "classes-main-classes-and-streams",
    "school-classes-teacher-classes": "classes-main-teacher-classes",
    "school-classes-class-teachers": "classes-main-teacher-classes",
    "school-day-teacher-classes": "classes-main-teacher-classes",
    "academics-timetables-class-timetables": "classes-main-timetable",
    "academics-teaching-teacher-workload": "classes-main-teacher-workload",
    "academics-attendance-daily-attendance": "attendance-main-daily-attendance",
    "academics-attendance-attendance-corrections": "attendance-main-corrections",
    "academics-exams-exam-setup": "exams-main-exam-setup",
    "academics-exams-marks-entry": "exams-main-marks",
    "academics-grades-report-cards": "exams-main-report-cards",
    "finance-fees-fee-structures": "fees-main-fee-structures",
    "finance-fees-student-invoices": "fees-main-invoices",
    "finance-payments-record-payment": "fees-main-record-payment",
    "finance-payments-receipts": "fees-main-receipts",
    "people-profile-all-teachers": "staff-main-all-teachers",
    "people-profile-full-profile": "staff-main-full-profile",
    "people-payroll-leave-requests": "staff-main-leave",
    "people-payroll-pay-runs": "staff-main-pay-runs",
    "community-messages-announcements": "messages-main-announcements",
    "community-events-appointment-booking": "messages-main-meetings",
    "school-front-reception-queue": "front-main-visitors",
    "school-front-late-arrival-and-early-departure": "front-main-late-and-early",
    "school-admissions-enquiries": "admissions-main-enquiries",
    "school-admissions-applications": "admissions-main-applications",
    "school-admissions-admission-decision": "admissions-main-decisions",
    "admin-school-settings-general-settings": "settings-main-general-settings",
    "admin-school-settings-branding": "settings-main-branding",
    "admin-users-user-directory": "settings-main-users",
    "admin-security-audit-logs": "settings-main-audit-logs",
    "admin-security-logo-audit": "settings-main-audit-logs",
    "school-day-academic-years-and-terms": "settings-main-academic-years-and-terms",
    "learn-courses-ask-ai-tutor": "more-learn-ask-ai-tutor",
    "learn-courses-course-catalog": "more-learn-course-catalog",
    "learn-tutor-ask-ai-tutor": "more-learn-ask-ai-tutor",
    "operations-library-borrowing-and-returns": "more-library-borrowing-and-returns",
    "operations-transport-vehicles": "more-transport-vehicles",
    "operations-transport-routes-and-stops": "more-transport-routes-and-stops",
    "care-health-clinic-visits": "more-clinic-clinic-visits",
    "operations-inventory-stock-items": "more-store-stock-items"
  };


  function slug(value) {
    return String(value).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function esc(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function svg(name, cls) {
    const d = ICONS[name] || ICONS["squares-2x2"];
    return '<svg class="' + cls + '" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-heroicon="' + name + '"><path stroke-linecap="round" stroke-linejoin="round" d="' + d + '"/></svg>';
  }

  const byId = {};
  const pages = [];
  const alias = {};

  GLOBALS.forEach(function (item) {
    const page = {
      id: item.id,
      label: item.label,
      app: "",
      appId: "",
      module: "",
      moduleId: "",
      view: item.view || "",
      restricted: false,
      permission: "global." + item.id
    };
    byId[page.id] = page;
    pages.push(page);
  });

  APPS.forEach(function (app) {
    app.modules.forEach(function (mod) {
      let keep = typeof mod.keep === "number" ? mod.keep : mod.pages.length;
      keep = Math.min(keep, mod.pages.length);
      const hub = keep < mod.pages.length ? app.id + "-" + mod.id + "-" + slug(mod.pages[0]) : "";
      mod.pages.forEach(function (label, index) {
        const id = app.id + "-" + mod.id + "-" + slug(label);
        const view = VIEWS[app.name + "|" + mod.name + "|" + label] || "";
        const detail = index >= keep;
        const page = {
          id: id,
          label: label,
          app: app.name,
          appId: app.id,
          module: mod.label || mod.name,
          moduleId: mod.id,
          view: view,
          restricted: !!mod.restricted,
          permission: app.id + "." + mod.id + "." + slug(label),
          detail: detail,
          parent: detail ? hub : "",
          hub: hub,
          hidden: false
        };
        byId[id] = page;
        pages.push(page);
        if (view && !detail && !alias[view]) alias[view] = id;
      });
    });
  });
  pages.forEach(function (page) {
    if (page.view && !alias[page.view]) alias[page.view] = page.id;
  });
  Object.keys(LEGACY).forEach(function (oldId) {
    if (byId[LEGACY[oldId]]) alias[oldId] = LEGACY[oldId];
  });
  alias.dashboard = "dashboard";
  alias.inbox = "inbox";
  byId.reports = {
    id: "reports",
    label: "Reports",
    app: "",
    appId: "",
    module: "",
    moduleId: "",
    view: "reports",
    restricted: false,
    permission: "global.reports"
  };
  pages.push(byId.reports);
  alias.reports = "reports";

  function isListed(id) {
    const item = byId[id];
    return !!(item && !item.detail && !item.hidden);
  }

  function visibleLabel(app, mod) {
    const labels = mod.pages.filter(function (label) { return isListed(pageId(app, mod, label)); });
    return labels[0] || mod.pages[0];
  }

  let root = null;
  const hooks = { onPage: function () {}, onSearch: function () {}, expand: function () {}, isCollapsed: function () { return false; } };
  let openApp = "";
  let openModule = "";
  let expandedApp = "";
  let active = "dashboard";

  const TAB_ICONS = ["building-office-2", "banknotes", "document-text", "squares-2x2", "users", "chart-bar", "book-open", "academic-cap", "shield-check", "truck", "heart", "inbox", "user-group", "bell"];

  function tabIcon(index) {
    return TAB_ICONS[index % TAB_ICONS.length];
  }

  function findApp(appId) {
    return APPS.filter(function (item) { return item.id === appId; })[0];
  }

  function pageId(app, mod, label) {
    return app.id + "-" + mod.id + "-" + slug(label);
  }

  function render() {
    const globals = GLOBALS.filter(function (item) { return !item.header; }).map(function (item) {
      const on = active === item.id;
      return '<a href="#' + item.id + '" data-page="' + item.id + '" data-permission="global.' + item.id + '" aria-label="' + esc(item.label) + '" class="global-link flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors ' +
        (on ? "nav-on font-semibold shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50") + '">' +
        svg(item.icon, "nav-icon w-4 h-4 shrink-0 " + (on ? "text-white" : "text-slate-400")) +
        '<span class="nav-label leading-snug">' + esc(item.label) + "</span></a>";
    });
    const apps = APPS.map(function (app) {
      const current = openApp === app.id;
      if (app.modules.length === 1) {
        const mod = app.modules[0];
        const id = pageId(app, mod, visibleLabel(app, mod));
        return '<a href="#' + id + '" data-page="' + id + '" data-app="' + app.id + '" aria-label="' + esc(app.label || app.name) + '" class="global-link flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors ' +
          (current ? "nav-on font-semibold shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50") + '">' +
          svg(app.icon, "nav-icon w-4 h-4 shrink-0 " + (current ? "text-white" : "text-slate-400")) +
          '<span class="nav-label leading-snug">' + esc(app.label || app.name) + "</span></a>";
      }
      const open = expandedApp === app.id;
      const modules = app.modules.map(function (mod) {
        const id = pageId(app, mod, visibleLabel(app, mod));
        const on = current && openModule === mod.id;
        return '<a href="#' + id + '" data-page="' + id + '" data-module="' + app.id + "-" + mod.id + '" class="module-link flex items-center rounded-md px-2 py-1.5 leading-snug ' +
          (on ? "nav-module-on bg-slate-100 font-semibold text-slate-900" : "font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900") + '">' +
          esc(mod.label || mod.name) + "</a>";
      }).join("");
      return '<div class="app-block">' +
        '<button type="button" data-app-toggle="' + app.id + '" data-app="' + app.id + '" aria-expanded="' + (open ? "true" : "false") + '" aria-label="' + esc(app.label || app.name) + '" class="app-toggle flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ' +
        (current ? "nav-on font-semibold shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900") + '">' +
        svg(app.icon, "nav-icon w-4 h-4 shrink-0 " + (current ? "text-white" : "text-slate-400")) +
        '<span class="nav-label min-w-0 flex-1 leading-snug">' + esc(app.label || app.name) + "</span>" +
        svg("chevron-down", "nav-chevron w-3.5 h-3.5 shrink-0") + "</button>" +
        '<div class="app-body ml-4 mt-0.5 mb-1 space-y-0.5 border-l border-slate-200 pl-2' + (open ? "" : " hidden") + '">' + modules + "</div></div>";
    }).join("");

    return '<div class="space-y-0.5">' + globals.join("") + apps + "</div>";
  }

  function pill(label, id, on, iconName) {
    const cls = on
      ? "page-pill inline-flex items-center gap-1.5 shrink-0 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm"
      : "page-pill inline-flex items-center gap-1.5 shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900";
    return '<a href="#' + id + '" data-page="' + id + '" class="' + cls + '">' +
      svg(iconName, "w-3.5 h-3.5 shrink-0 " + (on ? "text-white" : "text-slate-500")) +
      "<span class=\"whitespace-nowrap\">" + esc(label) + "</span></a>";
  }

  function tabsMarkup(page, selectedId) {
    const app = findApp(page.appId);
    if (!app) return "";
    const current = app.modules.filter(function (mod) { return mod.id === page.moduleId; })[0] || app.modules[0];
    const listed = current.pages.filter(function (label) {
      const item = byId[pageId(app, current, label)];
      return item && !item.hidden && !item.detail;
    });
    const currentItem = byId[selectedId];
    if (currentItem && currentItem.detail && listed.indexOf(currentItem.label) === -1) listed.push(currentItem.label);
    if (listed.length < 2) return "";
    const pagesHtml = listed.map(function (label, index) {
      const id = pageId(app, current, label);
      const iconName = current.restricted ? "lock-closed" : tabIcon(index);
      return pill(label, id, id === selectedId, iconName);
    }).join("");
    if (!pagesHtml) return "";
    return '<div class="flex min-w-0 flex-wrap items-center gap-1.5">' + pagesHtml + "</div>";
  }

  function paint() {
    if (!root) return;
    const scroller = root.closest(".overflow-y-auto");
    const top = scroller ? scroller.scrollTop : 0;
    root.innerHTML = render();
    if (scroller) scroller.scrollTop = top;
  }

  function currentAppId() {
    const page = byId[active];
    return page && page.appId ? page.appId : "";
  }

  function openAppMenu(id) {
    const app = findApp(id);
    if (!app) return;
    const first = pageId(app, app.modules[0], visibleLabel(app, app.modules[0]));
    const wasCollapsed = hooks.isCollapsed();
    if (wasCollapsed) hooks.expand();
    if (!wasCollapsed && expandedApp === id) {
      expandedApp = "";
      paint();
      return;
    }
    expandedApp = id;
    if (currentAppId() !== id) hooks.onPage(first);
    else paint();
  }

  function onClick(event) {
    const toggle = event.target.closest("[data-app-toggle]");
    if (toggle && root && root.contains(toggle)) {
      event.preventDefault();
      openAppMenu(toggle.getAttribute("data-app-toggle"));
      return;
    }
    const link = event.target.closest("a[data-page]");
    if (!link) return;
    event.preventDefault();
    if (hooks.isCollapsed()) hooks.expand();
    hooks.onPage(link.getAttribute("data-page"));
  }

  function onTabClick(event) {
    const link = event.target.closest("a[data-page]");
    if (!link) return;
    event.preventDefault();
    hooks.onPage(link.getAttribute("data-page"));
  }

  window.LarcelNav = {
    byId: byId,
    pages: pages,
    alias: alias,
    detailsOf: function (parentId) {
      return pages.filter(function (item) { return item.detail && item.parent === parentId; });
    },
    mount: function (el, options) {
      root = el;
      if (options) {
        hooks.onPage = options.onPage || hooks.onPage;
        hooks.onSearch = options.onSearch || hooks.onSearch;
        hooks.expand = options.expand || hooks.expand;
        hooks.isCollapsed = options.isCollapsed || hooks.isCollapsed;
      }
      root.addEventListener("click", onClick);
      const tabs = document.getElementById("page-tabs");
      if (tabs) tabs.addEventListener("click", onTabClick);
      paint();
    },
    paintTabs: function (id) {
      const el = document.getElementById("page-tabs");
      if (!el) return;
      const page = byId[id];
      if (!page || !page.appId) {
        el.classList.add("hidden");
        el.innerHTML = "";
        return;
      }
      const markup = tabsMarkup(page, page.id);
      if (!markup) {
        el.classList.add("hidden");
        el.innerHTML = "";
        return;
      }
      el.classList.remove("hidden");
      el.innerHTML = markup;
      const groups = el.querySelectorAll(".tab-scroll");
      const current = el.querySelector(".page-pill[data-page=\"" + page.id + "\"]");
      function scrollInto(scroller, item) {
        if (!scroller || !item) return;
        const delta = item.getBoundingClientRect().left - scroller.getBoundingClientRect().left;
        scroller.scrollLeft = Math.max(0, scroller.scrollLeft + delta - 8);
      }
      scrollInto(groups[0], current);
    },
    reveal: function (id) {
      const page = byId[id];
      if (!page) return;
      active = id;
      if (page.appId) {
        openApp = page.appId;
        openModule = page.moduleId;
        expandedApp = page.appId;
      } else {
        openApp = "";
        openModule = "";
      }
      paint();
      const current = root && (root.querySelector(".nav-module-on") || root.querySelector("a.nav-on"));
      if (current && current.scrollIntoView) current.scrollIntoView({ block: "nearest" });
    }
  };
})();

export {};
