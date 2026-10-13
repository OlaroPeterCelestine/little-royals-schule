import "package:flutter/material.dart";

import "api.dart";
import "catalog.dart";
import "store.dart";

const navy = Color(0xFF1E4B9B);
const ink = Color(0xFF0F172A);
const muted = Color(0xFF64748B);

class DeskHome extends StatefulWidget {
  const DeskHome({super.key, required this.store, required this.onSignOut});

  final SchoolStore store;
  final void Function(BuildContext context) onSignOut;

  @override
  State<DeskHome> createState() => _DeskHomeState();
}

class _DeskHomeState extends State<DeskHome> {
  String pageId = "dashboard";
  String query = "";
  final search = TextEditingController();

  SchoolStore get store => widget.store;

  @override
  void dispose() {
    search.dispose();
    super.dispose();
  }

  void selectPage(String id, {bool closeDrawer = false}) {
    setState(() {
      pageId = id;
      query = "";
      search.clear();
    });
    if (closeDrawer && Navigator.of(context).canPop()) {
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final page = deskPageById(pageId) ?? deskPages.first;
    final group = deskGroups.firstWhere((item) => item.pages.any((entry) => entry.id == page.id));
    final visibleGroups = [for (final item in deskGroups) if (groupAllowed(store.role, item.label)) item];
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: ink,
        elevation: 0,
        title: Text(page.label, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
        actions: [
          IconButton(tooltip: "Sign out", onPressed: () => widget.onSignOut(context), icon: const Icon(Icons.logout)),
        ],
      ),
      drawer: Drawer(
        child: SafeArea(
          child: Column(
            children: [
              ListTile(
                leading: Image.asset("assets/logo.png", height: 42),
                title: const Text("Little Royals", style: TextStyle(fontWeight: FontWeight.w700)),
                subtitle: const Text("Nursery & Primary", style: TextStyle(color: Color(0xFF0369A1), fontWeight: FontWeight.w600)),
              ),
              Expanded(
                child: ListView(
                  children: [
                    for (final item in visibleGroups)
                      ListTile(
                        leading: Icon(item.icon, color: group.label == item.label ? Colors.white : muted),
                        title: Text(item.label.toUpperCase(), style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, letterSpacing: 0.4)),
                        selected: group.label == item.label,
                        selectedTileColor: navy,
                        selectedColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        onTap: () => selectPage(item.pages.first.id, closeDrawer: true),
                      ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: _RollCard(enrolled: store.enrolledCount, capacity: store.capacity),
              ),
            ],
          ),
        ),
      ),
      body: Column(
        children: [
          if (group.pages.length > 1)
            SizedBox(
              height: 52,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                children: [
                  for (final item in group.pages)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(item.label),
                        selected: item.id == page.id,
                        selectedColor: navy,
                        labelStyle: TextStyle(color: item.id == page.id ? Colors.white : ink, fontSize: 12),
                        onSelected: (_) => selectPage(item.id),
                      ),
                    ),
                ],
              ),
            ),
          Expanded(
            child: PageBody(
              store: store,
              page: page,
              query: query,
              search: search,
              onQuery: (value) => setState(() => query = value),
            ),
          ),
        ],
      ),
    );
  }
}

class PageBody extends StatelessWidget {
  const PageBody({super.key, required this.store, required this.page, required this.query, required this.search, required this.onQuery});

  final SchoolStore store;
  final DeskPage page;
  final String query;
  final TextEditingController search;
  final ValueChanged<String> onQuery;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: store,
      builder: (context, _) {
        return ListView(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
          children: children(context),
        );
      },
    );
  }

  bool matches(String text) {
    final needle = query.trim().toLowerCase();
    if (needle.isEmpty) return true;
    return text.toLowerCase().contains(needle);
  }

  List<T> filter<T>(List<T> items, String Function(T) text) {
    return [for (final item in items) if (matches(text(item))) item];
  }

  Widget searchField() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextField(
        controller: search,
        decoration: const InputDecoration(prefixIcon: Icon(Icons.search), hintText: "Search", border: OutlineInputBorder()),
        onChanged: onQuery,
      ),
    );
  }

  List<Widget> children(BuildContext context) {
    if (page.restricted && !const {"owner", "headteacher", "deputy", "nurse", "safeguarding", "counselor"}.contains(store.role)) {
      return const [Note(text: "Clinic and safeguarding records stay with authorized staff. They are not on the general pupil profile.")];
    }
    return switch (page.id) {
      "dashboard" => dashboard(context),
      "pupils-admissions-enquiries" || "pupils-admissions-applications" || "pupils-admissions-decisions" || "pupils-admissions-enrollment" || "pupils-admissions-transfers" => applications(context),
      "pupils-students-all-students" || "pupils-students-student-360" => students(context),
      "pupils-students-guardians" => guardians(),
      "pupils-students-documents-and-id-cards" => documents(),
      "pupils-students-promotion-and-leaving" => placement(),
      "pupils-students-parent-dashboard" => students(context),
      "pupils-attendance-daily" || "pupils-attendance-by-period" => registers(context),
      "pupils-attendance-absence-requests" => absences(),
      "pupils-attendance-corrections" => const [Note(text: "No attendance corrections are waiting.")],
      "pupils-care-behavior" => watchList(),
      "pupils-care-incidents" || "pupils-care-interventions" => book(context, empty: "No pastoral cases are open."),
      "pupils-clinic-clinic" || "pupils-clinic-safeguarding" => const [
          Note(text: "Health and safeguarding notes are not stored on this phone. Authorized staff keep those records off the general profile."),
        ],
      "classroom-classes-classes-and-streams" || "classroom-classes-rooms" || "classroom-timetable-class" || "classroom-timetable-rooms" => classes(),
      "classroom-classes-allocation" => placement(),
      "classroom-classes-teachers" || "classroom-timetable-teacher" || "staff-people-teachers" => teachers(),
      "classroom-timetable-cover" => const [Note(text: "No cover is booked for today.")],
      "classroom-teaching-curriculum" || "classroom-teaching-lesson-plans" || "classroom-learning-courses" || "classroom-learning-assignments" || "classroom-assessment-exams" => assessments(),
      "classroom-teaching-workload" => workload(),
      "classroom-assessment-marks" || "classroom-assessment-report-cards" || "classroom-assessment-transcripts" => marks(context),
      "classroom-assessment-benchmarks" => const [Note(text: "Nursery and primary use EE, ME, AE, and BE. Published scores are on Marks.")],
      "classroom-learning-quizzes" => const [Note(text: "No quizzes are published this term.")],
      "classroom-learning-ai-tutor" => const [Note(text: "Ask from the register: pupils on watch are on Behavior, and saved scores are on Marks.")],
      "staff-pay-pay-runs" => const [Note(text: "Pay runs are not in this register. Staff names are under Teachers.")],
      "office-school-calendar" || "office-school-events-calendar" => calendar(context),
      "office-school-school-day" => const [Note(text: "The school day uses Africa/Kampala. Morning registers are the attendance record for 13 Oct 2026.")],
      "office-school-policies" => const [Note(text: "Medical and safeguarding notes stay off the general pupil profile. An offer can be enrolled only after it is accepted and the birth certificate is on file.")],
      "office-school-profile" || "settings-main-general" || "settings-main-branding" => const [
          Note(text: "Little Royals Kindergarten & Primary School. Plot 18, Kololo Hill Drive, Kampala. Africa/Kampala. Currency UGX. Version 3.0.0."),
        ],
      "office-school-rollover" || "settings-main-years-and-terms" => terms(),
      "office-fees-structures" => structures(),
      "office-fees-invoices" || "office-fees-arrears" => invoices(context, arrearsOnly: page.id.endsWith("arrears")),
      "office-fees-payments" => payments(),
      "office-messages-announcements" => notices(),
      "settings-main-users" => users(),
      "settings-main-audit" => audit(),
      "settings-main-help" => const [
          Note(text: "Open the menu for Enrolment, Pupils, Attendance, Fees, and the rest of the desk. The development password is school. Figures come from the school register."),
        ],
      _ => book(context, empty: "Nothing is saved here yet."),
    };
  }

  List<Widget> dashboard(BuildContext context) {
    final rate = store.attendancePercent();
    final outstanding = store.outstandingForTerm(schoolTermId, store.scopedStudentIds);
    return [
      Text("Good day, ${store.actorName.split(" ").first}", style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w600)),
      const SizedBox(height: 4),
      const Text("Term 3 · development register", style: TextStyle(color: muted)),
      const SizedBox(height: 16),
      Wrap(
        spacing: 12,
        runSpacing: 12,
        children: [
          Metric(label: "Enrollment", value: "${store.enrolledCount}", detail: "${store.watchCount} on watch"),
          Metric(label: "Attendance", value: rate == null ? "—" : "$rate%", detail: "Present includes late"),
          Metric(label: "Outstanding", value: shillings(outstanding), detail: "Issued invoices"),
          Metric(label: "Applications", value: "${store.visibleApplications().length}", detail: "This intake"),
        ],
      ),
      const SizedBox(height: 20),
      const Heading("Open registers"),
      ...registers(context),
    ];
  }

  List<Widget> applications(BuildContext context) {
    final items = filter(store.applicationsFor(page.id), (item) => "${item["firstName"]} ${item["lastName"]} ${item["number"]}");
    if (store.role == "teacher" || store.role == "parent" || store.role == "student") {
      return const [Note(text: "Admissions are outside this role.")];
    }
    if (items.isEmpty) return [searchField(), const Note(text: "No applications on this list.")];
    return [
      searchField(),
      for (final item in items)
        Card(
          child: ListTile(
            title: Text("${item["firstName"]} ${item["lastName"]}"),
            subtitle: Text("${item["number"]} · ${store.className("${item["applyingClassId"]}")}"),
            trailing: Text(label("${item["status"]}"), style: const TextStyle(fontSize: 12)),
            onTap: () => applicationSheet(context, item),
          ),
        ),
    ];
  }

  Future<void> applicationSheet(BuildContext context, Map<String, dynamic> item) async {
    final id = "${item["id"]}";
    final status = "${item["status"]}";
    final next = applicationTransitions[status] ?? const <String>[];
    final reason = TextEditingController();
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (sheetContext) {
        return Padding(
          padding: EdgeInsets.fromLTRB(20, 8, 20, 20 + MediaQuery.viewInsetsOf(sheetContext).bottom),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("${item["firstName"]} ${item["lastName"]}", style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              Text("${item["number"]} · ${store.className("${item["applyingClassId"]}")} · ${label(status)}"),
              Text("Born ${item["dateOfBirth"]} · ${item["priorSchool"] ?? ""}"),
              if ("${item["decisionReason"] ?? ""}".isNotEmpty) Text("${item["decisionReason"]}"),
              const SizedBox(height: 12),
              TextField(controller: reason, decoration: const InputDecoration(labelText: "Reason, if you reject or waitlist", border: OutlineInputBorder())),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  for (final target in next)
                    FilledButton(
                      style: FilledButton.styleFrom(backgroundColor: navy),
                      onPressed: () {
                        final error = store.transitionApplication(id, target, reason.text);
                        Navigator.pop(sheetContext);
                        toast(context, error ?? "Application updated.");
                      },
                      child: Text(label(target)),
                    ),
                ],
              ),
            ],
          ),
        );
      },
    );
    reason.dispose();
  }

  List<Widget> students(BuildContext context) {
    final items = filter(store.visibleStudents, (item) => "${store.personName(item)} ${item["studentNumber"]}");
    if (items.isEmpty) return [searchField(), const Note(text: "No pupils are in your scope.")];
    return [
      searchField(),
      for (final item in items)
        Card(
          child: ListTile(
            title: Text(store.personName(item)),
            subtitle: Text("${item["studentNumber"]} · ${store.className(store.currentClassId("${item["id"]}"))}"),
            trailing: Text(label("${item["status"]}"), style: const TextStyle(fontSize: 12)),
            onTap: () => studentSheet(context, item),
          ),
        ),
    ];
  }

  void studentSheet(BuildContext context, Map<String, dynamic> student) {
    final id = "${student["id"]}";
    final guardians = store.guardiansFor(id);
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (context) => Padding(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(store.personName(student), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
            Text("${student["studentNumber"]} · ${store.className(store.currentClassId(id))}"),
            const SizedBox(height: 8),
            Text("Born ${student["dateOfBirth"]} · ${student["gender"]}"),
            Text("${student["address"]}"),
            Text("Enrolled ${student["enrolledOn"]}"),
            const SizedBox(height: 12),
            const Text("Guardians", style: TextStyle(fontWeight: FontWeight.w600)),
            for (final guardian in guardians) Text("${guardian["name"]} · ${guardian["relationship"]} · ${guardian["phone"]}"),
            const SizedBox(height: 8),
            const Text("Medical and safeguarding notes are not shown here.", style: TextStyle(color: muted, fontSize: 12)),
          ],
        ),
      ),
    );
  }

  List<Widget> guardians() {
    final tiles = <Widget>[searchField()];
    for (final student in store.visibleStudents) {
      for (final guardian in store.guardiansFor("${student["id"]}")) {
        final text = "${guardian["name"]} ${student["firstName"]}";
        if (!matches(text)) continue;
        tiles.add(Card(child: ListTile(title: Text("${guardian["name"]}"), subtitle: Text("${guardian["relationship"]} of ${store.personName(student)} · ${guardian["phone"]}"))));
      }
    }
    if (tiles.length == 1) tiles.add(const Note(text: "No guardians are linked."));
    return tiles;
  }

  List<Widget> documents() {
    return [
      for (final student in store.visibleStudents)
        Card(child: ListTile(title: Text(store.personName(student)), subtitle: Text("ID ${student["studentNumber"]} · enrolled ${student["enrolledOn"]}"))),
    ];
  }

  List<Widget> placement() {
    return [
      for (final student in store.visibleStudents)
        Card(child: ListTile(title: Text(store.personName(student)), subtitle: Text(store.className(store.currentClassId("${student["id"]}"))))),
    ];
  }

  List<Widget> registers(BuildContext context) {
    final items = store.visibleRegisters().where((item) => page.id != "pupils-attendance-by-period" || item["date"] == schoolAsOf).toList();
    if (items.isEmpty) return [const Note(text: "No register is open for your classes.")];
    return [
      for (final item in items)
        Card(
          child: ListTile(
            title: Text("${store.className("${item["classId"]}")} · ${item["date"]}"),
            subtitle: Text("${item["session"]} · ${item["status"]}"),
            onTap: () => registerSheet(context, item),
          ),
        ),
    ];
  }

  void registerSheet(BuildContext context, Map<String, dynamic> item) {
    final marks = item["marks"];
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (sheetContext) => AnimatedBuilder(
        animation: store,
        builder: (context, _) => Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(store.className("${item["classId"]}"), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
              Text("${item["date"]} · ${item["status"]}"),
              const SizedBox(height: 8),
              if (marks is List)
                for (final mark in marks)
                  if (mark is Map && store.canSeeStudent("${mark["studentId"]}"))
                    ListTile(
                      contentPadding: EdgeInsets.zero,
                      title: Text(store.studentName("${mark["studentId"]}")),
                      subtitle: Text(label("${mark["status"]}")),
                      trailing: store.canMarkAttendance && item["status"] == "open"
                          ? IconButton(
                              tooltip: "Next status",
                              onPressed: () {
                                final current = "${mark["status"]}";
                                final index = attendanceCycle.indexOf(current);
                                final next = attendanceCycle[(index + 1) % attendanceCycle.length];
                                final error = store.setAttendance("${item["id"]}", "${mark["studentId"]}", next);
                                if (error != null) toast(sheetContext, error);
                              },
                              icon: const Icon(Icons.swap_horiz),
                            )
                          : null,
                    ),
              if (store.canMarkAttendance && item["status"] == "open")
                FilledButton(
                  style: FilledButton.styleFrom(backgroundColor: navy),
                  onPressed: () {
                    final error = store.submitRegister("${item["id"]}");
                    Navigator.pop(sheetContext);
                    toast(context, error ?? "Register submitted.");
                  },
                  child: const Text("Submit register"),
                ),
            ],
          ),
        ),
      ),
    );
  }

  List<Widget> absences() {
    final tiles = <Widget>[];
    for (final register in store.visibleRegisters()) {
      final marks = register["marks"];
      if (marks is! List) continue;
      for (final mark in marks) {
        if (mark is! Map) continue;
        if (mark["status"] != "absent" && mark["status"] != "excused") continue;
        if (!store.canSeeStudent("${mark["studentId"]}")) continue;
        tiles.add(Card(child: ListTile(title: Text(store.studentName("${mark["studentId"]}")), subtitle: Text("${register["date"]} · ${label("${mark["status"]}")}"))));
      }
    }
    if (tiles.isEmpty) return [const Note(text: "No absences are recorded.")];
    return tiles;
  }

  List<Widget> watchList() {
    final watched = store.visibleStudents.where((student) => student["status"] == "watch").toList();
    if (watched.isEmpty) return [const Note(text: "No pupils are on watch.")];
    return [for (final student in watched) Card(child: ListTile(title: Text(store.personName(student)), subtitle: Text(store.className(store.currentClassId("${student["id"]}")))))];
  }

  List<Widget> classes() {
    return [
      for (final item in store.rows("classes"))
        Card(child: ListTile(title: Text("${item["name"]}"), subtitle: Text("${item["room"]} · ${store.accountName("${item["teacherId"]}")} · capacity ${item["capacity"]}"))),
    ];
  }

  List<Widget> teachers() {
    final staff = store.rows("accounts").where((item) => item["role"] == "teacher" || item["role"] == "headteacher");
    return [for (final item in staff) Card(child: ListTile(title: Text("${item["name"]}"), subtitle: Text("${item["role"]} · ${item["staffNumber"]}")))];
  }

  List<Widget> assessments() {
    final items = store.rows("assessments").where((item) {
      if (store.role != "teacher") return true;
      final classes = store.session?["classIds"];
      return classes is List && classes.contains(item["classId"]);
    });
    return [
      for (final item in items)
        Card(child: ListTile(title: Text("${item["name"]}"), subtitle: Text("${store.className("${item["classId"]}")} · ${item["subject"]} · ${item["heldOn"]}"))),
    ];
  }

  List<Widget> workload() {
    return [
      for (final item in store.rows("classes"))
        Card(child: ListTile(title: Text(store.accountName("${item["teacherId"]}")), subtitle: Text("${item["name"]} · ${item["room"]}"))),
    ];
  }

  List<Widget> marks(BuildContext context) {
    final items = store.rows("marks").where((item) => store.canSeeStudent("${item["studentId"]}")).toList();
    if (items.isEmpty) return [const Note(text: "No scores are in your scope.")];
    return [
      for (final item in items)
        Card(
          child: ListTile(
            title: Text(store.studentName("${item["studentId"]}")),
            subtitle: Text("${store.assessmentName("${item["assessmentId"]}")} · ${item["score"]} · ${label("${item["status"]}")}"),
            onTap: () => markSheet(context, item),
          ),
        ),
    ];
  }

  Future<void> markSheet(BuildContext context, Map<String, dynamic> item) async {
    final score = TextEditingController(text: "${item["score"]}");
    await showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (sheetContext) => Padding(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(store.studentName("${item["studentId"]}"), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
            Text(store.assessmentName("${item["assessmentId"]}")),
            const SizedBox(height: 12),
            TextField(controller: score, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: "Score", border: OutlineInputBorder())),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              children: [
                if (item["status"] == "draft" && store.canEnterMarks)
                  FilledButton(
                    style: FilledButton.styleFrom(backgroundColor: navy),
                    onPressed: () {
                      final error = store.saveMark("${item["id"]}", int.tryParse(score.text.trim()) ?? -1);
                      Navigator.pop(sheetContext);
                      toast(context, error ?? "Score saved.");
                    },
                    child: const Text("Save draft"),
                  ),
                FilledButton(
                  style: FilledButton.styleFrom(backgroundColor: navy),
                  onPressed: () {
                    final error = store.advanceMark("${item["id"]}");
                    Navigator.pop(sheetContext);
                    toast(context, error ?? "Score moved on.");
                  },
                  child: const Text("Move status"),
                ),
              ],
            ),
          ],
        ),
      ),
    );
    score.dispose();
  }

  List<Widget> calendar(BuildContext context) {
    final items = store.rows("calendar").toList()..sort((a, b) => "${a["date"]}".compareTo("${b["date"]}"));
    return [
      if (store.canEditCalendar)
        Align(alignment: Alignment.centerLeft, child: FilledButton(style: FilledButton.styleFrom(backgroundColor: navy), onPressed: () => addEvent(context), child: const Text("Add event"))),
      const SizedBox(height: 8),
      for (final item in items) Card(child: ListTile(title: Text("${item["title"]}"), subtitle: Text("${item["date"]} · ${item["kind"]}"))),
    ];
  }

  Future<void> addEvent(BuildContext context) async {
    final title = TextEditingController();
    final date = TextEditingController(text: schoolAsOf);
    await showDialog<void>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text("Add event"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: title, decoration: const InputDecoration(labelText: "Name")),
            TextField(controller: date, decoration: const InputDecoration(labelText: "Date")),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dialogContext), child: const Text("Cancel")),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: navy),
            onPressed: () {
              final error = store.addCalendarItem(title.text, date.text);
              Navigator.pop(dialogContext);
              toast(context, error ?? "Event added.");
            },
            child: const Text("Save"),
          ),
        ],
      ),
    );
    title.dispose();
    date.dispose();
  }

  List<Widget> structures() {
    return [
      for (final item in store.rows("classes"))
        Card(child: ListTile(title: Text("${item["name"]}"), subtitle: const Text("Tuition follows the issued invoices for pupils in this class."))),
    ];
  }

  List<Widget> invoices(BuildContext context, {required bool arrearsOnly}) {
    final tiles = <Widget>[];
    for (final item in store.rows("invoices")) {
      if (!store.invoiceVisible(item)) continue;
      final balance = store.invoiceOutstanding(item);
      if (arrearsOnly && (balance <= 0 || "${item["dueDate"]}".compareTo(schoolAsOf) >= 0)) continue;
      tiles.add(Card(
        child: ListTile(
          title: Text("${item["number"]} · ${store.studentName("${item["studentId"]}")}"),
          subtitle: Text("${label("${item["status"]}")} · due ${item["dueDate"]} · ${shillings(balance)} outstanding"),
          onTap: balance > 0 ? () => pay(context, item) : null,
        ),
      ));
    }
    if (tiles.isEmpty) return [const Note(text: "No invoices on this list.")];
    return tiles;
  }

  Future<void> pay(BuildContext context, Map<String, dynamic> invoice) async {
    final amount = TextEditingController(text: "${store.invoiceOutstanding(invoice)}");
    var method = "mobile_money";
    await showDialog<void>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text("Pay ${invoice["number"]}"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: amount, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: "Amount in shillings")),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              value: method,
              items: const [
                DropdownMenuItem(value: "cash", child: Text("Cash")),
                DropdownMenuItem(value: "bank", child: Text("Bank")),
                DropdownMenuItem(value: "mobile_money", child: Text("Mobile money")),
              ],
              onChanged: (value) => method = value ?? method,
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dialogContext), child: const Text("Cancel")),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: navy),
            onPressed: () {
              final error = store.recordPayment("${invoice["id"]}", int.tryParse(amount.text.trim()) ?? 0, method);
              Navigator.pop(dialogContext);
              toast(context, error ?? "Payment recorded.");
            },
            child: const Text("Record"),
          ),
        ],
      ),
    );
    amount.dispose();
  }

  List<Widget> payments() {
    final items = store.rows("payments").where((item) => store.canSeeStudent("${item["studentId"]}"));
    return [
      for (final item in items)
        Card(child: ListTile(title: Text("${item["number"]} · ${store.studentName("${item["studentId"]}")}"), subtitle: Text("${shillings(item["amount"])} · ${item["method"]} · ${item["receivedOn"]}"))),
    ];
  }

  List<Widget> notices() {
    final audience = store.role == "parent" || store.role == "student" ? "parent" : "staff";
    final items = store.rows("notices").where((item) => item["audience"] == "all" || item["audience"] == audience);
    return [
      for (final item in items)
        Card(
          child: ListTile(
            title: Text("${item["title"]}"),
            subtitle: Text("${item["body"]}"),
            trailing: Text(item["read"] == true ? "Read" : "Unread", style: const TextStyle(fontSize: 12)),
            onTap: () => store.markNoticeRead("${item["id"]}"),
          ),
        ),
    ];
  }

  List<Widget> terms() {
    return [for (final item in store.rows("terms")) Card(child: ListTile(title: Text("${item["name"]}"), subtitle: Text("${item["start"]} to ${item["end"]}")))];
  }

  List<Widget> users() {
    if (!const {"owner", "headteacher", "deputy", "registrar", "bursar"}.contains(store.role)) {
      return [const Note(text: "User accounts are limited to school leadership.")];
    }
    return [for (final item in store.rows("accounts")) Card(child: ListTile(title: Text("${item["name"]}"), subtitle: Text("${item["email"]} · ${item["role"]} · ${item["status"]}")))];
  }

  List<Widget> audit() {
    if (const {"parent", "student", "teacher"}.contains(store.role)) {
      return [const Note(text: "The audit log is limited to school leadership.")];
    }
    return [for (final item in store.rows("audits")) Card(child: ListTile(title: Text("${item["summary"]}"), subtitle: Text("${item["actorName"]} · ${item["at"]}")))];
  }

  List<Widget> book(BuildContext context, {required String empty}) {
    final rows = store.book(page.id).where((row) => matches("${row.title} ${row.detail}")).toList();
    return [
      if (store.canEditBooks)
        Align(alignment: Alignment.centerLeft, child: FilledButton(style: FilledButton.styleFrom(backgroundColor: navy), onPressed: () => addBook(context), child: const Text("Add record"))),
      const SizedBox(height: 8),
      if (rows.isEmpty) Note(text: empty),
      for (final row in rows)
        Card(
          child: ListTile(
            title: Text(row.title),
            subtitle: Text(row.detail.isEmpty ? row.status : "${row.detail} · ${row.status}"),
            trailing: store.canEditBooks
                ? IconButton(tooltip: "Remove", onPressed: () => store.removeBookRow(page.id, row.id), icon: const Icon(Icons.delete_outline))
                : null,
            onTap: store.canEditBooks ? () => store.updateBookStatus(page.id, row.id, row.status == "Open" ? "Done" : "Open") : null,
          ),
        ),
    ];
  }

  Future<void> addBook(BuildContext context) async {
    final title = TextEditingController();
    final detail = TextEditingController();
    await showDialog<void>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text("Add ${page.label}"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: title, decoration: const InputDecoration(labelText: "Name")),
            TextField(controller: detail, decoration: const InputDecoration(labelText: "Detail")),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dialogContext), child: const Text("Cancel")),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: navy),
            onPressed: () {
              final error = store.addBookRow(page.id, title.text, detail.text);
              Navigator.pop(dialogContext);
              toast(context, error ?? "Saved.");
            },
            child: const Text("Save"),
          ),
        ],
      ),
    );
    title.dispose();
    detail.dispose();
  }
}

class _RollCard extends StatelessWidget {
  const _RollCard({required this.enrolled, required this.capacity});

  final int enrolled;
  final int capacity;

  @override
  Widget build(BuildContext context) {
    final percent = capacity == 0 ? 0 : ((enrolled / capacity) * 100).round();
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFFE2E8F0))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text("School roll", style: TextStyle(fontWeight: FontWeight.w600)),
              const Spacer(),
              Text("$percent%", style: const TextStyle(color: navy, fontWeight: FontWeight.w700)),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(value: (percent / 100).clamp(0, 1).toDouble(), color: navy, backgroundColor: const Color(0xFFE2E8F0)),
          const SizedBox(height: 8),
          Text("Capacity $capacity · Enrolled $enrolled", style: const TextStyle(fontSize: 12, color: muted)),
          const Text("Version 3.0.0", style: TextStyle(fontSize: 12, color: muted)),
        ],
      ),
    );
  }
}

class Metric extends StatelessWidget {
  const Metric({super.key, required this.label, required this.value, required this.detail});

  final String label;
  final String value;
  final String detail;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 160,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(color: muted, fontSize: 12)),
              const SizedBox(height: 6),
              Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
              const SizedBox(height: 4),
              Text(detail, style: const TextStyle(fontSize: 12, color: muted)),
            ],
          ),
        ),
      ),
    );
  }
}

class Heading extends StatelessWidget {
  const Heading(this.text, {super.key});
  final String text;
  @override
  Widget build(BuildContext context) => Padding(padding: const EdgeInsets.only(bottom: 8), child: Text(text, style: const TextStyle(fontWeight: FontWeight.w600)));
}

class Note extends StatelessWidget {
  const Note({super.key, required this.text});
  final String text;
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFFE2E8F0))),
      child: Text(text, style: const TextStyle(color: Color(0xFF334155))),
    );
  }
}

String label(String value) => value.replaceAll("_", " ");

void toast(BuildContext context, String message) {
  ScaffoldMessenger.maybeOf(context)?.showSnackBar(SnackBar(content: Text(message)));
}
