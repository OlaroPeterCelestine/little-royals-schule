import "dart:convert";

import "package:flutter/services.dart";
import "package:flutter/widgets.dart";

const schoolAsOf = "2026-10-13";
const schoolYearId = "ay-2026";
const schoolTermId = "t3-2026";
const devPassword = "school";

const applicationTransitions = {
  "draft": ["submitted"],
  "submitted": ["under_review"],
  "under_review": ["interview", "offered", "waitlisted", "rejected"],
  "interview": ["offered", "waitlisted", "rejected"],
  "offered": ["accepted", "rejected"],
  "waitlisted": ["offered", "rejected"],
  "rejected": <String>[],
  "accepted": ["enrolled"],
  "enrolled": <String>[],
};

const markTransitions = {
  "draft": ["submitted"],
  "submitted": ["moderated"],
  "moderated": ["approved"],
  "approved": ["published"],
  "published": <String>[],
};

const attendanceCycle = ["present", "late", "absent", "excused"];

class BookRow {
  BookRow({required this.id, required this.title, required this.detail, required this.status});

  final String id;
  String title;
  String detail;
  String status;
}

class SchoolStore extends ChangeNotifier {
  Map<String, dynamic> raw = {};
  Map<String, dynamic>? session;
  final Map<String, List<BookRow>> books = {};
  var ready = false;

  Future<void> loadAsset() async {
    final text = await rootBundle.loadString("assets/register.json");
    loadJson(text);
  }

  void loadJson(String text) {
    final decoded = jsonDecode(text);
    if (decoded is Map<String, dynamic>) {
      raw = decoded;
    } else if (decoded is Map) {
      raw = Map<String, dynamic>.from(decoded);
    }
    ready = true;
    notifyListeners();
  }

  String? signIn(String email, String password) {
    final account = accountByEmail(email);
    if (account == null) return "No school account uses that email.";
    if (account["status"] != "active") return "This account is not active.";
    if (password != devPassword) return "Password is not correct.";
    session = Map<String, dynamic>.from(account);
    audit("sign-in", "Signed in on the phone.");
    notifyListeners();
    return null;
  }

  void signOut() {
    session = null;
    notifyListeners();
  }

  String get role => "${session?["role"] ?? ""}";
  String get actorName => "${session?["name"] ?? "Staff"}";

  bool get canEditAdmissions => const {"owner", "headteacher", "deputy", "registrar"}.contains(role);
  bool get canDecideAdmissions => const {"owner", "headteacher", "deputy"}.contains(role);
  bool get canEnroll => canDecideAdmissions || role == "registrar";
  bool get canMarkAttendance => const {"owner", "headteacher", "deputy", "teacher"}.contains(role);
  bool get canEnterMarks => const {"owner", "headteacher", "deputy", "teacher"}.contains(role);
  bool get canAdvanceMarks => const {"owner", "headteacher", "deputy"}.contains(role);
  bool get canRecordPayment => const {"owner", "headteacher", "bursar"}.contains(role);
  bool get canEditCalendar => const {"owner", "headteacher", "deputy", "registrar"}.contains(role);
  bool get canEditBooks => role != "parent" && role != "student";

  List<Map<String, dynamic>> rows(String key) {
    final value = raw[key];
    if (value is! List) return [];
    return [for (final item in value) if (item is Map) Map<String, dynamic>.from(item)];
  }

  List<dynamic> _live(String key) {
    final value = raw[key];
    if (value is List) return value;
    final created = <dynamic>[];
    raw[key] = created;
    return created;
  }

  Map<String, dynamic>? accountByEmail(String email) {
    final needle = email.trim().toLowerCase();
    for (final account in rows("accounts")) {
      if ("${account["email"]}".toLowerCase() == needle) return account;
    }
    return null;
  }

  String className(String? id) {
    for (final item in rows("classes")) {
      if (item["id"] == id) return "${item["name"]}";
    }
    return "Unassigned";
  }

  String personName(Map<String, dynamic> person) {
    return "${person["preferredName"] ?? person["firstName"] ?? ""} ${person["lastName"] ?? ""}".trim();
  }

  String accountName(String? id) {
    for (final account in rows("accounts")) {
      if (account["id"] == id) return "${account["name"]}";
    }
    return "Staff";
  }

  String? currentClassId(String studentId) {
    for (final enrollment in rows("enrollments")) {
      if (enrollment["studentId"] == studentId && enrollment["academicYearId"] == schoolYearId && enrollment["end"] == null) {
        return "${enrollment["classId"]}";
      }
    }
    return null;
  }

  bool canSeeStudent(String studentId) {
    final user = session;
    if (user == null) return false;
    if (role == "parent" || role == "student") {
      final ids = user["studentIds"];
      return ids is List && ids.contains(studentId);
    }
    if (role == "teacher") {
      final classes = user["classIds"];
      final classId = currentClassId(studentId);
      return classes is List && classId != null && classes.contains(classId);
    }
    return true;
  }

  List<Map<String, dynamic>> get visibleStudents {
    return [for (final student in rows("students")) if (canSeeStudent("${student["id"]}")) student];
  }

  List<String>? get scopedStudentIds {
    if (role == "parent" || role == "student" || role == "teacher") {
      return [for (final student in visibleStudents) "${student["id"]}"];
    }
    return null;
  }

  int charged(Map<String, dynamic> invoice) {
    var total = 0;
    final lines = invoice["lines"];
    if (lines is List) {
      for (final line in lines) {
        if (line is Map) total += (line["quantity"] as num? ?? 0).toInt() * (line["unitPrice"] as num? ?? 0).toInt();
      }
    }
    total -= (invoice["discount"] as num? ?? 0).toInt();
    return total < 0 ? 0 : total;
  }

  int allocatedTo(String invoiceId) {
    var total = 0;
    for (final payment in rows("payments")) {
      if (payment["reversesId"] != null || payment["reversedById"] != null) continue;
      final allocations = payment["allocations"];
      if (allocations is! List) continue;
      for (final allocation in allocations) {
        if (allocation is Map && allocation["invoiceId"] == invoiceId) {
          total += (allocation["amount"] as num? ?? 0).toInt();
        }
      }
    }
    return total;
  }

  int invoiceOutstanding(Map<String, dynamic> invoice) {
    if (invoice["status"] != "issued") return 0;
    return charged(invoice) - allocatedTo("${invoice["id"]}");
  }

  int outstandingForTerm(String termId, List<String>? studentIds) {
    var total = 0;
    for (final invoice in rows("invoices")) {
      if (invoice["status"] != "issued" || invoice["termId"] != termId) continue;
      if (studentIds != null && !studentIds.contains(invoice["studentId"])) continue;
      final balance = invoiceOutstanding(invoice);
      if (balance > 0) total += balance;
    }
    return total;
  }

  bool invoiceVisible(Map<String, dynamic> invoice) {
    return canSeeStudent("${invoice["studentId"]}");
  }

  String studentName(String? id) {
    for (final student in rows("students")) {
      if (student["id"] == id) return personName(student);
    }
    return "Pupil";
  }

  Map<String, dynamic>? studentById(String id) {
    for (final student in rows("students")) {
      if (student["id"] == id && canSeeStudent(id)) return student;
    }
    return null;
  }

  List<Map<String, dynamic>> guardiansFor(String studentId) {
    final found = <Map<String, dynamic>>[];
    for (final link in rows("links")) {
      if (link["studentId"] != studentId) continue;
      for (final guardian in rows("guardians")) {
        if (guardian["id"] == link["guardianId"]) {
          found.add({...guardian, "relationship": link["relationship"], "billing": link["billing"]});
        }
      }
    }
    return found;
  }

  List<Map<String, dynamic>> visibleApplications() {
    if (const {"parent", "student", "teacher"}.contains(role)) return [];
    return rows("applications");
  }

  List<Map<String, dynamic>> applicationsFor(String pageId) {
    final all = visibleApplications();
    bool match(Map<String, dynamic> item) {
      final status = "${item["status"]}";
      return switch (pageId) {
        "pupils-admissions-enquiries" => status == "draft" || status == "submitted",
        "pupils-admissions-decisions" => const {"interview", "offered", "accepted", "waitlisted", "rejected"}.contains(status),
        "pupils-admissions-enrollment" => status == "accepted" || status == "enrolled",
        "pupils-admissions-transfers" => false,
        _ => true,
      };
    }
    return [for (final item in all) if (match(item)) item];
  }

  String? transitionApplication(String id, String next, String reason) {
    final needsReason = next == "rejected" || next == "waitlisted";
    if (needsReason && reason.trim().length < 3) return "Enter a reason.";
    if (next == "enrolled") return enrollApplication(id);
    final allowed = _canMoveApplication(next);
    if (!allowed) return "Your role cannot make that decision.";
    for (final item in _live("applications")) {
      if (item is! Map || item["id"] != id) continue;
      final from = "${item["status"]}";
      final options = applicationTransitions[from] ?? const <String>[];
      if (!options.contains(next)) return "That move is not available from $from.";
      item["status"] = next;
      if (reason.trim().isNotEmpty) item["decisionReason"] = reason.trim();
      audit("application", "Moved ${item["firstName"]} ${item["lastName"]} to $next.");
      notifyListeners();
      return null;
    }
    return "Application not found.";
  }

  bool _canMoveApplication(String next) {
    if (next == "submitted" || next == "under_review") return canEditAdmissions;
    return canDecideAdmissions;
  }

  String? enrollApplication(String id) {
    if (!canEnroll) return "Your role cannot enroll a pupil.";
    for (final item in _live("applications")) {
      if (item is! Map || item["id"] != id) continue;
      if (item["status"] != "accepted") return "Only an accepted offer can be enrolled.";
      if (item["studentId"] != null) return "This application is already linked to a student.";
      final documents = item["documents"];
      if (documents is! Map || documents["birthCertificate"] != true) {
        return "Mark the birth certificate on file before creating the student record.";
      }
      final expiry = item["offerExpiresOn"];
      if (expiry is String && expiry.compareTo(schoolAsOf) < 0) {
        return "This offer has expired. Extend the expiry date before enrollment.";
      }
      final first = "${item["firstName"]}".trim().toLowerCase();
      final last = "${item["lastName"]}".trim().toLowerCase();
      final dob = "${item["dateOfBirth"]}";
      for (final student in rows("students")) {
        if ("${student["status"]}" == "withdrawn") continue;
        if ("${student["firstName"]}".trim().toLowerCase() == first &&
            "${student["lastName"]}".trim().toLowerCase() == last &&
            student["dateOfBirth"] == dob) {
          return "A pupil with this name and date of birth is already enrolled.";
        }
      }
      final studentId = "stu-${item["id"]}";
      _live("students").add({
        "id": studentId,
        "studentNumber": "ST-NEW",
        "firstName": item["firstName"],
        "middleName": item["middleName"] ?? "",
        "lastName": item["lastName"],
        "preferredName": item["firstName"],
        "dateOfBirth": dob,
        "gender": item["gender"] ?? "",
        "status": "active",
        "address": item["address"] ?? "",
        "nationality": "Ugandan",
        "enrolledOn": schoolAsOf,
        "withdrawalReason": "",
      });
      _live("enrollments").add({
        "id": "enr-$studentId",
        "studentId": studentId,
        "classId": item["applyingClassId"],
        "academicYearId": schoolYearId,
        "start": schoolAsOf,
        "end": null,
      });
      item["status"] = "enrolled";
      item["studentId"] = studentId;
      audit("enroll", "Enrolled ${item["firstName"]} ${item["lastName"]}.");
      notifyListeners();
      return null;
    }
    return "Application not found.";
  }

  List<Map<String, dynamic>> visibleRegisters() {
    final classes = session?["classIds"];
    return [
      for (final item in rows("registers"))
        if (role != "teacher" || (classes is List && classes.contains(item["classId"]))) item,
    ];
  }

  String? setAttendance(String registerId, String studentId, String status) {
    if (!canMarkAttendance) return "Your role cannot mark the register.";
    if (!attendanceCycle.contains(status)) return "Choose present, late, absent, or excused.";
    for (final item in _live("registers")) {
      if (item is! Map || item["id"] != registerId) continue;
      if (item["status"] != "open") return "This register is already submitted.";
      if (role == "teacher") {
        final classes = session?["classIds"];
        if (classes is! List || !classes.contains(item["classId"])) return "This class is outside your register.";
      }
      final marks = item["marks"];
      if (marks is! List) return "This register has no pupils.";
      for (final mark in marks) {
        if (mark is Map && mark["studentId"] == studentId) {
          mark["status"] = status;
          audit("attendance", "Marked ${studentName(studentId)} $status.");
          notifyListeners();
          return null;
        }
      }
    }
    return "Register not found.";
  }

  String? submitRegister(String registerId) {
    if (!canMarkAttendance) return "Your role cannot submit the register.";
    for (final item in _live("registers")) {
      if (item is! Map || item["id"] != registerId) continue;
      if (item["status"] != "open") return "This register is already submitted.";
      item["status"] = "submitted";
      item["submittedAt"] = DateTime.now().toUtc().toIso8601String();
      audit("attendance", "Submitted the ${className("${item["classId"]}")} register.");
      notifyListeners();
      return null;
    }
    return "Register not found.";
  }

  String? saveMark(String id, int score) {
    if (!canEnterMarks) return "Your role cannot enter marks.";
    for (final item in _live("marks")) {
      if (item is! Map || item["id"] != id) continue;
      if (item["status"] != "draft") return "Only a draft score can be edited.";
      final assessment = _assessment("${item["assessmentId"]}");
      final max = (assessment?["maxScore"] as num? ?? 100).toInt();
      if (score < 0 || score > max) return "Enter a score from 0 to $max.";
      if (!canSeeStudent("${item["studentId"]}")) return "That pupil is outside your classes.";
      item["score"] = score;
      audit("mark", "Saved ${studentName("${item["studentId"]}")}'s score.");
      notifyListeners();
      return null;
    }
    return "Mark not found.";
  }

  String? advanceMark(String id) {
    for (final item in _live("marks")) {
      if (item is! Map || item["id"] != id) continue;
      final from = "${item["status"]}";
      final options = markTransitions[from] ?? const <String>[];
      if (options.isEmpty) return "This score is already published.";
      final next = options.first;
      if (next == "submitted" && !canEnterMarks) return "Your role cannot submit marks.";
      if (next != "submitted" && !canAdvanceMarks) return "A head teacher moves a score after it is submitted.";
      item["status"] = next;
      audit("mark", "Moved ${studentName("${item["studentId"]}")}'s score to $next.");
      notifyListeners();
      return null;
    }
    return "Mark not found.";
  }

  Map<String, dynamic>? _assessment(String? id) {
    for (final item in rows("assessments")) {
      if (item["id"] == id) return item;
    }
    return null;
  }

  String assessmentName(String? id) => "${_assessment(id)?["name"] ?? "Assessment"}";

  String? recordPayment(String invoiceId, int amount, String method) {
    if (!canRecordPayment) return "Your role cannot record a payment.";
    Map<String, dynamic>? invoice;
    for (final item in _live("invoices")) {
      if (item is Map && item["id"] == invoiceId) invoice = Map<String, dynamic>.from(item);
    }
    if (invoice == null) return "Invoice not found.";
    if (!invoiceVisible(invoice)) return "That invoice is outside your scope.";
    final balance = invoiceOutstanding(invoice);
    if (invoice["status"] != "issued") return "Issue the invoice before taking a payment.";
    if (amount <= 0 || amount > balance) return "Enter an amount up to the outstanding balance.";
    if (!const {"cash", "bank", "mobile_money"}.contains(method)) return "Choose cash, bank, or mobile money.";
    final count = rows("payments").length + 1;
    _live("payments").add({
      "id": "pay-local-$count",
      "number": "RCT-LOCAL-$count",
      "studentId": invoice["studentId"],
      "amount": amount,
      "method": method,
      "receivedOn": schoolAsOf,
      "allocations": [
        {"invoiceId": invoiceId, "amount": amount}
      ],
      "note": "",
      "reversesId": null,
      "reversedById": null,
    });
    audit("payment", "Recorded UGX $amount for ${studentName("${invoice["studentId"]}")}.");
    notifyListeners();
    return null;
  }

  void markNoticeRead(String id) {
    for (final item in _live("notices")) {
      if (item is Map && item["id"] == id) item["read"] = true;
    }
    notifyListeners();
  }

  String? addCalendarItem(String title, String date) {
    if (!canEditCalendar) return "Your role cannot change the calendar.";
    if (title.trim().length < 3) return "Enter an event name.";
    if (!RegExp(r"^\d{4}-\d{2}-\d{2}$").hasMatch(date)) return "Enter a date as YYYY-MM-DD.";
    _live("calendar").add({
      "id": "event-${DateTime.now().microsecondsSinceEpoch}",
      "title": title.trim(),
      "date": date,
      "kind": "event",
      "termId": schoolTermId,
      "locked": false,
    });
    audit("calendar", "Added ${title.trim()}.");
    notifyListeners();
    return null;
  }

  List<BookRow> book(String pageId) => books.putIfAbsent(pageId, () => []);

  String? addBookRow(String pageId, String title, String detail) {
    if (!canEditBooks) return "Your role cannot add that record.";
    if (title.trim().length < 2) return "Enter a name.";
    book(pageId).insert(0, BookRow(id: "row-${DateTime.now().microsecondsSinceEpoch}", title: title.trim(), detail: detail.trim(), status: "Open"));
    audit("record", "Added ${title.trim()}.");
    notifyListeners();
    return null;
  }

  void updateBookStatus(String pageId, String id, String status) {
    for (final row in book(pageId)) {
      if (row.id == id) row.status = status;
    }
    notifyListeners();
  }

  void removeBookRow(String pageId, String id) {
    book(pageId).removeWhere((row) => row.id == id);
    notifyListeners();
  }

  void audit(String action, String summary) {
    _live("audits").insert(0, {
      "id": "phone-${DateTime.now().microsecondsSinceEpoch}",
      "at": DateTime.now().toUtc().toIso8601String(),
      "actorId": session?["id"],
      "actorName": actorName,
      "action": action,
      "entityType": action,
      "entityId": session?["id"],
      "summary": summary,
    });
  }

  int get enrolledCount => visibleStudents.where((student) => student["status"] == "active" || student["status"] == "watch").length;

  int get watchCount => visibleStudents.where((student) => student["status"] == "watch").length;

  int get capacity {
    var total = 0;
    for (final item in rows("classes")) {
      total += (item["capacity"] as num? ?? 0).toInt();
    }
    return total;
  }

  int? attendancePercent() {
    var counted = 0;
    var present = 0;
    final scoped = scopedStudentIds?.toSet();
    for (final register in rows("registers")) {
      if (register["termId"] != schoolTermId) continue;
      final marks = register["marks"];
      if (marks is! List) continue;
      for (final mark in marks) {
        if (mark is! Map) continue;
        final studentId = "${mark["studentId"]}";
        if (scoped != null && !scoped.contains(studentId)) continue;
        counted++;
        if (mark["status"] == "present" || mark["status"] == "late") present++;
      }
    }
    if (counted == 0) return null;
    return ((present / counted) * 100).round();
  }
}
