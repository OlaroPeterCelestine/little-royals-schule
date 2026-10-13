import "package:flutter/material.dart";

class DeskPage {
  const DeskPage({required this.id, required this.group, required this.module, required this.label, this.restricted = false});

  final String id;
  final String group;
  final String module;
  final String label;
  final bool restricted;
}

class DeskGroup {
  const DeskGroup({required this.label, required this.icon, required this.pages});

  final String label;
  final IconData icon;
  final List<DeskPage> pages;
}

String deskSlug(String value) {
  return value.toLowerCase().replaceAll("&", " and ").replaceAll(RegExp(r"[^a-z0-9]+"), "-").replaceAll(RegExp(r"^-+|-+$"), "");
}

DeskPage _page(String group, String prefix, String module, String label, {bool restricted = false}) {
  return DeskPage(id: "$prefix-${deskSlug(label)}", group: group, module: module, label: label, restricted: restricted);
}

final List<DeskGroup> deskGroups = [
  DeskGroup(label: "Dashboard", icon: Icons.grid_view_outlined, pages: [
    const DeskPage(id: "dashboard", group: "Dashboard", module: "Overview", label: "Overview"),
  ]),
  DeskGroup(label: "Enrolment", icon: Icons.inbox_outlined, pages: [
    _page("Enrolment", "pupils-admissions", "Admissions", "Enquiries"),
    _page("Enrolment", "pupils-admissions", "Admissions", "Applications"),
    _page("Enrolment", "pupils-admissions", "Admissions", "Decisions"),
    _page("Enrolment", "pupils-admissions", "Admissions", "Enrollment"),
    _page("Enrolment", "pupils-admissions", "Admissions", "Transfers"),
  ]),
  DeskGroup(label: "Pupils", icon: Icons.people_outline, pages: [
    _page("Pupils", "pupils-students", "Students", "All Students"),
    _page("Pupils", "pupils-students", "Students", "Guardians"),
    _page("Pupils", "pupils-students", "Students", "Documents & ID cards"),
    _page("Pupils", "pupils-students", "Students", "Promotion & leaving"),
    _page("Pupils", "pupils-students", "Students", "Parent Dashboard"),
    _page("Pupils", "pupils-students", "Students", "Student 360"),
  ]),
  DeskGroup(label: "Attendance", icon: Icons.bar_chart_outlined, pages: [
    _page("Attendance", "pupils-attendance", "Attendance", "Daily"),
    _page("Attendance", "pupils-attendance", "Attendance", "By period"),
    _page("Attendance", "pupils-attendance", "Attendance", "Absence requests"),
    _page("Attendance", "pupils-attendance", "Attendance", "Corrections"),
  ]),
  DeskGroup(label: "Pastoral", icon: Icons.favorite_border, pages: [
    _page("Pastoral", "pupils-care", "Care", "Behavior"),
    _page("Pastoral", "pupils-care", "Care", "Incidents"),
    _page("Pastoral", "pupils-care", "Care", "Interventions"),
    _page("Pastoral", "pupils-clinic", "Clinic", "Clinic", restricted: true),
    _page("Pastoral", "pupils-clinic", "Clinic", "Safeguarding", restricted: true),
  ]),
  DeskGroup(label: "Classes", icon: Icons.dashboard_customize_outlined, pages: [
    _page("Classes", "classroom-classes", "Classes", "Classes & streams"),
    _page("Classes", "classroom-classes", "Classes", "Allocation"),
    _page("Classes", "classroom-classes", "Classes", "Teachers"),
    _page("Classes", "classroom-classes", "Classes", "Rooms"),
  ]),
  DeskGroup(label: "Timetable", icon: Icons.calendar_view_week_outlined, pages: [
    _page("Timetable", "classroom-timetable", "Timetable", "Class"),
    _page("Timetable", "classroom-timetable", "Timetable", "Teacher"),
    _page("Timetable", "classroom-timetable", "Timetable", "Rooms"),
    _page("Timetable", "classroom-timetable", "Timetable", "Cover"),
  ]),
  DeskGroup(label: "Teaching", icon: Icons.menu_book_outlined, pages: [
    _page("Teaching", "classroom-teaching", "Teaching", "Curriculum"),
    _page("Teaching", "classroom-teaching", "Teaching", "Lesson plans"),
    _page("Teaching", "classroom-teaching", "Teaching", "Workload"),
  ]),
  DeskGroup(label: "Assessment", icon: Icons.school_outlined, pages: [
    _page("Assessment", "classroom-assessment", "Assessment", "Exams"),
    _page("Assessment", "classroom-assessment", "Assessment", "Marks"),
    _page("Assessment", "classroom-assessment", "Assessment", "Report cards"),
    _page("Assessment", "classroom-assessment", "Assessment", "Transcripts"),
    _page("Assessment", "classroom-assessment", "Assessment", "Benchmarks"),
  ]),
  DeskGroup(label: "Learning", icon: Icons.auto_stories_outlined, pages: [
    _page("Learning", "classroom-learning", "Learning", "Courses"),
    _page("Learning", "classroom-learning", "Learning", "Assignments"),
    _page("Learning", "classroom-learning", "Learning", "Quizzes"),
    _page("Learning", "classroom-learning", "Learning", "AI tutor"),
  ]),
  DeskGroup(label: "Staff", icon: Icons.account_circle_outlined, pages: [
    _page("Staff", "staff-people", "People", "Teachers"),
    _page("Staff", "staff-people", "People", "Leave"),
    _page("Staff", "staff-people", "People", "Hiring"),
    _page("Staff", "staff-people", "People", "Cases"),
    _page("Staff", "staff-time", "Time", "Today"),
    _page("Staff", "staff-time", "Time", "This week"),
    _page("Staff", "staff-pay", "Pay", "Pay runs"),
  ]),
  DeskGroup(label: "School", icon: Icons.apartment_outlined, pages: [
    _page("School", "office-school", "School", "Calendar"),
    _page("School", "office-school", "School", "School day"),
    _page("School", "office-school", "School", "Policies"),
    _page("School", "office-school", "School", "Profile"),
    _page("School", "office-school", "School", "Events calendar"),
    _page("School", "office-school", "School", "Rollover"),
  ]),
  DeskGroup(label: "Fees", icon: Icons.payments_outlined, pages: [
    _page("Fees", "office-fees", "Fees", "Structures"),
    _page("Fees", "office-fees", "Fees", "Invoices"),
    _page("Fees", "office-fees", "Fees", "Payments"),
    _page("Fees", "office-fees", "Fees", "Arrears"),
  ]),
  DeskGroup(label: "Messages", icon: Icons.chat_bubble_outline, pages: [
    _page("Messages", "office-messages", "Messages", "Announcements"),
    _page("Messages", "office-messages", "Messages", "Direct messages"),
    _page("Messages", "office-messages", "Messages", "Meetings"),
  ]),
  DeskGroup(label: "Front desk", icon: Icons.support_agent_outlined, pages: [
    _page("Front desk", "office-front", "Front desk", "Visitors"),
    _page("Front desk", "office-front", "Front desk", "Late and early"),
    _page("Front desk", "office-front", "Front desk", "Parent requests"),
    _page("Front desk", "office-front", "Front desk", "Post"),
  ]),
  DeskGroup(label: "Documents", icon: Icons.description_outlined, pages: [
    _page("Documents", "office-documents", "Documents", "School"),
    _page("Documents", "office-documents", "Documents", "Staff"),
    _page("Documents", "office-documents", "Documents", "Approvals"),
  ]),
  DeskGroup(label: "Library", icon: Icons.local_library_outlined, pages: [
    _page("Library", "campus-library", "Library", "Catalog"),
    _page("Library", "campus-library", "Library", "Borrowing"),
    _page("Library", "campus-library", "Library", "Fines"),
  ]),
  DeskGroup(label: "Transport", icon: Icons.local_shipping_outlined, pages: [
    _page("Transport", "campus-transport", "Transport", "Vehicles"),
    _page("Transport", "campus-transport", "Transport", "Routes"),
    _page("Transport", "campus-transport", "Transport", "Pupils"),
  ]),
  DeskGroup(label: "Store", icon: Icons.inventory_2_outlined, pages: [
    _page("Store", "campus-store", "Store", "Stock"),
    _page("Store", "campus-store", "Store", "Purchases"),
    _page("Store", "campus-store", "Store", "Goods received"),
  ]),
  DeskGroup(label: "Events", icon: Icons.groups_outlined, pages: [
    _page("Events", "campus-events", "Events", "Clubs"),
    _page("Events", "campus-events", "Events", "Trips"),
    _page("Events", "campus-events", "Events", "Sports"),
    _page("Events", "campus-events", "Events", "Feedback"),
  ]),
  DeskGroup(label: "Settings", icon: Icons.lock_outline, pages: [
    _page("Settings", "settings-main", "Settings", "General"),
    _page("Settings", "settings-main", "Settings", "Branding"),
    _page("Settings", "settings-main", "Settings", "Years & terms"),
    _page("Settings", "settings-main", "Settings", "Users"),
    _page("Settings", "settings-main", "Settings", "Audit"),
    _page("Settings", "settings-main", "Settings", "Help"),
  ]),
];

List<DeskPage> get deskPages => [for (final group in deskGroups) ...group.pages];

DeskPage? deskPageById(String id) {
  for (final page in deskPages) {
    if (page.id == id) return page;
  }
  return null;
}

bool groupAllowed(String role, String group) {
  const leadership = {"owner", "headteacher", "deputy"};
  if (leadership.contains(role)) return true;
  const parent = {"Dashboard", "Pupils", "Attendance", "Fees", "Messages", "School"};
  const teacher = {"Dashboard", "Pupils", "Attendance", "Classes", "Timetable", "Teaching", "Assessment", "Learning", "Messages", "School"};
  const bursar = {"Dashboard", "Pupils", "Fees", "Messages", "School", "Settings"};
  const registrar = {"Dashboard", "Enrolment", "Pupils", "Attendance", "Classes", "School", "Messages", "Front desk", "Documents", "Settings"};
  return switch (role) {
    "parent" || "student" => parent.contains(group),
    "teacher" => teacher.contains(group),
    "bursar" => bursar.contains(group),
    "registrar" => registrar.contains(group),
    _ => true,
  };
}
