import "package:flutter/material.dart";
import "package:flutter/services.dart";
import "package:flutter_test/flutter_test.dart";
import "package:littleroyals/api.dart";
import "package:littleroyals/catalog.dart";
import "package:littleroyals/desk_home.dart";
import "package:littleroyals/main.dart";
import "package:littleroyals/store.dart";

void main() {
  test("formats whole shillings", () {
    expect(shillings(840000), "UGX 840,000");
    expect(shillings(-1500), "-UGX 1,500");
  });

  testWidgets("the phone desk covers every web section and the term balance", (_) async {
    final store = SchoolStore();
    await store.loadAsset();
    expect(store.signIn("grace.achieng@littleroyals.school", "school"), isNull);
    expect(store.outstandingForTerm(schoolTermId, null), 840000);
    expect(store.visibleStudents, hasLength(7));
    expect(store.signIn("mei.chen@gmail.com", "school"), isNull);
    expect(store.visibleStudents, hasLength(1));
    expect(store.visibleStudents.single["id"], "liam");
    const expected = [
      "Dashboard",
      "Enrolment",
      "Pupils",
      "Attendance",
      "Pastoral",
      "Classes",
      "Timetable",
      "Teaching",
      "Assessment",
      "Learning",
      "Staff",
      "School",
      "Fees",
      "Messages",
      "Front desk",
      "Documents",
      "Library",
      "Transport",
      "Store",
      "Events",
      "Settings",
    ];
    expect(deskGroups.map((group) => group.label).toList(), expected);
    expect(deskPages.length, greaterThan(70));
  });

  testWidgets("login shows the school welcome", (tester) async {
    await tester.pumpWidget(LittleroyalsApp(api: SchoolApi(base: "http://127.0.0.1:8080")));
    expect(find.text("Welcome back to Little Royals"), findsOneWidget);
    expect(find.text("Log in"), findsOneWidget);
    await tester.pump();
  });

  testWidgets("a signed-in desk opens the school menu", (tester) async {
    print("desk start");
    final pending = rootBundle.loadString("assets/register.json");
    print("future ${pending.runtimeType}");
    var done = false;
    pending.then((value) {
      done = true;
      print("len ${value.length}");
    });
    await Future<void>.value();
    print("after microtask done=$done");
    final store = SchoolStore();
    await store.loadAsset();
    print("desk loaded");
    expect(store.signIn("grace.achieng@littleroyals.school", "school"), isNull);
    await tester.pumpWidget(MaterialApp(home: DeskHome(store: store, onSignOut: (_) {})));
    print("desk pumped");
    await tester.pump();
    expect(find.text("Good day, Grace"), findsOneWidget);
    expect(find.text("UGX 840,000"), findsOneWidget);
    await tester.tap(find.byTooltip("Open navigation menu"));
    await tester.pump(const Duration(milliseconds: 300));
    expect(find.text("ENROLMENT"), findsOneWidget);
    expect(find.text("FEES", skipOffstage: false), findsOneWidget);
    expect(find.text("LIBRARY", skipOffstage: false), findsOneWidget);
  });
}
