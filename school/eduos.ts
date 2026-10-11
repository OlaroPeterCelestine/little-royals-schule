// @ts-nocheck
(function () {
  const CARD_PAGES = {
    "Total Enrollment": "students",
    "At-Risk Students": "wellness",
    "Average Attendance Rate": "attendance",
    "Admissions Pipeline": "students",
    "Student Distribution by Grade": "curriculum",
    "Daily Attendance & Engagement Cadence": "attendance",
    "Student & Parent Climate Index": "parents",
  };

  const WEEKS = {
    1: { avg: "94.6%", rate: "96.8%", delta: "+1.4%", bars: [[12, 94], [10, 96], [14, 92], [8, 97], [18, 90], [25, 45], [15, 20]] },
    2: { avg: "93.1%", rate: "95.2%", delta: "+0.6%", bars: [[15, 91], [11, 95], [16, 90], [9, 95], [20, 88], [28, 40], [18, 18]] },
    3: { avg: "95.4%", rate: "97.1%", delta: "+2.1%", bars: [[9, 96], [8, 97], [11, 94], [7, 98], [14, 93], [22, 48], [12, 22]] },
    4: { avg: "92.4%", rate: "94.0%", delta: "-0.8%", bars: [[18, 88], [14, 92], [17, 89], [12, 93], [21, 86], [30, 38], [16, 15]] },
  };

  const TONE = {
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    amber: "bg-amber-50 text-amber-700 border border-amber-200/60",
    rose: "bg-rose-50 text-rose-700 border border-rose-200/60",
    sky: "bg-sky-50 text-sky-700 border border-sky-200/60",
    slate: "bg-slate-100 text-slate-700 border border-slate-200",
  };

  const state = {
    page: "dashboard",
    recordId: "",
    grids: {},
    week: 1,
    gradeFilter: "All",
    applicantQuery: "",
    sort: "original",
    pageIndex: 0,
    pageSize: 3,
    cols: { name: true, email: true, grade: true, status: true, date: true },
    selected: new Set(["Sophia Martinez"]),
    studentQuery: "",
    me: { name: "Grace Achieng", role: "Head teacher", email: "grace.achieng@littleroyals.school" },
    notices: [
      { id: "n1", title: "Grade 4 Mathematics", body: "14 pupils are below the midterm line.", time: "Today, 8:10", read: false },
      { id: "n2", title: "Fee receipts", body: "6 kindergarten receipts are waiting to be checked.", time: "Today, 7:40", read: false },
      { id: "n3", title: "Staff leave", body: "Ms. Brooks requested Friday off.", time: "Yesterday", read: false },
      { id: "n4", title: "Term calendar", body: "Term 3, 2026 dates are published.", time: "Mon", read: true },
    ],
    accounts: [
      { id: "u1", name: "Grace Achieng", email: "grace.achieng@littleroyals.school", role: "Head teacher", status: "Active" },
      { id: "u2", name: "Ms. Alvarez", email: "alvarez@littleroyals.school", role: "Class teacher", status: "Active" },
      { id: "u3", name: "Mr. Shah", email: "shah@littleroyals.school", role: "Class teacher", status: "Active" },
      { id: "u4", name: "Dr. Nguyen", email: "nguyen@littleroyals.school", role: "Class teacher", status: "Active" },
      { id: "u5", name: "Front office", email: "office@littleroyals.school", role: "Registrar", status: "Active" },
      { id: "u6", name: "Ms. Wanjiru", email: "wanjiru@littleroyals.school", role: "Bursar", status: "Invited" },
    ],
    audits: [
      { id: "a1", who: "Grace Achieng", action: "Signed in", target: "Little Royals", when: "Today, 7:55" },
      { id: "a2", who: "Front office", action: "Updated applicant", target: "Sophia Martinez", when: "Today, 8:02" },
      { id: "a3", who: "Ms. Alvarez", action: "Saved attendance", target: "Grade 4 Mathematics", when: "Yesterday, 16:10" },
      { id: "a4", who: "Ms. Wanjiru", action: "Recorded payment", target: "Liam Chen", when: "Yesterday, 11:24" },
    ],
    teacherId: "alvarez",
    clockSpan: "",
    pupilId: "liam",
    pupils360: [
      { id: "liam", name: "Liam Chen", sid: "ST-1042", grade: "Kindergarten", cls: "KG A", teacher: "Ms. Alvarez", room: "Room 4", status: "Active", dob: "12 Mar 2021", gender: "Boy", joined: "Jan 2026", nationality: "Kenyan", address: "Lavington, Nairobi", transport: "Parent pickup", attendance: "96%", roll: { present: 48, absent: 2, late: 1 }, fees: { balance: "UGX 0", plan: "Term fees", paid: "Paid" }, parents: [{ name: "Wei Chen", relation: "Father", phone: "0722 100 441", email: "chen.family@gmail.com", pickup: "Yes" }, { name: "Mei Chen", relation: "Mother", phone: "0733 100 442", email: "mei.chen@gmail.com", pickup: "Yes" }], health: { blood: "O+", allergies: "None", conditions: "None", medication: "None", clinic: "Up to date", emergency: "Wei Chen · 0722 100 441", note: "Cleared for sports and swimming." }, marks: [["Mathematics", "B+"], ["English", "A"], ["Reading", "A-"]], documents: [["Birth certificate", "On file"], ["Clinic card", "On file"], ["Term 2 report", "On file"]], discipline: [{ date: "Sep 2, 2026", kind: "Reminder", note: "Spoke during assembly.", outcome: "Verbal reminder", status: "Closed" }] },
      { id: "ava", name: "Ava Patel", sid: "ST-1214", grade: "Kindergarten", cls: "KG A", teacher: "Ms. Alvarez", room: "Room 4", status: "Watch", dob: "4 Jun 2021", gender: "Girl", joined: "Jan 2026", nationality: "Kenyan", address: "Parklands, Nairobi", transport: "School bus · Route B", attendance: "88%", roll: { present: 42, absent: 6, late: 3 }, fees: { balance: "UGX 12,400", plan: "Installments", paid: "Part paid" }, parents: [{ name: "Rohan Patel", relation: "Father", phone: "0711 220 908", email: "patel.home@gmail.com", pickup: "Yes" }, { name: "Anita Patel", relation: "Mother", phone: "0700 220 909", email: "anita.patel@gmail.com", pickup: "Yes" }], health: { blood: "A+", allergies: "Peanuts", conditions: "Mild asthma", medication: "Inhaler in the office", clinic: "Review due", emergency: "Anita Patel · 0700 220 909", note: "No nuts in class snacks. Inhaler after games." }, marks: [["Mathematics", "C"], ["English", "B"], ["Reading", "B-"]], documents: [["Birth certificate", "On file"], ["Clinic card", "Review due"], ["Previous report", "On file"]], discipline: [{ date: "Oct 3, 2026", kind: "Academic", note: "Two missing Mathematics quizzes.", outcome: "Parent meeting booked", status: "Open" }, { date: "Oct 8, 2026", kind: "Conduct", note: "Left the mat during story time.", outcome: "Class teacher watching", status: "Monitoring" }] },
      { id: "mia", name: "Mia Okonkwo", sid: "ST-1108", grade: "Grade 2", cls: "Grade 2", teacher: "Mr. Shah", room: "Lab", status: "Active", dob: "19 Sep 2018", gender: "Girl", joined: "Sep 2024", nationality: "Kenyan", address: "Kilimani, Nairobi", transport: "Parent pickup", attendance: "97%", roll: { present: 50, absent: 1, late: 0 }, fees: { balance: "UGX 0", plan: "Term fees", paid: "Paid" }, parents: [{ name: "Chidi Okonkwo", relation: "Father", phone: "0720 441 330", email: "okonkwo.m@gmail.com", pickup: "Yes" }], health: { blood: "B+", allergies: "None", conditions: "None", medication: "None", clinic: "Up to date", emergency: "Chidi Okonkwo · 0720 441 330", note: "No clinic visits this term." }, marks: [["Science", "A"], ["Mathematics", "A-"], ["English", "B+"]], documents: [["Birth certificate", "On file"], ["Clinic card", "On file"]], discipline: [] },
      { id: "ethan", name: "Ethan Brooks", sid: "ST-0988", grade: "Grade 6", cls: "Grade 6", teacher: "Dr. Nguyen", room: "Room 6", status: "Active", dob: "2 Feb 2015", gender: "Boy", joined: "Sep 2022", nationality: "Kenyan", address: "Karen, Nairobi", transport: "School bus · Route A", attendance: "94%", roll: { present: 46, absent: 3, late: 2 }, fees: { balance: "UGX 4,200", plan: "Term fees", paid: "Part paid" }, parents: [{ name: "Helen Brooks", relation: "Mother", phone: "0734 880 112", email: "brooks.family@icloud.com", pickup: "Yes" }, { name: "Mark Brooks", relation: "Father", phone: "0734 880 113", email: "mark.brooks@icloud.com", pickup: "No" }], health: { blood: "AB+", allergies: "Dust", conditions: "None", medication: "None", clinic: "Up to date", emergency: "Helen Brooks · 0734 880 112", note: "Sits away from the chalkboard dust during art." }, marks: [["Social Studies", "A"], ["English", "A-"], ["Mathematics", "B"]], documents: [["Birth certificate", "On file"], ["Term 2 report", "On file"]], discipline: [{ date: "May 12, 2026", kind: "Conduct", note: "Playground argument. Both pupils were spoken to.", outcome: "Resolved with both families", status: "Closed" }] },
      { id: "owen", name: "Owen Clarke", sid: "ST-1302", grade: "Kindergarten", cls: "KG A", teacher: "Ms. Alvarez", room: "Room 4", status: "Watch", dob: "28 Nov 2020", gender: "Boy", joined: "May 2026", nationality: "Kenyan", address: "South B, Nairobi", transport: "Parent pickup", attendance: "81%", roll: { present: 34, absent: 8, late: 4 }, fees: { balance: "UGX 18,000", plan: "New admission", paid: "Part paid" }, parents: [{ name: "Laura Clarke", relation: "Mother", phone: "0718 555 014", email: "clarke.owen@outlook.com", pickup: "Yes" }], health: { blood: "O-", allergies: "None", conditions: "Frequent colds", medication: "None", clinic: "Nurse follow-up", emergency: "Laura Clarke · 0718 555 014", note: "Four absences this term. Nurse checked him on 8 Oct." }, marks: [["Mathematics", "C+"], ["Reading", "C"], ["English", "C+"]], documents: [["Birth certificate", "On file"], ["Clinic card", "Follow-up"]], discipline: [{ date: "Oct 8, 2026", kind: "Attendance", note: "Four unexcused absences this term.", outcome: "Parent conference", status: "Open" }, { date: "Oct 10, 2026", kind: "Late arrival", note: "Arrived after the register three mornings.", outcome: "Morning check with the office", status: "Open" }] },
    ],
    settings: {
      alerts: true,
      digest: false,
      compact: document.documentElement.classList.contains("sidebar-collapsed"),
      levels: { nursery: true, primary: true, olevel: false, alevel: false },
    },
    brand: { name: "Little Royals", tagline: "Kindergarten & Primary School", logo: "logo.png", history: [] },
    versions: [],
    benchmarks: [],
    benchmarkLevel: "all",
    applicants: [
      { name: "Liam Chen", email: "chen.family@gmail.com", grade: "Kindergarten", status: "Enrolled", tone: "emerald", date: "2024-12-03", display: "Dec 03, 2024" },
      { name: "Sophia Martinez", email: "m.martinez@outlook.com", grade: "Grade 4", status: "Interviewing", tone: "amber", date: "2025-01-16", display: "Jan 16, 2025" },
      { name: "Noah Al-Mansoor", email: "t.mansoor@al-edu.org", grade: "Grade 2", status: "Documentation Pending", tone: "slate", date: "2025-01-22", display: "Jan 22, 2025" },
      { name: "Ava Patel", email: "patel.home@gmail.com", grade: "Kindergarten", status: "Interviewing", tone: "amber", date: "2025-01-28", display: "Jan 28, 2025" },
      { name: "Ethan Brooks", email: "brooks.family@icloud.com", grade: "Grade 6", status: "Enrolled", tone: "emerald", date: "2024-11-19", display: "Nov 19, 2024" },
      { name: "Mia Okonkwo", email: "okonkwo.m@gmail.com", grade: "Grade 2", status: "Enrolled", tone: "emerald", date: "2024-12-11", display: "Dec 11, 2024" },
      { name: "Lucas Ferreira", email: "l.ferreira@edu.org", grade: "Grade 4", status: "Documentation Pending", tone: "slate", date: "2025-02-02", display: "Feb 02, 2025" },
      { name: "Hannah Kim", email: "kim.hannah@gmail.com", grade: "Grade 6", status: "Interviewing", tone: "amber", date: "2025-02-08", display: "Feb 08, 2025" },
      { name: "Owen Clarke", email: "clarke.owen@outlook.com", grade: "Kindergarten", status: "Documentation Pending", tone: "slate", date: "2025-02-14", display: "Feb 14, 2025" },
    ],
    students: [
      { name: "Liam Chen", sid: "ST-1042", grade: "Kindergarten", advisor: "Ms. Alvarez", status: "Active" },
      { name: "Mia Okonkwo", sid: "ST-1108", grade: "Grade 2", advisor: "Mr. Shah", status: "Active" },
      { name: "Ethan Brooks", sid: "ST-0988", grade: "Grade 6", advisor: "Dr. Nguyen", status: "Active" },
      { name: "Ava Patel", sid: "ST-1214", grade: "Kindergarten", advisor: "Ms. Alvarez", status: "Watch" },
      { name: "Hannah Kim", sid: "ST-0871", grade: "Grade 6", advisor: "Dr. Nguyen", status: "Active" },
    ],
    roster: [
      { name: "Liam Chen", period: "Mathematics", present: true },
      { name: "Ava Patel", period: "Mathematics", present: false },
      { name: "Noah Al-Mansoor", period: "Science", present: true },
      { name: "Mia Okonkwo", period: "Social Studies", present: true },
      { name: "Owen Clarke", period: "Mathematics", present: false },
    ],
    cases: [
      { id: "c1", name: "Ava Patel", kind: "Academic", note: "Two missing Mathematics quizzes", status: "Open" },
      { id: "c2", name: "Owen Clarke", kind: "Attendance", note: "Four unexcused absences this term", status: "Open" },
      { id: "c3", name: "Lucas Ferreira", kind: "Wellness", note: "Counselor check-in scheduled", status: "Monitoring" },
    ],
    exams: [
      { name: "Grade 4 Mathematics", when: "Oct 18, 2026", room: "Hall B", teacher: "Ms. Alvarez", grade: "Grade 4", subject: "Mathematics", level: "Primary" },
      { name: "Science practical", when: "Oct 21, 2026", room: "Lab 2", teacher: "Mr. Shah", grade: "Grade 2", subject: "Science", level: "Primary" },
      { name: "English reading", when: "Oct 24, 2026", room: "Room 4", teacher: "Ms. Alvarez", grade: "Kindergarten", subject: "Reading", level: "Nursery" },
      { name: "Grade 8 Integrated Science", when: "Oct 22, 2026", room: "Lab 1", teacher: "Mr. Shah", grade: "Grade 8", subject: "Integrated Science", level: "Junior" },
      { name: "Form 2 Algebra", when: "Oct 28, 2026", room: "Room 8", teacher: "Dr. Nguyen", grade: "Form 2", subject: "Mathematics", level: "Secondary" },
    ],
    plans: [
      { id: "p1", title: "Term 3 number work", teacher: "Ms. Alvarez", grade: "Kindergarten", subject: "Mathematics", level: "Nursery", weeks: "8", outline: "Counting, shapes, then simple addition with objects." },
      { id: "p2", title: "Grade 4 midterm recovery", teacher: "Ms. Alvarez", grade: "Grade 4", subject: "Mathematics", level: "Primary", weeks: "4", outline: "Fractions twice a week, then a short test before 18 Oct." },
      { id: "p3", title: "Grade 8 mixtures", teacher: "Mr. Shah", grade: "Grade 8", subject: "Integrated Science", level: "Junior", weeks: "5", outline: "Separating mixtures, then a practical before 22 Oct." },
      { id: "p4", title: "Form 2 algebra", teacher: "Dr. Nguyen", grade: "Form 2", subject: "Mathematics", level: "Secondary", weeks: "6", outline: "Expressions, then simple equations." },
    ],
    teachers: [
      {
        id: "alvarez", name: "Ms. Alvarez", role: "Class teacher", subject: "Mathematics", grades: "Kindergarten, Grade 4",
        email: "alvarez@eduos.school", phone: "0712 440 118", staffId: "TR-014", room: "Room 4",
        fullName: "Elena Alvarez", gender: "Female", dob: "14 Mar 1992", nationality: "Kenyan", idNo: "29844112",
        address: "House 12, Kilimani, Nairobi", joined: "8 Jan 2019", qualification: "B.Ed Mathematics, Kenyatta University",
        tsc: "TSC/552104", contract: "Permanent", department: "Mathematics",
        kin: "James Alvarez", kinRelation: "Spouse", kinPhone: "0721 440 200", blood: "O+",
        emergency: "Nairobi Hospital · 0703 000 200",
        documents: [["National ID", "On file"], ["Teaching certificate", "On file"], ["TSC letter", "On file"], ["Contract", "On file"]],
        inTime: "07:12", outTime: "",
        week: [
          { day: "Mon", in: "07:08", out: "16:05" },
          { day: "Tue", in: "07:15", out: "16:22" },
          { day: "Wed", in: "07:04", out: "16:10" },
          { day: "Thu", in: "07:19", out: "16:01" },
          { day: "Fri", in: "07:11", out: "15:55" },
        ],
        discipline: [
          { id: "d1", date: "Sep 18, 2026", kind: "Late arrival", note: "Arrived after assembly on two mornings.", status: "Open" },
        ],
      },
      {
        id: "shah", name: "Mr. Shah", role: "Class teacher", subject: "Science", grades: "Grade 2, Grade 5",
        email: "shah@eduos.school", phone: "0722 118 904", staffId: "TR-021", room: "Lab",
        fullName: "Amir Shah", gender: "Male", dob: "2 Jul 1988", nationality: "Kenyan", idNo: "27611084",
        address: "Flat 4, Parklands, Nairobi", joined: "6 May 2016", qualification: "B.Sc Science Education, University of Nairobi",
        tsc: "TSC/441880", contract: "Permanent", department: "Science",
        kin: "Amina Shah", kinRelation: "Spouse", kinPhone: "0722 900 114", blood: "A+",
        emergency: "Aga Khan University Hospital · 0711 000 110",
        documents: [["National ID", "On file"], ["Teaching certificate", "On file"], ["TSC letter", "On file"], ["Contract", "On file"]],
        inTime: "06:58", outTime: "",
        week: [
          { day: "Mon", in: "06:55", out: "16:30" },
          { day: "Tue", in: "07:02", out: "16:28" },
          { day: "Wed", in: "06:50", out: "16:15" },
          { day: "Thu", in: "06:59", out: "16:40" },
          { day: "Fri", in: "07:01", out: "16:12" },
        ],
        discipline: [],
      },
      {
        id: "nguyen", name: "Dr. Nguyen", role: "Head of humanities", subject: "Social Studies", grades: "Grade 6",
        email: "nguyen@eduos.school", phone: "0733 220 441", staffId: "TR-008", room: "Room 6",
        fullName: "Linh Nguyen", gender: "Female", dob: "19 Nov 1984", nationality: "Kenyan", idNo: "25190877",
        address: "Lavington Green, Nairobi", joined: "11 Jan 2014", qualification: "PhD Education, Moi University",
        tsc: "TSC/330221", contract: "Permanent", department: "Humanities",
        kin: "David Nguyen", kinRelation: "Brother", kinPhone: "0733 100 552", blood: "B+",
        emergency: "MP Shah Hospital · 0722 000 330",
        documents: [["National ID", "On file"], ["Teaching certificate", "On file"], ["TSC letter", "On file"], ["Contract", "On file"]],
        inTime: "", outTime: "",
        week: [
          { day: "Mon", in: "07:10", out: "16:18" },
          { day: "Tue", in: "07:06", out: "16:00" },
          { day: "Wed", in: "07:22", out: "16:25" },
          { day: "Thu", in: "07:04", out: "16:08" },
          { day: "Fri", in: "07:12", out: "15:50" },
        ],
        discipline: [
          { id: "d2", date: "Aug 04, 2026", kind: "Lesson plan", note: "Scheme of work submitted a week late.", status: "Closed" },
        ],
      },
      {
        id: "brooks", name: "Ms. Brooks", role: "Class teacher", subject: "English", grades: "Grade 3",
        email: "brooks@eduos.school", phone: "0701 556 230", staffId: "TR-033", room: "Room 2",
        fullName: "Hannah Brooks", gender: "Female", dob: "9 Apr 1995", nationality: "Kenyan", idNo: "33421009",
        address: "South B, Nairobi", joined: "4 Jan 2022", qualification: "B.Ed English, Mount Kenya University",
        tsc: "TSC/610442", contract: "Fixed term", department: "English",
        kin: "Ruth Brooks", kinRelation: "Mother", kinPhone: "0701 220 118", blood: "AB+",
        emergency: "Mater Hospital · 0719 000 440",
        documents: [["National ID", "On file"], ["Teaching certificate", "On file"], ["TSC letter", "Waiting"], ["Contract", "On file"]],
        inTime: "07:05", outTime: "15:40",
        week: [
          { day: "Mon", in: "07:00", out: "16:10" },
          { day: "Tue", in: "07:18", out: "16:05" },
          { day: "Wed", in: "07:09", out: "15:42" },
          { day: "Thu", in: "07:03", out: "16:00" },
          { day: "Fri", in: "07:14", out: "16:08" },
        ],
        discipline: [
          { id: "d3", date: "Oct 08, 2026", kind: "Missed duty", note: "Left before the afternoon gate duty.", status: "Open" },
        ],
      },
      {
        id: "okello", name: "Mr. Okello", role: "Class teacher", subject: "Kiswahili", grades: "Grade 1",
        email: "okello@eduos.school", phone: "0740 882 117", staffId: "TR-041", room: "Room 1",
        fullName: "Peter Okello", gender: "Male", dob: "27 Aug 1990", nationality: "Kenyan", idNo: "28900341",
        address: "Kasarani, Nairobi", joined: "13 Jan 2020", qualification: "Diploma in Education, Kenya Technical",
        tsc: "TSC/498220", contract: "Permanent", department: "Languages",
        kin: "Mercy Okello", kinRelation: "Spouse", kinPhone: "0740 111 903", blood: "O-",
        emergency: "Kenyatta National Hospital · 0720 000 550",
        documents: [["National ID", "On file"], ["Teaching certificate", "On file"], ["TSC letter", "On file"], ["Contract", "On file"]],
        inTime: "07:22", outTime: "",
        week: [
          { day: "Mon", in: "07:20", out: "16:02" },
          { day: "Tue", in: "07:28", out: "16:11" },
          { day: "Wed", in: "07:16", out: "16:00" },
          { day: "Thu", in: "07:25", out: "16:06" },
          { day: "Fri", in: "07:19", out: "15:58" },
        ],
        discipline: [
          { id: "d4", date: "Oct 02, 2026", kind: "Lesson plan", note: "Friday lesson notes were not filed.", status: "Monitoring" },
        ],
      },
      {
        id: "wanjiru", name: "Ms. Wanjiru", role: "Class teacher", subject: "CRE & Art", grades: "Grade 5",
        email: "wanjiru@eduos.school", phone: "0711 903 662", staffId: "TR-027", room: "Art room",
        fullName: "Grace Wanjiru", gender: "Female", dob: "3 Dec 1993", nationality: "Kenyan", idNo: "31277450",
        address: "Ruaka, Kiambu", joined: "7 Jan 2021", qualification: "B.Ed CRE, Catholic University of Eastern Africa",
        tsc: "TSC/577331", contract: "Permanent", department: "Creative arts",
        kin: "Ann Wanjiru", kinRelation: "Sister", kinPhone: "0711 440 908", blood: "A-",
        emergency: "Gertrude's Children's Hospital · 0730 000 660",
        documents: [["National ID", "On file"], ["Teaching certificate", "On file"], ["TSC letter", "On file"], ["Contract", "On file"]],
        inTime: "06:50", outTime: "16:30",
        week: [
          { day: "Mon", in: "06:48", out: "16:20" },
          { day: "Tue", in: "06:55", out: "16:18" },
          { day: "Wed", in: "06:46", out: "16:25" },
          { day: "Thu", in: "06:52", out: "16:15" },
          { day: "Fri", in: "06:58", out: "16:10" },
        ],
        discipline: [],
      },
    ],
    duties: [
      { id: "du1", className: "Baby", grade: "Baby", subject: "Number work", room: "Room 4", when: "Period 2", periods: 6, teacherId: "alvarez" },
      { id: "du2", className: "Top", grade: "Top", subject: "Mathematics", room: "Room 4", when: "Period 1", periods: 8, teacherId: "alvarez" },
      { id: "du3", className: "Grade 4", grade: "Grade 4", subject: "Mathematics", room: "Room 4", when: "Period 4", periods: 8, teacherId: "alvarez" },
      { id: "du4", className: "Grade 1", grade: "Grade 1", subject: "Kiswahili", room: "Room 1", when: "Period 2", periods: 6, teacherId: "okello" },
      { id: "du5", className: "Grade 2", grade: "Grade 2", subject: "Science", room: "Lab", when: "Period 3", periods: 6, teacherId: "shah" },
      { id: "du6", className: "Grade 8", grade: "Grade 8", subject: "Integrated Science", room: "Lab 1", when: "Period 5", periods: 8, teacherId: "shah" },
      { id: "du7", className: "Grade 3", grade: "Grade 3", subject: "English", room: "Room 2", when: "Period 2", periods: 6, teacherId: "brooks" },
      { id: "du8", className: "Grade 5", grade: "Grade 5", subject: "CRE & Art", room: "Art room", when: "Period 5", periods: 5, teacherId: "wanjiru" },
      { id: "du9", className: "Grade 6", grade: "Grade 6", subject: "Social Studies", room: "Room 6", when: "Period 5", periods: 5, teacherId: "nguyen" },
      { id: "du10", className: "Form 2", grade: "Form 2", subject: "Mathematics", room: "Room 8", when: "Period 3", periods: 6, teacherId: "nguyen" },
      { id: "du11", className: "Gate duty", grade: "Grade 4", subject: "Duty", room: "Front gate", when: "Afternoon", periods: 2, teacherId: "alvarez" },
      { id: "du12", className: "Science club", grade: "Grade 2", subject: "Club", room: "Lab", when: "Clubs", periods: 2, teacherId: "shah" },
    ],
    classes: [
      { period: "1", course: "Mathematics", teacher: "Ms. Alvarez", room: "4" },
      { period: "2", course: "Science", teacher: "Mr. Shah", room: "Lab" },
      { period: "3", course: "Social Studies", teacher: "Dr. Nguyen", room: "6" },
      { period: "4", course: "English", teacher: "Ms. Brooks", room: "2" },
    ],
    policies: [
      { id: "p1", title: "Attendance and tardy policy", body: "Students must be in the classroom when the bell rings. Five unexcused absences in a term trigger a parent conference." },
      { id: "p2", title: "Academic integrity", body: "Submitted work must be the student's own. Shared exams, copied essays, and undisclosed AI use are referred to the academic board." },
      { id: "p3", title: "Visitor and parent access", body: "Parents check in at the main office. Classroom visits need 24 hours notice through the parent portal." },
    ],
    acked: {},
    files: [
      { name: "Chen_Liam_transcript.pdf", size: "240 KB" },
      { name: "Brooks_Ethan_report_Q1.pdf", size: "180 KB" },
    ],
    chat: [
      { role: "assistant", text: "I can look across enrollment, attendance, and grades at Little Royals. Ask about at-risk pupils, Grade 4 Mathematics, or this week's attendance." },
    ],
    requestId: "",
    inboxTab: "inbox",
    reportTab: "overview",
    inboxId: "academics",
    threads: [
      { id: "academics", dept: "Academics", from: "Ms. Alvarez", unread: true, messages: [
        { who: "Ms. Alvarez", mine: false, text: "14 pupils in Grade 4 Mathematics are below the midterm line. Can we add a Tuesday intervention block?", time: "Today, 8:10" },
        { who: "Ms. Alvarez", mine: false, text: "Ava Patel and Owen Clarke also missed class this week.", time: "Today, 8:12" },
      ] },
      { id: "admissions", dept: "Admissions", from: "Front office", unread: true, messages: [
        { who: "Front office", mine: false, text: "Sophia Martinez is booked for a Thursday interview. Her parents asked whether Grade 4 still has a place.", time: "Today, 7:48" },
      ] },
      { id: "finance", dept: "Finance", from: "Ms. Wanjiru", unread: true, messages: [
        { who: "Ms. Wanjiru", mine: false, text: "Six kindergarten fee receipts are waiting to be checked before Friday.", time: "Today, 7:40" },
      ] },
      { id: "operations", dept: "Operations", from: "Mr. Okello", unread: false, messages: [
        { who: "Mr. Okello", mine: false, text: "The hall is free on Friday afternoon if prize-giving rehearsal needs it.", time: "Yesterday, 16:20" },
        { who: "Grace Achieng", mine: true, text: "Hold the hall. I will confirm after assembly.", time: "Yesterday, 16:35" },
      ] },
      { id: "care", dept: "Student Care", from: "School nurse", unread: true, messages: [
        { who: "School nurse", mine: false, text: "Ava Patel’s inhaler is in the office. Owen Clarke was checked on 8 Oct after another cold.", time: "Today, 9:05" },
      ] },
      { id: "community", dept: "Community", from: "Parent office", unread: false, messages: [
        { who: "Parent office", mine: false, text: "Coffee morning on 9 Oct needs a teacher at the hall door from 8:00.", time: "Mon, 11:15" },
      ] },
    ],
    requests: [
      { id: "r1", dept: "People", from: "Ms. Brooks", when: "Yesterday, 15:10", title: "Friday off", detail: "Ms. Brooks requested Friday off.", story: "Friday 16 Oct is a clinic morning. Grade 3 English needs cover, and the afternoon gate duty is open if she is still out.", status: "Pending", origin: "people-leave-leave-requests", originLabel: "Leave Requests" },
      { id: "r2", dept: "Academics", from: "Ms. Alvarez", when: "Today, 8:12", title: "Tuesday intervention", detail: "Ms. Alvarez wants a Grade 4 Mathematics catch-up block.", story: "14 pupils are below the midterm line. She asked for a Tuesday block in Room 4 before the 18 Oct exam.", status: "Pending", origin: "academics-progress-interventions", originLabel: "Interventions" },
      { id: "r3", dept: "Finance", from: "Ms. Wanjiru", when: "Today, 7:40", title: "Receipt batch", detail: "Six kindergarten receipts need a bursar check.", story: "Six kindergarten fee receipts were recorded this morning and are waiting for the bursar to confirm the amounts.", status: "Pending", origin: "finance-payments-receipts", originLabel: "Receipts" },
      { id: "r4", dept: "Operations", from: "Mr. Okello", when: "Yesterday, 16:20", title: "Hall booking", detail: "Prize rehearsal in the hall on Friday afternoon.", story: "The hall is free Friday after lunch. Prize-giving rehearsal would run from 14:00 if this booking is approved.", status: "Pending", origin: "operations-facilities-facility-bookings", originLabel: "Facility Bookings" },
      { id: "r5", dept: "Student Care", from: "School nurse", when: "Today, 9:20", title: "Museum trip", detail: "Grade 2 trip to Nairobi Museum on 17 Oct.", story: "Grade 2 leaves at 08:15 on 17 Oct. Two pupils have clinic notes that the nurse wants the trip lead to carry.", status: "Pending", origin: "community-events-field-trips", originLabel: "Field Trips" },
    ],
    logoAudit: [
      { id: "la0", when: "31 Aug 2026", who: "Front office", name: "Little Royals", tagline: "Kindergarten & Primary School", logo: "logo.png", note: "Original crest" },
    ],
  };

  let menuAnchor = null;
  let toastTimer = null;

  const primaryBtn = "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg";
  const ghostBtn = "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg";

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function paintNotice() {
    const badge = document.getElementById("notice-count");
    if (!badge) return;
    const unread = state.notices.filter(function (item) { return !item.read; }).length;
    badge.textContent = String(unread);
    badge.classList.toggle("hidden", unread === 0);
    const button = document.getElementById("header-notifications");
    if (button) button.setAttribute("aria-label", unread ? "Notifications, " + unread + " new" : "Notifications");
  }

  function closeNotices() {
    const panel = document.getElementById("notice-panel");
    const button = document.getElementById("header-notifications");
    if (panel) panel.classList.add("hidden");
    if (button) button.setAttribute("aria-expanded", "false");
  }

  function paintNotices() {
    const panel = document.getElementById("notice-panel");
    if (!panel) return;
    const unread = state.notices.filter(function (item) { return !item.read; }).length;
    const rows = state.notices.map(function (item) {
      return '<button type="button" data-action="read-notice" data-id="' + esc(item.id) + '" class="flex w-full gap-3 px-3 py-2.5 text-left hover:bg-slate-50 ' + (item.read ? "opacity-60" : "") + '">' +
        '<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full ' + (item.read ? "bg-slate-200" : "bg-rose-500") + '"></span>' +
        '<span class="min-w-0"><span class="block text-xs font-semibold text-slate-900">' + esc(item.title) + "</span>" +
        '<span class="mt-0.5 block text-xs leading-snug text-slate-500">' + esc(item.body) + "</span>" +
        '<span class="mt-1 block text-[10px] text-slate-400">' + esc(item.time) + (item.read ? " · Read" : " · New") + "</span></span></button>";
    }).join("") || '<p class="px-3 py-8 text-center text-xs text-slate-400">No notifications yet.</p>';
    panel.innerHTML = '<div class="flex items-center justify-between gap-3 border-b border-slate-100 px-3 py-2.5">' +
      '<p class="text-xs font-semibold text-slate-900">Notifications' + (unread ? " · " + unread + " new" : "") + "</p>" +
      (unread ? '<button type="button" data-action="read-all" class="text-[11px] font-semibold text-slate-700 hover:text-slate-900">Mark all read</button>' : '<span class="text-[11px] text-slate-400">All read</span>') +
      '</div><div class="max-h-80 overflow-y-auto divide-y divide-slate-100">' + rows + "</div>";
  }

  function openNotices() {
    const panel = document.getElementById("notice-panel");
    const button = document.getElementById("header-notifications");
    if (!panel || !button) return;
    if (!panel.classList.contains("hidden")) {
      closeNotices();
      return;
    }
    closeMenu();
    paintNotices();
    panel.classList.remove("hidden");
    button.setAttribute("aria-expanded", "true");
    const rect = button.getBoundingClientRect();
    const width = panel.offsetWidth || 320;
    let left = rect.right - width;
    if (left < 8) left = 8;
    if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8;
    panel.style.top = (rect.bottom + 8) + "px";
    panel.style.left = left + "px";
  }

  function logAudit(action, target) {
    state.audits.unshift({ id: "a" + Date.now(), who: state.me.name, action: action, target: target, when: "Just now" });
  }

  function toast(message) {
    const el = document.getElementById("toast");
    el.textContent = message;
    el.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.add("hidden"); }, 2400);
  }

  function csvCell(value) {
    const text = String(value == null ? "" : value);
    if (/[",\n]/.test(text)) return '"' + text.replace(/"/g, '""') + '"';
    return text;
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let quote = false;
    const src = String(text || "").replace(/^\uFEFF/, "");
    for (let i = 0; i < src.length; i++) {
      const ch = src.charAt(i);
      if (quote) {
        if (ch === '"') {
          if (src.charAt(i + 1) === '"') { cell += '"'; i += 1; }
          else quote = false;
        } else cell += ch;
      } else if (ch === '"') quote = true;
      else if (ch === ",") { row.push(cell.trim()); cell = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && src.charAt(i + 1) === "\n") i += 1;
        row.push(cell.trim());
        if (row.some(function (part) { return part; })) rows.push(row);
        row = [];
        cell = "";
      } else cell += ch;
    }
    if (cell || row.length) {
      row.push(cell.trim());
      if (row.some(function (part) { return part; })) rows.push(row);
    }
    return rows;
  }

  function pickCsv(done) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,text/csv";
    input.addEventListener("change", function () {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function () { done(parseCsv(String(reader.result || "")), file.name); };
      reader.readAsText(file);
    });
    input.click();
  }

  function download(filename, text) {
    const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function closeMenu() {
    document.getElementById("menu-root").classList.add("hidden");
    menuAnchor = null;
  }

  function openMenu(anchor, items) {
    closeNotices();
    const menu = document.getElementById("menu-root");
    menu.innerHTML = items.map(function (item, index) {
      return '<button type="button" data-menu-index="' + index + '" class="block w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50">' + esc(item.label) + "</button>";
    }).join("");
    menu.classList.remove("hidden");
    menuAnchor = anchor;
    const rect = anchor.getBoundingClientRect();
    const width = menu.offsetWidth;
    let left = rect.right - width;
    if (left < 8) left = Math.min(rect.left, window.innerWidth - width - 8);
    const top = Math.min(rect.bottom + 6, window.innerHeight - menu.offsetHeight - 8);
    menu.style.top = Math.max(8, top) + "px";
    menu.style.left = Math.max(8, left) + "px";
    menu.onclick = function (event) {
      const button = event.target.closest("[data-menu-index]");
      if (!button) return;
      items[Number(button.dataset.menuIndex)].run();
      closeMenu();
    };
  }

  function closeModal() {
    const root = document.getElementById("modal-root");
    root.classList.add("hidden");
    root.classList.remove("flex");
  }

  function openModal(title, body, actions) {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").innerHTML = body;
    const wrap = document.getElementById("modal-actions");
    wrap.innerHTML = "";
    actions.forEach(function (action) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = action.primary ? primaryBtn : ghostBtn;
      button.textContent = action.label;
      button.addEventListener("click", function () {
        action.run();
        if (action.close !== false) closeModal();
      });
      wrap.appendChild(button);
    });
    const root = document.getElementById("modal-root");
    root.classList.remove("hidden");
    root.classList.add("flex");
  }

  function setCollapsed(collapsed) {
    document.documentElement.classList.toggle("sidebar-collapsed", collapsed);
    try { localStorage.setItem("eduos-sidebar-collapsed", collapsed ? "1" : "0"); } catch (e) {}
    state.settings.compact = collapsed;
    const toggle = document.getElementById("sidebar-toggle");
    toggle.setAttribute("aria-expanded", String(!collapsed));
    toggle.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
    const compact = document.getElementById("setting-compact");
    if (compact) compact.checked = collapsed;
  }

  function resolvedPage(id) {
    const nav = window.LarcelNav;
    if (nav && nav.alias[id] && nav.byId[nav.alias[id]]) return nav.alias[id];
    return id;
  }

  function syncNav(id) {
    document.querySelectorAll("#sidebar nav a:not([data-app]):not(.module-link)").forEach(function (link) {
      const on = link.dataset.page === id;
      link.classList.remove("nav-on", "bg-slate-100", "text-slate-900", "text-white", "font-semibold", "shadow-sm", "text-slate-600");
      if (on) link.classList.add("nav-on", "font-semibold", "shadow-sm");
      else link.classList.add("text-slate-600");
      const icon = link.querySelector(".nav-icon");
      if (icon) {
        icon.classList.toggle("text-white", on);
        icon.classList.toggle("text-slate-900", false);
        icon.classList.toggle("text-slate-400", !on);
      }
    });
    const meta = window.LarcelNav && window.LarcelNav.byId[id];
    const appId = meta && meta.appId ? meta.appId : "";
    document.querySelectorAll("#sidebar [data-app]").forEach(function (link) {
      const on = link.dataset.app === appId;
      link.classList.remove("nav-on", "bg-slate-100", "text-slate-900", "text-white", "font-semibold", "shadow-sm", "text-slate-600");
      if (on) link.classList.add("nav-on", "font-semibold", "shadow-sm");
      else link.classList.add("text-slate-600");
      const icon = link.querySelector(".nav-icon");
      if (icon) {
        icon.classList.toggle("text-white", on);
        icon.classList.toggle("text-slate-900", false);
        icon.classList.toggle("text-slate-400", !on);
      }
    });
    const moduleKey = meta && meta.appId ? meta.appId + "-" + meta.moduleId : "";
    document.querySelectorAll("#sidebar a.module-link").forEach(function (link) {
      const on = link.dataset.module === moduleKey;
      link.classList.toggle("nav-module-on", on);
      link.classList.toggle("bg-slate-100", on);
      link.classList.toggle("font-semibold", on);
      link.classList.toggle("text-slate-900", on);
      link.classList.toggle("font-medium", !on);
      link.classList.toggle("text-slate-500", !on);
    });
  }

  const BOOKS = {};
  const FORM_VIEWS = { copilot: true, feedback: true, help: true, settings: true, reports: true, reportcards: true, faculty: true, timeclock: true, timeweek: true, hrdiscipline: true, hrhistory: true, teacherprofile: true, notifications: true, profile: true, users: true, audit: true, schoolcalendar: true, eventscalendar: true, schooltime: true, teachermap: true, student360: true, studyplans: true, exams: true, inbox: true, branding: true, logoaudit: true, versions: true, benchmarks: true, workload: true };
  const PUPILS = ["Liam Chen", "Ava Patel", "Noah Al-Mansoor", "Mia Okonkwo", "Ethan Brooks", "Hannah Kim", "Owen Clarke", "Sophia Martinez", "Lucas Ferreira", "Amara Diallo"];
  const TEACHERS = ["Ms. Alvarez", "Mr. Shah", "Dr. Nguyen", "Ms. Brooks", "Mr. Okello", "Ms. Wanjiru", "Ms. Achieng", "Mr. Otieno"];
  const LEVEL_GRADES = {
    nursery: ["Nursery", "Baby", "Top"],
    primary: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
    olevel: ["Form 1", "Form 2", "Form 3", "Form 4"],
    alevel: ["Form 5", "Form 6"],
  };
  const LEVEL_KEYS = ["nursery", "primary", "olevel", "alevel"];
  const GRADES = LEVEL_GRADES.nursery.concat(LEVEL_GRADES.primary);
  const GRADE_ALIAS = { Playgroup: "Nursery", PP1: "Nursery", PP2: "Nursery", Kindergarten: "Nursery", "Grade 7": "O-level", "Grade 8": "O-level", "Grade 9": "O-level" };
  function activeGrades() {
    return LEVEL_KEYS.reduce(function (list, key) {
      return state.settings.levels[key] ? list.concat(LEVEL_GRADES[key]) : list;
    }, []);
  }
  function levelForGrade(grade) {
    if (GRADE_ALIAS[grade]) return GRADE_ALIAS[grade];
    if (LEVEL_GRADES.nursery.indexOf(grade) !== -1) return "Nursery";
    if (LEVEL_GRADES.olevel.indexOf(grade) !== -1) return "O-level";
    if (LEVEL_GRADES.alevel.indexOf(grade) !== -1) return "A-level";
    return "Primary";
  }
  function levelOn(level) {
    const levels = state.settings.levels;
    if (level === "Nursery") return !!levels.nursery;
    if (level === "O-level" || level === "Secondary" || level === "Junior") return !!levels.olevel;
    if (level === "A-level") return !!levels.alevel;
    return !!levels.primary;
  }
  function schoolLevelLabel() {
    const levels = state.settings.levels;
    const on = [];
    if (levels.nursery) on.push("Nursery");
    if (levels.primary) on.push("Primary");
    if (levels.olevel) on.push("O-level");
    if (levels.alevel) on.push("A-level");
    if (!on.length) return "School";
    if (on.length === 4) return "All levels";
    return on.join(" & ");
  }
  function paintSchoolLevel() {
    const el = document.getElementById("school-level");
    if (el) el.textContent = schoolLevelLabel();
  }

  const PRODUCT = { version: "3.0.0" };
  const BRAND_KEY = "littleroyals-brand";
  const VERSION_KEY = "littleroyals-versions";
  const BENCH_KEY = "littleroyals-benchmarks";
  const BAND = { EE: 4, ME: 3, AE: 2, BE: 1, A: 5, "A-": 4, "B+": 4, B: 3, "B-": 3, "C+": 2, C: 2, D: 1 };
  const RELEASES = [
    { version: "3.0.0", date: "11 Oct 2026", notes: "Benchmarks for nursery, primary, junior, and senior. Change the school logo. Edits keep a version you can restore." },
    { version: "2.6.0", date: "4 Oct 2026", notes: "Offline working, teacher time clock, and whole-school reports." },
    { version: "2.4.0", date: "18 Sep 2026", notes: "Admissions, exams, study plans, and the parent portal." },
  ];
  const BENCH_SEED = [
    { id: "b1", level: "Nursery", area: "Language", strand: "Listening and speaking", cohort: "Baby", target: "ME", result: "ME" },
    { id: "b2", level: "Nursery", area: "Mathematics", strand: "Number sense", cohort: "Top", target: "ME", result: "AE" },
    { id: "b3", level: "Primary", area: "Mathematics", strand: "Number", cohort: "Grade 4", target: "ME", result: "AE" },
    { id: "b4", level: "Primary", area: "English", strand: "Reading", cohort: "Grade 2", target: "ME", result: "ME" },
    { id: "b5", level: "Primary", area: "Kiswahili", strand: "Kusoma", cohort: "Grade 3", target: "ME", result: "EE" },
    { id: "b6", level: "Junior", area: "Integrated Science", strand: "Mixtures", cohort: "Grade 8", target: "ME", result: "ME" },
    { id: "b7", level: "Junior", area: "Mathematics", strand: "Algebra", cohort: "Grade 7", target: "ME", result: "AE" },
    { id: "b8", level: "Junior", area: "Social Studies", strand: "Citizenship", cohort: "Grade 9", target: "ME", result: "EE" },
    { id: "b9", level: "O-level", area: "Mathematics", strand: "Algebra", cohort: "Form 2", target: "C+", result: "B-" },
    { id: "b10", level: "O-level", area: "English", strand: "Composition", cohort: "Form 4", target: "B", result: "C+" },
    { id: "b11", level: "O-level", area: "Biology", strand: "Cells", cohort: "Form 3", target: "C+", result: "B" },
    { id: "b12", level: "A-level", area: "Mathematics", strand: "Calculus", cohort: "Form 6", target: "B", result: "C+" },
  ];

  function loadBrand() {
    try {
      const saved = JSON.parse(localStorage.getItem(BRAND_KEY) || "null");
      if (saved && saved.name) {
        saved.history = saved.history || [];
        saved.logo = saved.logo || "logo.png";
        saved.tagline = saved.tagline || "School";
        return saved;
      }
    } catch (e) {}
    return { name: "Little Royals", tagline: "Kindergarten & Primary School", logo: "logo.png", history: [] };
  }

  function saveBrand() {
    const payload = { name: state.brand.name, tagline: state.brand.tagline, logo: state.brand.logo, history: state.brand.history };
    try {
      localStorage.setItem(BRAND_KEY, JSON.stringify(payload));
    } catch (e) {
      state.brand.history = state.brand.history.slice(0, 2).map(function (item) {
        return { id: item.id, when: item.when, who: item.who, name: item.name, tagline: item.tagline, logo: "logo.png", note: item.note };
      });
      try { localStorage.setItem(BRAND_KEY, JSON.stringify({ name: state.brand.name, tagline: state.brand.tagline, logo: "logo.png", history: state.brand.history })); } catch (err) {}
      toast("That logo is too large to keep. A smaller image will save.");
    }
  }

  function applyBrand() {
    const brand = state.brand;
    if (!brand) return;
    document.querySelectorAll("[data-brand-logo]").forEach(function (img) { img.src = brand.logo || "logo.png"; });
    document.querySelectorAll("[data-brand-name]").forEach(function (el) { el.textContent = brand.name; });
    const favicon = document.getElementById("favicon");
    if (favicon) favicon.href = brand.logo || "logo.png";
    document.title = brand.name + " · " + brand.tagline;
    const version = document.getElementById("product-version");
    if (version) version.textContent = PRODUCT.version;
    const chip = document.getElementById("product-version-chip");
    if (chip) chip.textContent = "v" + PRODUCT.version;
  }

  function loadVersions() {
    try {
      const saved = JSON.parse(localStorage.getItem(VERSION_KEY) || "null");
      if (Array.isArray(saved)) return saved;
    } catch (e) {}
    return [];
  }

  function saveVersions() {
    try { localStorage.setItem(VERSION_KEY, JSON.stringify(state.versions.slice(0, 60))); } catch (e) {}
  }

  function pushVersion(entry) {
    entry.id = entry.id || ("v" + Date.now());
    state.versions.unshift(entry);
    if (state.versions.length > 60) state.versions.length = 60;
    saveVersions();
  }

  function loadBenchmarks() {
    try {
      const saved = JSON.parse(localStorage.getItem(BENCH_KEY) || "null");
      if (Array.isArray(saved) && saved.length) {
        const ids = {};
        saved.forEach(function (item) { ids[item.id] = true; });
        BENCH_SEED.forEach(function (item) {
          if (!ids[item.id]) saved.push(Object.assign({}, item));
        });
        return saved;
      }
    } catch (e) {}
    return BENCH_SEED.map(function (item) { return Object.assign({}, item); });
  }

  function saveBenchmarks() {
    try { localStorage.setItem(BENCH_KEY, JSON.stringify(state.benchmarks)); } catch (e) {}
  }

  state.brand = loadBrand();
  state.versions = loadVersions();
  state.benchmarks = loadBenchmarks();
  (function applySavedSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem("littleroyals-settings") || "null");
      if (!saved || !saved.levels) return;
      state.settings.alerts = saved.alerts !== false;
      state.settings.digest = !!saved.digest;
      state.settings.compact = !!saved.compact;
      state.settings.levels = {
        nursery: saved.levels.nursery !== false,
        primary: saved.levels.primary !== false,
        olevel: saved.levels.olevel === true,
        alevel: saved.levels.alevel === true,
      };
    } catch (e) {}
  })();

  function saveSettings() {
    try {
      localStorage.setItem("littleroyals-settings", JSON.stringify({
        alerts: state.settings.alerts,
        digest: state.settings.digest,
        compact: state.settings.compact,
        levels: state.settings.levels,
      }));
    } catch (e) {}
  }

  function meetsBench(target, result) {
    return (BAND[result] || 0) >= (BAND[target] || 99);
  }

  function schoolInitials(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "SC";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function markSvg(color, letters) {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="' + color + '"/><text x="32" y="42" text-anchor="middle" font-size="22" font-family="sans-serif" fill="white" font-weight="700">' + letters + "</text></svg>";
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  function commitBrand(next, note) {
    state.brand.history.unshift({
      id: "b" + Date.now(),
      when: "Just now",
      who: state.me.name,
      name: state.brand.name,
      tagline: state.brand.tagline,
      logo: state.brand.logo,
      note: note || "Previous brand",
    });
    if (state.brand.history.length > 8) state.brand.history.length = 8;
    state.brand.name = (next.name || state.brand.name).trim();
    state.brand.tagline = (next.tagline || state.brand.tagline).trim();
    state.brand.logo = next.logo || state.brand.logo;
    saveBrand();
    applyBrand();
    pushVersion({ kind: "brand", brandId: state.brand.history[0] && state.brand.history[0].id, label: state.brand.name, when: "Just now", who: state.me.name, note: note || "Brand updated" });
    state.logoAudit.unshift({ id: "la" + Date.now(), when: "Just now", who: state.me.name, name: state.brand.name, tagline: state.brand.tagline, logo: state.brand.logo, note: note || "Brand updated" });
    if (state.logoAudit.length > 12) state.logoAudit.length = 12;
    logAudit("Updated school brand", state.brand.name);
  }

  function visibleBenchmarks() {
    return state.benchmarks.filter(function (item) {
      if (!levelOn(item.level)) return false;
      return !state.benchmarkLevel || state.benchmarkLevel === "all" || item.level === state.benchmarkLevel;
    });
  }

  function openRecordVersions(row) {
    const list = state.versions.filter(function (item) { return item.kind === "record" && item.recordId === row.id; });
    const html = list.length
      ? '<ul class="text-xs divide-y divide-slate-100">' + list.map(function (item) {
        const snap = item.snap || {};
        return '<li class="flex items-center justify-between gap-3 py-2"><span><strong class="text-slate-900">' + esc(snap.a || item.label) + '</strong><span class="block text-slate-500">' + esc(snap.b || "") + " · " + esc(snap.status || "") + " · " + esc(item.when) + " · " + esc(item.who) + '</span></span><button type="button" data-action="restore-version" data-id="' + esc(item.id) + '" class="' + ghostBtn + '">Restore</button></li>';
      }).join("") + "</ul>"
      : "<p>No earlier versions yet. The next edit is kept here.</p>";
    openModal("Versions · " + row.a, html, [{ label: "Close", primary: true, run: function () {} }]);
  }

  function restoreVersion(id) {
    const entry = state.versions.filter(function (item) { return item.id === id; })[0];
    if (!entry || !entry.snap) { toast("That version is no longer available"); return; }
    const meta = window.LarcelNav && window.LarcelNav.byId[entry.page];
    const data = meta && ensureBook(meta);
    const row = data && data.rows.filter(function (item) { return item.id === entry.recordId; })[0];
    if (!row) { toast("That record is no longer on the page"); return; }
    const before = { a: row.a, b: row.b, c: row.c, status: row.status };
    row.a = entry.snap.a;
    row.b = entry.snap.b;
    row.c = entry.snap.c;
    row.status = entry.snap.status;
    pushVersion({ kind: "record", page: entry.page, recordId: row.id, label: row.a, when: "Just now", who: state.me.name, note: "Restored", before: before, snap: { a: row.a, b: row.b, c: row.c, status: row.status } });
    noteChange(data);
    closeModal();
    show(state.page);
    toast("Restored " + row.a);
  }

  function restoreBrand(id) {
    const item = state.brand.history.filter(function (row) { return row.id === id; })[0];
    if (!item) { toast("That logo version is gone"); return; }
    commitBrand({ name: item.name, tagline: item.tagline, logo: item.logo }, "Restored " + item.name);
    closeModal();
    show(state.page);
    toast("Restored " + item.name);
  }
  function selectOptions(values) {
    return values.map(function (value) { return "<option>" + esc(value) + "</option>"; }).join("");
  }
  const SUBJECTS = ["Mathematics", "English", "Science", "Social Studies", "Reading", "Art", "Kiswahili", "CRE", "Integrated Science", "Biology"];
  const SCHEMES = {
    pupils: { cols: ["Pupil", "Class", "Teacher", "Status"], statuses: ["Active", "Watch", "Pending", "Left"], good: "Active", stats: ["Pupils", "Active", "Needs attention", "Classes"] },
    people: { cols: ["Name", "Role", "Department", "Status"], statuses: ["Active", "On leave", "Probation", "Inactive"], good: "Active", stats: ["Staff", "Active", "On leave", "Departments"] },
    attendance: { cols: ["Pupil", "Class", "Session", "Status"], statuses: ["Present", "Absent", "Late", "Excused"], good: "Present", stats: ["Marks", "Present", "Absent or late", "Classes"] },
    academic: { cols: ["Subject", "Class", "Teacher", "Status"], statuses: ["Published", "In review", "Draft", "Missing"], good: "Published", stats: ["Records", "Published", "Needs attention", "Classes"] },
    money: { cols: ["Account", "Class", "Amount", "Status"], statuses: ["Paid", "Partial", "Overdue", "Waived"], good: "Paid", stats: ["Accounts", "Paid", "Overdue", "Classes"] },
    payroll: { cols: ["Staff", "Role", "Net pay", "Status"], statuses: ["Paid", "Pending", "Held", "Reversed"], good: "Paid", stats: ["Staff", "Paid", "Pending", "Departments"] },
    records: { cols: ["Record", "Group", "Owner", "Status"], statuses: ["Open", "In review", "Pending", "Closed"], good: "Closed", stats: ["Records", "Closed", "Pending", "Groups"] },
  };

  function hashText(value) {
    let h = 2166136261;
    const text = String(value);
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function rng(seed) {
    let s = seed || 1;
    return function () {
      s = (Math.imul(1664525, s) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function pick(rand, list) {
    return list[Math.floor(rand() * list.length)];
  }

  function kindOf(meta) {
    const text = (meta.label + " " + meta.module).toLowerCase();
    if (/pay run|payslip|deduction|statutory|payroll|salary/.test(text)) return "payroll";
    if (/fee|payment|invoice|ledger|budget|expense|receipt|petty|reconcil|cash flow|balance sheet|income|arrear|discount|scholarship/.test(text)) return "money";
    if (/attend|absence|late arrival/.test(text)) return "attendance";
    if (/exam|grade|mark|result|report card|transcript|assessment|syllabus|curriculum|subject|lesson|scheme|learning outcome|timetable/.test(text)) return "academic";
    if (/staff|employee|teacher|recruit|leave|appraisal|contract|qualification/.test(text)) return "people";
    if (/student|pupil|admission|enrol|guardian|class|applicant|alumni|famil/.test(text)) return "pupils";
    return "records";
  }

  function toneFor(status) {
    const text = String(status).toLowerCase();
    if (/paid|present|active|published|excused|closed|waived/.test(text)) return "emerald";
    if (/overdue|absent|watch|missing|late|pending|probation|on leave/.test(text)) return "amber";
    return "slate";
  }

  function takeUnique(rand, list, used) {
    const open = list.filter(function (item) { return !used[item]; });
    const value = (open.length ? open : list)[Math.floor(rand() * (open.length ? open.length : list.length))];
    used[value] = true;
    return value;
  }

  function makeRow(meta, kind, scheme, rand, index, used) {
    const pupil = takeUnique(rand, PUPILS, used.pupils);
    const teacher = TEACHERS[index % TEACHERS.length];
    const gradeList = activeGrades().length ? activeGrades() : GRADES;
    const grade = gradeList[index % gradeList.length];
    const subject = takeUnique(rand, SUBJECTS, used.subjects);
    const status = scheme.statuses[index % scheme.statuses.length];
    let a = subject + " " + meta.label.toLowerCase();
    let b = grade;
    let c = teacher;
    if (kind === "pupils") { a = pupil; c = teacher; }
    else if (kind === "people") { a = teacher; b = subject; c = ["Academics", "Pastoral", "Administration", "Early Years"][index % 4]; }
    else if (kind === "attendance") { a = pupil; c = ["Morning", "Period 2", "Period 4", "Clubs"][index % 4]; }
    else if (kind === "academic") { a = subject; c = teacher; }
    else if (kind === "money") { a = pupil; c = "UGX " + (8000 + index * 1500).toLocaleString("en-UG"); }
    else if (kind === "payroll") {
      a = teacher;
      b = ["Class teacher", "Bursar", "Nurse", "Driver", "Cook", "Head teacher"][index % 6];
      c = "UGX " + (45000 + index * 3500).toLocaleString("en-UG");
    }
    return { id: meta.id + "-" + index, a: a, b: b, c: c, status: status };
  }

  const CANON = {
    "Enrollment & Re-enrollment": ["Accepted application", "Campus and intake", "Legal name", "Date of birth", "Class and stream", "Guardian", "Emergency contacts", "Documents", "Fee preview", "Consent"],
    "Guardians & Families": ["Full name", "Phone or email", "Relationship", "Identity status", "Address", "Emergency priority", "Authorized pickup", "Linked students"],
    "Family and Sibling Links": ["Family", "Students", "Relationship", "Primary guardian"],
    "Daily Attendance": ["Date", "Class and session", "Student", "Mark", "Reason", "Teacher notes"],
    "Attendance Corrections": ["Date", "Class", "Student", "Original mark", "Corrected mark", "Reason"],
    "Marks Entry": ["Assessment", "Class", "Subject", "Student", "Score", "Absent or exempt", "Teacher remarks"],
    "Assessment Configuration": ["Subject", "Class", "Term", "Assessment type", "Max marks", "Weighting", "Grading rule"],
    "Student Invoices": ["Student", "Billing period", "Fee items", "Discount", "Due date", "Currency", "Narration"],
    "Student Fee Assignment": ["Student", "Fee structure", "Period", "Amount"],
    "Record Payment": ["Payer", "Student", "Method", "Amount", "Reference", "Payment date", "Invoice", "Evidence"],
    "Payment Allocations": ["Receipt", "Invoice", "Amount", "Remainder"],
    "Cashier Closeout": ["Cashier", "Date", "Expected cash", "Counted cash", "Variance"],
    "Journal Entries": ["Accounting period", "Posting date", "Narration", "Debit lines", "Credit lines", "Cost center"],
    "Opening Balances": ["Account", "Period", "Debit", "Credit"],
    "Leave Requests": ["Employee", "Leave type", "Start date", "End date", "Reason", "Supporting file", "Delegation"],
    "Pay Runs": ["Period", "Employees", "Pay elements", "Allowances", "Deductions", "Bank batch"],
    "Pay Structures": ["Role", "Basic pay", "Allowances", "Deductions"],
    "Payroll Inputs": ["Period", "Employee", "Input", "Amount"],
    "Payroll Reconciliation": ["Period", "Payroll total", "Ledger total", "Difference"],
    "Purchase Requests": ["Department", "Items and quantities", "Required date", "Justification", "Budget code"],
    "Goods Received": ["Purchase order", "Delivered quantity", "Batch or serial", "Condition", "Receiver", "Delivery note"],
    "Clinic Visits": ["Student", "Visit time", "Concern", "Observations", "Care provided", "Guardian contact", "Referral"],
    "Medication Authorization": ["Student", "Medicine", "Dose", "Guardian consent", "Expiry"],
    "Safeguarding Cases": ["Case ID", "Reporting channel", "Category", "Safeguarding lead", "Follow-up", "Attachments"],
    "Restricted Care Reporting": ["Case", "Scope", "Reader", "Reason"],
    "Incident Reporting": ["Student or location", "Facts", "Urgency", "Response role"],
    "Emergency Response Log": ["Incident", "Action", "Time", "Owner"],
    "Announcements": ["Audience", "Campus or class", "Subject", "Body", "Channel", "Schedule"],
    "My Approvals": ["Object type", "Requester", "Approver group", "Reason", "Decision"],
    "Publishing": ["Course title", "Curriculum mapping", "Grade level", "Lessons", "Objectives", "Reviewer"],
    "Content Review": ["Course title", "Curriculum mapping", "Grade level", "Lessons", "Objectives", "Reviewer"],
    "School Profile": ["Legal name", "Registration", "Campus", "Contacts", "Address", "Branding", "Effective date"],
    "Campus Registry": ["Campus", "Address", "Head", "Capacity", "Status note"],
    "Academic Years & Terms": ["Year", "Terms", "Start", "End", "Lock state", "Promotion rules"],
    "Rollover Wizard": ["From year", "To year", "Promotion rule", "Exceptions", "Approver"],
    "Enquiries": ["Applicant", "Grade sought", "Guardian contact", "Source", "Follow-up"],
    "Applications": ["Applicant", "Grade", "Guardians", "Previous school", "Documents", "Consent"],
    "Document Verification": ["Applicant", "Document", "Check", "Reviewer", "Notes"],
    "Admission Decision": ["Applicant", "Decision", "Conditions", "Reviewer", "Date"],
    "Decisions": ["Applicant", "Decision", "Conditions", "Reviewer", "Date"],
    "Guardians": ["Full name", "Phone or email", "Relationship", "Identity status", "Address", "Emergency priority", "Authorized pickup", "Linked students"],
    "Timetable": ["Class", "Subject", "Teacher", "Room", "Weekday", "Start", "End"],
    "Corrections": ["Date", "Class", "Student", "Original mark", "Corrected mark", "Reason"],
    "Marks": ["Assessment", "Class", "Subject", "Student", "Score", "Absent or exempt", "Teacher remarks"],
    "Invoices": ["Student", "Billing period", "Fee items", "Discount", "Due date", "Currency", "Narration"],
    "Leave": ["Employee", "Leave type", "Start date", "End date", "Reason", "Supporting file", "Delegation"],
    "Meetings": ["Teacher", "Guardian", "Student", "Slot", "Place", "Reason"],
    "Visitors": ["Visitor", "Host", "Purpose", "Arrival"],
    "Late and Early": ["Student", "Time", "Direction", "Reason", "Collected by"],
    "Student Documents": ["Student", "Document", "On file", "Notes"],
    "Student ID Cards": ["Student", "Card number", "Class", "Issued"],
    "Promotion & Graduation": ["Student", "From class", "To class", "Decision", "Date"],
    "Class Allocation": ["Student", "Class", "Stream", "From"],
    "Absence Requests": ["Student", "From", "To", "Reason", "Guardian"],
    "Arrears": ["Student", "Invoice", "Balance", "Due"],
    "Direct Messages": ["From", "To", "Message", "Channel"],
    "Book Catalog": ["Title", "Author", "Barcode", "Copies"],
    "Overdue & Fines": ["Borrower", "Title", "Due", "Fine"],
    "Student Health Profiles": ["Student", "Blood group", "Allergies", "Conditions", "Emergency contact"],
    "Waitlist": ["Applicant", "Grade", "Position", "Ready from"],
    "Transfers": ["Student", "Effective date", "Reason", "Clearance", "Destination"],
    "Classes & Streams": ["Grade", "Stream", "Campus", "Capacity", "Homeroom teacher", "Year"],
    "Grades and Streams": ["Grade", "Stream", "Campus", "Capacity", "Homeroom teacher"],
    "Classrooms and Capacities": ["Room", "Capacity", "Grade", "Building"],
    "Lesson Plans": ["Class", "Subject", "Outcome", "Date", "Activities", "Resources"],
    "Class Timetables": ["Class", "Subject", "Teacher", "Room", "Weekday", "Start", "End"],
    "Conflict Resolution": ["Timetable", "Clash", "Classes involved", "Resolution"],
    "Result Publishing": ["Scope", "Moderation", "Publication date", "Guardian visibility", "Approver"],
    "Fee Structures": ["Period", "Grade", "Fee items", "Due dates", "Applicability"],
    "Discounts & Scholarships": ["Student", "Rule", "Amount", "Reason", "Evidence", "Approver"],
    "Refunds": ["Original payment", "Reason", "Amount", "Destination", "Evidence", "Approver"],
    "Bank Reconciliation": ["Bank account", "Statement period", "Matches", "Exceptions", "Sign-off"],
    "Budgets": ["Department", "Cost center", "Period", "Account", "Amount"],
    "Payment Approval": ["Supplier bill", "Amount", "Approver", "Reason"],
    "Payment Execution": ["Supplier bill", "Payee", "Amount", "Method", "Reference"],
    "Recruitment Pipeline": ["Vacancy", "Candidate", "Stage", "Interviewer"],
    "Onboarding Checklist": ["Employee", "Department", "Position", "Start date", "Contract"],
    "Offboarding and Clearance": ["Employee", "Last day", "Clearance", "Assets returned"],
    "Shift Schedules": ["Staff", "Shift", "Weekday", "Start", "End"],
    "Staff Training": ["Staff", "Course", "Date", "Provider"],
    "Vehicles": ["Registration", "Capacity", "Documents", "Driver", "Licence expiry"],
    "Drivers": ["Driver", "Licence", "Expiry", "Vehicle"],
    "Routes & Stops": ["Student", "Route", "Stop", "Pickup time", "Guardian permission"],
    "Transport Incidents": ["Route", "Vehicle", "Time", "What happened"],
    "Rooms & Beds": ["Student", "Dorm", "Bed", "From", "Guardian authorization"],
    "Meal Eligibility": ["Student", "Meal plan", "Diet", "Start"],
    "Borrowing & Returns": ["Borrower", "Barcode", "Issued", "Due"],
    "Library Stocktake": ["Title", "Barcode", "Expected", "Counted"],
    "Stock Adjustments": ["Item", "Location", "Counted", "Expected", "Reason", "Approver"],
    "Stock Movements": ["Item", "From", "To", "Quantity"],
    "Work Orders": ["Asset or location", "Issue", "Priority", "Assignee", "Due", "Resolution"],
    "Reception Queue": ["Visitor", "Host", "Purpose", "Arrival"],
    "Late Arrival and Early Departure": ["Student", "Time", "Direction", "Reason", "Collected by"],
    "Parent Service Requests": ["Parent", "Student", "Request", "Urgency"],
    "Incoming Correspondence": ["From", "Subject", "Received", "Owner"],
    "Visitor Check-in": ["Visitor", "ID type", "Host", "Purpose", "Arrival", "Departure"],
    "Permission Forms": ["Student", "Event", "Guardian", "Consent", "Deadline"],
    "Appointment Booking": ["Teacher", "Guardian", "Student", "Slot", "Place", "Reason"],
    "Assignments": ["Assignment", "Student", "Response", "Submitted", "Feedback"],
    "Quiz Library": ["Course", "Objective", "Prompt", "Question type", "Answers", "Difficulty"],
    "Live Classes": ["Course", "Teacher", "Roster", "When", "Meeting link"],
    "Ask AI Tutor": ["Learner", "Grade", "Question", "Source", "Session"],
    "Support Desk": ["Requester", "Category", "Description", "Urgency", "Assignee"]
  };

  function canonicalFields(meta) {
    const page = meta || (window.LarcelNav && window.LarcelNav.byId[state.page]);
    return page && CANON[page.label] ? CANON[page.label] : null;
  }

  function ensureBook(meta) {
    if (!meta) return null;
    if (BOOKS[meta.id]) return BOOKS[meta.id];
    const kind = kindOf(meta);
    let scheme = SCHEMES[kind];
    const canon = canonicalFields(meta);
    if (canon) {
      const cols = canon.slice(0, 3);
      while (cols.length < 3) cols.push("Detail");
      scheme = { cols: cols.concat(["Status"]), statuses: scheme.statuses.slice(), good: scheme.good, stats: scheme.stats };
    }
    const rand = rng(hashText(meta.id));
    const count = 16 + Math.floor(rand() * 8);
    const rows = [];
    const used = { pupils: {}, subjects: {} };
    for (let i = 0; i < count; i++) rows.push(makeRow(meta, kind, scheme, rand, i, used));
    const saved = storedBooks()[meta.id];
    const sameKind = saved && saved.rows && (saved.kind ? saved.kind === kind : kind !== "payroll");
    BOOKS[meta.id] = { id: meta.id, kind: kind, cols: scheme.cols, statuses: scheme.statuses.slice(), good: scheme.good, statLabels: scheme.stats, rows: sameKind ? saved.rows : rows, dirty: sameKind ? (saved.dirty || 0) : 0, query: "", filter: "", group: "", selected: {} };
    return BOOKS[meta.id];
  }

  function selectedCount(data) {
    return visibleSelected(data).length;
  }

  function visibleSelected(data) {
    const ids = {};
    visibleRows(data).forEach(function (row) { ids[row.id] = true; });
    return Object.keys(data.selected).filter(function (id) { return ids[id]; });
  }

  function visibleRows(data) {
    const query = data.query.trim().toLowerCase();
    const rows = data.rows.filter(function (row) {
      if (data.filter && row.status !== data.filter) return false;
      if (data.group && row.b !== data.group) return false;
      if (!query) return true;
      return (row.a + " " + row.b + " " + row.c + " " + row.status).toLowerCase().indexOf(query) !== -1;
    });
    if (!data.sortKey) return rows;
    const dir = data.sortDir === "desc" ? -1 : 1;
    const key = data.sortKey;
    return rows.slice().sort(function (a, b) { return String(a[key]).localeCompare(String(b[key])) * dir; });
  }

  const PAGE_SIZE = 5;

  function pagedRows(data) {
    const all = visibleRows(data);
    const pages = Math.max(1, Math.ceil(all.length / PAGE_SIZE) || 1);
    if (typeof data.page !== "number" || data.page < 0) data.page = 0;
    if (data.page > pages - 1) data.page = pages - 1;
    const start = data.page * PAGE_SIZE;
    return { all: all, rows: all.slice(start, start + PAGE_SIZE), pages: pages, start: start, page: data.page };
  }

  function pageWindow(pages, current) {
    if (pages <= 7) {
      const list = [];
      for (let i = 0; i < pages; i++) list.push(i);
      return list;
    }
    const keep = {};
    keep[0] = true;
    keep[pages - 1] = true;
    keep[current] = true;
    if (current > 0) keep[current - 1] = true;
    if (current < pages - 1) keep[current + 1] = true;
    const nums = Object.keys(keep).map(Number).sort(function (a, b) { return a - b; });
    const out = [];
    nums.forEach(function (n, i) {
      if (i && n - nums[i - 1] > 1) out.push("…");
      out.push(n);
    });
    return out;
  }

  function pagerButtons(pages, current, action, gridKey) {
    const extra = gridKey ? ' data-grid="' + esc(gridKey) + '"' : "";
    const off = " disabled:opacity-40 disabled:pointer-events-none";
    let buttons = '<button type="button" data-action="' + action + '" data-dir="prev"' + extra + (current <= 0 ? " disabled" : "") + ' class="' + ghostBtn + off + '">Previous</button>';
    pageWindow(pages, current).forEach(function (item) {
      if (item === "…") buttons += '<span class="px-1 text-slate-400">…</span>';
      else buttons += '<button type="button" data-action="' + action + '" data-index="' + item + '"' + extra + ' class="' + (item === current ? primaryBtn : ghostBtn) + '">' + (item + 1) + "</button>";
    });
    buttons += '<button type="button" data-action="' + action + '" data-dir="next"' + extra + (current >= pages - 1 ? " disabled" : "") + ' class="' + ghostBtn + off + '">Next</button>';
    return buttons;
  }

  function summarize(data) {
    const rows = visibleRows(data);
    const good = rows.filter(function (row) { return row.status === data.good; }).length;
    const warn = rows.filter(function (row) { return toneFor(row.status) === "amber"; }).length;
    const groups = {};
    rows.forEach(function (row) { groups[row.b] = true; });
    return {
      values: [String(rows.length), String(good), String(warn), String(Object.keys(groups).length)],
      hints: [
        rows.length ? rows.length + " · matching now" : "no data yet",
        good ? good + " · " + data.good.toLowerCase() : "none · " + data.good.toLowerCase(),
        warn ? warn + " · needs a look" : "none waiting",
        Object.keys(groups).length ? Object.keys(groups).length + " · in view" : "no groups yet",
      ],
      tones: [rows.length ? "emerald" : "amber", good ? "emerald" : "amber", warn ? "amber" : "emerald", "emerald"],
    };
  }

  function glyph(path) {
    return '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="' + path + '"/></svg>';
  }

  const ICON_SEARCH = "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z";
  const ICON_EXPORT = "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3";
  const ICON_CHEVRON = "m19.5 8.25-7.5 7.5-7.5-7.5";
  const ICON_DOC = "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z";
  const ICON_IMPORT = "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5";
  const ICON_EYE = "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z";
  const ICON_EDIT = "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125";
  const ICON_UPDATE = "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99";
  const ICON_DELETE = "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0";
  const STATUS_CYCLE = ["Active", "Watch", "Pending", "Left", "Enrolled", "Interviewing", "Documentation Pending", "Reviewed", "Approved", "Declined", "Open", "Monitoring", "Inactive", "Invited"];

  function iconAct(action, id, label, path, extra) {
    const tone = label === "Delete" ? "text-slate-500 hover:bg-rose-50 hover:text-rose-600" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900";
    return '<button type="button" data-action="' + action + '" data-id="' + esc(id) + '"' + (extra || "") + ' class="inline-flex h-7 w-7 items-center justify-center rounded-md ' + tone + '" title="' + esc(label) + '" aria-label="' + esc(label) + '">' + glyph(path) + "</button>";
  }

  function rowActions(action, id, extra, skipView) {
    return '<span class="inline-flex items-center justify-end gap-0.5">' +
      (skipView ? "" : iconAct(action + "-view", id, "View", ICON_EYE, extra)) +
      iconAct(action + "-edit", id, "Edit", ICON_EDIT, extra) +
      iconAct(action + "-update", id, "Update", ICON_UPDATE, extra) +
      iconAct(action + "-remove", id, "Delete", ICON_DELETE, extra) + "</span>";
  }

  function viewNamed(name) {
    const pupil = pupilNamed(name);
    if (pupil) {
      state.pupilId = pupil.id;
      show("student360");
      return true;
    }
    const teacher = teacherNamed(name);
    if (teacher) {
      state.teacherId = teacher.id;
      show("teacherprofile");
      return true;
    }
    return false;
  }

  function viewPairs(title, pairs) {
    const body = '<dl class="divide-y divide-slate-100">' + pairs.map(function (pair) {
      return '<div class="flex items-center justify-between gap-4 py-2"><dt class="text-slate-400">' + esc(pair[0]) + '</dt><dd class="font-semibold text-slate-900 text-right">' + esc(pair[1]) + "</dd></div>";
    }).join("") + "</dl>";
    openModal(title, body, [{ label: "Close", primary: true, run: function () {} }]);
  }

  function nextToken(current) {
    const index = STATUS_CYCLE.indexOf(current);
    if (index === -1) return current && current.length <= 32 ? "Updated" : current;
    return STATUS_CYCLE[(index + 1) % STATUS_CYCLE.length];
  }

  function statCard(label, value, hint, id, tone) {
    const valueId = id ? ' id="' + id + '"' : "";
    const hintId = id ? ' id="' + id + '-hint"' : "";
    const valueTone = tone === "amber" ? "text-amber-600" : "text-slate-900";
    const hintTone = tone === "amber" ? "text-amber-600" : "text-emerald-600";
    return '<article class="rounded-xl border border-slate-200 bg-white px-4 py-3.5"><p class="text-[11px] font-medium uppercase tracking-wide text-slate-500">' + esc(label) + '</p><p' + valueId + ' class="stat-value mt-2 text-[1.65rem] font-semibold tracking-tight tabular-nums leading-none ' + valueTone + '">' + value + '</p><p' + hintId + ' class="stat-hint mt-2 text-xs ' + hintTone + '">' + hint + "</p></article>";
  }

  function statGrid(data) {
    const summary = summarize(data);
    return '<section class="grid grid-cols-2 lg:grid-cols-4 gap-3">' + data.statLabels.map(function (label, index) {
      return statCard(label, summary.values[index], summary.hints[index], "stat-" + index, summary.tones[index]);
    }).join("") + "</section>";
  }

  function factRow(items) {
    return '<section class="grid grid-cols-2 gap-3 lg:grid-cols-4">' + items.map(function (item, index) {
      return statCard(item[0], item[1], item[2], "stat-" + index, item[3] || "");
    }).join("") + "</section>";
  }

  function pluralToken(token) {
    if (/^(class|bus|plus|status|campus|process|address)$/.test(token)) return token + "es";
    if (/s$/.test(token) && !/(ss|x|z|ch|sh)$/.test(token)) return token;
    if (/(s|x|z|ch|sh)$/.test(token)) return token + "es";
    if (/y$/.test(token) && !/[aeiou]y$/.test(token)) return token.slice(0, -1) + "ies";
    return token + "s";
  }

  function plural(word) {
    const parts = String(word).toLowerCase().split(/\s+/);
    parts[parts.length - 1] = pluralToken(parts[parts.length - 1]);
    return parts.join(" ");
  }

  function optionList(values, current, allLabel) {
    return '<option value="">' + esc(allLabel) + "</option>" + values.map(function (value) {
      return '<option value="' + esc(value) + '"' + (value === current ? " selected" : "") + ">" + esc(value) + "</option>";
    }).join("");
  }

  function recordRowsHtml(data) {
    const page = pagedRows(data);
    if (!page.all.length) {
      return '<tr><td colspan="6" class="py-14 px-3 text-center text-sm text-slate-400">No records match that search or filter.</td></tr>';
    }
    return page.rows.map(function (row) {
      const on = !!data.selected[row.id];
      return '<tr class="hover:bg-slate-50/80' + (on ? " bg-slate-50" : "") + '"><td class="py-3 px-4"><input type="checkbox" data-record-id="' + esc(row.id) + '"' + (on ? " checked" : "") + ' class="rounded border-slate-300 text-slate-900 focus:ring-slate-400" aria-label="Select ' + esc(row.a) + '" /></td>' +
        '<td class="py-3 px-3 font-medium text-slate-900">' + esc(row.a) + "</td>" +
        '<td class="py-3 px-3 text-slate-600">' + esc(row.b) + "</td>" +
        '<td class="py-3 px-3 text-slate-600">' + esc(row.c) + "</td>" +
        '<td class="py-3 px-3">' + badge(row.status, toneFor(row.status)) + "</td>" +
        '<td class="py-3 px-4 text-right whitespace-nowrap">' + rowActions("record", row.id) + "</td></tr>";
    }).join("");
  }

  function paintStats(data) {
    const summary = summarize(data);
    summary.values.forEach(function (value, index) {
      const el = document.getElementById("stat-" + index);
      if (el) {
        el.textContent = value;
        el.classList.toggle("text-amber-600", summary.tones[index] === "amber");
        el.classList.toggle("text-slate-900", summary.tones[index] !== "amber");
      }
      const hint = document.getElementById("stat-" + index + "-hint");
      if (hint) {
        hint.textContent = summary.hints[index];
        hint.classList.toggle("text-amber-600", summary.tones[index] === "amber");
        hint.classList.toggle("text-emerald-600", summary.tones[index] !== "amber");
      }
    });
  }

  function pagerHtml(info) {
    if (!info.all.length) return '<div id="record-pager" class="hidden"></div>';
    const from = info.start + 1;
    const to = info.start + info.rows.length;
    return '<div id="record-pager" class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-xs"><span id="record-range" class="text-slate-500">Showing ' + from + "–" + to + " of " + info.all.length + '</span><div class="flex flex-wrap items-center gap-1">' + pagerButtons(info.pages, info.page, "record-page") + "</div></div>";
  }

  function paintRecords() {
    const data = BOOKS[state.page];
    const body = document.getElementById("record-body");
    if (!data || !body) return;
    const rows = pagedRows(data);
    body.innerHTML = recordRowsHtml(data);
    paintStats(data);
    const pager = document.getElementById("record-pager");
    if (pager) pager.outerHTML = pagerHtml(rows);
    document.querySelectorAll('[data-action="record-sort"]').forEach(function (button) {
      const on = button.dataset.key === data.sortKey;
      button.classList.toggle("text-slate-900", on);
      button.classList.toggle("text-slate-400", !on);
      const mark = button.querySelector(".sort-mark");
      if (mark) mark.textContent = on ? (data.sortDir === "desc" ? "↓" : "↑") : "";
    });
    const count = document.getElementById("record-count");
    if (count) count.textContent = rows.all.length + " of " + data.rows.length;
    const bulk = document.getElementById("record-bulk");
    const n = selectedCount(data);
    if (bulk) {
      bulk.classList.toggle("hidden", n === 0);
      bulk.classList.toggle("flex", n !== 0);
    }
    const selected = document.getElementById("record-selected");
    if (selected) selected.textContent = n + " selected";
    const pickAll = document.getElementById("record-select-all");
    if (pickAll) {
      const pageFull = rows.rows.length > 0 && rows.rows.every(function (row) { return data.selected[row.id]; });
      const allChosen = rows.all.length > 0 && n === rows.all.length;
      pickAll.classList.toggle("hidden", !(pageFull && !allChosen));
      pickAll.textContent = "Select all " + rows.all.length;
    }
    const all = document.getElementById("record-all");
    if (all) {
      all.disabled = rows.rows.length === 0;
      all.checked = rows.rows.length > 0 && rows.rows.every(function (row) { return data.selected[row.id]; });
      all.indeterminate = !all.checked && rows.rows.some(function (row) { return data.selected[row.id]; });
    }
  }

  function pageNoun() {
    const meta = window.LarcelNav && window.LarcelNav.byId[state.page];
    return meta ? meta.label : "record";
  }

  function sortHead(label, key) {
    return '<th class="py-2.5 px-3 font-medium"><button type="button" data-action="record-sort" data-key="' + key + '" class="inline-flex items-center gap-1 uppercase tracking-wider text-slate-400 hover:text-slate-700">' + esc(label) + '<span class="sort-mark text-[10px]"></span>' + glyph(ICON_CHEVRON) + "</button></th>";
  }

  function emptyRecords(noun) {
    const one = noun.toLowerCase();
    return '<div class="px-6 py-16 text-center"><div class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-300">' + glyph(ICON_DOC) + '</div>' +
      '<p class="text-sm font-semibold text-slate-900">No ' + esc(plural(one)) + ' yet</p>' +
      '<p class="mt-1 text-xs text-slate-500">Create your first ' + esc(one) + ' to get started.</p>' +
      '<div class="mt-4 flex items-center justify-center gap-2"><button type="button" data-action="record-add" class="' + primaryBtn + '">+ Create the first record</button>' +
      '<button type="button" data-action="record-import" class="' + ghostBtn + '">' + glyph(ICON_IMPORT) + " Import</button>" +
      '<button type="button" data-action="record-export" class="' + ghostBtn + '">' + glyph(ICON_EXPORT) + " Export</button></div></div>";
  }

  function tablePanel(data) {
    const groups = [];
    data.rows.forEach(function (row) { if (groups.indexOf(row.b) === -1) groups.push(row.b); });
    groups.sort();
    const page = pagedRows(data);
    const n = selectedCount(data);
    const allOn = page.rows.length > 0 && page.rows.every(function (row) { return data.selected[row.id]; });
    const noun = pageNoun();
    const selectCls = "w-full min-w-0 text-xs rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700";
    const tools = '<label class="relative min-w-0"><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">' + glyph(ICON_SEARCH) + '</span>' +
      '<input id="record-search" value="' + esc(data.query) + '" class="w-full rounded-full border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300" placeholder="Search ' + esc(noun.toLowerCase()) + '" /></label>' +
      '<select id="record-status" class="' + selectCls + '">' + optionList(data.statuses, data.filter, "All statuses") + "</select>" +
      '<select id="record-group" class="' + selectCls + '">' + optionList(groups, data.group, "All " + plural(data.cols[1])) + "</select>" +
      '<button type="button" data-action="record-import" class="' + ghostBtn + ' w-full justify-center">' + glyph(ICON_IMPORT) + ' Import</button>' +
      '<button type="button" data-action="record-export" class="' + ghostBtn + ' w-full justify-center">' + glyph(ICON_EXPORT) + ' Export</button>' +
      '<button type="button" data-action="record-add" class="' + primaryBtn + ' w-full justify-center text-center whitespace-normal leading-snug">+ New ' + esc(noun) + "</button>";
    const body = data.rows.length
      ? '<div class="overflow-x-auto border-t border-slate-100"><table class="w-full text-left text-xs"><thead class="bg-slate-50/80 text-[11px] font-medium uppercase tracking-wider text-slate-400"><tr>' +
        '<th class="py-2.5 px-4 w-10"><input id="record-all" type="checkbox"' + (allOn ? " checked" : "") + ' class="rounded border-slate-300 text-slate-900 focus:ring-slate-400" aria-label="Select all on this page" /></th>' +
        sortHead(data.cols[0], "a") + sortHead(data.cols[1], "b") + sortHead(data.cols[2], "c") + sortHead(data.cols[3], "status") +
        '<th class="py-2.5 px-4 text-right font-medium">Actions</th></tr></thead><tbody id="record-body" class="divide-y divide-slate-100">' + recordRowsHtml(data) + "</tbody></table></div>" + pagerHtml(page)
      : emptyRecords(data.cols[0]);
    return '<article class="bg-white rounded-xl border border-slate-200 overflow-hidden">' +
      '<div class="px-5 py-4">' +
      '<div class="min-w-0"><h2 class="text-sm font-semibold text-slate-900">' + esc(noun) + '</h2>' +
      '<p class="mt-0.5 text-xs text-slate-500">Browse, search and manage ' + esc(plural(noun.toLowerCase())) + '.</p></div>' +
      '<div class="mt-3 grid w-full grid-cols-2 items-center gap-3 md:grid-cols-3 xl:grid-cols-6">' + tools + "</div></div>" +
      '<div id="record-bulk" class="' + (n ? "flex" : "hidden") + ' items-center gap-2 px-5 py-2 bg-slate-50 border-t border-slate-100 text-xs">' +
      '<span id="record-selected" class="font-semibold text-slate-700">' + n + ' selected</span>' +
      '<button type="button" id="record-select-all" data-action="record-select-all" class="hidden text-xs font-semibold text-slate-900 underline">Select all</button>' +
      '<span id="record-count" class="text-slate-400">' + page.all.length + " of " + data.rows.length + "</span>" +
      '<button type="button" data-action="record-mark" class="' + primaryBtn + '">Mark ' + esc(data.good.toLowerCase()) + "</button>" +
      '<button type="button" data-action="record-delete-selected" class="' + ghostBtn + '">Delete</button>' +
      '<button type="button" data-action="record-clear" class="' + ghostBtn + '">Clear</button></div>' +
      body + "</article>";
  }

  function pupilNamed(value) {
    return state.pupils360.filter(function (pupil) { return pupil.name === value; })[0];
  }

  function teacherNamed(value) {
    return state.teachers.filter(function (teacher) { return teacher.name === value; })[0];
  }

  function detailTable(heads, rows) {
    const body = rows.map(function (row) {
      return "<tr>" + row.map(function (cell) { return '<td class="py-2.5 px-3 text-slate-700">' + cell + "</td>"; }).join("") + "</tr>";
    }).join("");
    return '<div class="overflow-x-auto"><table class="w-full text-left text-xs"><thead class="text-[11px] uppercase tracking-wider text-slate-400"><tr>' +
      heads.map(function (head) { return '<th class="py-2 px-3 font-medium">' + esc(head) + "</th>"; }).join("") +
      '</tr></thead><tbody class="divide-y divide-slate-100">' + body + "</tbody></table></div>";
  }

  function relatedTable(section, row) {
    const book = ensureBook(section);
    const keys = [row.a, row.b].filter(function (value) { return String(value).length > 2; });
    const matched = book.rows.filter(function (item) {
      const hay = (item.a + " " + item.b + " " + item.c).toLowerCase();
      return keys.some(function (key) { return hay.indexOf(String(key).toLowerCase()) !== -1; });
    });
    const rows = (matched.length ? matched : book.rows).slice(0, 5);
    if (!rows.length) return '<p class="text-xs text-slate-400">Nothing recorded yet.</p>';
    return detailTable(book.cols, rows.map(function (item) {
      return [esc(item.a), esc(item.b), esc(item.c), badge(item.status, toneFor(item.status))];
    }));
  }

  function sectionInner(section, row) {
    const pupil = pupilNamed(row.a) || pupilNamed(row.b);
    const teacher = teacherNamed(row.a) || teacherNamed(row.b);
    const label = section.label.toLowerCase();
    if (pupil && label.indexOf("profile") !== -1) {
      return '<p class="text-sm text-slate-700">' + esc(pupil.sid) + " · " + esc(pupil.cls) + " · " + esc(pupil.room) + "</p>" +
        '<p class="mt-1 text-xs text-slate-500">Class teacher ' + esc(pupil.teacher) + " · attendance " + esc(pupil.attendance) + " · " + esc(pupil.health.note) + "</p>" +
        '<button type="button" data-action="record-linked" data-view="student360" data-name="' + esc(pupil.name) + '" class="' + ghostBtn + ' mt-3">Open full profile</button>';
    }
    if (pupil && /guardian|famil/.test(label)) {
      return detailTable(["Name", "Relation", "Phone", "Pickup"], pupil.parents.map(function (parent) {
        return ['<span class="font-medium text-slate-900">' + esc(parent.name) + "</span>", esc(parent.relation), esc(parent.phone), esc(parent.pickup)];
      }));
    }
    if (pupil && label.indexOf("document") !== -1) {
      return detailTable(["Document", "Status"], [
        ["Birth certificate", badge("On file", "emerald")],
        ["Previous report", badge("On file", "emerald")],
        ["Clinic card", badge(pupil.health.clinic, /due|follow/i.test(pupil.health.clinic) ? "amber" : "emerald")],
      ]);
    }
    if (pupil && label.indexOf("id card") !== -1) {
      return detailTable(["Card", "Class", "Status"], [[esc(pupil.sid), esc(pupil.cls), badge("Active", "emerald")]]);
    }
    if (pupil && /clinic|allerg|incident|emergency/.test(label)) {
      return detailTable(["Item", "Detail"], [
        ["Allergies", esc(pupil.health.allergies)],
        ["Medication", esc(pupil.health.medication)],
        ["Clinic", esc(pupil.health.clinic)],
        ["Emergency", esc(pupil.health.emergency)],
      ]);
    }
    if (teacher && label.indexOf("profile") !== -1) {
      return '<p class="text-sm text-slate-700">' + esc(teacher.role) + " · " + esc(teacher.subject) + " · " + esc(teacher.room) + "</p>" +
        '<p class="mt-1 text-xs text-slate-500">' + esc(teacher.email) + " · " + esc(teacher.phone) + "</p>" +
        '<button type="button" data-action="record-linked" data-view="teacherprofile" data-name="' + esc(teacher.name) + '" class="' + ghostBtn + ' mt-3">Open full profile</button>';
    }
    if (section.view && FORM_VIEWS[section.view]) {
      return '<p class="text-xs text-slate-500">This sits on the full ' + esc(section.label.toLowerCase()) + ' record.</p>' +
        '<button type="button" data-action="record-linked" data-view="' + esc(section.view) + '" data-name="' + esc(row.a) + '" class="' + ghostBtn + ' mt-3">Open ' + esc(section.label.toLowerCase()) + "</button>";
    }
    return relatedTable(section, row);
  }

  function sectionBrief(section, row) {
    const pupil = pupilNamed(row.a) || pupilNamed(row.b);
    const teacher = teacherNamed(row.a) || teacherNamed(row.b);
    const label = section.label.toLowerCase();
    let note = "";
    let open = "";
    if (pupil && label.indexOf("profile") !== -1) {
      note = pupil.sid + " · " + pupil.cls + " · attendance " + pupil.attendance;
      open = "student360";
    } else if (pupil && /guardian|famil/.test(label)) {
      note = pupil.parents.map(function (parent) { return parent.name + " (" + parent.relation + ")"; }).join(", ");
    } else if (pupil && label.indexOf("document") !== -1) {
      note = "Birth certificate, previous report, and clinic card (" + pupil.health.clinic + ")";
    } else if (pupil && label.indexOf("id card") !== -1) {
      note = pupil.sid + " · " + pupil.cls + " · active";
    } else if (pupil && /clinic|allerg|incident|emergency/.test(label)) {
      note = "Allergies " + pupil.health.allergies + " · " + pupil.health.clinic;
    } else if (teacher && label.indexOf("profile") !== -1) {
      note = teacher.role + " · " + teacher.subject + " · " + teacher.room;
      open = "teacherprofile";
    } else if (section.view && FORM_VIEWS[section.view]) {
      note = "Kept on the full " + section.label.toLowerCase() + " page";
      open = section.view;
    } else {
      const book = ensureBook(section);
      const keys = [row.a, row.b].filter(function (value) { return String(value).length > 2; });
      const matched = book.rows.filter(function (item) {
        const hay = (item.a + " " + item.b + " " + item.c).toLowerCase();
        return keys.some(function (key) { return hay.indexOf(String(key).toLowerCase()) !== -1; });
      });
      note = matched.length
        ? matched.length + " linked · " + matched.slice(0, 2).map(function (item) { return item.a + " (" + item.status + ")"; }).join(", ")
        : "Nothing linked to " + row.a + " yet";
    }
    const link = open
      ? '<button type="button" data-action="record-linked" data-view="' + esc(open) + '" data-name="' + esc(row.a) + '" class="shrink-0 text-xs font-semibold text-slate-900 hover:underline">Open</button>'
      : '<button type="button" data-action="goto" data-page="' + esc(section.id) + '" class="shrink-0 text-xs font-semibold text-slate-900 hover:underline">Open</button>';
    return '<div class="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-0"><div class="min-w-0"><p class="text-sm font-semibold text-slate-900">' + esc(section.label) + '</p><p class="mt-0.5 text-xs text-slate-500">' + esc(note) + "</p></div>" + link + "</div>";
  }

  function recordDetailPage(meta, data, row) {
    const sections = !meta.detail && window.LarcelNav && window.LarcelNav.detailsOf ? window.LarcelNav.detailsOf(meta.hub || meta.id) : [];
    const back = '<nav aria-label="Back" class="flex flex-wrap items-center justify-between gap-3">' +
      '<button type="button" data-action="record-back" class="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900">' +
      '<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>Back to ' + esc(meta.label) + "</button>" +
      '<div class="flex items-center gap-2"><button type="button" data-action="record-versions" data-id="' + esc(row.id) + '" class="' + ghostBtn + '">Versions</button>' +
      '<button type="button" data-action="record-edit" data-id="' + esc(row.id) + '" class="' + ghostBtn + '">Edit</button></div></nav>';
    const tiles = '<section class="grid grid-cols-2 gap-3 lg:grid-cols-4">' +
      statCard(data.cols[0], esc(row.a), esc(meta.label)) +
      statCard(data.cols[1], esc(row.b), "on this record") +
      statCard(data.cols[2], esc(row.c), "assigned here") +
      statCard(data.cols[3], esc(row.status), "current standing", "", toneFor(row.status) === "amber" ? "amber" : "") +
      "</section>";
    const linked = sections.length
      ? card('<h2 class="text-sm font-semibold text-slate-900">Linked to this record</h2><p class="mt-0.5 text-xs text-slate-500">A short read of the other records that belong with ' + esc(row.a) + ".</p><div class=\"mt-2\">" + sections.map(function (section) { return sectionBrief(section, row); }).join("") + "</div>")
      : "";
    const extraList = row.extra && Object.keys(row.extra).length
      ? card('<h2 class="text-sm font-semibold text-slate-900">Rest of the form</h2><dl class="mt-2 divide-y divide-slate-100">' + Object.keys(row.extra).map(function (key) {
          return '<div class="flex items-center justify-between gap-4 py-2"><dt class="text-xs text-slate-400">' + esc(key) + '</dt><dd class="text-xs font-semibold text-slate-900 text-right">' + esc(row.extra[key]) + "</dd></div>";
        }).join("") + "</dl>")
      : "";
    return back + shell(esc(row.a), "Summary of what " + esc(meta.label) + " collects: " + data.cols.map(function (label) { return esc(label); }).join(", ") + ".",
      tiles + extraList + linked);
  }

  function workspace(meta) {
    const data = ensureBook(meta);
    if (state.recordId) {
      const row = findRow(data, state.recordId);
      if (row) return recordDetailPage(meta, data, row);
      state.recordId = "";
    }
    const term = document.getElementById("term-label").textContent;
    const notice = meta.restricted
      ? '<div class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">Restricted record. Health, counseling, and safeguarding pages stay limited to authorized staff.</div>'
      : "";
    return shell(esc(meta.label), data.rows.length + " records for " + esc(term) + ".",
      notice + statGrid(data) + tablePanel(data));
  }

  function pageStats() {
    const meta = window.LarcelNav && window.LarcelNav.byId[state.page];
    if (!meta) return "";
    const data = ensureBook(meta);
    return statGrid(data) + tablePanel(data);
  }

  function findRow(data, id) {
    return data.rows.filter(function (row) { return row.id === id; })[0];
  }

  function fieldInput(label, id, value) {
    return '<label class="block"><span class="text-[11px] font-semibold text-slate-700">' + esc(label) + '</span><input id="' + id + '" value="' + esc(value || "") + '" required class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-400" /></label>';
  }

  function recordFormHtml(data, row) {
    const status = row ? row.status : data.statuses[0];
    const fields = canonicalFields();
    const extra = (row && row.extra) || {};
    let inputs = "";
    if (fields) {
      fields.forEach(function (label, index) {
        const stored = index === 0 ? row && row.a : index === 1 ? row && row.b : index === 2 ? row && row.c : extra[label];
        inputs += fieldInput(label, "record-field-" + index, stored || "");
      });
    } else {
      inputs = fieldInput(data.cols[0], "record-new-a", row && row.a) +
        fieldInput(data.cols[1], "record-new-b", row && row.b) +
        fieldInput(data.cols[2], "record-new-c", row && row.c);
    }
    return '<form id="record-form" class="space-y-3">' + inputs +
      '<label class="block"><span class="text-[11px] font-semibold text-slate-700">' + esc(data.cols[3] || "Status") + '</span><select id="record-new-status" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white">' +
      data.statuses.map(function (item) { return '<option' + (item === status ? " selected" : "") + ">" + esc(item) + "</option>"; }).join("") +
      "</select></label></form>";
  }

  const STORE_KEY = "littleroyals-records";
  const net = { mode: "online", forcedOffline: false, syncTimer: null, resetTimer: null };

  function storedBooks() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch (e) { return {}; }
  }

  function writeStore(all) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(all)); } catch (e) {}
  }

  function isOnline() {
    return navigator.onLine && !net.forcedOffline;
  }

  function totalDirty() {
    const all = storedBooks();
    Object.keys(BOOKS).forEach(function (id) {
      all[id] = { rows: BOOKS[id].rows, dirty: BOOKS[id].dirty || 0, kind: BOOKS[id].kind };
    });
    return Object.keys(all).reduce(function (sum, id) { return sum + (all[id].dirty || 0); }, 0);
  }

  function persistBook(data) {
    const all = storedBooks();
    all[data.id] = { rows: data.rows, dirty: data.dirty || 0, kind: data.kind };
    writeStore(all);
  }

  function paintNet() {
    const el = document.getElementById("net-status");
    const label = document.getElementById("net-label");
    if (!el || !label) return;
    const pending = totalDirty();
    let mode = net.mode;
    if (mode !== "syncing" && !isOnline()) mode = "offline";
    if (mode !== "syncing" && mode !== "synced" && isOnline()) mode = "online";
    el.classList.remove("online", "offline", "syncing", "synced");
    el.classList.add(mode);
    if (mode === "offline") {
      label.textContent = pending ? "Offline · " + pending + " to sync" : "Offline";
      el.title = "Working offline. Click to reconnect and sync.";
    } else if (mode === "syncing") {
      label.textContent = "Syncing…";
      el.title = "Sending saved changes.";
    } else if (mode === "synced") {
      label.textContent = "Synced";
      el.title = "Changes are on the school record.";
    } else {
      label.textContent = "Online";
      el.title = "Online. Click to work offline.";
    }
  }

  function finishSync() {
    const all = storedBooks();
    Object.keys(BOOKS).forEach(function (id) {
      BOOKS[id].dirty = 0;
      all[id] = { rows: BOOKS[id].rows, dirty: 0, kind: BOOKS[id].kind };
    });
    Object.keys(all).forEach(function (id) { all[id].dirty = 0; });
    writeStore(all);
    net.mode = "synced";
    paintNet();
    toast("Synced with Little Royals");
    clearTimeout(net.resetTimer);
    net.resetTimer = setTimeout(function () {
      net.mode = "online";
      paintNet();
    }, 1600);
  }

  function syncSoon() {
    if (!isOnline()) { paintNet(); return; }
    clearTimeout(net.syncTimer);
    clearTimeout(net.resetTimer);
    net.mode = "syncing";
    paintNet();
    net.syncTimer = setTimeout(finishSync, 800);
  }

  function noteChange(data) {
    data.dirty = (data.dirty || 0) + 1;
    persistBook(data);
    if (isOnline()) syncSoon();
    else paintNet();
  }

  function refreshBook(data) {
    noteChange(data);
    closeModal();
    show(state.page);
    paintStats(data);
  }

  function readRecordFields(data) {
    const fields = canonicalFields();
    const status = document.getElementById("record-new-status").value;
    if (!fields) {
      const a = document.getElementById("record-new-a").value.trim();
      const b = document.getElementById("record-new-b").value.trim();
      const c = document.getElementById("record-new-c").value.trim();
      if (!a || !b || !c) return { error: "Fill in " + data.cols[0] + ", " + data.cols[1] + ", and " + data.cols[2] };
      return { a: a, b: b, c: c, status: status, extra: {} };
    }
    const values = fields.map(function (label, index) {
      const input = document.getElementById("record-field-" + index);
      return input ? input.value.trim() : "";
    });
    if (values.some(function (value) { return !value; })) return { error: "Fill in every field before saving." };
    const extra = {};
    fields.forEach(function (label, index) { if (index >= 3) extra[label] = values[index]; });
    return { a: values[0], b: values[1] || "—", c: values[2] || "—", status: status, extra: extra };
  }

  function saveRecord(data, existing) {
    const next = readRecordFields(data);
    if (next.error) { toast(next.error); return; }
    if (existing) {
      const before = { a: existing.a, b: existing.b, c: existing.c, status: existing.status, extra: existing.extra || {} };
      existing.a = next.a;
      existing.b = next.b;
      existing.c = next.c;
      existing.status = next.status;
      existing.extra = next.extra;
      pushVersion({ kind: "record", page: state.page, recordId: existing.id, label: before.a, when: "Just now", who: state.me.name, note: "Before edit", snap: before });
      refreshBook(data);
      toast(next.a + (isOnline() ? " updated" : " updated · saved offline"));
      return;
    }
    data.rows.unshift({ id: data.id + "-" + Date.now(), a: next.a, b: next.b, c: next.c, status: next.status, extra: next.extra });
    refreshBook(data);
    toast(next.a + (isOnline() ? " added" : " added · saved offline"));
  }

  function deleteRows(data, ids) {
    if (!ids.length) { toast("Select at least one row"); return; }
    data.rows = data.rows.filter(function (row) { return ids.indexOf(row.id) === -1; });
    ids.forEach(function (id) { delete data.selected[id]; });
    refreshBook(data);
    toast("Deleted " + ids.length + (ids.length === 1 ? " record" : " records") + (isOnline() ? "" : " · saved offline"));
  }

  function openRecordForm(data, row) {
    openModal(row ? "Edit " + row.a : "Add record", recordFormHtml(data, row), [
      { label: row ? "Save changes" : "Save", primary: true, close: false, run: function () { saveRecord(data, row); } },
      { label: "Cancel", run: function () {} },
    ]);
  }

  function openRecordDetail(data, row) {
    const pairs = [[data.cols[0], row.a], [data.cols[1], row.b], [data.cols[2], row.c], [data.cols[3], row.status]];
    Object.keys(row.extra || {}).forEach(function (key) { pairs.push([key, row.extra[key]]); });
    const body = '<dl class="divide-y divide-slate-100">' + pairs.map(function (pair) {
      return '<div class="flex items-center justify-between gap-4 py-2"><dt class="text-slate-400">' + esc(pair[0]) + '</dt><dd class="font-semibold text-slate-900 text-right">' + esc(pair[1]) + "</dd></div>";
    }).join("") + "</dl>";
    openModal(row.a, body, [
      { label: "Edit", primary: true, close: false, run: function () { openRecordForm(data, row); } },
      { label: "Versions", close: false, run: function () { openRecordVersions(row); } },
      { label: "Delete", close: false, run: function () {
        openModal("Delete " + row.a, "<p>This removes the record from " + esc(document.getElementById("term-label").textContent) + ".</p>", [
          { label: "Delete", primary: true, close: false, run: function () { deleteRows(data, [row.id]); } },
          { label: "Back", close: false, run: function () { openRecordDetail(data, row); } },
        ]);
      } },
      { label: "Close", run: function () {} },
    ]);
  }

  function currentView() {
    const meta = window.LarcelNav && window.LarcelNav.byId[state.page];
    return meta && meta.view ? meta.view : state.page;
  }

  function gridItems(grid) {
    return (grid.stash || []).filter(function (item) { return !grid.hidden[item.id]; });
  }

  function gridBy(attr, key) {
    const nodes = document.querySelectorAll("[" + attr + "]");
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].getAttribute(attr) === key) return nodes[i];
    }
    return null;
  }

  function gridTable(key) {
    const tables = document.querySelectorAll("table[data-grid]");
    for (let i = 0; i < tables.length; i++) {
      if (tables[i].getAttribute("data-grid") === key) return tables[i];
    }
    return null;
  }

  function gridHost(table) {
    const parent = table.parentElement;
    if (parent && parent.classList.contains("overflow-x-auto")) return parent;
    return table;
  }

  function gridShown(grid) {
    const query = (grid.query || "").trim().toLowerCase();
    const filter = grid.filter || "";
    const group = grid.group || "";
    return gridItems(grid).filter(function (item) {
      if (filter && item.filter !== filter) return false;
      if (group && item.group !== group) return false;
      if (!query) return true;
      return (item.text || "").toLowerCase().indexOf(query) !== -1;
    });
  }

  function gridRowHtml(key, id, cells) {
    const boxes = '<td class="py-2.5 px-3"><input type="checkbox" data-grid-box="' + esc(key) + '" data-grid-id="' + esc(id) + '" class="rounded border-slate-300 text-slate-900 focus:ring-slate-400" aria-label="Select row" /></td>';
    const body = cells.map(function (cell, index) {
      return '<td class="py-2.5 px-3 ' + (index === 0 ? "font-medium text-slate-900" : "text-slate-600") + '">' + esc(cell) + "</td>";
    }).join("");
    return "<tr>" + boxes + body + '<td class="py-2.5 px-3 text-right whitespace-nowrap">' + rowActions("grid", id, ' data-grid="' + esc(key) + '"') + "</td></tr>";
  }

  function gridRecord(key, id, cells, html) {
    return {
      id: id,
      cells: cells,
      filter: cells.length ? cells[cells.length - 1] : "",
      group: cells.length > 2 ? cells[1] : "",
      text: cells.join(" "),
      html: html || gridRowHtml(key, id, cells),
    };
  }

  function paintGrid(table, key) {
    const grid = state.grids[key];
    if (!grid || !table) return;
    const items = gridShown(grid);
    const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE) || 1);
    if (grid.page > pages - 1) grid.page = pages - 1;
    if (grid.page < 0) grid.page = 0;
    const start = grid.page * PAGE_SIZE;
    const slice = items.slice(start, start + PAGE_SIZE);
    const body = table.tBodies[0];
    const cols = table.tHead && table.tHead.rows[0] ? table.tHead.rows[0].cells.length : 1;
    const emptyText = (grid.query || grid.filter) ? "No rows match that search or filter." : "No rows on this page.";
    body.innerHTML = slice.length
      ? slice.map(function (item) { return item.html; }).join("")
      : '<tr><td colspan="' + cols + '" class="py-10 px-3 text-center text-sm text-slate-400">' + emptyText + "</td></tr>";
    body.querySelectorAll("[data-grid-box]").forEach(function (box) {
      box.checked = !!grid.selected[box.dataset.gridId];
      const row = box.closest("tr");
      if (row) row.classList.toggle("bg-slate-50", box.checked);
    });
    const selectedIds = Object.keys(grid.selected).filter(function (id) {
      return items.some(function (item) { return item.id === id; });
    });
    const onPage = slice.filter(function (item) { return grid.selected[item.id]; }).length;
    const allBox = table.querySelector("[data-grid-all]");
    if (allBox) {
      allBox.disabled = slice.length === 0;
      allBox.checked = slice.length > 0 && onPage === slice.length;
      allBox.indeterminate = onPage > 0 && onPage < slice.length;
    }
    const host = gridHost(table);
    const parent = host.parentElement;
    let bar = gridBy("data-grid-bulk", key);
    if (!bar && parent) {
      bar = document.createElement("div");
      bar.setAttribute("data-grid-bulk", key);
      parent.insertBefore(bar, host);
    }
    if (bar) {
      const pageFull = slice.length > 0 && onPage === slice.length;
      const allChosen = items.length > 0 && selectedIds.length === items.length;
      const mark = currentView() === "users"
        ? '<button type="button" data-action="grid-mark" data-grid="' + esc(key) + '" class="' + primaryBtn + '">Activate</button>'
        : "";
      bar.className = (selectedIds.length ? "flex " : "hidden ") + "flex-wrap items-center gap-2 px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs";
      bar.innerHTML = '<span class="font-semibold text-slate-700">' + selectedIds.length + " selected</span>" +
        (pageFull && !allChosen ? '<button type="button" data-action="grid-select-all" data-grid="' + esc(key) + '" class="text-xs font-semibold text-slate-900 underline">Select all ' + items.length + "</button>" : "") +
        mark +
        '<button type="button" data-action="grid-delete" data-grid="' + esc(key) + '" class="' + ghostBtn + '">Delete</button>' +
        '<button type="button" data-action="grid-clear" data-grid="' + esc(key) + '" class="' + ghostBtn + '">Clear</button>';
    }
    let pager = gridBy("data-grid-pager", key);
    if (!pager && parent) {
      pager = document.createElement("div");
      pager.setAttribute("data-grid-pager", key);
      parent.insertBefore(pager, host.nextSibling);
    }
    if (pager) {
      const from = items.length ? start + 1 : 0;
      const to = start + slice.length;
      pager.className = "flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-xs";
      pager.innerHTML = '<span class="text-slate-500">Showing ' + from + "–" + to + " of " + items.length + '</span><div class="flex flex-wrap items-center gap-1">' + pagerButtons(pages, grid.page, "grid-page", key) + "</div>";
    }
    fillGridSelect(gridBy("data-grid-filter", key), grid, "filter", function (item) { return item.filter; });
    fillGridSelect(gridBy("data-grid-group", key), grid, "group", function (item) { return item.group; });
  }

  function fillGridSelect(select, grid, field, read) {
    if (!select) return;
    const values = [];
    gridItems(grid).forEach(function (item) {
      const value = read(item);
      if (value && values.indexOf(value) === -1) values.push(value);
    });
    values.sort();
    const blank = select.getAttribute("data-blank") || "All";
    const current = grid[field] || "";
    select.innerHTML = '<option value="">' + esc(blank) + "</option>" + values.map(function (value) {
      return '<option value="' + esc(value) + '">' + esc(value) + "</option>";
    }).join("");
    select.value = values.indexOf(current) === -1 ? "" : current;
    if (select.value !== current) grid[field] = select.value;
  }

  function addLike(button) {
    if (!button || button.closest("tbody, thead, [data-grid-tools]")) return false;
    if (button.className.indexOf("h-7") !== -1) return false;
    const label = button.textContent.replace(/\s+/g, " ").trim();
    const action = button.dataset.action || "";
    return /(\+|add |create |new |balance)/i.test(label) || /^(add-|balance-)/.test(action);
  }

  function detachAdds(root) {
    const found = [];
    if (!root) return found;
    Array.prototype.forEach.call(root.querySelectorAll("button"), function (button) {
      if (!addLike(button)) return;
      button.className = primaryBtn;
      found.push(button);
    });
    return found;
  }

  function outsideTable(article, table, selector) {
    const nodes = article.querySelectorAll(selector);
    for (let i = 0; i < nodes.length; i++) {
      if (!table.contains(nodes[i])) return true;
    }
    return false;
  }

  function liftTable(table) {
    const host = gridHost(table);
    const article = host.closest("article");
    const otherTable = article && Array.prototype.some.call(article.querySelectorAll("table"), function (node) { return node !== table; });
    const mixed = !article || otherTable || outsideTable(article, table, "svg, form, dl");
    if (!mixed) {
      article.className = "bg-white rounded-xl border border-slate-200 overflow-hidden";
      return article;
    }
    const card = document.createElement("article");
    card.className = "bg-white rounded-xl border border-slate-200 overflow-hidden";
    const h2 = article && article.querySelector("h2");
    const pageTitle = document.querySelector("#view-stage h1");
    card.dataset.liftTitle = h2 ? h2.textContent.trim() : (pageTitle ? pageTitle.textContent.trim() : "Records");
    const note = h2 && h2.nextElementSibling && h2.nextElementSibling.tagName === "P" ? h2.nextElementSibling : null;
    card.dataset.liftNote = note ? note.textContent.trim() : "";
    const anchor = article && article.parentNode ? article : host;
    anchor.parentNode.insertBefore(card, anchor.nextSibling);
    card.appendChild(host);
    return card;
  }

  function ensureGridTools(table, key, taken) {
    if (gridBy("data-grid-tools", key)) return;
    const grid = state.grids[key];
    const article = liftTable(table);
    const host = gridHost(table);
    const adds = detachAdds(article);
    if (taken && !taken.shell) {
      const stage = document.getElementById("view-stage");
      let row = stage && stage.firstElementChild;
      if (row && row.hasAttribute("data-flow")) row = row.nextElementSibling;
      detachAdds(row).forEach(function (button) { adds.push(button); });
      taken.shell = true;
      if (row) {
        const slot = row.lastElementChild;
        if (slot && slot !== row.firstElementChild && !slot.querySelector("button, a")) slot.remove();
      }
    }
    let title = article.dataset.liftTitle || "";
    let note = article.dataset.liftNote || "";
    const heading = article.querySelector("h2");
    if (!title && heading) {
      title = heading.textContent.trim();
      const next = heading.nextElementSibling;
      if (!note && next && next.tagName === "P") {
        note = next.textContent.trim();
        next.remove();
      }
      const wrap = heading.parentElement;
      heading.remove();
      if (wrap && wrap !== article && !wrap.textContent.trim() && !wrap.querySelector("button, input, select, table")) wrap.remove();
    }
    if (!title) {
      const pageTitle = document.querySelector("#view-stage h1");
      title = pageTitle ? pageTitle.textContent.trim() : "Records";
    }
    if (!note) note = "Browse, search and manage " + plural(title.toLowerCase()) + ".";
    const heads = table.tHead && table.tHead.rows[0] ? Array.prototype.map.call(table.tHead.rows[0].cells, function (cell) {
      return cell.textContent.replace(/\s+/g, " ").trim();
    }).slice(1, -1) : [];
    const statusName = heads.length ? plural(heads[heads.length - 1].toLowerCase()) : "statuses";
    const groupName = heads.length > 2 ? plural(heads[1].toLowerCase()) : "";
    article.querySelectorAll("input, select").forEach(function (field) {
      if (field.closest("table")) return;
      const label = field.closest("label");
      if (label) label.remove();
      else field.remove();
    });
    const header = document.createElement("div");
    header.className = "flex flex-wrap items-center justify-between gap-3 px-5 py-4";
    header.innerHTML = '<div class="min-w-0"><h2 class="text-sm font-semibold text-slate-900">' + esc(title) + '</h2><p class="mt-0.5 text-xs text-slate-500">' + esc(note) + "</p></div>";
    const tools = document.createElement("div");
    tools.setAttribute("data-grid-tools", key);
    tools.className = "flex flex-wrap items-center justify-end gap-2";
    const selectCls = "text-xs rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700";
    tools.innerHTML = '<label class="relative"><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">' + glyph(ICON_SEARCH) + '</span>' +
      '<input data-grid-search="' + esc(key) + '" value="' + esc(grid.query || "") + '" class="w-44 rounded-full border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300" placeholder="Search ' + esc(title.toLowerCase()) + '" /></label>' +
      '<select data-grid-filter="' + esc(key) + '" data-blank="All ' + esc(statusName) + '" class="' + selectCls + '"><option value="">All ' + esc(statusName) + "</option></select>" +
      (groupName ? '<select data-grid-group="' + esc(key) + '" data-blank="All ' + esc(groupName) + '" class="' + selectCls + '"><option value="">All ' + esc(groupName) + "</option></select>" : "") +
      '<button type="button" data-action="grid-import" data-grid="' + esc(key) + '" class="' + ghostBtn + '">' + glyph(ICON_IMPORT) + " Import</button>" +
      '<button type="button" data-action="grid-export" data-grid="' + esc(key) + '" class="' + ghostBtn + '">' + glyph(ICON_EXPORT) + " Export</button>";
    adds.forEach(function (button) { tools.appendChild(button); });
    if (!adds.length) {
      tools.insertAdjacentHTML("beforeend", '<button type="button" data-action="grid-add" data-grid="' + esc(key) + '" class="' + primaryBtn + '">+ New ' + esc(title) + "</button>");
    }
    header.appendChild(tools);
    article.insertBefore(header, article.firstChild);
    Array.prototype.slice.call(article.children).forEach(function (child) {
      if (child === header || child.querySelector("table")) return;
      if (!child.textContent.replace(/\s+/g, "") && !child.querySelector("button, svg, img, select")) child.remove();
    });
    host.classList.add("border-t", "border-slate-100");
    if (table.tHead) table.tHead.className = "bg-slate-50/80 text-[11px] font-medium uppercase tracking-wider text-slate-400";
  }

  function enhanceTables() {
    const stage = document.getElementById("view-stage");
    if (!stage || state.recordId) return;
    const taken = { shell: false };
    stage.querySelectorAll("table").forEach(function (table, index) {
      if (table.dataset.grid || table.dataset.clock || table.dataset.managed) return;
      if (table.querySelector("[data-record-id], #record-all")) return;
      const head = table.tHead && table.tHead.rows[0];
      const body = table.tBodies[0];
      if (!head || !body) return;
      const allRows = Array.prototype.filter.call(body.rows, function (row) { return row.cells.length > 1; });
      if (!allRows.length) return;
      const key = state.page + ":" + index;
      if (!state.grids[key]) state.grids[key] = { page: 0, selected: {}, hidden: {}, stash: [], query: "", filter: "", group: "", edits: {}, extra: [] };
      const grid = state.grids[key];
      if (!grid.hidden) grid.hidden = {};
      if (!grid.selected) grid.selected = {};
      if (!grid.edits) grid.edits = {};
      if (!grid.extra) grid.extra = [];
      if (!grid.group) grid.group = "";
      table.dataset.grid = key;
      const lastLabel = head.cells.length ? head.cells[head.cells.length - 1].textContent.replace(/\s+/g, " ").trim().toLowerCase() : "";
      const lastIsButtons = allRows.some(function (row) { return !!row.cells[row.cells.length - 1].querySelector("button, select"); });
      const hadActions = lastLabel === "actions" || (lastLabel === "" && lastIsButtons);
      const boxHead = document.createElement("th");
      boxHead.className = "py-2 px-3 w-10";
      boxHead.innerHTML = '<input type="checkbox" data-grid-all="' + esc(key) + '" class="rounded border-slate-300 text-slate-900 focus:ring-slate-400" aria-label="Select all on this page" />';
      head.insertBefore(boxHead, head.firstChild);
      if (!hadActions) {
        const actionHead = document.createElement("th");
        actionHead.className = "py-2.5 px-4 text-right font-medium";
        actionHead.textContent = "Actions";
        head.appendChild(actionHead);
      } else {
        const actionHead = head.cells[head.cells.length - 1];
        actionHead.className = "py-2.5 px-4 text-right font-medium";
        if (!actionHead.textContent.trim()) actionHead.textContent = "Actions";
      }
      Array.prototype.forEach.call(head.cells, function (cell, index) {
        if (index === 0 || index === head.cells.length - 1) return;
        const text = cell.textContent.replace(/\s+/g, " ").trim();
        cell.className = "py-2.5 px-3 font-medium";
        cell.innerHTML = '<span class="inline-flex items-center gap-1 uppercase tracking-wider">' + esc(text) + glyph(ICON_CHEVRON) + "</span>";
      });
      const seen = {};
      const stash = [];
      allRows.forEach(function (row) {
        const source = hadActions ? Array.prototype.slice.call(row.cells, 0, -1) : Array.prototype.slice.call(row.cells);
        let id = source.map(function (cell) {
          const pick = cell.querySelector("select");
          if (pick && pick.options[pick.selectedIndex]) return pick.options[pick.selectedIndex].text.trim();
          return cell.textContent.replace(/\s+/g, " ").trim();
        }).join("|");
        if (seen[id]) {
          seen[id] += 1;
          id += "#" + seen[id];
        } else seen[id] = 1;
        const box = document.createElement("td");
        box.className = "py-2.5 px-3";
        box.innerHTML = '<input type="checkbox" data-grid-box="' + esc(key) + '" data-grid-id="' + esc(id) + '" class="rounded border-slate-300 text-slate-900 focus:ring-slate-400" aria-label="Select row" />';
        row.insertBefore(box, row.firstChild);
        const icons = rowActions("grid", id, ' data-grid="' + esc(key) + '"', table.dataset.noView === "1");
        if (hadActions) {
          const last = row.cells[row.cells.length - 1];
          last.classList.add("text-right", "whitespace-nowrap");
          last.insertAdjacentHTML("beforeend", icons);
        } else {
          const actions = document.createElement("td");
          actions.className = "py-2.5 px-3 text-right whitespace-nowrap";
          actions.innerHTML = icons;
          row.appendChild(actions);
        }
        const cells = Array.prototype.slice.call(row.cells, 1, -1).map(function (cell) {
          const pick = cell.querySelector("select");
          if (pick && pick.options[pick.selectedIndex]) return pick.options[pick.selectedIndex].text.trim();
          return cell.textContent.replace(/\s+/g, " ").trim();
        });
        const edited = grid.edits[id];
        if (edited) stash.push(gridRecord(key, id, edited));
        else stash.push(gridRecord(key, id, cells, row.outerHTML));
      });
      (grid.extra || []).forEach(function (item) {
        if (stash.some(function (row) { return row.id === item.id; })) return;
        const cells = grid.edits[item.id] || item.cells;
        stash.push(gridRecord(key, item.id, cells));
      });
      grid.stash = stash;
      ensureGridTools(table, key, taken);
      paintGrid(table, key);
    });
    stage.querySelectorAll("article").forEach(function (article) {
      if (!article.textContent.trim() && !article.querySelector("img, svg, table, input, canvas")) article.remove();
    });
  }

  function gridSelection(key) {
    const grid = state.grids[key];
    if (!grid) return [];
    const live = {};
    gridShown(grid).forEach(function (item) { live[item.id] = true; });
    return Object.keys(grid.selected).filter(function (id) { return live[id]; });
  }

  function findGridItem(grid, id) {
    return (grid.stash || []).filter(function (item) { return item.id === id; })[0] ||
      (grid.extra || []).filter(function (item) { return item.id === id; })[0];
  }

  function syncGridSource(id, cells) {
    const view = currentView();
    if (view === "users") {
      const name = id.split("|")[0];
      const user = state.accounts.filter(function (item) { return item.name === name; })[0];
      if (!user || cells.length < 4) return false;
      user.name = cells[0] || user.name;
      user.email = cells[1] || user.email;
      user.role = cells[2] || user.role;
      user.status = cells[3] || user.status;
      logAudit("Updated user", user.name);
      return true;
    }
    if (view === "audit") {
      const parts = id.split("|");
      const row = state.audits.filter(function (item) {
        return item.who === parts[0] && item.action === parts[1] && item.target === parts[2] && item.when === parts[3];
      })[0];
      if (!row || cells.length < 4) return false;
      row.who = cells[0];
      row.action = cells[1];
      row.target = cells[2];
      row.when = cells[3];
      return true;
    }
    return false;
  }

  function saveGridCells(key, id, cells) {
    const grid = state.grids[key];
    if (!grid) return;
    grid.edits[id] = cells;
    const record = gridRecord(key, id, cells);
    const stash = (grid.stash || []).filter(function (item) { return item.id === id; })[0];
    if (stash) {
      stash.cells = record.cells;
      stash.filter = record.filter;
      stash.text = record.text;
      stash.html = record.html;
    }
    const extra = (grid.extra || []).filter(function (item) { return item.id === id; })[0];
    if (extra) extra.cells = cells.slice();
    if (syncGridSource(id, cells)) {
      show(state.page);
      return;
    }
    paintGrid(gridTable(key), key);
  }

  function openGridEditor(key, id, title) {
    const grid = state.grids[key];
    const table = gridTable(key);
    const item = grid && findGridItem(grid, id);
    if (!grid || !table || !item || !table.tHead) return;
    const heads = Array.prototype.map.call(table.tHead.rows[0].cells, function (cell) {
      return cell.textContent.replace(/\s+/g, " ").trim();
    }).slice(1, -1);
    const fields = item.cells.map(function (cell, index) {
      const label = heads[index] || ("Column " + (index + 1));
      return '<label class="block"><span class="text-[11px] font-semibold text-slate-700">' + esc(label) + '</span><input data-cell="' + index + '" value="' + esc(cell) + '" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2" /></label>';
    }).join("");
    openModal(title, '<form id="grid-edit-form" class="space-y-3">' + fields + "</form>", [
      { label: "Save", primary: true, close: false, run: function () {
        const inputs = document.querySelectorAll("#grid-edit-form [data-cell]");
        const cells = Array.prototype.map.call(inputs, function (input) { return input.value.trim(); });
        if (!cells[0]) { toast("The first field is required"); return; }
        closeModal();
        saveGridCells(key, id, cells);
        toast("Saved");
      } },
      { label: "Cancel", run: function () {} },
    ]);
  }

  function openGridAdd(key) {
    const grid = state.grids[key];
    const table = gridTable(key);
    if (!grid || !table || !table.tHead) return;
    const heads = Array.prototype.map.call(table.tHead.rows[0].cells, function (cell) {
      return cell.textContent.replace(/\s+/g, " ").trim();
    }).slice(1, -1);
    const titleNode = table.closest("article") && table.closest("article").querySelector("h2");
    const title = titleNode ? titleNode.textContent.trim() : "record";
    const fields = heads.map(function (label, index) {
      return '<label class="block"><span class="text-[11px] font-semibold text-slate-700">' + esc(label) + '</span><input data-cell="' + index + '" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2" /></label>';
    }).join("");
    openModal("New " + title, '<form id="grid-edit-form" class="space-y-3">' + fields + "</form>", [
      { label: "Save", primary: true, close: false, run: function () {
        const inputs = document.querySelectorAll("#grid-edit-form [data-cell]");
        const cells = Array.prototype.map.call(inputs, function (input) { return input.value.trim(); });
        if (!cells[0]) { toast("The first field is required"); return; }
        const id = "new-" + Date.now();
        grid.extra = grid.extra || [];
        grid.extra.push({ id: id, cells: cells.slice() });
        grid.stash.push(gridRecord(key, id, cells));
        closeModal();
        paintGrid(table, key);
        toast(title + " added");
      } },
      { label: "Cancel", run: function () {} },
    ]);
  }

  function importRecordRows(data, rows) {
    if (!rows.length) { toast("That file has no rows"); return; }
    let start = 0;
    const head = rows[0].join(" ").toLowerCase();
    if (head.indexOf(String(data.cols[0]).toLowerCase()) !== -1 || head.indexOf("status") !== -1) start = 1;
    let added = 0;
    for (let i = start; i < rows.length; i++) {
      const cells = rows[i];
      if (!cells[0]) continue;
      const status = cells[3] && data.statuses.indexOf(cells[3]) !== -1 ? cells[3] : (data.statuses[0] || "Active");
      data.rows.unshift({ id: data.id + "-import-" + Date.now() + "-" + i, a: cells[0], b: cells[1] || "—", c: cells[2] || "—", status: status });
      added += 1;
    }
    if (!added) { toast("No rows to import"); return; }
    data.page = 0;
    noteChange(data);
    show(state.page);
    toast("Imported " + added);
  }

  function importGridRows(key, rows) {
    const grid = state.grids[key];
    const table = gridTable(key);
    if (!grid || !table || !rows.length) { toast("That file has no rows"); return; }
    const heads = Array.prototype.map.call(table.tHead.rows[0].cells, function (cell) {
      return cell.textContent.replace(/\s+/g, " ").trim().toLowerCase();
    }).slice(1, -1);
    let start = 0;
    if (rows[0].length && heads.length && rows[0][0].toLowerCase() === heads[0]) start = 1;
    if (currentView() === "users") {
      let added = 0;
      for (let i = start; i < rows.length; i++) {
        const cells = rows[i];
        if (!cells[0]) continue;
        state.accounts.unshift({ id: "u" + Date.now() + "-" + i, name: cells[0], email: cells[1] || "", role: cells[2] || "Staff", status: cells[3] || "Invited" });
        added += 1;
      }
      if (!added) { toast("No rows to import"); return; }
      logAudit("Imported users", String(added));
      show(state.page);
      toast("Imported " + added);
      return;
    }
    let added = 0;
    grid.extra = grid.extra || [];
    for (let i = start; i < rows.length; i++) {
      const cells = rows[i].slice();
      if (!cells[0]) continue;
      while (heads.length && cells.length < heads.length) cells.push("");
      const trimmed = heads.length ? cells.slice(0, heads.length) : cells;
      const id = "import-" + Date.now() + "-" + i;
      grid.extra.push({ id: id, cells: trimmed.slice() });
      grid.stash.push(gridRecord(key, id, trimmed));
      added += 1;
    }
    if (!added) { toast("No rows to import"); return; }
    grid.page = 0;
    paintGrid(table, key);
    toast("Imported " + added);
  }

  function exportGridRows(key) {
    const grid = state.grids[key];
    const table = gridTable(key);
    if (!grid || !table || !table.tHead) return;
    const heads = Array.prototype.map.call(table.tHead.rows[0].cells, function (cell) {
      return cell.textContent.replace(/\s+/g, " ").trim();
    }).slice(1, -1);
    const picked = gridSelection(key);
    const items = picked.length ? gridShown(grid).filter(function (item) { return picked.indexOf(item.id) !== -1; }) : gridShown(grid);
    const lines = [heads.map(csvCell).join(",")].concat(items.map(function (item) {
      return (item.cells || []).map(csvCell).join(",");
    }));
    download(state.page + ".csv", lines.join("\n"));
    toast(picked.length ? "Exported " + items.length + " selected" : "Exported the current rows");
  }

  function parkPageTabs() {
    const tabs = document.getElementById("page-tabs");
    const canvas = document.getElementById("canvas");
    if (!tabs || !canvas || tabs.nextElementSibling === canvas) return;
    canvas.parentElement.insertBefore(tabs, canvas);
  }

  function placePageTabs() {
    const tabs = document.getElementById("page-tabs");
    const stage = document.getElementById("view-stage");
    if (!tabs || !stage || stage.classList.contains("hidden")) return;
    if (state.recordId) {
      tabs.classList.add("hidden");
      parkPageTabs();
      return;
    }
    if (tabs.classList.contains("hidden")) return;
    const stats = stage.querySelector("section.grid");
    if (stats) {
      stats.insertAdjacentElement("afterend", tabs);
      return;
    }
    const title = stage.querySelector("h1");
    if (title && title.parentElement) {
      title.parentElement.insertAdjacentElement("afterend", tabs);
      return;
    }
    stage.insertAdjacentElement("afterbegin", tabs);
  }

  function show(id, fromHistory) {
    const nav = window.LarcelNav;
    const resolved = resolvedPage(id);
    const meta = nav && nav.byId[resolved];
    const view = meta && meta.view ? meta.view : (meta ? "" : id);
    const known = view === "dashboard" || (view && PAGES[view]) || !!meta;
    if (!known) return;
    parkPageTabs();
    state.page = resolved;
    const dashboard = document.getElementById("view-dashboard");
    const stage = document.getElementById("view-stage");
    if (view === "dashboard") {
      dashboard.classList.remove("hidden");
      stage.classList.add("hidden");
      stage.innerHTML = "";
    } else {
      dashboard.classList.add("hidden");
      stage.classList.remove("hidden");
      const custom = view && FORM_VIEWS[view] && PAGES[view];
      const body = custom ? PAGES[view]() : workspace(meta);
      stage.innerHTML = body;
      enhanceTables();
    }
    paintNotice();
    document.getElementById("canvas").scrollTop = 0;
    document.documentElement.classList.remove("nav-open");
    if (nav) {
      nav.reveal(resolved);
      nav.paintTabs(resolved);
      placePageTabs();
    }
    syncNav(resolved);
    if (!fromHistory && location.hash !== "#" + resolved) history.pushState({ page: resolved }, "", "#" + resolved);
    closeMenu();
    hideSearch();
  }

  function flowStrip() {
    const nav = window.LarcelNav;
    const meta = nav && nav.byId[state.page];
    if (!meta || !meta.moduleId) return "";
    const steps = nav.pages.filter(function (item) {
      return item.appId === meta.appId && item.moduleId === meta.moduleId && !item.detail && !item.hidden;
    });
    if (steps.length < 2) return "";
    const index = steps.map(function (item) { return item.id; }).indexOf(meta.id);
    const here = index < 0 ? 0 : index;
    const bits = steps.map(function (item, step) {
      const on = item.id === meta.id;
      return '<button type="button" data-action="goto" data-page="' + esc(item.id) + '" class="' + (on ? "font-semibold text-slate-900" : "text-slate-500 hover:text-slate-900") + '">' + (step + 1) + ". " + esc(item.label) + "</button>";
    }).join('<span class="text-slate-300" aria-hidden="true">→</span>');
    const next = here < steps.length - 1 ? steps[here + 1] : null;
    const nextBtn = next
      ? '<button type="button" data-action="goto" data-page="' + esc(next.id) + '" class="' + primaryBtn + ' shrink-0">Next: ' + esc(next.label) + "</button>"
      : "";
    return '<div data-flow="1" class="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs"><div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">' + bits + '</div>' + nextBtn + "</div>";
  }

  function shell(title, lede, body, actions) {
    return flowStrip() + '<div class="flex flex-wrap items-end justify-between gap-3">' +
      '<div><h1 class="text-2xl font-semibold tracking-tight text-slate-900">' + title + "</h1>" +
      '<p class="text-sm text-slate-500 mt-1 max-w-2xl">' + lede + "</p></div>" +
      (actions ? '<div class="flex items-center gap-2">' + actions + "</div>" : "") + "</div>" + body;
  }

  function card(inner) {
    return '<article class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-card">' + inner + "</article>";
  }

  function badge(text, tone) {
    return '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ' + TONE[tone] + '">' + esc(text) + "</span>";
  }

  function studentRowsHtml() {
    const query = state.studentQuery.trim().toLowerCase();
    const rows = state.students.filter(function (student) {
      return !query || (student.name + student.sid + student.grade).toLowerCase().indexOf(query) !== -1;
    });
    if (!rows.length) {
      return '<tr><td colspan="5" class="py-6 px-3 text-center text-slate-400">No students match that search.</td></tr>';
    }
    return rows.map(function (student) {
      const tone = student.status === "Watch" ? "amber" : "emerald";
      return "<tr class=\"hover:bg-slate-50/70\"><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + esc(student.name) +
        "</td><td class=\"py-2.5 px-3 text-slate-500\">" + esc(student.sid) +
        "</td><td class=\"py-2.5 px-3\">" + esc(student.grade) +
        "</td><td class=\"py-2.5 px-3\">" + esc(student.advisor) +
        "</td><td class=\"py-2.5 px-3\">" + badge(student.status, tone) + "</td></tr>";
    }).join("");
  }

  function renderStudentRows() {
    const body = document.getElementById("student-body");
    if (body) body.innerHTML = studentRowsHtml();
  }

  function answerFor(prompt) {
    const text = prompt.toLowerCase();
    if (text.indexOf("algebra") !== -1 || text.indexOf("risk") !== -1) {
      return "14 pupils in Grade 4 Mathematics are below the midterm threshold. Ava Patel and Owen Clarke also have absences this week. I would assign a Tuesday intervention block with Ms. Alvarez.";
    }
    if (text.indexOf("attend") !== -1) {
      return "Little Royals attendance is 94.6% for week 1, against a 96% target. Thursday is the strongest day at 96.8%. Saturday clubs sit at 45%.";
    }
    return "I checked Little Royals Kindergarten & Primary School for " + document.getElementById("term-label").textContent + ". Enrollment is 1,420, 28 pupils are at risk, and 186 applicants are in the current intake.";
  }

  function teacherById(id) {
    return state.teachers.filter(function (teacher) { return teacher.id === id; })[0] || state.teachers[0];
  }

  function openDuties() {
    return state.duties.filter(function (duty) { return levelOn(levelForGrade(duty.grade)); });
  }

  function dutyLoad(teacherId, duties) {
    return duties.filter(function (duty) { return duty.teacherId === teacherId; }).reduce(function (sum, duty) { return sum + duty.periods; }, 0);
  }

  function loadRows() {
    const duties = openDuties();
    const total = duties.reduce(function (sum, duty) { return sum + duty.periods; }, 0);
    const fair = state.teachers.length ? Math.round(total / state.teachers.length) : 0;
    const rows = state.teachers.map(function (teacher) {
      const mine = duties.filter(function (duty) { return duty.teacherId === teacher.id; });
      const load = dutyLoad(teacher.id, duties);
      return { teacher: teacher, mine: mine, load: load, fair: fair };
    }).sort(function (a, b) { return b.load - a.load; });
    const spread = rows.length ? rows[0].load - rows[rows.length - 1].load : 0;
    return { duties: duties, total: total, fair: fair, rows: rows, spread: spread };
  }

  function balanceLoads() {
    const duties = openDuties();
    const ids = state.teachers.map(function (teacher) { return teacher.id; });
    function variance(values) {
      const mean = values.reduce(function (sum, value) { return sum + value; }, 0) / (values.length || 1);
      return values.reduce(function (sum, value) { return sum + (value - mean) * (value - mean); }, 0);
    }
    let moves = 0;
    for (let step = 0; step < 30; step++) {
      const loadOf = {};
      ids.forEach(function (id) { loadOf[id] = dutyLoad(id, duties); });
      const values = ids.map(function (id) { return loadOf[id]; });
      const spread = Math.max.apply(null, values) - Math.min.apply(null, values);
      const current = variance(values);
      if (spread <= 4) break;
      let best = null;
      duties.forEach(function (duty) {
        ids.forEach(function (target) {
          if (target === duty.teacherId) return;
          const next = {};
          ids.forEach(function (id) { next[id] = loadOf[id]; });
          next[duty.teacherId] -= duty.periods;
          next[target] += duty.periods;
          const nextValues = ids.map(function (id) { return next[id]; });
          const nextSpread = Math.max.apply(null, nextValues) - Math.min.apply(null, nextValues);
          const nextVariance = variance(nextValues);
          const better = nextVariance < current - 0.01;
          if (better && (!best || nextVariance < best.variance)) best = { duty: duty, target: target, variance: nextVariance };
        });
      });
      if (!best) break;
      best.duty.teacherId = best.target;
      moves += 1;
    }
    return moves;
  }

  function initials(name) {
    return name.replace(/^(Ms\.|Mr\.|Dr\.)\s*/, "").split(/\s+/).map(function (part) { return part.charAt(0); }).slice(0, 2).join("");
  }

  function nowTime() {
    const now = new Date();
    return String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
  }

  function timeSpan(inn, out) {
    if (!inn || !out) return "—";
    const start = inn.split(":").map(Number);
    const end = out.split(":").map(Number);
    const mins = (end[0] * 60 + end[1]) - (start[0] * 60 + start[1]);
    if (mins < 0) return "—";
    return Math.floor(mins / 60) + "h " + String(mins % 60).padStart(2, "0") + "m";
  }

  const CLOCK_TODAY = new Date(2026, 9, 11);
  const CLOCK_SPANS = [["today", "Today"], ["week", "This week"], ["month", "This month"], ["term", "This term"], ["year", "This year"]];

  function clockSpan() {
    if (state.clockSpan) return state.clockSpan;
    const meta = window.LarcelNav && window.LarcelNav.byId[state.page];
    const view = meta && meta.view;
    if (view === "teacherprofile" || view === "timeweek") return "week";
    return "today";
  }

  function dateKey(date) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  }

  function clockHash(text) {
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function schoolDayList(start, end) {
    const days = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    const halfStart = new Date(2026, 9, 26).getTime();
    const halfEnd = new Date(2026, 9, 30).getTime();
    while (cursor <= last) {
      const weekday = cursor.getDay();
      const time = cursor.getTime();
      if (weekday !== 0 && weekday !== 6 && (time < halfStart || time > halfEnd)) days.push(new Date(cursor.getTime()));
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }

  function spanDates(span) {
    let days = [];
    if (span === "today") days = [new Date(CLOCK_TODAY.getTime())];
    else if (span === "week") days = schoolDayList(new Date(2026, 9, 5), new Date(2026, 9, 9));
    else if (span === "month") days = schoolDayList(new Date(2026, 9, 1), new Date(2026, 9, 31));
    else if (span === "term") days = schoolDayList(new Date(2026, 7, 31), new Date(2026, 10, 27));
    else {
      days = schoolDayList(new Date(2026, 0, 5), new Date(2026, 3, 10))
        .concat(schoolDayList(new Date(2026, 4, 4), new Date(2026, 7, 7)))
        .concat(schoolDayList(new Date(2026, 7, 31), new Date(2026, 10, 27)));
    }
    if (!days.some(function (date) { return date.getTime() === CLOCK_TODAY.getTime(); })) {
      const inside = span === "week" || span === "month" || span === "term" || span === "year";
      if (inside) days.push(new Date(CLOCK_TODAY.getTime()));
    }
    days.sort(function (a, b) { return a - b; });
    return days;
  }

  function spanNote(span) {
    if (span === "today") return "Today, 11 Oct 2026.";
    if (span === "week") return "Today, then Monday to Friday this week.";
    if (span === "month") return "Every school day in October 2026, for each teacher.";
    if (span === "term") return "Term 3, 31 Aug to 27 Nov 2026. Half term is left out.";
    return "The 2026 school year: Term 1, Term 2, and Term 3.";
  }

  function toMinutes(value) {
    const parts = String(value || "").split(":");
    if (parts.length < 2 || parts[0] === "") return 0;
    return Number(parts[0]) * 60 + Number(parts[1]);
  }

  function formatMinutes(mins) {
    const rounded = Math.round(mins);
    return String(Math.floor(rounded / 60)).padStart(2, "0") + ":" + String(rounded % 60).padStart(2, "0");
  }

  function clockOn(teacher, date) {
    if (date.getTime() > CLOCK_TODAY.getTime()) return { inn: "", out: "", status: "Not yet", tone: "slate" };
    if (date.getTime() === CLOCK_TODAY.getTime()) {
      if (!teacher.inTime) return { inn: "", out: "", status: "Not in", tone: "amber" };
      if (!teacher.outTime) return { inn: teacher.inTime, out: "", status: "In", tone: "emerald" };
      return { inn: teacher.inTime, out: teacher.outTime, status: "Out", tone: "slate" };
    }
    const weekIndex = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 }[date.getDay()];
    const inThisWeek = date >= new Date(2026, 9, 5) && date <= new Date(2026, 9, 9);
    if (inThisWeek && weekIndex !== undefined && teacher.week[weekIndex]) {
      const slot = teacher.week[weekIndex];
      const late = toMinutes(slot.in) > toMinutes("07:40");
      return { inn: slot.in, out: slot.out, status: late ? "Late" : "On time", tone: late ? "amber" : "emerald" };
    }
    const hash = clockHash(teacher.id + dateKey(date));
    if (hash % 31 === 0) return { inn: "", out: "", status: "Absent", tone: "rose" };
    const base = teacher.week[weekIndex === undefined ? 0 : weekIndex] || teacher.week[0];
    const inn = formatMinutes(Math.max(6 * 60 + 30, Math.min(8 * 60 + 20, toMinutes(base.in) + (hash % 19) - 6)));
    const out = formatMinutes(Math.max(15 * 60, Math.min(17 * 60, toMinutes(base.out) + ((hash >> 5) % 15) - 4)));
    const late = toMinutes(inn) > toMinutes("07:40");
    return { inn: inn, out: out, status: late ? "Late" : "On time", tone: late ? "amber" : "emerald" };
  }

  function clockRows(teacher, span) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return spanDates(span).map(function (date) {
      const clock = clockOn(teacher, date);
      return {
        day: days[date.getDay()],
        label: date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear(),
        inn: clock.inn,
        out: clock.out,
        status: clock.status,
        tone: clock.tone,
        site: timeSpan(clock.inn, clock.out),
      };
    });
  }

  function clockSummary(rows) {
    const kept = rows.filter(function (row) { return row.inn; });
    const late = rows.filter(function (row) { return row.status === "Late"; }).length;
    const absent = rows.filter(function (row) { return row.status === "Absent"; }).length;
    function avg(list) {
      if (!list.length) return "—";
      return formatMinutes(list.reduce(function (sum, row) { return sum + toMinutes(row); }, 0) / list.length);
    }
    return {
      days: kept.length,
      late: late,
      absent: absent,
      inn: avg(kept.map(function (row) { return row.inn; })),
      out: avg(kept.filter(function (row) { return row.out; }).map(function (row) { return row.out; })),
    };
  }

  function spanBar() {
    const current = clockSpan();
    return '<div class="flex flex-wrap gap-2">' + CLOCK_SPANS.map(function (item) {
      return '<button type="button" data-action="clock-span" data-span="' + item[0] + '" class="' + (current === item[0] ? primaryBtn : ghostBtn) + '">' + item[1] + "</button>";
    }).join("") + "</div>";
  }

  function clockTable(teacher, span) {
    const body = clockRows(teacher, span).map(function (row) {
      return "<tr><td class=\"py-2 px-3 tabular-nums whitespace-nowrap\">" + esc(row.label) + "</td><td class=\"py-2 px-3\">" + esc(row.day) + "</td><td class=\"py-2 px-3 tabular-nums\">" + esc(row.inn || "—") + "</td><td class=\"py-2 px-3 tabular-nums\">" + esc(row.out || "—") + "</td><td class=\"py-2 px-3 tabular-nums\">" + row.site + "</td><td class=\"py-2 px-3\">" + badge(row.status, row.tone) + "</td></tr>";
    }).join("");
    return '<div class="mt-4 max-h-[28rem] overflow-auto"><table data-clock="1" class="w-full text-left text-xs"><thead class="sticky top-0 bg-white text-[11px] uppercase text-slate-400"><tr class="border-y border-slate-100"><th class="py-2 px-3">Date</th><th class="py-2 px-3">Day</th><th class="py-2 px-3">Time in</th><th class="py-2 px-3">Time out</th><th class="py-2 px-3">On site</th><th class="py-2 px-3">Status</th></tr></thead><tbody class="divide-y divide-slate-100">' + body + "</tbody></table></div>";
  }

  function clockBoard(span) {
    let late = 0;
    let absent = 0;
    let days = 0;
    const blocks = state.teachers.map(function (teacher) {
      const summary = clockSummary(clockRows(teacher, span));
      late += summary.late;
      absent += summary.absent;
      days += summary.days;
      return card('<div class="flex flex-wrap items-start justify-between gap-3"><div><h2 class="text-sm font-semibold text-slate-900">' + esc(teacher.name) + '</h2><p class="mt-0.5 text-xs text-slate-500">' + esc(teacher.subject) + " · " + summary.days + " days · in " + summary.inn + " · out " + summary.out + (summary.late ? " · " + summary.late + " late" : "") + "</p></div>" +
        '<button type="button" data-action="open-teacher" data-id="' + teacher.id + '" class="' + ghostBtn + '">Open profile</button></div>' + clockTable(teacher, span));
    }).join("");
    return factRow([
      ["Teachers", String(state.teachers.length), "each clock below"],
      ["Days", String(days), "with a time in"],
      ["Late", String(late), late ? "after 07:40" : "none late", late ? "amber" : ""],
      ["Absent", String(absent), absent ? "no time in" : "none absent", absent ? "amber" : ""],
    ]) + spanBar() + blocks;
  }

  function clockStatus(teacher) {
    if (teacher.inTime && teacher.outTime) return { label: "Out", tone: "slate" };
    if (teacher.inTime) return { label: "In", tone: "emerald" };
    return { label: "Not in", tone: "amber" };
  }

  function clockActions(teacher) {
    if (!teacher.inTime) return '<button type="button" data-action="clock-in" data-id="' + teacher.id + '" class="' + primaryBtn + '">Time in</button>';
    if (!teacher.outTime) return '<button type="button" data-action="clock-out" data-id="' + teacher.id + '" class="' + ghostBtn + '">Time out</button>';
    return '<span class="text-slate-400">Day closed</span>';
  }

  function disciplineTone(status) {
    if (status === "Closed") return "emerald";
    if (status === "Open") return "amber";
    return "slate";
  }

  function disciplineBoard(history) {
    const cases = [];
    state.teachers.forEach(function (teacher) {
      teacher.discipline.forEach(function (item) {
        cases.push({ teacher: teacher, item: item });
      });
    });
    const shown = history ? cases : cases.filter(function (entry) { return entry.item.status !== "Closed"; });
    const open = shown.filter(function (entry) { return entry.item.status === "Open"; }).length;
    const closed = cases.filter(function (entry) { return entry.item.status === "Closed"; }).length;
    const watching = shown.filter(function (entry) { return entry.item.status !== "Open" && entry.item.status !== "Closed"; }).length;
    const people = {};
    shown.forEach(function (entry) { people[entry.teacher.id] = true; });
    const rows = shown.map(function (entry) {
      const teacher = entry.teacher;
      const item = entry.item;
      const action = item.status === "Closed"
        ? '<span class="text-slate-400">Closed</span>'
        : '<button type="button" data-action="resolve-discipline" data-id="' + teacher.id + '" data-case="' + item.id + '" class="text-sky-600 font-semibold">Resolve</button>';
      return "<tr><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + esc(teacher.name) + "</td><td class=\"py-2.5 px-3\">" + esc(item.date) + "</td><td class=\"py-2.5 px-3\">" + esc(item.kind) + "</td><td class=\"py-2.5 px-3 text-slate-500\">" + esc(item.note) + "</td><td class=\"py-2.5 px-3\">" + badge(item.status, disciplineTone(item.status)) + "</td><td class=\"py-2.5 px-3\">" + action + "</td></tr>";
    });
    const body = rows.length ? rows.join("") : '<tr><td colspan="6" class="py-6 px-3 text-center text-slate-400">No cases in this list.</td></tr>';
    const stats = history
      ? factRow([["Cases", String(shown.length), "including closed"], ["Open", String(open), open ? "need a look" : "none open", open ? "amber" : ""], ["Closed", String(closed), closed ? "resolved" : "none yet"], ["Teachers", String(Object.keys(people).length), "on this list"]])
      : factRow([["Cases", String(shown.length), shown.length ? "still on the list" : "none open"], ["Open", String(open), open ? "need a look" : "none open", open ? "amber" : ""], ["Watching", String(watching), watching ? "being followed" : "none waiting"], ["Teachers", String(Object.keys(people).length), "with a case"]]);
    return shell(history ? "Case history" : "Discipline", history ? "Every teacher discipline case, including closed ones." : "Open and monitoring cases for Little Royals teachers.",
      stats + card('<div class="overflow-x-auto"><table class="w-full text-left text-xs"><thead class="text-[11px] uppercase text-slate-400 border-y border-slate-100"><tr><th class="py-2 px-3">Teacher</th><th class="py-2 px-3">Date</th><th class="py-2 px-3">Type</th><th class="py-2 px-3">Note</th><th class="py-2 px-3">Status</th><th class="py-2 px-3"></th></tr></thead><tbody class="divide-y divide-slate-100">' + body + "</tbody></table></div>"),
      '<button type="button" data-action="add-discipline" class="' + primaryBtn + '">Add case</button>');
  }

  function pupilById(id) {
    return state.pupils360.filter(function (pupil) { return pupil.id === id; })[0] || state.pupils360[0];
  }

  function monthGrid(year, month, marks) {
    const first = new Date(year, month, 1).getDay();
    const count = new Date(year, month + 1, 0).getDate();
    const heads = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(function (day) {
      return '<div class="px-1.5 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400 bg-slate-50">' + day + "</div>";
    }).join("");
    let cells = "";
    for (let i = 0; i < first; i++) cells += '<div class="min-h-[4.5rem] bg-slate-50/50 border-t border-slate-100"></div>';
    for (let day = 1; day <= count; day++) {
      const mark = marks[day];
      const today = year === 2026 && month === 9 && day === 11;
      cells += '<div class="min-h-[4.5rem] p-1.5 border-t border-slate-100 ' + (today ? "bg-sky-50" : "bg-white") + '"><p class="text-[11px] font-semibold ' + (today ? "text-sky-700" : "text-slate-500") + '">' + day + (today ? " · today" : "") + "</p>" +
        (mark ? '<p class="mt-1 text-[10px] leading-snug font-medium ' + mark.color + '">' + esc(mark.label) + "</p>" : "") + "</div>";
    }
    return '<div class="grid grid-cols-7 overflow-hidden rounded-lg border border-slate-100">' + heads + cells + "</div>";
  }

  function usageReports() {
    const watch = state.pupils360.filter(function (pupil) { return pupil.status === "Watch"; });
    const absent = state.roster.filter(function (row) { return !row.present; });
    const present = state.roster.length - absent.length;
    const enrolled = state.applicants.filter(function (row) { return row.status === "Enrolled"; }).length;
    const inNow = state.teachers.filter(function (teacher) { return teacher.inTime && !teacher.outTime; }).length;
    const staffOpen = state.teachers.reduce(function (count, teacher) {
      return count + teacher.discipline.filter(function (item) { return item.status !== "Closed"; }).length;
    }, 0);
    const health = state.pupils360.filter(function (pupil) {
      return pupil.health.allergies !== "None" || pupil.health.conditions !== "None" || pupil.health.clinic !== "Up to date";
    });
    const pupilOpen = state.cases.filter(function (item) { return item.status !== "Resolved"; }).length;
    const payments = state.audits.filter(function (row) { return row.action === "Recorded payment"; }).length;
    const unread = state.notices.filter(function (note) { return !note.read; }).length;
    const activeAccounts = state.accounts.filter(function (account) { return account.status === "Active"; }).length;
    return [
      { name: "Enrollment", blurb: "The roll and who is still joining.", items: [
        { name: "School roll", figure: String(state.pupils360.length), detail: watch.length + " pupils on watch" },
        { name: "Admissions", figure: String(state.applicants.length), detail: enrolled + " enrolled, " + (state.applicants.length - enrolled) + " still in the office" }
      ]},
      { name: "Attendance", blurb: "Who was marked in today.", items: [
        { name: "Daily register", figure: present + " / " + state.roster.length, detail: "Present on today's register" },
        { name: "Absences", figure: String(absent.length), detail: absent.map(function (row) { return row.name; }).join(", ") || "None today" }
      ]},
      { name: "Academics", blurb: "Exams and the grade alert in use this term.", items: [
        { name: "Exams scheduled", figure: String(state.exams.length), detail: state.exams.map(function (exam) { return exam.name; }).join(", ") },
        { name: "Grade alert", figure: "14 pupils", detail: "Grade 4 Mathematics below the midterm line" }
      ]},
      { name: "People", blurb: "Staff time and open staff matters.", items: [
        { name: "Teachers on site", figure: inNow + " / " + state.teachers.length, detail: "Clocked in and not yet out" },
        { name: "Staff matters", figure: String(staffOpen), detail: "Discipline cases still open" }
      ]},
      { name: "Care", blurb: "Health flags and pupil cases.", items: [
        { name: "Health flags", figure: String(health.length), detail: health.map(function (pupil) { return pupil.name; }).join(", ") || "None" },
        { name: "Pupil cases", figure: String(pupilOpen), detail: "Open academic, attendance, and wellness cases" }
      ]},
      { name: "Finance", blurb: "Payments and receipts recorded on the system.", items: [
        { name: "Payments recorded", figure: String(payments), detail: "Payments written into the activity record" },
        { name: "Fee receipts", figure: "6 waiting", detail: "Kindergarten receipts still to be checked" }
      ]},
      { name: "System use", blurb: "What people have done on the system.", items: [
        { name: "Actions recorded", figure: String(state.audits.length), detail: state.audits.map(function (row) { return row.action; }).join(", ") },
        { name: "Notices", figure: String(unread) + " unread", detail: state.notices.length + " notices this term" },
        { name: "Accounts in use", figure: String(activeAccounts), detail: state.accounts.length + " accounts, " + (state.accounts.length - activeAccounts) + " invited" }
      ]}
    ];
  }

  function chartNum(value) {
    return (Math.round(value * 100) / 100).toFixed(2);
  }

  function shareOf(part, total) {
    if (!total) return 0;
    return Math.round(part / total * 100);
  }

  function meanOf(list) {
    if (!list.length) return 0;
    return list.reduce(function (sum, value) { return sum + value; }, 0) / list.length;
  }

  function donutChart(parts, center, caption) {
    const slices = parts.filter(function (part) { return part.value > 0; });
    const total = slices.reduce(function (sum, part) { return sum + part.value; }, 0) || 1;
    const cx = 80;
    const cy = 80;
    const radius = 68;
    const inner = 42;
    let angle = -Math.PI / 2;
    const paths = slices.map(function (part) {
      const sweep = (part.value / total) * Math.PI * 2;
      if (sweep >= Math.PI * 2 - 0.001) {
        return '<circle cx="80" cy="80" r="55" fill="none" stroke="' + part.color + '" stroke-width="26"/>';
      }
      const start = angle;
      const end = angle + Math.min(sweep, Math.PI * 2 - 0.0001);
      angle += sweep;
      const large = end - start > Math.PI ? 1 : 0;
      function point(r, theta) {
        return chartNum(cx + r * Math.cos(theta)) + " " + chartNum(cy + r * Math.sin(theta));
      }
      return '<path d="M ' + point(radius, start) + " A " + radius + " " + radius + " 0 " + large + " 1 " + point(radius, end) + " L " + point(inner, end) + " A " + inner + " " + inner + " 0 " + large + " 0 " + point(inner, start) + ' Z" fill="' + part.color + '"/>';
    }).join("");
    const legend = slices.map(function (part) {
      return '<li class="flex items-center justify-between gap-3"><span class="flex min-w-0 items-center gap-2"><span class="h-2.5 w-2.5 shrink-0 rounded-full" style="background:' + part.color + '"></span><span class="truncate text-slate-600">' + esc(part.label) + '</span></span><span class="shrink-0 font-semibold tabular-nums text-slate-900">' + Number(part.value).toLocaleString("en-UG") + ' <span class="font-normal text-slate-400">' + shareOf(part.value, total) + "%</span></span></li>";
    }).join("");
    return '<div class="flex flex-col items-center gap-5 sm:flex-row">' +
      '<svg viewBox="0 0 160 160" class="h-40 w-40 shrink-0" role="img" aria-label="' + esc(caption) + '">' + paths +
      '<text x="80" y="78" text-anchor="middle" font-size="18" font-weight="700" fill="#0f172a">' + esc(center) + '</text>' +
      '<text x="80" y="96" text-anchor="middle" font-size="9" fill="#64748b">' + esc(caption) + "</text></svg>" +
      '<ul class="w-full space-y-2 text-xs">' + legend + "</ul></div>";
  }

  function barChart(rows) {
    const max = Math.max.apply(null, rows.map(function (row) { return row.value; }).concat([1]));
    return '<div class="space-y-3">' + rows.map(function (row) {
      const width = Math.max(3, Math.round(row.value / max * 100));
      const color = row.color || (row.value >= 85 ? "#059669" : row.value >= 75 ? "#1e4b9b" : "#d97706");
      return '<div><div class="mb-1 flex items-baseline justify-between gap-3 text-xs"><span class="font-medium text-slate-700">' + esc(row.label) + '</span><span class="font-semibold tabular-nums text-slate-900">' + esc(row.display || String(row.value)) + '</span></div><div class="h-2 rounded-full bg-slate-100"><div class="h-2 rounded-full" style="width:' + width + "%;background:" + color + '"></div></div>' +
        (row.note ? '<p class="mt-1 text-[11px] text-slate-400">' + esc(row.note) + "</p>" : "") + "</div>";
    }).join("") + "</div>";
  }

  function lineChart(points) {
    const width = 360;
    const height = 156;
    const padX = 36;
    const padY = 18;
    const min = 88;
    const max = 100;
    const coords = points.map(function (point, index) {
      const x = padX + (points.length < 2 ? 0 : index / (points.length - 1) * (width - padX * 2));
      const y = padY + (1 - (point.value - min) / (max - min)) * (height - padY - 36);
      return { x: x, y: y, label: point.label, value: point.value };
    });
    const line = coords.map(function (coord, index) {
      return (index ? "L" : "M") + chartNum(coord.x) + " " + chartNum(coord.y);
    }).join(" ");
    const floor = height - 32;
    const area = line + " L " + chartNum(coords[coords.length - 1].x) + " " + floor + " L " + chartNum(coords[0].x) + " " + floor + " Z";
    const targetY = padY + (1 - (96 - min) / (max - min)) * (height - padY - 36);
    const marks = coords.map(function (coord) {
      return '<circle cx="' + chartNum(coord.x) + '" cy="' + chartNum(coord.y) + '" r="3.5" fill="#1e4b9b" stroke="#fff" stroke-width="1.5"/>' +
        '<text x="' + chartNum(coord.x) + '" y="' + (height - 16) + '" text-anchor="middle" font-size="9" font-weight="700" fill="#0f172a">' + coord.value + '</text>' +
        '<text x="' + chartNum(coord.x) + '" y="' + (height - 4) + '" text-anchor="middle" font-size="9" fill="#64748b">' + esc(coord.label) + "</text>";
    }).join("");
    return '<svg viewBox="0 0 ' + width + " " + height + '" class="h-44 w-full" role="img" aria-label="Attendance by week">' +
      '<line x1="' + padX + '" y1="' + chartNum(targetY) + '" x2="' + (width - 8) + '" y2="' + chartNum(targetY) + '" stroke="#d97706" stroke-dasharray="3 3"/>' +
      '<text x="4" y="' + chartNum(targetY + 3) + '" font-size="8" fill="#d97706">96%</text>' +
      '<path d="' + area + '" fill="#1e4b9b" opacity="0.08"/><path d="' + line + '" fill="none" stroke="#1e4b9b" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>' + marks + "</svg>";
  }

  function columnChart(points) {
    return '<div class="flex h-40 items-end gap-2">' + points.map(function (point) {
      const height = Math.max(8, Math.min(100, point.value));
      const color = point.value >= 96 ? "#059669" : point.value >= 90 ? "#1e4b9b" : "#d97706";
      return '<div class="flex h-full min-w-0 flex-1 flex-col items-center"><span class="text-[10px] font-semibold tabular-nums text-slate-700">' + point.value + '</span><div class="relative mt-1 w-full flex-1"><div class="absolute inset-x-0 bottom-0 rounded-t-md" style="height:' + height + "%;background:" + color + '"></div></div><span class="mt-1 text-[10px] text-slate-400">' + esc(point.label) + "</span></div>";
    }).join("") + "</div>";
  }

  function chartHead(title, note) {
    return '<div class="mb-4"><h2 class="text-sm font-semibold text-slate-900">' + esc(title) + '</h2><p class="mt-0.5 text-xs leading-relaxed text-slate-500">' + esc(note) + "</p></div>";
  }

  function cellNum(value) {
    return '<span class="tabular-nums font-semibold text-slate-900">' + esc(String(value)) + "</span>";
  }

  function reportTable(headers, rows) {
    const head = headers.map(function (label) {
      return '<th class="py-2 px-3 font-medium">' + esc(label) + "</th>";
    }).join("");
    const body = rows.length ? rows.map(function (cells) {
      return '<tr class="hover:bg-slate-50/70">' + cells.map(function (cell, index) {
        return '<td class="py-2.5 px-3 align-top ' + (index === 0 ? "font-semibold text-slate-900" : "text-slate-600") + '">' + cell + "</td>";
      }).join("") + "</tr>";
    }).join("") : '<tr><td colspan="' + headers.length + '" class="py-6 px-3 text-center text-slate-400">Nothing in this table.</td></tr>';
    return '<div class="overflow-x-auto"><table data-report-table="1" class="w-full text-left text-xs"><thead class="border-y border-slate-100 text-[11px] uppercase tracking-wide text-slate-400"><tr>' + head + '</tr></thead><tbody class="divide-y divide-slate-100">' + body + "</tbody></table></div>";
  }

  function reportModel() {
    const week = WEEKS[state.week] || WEEKS[1];
    const weekPoints = [1, 2, 3, 4].map(function (index) {
      return { label: "W" + index, value: parseFloat(WEEKS[index].avg) };
    });
    const dayRates = week.bars.map(function (pair) { return pair[1]; });
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(function (label, index) {
      return { label: label, value: dayRates[index] };
    });
    const weekday = Math.round(meanOf(dayRates.slice(0, 5)) * 10) / 10;
    const weekend = Math.round(meanOf(dayRates.slice(5)) * 10) / 10;
    const soft = weekPoints.slice().sort(function (a, b) { return a.value - b.value; })[0];
    const attendance = parseFloat(week.avg);
    const gap = Math.round((96 - attendance) * 10) / 10;
    const roll = [
      { label: "Kindergarten", value: 380, color: "#0ea5e9" },
      { label: "Grade 1–2", value: 360, color: "#6366f1" },
      { label: "Grade 3–4", value: 345, color: "#d97706" },
      { label: "Grade 5–6", value: 335, color: "#059669" },
    ];
    const benches = visibleBenchmarks();
    const met = benches.filter(function (item) { return meetsBench(item.target, item.result); });
    const below = benches.filter(function (item) { return !meetsBench(item.target, item.result); });
    const statusColors = { Enrolled: "#059669", Interviewing: "#d97706", "Documentation Pending": "#64748b" };
    const admissionCounts = {};
    state.applicants.forEach(function (row) { admissionCounts[row.status] = (admissionCounts[row.status] || 0) + 1; });
    const admissions = Object.keys(admissionCounts).map(function (status) {
      return { label: status, value: admissionCounts[status], color: statusColors[status] || "#1e4b9b" };
    });
    const waiting = state.applicants.filter(function (row) { return row.status !== "Enrolled"; });
    const marks = { A: 95, "A-": 90, "B+": 85, B: 80, "B-": 75, "C+": 70, C: 65, "C-": 60, D: 50 };
    const buckets = {};
    state.pupils360.forEach(function (pupil) {
      pupil.marks.forEach(function (pair) {
        if (!buckets[pair[0]]) buckets[pair[0]] = [];
        buckets[pair[0]].push(marks[pair[1]] || 70);
      });
    });
    const subjects = Object.keys(buckets).map(function (name) {
      const values = buckets[name];
      const avg = Math.round(meanOf(values));
      return { label: name, value: avg, display: avg + "%", note: values.length + (values.length === 1 ? " class mark" : " class marks") };
    }).sort(function (a, b) { return b.value - a.value; });
    const weakest = subjects.slice().sort(function (a, b) { return a.value - b.value; })[0];
    const onSite = state.teachers.filter(function (teacher) { return teacher.inTime && !teacher.outTime; }).length;
    const signedOut = state.teachers.filter(function (teacher) { return teacher.outTime; }).length;
    const notIn = state.teachers.length - onSite - signedOut;
    const staff = [
      { label: "On site", value: onSite, color: "#059669" },
      { label: "Signed out", value: signedOut, color: "#1e4b9b" },
      { label: "Not in yet", value: notIn, color: "#d97706" },
    ];
    const exams = state.exams.filter(function (exam) { return levelOn(exam.level); }).slice().sort(function (a, b) {
      return (Date.parse(a.when) || 0) - (Date.parse(b.when) || 0);
    });
    const examLevels = {};
    exams.forEach(function (exam) { examLevels[exam.level] = (examLevels[exam.level] || 0) + 1; });
    const examBars = Object.keys(examLevels).map(function (level) {
      return { label: level, value: examLevels[level], display: String(examLevels[level]), color: "#1e4b9b", note: examLevels[level] === 1 ? "1 paper this month" : examLevels[level] + " papers this month" };
    });
    const watch = state.pupils360.filter(function (pupil) { return pupil.status === "Watch"; });
    const belowLine = below.slice(0, 3).map(function (item) {
      return item.area + " in " + item.cohort + " is " + item.result + " against a target of " + item.target;
    }).join(". ");
    const insights = [
      {
        tone: gap > 0 ? "amber" : "emerald",
        kicker: gap > 0 ? "Attendance" : "On target",
        title: gap > 0 ? "Week " + state.week + " sits " + gap + " points under 96%" : "Attendance is on the 96% target",
        body: "The week average is " + week.avg + ". Teaching days average " + weekday + "%. Saturday and Sunday average " + weekend + "%, so the weekly figure is not the classroom rate. " + soft.label.replace("W", "Week ") + " is the lowest week at " + soft.value + "%.",
        page: "academics-attendance-daily-attendance",
        action: "Open attendance",
      },
      below.length ? {
        tone: "rose",
        kicker: "Benchmarks",
        title: below.length + (below.length === 1 ? " benchmark is under target" : " benchmarks are under target"),
        body: belowLine + (below.length > 3 ? ". " + (below.length - 3) + " more are also below." : ".") + " " + met.length + " of " + benches.length + " are meeting for " + schoolLevelLabel() + ".",
        page: "academics-benchmarks-school-benchmarks",
        action: "Open benchmarks",
      } : {
        tone: "emerald",
        kicker: "Benchmarks",
        title: "Every open benchmark is meeting its target",
        body: benches.length + " benchmarks are on for " + schoolLevelLabel() + ", and each result is at or above the target.",
        page: "academics-benchmarks-school-benchmarks",
        action: "Open benchmarks",
      },
      {
        tone: "amber",
        kicker: "Pupils to see",
        title: watch.length + " pupils are on the live watch list",
        body: (watch.map(function (pupil) { return pupil.name + " is at " + pupil.attendance + " attendance"; }).join(". ") || "No named watch cases.") + ". The campus flag still shows 28 at-risk pupils: 18 academic and 10 chronic absence. Grade 4 Mathematics has 14 pupils under the midterm line.",
        page: "care-behavior-behavior-records",
        action: "Open cases",
      },
      {
        tone: "sky",
        kicker: "Admissions",
        title: waiting.length + " applications are still with the office",
        body: (admissionCounts.Interviewing || 0) + " are interviewing and " + (admissionCounts["Documentation Pending"] || 0) + " are waiting on documents. " + (admissionCounts.Enrolled || 0) + " of " + state.applicants.length + " in this list are already enrolled.",
        page: "school-admissions-applications",
        action: "Open admissions",
      },
      {
        tone: "sky",
        kicker: "Exams",
        title: exams.length ? exams.length + " papers are on the board for " + schoolLevelLabel() : "No exams for the levels that are on",
        body: exams.length ? "The next paper is " + exams[0].name + " on " + exams[0].when + " with " + exams[0].teacher + " in " + exams[0].room + "." : "Turn on a school level in Settings to bring its exam dates into this report.",
        page: "academics-exams-exam-setup",
        action: "Open exams",
      },
      {
        tone: "amber",
        kicker: "Office queue",
        title: "6 kindergarten receipts are still unchecked",
        body: state.notices.filter(function (note) { return !note.read; }).length + " notices are unread. The fee batch is the one that holds the bursar, alongside the Grade 4 mathematics alert.",
        page: "finance-payments-receipts",
        action: "Open receipts",
      },
    ];
    return {
      week: week,
      weekPoints: weekPoints,
      days: days,
      weekday: weekday,
      weekend: weekend,
      attendance: attendance,
      gap: gap,
      roll: roll,
      benches: benches,
      met: met,
      below: below,
      admissions: admissions,
      waiting: waiting,
      subjects: subjects,
      weakest: weakest,
      staff: staff,
      onSite: onSite,
      exams: exams,
      examBars: examBars,
      soft: soft,
      insights: insights,
    };
  }

  const PAGES = {
    schoolcalendar: function () {
      const marks = {
        2: { label: "Sports day", color: "text-emerald-700" },
        16: { label: "Parents afternoon", color: "text-sky-700" },
        18: { label: "Grade 4 exam", color: "text-rose-700" },
        21: { label: "Science practical", color: "text-rose-700" },
        24: { label: "English exam", color: "text-rose-700" },
        26: { label: "Half term starts", color: "text-amber-700" },
      };
      const dates = Object.keys(marks);
      const exams = dates.filter(function (day) { return marks[day].color.indexOf("rose") !== -1; }).length;
      return shell("School calendar", "Term 3, 2026 at Little Royals. October shows exams, parents afternoon, and half term.",
        factRow([
          ["Dates", String(dates.length), "marked in October"],
          ["Exams", String(exams), exams ? "on this month" : "none this month", exams ? "amber" : ""],
          ["Other", String(dates.length - exams), "sports, parents, half term"],
          ["Term", "3", "2026 · Aug to Nov"],
        ]) +
        card(monthGrid(2026, 9, marks)) +
        card('<ul class="text-xs divide-y divide-slate-100"><li class="py-2 flex justify-between"><span>Term opens</span><strong class="text-slate-900">31 Aug 2026</strong></li><li class="py-2 flex justify-between"><span>Half term</span><strong class="text-slate-900">26–30 Oct 2026</strong></li><li class="py-2 flex justify-between"><span>Term closes</span><strong class="text-slate-900">27 Nov 2026</strong></li></ul>'));
    },
    eventscalendar: function () {
      const marks = {
        9: { label: "Coffee morning", color: "text-sky-700" },
        14: { label: "Swimming gala", color: "text-emerald-700" },
        17: { label: "Museum trip", color: "text-amber-700" },
        23: { label: "Prize rehearsal", color: "text-sky-700" },
        31: { label: "Culture day", color: "text-emerald-700" },
      };
      const events = [
        ["9 Oct", "Parent coffee morning", "Hall", "08:00"],
        ["14 Oct", "Swimming gala", "Pool", "09:30"],
        ["17 Oct", "Grade 2 museum trip", "Nairobi Museum", "08:15"],
        ["23 Oct", "Prize-giving rehearsal", "Hall", "14:00"],
        ["31 Oct", "Culture day", "Whole school", "08:00"],
      ];
      const places = {};
      events.forEach(function (row) { places[row[2]] = true; });
      const rows = events.map(function (row) {
        return "<tr><td class=\"py-2.5 px-3 tabular-nums\">" + row[0] + "</td><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + row[1] + "</td><td class=\"py-2.5 px-3\">" + row[2] + "</td><td class=\"py-2.5 px-3 tabular-nums\">" + row[3] + "</td></tr>";
      }).join("");
      return shell("Events calendar", "School events for October, separate from the term calendar.",
        factRow([
          ["Events", String(events.length), "in October"],
          ["Places", String(Object.keys(places).length), "hall, pool, and trips"],
          ["Morning", String(events.filter(function (row) { return row[3] < "12:00"; }).length), "start before noon"],
          ["Month", "Oct", "Term 3, 2026"],
        ]) +
        card(monthGrid(2026, 9, marks)) +
        card('<table class="w-full text-left text-xs"><thead class="text-[11px] uppercase text-slate-400 border-y border-slate-100"><tr><th class="py-2 px-3">Date</th><th class="py-2 px-3">Event</th><th class="py-2 px-3">Place</th><th class="py-2 px-3">Start</th></tr></thead><tbody class="divide-y divide-slate-100">' + rows + "</tbody></table>"));
    },
    schooltime: function () {
      const bells = [
        ["07:15", "Gates open", "Front gate"],
        ["07:40", "Assembly", "Hall"],
        ["08:00", "Period 1", "Classrooms"],
        ["08:40", "Period 2", "Classrooms"],
        ["09:20", "Break", "Playground"],
        ["09:40", "Period 3", "Classrooms"],
        ["10:20", "Period 4", "Classrooms"],
        ["11:00", "Lunch", "Dining hall"],
        ["12:00", "Period 5", "Classrooms"],
        ["12:40", "Period 6", "Classrooms"],
        ["13:20", "Clubs", "Assigned rooms"],
        ["15:00", "Dismissal", "Front gate"],
        ["16:00", "Gates close", "Front gate"],
      ];
      const rows = bells.map(function (bell) {
        return "<tr><td class=\"py-2.5 px-3 tabular-nums font-semibold text-slate-900\">" + bell[0] + "</td><td class=\"py-2.5 px-3\">" + bell[1] + "</td><td class=\"py-2.5 px-3 text-slate-500\">" + bell[2] + "</td></tr>";
      }).join("");
      const lessons = bells.filter(function (bell) { return bell[1].indexOf("Period") === 0; }).length;
      return shell("School time", "The Little Royals day, from gate open to gate close.",
        factRow([
          ["Bells", String(bells.length), "from open to close"],
          ["Lessons", String(lessons), "teaching periods"],
          ["Opens", bells[0][0], bells[0][1]],
          ["Closes", bells[bells.length - 1][0], bells[bells.length - 1][1]],
        ]) +
        card('<table class="w-full text-left text-xs"><thead class="text-[11px] uppercase text-slate-400 border-y border-slate-100"><tr><th class="py-2 px-3">Time</th><th class="py-2 px-3">Bell</th><th class="py-2 px-3">Where</th></tr></thead><tbody class="divide-y divide-slate-100">' + rows + "</tbody></table>"));
    },
    teachermap: function () {
      const duties = openDuties();
      const rows = duties.map(function (duty) {
        const teacher = teacherById(duty.teacherId);
        return "<tr><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + esc(duty.className) + "</td><td class=\"py-2.5 px-3\">" + esc(teacher.name) + "</td><td class=\"py-2.5 px-3\">" + esc(duty.subject) + "</td><td class=\"py-2.5 px-3\">" + esc(duty.room) + "</td><td class=\"py-2.5 px-3\">" + esc(duty.when) + "</td><td class=\"py-2.5 px-3 tabular-nums\">" + duty.periods + "</td></tr>";
      }).join("") || '<tr><td colspan="6" class="py-4 px-3 text-slate-400">No classes for the levels that are on.</td></tr>';
      const byTeacher = {};
      duties.forEach(function (duty) {
        const name = teacherById(duty.teacherId).name;
        if (!byTeacher[name]) byTeacher[name] = [];
        byTeacher[name].push(duty.className + " · " + duty.subject + " · " + duty.periods + " periods");
      });
      const cards = Object.keys(byTeacher).map(function (name) {
        return '<div class="py-3 border-b border-slate-100 last:border-0"><p class="font-semibold text-slate-900">' + esc(name) + '</p><p class="text-slate-500 mt-0.5">' + esc(byTeacher[name].join("  ·  ")) + "</p></div>";
      }).join("") || '<p class="text-slate-400">No classes assigned.</p>';
      const subjects = {};
      let periods = 0;
      duties.forEach(function (duty) {
        subjects[duty.subject] = true;
        periods += duty.periods;
      });
      return shell("Teacher classes", "Which teacher holds which class. Move a class from Teacher workload when the periods are uneven.",
        factRow([
          ["Classes", String(duties.length), duties.length ? "for levels that are on" : "none yet", duties.length ? "" : "amber"],
          ["Teachers", String(Object.keys(byTeacher).length), "holding a class"],
          ["Subjects", String(Object.keys(subjects).length), "on the timetable"],
          ["Periods", String(periods), "a week"],
        ]) +
        card('<div class="text-xs">' + cards + "</div>") +
        card('<div class="overflow-x-auto"><table class="w-full text-left text-xs"><thead class="text-[11px] uppercase text-slate-400 border-y border-slate-100"><tr><th class="py-2 px-3">Class</th><th class="py-2 px-3">Teacher</th><th class="py-2 px-3">Subject</th><th class="py-2 px-3">Room</th><th class="py-2 px-3">Time</th><th class="py-2 px-3">Periods</th></tr></thead><tbody class="divide-y divide-slate-100">' + rows + "</tbody></table></div>"),
        '<button type="button" data-action="goto" data-page="academics-teaching-teacher-workload" class="' + primaryBtn + '">Balance the load</button>');
    },
    workload: function () {
      const board = loadRows();
      const bars = board.rows.map(function (row) {
        const gap = row.load - board.fair;
        const color = gap > 2 ? "#e11d48" : gap < -2 ? "#d97706" : "#059669";
        const classes = row.mine.map(function (duty) { return duty.className; }).join(", ") || "No class yet";
        return { label: row.teacher.name, value: row.load, display: row.load + " / " + board.fair, color: color, note: classes };
      });
      const options = state.teachers.map(function (teacher) {
        return { id: teacher.id, name: teacher.name };
      });
      const dutyRows = board.duties.map(function (duty) {
        const select = '<select data-duty="' + esc(duty.id) + '" class="duty-teacher rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs">' + options.map(function (teacher) {
          return '<option value="' + esc(teacher.id) + '"' + (teacher.id === duty.teacherId ? " selected" : "") + ">" + esc(teacher.name) + "</option>";
        }).join("") + "</select>";
        return "<tr><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + esc(duty.className) + "</td><td class=\"py-2.5 px-3\">" + esc(duty.subject) + "</td><td class=\"py-2.5 px-3 tabular-nums\">" + duty.periods + "</td><td class=\"py-2.5 px-3\">" + select + "</td></tr>";
      }).join("") || '<tr><td colspan="4" class="py-4 px-3 text-slate-400">No classes for the levels that are on.</td></tr>';
      const heavy = board.rows[0];
      const light = board.rows[board.rows.length - 1];
      const even = board.spread <= 4;
      const note = even
        ? "The spread is " + board.spread + " periods. A gap of 4 or less counts as balanced."
        : heavy.teacher.name + " is carrying " + heavy.load + " periods and " + light.teacher.name + " has " + light.load + ". Balance the load, or move one class with the menu.";
      return shell("Teacher workload", "Periods a week for " + esc(schoolLevelLabel()) + ". Fair share is " + board.fair + " periods.",
        '<section class="grid grid-cols-2 gap-3 lg:grid-cols-4">' +
          statCard("Fair share", String(board.fair), "periods each") +
          statCard("Heaviest", heavy ? heavy.teacher.name.replace(/^(Ms\.|Mr\.|Dr\.)\s*/, "") : "—", heavy ? heavy.load + " periods" : "no classes") +
          statCard("Lightest", light ? light.teacher.name.replace(/^(Ms\.|Mr\.|Dr\.)\s*/, "") : "—", light ? light.load + " periods" : "no classes") +
          statCard("Spread", String(board.spread), even ? "balanced" : "still uneven") +
        "</section>" +
        card(chartHead("Periods by teacher", note) + (bars.length ? barChart(bars) : '<p class="text-xs text-slate-400">No classes to chart.</p>')) +
        card('<div class="overflow-x-auto"><table class="w-full text-left text-xs"><thead class="text-[11px] uppercase text-slate-400 border-y border-slate-100"><tr><th class="py-2 px-3">Class</th><th class="py-2 px-3">Subject</th><th class="py-2 px-3">Periods</th><th class="py-2 px-3">Teacher</th></tr></thead><tbody class="divide-y divide-slate-100">' + dutyRows + "</tbody></table></div>"),
        '<button type="button" data-action="balance-load" class="' + primaryBtn + '">Balance the load</button>');
    },
    student360: function () {
      const pupil = pupilById(state.pupilId);
      const options = state.pupils360.map(function (item) {
        return '<option value="' + item.id + '"' + (item.id === pupil.id ? " selected" : "") + ">" + esc(item.name) + " · " + esc(item.grade) + "</option>";
      }).join("");
      const tone = pupil.status === "Watch" ? "amber" : "emerald";
      const roll = pupil.roll || { present: 0, absent: 0, late: 0 };
      const fees = pupil.fees || { balance: "—", plan: "—", paid: "—" };
      const openCases = (pupil.discipline || []).filter(function (item) { return item.status !== "Closed"; });
      const facts = [
        ["Admission no.", pupil.sid],
        ["Date of birth", pupil.dob],
        ["Gender", pupil.gender],
        ["Joined", pupil.joined],
        ["Nationality", pupil.nationality],
        ["Address", pupil.address],
        ["Class", pupil.cls + " · " + pupil.grade],
        ["Room", pupil.room],
        ["Class teacher", pupil.teacher],
        ["Transport", pupil.transport],
      ].map(function (row) {
        return '<div class="py-2"><dt class="text-[11px] uppercase tracking-wide text-slate-400">' + esc(row[0]) + '</dt><dd class="mt-0.5 font-medium text-slate-900">' + esc(row[1]) + "</dd></div>";
      }).join("");
      const parents = pupil.parents.map(function (parent) {
        return "<tr><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + esc(parent.name) + "</td><td class=\"py-2.5 px-3\">" + esc(parent.relation) + "</td><td class=\"py-2.5 px-3\">" + esc(parent.phone) + "</td><td class=\"py-2.5 px-3 text-slate-500\">" + esc(parent.email) + "</td><td class=\"py-2.5 px-3\">" + badge(parent.pickup === "Yes" ? "Can collect" : "Not listed", parent.pickup === "Yes" ? "emerald" : "slate") + "</td></tr>";
      }).join("");
      const healthRows = [
        ["Blood group", pupil.health.blood],
        ["Allergies", pupil.health.allergies],
        ["Conditions", pupil.health.conditions],
        ["Medication", pupil.health.medication],
        ["Clinic", pupil.health.clinic],
        ["Emergency", pupil.health.emergency],
      ].map(function (row) {
        const warn = /peanut|asthma|inhaler|follow-up|dust/i.test(row[1]);
        return "<div class=\"flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0\"><dt class=\"text-slate-400\">" + esc(row[0]) + "</dt><dd class=\"font-semibold text-right " + (warn ? "text-rose-700" : "text-slate-900") + "\">" + esc(row[1]) + "</dd></div>";
      }).join("");
      const marks = pupil.marks.map(function (mark) {
        return "<tr><td class=\"py-2.5 px-3 font-medium text-slate-900\">" + esc(mark[0]) + "</td><td class=\"py-2.5 px-3 text-right font-semibold text-slate-900\">" + esc(mark[1]) + "</td></tr>";
      }).join("");
      const discipline = (pupil.discipline || []).length ? pupil.discipline.map(function (item) {
        return "<tr><td class=\"py-2.5 px-3\">" + esc(item.date) + "</td><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + esc(item.kind) + "</td><td class=\"py-2.5 px-3 text-slate-500\">" + esc(item.note) + "</td><td class=\"py-2.5 px-3\">" + esc(item.outcome) + "</td><td class=\"py-2.5 px-3\">" + badge(item.status, disciplineTone(item.status)) + "</td></tr>";
      }).join("") : '<tr><td colspan="5" class="py-6 px-3 text-slate-400">No discipline cases on this record.</td></tr>';
      const documents = (pupil.documents || []).map(function (doc) {
        const ready = /on file/i.test(doc[1]);
        return "<tr><td class=\"py-2.5 px-3 font-medium text-slate-900\">" + esc(doc[0]) + "</td><td class=\"py-2.5 px-3\">" + badge(doc[1], ready ? "emerald" : "amber") + "</td></tr>";
      }).join("") || '<tr><td colspan="2" class="py-6 px-3 text-slate-400">No documents on file.</td></tr>';
      return shell("Student 360", "Full profile for " + esc(pupil.name) + ". Discipline sits with class, family, health, marks, and fees.",
        card('<div class="flex flex-wrap items-start justify-between gap-4"><div class="flex items-start gap-3"><div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sm font-semibold text-sky-700">' + esc(initials(pupil.name)) + '</div><div><p class="text-base font-semibold text-slate-900">' + esc(pupil.name) + '</p><p class="text-slate-500 mt-0.5">' + esc(pupil.cls) + " · " + esc(pupil.room) + '</p><div class="mt-2">' + badge(pupil.status, tone) + '</div></div></div><label class="text-slate-500">Pupil<select id="pupil-select" class="mt-1 block text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800">' + options + "</select></label></div>") +
        '<section class="grid grid-cols-2 gap-3 lg:grid-cols-4">' +
          statCard("Attendance", pupil.attendance, roll.present + " present · " + roll.absent + " absent · " + roll.late + " late") +
          statCard("Discipline", String(openCases.length), openCases.length ? "open or being watched" : "none open", "", openCases.length ? "amber" : "") +
          statCard("Fees", fees.balance, fees.plan + " · " + fees.paid, "", fees.balance === "UGX 0" ? "" : "amber") +
          statCard("Subjects", String(pupil.marks.length), "marks on this profile") +
        "</section>" +
        card('<h2 class="text-sm font-semibold text-slate-900">Discipline</h2><p class="mt-0.5 text-xs text-slate-500">' + (openCases.length ? openCases.length + " case" + (openCases.length === 1 ? "" : "s") + " still open." : "Nothing open on this record.") + '</p><div class="mt-3 overflow-x-auto"><table data-no-view="1" class="w-full text-left text-xs"><thead class="text-[11px] uppercase text-slate-400 border-y border-slate-100"><tr><th class="py-2 px-3">Date</th><th class="py-2 px-3">Type</th><th class="py-2 px-3">What happened</th><th class="py-2 px-3">Outcome</th><th class="py-2 px-3">Status</th></tr></thead><tbody class="divide-y divide-slate-100">' + discipline + "</tbody></table></div>") +
        card('<h2 class="text-sm font-semibold text-slate-900 mb-1">Personal details</h2><dl class="grid grid-cols-2 gap-x-6 text-xs lg:grid-cols-3">' + facts + "</dl>") +
        card('<h2 class="text-sm font-semibold text-slate-900 mb-2">Parents and guardians</h2><div class="overflow-x-auto"><table data-no-view="1" class="w-full text-left text-xs"><thead class="text-[11px] uppercase text-slate-400 border-y border-slate-100"><tr><th class="py-2 px-3">Name</th><th class="py-2 px-3">Relation</th><th class="py-2 px-3">Phone</th><th class="py-2 px-3">Email</th><th class="py-2 px-3">Pickup</th></tr></thead><tbody class="divide-y divide-slate-100">' + parents + "</tbody></table></div>") +
        card('<h2 class="text-sm font-semibold text-slate-900 mb-1">Health</h2><p class="text-xs text-slate-500 mb-2">' + esc(pupil.health.note) + '</p><dl class="text-xs">' + healthRows + "</dl>") +
        card('<h2 class="text-sm font-semibold text-slate-900 mb-2">Class marks</h2><table class="w-full text-left text-xs"><tbody class="divide-y divide-slate-100">' + marks + "</tbody></table>") +
        card('<div class="grid gap-6 lg:grid-cols-2"><div><h2 class="text-sm font-semibold text-slate-900 mb-2">Documents</h2><table class="w-full text-left text-xs"><tbody class="divide-y divide-slate-100">' + documents + '</tbody></table></div><div><h2 class="text-sm font-semibold text-slate-900 mb-2">Fees</h2><dl class="text-xs"><div class="flex items-center justify-between gap-4 py-2 border-b border-slate-100"><dt class="text-slate-400">Balance</dt><dd class="font-semibold text-slate-900">' + esc(fees.balance) + '</dd></div><div class="flex items-center justify-between gap-4 py-2 border-b border-slate-100"><dt class="text-slate-400">Plan</dt><dd class="font-semibold text-slate-900">' + esc(fees.plan) + '</dd></div><div class="flex items-center justify-between gap-4 py-2"><dt class="text-slate-400">Standing</dt><dd class="font-semibold text-slate-900">' + esc(fees.paid) + "</dd></div></dl></div></div>"));
    },
    copilot: function () {
      const thread = state.chat.map(function (message) {
        const mine = message.role === "user";
        return '<div class="flex ' + (mine ? "justify-end" : "justify-start") + '"><div class="max-w-xl px-3 py-2 rounded-xl text-xs leading-relaxed ' +
          (mine ? "bg-sky-500 text-white" : "bg-slate-50 border border-slate-200 text-slate-700") + '">' + esc(message.text) + "</div></div>";
      }).join("");
      return shell("AI Student Copilot", "Ask about risk, attendance, or the current term. Answers stay on this campus view.",
        pageStats() + card('<div id="chat-log" class="space-y-3 mb-4">' + thread + "</div>" +
          '<div class="flex flex-wrap gap-2 mb-3">' +
          '<button type="button" data-action="ask" data-prompt="Who is at risk in Grade 4 Mathematics?" class="' + ghostBtn + '">Grade 4 Mathematics risk</button>' +
          '<button type="button" data-action="ask" data-prompt="How is attendance this week?" class="' + ghostBtn + '">Attendance this week</button>' +
          "</div>" +
          '<form id="chat-form" class="flex gap-2"><input id="chat-input" class="flex-1 text-xs rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-400" placeholder="Ask the copilot..." />' +
          '<button type="submit" class="' + primaryBtn + '">Send</button></form>'),
        '<button type="button" data-action="goto" data-page="dashboard" class="' + ghostBtn + '">Back to overview</button>');
    },
    students: function () {
      const watch = state.students.filter(function (student) { return student.status === "Watch"; }).length;
      const grades = {};
      state.students.forEach(function (student) { grades[student.grade] = true; });
      return shell("Students & Admissions", "Active roster for Little Royals.",
        '<section class="grid grid-cols-2 lg:grid-cols-4 gap-3">' +
        statCard("Pupils", String(state.students.length), "on this roster") +
        statCard("Watch", String(watch), watch ? "needs a look" : "none waiting") +
        statCard("Grades", String(Object.keys(grades).length), "in view") +
        statCard("Active", String(state.students.length - watch), "on the roll") +
        "</section>" +
        '<article class="bg-white rounded-xl border border-slate-200 overflow-hidden"><div class="flex flex-wrap items-start justify-between gap-3 px-5 py-4"><div><h2 class="text-sm font-semibold text-slate-900">Students</h2><p class="mt-0.5 text-xs text-slate-500">Browse, search and manage pupils.</p></div><div class="flex flex-wrap items-center gap-2"><label class="relative"><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">' + glyph(ICON_SEARCH) + '</span><input id="student-filter" value="' + esc(state.studentQuery) + '" class="w-52 rounded-full border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300" placeholder="Search students" /></label><button type="button" data-action="add-student" class="' + primaryBtn + '">+ New student</button></div></div>' +
        '<div class="overflow-x-auto border-t border-slate-100"><table class="w-full text-left text-xs"><thead class="bg-slate-50/80 text-[11px] font-medium uppercase tracking-wider text-slate-400"><tr><th class="py-2.5 px-4">Name</th><th class="py-2.5 px-3">ID</th><th class="py-2.5 px-3">Grade</th><th class="py-2.5 px-3">Advisor</th><th class="py-2.5 px-4">Status</th></tr></thead><tbody id="student-body" class="divide-y divide-slate-100">' + studentRowsHtml() + "</tbody></table></div></article>");
    },
    curriculum: function () {
      const courses = [
        ["Mathematics", "72%", "Ms. Alvarez"],
        ["Science", "81%", "Mr. Shah"],
        ["Social Studies", "84%", "Dr. Nguyen"],
        ["English", "88%", "Ms. Brooks"],
      ];
      const rows = courses.map(function (course) {
        return "<tr><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + course[0] + "</td><td class=\"py-2.5 px-3\">" + course[2] + "</td><td class=\"py-2.5 px-3 tabular-nums\">" + course[1] + "</td><td class=\"py-2.5 px-3\"><button type=\"button\" data-action=\"gradebook\" data-course=\"" + course[0] + "\" class=\"text-sky-600 font-semibold\">Open gradebook</button></td></tr>";
      }).join("");
      return shell("Curriculum & Grades", "Course averages for " + esc(document.getElementById("term-label").textContent) + ".",
        card('<table class="w-full text-left text-xs"><thead class="text-[11px] uppercase text-slate-400 border-y border-slate-100"><tr><th class="py-2 px-3">Course</th><th class="py-2 px-3">Teacher</th><th class="py-2 px-3">Average</th><th class="py-2 px-3"></th></tr></thead><tbody class="divide-y divide-slate-100">' + rows + "</tbody></table>"));
    },
    faculty: function () {
      const rows = state.teachers.map(function (teacher) {
        const clock = clockStatus(teacher);
        const open = teacher.discipline.filter(function (item) { return item.status === "Open"; }).length;
        return "<tr><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + esc(teacher.name) + "</td><td class=\"py-2.5 px-3\">" + esc(teacher.subject) + "</td><td class=\"py-2.5 px-3 text-slate-500\">" + esc(openDuties().filter(function (duty) { return duty.teacherId === teacher.id; }).map(function (duty) { return duty.className; }).join(", ") || "No class") + "</td><td class=\"py-2.5 px-3\">" + badge(clock.label, clock.tone) + "</td><td class=\"py-2.5 px-3\">" + (open ? badge(open + " open", "amber") : badge("Clear", "emerald")) + "</td></tr>";
      }).join("");
      const inNow = state.teachers.filter(function (teacher) { return teacher.inTime && !teacher.outTime; }).length;
      const openCases = state.teachers.reduce(function (sum, teacher) {
        return sum + teacher.discipline.filter(function (item) { return item.status === "Open"; }).length;
      }, 0);
      const subjects = {};
      state.teachers.forEach(function (teacher) { subjects[teacher.subject] = true; });
      return shell("Teacher profiles", "Each teacher has one record: classes, time in and out, then discipline.",
        factRow([
          ["Teachers", String(state.teachers.length), "on the staff list"],
          ["In now", String(inNow), "clocked in today"],
          ["Open cases", String(openCases), openCases ? "need a look" : "none open", openCases ? "amber" : ""],
          ["Subjects", String(Object.keys(subjects).length), "taught here"],
        ]) +
        card('<table class="w-full text-left text-xs"><thead class="text-[11px] uppercase text-slate-400 border-y border-slate-100"><tr><th class="py-2 px-3">Teacher</th><th class="py-2 px-3">Subject</th><th class="py-2 px-3">Classes</th><th class="py-2 px-3">Today</th><th class="py-2 px-3">Discipline</th></tr></thead><tbody class="divide-y divide-slate-100">' + rows + "</tbody></table>"),
        '<button type="button" data-action="goto" data-page="academics-teaching-teacher-workload" class="' + primaryBtn + '">Balance the load</button>');
    },
    timeclock: function () {
      const span = clockSpan();
      if (span !== "today") {
        return shell("Time in & out", spanNote(span), clockBoard(span));
      }
      const inNow = state.teachers.filter(function (teacher) { return teacher.inTime && !teacher.outTime; }).length;
      const notIn = state.teachers.filter(function (teacher) { return !teacher.inTime; }).length;
      const done = state.teachers.length - inNow - notIn;
      const rows = state.teachers.map(function (teacher) {
        const clock = clockStatus(teacher);
        return "<tr><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + esc(teacher.name) + "</td><td class=\"py-2.5 px-3\">" + esc(teacher.subject) + "</td><td class=\"py-2.5 px-3 tabular-nums\">" + esc(teacher.inTime || "—") + "</td><td class=\"py-2.5 px-3 tabular-nums\">" + esc(teacher.outTime || "—") + "</td><td class=\"py-2.5 px-3 tabular-nums\">" + timeSpan(teacher.inTime, teacher.outTime) + "</td><td class=\"py-2.5 px-3\">" + badge(clock.label, clock.tone) + "</td><td class=\"py-2.5 px-3\">" + clockActions(teacher) + "</td></tr>";
      }).join("");
      return shell("Time in & out", "Today's clock for Little Royals teachers. Time in first, then time out.",
        factRow([
          ["In now", String(inNow), "on site"],
          ["Not in", String(notIn), notIn ? "still expected" : "everyone has arrived", notIn ? "amber" : ""],
          ["Clocked out", String(done), "finished for today"],
          ["Teachers", String(state.teachers.length), "on today's clock"],
        ]) +
        spanBar() +
        card('<div class="overflow-x-auto"><table class="w-full text-left text-xs"><thead class="text-[11px] uppercase text-slate-400 border-y border-slate-100"><tr><th class="py-2 px-3">Teacher</th><th class="py-2 px-3">Subject</th><th class="py-2 px-3">Time in</th><th class="py-2 px-3">Time out</th><th class="py-2 px-3">On site</th><th class="py-2 px-3">Status</th><th class="py-2 px-3"></th></tr></thead><tbody class="divide-y divide-slate-100">' + rows + "</tbody></table></div>"));
    },
    timeweek: function () {
      const span = clockSpan();
      if (span !== "week") {
        return shell("Time in & out", spanNote(span), clockBoard(span));
      }
      const rows = state.teachers.map(function (teacher) {
        const days = teacher.week.map(function (day) {
          return "<td class=\"py-2.5 px-3 tabular-nums text-slate-600\">" + esc(day.in) + "–" + esc(day.out) + "</td>";
        }).join("");
        return "<tr><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + esc(teacher.name) + "</td>" + days + "<td class=\"py-2.5 px-3 tabular-nums\">" + esc(teacher.inTime || "—") + " / " + esc(teacher.outTime || "—") + "</td></tr>";
      }).join("");
      const inToday = state.teachers.filter(function (teacher) { return teacher.inTime; }).length;
      const outToday = state.teachers.filter(function (teacher) { return teacher.outTime; }).length;
      return shell("This week", "Monday to Friday clocks, with today beside them.",
        factRow([
          ["Teachers", String(state.teachers.length), "on the week sheet"],
          ["Days", "5", "Monday to Friday"],
          ["In today", String(inToday), "time in recorded"],
          ["Out today", String(outToday), outToday ? "clocked out" : "still on site"],
        ]) +
        spanBar() +
        card('<div class="overflow-x-auto"><table class="w-full text-left text-xs"><thead class="text-[11px] uppercase text-slate-400 border-y border-slate-100"><tr><th class="py-2 px-3">Teacher</th><th class="py-2 px-3">Mon</th><th class="py-2 px-3">Tue</th><th class="py-2 px-3">Wed</th><th class="py-2 px-3">Thu</th><th class="py-2 px-3">Fri</th><th class="py-2 px-3">Today</th></tr></thead><tbody class="divide-y divide-slate-100">' + rows + "</tbody></table></div>"));
    },
    hrdiscipline: function () {
      return disciplineBoard(false);
    },
    hrhistory: function () {
      return disciplineBoard(true);
    },
    teacherprofile: function () {
      const teacher = teacherById(state.teacherId);
      const clock = clockStatus(teacher);
      const options = state.teachers.map(function (item) {
        return '<option value="' + item.id + '"' + (item.id === teacher.id ? " selected" : "") + ">" + esc(item.name) + "</option>";
      }).join("");
      const cases = teacher.discipline.length ? teacher.discipline.map(function (item) {
        const action = item.status === "Closed"
          ? '<span class="text-slate-400">Closed</span>'
          : '<button type="button" data-action="resolve-discipline" data-id="' + teacher.id + '" data-case="' + item.id + '" class="text-sky-600 font-semibold">Resolve</button>';
        return "<tr><td class=\"py-2.5 px-3\">" + esc(item.date) + "</td><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + esc(item.kind) + "</td><td class=\"py-2.5 px-3 text-slate-500\">" + esc(item.note) + "</td><td class=\"py-2.5 px-3\">" + badge(item.status, disciplineTone(item.status)) + "</td><td class=\"py-2.5 px-3\">" + action + "</td></tr>";
      }).join("") : '<tr><td colspan="5" class="py-6 px-3 text-slate-400">No discipline cases on this record.</td></tr>';
      const openCases = teacher.discipline.filter(function (item) { return item.status !== "Closed"; }).length;
      const span = clockSpan();
      const summary = clockSummary(clockRows(teacher, span));
      const facts = [
        ["Full name", teacher.fullName],
        ["Staff number", teacher.staffId],
        ["National ID", teacher.idNo],
        ["Gender", teacher.gender],
        ["Date of birth", teacher.dob],
        ["Nationality", teacher.nationality],
        ["Phone", teacher.phone],
        ["Email", teacher.email],
        ["Address", teacher.address],
        ["Joined", teacher.joined],
        ["Role", teacher.role],
        ["Department", teacher.department],
        ["Subject", teacher.subject],
        ["Classes", teacher.grades],
        ["Room", teacher.room],
        ["Qualification", teacher.qualification],
        ["TSC number", teacher.tsc],
        ["Contract", teacher.contract],
        ["Blood group", teacher.blood],
      ].map(function (row) {
        return '<div class="py-2"><dt class="text-[11px] uppercase tracking-wide text-slate-400">' + esc(row[0]) + '</dt><dd class="mt-0.5 font-medium text-slate-900">' + esc(row[1] || "—") + "</dd></div>";
      }).join("");
      const kin = [
        ["Name", teacher.kin],
        ["Relation", teacher.kinRelation],
        ["Phone", teacher.kinPhone],
        ["Emergency", teacher.emergency],
      ].map(function (row) {
        return '<div class="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0"><dt class="text-slate-400">' + esc(row[0]) + '</dt><dd class="font-semibold text-right text-slate-900">' + esc(row[1] || "—") + "</dd></div>";
      }).join("");
      const classes = openDuties().filter(function (duty) { return duty.teacherId === teacher.id; });
      const classRows = classes.length ? classes.map(function (duty) {
        return "<tr><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + esc(duty.className) + "</td><td class=\"py-2.5 px-3\">" + esc(duty.subject) + "</td><td class=\"py-2.5 px-3\">" + esc(duty.when) + "</td><td class=\"py-2.5 px-3\">" + esc(duty.room) + "</td><td class=\"py-2.5 px-3 text-right\">" + esc(String(duty.periods)) + "</td></tr>";
      }).join("") : '<tr><td colspan="5" class="py-6 px-3 text-slate-400">No classes on this record.</td></tr>';
      const documents = (teacher.documents || []).map(function (doc) {
        const ready = /on file/i.test(doc[1]);
        return "<tr><td class=\"py-2.5 px-3 font-medium text-slate-900\">" + esc(doc[0]) + "</td><td class=\"py-2.5 px-3\">" + badge(doc[1], ready ? "emerald" : "amber") + "</td></tr>";
      }).join("") || '<tr><td colspan="2" class="py-6 px-3 text-slate-400">No documents on file.</td></tr>';
      return shell("Teacher profile", "Full record for " + esc(teacher.fullName || teacher.name) + ". Personal details, classes, time in and out, and discipline.",
        factRow([
          ["Time in", esc(teacher.inTime || "—"), "today"],
          ["Time out", esc(teacher.outTime || "—"), teacher.outTime ? "today" : "still on site"],
          ["On site", timeSpan(teacher.inTime, teacher.outTime), "today"],
          ["Discipline", String(openCases), openCases ? "open or watching" : "none open", openCases ? "amber" : ""],
        ]) +
        card('<div class="flex flex-wrap items-start justify-between gap-4"><div class="flex items-start gap-3"><div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sm font-semibold text-sky-700">' + esc(initials(teacher.name)) + '</div><div><p class="text-base font-semibold text-slate-900">' + esc(teacher.fullName || teacher.name) + '</p><p class="text-slate-500 mt-0.5">' + esc(teacher.name) + " · " + esc(teacher.role) + " · " + esc(teacher.subject) + '</p></div></div><label class="text-slate-500">Teacher<select id="teacher-select" class="mt-1 block text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800">' + options + "</select></label></div>") +
        card('<h2 class="text-sm font-semibold text-slate-900 mb-1">Personal details</h2><dl class="grid grid-cols-2 gap-x-6 text-xs lg:grid-cols-3">' + facts + "</dl>") +
        card('<div class="grid gap-6 lg:grid-cols-2"><div><h2 class="text-sm font-semibold text-slate-900 mb-1">Next of kin</h2><dl class="text-xs">' + kin + '</dl></div><div><h2 class="text-sm font-semibold text-slate-900 mb-2">Documents</h2><table class="w-full text-left text-xs"><tbody class="divide-y divide-slate-100">' + documents + "</tbody></table></div></div>") +
        card('<h2 class="text-sm font-semibold text-slate-900">Classes</h2><p class="mt-0.5 text-xs text-slate-500">' + classes.length + " on the timetable for the levels that are on.</p><div class=\"mt-3 overflow-x-auto\"><table data-no-view=\"1\" class=\"w-full text-left text-xs\"><thead class=\"text-[11px] uppercase text-slate-400 border-y border-slate-100\"><tr><th class=\"py-2 px-3\">Class</th><th class=\"py-2 px-3\">Subject</th><th class=\"py-2 px-3\">When</th><th class=\"py-2 px-3\">Room</th><th class=\"py-2 px-3 text-right\">Periods</th></tr></thead><tbody class=\"divide-y divide-slate-100\">" + classRows + "</tbody></table></div>") +
        card('<div class="flex flex-wrap items-start justify-between gap-3"><div><h2 class="text-sm font-semibold text-slate-900">Time in & out</h2><p class="mt-0.5 text-xs text-slate-500">' + esc(spanNote(span)) + " · " + summary.days + " days · average in " + summary.inn + (summary.late ? " · " + summary.late + " late" : "") + '</p></div><div class="flex items-center gap-2">' + badge(clock.label, clock.tone) + clockActions(teacher) + "</div></div>" +
          '<div class="mt-3">' + spanBar() + "</div>" + clockTable(teacher, span)) +
        card('<div class="flex items-center justify-between gap-3 mb-3"><h2 class="text-sm font-semibold text-slate-900">Discipline</h2><button type="button" data-action="add-discipline" data-id="' + teacher.id + '" class="' + ghostBtn + '">Add case</button></div>' +
          '<table data-no-view="1" class="w-full text-left text-xs"><thead class="text-[11px] uppercase text-slate-400 border-y border-slate-100"><tr><th class="py-2 px-3">Date</th><th class="py-2 px-3">Type</th><th class="py-2 px-3">Note</th><th class="py-2 px-3">Status</th><th class="py-2 px-3"></th></tr></thead><tbody class="divide-y divide-slate-100">' + cases + "</tbody></table>"));
    },
    parents: function () {
      return shell("Parent Portal", "Households linked to enrolled students. The digest uses the current term calendar.",
        card('<ul class="divide-y divide-slate-100 text-xs">' +
          "<li class=\"py-3 flex justify-between\"><span><strong class=\"text-slate-900\">Chen family</strong><span class=\"block text-slate-500\">chen.family@gmail.com · Liam</span></span>" + badge("Linked", "emerald") + "</li>" +
          "<li class=\"py-3 flex justify-between\"><span><strong class=\"text-slate-900\">Patel household</strong><span class=\"block text-slate-500\">patel.home@gmail.com · Ava</span></span>" + badge("Invite pending", "amber") + "</li>" +
          "<li class=\"py-3 flex justify-between\"><span><strong class=\"text-slate-900\">Brooks family</strong><span class=\"block text-slate-500\">brooks.family@icloud.com · Ethan</span></span>" + badge("Linked", "emerald") + "</li></ul>"),
        '<button type="button" data-action="send-digest" class="' + primaryBtn + '">Send weekly digest</button>');
    },
    attendance: function () {
      const present = state.roster.filter(function (row) { return row.present; }).length;
      const rate = Math.round((present / state.roster.length) * 1000) / 10;
      const rows = state.roster.map(function (row, index) {
        return "<tr><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + esc(row.name) + "</td><td class=\"py-2.5 px-3\">" + esc(row.period) +
          "</td><td class=\"py-2.5 px-3\"><button type=\"button\" data-action=\"toggle-present\" data-index=\"" + index + "\" class=\"" + (row.present ? "text-emerald-700" : "text-rose-600") + " font-semibold\">" + (row.present ? "Present" : "Absent") + "</button></td></tr>";
      }).join("");
      return shell("Attendance & Safety", "Today's sample roster. Toggle a student to update the live rate.",
        '<div class="grid grid-cols-1 md:grid-cols-3 gap-4"><article class="bg-white p-4 rounded-xl border border-slate-200/80 shadow-card"><p class="text-xs text-slate-500">Present now</p><p class="text-2xl font-bold text-slate-900 mt-1">' + rate + '%</p></article>' +
        card('<table class="w-full text-left text-xs md:col-span-2"><thead class="text-[11px] uppercase text-slate-400 border-y border-slate-100"><tr><th class="py-2 px-3">Student</th><th class="py-2 px-3">Class</th><th class="py-2 px-3">Mark</th></tr></thead><tbody class="divide-y divide-slate-100">' + rows + "</tbody></table>") + "</div>");
    },
    schedules: function () {
      const rows = state.classes.map(function (item) {
        return "<tr><td class=\"py-2.5 px-3\">" + esc(item.period) + "</td><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + esc(item.course) + "</td><td class=\"py-2.5 px-3\">" + esc(item.teacher) + "</td><td class=\"py-2.5 px-3\">" + esc(item.room) + "</td></tr>";
      }).join("");
      return shell("Schedules & Classes", "Bell schedule for the selected term.",
        card('<table class="w-full text-left text-xs"><thead class="text-[11px] uppercase text-slate-400 border-y border-slate-100"><tr><th class="py-2 px-3">Period</th><th class="py-2 px-3">Course</th><th class="py-2 px-3">Teacher</th><th class="py-2 px-3">Room</th></tr></thead><tbody class="divide-y divide-slate-100">' + rows + "</tbody></table>"),
        '<button type="button" data-action="add-class" class="' + primaryBtn + '">Add class</button>');
    },
    wellness: function () {
      const rows = state.cases.map(function (item) {
        const tone = item.status === "Open" ? "amber" : "emerald";
        const action = item.status === "Open"
          ? '<button type="button" data-action="resolve-case" data-id="' + item.id + '" class="text-sky-600 font-semibold">Resolve</button>'
          : '<span class="text-slate-400">Closed</span>';
        return "<tr><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + esc(item.name) + "</td><td class=\"py-2.5 px-3\">" + esc(item.kind) + "</td><td class=\"py-2.5 px-3 text-slate-500\">" + esc(item.note) + "</td><td class=\"py-2.5 px-3\">" + badge(item.status, tone) + "</td><td class=\"py-2.5 px-3\">" + action + "</td></tr>";
      }).join("");
      return shell("Discipline & Wellness", "Open cases from the academic alert and attendance flags.",
        card('<table class="w-full text-left text-xs"><thead class="text-[11px] uppercase text-slate-400 border-y border-slate-100"><tr><th class="py-2 px-3">Student</th><th class="py-2 px-3">Type</th><th class="py-2 px-3">Note</th><th class="py-2 px-3">Status</th><th class="py-2 px-3"></th></tr></thead><tbody class="divide-y divide-slate-100">' + rows + "</tbody></table>"));
    },
    exams: function () {
      const visible = state.exams.filter(function (exam) { return levelOn(exam.level); });
      const rows = visible.map(function (exam) {
        return "<tr><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + esc(exam.name) + "</td><td class=\"py-2.5 px-3\">" + esc(exam.level) + " · " + esc(exam.grade) + "</td><td class=\"py-2.5 px-3\">" + esc(exam.subject) + "</td><td class=\"py-2.5 px-3\">" + esc(exam.teacher) + "</td><td class=\"py-2.5 px-3\">" + esc(exam.when) + "</td><td class=\"py-2.5 px-3\">" + esc(exam.room) + "</td></tr>";
      }).join("") || '<tr><td colspan="6" class="py-4 px-3 text-slate-400">No exams for the levels that are on.</td></tr>';
      const subjects = {};
      const classes = {};
      const teachers = {};
      visible.forEach(function (exam) {
        if (exam.subject) subjects[exam.subject] = true;
        if (exam.grade) classes[exam.grade] = true;
        if (exam.teacher) teachers[exam.teacher] = true;
      });
      return shell("Examinations", "Teachers create exams for " + esc(schoolLevelLabel()) + ".",
        factRow([
          ["Exams", String(visible.length), visible.length ? "for levels that are on" : "none yet", visible.length ? "" : "amber"],
          ["Subjects", String(Object.keys(subjects).length), "on the papers"],
          ["Classes", String(Object.keys(classes).length), "sitting a paper"],
          ["Teachers", String(Object.keys(teachers).length), "setting them"],
        ]) +
        card('<div class="overflow-x-auto"><table class="w-full text-left text-xs"><thead class="text-[11px] uppercase text-slate-400 border-y border-slate-100"><tr><th class="py-2 px-3">Exam</th><th class="py-2 px-3">Class</th><th class="py-2 px-3">Subject</th><th class="py-2 px-3">Teacher</th><th class="py-2 px-3">Date</th><th class="py-2 px-3">Room</th></tr></thead><tbody class="divide-y divide-slate-100">' + rows + "</tbody></table></div>"),
        '<button type="button" data-action="add-exam" class="' + primaryBtn + '">Create exam</button>');
    },
    studyplans: function () {
      const visible = state.plans.filter(function (plan) { return levelOn(plan.level); });
      const subjects = {};
      const classes = {};
      let weeks = 0;
      visible.forEach(function (plan) {
        if (plan.subject) subjects[plan.subject] = true;
        if (plan.grade) classes[plan.grade] = true;
        weeks += parseInt(plan.weeks, 10) || 0;
      });
      const subjectList = Object.keys(subjects);
      const classList = Object.keys(classes);
      const stats = '<section class="grid grid-cols-2 gap-3 lg:grid-cols-4">' +
        statCard("Plans", String(visible.length), visible.length ? visible.length + " · written" : "none yet", "stat-0", visible.length ? "" : "amber") +
        statCard("Subjects", String(subjectList.length), subjectList.length === 1 ? esc(subjectList[0]) : (subjectList.length ? subjectList.length + " · in view" : "none yet"), "stat-1") +
        statCard("Weeks", String(weeks), weeks ? weeks + " · planned" : "none yet", "stat-2") +
        statCard("Classes", String(classList.length), classList.length ? classList.length + " · in view" : "none yet", "stat-3") +
        "</section>";
      const rows = visible.map(function (plan) {
        return "<tr><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + esc(plan.title) + "</td><td class=\"py-2.5 px-3\">" + esc(plan.level) + " · " + esc(plan.grade) + "</td><td class=\"py-2.5 px-3\">" + esc(plan.subject) + "</td><td class=\"py-2.5 px-3\">" + esc(plan.teacher) + "</td><td class=\"py-2.5 px-3 tabular-nums\">" + esc(plan.weeks) + "</td><td class=\"py-2.5 px-3 text-slate-500\">" + esc(plan.outline) + "</td></tr>";
      }).join("") || '<tr><td colspan="6" class="py-4 px-3 text-slate-400">No study plans for the levels that are on.</td></tr>';
      return shell("Study plans", "Teachers write the plan for a class: subject, weeks, and what will be taught.",
        stats + card('<div class="overflow-x-auto"><table class="w-full text-left text-xs"><thead class="text-[11px] uppercase text-slate-400 border-y border-slate-100"><tr><th class="py-2 px-3">Plan</th><th class="py-2 px-3">Class</th><th class="py-2 px-3">Subject</th><th class="py-2 px-3">Teacher</th><th class="py-2 px-3">Weeks</th><th class="py-2 px-3">Outline</th></tr></thead><tbody class="divide-y divide-slate-100">' + rows + "</tbody></table></div>"),
        '<button type="button" data-action="add-plan" class="' + primaryBtn + '">Create study plan</button>');
    },
    reportcards: function () {
      const term = document.getElementById("term-label").textContent;
      const names = ["Liam Chen", "Mia Okonkwo", "Ethan Brooks"];
      const cards = names.map(function (name) {
        return '<div class="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"><div><p class="font-semibold text-slate-900">' + esc(name) + '</p><p class="text-slate-500">Quarter report · ' + esc(term) + '</p></div><button type="button" data-action="download-report" data-name="' + esc(name) + '" class="text-sky-600 font-semibold">Download</button></div>';
      }).join("");
      return shell("Report Cards", "Download a text report for a student. Files save to your downloads folder.",
        factRow([
          ["Cards", String(names.length), "ready to download"],
          ["Pupils", String(names.length), "on this list"],
          ["Term", "3", esc(term)],
          ["Format", "Text", "saved to downloads"],
        ]) +
        card('<div class="text-xs">' + cards + "</div>"));
    },
    reports: function () {
      const term = document.getElementById("term-label").textContent;
      const model = reportModel();
      const toneClass = { rose: "border-rose-200 bg-rose-50/80", amber: "border-amber-200 bg-amber-50/80", emerald: "border-emerald-200 bg-emerald-50/70", sky: "border-sky-200 bg-sky-50/70" };
      const kickerClass = { rose: "text-rose-700", amber: "text-amber-800", emerald: "text-emerald-800", sky: "text-sky-800" };
      function kpi(label, value, hint) {
        return '<article class="rounded-xl border border-slate-200 bg-white px-4 py-3.5"><p class="text-[11px] font-medium uppercase tracking-wide text-slate-500">' + esc(label) + '</p><p class="mt-2 text-[1.65rem] font-semibold tracking-tight tabular-nums leading-none text-slate-900">' + esc(value) + '</p><p class="mt-2 text-xs text-slate-500">' + esc(hint) + "</p></article>";
      }
      const insights = model.insights.map(function (item) {
        return '<article class="flex h-full flex-col rounded-xl border p-4 ' + toneClass[item.tone] + '"><p class="text-[11px] font-semibold uppercase tracking-wide ' + kickerClass[item.tone] + '">' + esc(item.kicker) + '</p><h2 class="mt-1 text-sm font-semibold text-slate-900">' + esc(item.title) + '</h2><p class="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">' + esc(item.body) + '</p><button type="button" data-action="goto" data-page="' + esc(item.page) + '" class="mt-3 self-start text-xs font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2">' + esc(item.action) + "</button></article>";
      }).join("");
      const groups = usageReports();
      const tab = state.reportTab || "overview";
      function reportTab(id, label) {
        const on = tab === id;
        return '<button type="button" data-action="report-tab" data-tab="' + id + '" class="inline-flex items-center border-b-2 px-3 py-2 text-xs ' + (on ? "border-slate-900 font-semibold text-slate-900" : "border-transparent font-medium text-slate-500 hover:text-slate-900") + '">' + label + "</button>";
      }
      const tabs = '<div class="flex flex-wrap items-center gap-1 border-b border-slate-200">' +
        [["overview", "Overview"], ["enrollment", "Enrollment"], ["attendance", "Attendance"], ["academics", "Academics"], ["people", "People"], ["care", "Care"], ["finance", "Finance"], ["system", "System"]].map(function (item) {
          return reportTab(item[0], item[1]);
        }).join("") + "</div>";
      function figures(name) {
        const group = groups.filter(function (item) { return item.name === name; })[0];
        if (!group) return "";
        return card(chartHead(group.name, group.blurb) + reportTable(["Report", "Figure", "Detail"], group.items.map(function (item) {
          return [esc(item.name), cellNum(item.figure), esc(item.detail)];
        })));
      }
      function underChart(table) {
        return '<div class="mt-5 border-t border-slate-100 pt-4">' + table + "</div>";
      }
      const kpis = '<section class="grid grid-cols-2 gap-3 lg:grid-cols-4">' +
        kpi("Enrollment", "1,420", "84% of 1,690 places") +
        kpi("Attendance", model.week.avg, "Week " + state.week + " · target 96%") +
        kpi("Benchmarks", model.met.length + " / " + model.benches.length, model.below.length ? model.below.length + " under target" : "All meeting") +
        kpi("Admissions", String(model.waiting.length), "still in the office") +
        "</section>";
      const weakestNote = model.weakest ? model.weakest.label + " is the soft subject at " + model.weakest.value + "%." : "No class marks are on file.";
      const placesTable = reportTable(["Band", "Pupils", "Share"], [
        [esc("Enrolled"), cellNum("1,420"), cellNum("84%")],
        [esc("Open places"), cellNum("270"), cellNum("16%")],
      ]);
      const rollTable = reportTable(["Band", "Pupils", "Share"], model.roll.map(function (item) {
        return [esc(item.label), cellNum(item.value.toLocaleString("en-UG")), cellNum(shareOf(item.value, 1420) + "%")];
      }));
      const admissionTable = reportTable(["Applicant", "Grade", "Status", "Filed"], state.applicants.map(function (row) {
        const tone = row.status === "Enrolled" ? "emerald" : row.status === "Interviewing" ? "amber" : "slate";
        return [esc(row.name), esc(row.grade), badge(row.status, tone), esc(row.display)];
      }));
      const weekTable = reportTable(["Week", "Average", "Against 96%", "Reading"], model.weekPoints.map(function (point) {
        const gap = Math.round((point.value - 96) * 10) / 10;
        return [esc(point.label.replace("W", "Week ")), cellNum(point.value + "%"), cellNum((gap > 0 ? "+" : "") + gap + " pts"), badge(point.value >= 96 ? "On target" : "Under", point.value >= 96 ? "emerald" : "amber")];
      }));
      const dayTable = reportTable(["Day", "Rate", "Kind", "Reading"], model.days.map(function (day, index) {
        const weekend = index >= 5;
        const tone = day.value >= 96 ? "emerald" : day.value >= 90 ? "sky" : "amber";
        const reading = day.value >= 96 ? "On target" : day.value >= 90 ? "Close" : "Low";
        return [esc(day.label), cellNum(day.value + "%"), esc(weekend ? "Weekend" : "Teaching day"), badge(reading, tone)];
      }));
      const benchTable = reportTable(["Area", "Class", "Target", "Result", "Status"], model.benches.map(function (item) {
        const ok = meetsBench(item.target, item.result);
        return [esc(item.area), esc(item.level) + " · " + esc(item.cohort), esc(item.target), cellNum(item.result), badge(ok ? "Meeting" : "Below", ok ? "emerald" : "amber")];
      }));
      const subjectTable = reportTable(["Subject", "Average", "Marks on file"], model.subjects.map(function (item) {
        return [esc(item.label), cellNum(item.display), esc(item.note)];
      }));
      const examTable = reportTable(["Exam", "Class", "Date", "Teacher", "Room"], model.exams.map(function (exam) {
        return [esc(exam.name), esc(exam.level) + " · " + esc(exam.grade), esc(exam.when), esc(exam.teacher), esc(exam.room)];
      }));
      const staffTable = reportTable(["Teacher", "Subject", "Time in", "Time out", "Today"], state.teachers.map(function (teacher) {
        const clock = clockStatus(teacher);
        return [esc(teacher.name), esc(teacher.subject), cellNum(teacher.inTime || "—"), cellNum(teacher.outTime || "—"), badge(clock.label, clock.tone)];
      }));
      const healthRows = state.pupils360.filter(function (pupil) {
        return pupil.health.allergies !== "None" || pupil.health.conditions !== "None" || pupil.health.clinic !== "Up to date";
      });
      const caseTable = reportTable(["Pupil", "Type", "Note", "Status"], state.cases.map(function (item) {
        const tone = item.status === "Open" ? "amber" : item.status === "Resolved" ? "emerald" : "slate";
        return [esc(item.name), esc(item.kind), esc(item.note), badge(item.status, tone)];
      }));
      const healthTable = reportTable(["Pupil", "Class", "Flag", "Clinic"], healthRows.map(function (pupil) {
        const flag = [pupil.health.allergies, pupil.health.conditions].filter(function (value) { return value && value !== "None"; }).join(", ") || "Clinic review";
        return [esc(pupil.name), esc(pupil.cls), esc(flag), esc(pupil.health.clinic)];
      }));
      const payRows = state.audits.filter(function (row) { return row.action === "Recorded payment"; });
      const payTable = reportTable(["Recorded by", "For", "When", "Status"], payRows.map(function (row) {
        return [esc(row.who), esc(row.target), esc(row.when), badge("Recorded", "emerald")];
      }).concat([[esc("Kindergarten batch"), esc("Fee receipts"), esc("Today, 7:40"), badge("6 waiting", "amber")]]));
      const accountTable = reportTable(["Name", "Role", "Status"], state.accounts.map(function (account) {
        return [esc(account.name), esc(account.role), badge(account.status, account.status === "Active" ? "emerald" : "amber")];
      }));
      const noticeTable = reportTable(["Notice", "When", "Status"], state.notices.map(function (note) {
        return [esc(note.title), esc(note.time), badge(note.read ? "Read" : "Unread", note.read ? "emerald" : "amber")];
      }));
      const auditTable = reportTable(["Who", "Action", "Target", "When"], state.audits.map(function (row) {
        return [esc(row.who), esc(row.action), esc(row.target), esc(row.when)];
      }));
      const briefingRows = groups.reduce(function (list, group) {
        group.items.forEach(function (item) {
          list.push([esc(group.name), esc(item.name), cellNum(item.figure), esc(item.detail)]);
        });
        return list;
      }, []);
      const boards = {
        overview: '<section class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">' + insights + "</section>" +
          card(chartHead("Briefing table", "Every figure in this report, in one place.") + reportTable(["Area", "Report", "Figure", "Detail"], briefingRows)),
        enrollment: '<section class="grid grid-cols-1 gap-3 lg:grid-cols-2">' +
          card(chartHead("Places filled", "1,420 on the roll. 270 places are still open.") + donutChart([{ label: "Enrolled", value: 1420, color: "#1e4b9b" }, { label: "Open places", value: 270, color: "#94a3b8" }], "84%", "filled") + underChart(placesTable)) +
          card(chartHead("Grade mix", "Kindergarten is the largest band.") + donutChart(model.roll, "1,420", "pupils") + underChart(rollTable)) +
          '<div class="lg:col-span-2">' + card(chartHead("Admissions files", "The live office list, with each file in the table.") + donutChart(model.admissions, String(state.applicants.length), "files") + underChart(admissionTable)) + "</div>" +
          '<div class="lg:col-span-2">' + figures("Enrollment") + "</div></section>",
        attendance: '<section class="grid grid-cols-1 gap-3 lg:grid-cols-2">' +
          card(chartHead("Attendance by week", model.soft.label.replace("W", "Week ") + " is the dip. The dashed line is 96%.") + lineChart(model.weekPoints) + underChart(weekTable)) +
          card(chartHead("Week " + state.week + " by day", "Weekend rates pull the weekly average down.") + columnChart(model.days) + underChart(dayTable)) +
          '<div class="lg:col-span-2">' + figures("Attendance") + "</div></section>",
        academics: '<section class="grid grid-cols-1 gap-3 lg:grid-cols-2">' +
          '<div class="lg:col-span-2">' + card(chartHead("Benchmarks", model.below.length ? model.below.length + " of " + model.benches.length + " are under target." : "Every open benchmark is meeting its target.") + donutChart([{ label: "Meeting", value: model.met.length, color: "#059669" }, { label: "Below", value: model.below.length, color: "#e11d48" }], model.benches.length ? shareOf(model.met.length, model.benches.length) + "%" : "–", "meeting") + underChart(benchTable)) + "</div>" +
          card(chartHead("Subject marks", weakestNote) + (model.subjects.length ? barChart(model.subjects) : '<p class="text-xs text-slate-400">No class marks are on file.</p>') + underChart(subjectTable)) +
          card(chartHead("Exam load", model.exams.length ? "Papers for " + schoolLevelLabel() + "." : "No exams for the levels that are on.") + (model.examBars.length ? barChart(model.examBars) : '<p class="text-xs text-slate-400">Turn a level on to see its papers.</p>') + underChart(examTable)) +
          '<div class="lg:col-span-2">' + figures("Academics") + "</div></section>",
        people: '<section class="grid grid-cols-1 gap-3">' +
          card(chartHead("Staff on site", model.onSite + " of " + state.teachers.length + " are clocked in.") + donutChart(model.staff, model.onSite + "/" + state.teachers.length, "on site") + underChart(staffTable)) +
          figures("People") + "</section>",
        care: '<section class="grid grid-cols-1 gap-3">' +
          figures("Care") +
          card(chartHead("Pupil cases", "Open academic, attendance, and wellness cases.") + caseTable) +
          card(chartHead("Health flags", "Allergies, conditions, and clinic reviews on the pupil record.") + healthTable) +
          "</section>",
        finance: '<section class="grid grid-cols-1 gap-3">' +
          figures("Finance") +
          card(chartHead("Payments and receipts", "Recorded payments, plus the kindergarten batch still with the bursar.") + payTable) +
          "</section>",
        system: '<section class="grid grid-cols-1 gap-3">' +
          figures("System use") +
          card(chartHead("Accounts", "Who can sign in.") + accountTable) +
          card(chartHead("Notices", "What is still unread.") + noticeTable) +
          card(chartHead("Activity", "Actions written into the record.") + auditTable) +
          "</section>",
      };
      return shell("School reports", "Briefing for " + esc(term) + " · " + esc(schoolLevelLabel()) + ".",
        kpis + tabs + (boards[tab] || boards.overview),
        '<button type="button" data-action="download-system-report" class="' + primaryBtn + '">Download report</button>');
    },
    transcripts: function () {
      const rows = state.files.map(function (file) {
        return "<li class=\"py-3 flex justify-between border-b border-slate-100 last:border-0\"><span class=\"font-medium text-slate-900\">" + esc(file.name) + "</span><span class=\"text-slate-400\">" + esc(file.size) + "</span></li>";
      }).join("");
      return shell("Transcripts & Documents", "Upload a file to attach it to the campus document list.",
        card('<ul class="text-xs">' + rows + "</ul>"),
        '<label class="' + primaryBtn + ' cursor-pointer">Upload<input id="transcript-upload" class="hidden" type="file" /></label>');
    },
    policies: function () {
      const blocks = state.policies.map(function (policy) {
        const done = state.acked[policy.id];
        return card('<h2 class="text-sm font-semibold text-slate-900">' + esc(policy.title) + '</h2><p class="mt-2 leading-relaxed">' + esc(policy.body) + '</p><button type="button" data-action="ack-policy" data-id="' + policy.id + '" class="mt-3 ' + (done ? "text-emerald-700 font-semibold text-xs" : ghostBtn) + '"' + (done ? " disabled" : "") + ">" + (done ? "Acknowledged" : "Acknowledge") + "</button>");
      }).join("");
      return shell("School Policies", "Read and acknowledge the policies that apply this term.", '<div class="space-y-3">' + blocks + "</div>");
    },
    feedback: function () {
      return shell("Feedback", "Notes go to the campus admin queue for this session.",
        pageStats() + card('<form id="feedback-form" class="space-y-3"><label class="block text-slate-500">Topic<select id="feedback-topic" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2"><option>Academics</option><option>Attendance</option><option>Facilities</option><option>Portal access</option></select></label><label class="block text-slate-500">Message<textarea id="feedback-message" rows="4" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-400" placeholder="What should the office know?"></textarea></label><button type="submit" class="' + primaryBtn + '">Submit feedback</button></form>'));
    },
    help: function () {
      const faqs = [
        ["How do I export the dashboard?", "Use the upload icon in the top bar. It downloads a CSV of the current campus and term."],
        ["How do I collapse the sidebar?", "Use the double-arrow beside the Little Royals crest. Icons stay clickable. The compact switch in Settings does the same thing."],
        ["Where are at-risk pupils?", "Open Behavior & Discipline, or ask the assistant about Grade 4 Mathematics."],
      ];
      const items = faqs.map(function (faq, index) {
        return '<button type="button" data-action="faq" data-index="' + index + '" class="w-full text-left py-3 border-b border-slate-100"><span class="font-semibold text-slate-900">' + esc(faq[0]) + '</span><span class="faq-answer hidden block text-slate-500 mt-1 font-normal">' + esc(faq[1]) + "</span></button>";
      }).join("");
      return shell("Help & Support", "Short answers for the controls on this dashboard.",
        pageStats() + card('<div class="text-xs">' + items + "</div>"),
        '<button type="button" data-action="goto" data-page="feedback" class="' + primaryBtn + '">Contact support</button>');
    },
    settings: function () {
      const levels = state.settings.levels;
      const allOn = levels.nursery && levels.primary && levels.olevel && levels.alevel;
      function levelBox(id, label, note, on) {
        return '<label class="flex items-center justify-between gap-4"><span><strong class="text-slate-900">' + label + '</strong><span class="block text-slate-500">' + note + '</span></span><input id="' + id + '" type="checkbox" class="rounded border-slate-300 text-sky-600 focus:ring-sky-500"' + (on ? " checked" : "") + " /></label>";
      }
      return shell("Settings", "Classes run Nursery, Baby, Top, then primary, then secondary. O-level and A-level are off until you turn secondary on.",
        factRow([
          ["Levels", String(["nursery", "primary", "olevel", "alevel"].filter(function (key) { return levels[key]; }).length), "of 4 switched on"],
          ["Alerts", state.settings.alerts ? "On" : "Off", "academic banner", state.settings.alerts ? "" : "amber"],
          ["Digest", state.settings.digest ? "On" : "Off", "parent email", state.settings.digest ? "" : "amber"],
          ["Sidebar", state.settings.compact ? "Icons" : "Full", "navigation"],
        ]) +
        card('<form id="settings-form" class="space-y-4 text-xs">' +
          '<div class="space-y-3">' +
            '<p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">School levels</p>' +
            levelBox("setting-nursery", "Nursery", "Nursery, Baby, then Top.", levels.nursery) +
            levelBox("setting-primary", "Primary", "Grade 1 to Grade 6.", levels.primary) +
            levelBox("setting-olevel", "O-level", "Secondary, Form 1 to Form 4. Off for now.", levels.olevel) +
            levelBox("setting-alevel", "A-level", "Secondary, Form 5 and Form 6. Off for now.", levels.alevel) +
            levelBox("setting-all", "All levels", "Turn secondary on with nursery and primary.", allOn) +
          "</div>" +
          levelBox("setting-alerts", "Academic alerts", "Show the Grade 4 Mathematics banner on the overview.", state.settings.alerts) +
          levelBox("setting-digest", "Parent digest", "Include climate index in the weekly parent email.", state.settings.digest) +
          levelBox("setting-compact", "Compact sidebar", "Collapse the navigation to icons.", state.settings.compact) +
          '<button type="submit" class="' + primaryBtn + '">Save settings</button></form>'));
    },
    inbox: function () {
      const unread = state.threads.filter(function (thread) { return thread.unread; }).length;
      const pending = state.requests.filter(function (item) { return item.status === "Pending"; }).length;
      const approved = state.requests.filter(function (item) { return item.status === "Approved"; }).length;
      const declined = state.requests.filter(function (item) { return item.status === "Declined"; }).length;
      const messages = state.threads.reduce(function (sum, thread) { return sum + thread.messages.length; }, 0);
      const tab = state.inboxTab === "requests" ? "requests" : "inbox";
      function inboxTab(id, label, count) {
        const on = tab === id;
        return '<button type="button" data-action="inbox-tab" data-tab="' + id + '" class="inline-flex items-center gap-2 border-b-2 px-3 py-2 text-xs ' + (on ? "border-slate-900 font-semibold text-slate-900" : "border-transparent font-medium text-slate-500 hover:text-slate-900") + '">' + label + '<span class="rounded-full px-1.5 text-[10px] ' + (on ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600") + '">' + count + "</span></button>";
      }
      const tabs = '<div class="flex items-center gap-1 border-b border-slate-200">' + inboxTab("inbox", "Inbox", unread) + inboxTab("requests", "Requests", pending) + "</div>";
      const stats = '<section class="grid grid-cols-2 lg:grid-cols-4 gap-3">' + (tab === "requests"
        ? statCard("Waiting", String(pending), pending ? "need a decision" : "none waiting", "", pending ? "amber" : "") +
          statCard("Approved", String(approved), approved ? "signed off" : "none yet") +
          statCard("Declined", String(declined), declined ? "sent back" : "none yet") +
          statCard("Requests", String(state.requests.length), "from departments")
        : statCard("Unread", String(unread), unread ? "new from departments" : "all read", "", unread ? "amber" : "") +
          statCard("Departments", String(state.threads.length), "in this inbox") +
          statCard("Messages", String(messages), "across the chats") +
          statCard("Read", String(state.threads.length - unread), "caught up")) + "</section>";
      const open = tab === "requests" ? state.requests.filter(function (item) { return item.id === state.requestId; })[0] : null;
      if (open) {
        const tone = open.status === "Approved" ? "emerald" : open.status === "Declined" ? "rose" : "amber";
        const decision = open.status === "Pending"
          ? '<button type="button" data-action="approve-request" data-id="' + open.id + '" class="' + primaryBtn + '">Approve</button><button type="button" data-action="decline-request" data-id="' + open.id + '" class="' + ghostBtn + '">Decline</button>'
          : badge(open.status, tone);
        return shell(open.title, "Sent from " + esc(open.originLabel) + " by " + esc(open.from) + ".",
          stats + tabs + card('<dl class="text-xs divide-y divide-slate-100"><div class="flex justify-between gap-4 py-2"><dt class="text-slate-400">From</dt><dd class="font-semibold text-slate-900">' + esc(open.from) + "</dd></div><div class=\"flex justify-between gap-4 py-2\"><dt class=\"text-slate-400\">Department</dt><dd class=\"font-semibold text-slate-900\">" + esc(open.dept) + "</dd></div><div class=\"flex justify-between gap-4 py-2\"><dt class=\"text-slate-400\">Origin</dt><dd class=\"font-semibold text-slate-900\">" + esc(open.originLabel) + "</dd></div><div class=\"flex justify-between gap-4 py-2\"><dt class=\"text-slate-400\">Sent</dt><dd class=\"font-semibold text-slate-900\">" + esc(open.when) + "</dd></div><div class=\"flex justify-between gap-4 py-2\"><dt class=\"text-slate-400\">Status</dt><dd>" + badge(open.status, tone) + "</dd></div></dl><p class=\"mt-4 text-sm leading-relaxed text-slate-700\">" + esc(open.story) + "</p>"),
          '<button type="button" data-action="close-request" class="' + ghostBtn + '">Back to requests</button>' + decision + '<button type="button" data-action="goto" data-page="' + esc(open.origin) + '" class="' + ghostBtn + '">Open ' + esc(open.originLabel) + "</button>");
      }
      const current = state.threads.filter(function (thread) { return thread.id === state.inboxId; })[0] || state.threads[0];
      const list = state.threads.map(function (thread) {
        const on = thread.id === current.id;
        return '<button type="button" data-action="open-thread" data-id="' + thread.id + '" class="w-full text-left px-3 py-3 border-b border-slate-100 last:border-0 ' + (on ? "bg-sky-50" : "hover:bg-slate-50") + '"><span class="flex items-center justify-between gap-2"><span class="font-semibold text-slate-900">' + esc(thread.dept) + '</span>' + (thread.unread ? '<span class="h-2 w-2 rounded-full bg-sky-600"></span>' : "") + '</span><span class="block text-[11px] text-slate-500 mt-0.5">' + esc(thread.from) + "</span></button>";
      }).join("");
      const bubbles = current.messages.map(function (message) {
        const side = message.mine ? "ml-auto bg-slate-900 text-white" : "mr-auto bg-slate-100 text-slate-800";
        return '<div class="max-w-[80%] rounded-2xl px-3 py-2 ' + side + '"><p class="text-[10px] font-semibold opacity-70">' + esc(message.who) + " · " + esc(message.time) + '</p><p class="mt-0.5 leading-relaxed">' + esc(message.text) + "</p></div>";
      }).join("");
      const replies = ["Noted, I will look at this today.", "Approved from my side.", "Please send the details."].map(function (text) {
        return '<button type="button" data-action="inbox-reply" data-text="' + esc(text) + '" class="' + ghostBtn + '">' + esc(text) + "</button>";
      }).join("");
      const requestRows = state.requests.map(function (item) {
        const tone = item.status === "Approved" ? "emerald" : item.status === "Declined" ? "rose" : "amber";
        return '<div class="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-slate-100 last:border-0"><div class="min-w-0"><p class="font-semibold text-slate-900">' + esc(item.title) + '</p><p class="text-slate-500 mt-0.5">' + esc(item.dept) + " · " + esc(item.from) + " · " + esc(item.originLabel) + "</p></div><div class=\"flex items-center gap-2\">" + badge(item.status, tone) + '<button type="button" data-action="open-request" data-id="' + item.id + '" class="' + ghostBtn + '">Open</button></div></div>';
      }).join("");
      const chat = '<div class="grid lg:grid-cols-[15rem_minmax(0,1fr)] gap-4">' +
        card('<h2 class="text-sm font-semibold text-slate-900 mb-2">Departments</h2><div class="text-xs -mx-2">' + list + "</div>") +
        card('<div class="flex items-center justify-between gap-3 mb-3"><div><h2 class="text-sm font-semibold text-slate-900">' + esc(current.dept) + '</h2><p class="text-xs text-slate-500">' + esc(current.from) + '</p></div>' + (current.unread ? badge("New", "sky") : "") + '</div><div id="inbox-log" class="flex flex-col gap-2 min-h-[16rem] max-h-[24rem] overflow-y-auto text-xs">' + bubbles + '</div><form id="inbox-form" class="mt-4 space-y-2"><div class="flex flex-wrap gap-2">' + replies + '</div><div class="flex gap-2"><input id="inbox-input" class="flex-1 text-xs rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-400" placeholder="Reply to ' + esc(current.dept) + '..." /><button type="submit" class="' + primaryBtn + '">Send</button></div></form>') +
        "</div>";
      const requests = card('<h2 class="text-sm font-semibold text-slate-900 mb-1">Requests</h2><div class="text-xs">' + requestRows + "</div>");
      return shell("My Inbox", tab === "requests" ? pending + " requests are waiting." : unread + " unread chats.",
        stats + tabs + (tab === "requests" ? requests : chat));
    },
    branding: function () {
      const brand = state.brand;
      const history = (brand.history || []).map(function (item) {
        return '<li class="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-0"><span class="min-w-0"><strong class="text-slate-900">' + esc(item.name) + '</strong><span class="block text-slate-500 truncate">' + esc(item.tagline) + " · " + esc(item.when) + " · " + esc(item.note || "Saved") + '</span></span><button type="button" data-action="restore-brand" data-id="' + esc(item.id) + '" class="' + ghostBtn + '">Restore</button></li>';
      }).join("");
      const saved = (brand.history || []).length;
      return shell("Change logo", "The crest and school name show in the sidebar and the top bar. Each save keeps the previous version.",
        factRow([
          ["School", esc(brand.name), esc(brand.tagline)],
          ["Versions", String(saved + 1), saved ? saved + " earlier" : "current crest"],
          ["Crest", "Set", "sidebar and top bar"],
          ["Release", PRODUCT.version, "this build"],
        ]) +
        '<div class="grid grid-cols-1 lg:grid-cols-2 gap-3">' +
        card('<div class="flex items-center gap-4"><img src="' + esc(brand.logo || "logo.png") + '" alt="" class="h-16 w-16 object-contain rounded-lg border border-slate-100" /><div><p class="text-sm font-semibold text-slate-900">' + esc(brand.name) + '</p><p class="text-xs text-slate-500">' + esc(brand.tagline) + '</p><p class="mt-1 text-[11px] text-slate-400">Version ' + esc(PRODUCT.version) + '</p></div></div>' +
          '<form id="brand-form" class="mt-4 space-y-3">' +
          fieldInput("School name", "brand-name", brand.name) +
          fieldInput("Tagline", "brand-tagline", brand.tagline) +
          '<div class="flex flex-wrap gap-2"><button type="button" data-action="brand-mark" data-color="#1e4b9b" class="' + ghostBtn + '">Navy mark</button><button type="button" data-action="brand-mark" data-color="#047857" class="' + ghostBtn + '">Green mark</button><label class="' + ghostBtn + ' cursor-pointer">Upload image<input id="logo-file" class="hidden" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" /></label><button type="button" data-action="brand-reset" class="' + ghostBtn + '">Original crest</button></div>' +
          '<button type="submit" class="' + primaryBtn + '">Save brand</button></form>') +
        card('<h2 class="text-sm font-semibold text-slate-900">Logo versions</h2>' + (history ? '<ul class="mt-2 text-xs">' + history + "</ul>" : '<p class="mt-2 text-xs text-slate-400">No earlier logos yet. The next change is kept here.</p>')) +
        "</div>",
        '<button type="button" data-action="goto" data-page="admin-security-logo-audit" class="' + ghostBtn + '">Logo audit</button>');
    },
    logoaudit: function () {
      const rows = state.logoAudit.map(function (item) {
        const current = item.logo === state.brand.logo && item.name === state.brand.name && item.tagline === state.brand.tagline;
        return '<li class="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0"><img src="' + esc(item.logo || "logo.png") + '" alt="" class="h-12 w-12 shrink-0 rounded-lg border border-slate-100 object-contain bg-white" /><span class="min-w-0 flex-1"><strong class="text-slate-900">' + esc(item.name) + '</strong><span class="block text-slate-500">' + esc(item.tagline) + " · " + esc(item.note) + '</span><span class="block text-[11px] text-slate-400 mt-0.5">' + esc(item.who) + " · " + esc(item.when) + "</span></span>" +
          (current ? badge("Current", "emerald") : '<button type="button" data-action="restore-logo" data-id="' + esc(item.id) + '" class="' + ghostBtn + '">Restore</button>') + "</li>";
      }).join("");
      const people = {};
      state.logoAudit.forEach(function (item) { people[item.who] = true; });
      return shell("Logo audit", "Every crest and school name that was saved, newest first.",
        factRow([
          ["Entries", String(state.logoAudit.length), "newest first"],
          ["Current", "1", esc(state.brand.name)],
          ["Earlier", String(Math.max(0, state.logoAudit.length - 1)), "can restore"],
          ["People", String(Object.keys(people).length), "who changed it"],
        ]) +
        card('<ul class="text-xs">' + rows + "</ul>"),
        '<button type="button" data-action="goto" data-page="admin-school-settings-branding" class="' + ghostBtn + '">Change logo</button>');
    },
    versions: function () {
      const releases = RELEASES.map(function (item) {
        return '<li class="py-3 border-b border-slate-100 last:border-0"><p class="font-semibold text-slate-900">Version ' + esc(item.version) + '</p><p class="text-slate-500 mt-0.5">' + esc(item.date) + " · " + esc(item.notes) + "</p></li>";
      }).join("");
      const changes = state.versions.slice(0, 12).map(function (item) {
        return '<li class="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-0"><span class="min-w-0"><strong class="text-slate-900">' + esc(item.label || "Change") + '</strong><span class="block text-slate-500">' + esc(item.note || item.kind) + " · " + esc(item.when) + " · " + esc(item.who) + "</span></span>" +
          (item.kind === "record" && item.snap ? '<button type="button" data-action="restore-version" data-id="' + esc(item.id) + '" class="' + ghostBtn + '">Restore</button>' : "") +
          (item.kind === "brand" && item.brandId ? '<button type="button" data-action="restore-brand" data-id="' + esc(item.brandId) + '" class="' + ghostBtn + '">Restore</button>' : "") + "</li>";
      }).join("");
      const restorable = state.versions.filter(function (item) { return (item.kind === "record" && item.snap) || (item.kind === "brand" && item.brandId); }).length;
      return shell("Versions", "Little Royals is on version " + esc(PRODUCT.version) + ". Brand changes and record edits are listed here and can be restored.",
        factRow([
          ["Release", PRODUCT.version, "Little Royals"],
          ["Notes", String(RELEASES.length), "published"],
          ["Changes", String(state.versions.length), state.versions.length ? "saved edits" : "none yet"],
          ["Restore", String(restorable), restorable ? "can roll back" : "none waiting"],
        ]) +
        '<div class="grid grid-cols-1 lg:grid-cols-2 gap-3">' +
        card('<h2 class="text-sm font-semibold text-slate-900">Release notes</h2><ul class="mt-1 text-xs">' + releases + "</ul>") +
        card('<h2 class="text-sm font-semibold text-slate-900">Change history</h2>' + (changes ? '<ul class="mt-2 text-xs">' + changes + "</ul>" : '<p class="mt-2 text-xs text-slate-400">No saved changes yet.</p>')) +
        "</div>",
        '<button type="button" data-action="goto" data-page="admin-school-settings-branding" class="' + ghostBtn + '">Change logo</button>');
    },
    benchmarks: function () {
      const meta = window.LarcelNav && window.LarcelNav.byId[state.page];
      const label = meta ? meta.label : "School Benchmarks";
      const rows = visibleBenchmarks();
      const met = rows.filter(function (item) { return meetsBench(item.target, item.result); }).length;
      const focus = state.benchmarkLevel && state.benchmarkLevel !== "all" ? state.benchmarkLevel : schoolLevelLabel();
      const lede = label === "Competency Ratings"
        ? "Showing " + focus + ". Nursery, Baby, Top, and primary use EE, ME, AE, and BE. O-level and A-level use A to D."
        : label === "Level Targets"
          ? "Targets for " + focus + " this term. Turn a level on in Settings to include it."
          : "Class results against the school benchmark for " + focus + ".";
      const filters = ["all"].concat(["Nursery", "Primary", "O-level", "A-level"].filter(levelOn)).map(function (level) {
        const on = (state.benchmarkLevel || "all") === level;
        return '<button type="button" data-action="benchmark-filter" data-level="' + level + '" class="' + (on ? primaryBtn : ghostBtn) + '">' + (level === "all" ? "All on" : level) + "</button>";
      }).join("");
      const body = rows.map(function (item) {
        const ok = meetsBench(item.target, item.result);
        return "<tr><td class=\"py-2.5 px-3 font-semibold text-slate-900\">" + esc(item.area) + "</td><td class=\"py-2.5 px-3\">" + esc(item.strand) + "</td><td class=\"py-2.5 px-3\">" + esc(item.level) + " · " + esc(item.cohort) + "</td><td class=\"py-2.5 px-3\">" + esc(item.target) + "</td><td class=\"py-2.5 px-3 font-semibold\">" + esc(item.result) + "</td><td class=\"py-2.5 px-3\">" + badge(ok ? "Meeting" : "Below", ok ? "emerald" : "amber") + '</td><td class="py-2.5 px-3 text-right"><button type="button" data-action="benchmark-edit" data-id="' + esc(item.id) + '" class="text-xs font-medium text-slate-600 hover:text-slate-900">Update</button></td></tr>';
      }).join("") || '<tr><td colspan="7" class="py-8 px-3 text-center text-slate-400">No benchmarks for the levels that are on.</td></tr>';
      return shell(label, lede,
        '<section class="grid grid-cols-2 lg:grid-cols-4 gap-3">' +
        statCard("Benchmarks", String(rows.length), "for levels that are on") +
        statCard("Meeting", String(met), met ? "at or above target" : "none yet") +
        statCard("Below", String(rows.length - met), rows.length - met ? "need a look" : "none waiting") +
        statCard("Version", PRODUCT.version, "current release") +
        "</section>" +
        card('<div class="flex flex-wrap items-center justify-between gap-3 mb-3"><div class="flex flex-wrap gap-2">' + filters + '</div><button type="button" data-action="add-benchmark" class="' + primaryBtn + '">Add benchmark</button></div>' +
          '<div class="overflow-x-auto"><table class="w-full text-left text-xs"><thead class="text-[11px] uppercase text-slate-400 border-y border-slate-100"><tr><th class="py-2 px-3">Area</th><th class="py-2 px-3">Strand</th><th class="py-2 px-3">Class</th><th class="py-2 px-3">Target</th><th class="py-2 px-3">Result</th><th class="py-2 px-3">Status</th><th class="py-2 px-3"></th></tr></thead><tbody class="divide-y divide-slate-100">' + body + "</tbody></table></div>"));
    },
    notifications: function () {
      const rows = state.notices.map(function (item) {
        return '<button type="button" data-action="read-notice" data-id="' + item.id + '" class="w-full text-left py-3 border-b border-slate-100 last:border-0 ' + (item.read ? "opacity-60" : "") + '"><span class="font-semibold text-slate-900">' + esc(item.title) + '</span><span class="block text-slate-500 mt-0.5">' + esc(item.body) + '</span><span class="block text-[10px] text-slate-400 mt-1">' + esc(item.time) + (item.read ? " · Read" : " · New") + "</span></button>";
      }).join("");
      const unread = state.notices.filter(function (item) { return !item.read; }).length;
      return shell("Notifications", unread + " new for " + esc(state.me.name) + ".",
        factRow([
          ["Notices", String(state.notices.length), "for you"],
          ["Unread", String(unread), unread ? "still new" : "all read", unread ? "amber" : ""],
          ["Read", String(state.notices.length - unread), "caught up"],
          ["Latest", state.notices.length ? "1" : "0", state.notices.length ? esc(state.notices[0].title) : "none yet"],
        ]) +
        card('<div class="text-xs">' + rows + "</div>"),
        '<button type="button" data-action="read-all" class="' + ghostBtn + '">Mark all read</button>');
    },
    profile: function () {
      return shell("My profile", esc(state.me.role) + " at " + esc(state.brand.name) + " · " + esc(state.brand.tagline) + ".",
        factRow([
          ["Role", esc(state.me.role), "signed in"],
          ["School", esc(state.brand.name), esc(state.brand.tagline)],
          ["Email", "1", esc(state.me.email)],
          ["Access", "On", "active account"],
        ]) +
        card('<dl class="text-xs divide-y divide-slate-100"><div class="flex justify-between py-2"><dt class="text-slate-400">Name</dt><dd class="font-semibold text-slate-900">' + esc(state.me.name) + '</dd></div><div class="flex justify-between py-2"><dt class="text-slate-400">Role</dt><dd class="font-semibold text-slate-900">' + esc(state.me.role) + '</dd></div><div class="flex justify-between py-2"><dt class="text-slate-400">Email</dt><dd class="font-semibold text-slate-900">' + esc(state.me.email) + "</dd></div></dl>"),
        '<button type="button" data-action="goto" data-page="users" class="' + primaryBtn + '">Users</button><button type="button" data-action="goto" data-page="audit" class="' + ghostBtn + '">Audit logs</button>');
    },
    users: function () {
      const query = (state.userQuery || "").trim().toLowerCase();
      const list = state.accounts.filter(function (user) {
        return !query || (user.name + " " + user.email + " " + user.role + " " + user.status).toLowerCase().indexOf(query) !== -1;
      });
      const rows = list.map(function (user) {
        const tone = user.status === "Active" ? "emerald" : user.status === "Inactive" ? "rose" : "amber";
        return '<tr class="hover:bg-slate-50/80"><td class="py-3 px-4 font-medium text-slate-900">' + esc(user.name) + '</td><td class="py-3 px-3 text-slate-600">' + esc(user.email) + '</td><td class="py-3 px-3 text-slate-600">' + esc(user.role) + '</td><td class="py-3 px-3">' + badge(user.status, tone) + '</td><td class="py-3 px-4 text-right"><button type="button" data-action="toggle-user" data-id="' + user.id + '" class="text-xs font-medium text-slate-600 hover:text-slate-900">' + (user.status === "Active" ? "Deactivate" : "Activate") + "</button></td></tr>";
      }).join("");
      const active = state.accounts.filter(function (user) { return user.status === "Active"; }).length;
      const invited = state.accounts.filter(function (user) { return user.status === "Invited"; }).length;
      const inactive = state.accounts.filter(function (user) { return user.status === "Inactive"; }).length;
      const table = list.length
        ? '<div class="overflow-x-auto border-t border-slate-100"><table data-managed="1" class="w-full text-left text-xs"><thead class="bg-slate-50/80 text-[11px] font-medium uppercase tracking-wider text-slate-400"><tr><th class="py-2.5 px-4">Name</th><th class="py-2.5 px-3">Email</th><th class="py-2.5 px-3">Role</th><th class="py-2.5 px-3">Status</th><th class="py-2.5 px-4 text-right">Actions</th></tr></thead><tbody class="divide-y divide-slate-100">' + rows + "</tbody></table></div>"
        : '<div class="px-6 py-14 text-center text-sm text-slate-400 border-t border-slate-100">No users match that search.</div>';
      return shell("Users", "People who can sign in to Little Royals.",
        '<section class="grid grid-cols-2 lg:grid-cols-4 gap-3">' +
        statCard("Accounts", String(state.accounts.length), "on the directory") +
        statCard("Active", String(active), active ? active + " · signed in" : "none yet") +
        statCard("Invited", String(invited), invited ? "waiting to join" : "none waiting") +
        statCard("Inactive", String(inactive), inactive ? "access off" : "none turned off") +
        "</section>" +
        '<article class="bg-white rounded-xl border border-slate-200 overflow-hidden"><div class="flex flex-wrap items-start justify-between gap-3 px-5 py-4"><div><h2 class="text-sm font-semibold text-slate-900">Users</h2><p class="mt-0.5 text-xs text-slate-500">Browse, search and manage school accounts.</p></div><div class="flex flex-wrap items-center gap-2"><label class="relative"><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">' + glyph(ICON_SEARCH) + '</span><input id="user-search" value="' + esc(state.userQuery || "") + '" class="w-52 rounded-full border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300" placeholder="Search users" /></label><button type="button" data-action="export-users" class="' + ghostBtn + '">' + glyph(ICON_EXPORT) + ' Export</button></div></div>' + table + "</article>");
    },
    audit: function () {
      const people = {};
      state.audits.forEach(function (row) { people[row.who] = true; });
      const today = state.audits.filter(function (row) { return row.when.indexOf("Today") === 0 || row.when === "Just now"; }).length;
      const rows = state.audits.map(function (row) {
        return '<tr class="hover:bg-slate-50/80"><td class="py-3 px-4 font-medium text-slate-900">' + esc(row.who) + '</td><td class="py-3 px-3 text-slate-700">' + esc(row.action) + '</td><td class="py-3 px-3 text-slate-600">' + esc(row.target) + '</td><td class="py-3 px-4 text-slate-500">' + esc(row.when) + "</td></tr>";
      }).join("");
      return shell("Audit logs", "Who changed what at Little Royals.",
        '<section class="grid grid-cols-2 lg:grid-cols-4 gap-3">' +
        statCard("Entries", String(state.audits.length), "on this log") +
        statCard("Today", String(today), today ? "since morning" : "none yet") +
        statCard("People", String(Object.keys(people).length), "who acted") +
        statCard("Latest", state.audits.length ? "1" : "0", state.audits.length ? state.audits[0].action.toLowerCase() : "no data yet") +
        "</section>" +
        '<article class="bg-white rounded-xl border border-slate-200 overflow-hidden"><div class="flex flex-wrap items-start justify-between gap-3 px-5 py-4"><div><h2 class="text-sm font-semibold text-slate-900">Audit logs</h2><p class="mt-0.5 text-xs text-slate-500">Browse the school activity record.</p></div><button type="button" data-action="export-audit" class="' + ghostBtn + '">' + glyph(ICON_EXPORT) + ' Export</button></div><div class="overflow-x-auto border-t border-slate-100"><table class="w-full text-left text-xs"><thead class="bg-slate-50/80 text-[11px] font-medium uppercase tracking-wider text-slate-400"><tr><th class="py-2.5 px-4">Who</th><th class="py-2.5 px-3">Action</th><th class="py-2.5 px-3">Record</th><th class="py-2.5 px-4">When</th></tr></thead><tbody class="divide-y divide-slate-100">' + rows + "</tbody></table></div></article>");
    },
  };

  function applicantTone(status) {
    if (/enrolled|reviewed|approved|active/i.test(status)) return "emerald";
    if (/interview|pending|watch/i.test(status)) return "amber";
    if (/declin|left|inactive/i.test(status)) return "rose";
    return "slate";
  }

  function filteredApplicants() {
    let rows = state.applicants.slice();
    const query = (state.applicantQuery || "").trim().toLowerCase();
    if (query) {
      rows = rows.filter(function (row) {
        return (row.name + " " + row.email + " " + row.grade + " " + row.status).toLowerCase().indexOf(query) !== -1;
      });
    }
    if (state.gradeFilter !== "All") {
      rows = rows.filter(function (row) { return row.grade.indexOf(state.gradeFilter) === 0; });
    }
    if (state.sort === "original") return rows;
    const dir = state.sort.indexOf("asc") !== -1 ? 1 : -1;
    const key = state.sort.indexOf("name") === 0 ? "name" : "date";
    rows.sort(function (a, b) { return a[key].localeCompare(b[key]) * dir; });
    return rows;
  }

  function renderApplicants() {
    const rows = filteredApplicants();
    const pages = Math.max(1, Math.ceil(rows.length / state.pageSize));
    if (state.pageIndex > pages - 1) state.pageIndex = pages - 1;
    if (state.pageIndex < 0) state.pageIndex = 0;
    const start = state.pageIndex * state.pageSize;
    const slice = rows.slice(start, start + state.pageSize);
    const body = document.getElementById("applicant-body");
    body.innerHTML = slice.map(function (row) {
      const checked = state.selected.has(row.name);
      const cells = [
        state.cols.name ? '<td class="py-2.5 px-3 text-slate-900 font-semibold" data-col="name">' + esc(row.name) + "</td>" : "",
        state.cols.email ? '<td class="py-2.5 px-3 text-slate-500" data-col="email">' + esc(row.email) + "</td>" : "",
        state.cols.grade ? '<td class="py-2.5 px-3 text-slate-700" data-col="grade">' + esc(row.grade) + "</td>" : "",
        state.cols.status ? '<td class="py-2.5 px-3" data-col="status"><span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ' + TONE[row.tone] + '">' + esc(row.status) + "</span></td>" : "",
        state.cols.date ? '<td class="py-2.5 px-3 text-slate-500 tabular-nums" data-col="date">' + esc(row.display) + "</td>" : "",
      ].join("");
      return '<tr class="' + (checked ? "bg-sky-50/40" : "hover:bg-slate-50/70") + '"><td class="py-2.5 px-3"><input data-name="' + esc(row.name) + '" class="applicant-check rounded border-slate-300 text-sky-600 focus:ring-sky-500" type="checkbox" ' + (checked ? "checked" : "") + " /></td>" + cells +
        '<td class="py-2.5 px-3 text-right whitespace-nowrap">' + rowActions("applicant", row.name) + "</td></tr>";
    }).join("");
    document.querySelectorAll("#candidates-data-table thead [data-col]").forEach(function (cell) {
      cell.classList.toggle("hidden", !state.cols[cell.dataset.col]);
    });
    const label = document.getElementById("selected-label");
    if (label) label.textContent = state.selected.size + " Selected";
    document.getElementById("applicant-count").textContent = rows.length + " applicants";
    const from = rows.length ? start + 1 : 0;
    const to = Math.min(start + state.pageSize, rows.length);
    document.getElementById("page-label").textContent = "Showing " + from + "-" + to + " of " + rows.length + " applicants";
    document.getElementById("page-prev").disabled = state.pageIndex === 0;
    document.getElementById("page-next").disabled = state.pageIndex >= pages - 1;
    const box = document.getElementById("check-all");
    const names = slice.map(function (row) { return row.name; });
    const selectedOnPage = names.filter(function (name) { return state.selected.has(name); }).length;
    box.disabled = names.length === 0;
    box.checked = names.length > 0 && selectedOnPage === names.length;
    box.indeterminate = selectedOnPage > 0 && selectedOnPage < names.length;
    const pickAll = document.getElementById("applicant-select-all");
    const clearBtn = document.getElementById("applicant-clear");
    const allChosen = rows.length > 0 && rows.every(function (row) { return state.selected.has(row.name); });
    if (pickAll) {
      pickAll.classList.toggle("hidden", !(box.checked && !allChosen));
      pickAll.textContent = "Select all " + rows.length;
    }
    if (clearBtn) clearBtn.classList.toggle("hidden", state.selected.size === 0);
    paintApplicantPages(pages);
  }

  function paintApplicantPages(pages) {
    let nums = document.getElementById("page-nums");
    if (!nums) {
      nums = document.createElement("span");
      nums.id = "page-nums";
      nums.className = "inline-flex items-center gap-1";
      const next = document.getElementById("page-next");
      next.parentNode.insertBefore(nums, next);
      nums.addEventListener("click", function (event) {
        const button = event.target.closest("[data-page-index]");
        if (!button) return;
        state.pageIndex = Number(button.dataset.pageIndex) || 0;
        renderApplicants();
      });
    }
    nums.innerHTML = pageWindow(pages, state.pageIndex).map(function (item) {
      if (item === "…") return '<span class="px-1 text-slate-300">…</span>';
      const on = item === state.pageIndex;
      return '<button type="button" data-page-index="' + item + '" class="min-w-[1.5rem] rounded px-1.5 py-1 ' + (on ? "bg-slate-900 font-semibold text-white" : "text-slate-600 hover:text-slate-900") + '">' + (item + 1) + "</button>";
    }).join("");
  }

  function setWeek(week) {
    state.week = week;
    const data = WEEKS[week];
    document.getElementById("week-average").textContent = data.avg;
    document.getElementById("tooltip-rate").textContent = data.rate;
    const delta = document.getElementById("tooltip-delta");
    const text = Array.prototype.find.call(delta.childNodes, function (node) { return node.nodeType === 3 && node.textContent.trim(); });
    if (text) text.textContent = data.delta;
    delta.classList.toggle("text-emerald-600", data.delta.charAt(0) !== "-");
    delta.classList.toggle("text-rose-600", data.delta.charAt(0) === "-");
    document.querySelectorAll("#attendance-bars > div").forEach(function (column, index) {
      const bars = column.querySelectorAll(".w-5");
      if (!bars[1]) return;
      bars[0].style.height = data.bars[index][0] + "%";
      bars[1].style.height = data.bars[index][1] + "%";
    });
    document.querySelectorAll("#week-pills button").forEach(function (button, index) {
      const on = index + 1 === week;
      button.className = on
        ? "px-2.5 py-1 bg-white text-slate-900 rounded-md shadow-xs font-semibold"
        : "px-2.5 py-1 text-slate-600 hover:text-slate-900 transition-colors";
    });
  }

  function hideSearch() {
    const box = document.getElementById("search-results");
    if (box) box.classList.add("hidden");
  }

  function renderSearch(query) {
    const box = document.getElementById("search-results");
    const needle = query.trim().toLowerCase();
    if (!needle) {
      hideSearch();
      return;
    }
    const catalog = window.LarcelNav ? window.LarcelNav.pages : [];
    const pages = catalog.filter(function (item) {
      if (item.hidden) return false;
      return (item.label + " " + item.app + " " + item.module).toLowerCase().indexOf(needle) !== -1;
    }).sort(function (a, b) {
      return a.detail === b.detail ? 0 : a.detail ? 1 : -1;
    }).slice(0, 8);
    const people = state.students.filter(function (student) { return student.name.toLowerCase().indexOf(needle) !== -1; }).slice(0, 4);
    const applicants = state.applicants.filter(function (row) { return row.name.toLowerCase().indexOf(needle) !== -1; }).slice(0, 4);
    const items = pages.map(function (item) {
      const where = item.app ? item.app + " / " + item.module : "Global";
      return '<button type="button" data-page="' + item.id + '" class="block w-full text-left px-3 py-2 hover:bg-slate-50"><span class="text-slate-800 font-medium">' + esc(item.label) + '</span><span class="block text-[10px] text-slate-400">' + esc(where) + "</span></button>";
    }).concat(people.map(function (student) {
      return '<button type="button" data-page="students" data-query="' + esc(student.name) + '" class="block w-full text-left px-3 py-2 hover:bg-slate-50"><span class="text-slate-400">Student</span> <span class="text-slate-800 font-medium">' + esc(student.name) + "</span></button>";
    })).concat(applicants.map(function (row) {
      return '<button type="button" data-page="students" class="block w-full text-left px-3 py-2 hover:bg-slate-50"><span class="text-slate-400">Applicant</span> <span class="text-slate-800 font-medium">' + esc(row.name) + "</span></button>";
    }));
    box.innerHTML = items.length ? items.join("") : '<p class="px-3 py-2 text-slate-400">No matches</p>';
    box.classList.remove("hidden");
  }

  function ask(prompt) {
    state.chat.push({ role: "user", text: prompt });
    state.chat.push({ role: "assistant", text: answerFor(prompt) });
    show("copilot");
    const log = document.getElementById("chat-log");
    if (log) log.parentElement.scrollTop = log.parentElement.scrollHeight;
  }

  function bindNavigation() {
    if (window.LarcelNav) {
      window.LarcelNav.mount(document.getElementById("app-nav"), {
        onPage: show,
        onSearch: function () {
          setTimeout(function () { searchInput.focus(); searchInput.select(); }, 30);
        },
        expand: function () { setCollapsed(false); },
        isCollapsed: function () { return document.documentElement.classList.contains("sidebar-collapsed"); }
      });
    }
  }

  document.querySelectorAll("button:not([type])").forEach(function (button) { button.type = "button"; });

  const searchWrap = document.querySelector('[data-purpose="quick-search"]');
  const searchInput = document.getElementById("global-search");
  const results = document.createElement("div");
  results.id = "search-results";
  results.className = "hidden absolute left-1 right-1 top-full mt-1 z-30 bg-white border border-slate-200 rounded-lg shadow-tooltip py-1 text-xs max-h-64 overflow-auto";
  searchWrap.appendChild(results);

  document.getElementById("sidebar-toggle").addEventListener("click", function () {
    setCollapsed(!document.documentElement.classList.contains("sidebar-collapsed"));
  });
  setCollapsed(document.documentElement.classList.contains("sidebar-collapsed"));

  searchWrap.addEventListener("click", function () {
    if (document.documentElement.classList.contains("sidebar-collapsed")) {
      setCollapsed(false);
      setTimeout(function () { searchInput.focus(); }, 180);
    }
  });
  searchInput.addEventListener("input", function () { renderSearch(searchInput.value); });
  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const first = results.querySelector("[data-page]");
      if (first) {
        if (first.dataset.query) state.studentQuery = first.dataset.query;
        show(first.dataset.page);
      }
    }
  });
  results.addEventListener("click", function (event) {
    const button = event.target.closest("[data-page]");
    if (!button) return;
    state.studentQuery = button.dataset.query || "";
    show(button.dataset.page);
    searchInput.value = "";
  });

  document.getElementById("term-button").addEventListener("click", function () {
    const button = document.getElementById("term-button");
    openMenu(button, ["Term 1, 2026", "Term 2, 2026", "Term 3, 2026"].map(function (name) {
      return { label: name, run: function () { document.getElementById("term-label").textContent = name; toast("Term set to " + name); } };
    }));
  });
  function exportDashboard() {
    const school = document.getElementById("campus-label").textContent;
    const term = document.getElementById("term-label").textContent;
    download("little-royals-dashboard.csv", "metric,value\nSchool," + school + "\nTerm," + term + "\nEnrollment,1420\nAt risk,28\nAttendance," + document.getElementById("week-average").textContent + "\nApplicants," + state.applicants.length + "\n");
    toast("Dashboard export downloaded");
  }
  document.getElementById("header-notifications").addEventListener("click", function (event) {
    event.stopPropagation();
    openNotices();
  });
  document.getElementById("notice-panel").addEventListener("click", function (event) {
    event.stopPropagation();
    const button = event.target.closest("[data-action]");
    if (!button) return;
    if (button.dataset.action === "read-notice") {
      const item = state.notices.filter(function (notice) { return notice.id === button.dataset.id; })[0];
      if (item && !item.read) {
        item.read = true;
        logAudit("Read notification", item.title);
      }
      paintNotice();
      paintNotices();
    }
    if (button.dataset.action === "read-all") {
      state.notices.forEach(function (item) { item.read = true; });
      logAudit("Marked notifications read", "All");
      paintNotice();
      paintNotices();
      toast("Notifications marked read");
    }
  });
  document.getElementById("header-profile").addEventListener("click", function () {
    openMenu(document.getElementById("header-profile"), [
      { label: "My profile", run: function () { show("profile"); } },
      { label: "Users", run: function () { show("users"); } },
      { label: "Audit logs", run: function () { show("audit"); } },
      { label: "Export dashboard", run: exportDashboard },
      { label: "Refresh view", run: function () { toast("View refreshed for " + document.getElementById("term-label").textContent); } },
      { label: "Print", run: function () { window.print(); } },
      { label: "Keyboard shortcut", run: function () { openModal("Search shortcut", "<p>Press <strong>⌘K</strong> or <strong>Ctrl+K</strong> to focus search from any page.</p>", [{ label: "Close", run: function () {} }]); } },
      { label: "Sign out", run: function () { if (window.signOutSchool) window.signOutSchool(); } },
    ]);
  });
  document.getElementById("review-plan").addEventListener("click", function () {
    openModal("Intervention plan", "<p class=\"mb-2\">Grade 4 Mathematics is down 8% in attendance this week. Suggested block: Tuesday, period 5, with Ms. Alvarez.</p><ul class=\"list-disc pl-4 space-y-1\"><li>Ava Patel — two missing quizzes</li><li>Owen Clarke — four absences</li><li>11 other pupils below the midterm line</li></ul>", [
      { label: "Open assistant", primary: true, run: function () { ask("Who is at risk in Grade 4 Mathematics?"); } },
      { label: "Close", run: function () {} },
    ]);
  });
  document.getElementById("analyze-capacity").addEventListener("click", function () {
    openModal("Class capacity", "<ul class=\"space-y-2\"><li class=\"flex justify-between\"><span>Kindergarten</span><span class=\"font-semibold text-slate-900\">380 / 400</span></li><li class=\"flex justify-between\"><span>Grade 1–2</span><span class=\"font-semibold text-slate-900\">360 / 380</span></li><li class=\"flex justify-between\"><span>Grade 3–4</span><span class=\"font-semibold text-slate-900\">345 / 360</span></li><li class=\"flex justify-between\"><span>Grade 5–6</span><span class=\"font-semibold text-slate-900\">335 / 360</span></li></ul>", [
      { label: "View schedule", primary: true, run: function () { show("schedules"); } },
      { label: "Close", run: function () {} },
    ]);
  });

  document.querySelectorAll("#view-dashboard article").forEach(function (article) {
    const button = article.querySelector("button.text-slate-400");
    const heading = article.querySelector("h2");
    if (!button || !heading) return;
    button.addEventListener("click", function () {
      const title = heading.textContent.trim();
      const page = CARD_PAGES[title];
      openMenu(button, [
        { label: "View details", run: function () { if (page) show(page); } },
        { label: "Copy summary", run: function () { toast(title + " copied to the session note"); } },
      ]);
    });
  });

  document.querySelectorAll("#week-pills button").forEach(function (button, index) {
    button.addEventListener("click", function () { setWeek(index + 1); });
  });

  document.getElementById("check-all").addEventListener("change", function (event) {
    const rows = filteredApplicants();
    const start = state.pageIndex * state.pageSize;
    rows.slice(start, start + state.pageSize).forEach(function (row) {
      if (event.target.checked) state.selected.add(row.name);
      else state.selected.delete(row.name);
    });
    renderApplicants();
  });
  document.getElementById("applicant-body").addEventListener("change", function (event) {
    const box = event.target.closest(".applicant-check");
    if (!box) return;
    if (box.checked) state.selected.add(box.dataset.name);
    else state.selected.delete(box.dataset.name);
    renderApplicants();
  });
  document.getElementById("page-prev").addEventListener("click", function () {
    if (state.pageIndex <= 0) return;
    state.pageIndex -= 1;
    renderApplicants();
  });
  document.getElementById("page-next").addEventListener("click", function () {
    const pages = Math.max(1, Math.ceil(filteredApplicants().length / state.pageSize));
    if (state.pageIndex >= pages - 1) return;
    state.pageIndex += 1;
    renderApplicants();
  });
  document.getElementById("applicant-select-all").addEventListener("click", function () {
    filteredApplicants().forEach(function (row) { state.selected.add(row.name); });
    renderApplicants();
  });
  document.getElementById("applicant-clear").addEventListener("click", function () {
    state.selected.clear();
    renderApplicants();
  });
  document.getElementById("filter-grade").addEventListener("click", function () {
    openMenu(document.getElementById("filter-grade"), ["All"].concat(activeGrades()).map(function (grade) {
      return { label: grade === "All" ? "All grades" : grade, run: function () { state.gradeFilter = grade; state.pageIndex = 0; renderApplicants(); toast(grade === "All" ? "Showing all grades" : "Filtered to " + grade); } };
    }));
  });
  document.getElementById("sort-applicants").addEventListener("click", function () {
    const order = ["date-desc", "date-asc", "name-asc", "name-desc"];
    const labels = { "date-desc": "Newest date", "date-asc": "Oldest date", "name-asc": "Name A–Z", "name-desc": "Name Z–A" };
    openMenu(document.getElementById("sort-applicants"), order.map(function (key) {
      return { label: labels[key], run: function () { state.sort = key; renderApplicants(); } };
    }));
  });
  document.getElementById("batch-review").addEventListener("click", function () {
    if (!state.selected.size) {
      toast("Select at least one applicant");
      return;
    }
    const names = Array.from(state.selected);
    openModal("Batch review", "<p class=\"mb-2\">" + names.length + " applicant" + (names.length === 1 ? "" : "s") + " selected.</p><ul class=\"list-disc pl-4 space-y-1\">" + names.map(function (name) { return "<li>" + esc(name) + "</li>"; }).join("") + "</ul>", [
      { label: "Mark reviewed", primary: true, run: function () {
        state.applicants.forEach(function (row) {
          if (state.selected.has(row.name)) { row.status = "Reviewed"; row.tone = "emerald"; }
        });
        state.selected.clear();
        renderApplicants();
        toast("Marked " + names.length + " as reviewed");
      } },
      { label: "Cancel", run: function () {} },
    ]);
  });
  document.getElementById("customize-cols").addEventListener("click", function () {
    const fields = [["name", "Student name"], ["email", "Email"], ["grade", "Grade"], ["status", "Status"], ["date", "Date"]];
    const html = fields.map(function (field) {
      return '<label class="flex items-center gap-2 py-1"><input type="checkbox" data-col-toggle="' + field[0] + '" ' + (state.cols[field[0]] ? "checked" : "") + ' class="rounded border-slate-300 text-sky-600 focus:ring-sky-500" />' + field[1] + "</label>";
    }).join("");
    openModal("Customize columns", html, [
      { label: "Apply", primary: true, close: false, run: function () {
        const picked = {};
        document.querySelectorAll("[data-col-toggle]").forEach(function (box) { picked[box.dataset.colToggle] = box.checked; });
        if (!Object.keys(picked).some(function (key) { return picked[key]; })) {
          toast("Keep at least one column");
          return;
        }
        state.cols = picked;
        renderApplicants();
        closeModal();
      } },
      { label: "Cancel", run: function () {} },
    ]);
  });
  document.getElementById("export-report").addEventListener("click", function () {
    const chosen = filteredApplicants().filter(function (row) { return state.selected.has(row.name); });
    const rows = chosen.length ? chosen : filteredApplicants();
    const lines = [["name", "email", "grade", "status", "date"].map(csvCell).join(",")].concat(rows.map(function (row) {
      return [row.name, row.email, row.grade, row.status, row.display].map(csvCell).join(",");
    }));
    download("admissions-report.csv", lines.join("\n"));
    toast(chosen.length ? "Exported " + rows.length + " selected" : "Admissions report downloaded");
  });
  document.getElementById("applicant-search").addEventListener("input", function (event) {
    state.applicantQuery = event.target.value;
    state.pageIndex = 0;
    renderApplicants();
  });
  document.getElementById("import-applicants").addEventListener("click", function () {
    pickCsv(function (rows) {
      if (!rows.length) { toast("That file has no rows"); return; }
      let start = 0;
      if (/name/i.test(rows[0][0] || "")) start = 1;
      let added = 0;
      for (let i = start; i < rows.length; i++) {
        const cells = rows[i];
        if (!cells[0]) continue;
        const status = cells[3] || "Interviewing";
        state.applicants.unshift({
          name: cells[0],
          email: cells[1] || "",
          grade: cells[2] || "Kindergarten",
          status: status,
          tone: applicantTone(status),
          date: cells[4] || "",
          display: cells[4] || "Imported",
        });
        added += 1;
      }
      if (!added) { toast("No rows to import"); return; }
      state.pageIndex = 0;
      renderApplicants();
      toast("Imported " + added);
    });
  });
  document.getElementById("applicant-body").addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const name = button.dataset.id;
    const row = state.applicants.filter(function (item) { return item.name === name; })[0];
    if (!row) return;
    if (button.dataset.action === "applicant-view") {
      if (viewNamed(row.name)) return;
      viewPairs(row.name, [
        ["Student", row.name],
        ["Email", row.email],
        ["Grade", row.grade],
        ["Status", row.status],
        ["Filed", row.display],
      ]);
    }
    if (button.dataset.action === "applicant-edit") {
      openModal("Edit " + row.name, '<form id="applicant-form" class="space-y-3">' +
        '<label class="block"><span class="text-[11px] font-semibold text-slate-700">Student</span><input id="applicant-name" value="' + esc(row.name) + '" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2" /></label>' +
        '<label class="block"><span class="text-[11px] font-semibold text-slate-700">Email</span><input id="applicant-email" value="' + esc(row.email) + '" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2" /></label>' +
        '<label class="block"><span class="text-[11px] font-semibold text-slate-700">Grade</span><input id="applicant-grade" value="' + esc(row.grade) + '" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2" /></label>' +
        '<label class="block"><span class="text-[11px] font-semibold text-slate-700">Status</span><input id="applicant-status" value="' + esc(row.status) + '" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2" /></label></form>', [
        { label: "Save", primary: true, close: false, run: function () {
          const next = document.getElementById("applicant-name").value.trim();
          if (!next) { toast("Name is required"); return; }
          row.name = next;
          row.email = document.getElementById("applicant-email").value.trim();
          row.grade = document.getElementById("applicant-grade").value.trim();
          row.status = document.getElementById("applicant-status").value.trim() || row.status;
          row.tone = applicantTone(row.status);
          closeModal();
          renderApplicants();
          toast("Saved");
        } },
        { label: "Cancel", run: function () {} },
      ]);
    }
    if (button.dataset.action === "applicant-update") {
      const flow = ["Enrolled", "Interviewing", "Documentation Pending", "Reviewed"];
      const index = flow.indexOf(row.status);
      row.status = flow[(index + 1) % flow.length];
      row.tone = applicantTone(row.status);
      renderApplicants();
      toast(row.name + " updated to " + row.status);
    }
    if (button.dataset.action === "applicant-remove") {
      openModal("Delete " + row.name, "<p>Delete this applicant.</p>", [
        { label: "Delete", primary: true, close: false, run: function () {
          state.applicants = state.applicants.filter(function (item) { return item !== row; });
          state.selected.delete(name);
          closeModal();
          renderApplicants();
          toast("Deleted");
        } },
        { label: "Cancel", run: function () {} },
      ]);
    }
  });

  document.getElementById("view-stage").addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    if (action === "goto") show(button.dataset.page);
    if (action === "inbox-tab") {
      state.inboxTab = button.dataset.tab === "requests" ? "requests" : "inbox";
      state.requestId = "";
      show("inbox");
    }
    if (action === "report-tab") {
      state.reportTab = button.dataset.tab || "overview";
      show("reports");
    }
    if (action === "open-thread") {
      state.inboxTab = "inbox";
      state.requestId = "";
      state.inboxId = button.dataset.id;
      const thread = state.threads.filter(function (item) { return item.id === state.inboxId; })[0];
      if (thread) thread.unread = false;
      show("inbox");
    }
    if (action === "inbox-reply") {
      const thread = state.threads.filter(function (item) { return item.id === state.inboxId; })[0];
      const text = button.dataset.text;
      if (thread && text) {
        thread.messages.push({ who: state.me.name, mine: true, text: text, time: "Just now" });
        thread.unread = false;
        show("inbox");
        toast("Reply sent to " + thread.dept);
      }
    }
    if (action === "open-request") {
      state.inboxTab = "requests";
      state.requestId = button.dataset.id;
      show("inbox");
    }
    if (action === "close-request") {
      state.inboxTab = "requests";
      state.requestId = "";
      show("inbox");
    }
    if (action === "restore-logo") {
      const item = state.logoAudit.filter(function (row) { return row.id === button.dataset.id; })[0];
      if (!item) return;
      commitBrand({ name: item.name, tagline: item.tagline, logo: item.logo }, "Restored " + item.name);
      show("admin-security-logo-audit");
      toast("Restored " + item.name);
    }
    if (action === "approve-request" || action === "decline-request") {
      const item = state.requests.filter(function (entry) { return entry.id === button.dataset.id; })[0];
      if (item && item.status === "Pending") {
        item.status = action === "approve-request" ? "Approved" : "Declined";
        logAudit(item.status + " request", item.title);
        show("inbox");
        toast(item.title + " " + item.status.toLowerCase());
      }
    }
    if (action === "read-notice") {
      const item = state.notices.filter(function (notice) { return notice.id === button.dataset.id; })[0];
      if (item && !item.read) {
        item.read = true;
        logAudit("Read notification", item.title);
        show("notifications");
      }
    }
    if (action === "read-all") {
      state.notices.forEach(function (item) { item.read = true; });
      logAudit("Marked notifications read", "All");
      show("notifications");
      toast("Notifications marked read");
    }
    if (action === "toggle-user") {
      const user = state.accounts.filter(function (item) { return item.id === button.dataset.id; })[0];
      if (!user) return;
      user.status = user.status === "Active" ? "Inactive" : "Active";
      logAudit(user.status === "Active" ? "Activated user" : "Deactivated user", user.name);
      show("users");
      toast(user.name + " is " + user.status.toLowerCase());
    }
    if (action === "add-user") {
      openModal("Add user", '<form id="user-form" class="space-y-2"><input id="user-name" class="w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="Full name" /><input id="user-email" class="w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="Email" /><input id="user-role" class="w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="Role" /></form>', [
        { label: "Save", primary: true, close: false, run: function () {
          const name = document.getElementById("user-name").value.trim();
          const email = document.getElementById("user-email").value.trim();
          const role = document.getElementById("user-role").value.trim();
          if (!name || !email) { toast("Name and email are required"); return; }
          state.accounts.unshift({ id: "u" + Date.now(), name: name, email: email, role: role || "Staff", status: "Invited" });
          logAudit("Invited user", name);
          closeModal();
          show("users");
          toast(name + " invited");
        } },
        { label: "Cancel", run: function () {} },
      ]);
    }
    if (action === "record-clear") {
      const data = BOOKS[state.page];
      if (!data) return;
      data.selected = {};
      paintRecords();
    }
    if (action === "record-mark") {
      const data = BOOKS[state.page];
      if (!data) return;
      const ids = visibleSelected(data);
      if (!ids.length) { toast("Select at least one row"); return; }
      const keep = {};
      ids.forEach(function (id) { keep[id] = true; });
      data.rows.forEach(function (row) {
        if (keep[row.id]) row.status = data.good;
      });
      ids.forEach(function (id) { delete data.selected[id]; });
      noteChange(data);
      paintRecords();
      toast("Marked " + ids.length + " as " + data.good.toLowerCase());
    }
    if (action === "record-select-all") {
      const data = BOOKS[state.page];
      if (!data) return;
      visibleRows(data).forEach(function (row) { data.selected[row.id] = true; });
      paintRecords();
    }
    if (action === "record-export") {
      const data = BOOKS[state.page];
      if (!data) return;
      const chosen = visibleSelected(data);
      const rows = chosen.length ? visibleRows(data).filter(function (row) { return chosen.indexOf(row.id) !== -1; }) : visibleRows(data);
      const lines = [data.cols.map(csvCell).join(",")].concat(rows.map(function (row) {
        return [row.a, row.b, row.c, row.status].map(csvCell).join(",");
      }));
      download(state.page + ".csv", lines.join("\n"));
      toast(chosen.length ? "Exported " + rows.length + " selected" : "Exported the current rows");
    }
    if (action === "record-import") {
      const data = BOOKS[state.page];
      if (data) pickCsv(function (rows) { importRecordRows(data, rows); });
    }
    if (action === "record-update") {
      const data = BOOKS[state.page];
      const row = data && findRow(data, button.dataset.id);
      if (!row) return;
      const list = data.statuses || [];
      const index = list.indexOf(row.status);
      row.status = index === -1 ? (list[0] || nextToken(row.status)) : list[(index + 1) % list.length];
      noteChange(data);
      paintRecords();
      toast(row.a + " updated to " + row.status);
    }
    if (action === "record-remove") {
      const data = BOOKS[state.page];
      const row = data && findRow(data, button.dataset.id);
      if (!row) return;
      openModal("Delete " + row.a, "<p>Delete this record.</p>", [
        { label: "Delete", primary: true, close: false, run: function () { deleteRows(data, [row.id]); } },
        { label: "Cancel", run: function () {} },
      ]);
    }
    if (action === "record-add") {
      const data = BOOKS[state.page];
      if (data) openRecordForm(data, null);
    }
    if (action === "record-sort") {
      const data = BOOKS[state.page];
      if (!data) return;
      const key = button.dataset.key;
      if (data.sortKey === key) data.sortDir = data.sortDir === "desc" ? "asc" : "desc";
      else { data.sortKey = key; data.sortDir = "asc"; }
      data.page = 0;
      paintRecords();
    }
    if (action === "record-page") {
      const data = BOOKS[state.page];
      if (!data || button.disabled) return;
      const info = pagedRows(data);
      if (button.dataset.dir === "prev") data.page = Math.max(0, data.page - 1);
      else if (button.dataset.dir === "next") data.page = Math.min(info.pages - 1, data.page + 1);
      else data.page = Number(button.dataset.index) || 0;
      paintRecords();
    }
    if (action === "grid-page" || action === "grid-clear" || action === "grid-select-all" || action === "grid-delete" || action === "grid-mark") {
      const key = button.dataset.grid;
      const grid = key && state.grids[key];
      const table = gridTable(key);
      if (!grid || !table || button.disabled) return;
      if (action === "grid-page") {
        const pages = Math.max(1, Math.ceil(gridShown(grid).length / PAGE_SIZE) || 1);
        if (button.dataset.dir === "prev") grid.page = Math.max(0, grid.page - 1);
        else if (button.dataset.dir === "next") grid.page = Math.min(pages - 1, grid.page + 1);
        else grid.page = Number(button.dataset.index) || 0;
        paintGrid(table, key);
      }
      if (action === "grid-clear") {
        grid.selected = {};
        paintGrid(table, key);
      }
      if (action === "grid-select-all") {
        gridShown(grid).forEach(function (item) { grid.selected[item.id] = true; });
        paintGrid(table, key);
      }
      if (action === "grid-mark" && currentView() === "users") {
        const ids = gridSelection(key);
        const names = {};
        ids.forEach(function (id) { names[id.split("|")[0]] = true; });
        let n = 0;
        state.accounts.forEach(function (user) {
          if (names[user.name] && user.status !== "Active") { user.status = "Active"; n += 1; }
        });
        grid.selected = {};
        if (n) logAudit("Activated users", Object.keys(names).join(", "));
        show(state.page);
        toast(n ? "Activated " + n : "Those accounts are already active");
      }
      if (action === "grid-delete") {
        const ids = gridSelection(key);
        if (!ids.length) { toast("Select at least one row"); return; }
        const view = currentView();
        if (view === "users") {
          const names = {};
          ids.forEach(function (id) { names[id.split("|")[0]] = true; });
          if (names[state.me.name] && Object.keys(names).length === 1) { toast("Your own account stays on the list"); return; }
          delete names[state.me.name];
          const removed = Object.keys(names);
          state.accounts = state.accounts.filter(function (user) { return !names[user.name]; });
          grid.selected = {};
          logAudit("Removed users", removed.join(", "));
          show(state.page);
          toast("Deleted " + removed.length);
          return;
        }
        if (view === "audit") {
          state.audits = state.audits.filter(function (row) {
            return ids.indexOf([row.who, row.action, row.target, row.when].join("|")) === -1;
          });
          grid.selected = {};
          show(state.page);
          toast("Deleted " + ids.length);
          return;
        }
        if (view === "benchmarks") {
          state.benchmarks = state.benchmarks.filter(function (item) {
            const prefix = item.area + "|" + item.strand + "|" + item.level + " · " + item.cohort;
            return !ids.some(function (id) { return id.indexOf(prefix) === 0; });
          });
          saveBenchmarks();
          grid.selected = {};
          show(state.page);
          toast("Deleted " + ids.length);
          return;
        }
        ids.forEach(function (id) {
          grid.hidden[id] = true;
          delete grid.selected[id];
        });
        paintGrid(table, key);
        toast("Deleted " + ids.length);
      }
    }
    if (action === "grid-add") openGridAdd(button.dataset.grid);
    if (action === "grid-import") {
      const key = button.dataset.grid;
      if (state.grids[key]) pickCsv(function (rows) { importGridRows(key, rows); });
    }
    if (action === "grid-export") exportGridRows(button.dataset.grid);
    if (action === "grid-edit") openGridEditor(button.dataset.grid, button.dataset.id, "Edit");
    if (action === "grid-view") {
      const key = button.dataset.grid;
      const grid = state.grids[key];
      const item = grid && findGridItem(grid, button.dataset.id);
      if (!item) return;
      const table = gridTable(key);
      if (table && table.dataset.noView === "1") return;
      if (viewNamed(item.cells[0])) return;
      const heads = table && table.tHead ? Array.prototype.map.call(table.tHead.rows[0].cells, function (cell) {
        return cell.textContent.replace(/\s+/g, " ").trim();
      }).slice(1, -1) : [];
      viewPairs(item.cells[0] || "Details", item.cells.map(function (cell, index) {
        return [heads[index] || "Detail", cell];
      }));
    }
    if (action === "grid-update") {
      const key = button.dataset.grid;
      const id = button.dataset.id;
      const grid = state.grids[key];
      const item = grid && findGridItem(grid, id);
      if (!item) return;
      const cells = item.cells.slice();
      const last = cells.length - 1;
      if (last < 0) return;
      const next = nextToken(cells[last]);
      if (next === cells[last]) {
        openGridEditor(key, id, "Update");
        return;
      }
      cells[last] = next;
      saveGridCells(key, id, cells);
      toast("Updated to " + next);
    }
    if (action === "grid-remove") {
      const key = button.dataset.grid;
      const id = button.dataset.id;
      const grid = state.grids[key];
      if (!grid || !id) return;
      openModal("Delete row", "<p>Delete this row.</p>", [
        { label: "Delete", primary: true, close: false, run: function () {
          grid.selected[id] = true;
          closeModal();
          const table = gridTable(key);
          const view = currentView();
          if (view === "users") {
            const name = id.split("|")[0];
            if (name === state.me.name) { toast("Your own account stays on the list"); return; }
            state.accounts = state.accounts.filter(function (user) { return user.name !== name; });
            logAudit("Removed user", name);
            show(state.page);
            toast("Deleted");
            return;
          }
          if (view === "audit") {
            state.audits = state.audits.filter(function (row) {
              return [row.who, row.action, row.target, row.when].join("|") !== id;
            });
            show(state.page);
            toast("Deleted");
            return;
          }
          if (view === "benchmarks") {
            state.benchmarks = state.benchmarks.filter(function (item) {
              const prefix = item.area + "|" + item.strand + "|" + item.level + " · " + item.cohort;
              return id.indexOf(prefix) !== 0;
            });
            saveBenchmarks();
            show(state.page);
            toast("Deleted");
            return;
          }
          grid.hidden[id] = true;
          delete grid.selected[id];
          grid.extra = (grid.extra || []).filter(function (item) { return item.id !== id; });
          if (table) paintGrid(table, key);
          toast("Deleted");
        } },
        { label: "Cancel", run: function () {} },
      ]);
    }
    if (action === "export-users") {
      const lines = ["name,email,role,status"].concat(state.accounts.map(function (user) {
        return [user.name, user.email, user.role, user.status].join(",");
      }));
      download("little-royals-users.csv", lines.join("\n"));
      toast("Exported users");
    }
    if (action === "export-audit") {
      const lines = ["who,action,record,when"].concat(state.audits.map(function (row) {
        return [row.who, row.action, row.target, row.when].join(",");
      }));
      download("little-royals-audit.csv", lines.join("\n"));
      toast("Exported audit logs");
    }
    if (action === "record-open" || action === "record-view") {
      const data = BOOKS[state.page];
      const row = data && findRow(data, button.dataset.id);
      if (!row) return;
      state.recordId = row.id;
      show(state.page);
    }
    if (action === "record-back") {
      state.recordId = "";
      show(state.page);
    }
    if (action === "record-edit") {
      const data = BOOKS[state.page];
      const row = data && findRow(data, button.dataset.id || state.recordId);
      if (row) openRecordForm(data, row);
    }
    if (action === "record-versions") {
      const data = BOOKS[state.page];
      const row = data && findRow(data, button.dataset.id || state.recordId);
      if (row) openRecordVersions(row);
    }
    if (action === "record-linked") {
      if (button.dataset.view === "student360") {
        const pupil = pupilNamed(button.dataset.name);
        if (pupil) state.pupilId = pupil.id;
      }
      if (button.dataset.view === "teacherprofile") {
        const teacher = teacherNamed(button.dataset.name);
        if (teacher) state.teacherId = teacher.id;
      }
      show(button.dataset.view);
    }
    if (action === "record-delete-selected") {
      const data = BOOKS[state.page];
      if (!data) return;
      const ids = visibleSelected(data);
      if (!ids.length) { toast("Select at least one row"); return; }
      openModal("Delete selected", "<p>Delete " + ids.length + (ids.length === 1 ? " selected record" : " selected records") + ".</p>", [
        { label: "Delete", primary: true, close: false, run: function () { deleteRows(data, ids); } },
        { label: "Cancel", run: function () {} },
      ]);
    }
    if (action === "ask") ask(button.dataset.prompt);
    if (action === "add-student") {
      openModal("Add pupil", '<form id="add-student-form" class="space-y-2"><input id="new-student-name" class="w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="Full name" /><input id="new-student-grade" class="w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="Grade, e.g. Grade 3" /><input id="new-student-advisor" class="w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="Class teacher" /></form>', [
        { label: "Save student", primary: true, close: false, run: function () {
          const name = document.getElementById("new-student-name").value.trim();
          const grade = document.getElementById("new-student-grade").value.trim();
          const advisor = document.getElementById("new-student-advisor").value.trim();
          if (!name || !grade) { toast("Name and grade are required"); return; }
          state.students.unshift({ name: name, sid: "ST-" + (1000 + state.students.length), grade: grade, advisor: advisor || "Unassigned", status: "Active" });
          closeModal();
          show("students");
          toast(name + " added to the roster");
        } },
        { label: "Cancel", run: function () {} },
      ]);
    }
    if (action === "gradebook") {
      openModal(button.dataset.course + " gradebook", "<p>Class average is published for " + esc(document.getElementById("term-label").textContent) + ". Individual scores stay in the teacher gradebook.</p>", [{ label: "Close", primary: true, run: function () {} }]);
    }
    if (action === "open-teacher") {
      state.teacherId = button.dataset.id;
      show("teacherprofile");
    }
    if (action === "clock-span") {
      state.clockSpan = button.dataset.span || "today";
      show(state.page);
    }
    if (action === "clock-in") {
      const teacher = teacherById(button.dataset.id);
      if (!teacher.inTime) teacher.inTime = nowTime();
      show(state.page);
      toast(teacher.name + " timed in at " + teacher.inTime);
    }
    if (action === "clock-out") {
      const teacher = teacherById(button.dataset.id);
      if (teacher.inTime && !teacher.outTime) teacher.outTime = nowTime();
      show(state.page);
      toast(teacher.name + " timed out at " + teacher.outTime);
    }
    if (action === "balance-load") {
      const before = loadRows().spread;
      const moves = balanceLoads();
      const after = loadRows();
      show("academics-teaching-teacher-workload");
      toast(moves ? "Moved " + moves + (moves === 1 ? " class" : " classes") + ". Spread is now " + after.spread + " periods." : "The load is already balanced. Spread is " + before + " periods.");
    }
    if (action === "resolve-discipline") {
      const teacher = teacherById(button.dataset.id);
      const item = teacher.discipline.filter(function (entry) { return entry.id === button.dataset.case; })[0];
      if (item) item.status = "Closed";
      show(state.page);
      toast("Discipline case closed");
    }
    if (action === "add-discipline") {
      const selected = button.dataset.id || state.teacherId;
      const options = state.teachers.map(function (teacher) {
        return '<option value="' + teacher.id + '"' + (teacher.id === selected ? " selected" : "") + ">" + esc(teacher.name) + "</option>";
      }).join("");
      openModal("Add discipline case", '<form class="space-y-2"><label class="block text-slate-500">Teacher<select id="discipline-teacher" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2">' + options + '</select></label><label class="block text-slate-500">Type<select id="discipline-kind" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2"><option>Late arrival</option><option>Missed duty</option><option>Conduct</option><option>Lesson plan</option></select></label><label class="block text-slate-500">Note<textarea id="discipline-note" rows="3" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="What happened?"></textarea></label></form>', [
        { label: "Save case", primary: true, close: false, run: function () {
          const note = document.getElementById("discipline-note").value.trim();
          if (!note) { toast("Add a note before saving"); return; }
          const teacher = teacherById(document.getElementById("discipline-teacher").value);
          teacher.discipline.unshift({ id: "d" + Date.now(), date: "Oct 11, 2026", kind: document.getElementById("discipline-kind").value, note: note, status: "Open" });
          state.teacherId = teacher.id;
          closeModal();
          show(state.page);
          toast("Case added for " + teacher.name);
        } },
        { label: "Cancel", run: function () {} },
      ]);
    }
    if (action === "message-staff") {
      openModal("Message " + button.dataset.name, '<textarea id="staff-note" rows="3" class="w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="Write a short note"></textarea>', [
        { label: "Send", primary: true, close: false, run: function () {
          const note = document.getElementById("staff-note").value.trim();
          if (!note) { toast("Write a note before sending"); return; }
          closeModal();
          toast("Note sent to " + button.dataset.name);
        } },
        { label: "Cancel", run: function () {} },
      ]);
    }
    if (action === "send-digest") toast("Weekly digest queued for linked households");
    if (action === "toggle-present") {
      const row = state.roster[Number(button.dataset.index)];
      row.present = !row.present;
      show("attendance");
    }
    if (action === "add-class") {
      openModal("Add class", '<form class="space-y-2"><input id="class-course" class="w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="Course" /><input id="class-teacher" class="w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="Teacher" /><input id="class-room" class="w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="Room" /></form>', [
        { label: "Add", primary: true, close: false, run: function () {
          const course = document.getElementById("class-course").value.trim();
          if (!course) { toast("Course name is required"); return; }
          state.classes.push({ period: String(state.classes.length + 1), course: course, teacher: document.getElementById("class-teacher").value.trim() || "TBA", room: document.getElementById("class-room").value.trim() || "TBA" });
          closeModal();
          show("schedules");
          toast(course + " added to the schedule");
        } },
        { label: "Cancel", run: function () {} },
      ]);
    }
    if (action === "resolve-case") {
      const item = state.cases.find(function (entry) { return entry.id === button.dataset.id; });
      if (item) item.status = "Resolved";
      show("wellness");
      toast("Case marked resolved");
    }
    if (action === "add-exam" || action === "add-plan") {
      const grades = activeGrades();
      if (!grades.length) { toast("Turn on a school level in Settings first"); return; }
      const teachers = state.teachers.map(function (teacher) { return teacher.name; });
      const isExam = action === "add-exam";
      const fields = '<form class="space-y-2">' +
        '<label class="block text-slate-500">Teacher<select id="work-teacher" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2">' + selectOptions(teachers) + "</select></label>" +
        '<label class="block text-slate-500">Class<select id="work-grade" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2">' + selectOptions(grades) + "</select></label>" +
        '<label class="block text-slate-500">Subject<select id="work-subject" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2">' + selectOptions(SUBJECTS) + "</select></label>" +
        (isExam
          ? '<input id="work-name" class="w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="Exam name" /><input id="work-when" class="w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="Date" /><input id="work-room" class="w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="Room" />'
          : '<input id="work-name" class="w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="Study plan title" /><input id="work-weeks" class="w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="Number of weeks" /><textarea id="work-outline" rows="3" class="w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="What will be taught"></textarea>') +
        "</form>";
      openModal(isExam ? "Create exam" : "Create study plan", fields, [
        { label: "Save", primary: true, close: false, run: function () {
          const name = document.getElementById("work-name").value.trim();
          const grade = document.getElementById("work-grade").value;
          const item = {
            teacher: document.getElementById("work-teacher").value,
            grade: grade,
            subject: document.getElementById("work-subject").value,
            level: levelForGrade(grade),
          };
          if (!name) { toast(isExam ? "Exam name is required" : "Plan title is required"); return; }
          if (isExam) {
            state.exams.push(Object.assign(item, { name: name, when: document.getElementById("work-when").value.trim() || "Date TBA", room: document.getElementById("work-room").value.trim() || "Room TBA" }));
            closeModal();
            show("exams");
            toast(name + " created");
          } else {
            state.plans.unshift(Object.assign(item, { id: "p" + Date.now(), title: name, weeks: document.getElementById("work-weeks").value.trim() || "1", outline: document.getElementById("work-outline").value.trim() || "Outline to follow." }));
            closeModal();
            show("studyplans");
            toast(name + " saved");
          }
        } },
        { label: "Cancel", run: function () {} },
      ]);
    }
    if (action === "download-system-report") {
      const term = document.getElementById("term-label").textContent;
      function cell(value) {
        return '"' + String(value).replace(/"/g, '""') + '"';
      }
      const lines = ["category,report,usage,detail", cell("Term") + "," + cell("General reports") + "," + cell(term) + "," + cell("Whole system")];
      usageReports().forEach(function (group) {
        group.items.forEach(function (item) {
          lines.push([cell(group.name), cell(item.name), cell(item.figure), cell(item.detail)].join(","));
        });
      });
      const briefing = reportModel();
      briefing.insights.forEach(function (item) {
        lines.push([cell("Insight"), cell(item.title), cell(item.kicker), cell(item.body)].join(","));
      });
      briefing.roll.forEach(function (item) {
        lines.push([cell("Grade mix"), cell(item.label), cell(item.value), cell("Published roll")].join(","));
      });
      briefing.weekPoints.forEach(function (item) {
        lines.push([cell("Attendance"), cell(item.label), cell(item.value + "%"), cell("Weekly average")].join(","));
      });
      briefing.subjects.forEach(function (item) {
        lines.push([cell("Subject"), cell(item.label), cell(item.display), cell(item.note)].join(","));
      });
      briefing.days.forEach(function (item) {
        lines.push([cell("Attendance day"), cell(item.label), cell(item.value + "%"), cell("Week " + state.week)].join(","));
      });
      briefing.benches.forEach(function (item) {
        lines.push([cell("Benchmark"), cell(item.area), cell(item.result), cell(item.level + " · " + item.cohort + " · target " + item.target)].join(","));
      });
      state.applicants.forEach(function (item) {
        lines.push([cell("Admissions"), cell(item.name), cell(item.status), cell(item.grade + " · " + item.display)].join(","));
      });
      briefing.exams.forEach(function (item) {
        lines.push([cell("Exam"), cell(item.name), cell(item.when), cell(item.teacher + " · " + item.room)].join(","));
      });
      download("little-royals-general-reports.csv", lines.join("\n"));
      toast("General reports downloaded");
    }
    if (action === "download-report") {
      download(button.dataset.name.replace(/\s+/g, "_") + "_report.csv", "student,term,status\n" + button.dataset.name + "," + document.getElementById("term-label").textContent + ",Published\n");
      toast("Report downloaded for " + button.dataset.name);
    }
    if (action === "ack-policy") {
      state.acked[button.dataset.id] = true;
      show("policies");
      toast("Policy acknowledged");
    }
    if (action === "brand-mark") {
      commitBrand({ name: state.brand.name, tagline: state.brand.tagline, logo: markSvg(button.dataset.color, schoolInitials(state.brand.name)) }, "Logo mark");
      show(state.page);
      toast("Logo updated");
    }
    if (action === "brand-reset") {
      commitBrand({ name: "Little Royals", tagline: "Kindergarten & Primary School", logo: "logo.png" }, "Original crest");
      show(state.page);
      toast("Original crest restored");
    }
    if (action === "restore-brand") restoreBrand(button.dataset.id);
    if (action === "restore-version") restoreVersion(button.dataset.id);
    if (action === "benchmark-filter") {
      state.benchmarkLevel = button.dataset.level;
      show(state.page);
    }
    if (action === "add-benchmark") {
      const grades = activeGrades();
      if (!grades.length) { toast("Turn on a school level in Settings first"); return; }
      const scale = "<option>EE</option><option selected>ME</option><option>AE</option><option>BE</option><option>A</option><option>B+</option><option>B</option><option>B-</option><option>C+</option><option>C</option><option>D</option>";
      openModal("Add benchmark", '<form class="space-y-2"><label class="block text-slate-500">Class<select id="bench-grade" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2">' + selectOptions(grades) + '</select></label><input id="bench-area" class="w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="Learning area" /><input id="bench-strand" class="w-full text-xs rounded-lg border border-slate-200 px-3 py-2" placeholder="Strand" /><label class="block text-slate-500">Target<select id="bench-target" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2">' + scale + '</select></label><label class="block text-slate-500">Result<select id="bench-result" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2">' + scale + "</select></label></form>", [
        { label: "Save", primary: true, close: false, run: function () {
          const area = document.getElementById("bench-area").value.trim();
          const strand = document.getElementById("bench-strand").value.trim();
          const grade = document.getElementById("bench-grade").value;
          if (!area || !strand) { toast("Add the learning area and strand"); return; }
          state.benchmarks.unshift({ id: "b" + Date.now(), level: levelForGrade(grade), area: area, strand: strand, cohort: grade, target: document.getElementById("bench-target").value, result: document.getElementById("bench-result").value });
          saveBenchmarks();
          logAudit("Added benchmark", area);
          closeModal();
          show(state.page);
          toast(area + " added");
        } },
        { label: "Cancel", run: function () {} },
      ]);
    }
    if (action === "benchmark-edit") {
      const item = state.benchmarks.filter(function (row) { return row.id === button.dataset.id; })[0];
      if (!item) return;
      const scale = ["EE", "ME", "AE", "BE", "A", "B+", "B", "B-", "C+", "C", "D"].map(function (value) {
        return "<option" + (value === item.result ? " selected" : "") + ">" + value + "</option>";
      }).join("");
      openModal("Update " + item.area, '<p class="text-slate-500 mb-2">' + esc(item.level) + " · " + esc(item.cohort) + " · target " + esc(item.target) + '</p><label class="block text-slate-500">Result<select id="bench-result" class="mt-1 w-full text-xs rounded-lg border border-slate-200 px-3 py-2">' + scale + "</select></label>", [
        { label: "Save", primary: true, close: false, run: function () {
          const next = document.getElementById("bench-result").value;
          pushVersion({ kind: "benchmark", label: item.area, when: "Just now", who: state.me.name, note: item.result + " to " + next });
          item.result = next;
          saveBenchmarks();
          closeModal();
          show(state.page);
          toast(item.area + " updated");
        } },
        { label: "Cancel", run: function () {} },
      ]);
    }
    if (action === "faq") {
      const answer = button.querySelector(".faq-answer");
      if (answer) answer.classList.toggle("hidden");
    }
  });

  document.getElementById("view-stage").addEventListener("submit", function (event) {
    event.preventDefault();
    if (event.target.id === "inbox-form") {
      const input = document.getElementById("inbox-input");
      const text = input.value.trim();
      const thread = state.threads.filter(function (item) { return item.id === state.inboxId; })[0];
      if (!text) { toast("Write a reply first"); return; }
      if (thread) {
        thread.messages.push({ who: state.me.name, mine: true, text: text, time: "Just now" });
        thread.unread = false;
        show("inbox");
        toast("Reply sent to " + thread.dept);
      }
    }
    if (event.target.id === "chat-form") {
      const input = document.getElementById("chat-input");
      const prompt = input.value.trim();
      if (!prompt) { toast("Type a question first"); return; }
      ask(prompt);
    }
    if (event.target.id === "feedback-form") {
      const message = document.getElementById("feedback-message").value.trim();
      if (!message) { toast("Add a message before submitting"); return; }
      const topic = document.getElementById("feedback-topic").value;
      event.target.reset();
      toast("Feedback received · " + topic);
    }
    if (event.target.id === "settings-form") {
      const nursery = document.getElementById("setting-nursery").checked;
      const primary = document.getElementById("setting-primary").checked;
      const olevel = document.getElementById("setting-olevel").checked;
      const alevel = document.getElementById("setting-alevel").checked;
      if (!nursery && !primary && !olevel && !alevel) { toast("Choose at least one school level"); return; }
      state.settings.levels = { nursery: nursery, primary: primary, olevel: olevel, alevel: alevel };
      state.settings.alerts = document.getElementById("setting-alerts").checked;
      state.settings.digest = document.getElementById("setting-digest").checked;
      state.settings.compact = document.getElementById("setting-compact").checked;
      setCollapsed(state.settings.compact);
      if (state.gradeFilter !== "All" && activeGrades().indexOf(state.gradeFilter) === -1) state.gradeFilter = "All";
      paintSchoolLevel();
      const banner = document.querySelector('[data-purpose="ai-insight-banner"]');
      if (banner) banner.classList.toggle("hidden", !state.settings.alerts);
      saveSettings();
      toast("Settings saved · " + schoolLevelLabel());
    }
    if (event.target.id === "brand-form") {
      const name = document.getElementById("brand-name").value.trim();
      const tagline = document.getElementById("brand-tagline").value.trim();
      if (!name) { toast("School name is required"); return; }
      commitBrand({ name: name, tagline: tagline || state.brand.tagline, logo: state.brand.logo }, "Saved brand");
      show(state.page);
      toast("Brand saved");
    }
  });

  document.getElementById("view-stage").addEventListener("change", function (event) {
    if (event.target.id === "teacher-select") {
      state.teacherId = event.target.value;
      show(state.page);
    }
    if (event.target.classList.contains("duty-teacher")) {
      const duty = state.duties.filter(function (item) { return item.id === event.target.dataset.duty; })[0];
      if (duty) {
        duty.teacherId = event.target.value;
        show(state.page);
        toast(duty.className + " moved to " + teacherById(duty.teacherId).name);
      }
    }
    if (event.target.id === "pupil-select") {
      state.pupilId = event.target.value;
      show(state.page);
    }
    if (event.target.id === "setting-all") {
      ["setting-nursery", "setting-primary", "setting-olevel", "setting-alevel"].forEach(function (id) {
        const box = document.getElementById(id);
        if (box) box.checked = event.target.checked;
      });
    }
    if (event.target.id === "setting-nursery" || event.target.id === "setting-primary" || event.target.id === "setting-olevel" || event.target.id === "setting-alevel") {
      const all = document.getElementById("setting-all");
      if (all) all.checked = document.getElementById("setting-nursery").checked && document.getElementById("setting-primary").checked && document.getElementById("setting-olevel").checked && document.getElementById("setting-alevel").checked;
    }
    if (event.target.id === "setting-compact") setCollapsed(event.target.checked);
    if (event.target.id === "setting-alerts") state.settings.alerts = event.target.checked;
    if (event.target.id === "setting-digest") state.settings.digest = event.target.checked;
    if (event.target.id === "record-status" && BOOKS[state.page]) {
      BOOKS[state.page].filter = event.target.value;
      BOOKS[state.page].page = 0;
      paintRecords();
    }
    if (event.target.id === "record-group" && BOOKS[state.page]) {
      BOOKS[state.page].group = event.target.value;
      BOOKS[state.page].page = 0;
      paintRecords();
    }
    if (event.target.id === "record-all" && BOOKS[state.page]) {
      const data = BOOKS[state.page];
      pagedRows(data).rows.forEach(function (row) {
        if (event.target.checked) data.selected[row.id] = true;
        else delete data.selected[row.id];
      });
      paintRecords();
    }
    if (event.target.dataset.recordId && BOOKS[state.page]) {
      const data = BOOKS[state.page];
      if (event.target.checked) data.selected[event.target.dataset.recordId] = true;
      else delete data.selected[event.target.dataset.recordId];
      paintRecords();
    }
    if (event.target.dataset.gridAll && state.grids[event.target.dataset.gridAll]) {
      const key = event.target.dataset.gridAll;
      const grid = state.grids[key];
      const items = gridShown(grid);
      const start = grid.page * PAGE_SIZE;
      items.slice(start, start + PAGE_SIZE).forEach(function (item) {
        if (event.target.checked) grid.selected[item.id] = true;
        else delete grid.selected[item.id];
      });
      paintGrid(event.target.closest("table"), key);
    }
    if (event.target.dataset.gridFilter && state.grids[event.target.dataset.gridFilter]) {
      const key = event.target.dataset.gridFilter;
      state.grids[key].filter = event.target.value;
      state.grids[key].page = 0;
      paintGrid(gridTable(key), key);
    }
    if (event.target.dataset.gridGroup && state.grids[event.target.dataset.gridGroup]) {
      const key = event.target.dataset.gridGroup;
      state.grids[key].group = event.target.value;
      state.grids[key].page = 0;
      paintGrid(gridTable(key), key);
    }
    if (event.target.dataset.gridBox && state.grids[event.target.dataset.gridBox]) {
      const key = event.target.dataset.gridBox;
      const grid = state.grids[key];
      const id = event.target.dataset.gridId;
      if (event.target.checked) grid.selected[id] = true;
      else delete grid.selected[id];
      paintGrid(event.target.closest("table"), key);
    }
    if (event.target.id === "logo-file" && event.target.files[0]) {
      const file = event.target.files[0];
      if (!/^image\//.test(file.type)) { toast("Choose an image"); return; }
      if (file.size > 700000) { toast("Use an image under 700 KB"); return; }
      const reader = new FileReader();
      reader.onload = function () {
        commitBrand({ name: state.brand.name, tagline: state.brand.tagline, logo: String(reader.result) }, "Uploaded logo");
        show(state.page);
        toast("Logo updated");
      };
      reader.readAsDataURL(file);
    }
    if (event.target.id === "transcript-upload" && event.target.files[0]) {
      const file = event.target.files[0];
      state.files.unshift({ name: file.name, size: Math.max(1, Math.round(file.size / 1024)) + " KB" });
      show("transcripts");
      toast("Uploaded " + file.name);
    }
  });
  document.getElementById("view-stage").addEventListener("input", function (event) {
    if (event.target.id === "student-filter") {
      state.studentQuery = event.target.value;
      renderStudentRows();
    }
    if (event.target.id === "record-search") {
      const data = BOOKS[state.page];
      if (!data) return;
      data.query = event.target.value;
      data.page = 0;
      paintRecords();
    }
    if (event.target.dataset.gridSearch && state.grids[event.target.dataset.gridSearch]) {
      const key = event.target.dataset.gridSearch;
      state.grids[key].query = event.target.value;
      state.grids[key].page = 0;
      paintGrid(gridTable(key), key);
    }
    if (event.target.id === "user-search") {
      state.userQuery = event.target.value;
      const caret = event.target.selectionStart;
      show("users");
      const field = document.getElementById("user-search");
      if (field) { field.focus(); field.setSelectionRange(caret, caret); }
    }
  });

  document.getElementById("modal-root").addEventListener("click", function (event) {
    if (event.target.closest("[data-close-modal]")) closeModal();
    const restore = event.target.closest("[data-action='restore-version']");
    if (restore) restoreVersion(restore.dataset.id);
  });
  document.getElementById("modal-root").addEventListener("submit", function (event) {
    if (event.target.id !== "record-form") return;
    event.preventDefault();
    const save = document.querySelector("#modal-actions button");
    if (save) save.click();
  });
  document.addEventListener("click", function (event) {
    if (menuAnchor && (menuAnchor === event.target || menuAnchor.contains(event.target) || event.target.closest("#menu-root"))) return;
    closeMenu();
    if (!event.target.closest("#header-notifications, #notice-panel")) closeNotices();
    if (!event.target.closest('[data-purpose="quick-search"]')) hideSearch();
  });
  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (document.documentElement.classList.contains("sidebar-collapsed")) setCollapsed(false);
      setTimeout(function () { searchInput.focus(); searchInput.select(); }, 30);
    }
    if (event.key === "Escape") {
      closeMenu();
      closeNotices();
      closeModal();
      hideSearch();
      document.documentElement.classList.remove("nav-open");
    }
  });

  document.getElementById("nav-open").addEventListener("click", function () {
    document.documentElement.classList.add("nav-open");
  });
  document.getElementById("nav-backdrop").addEventListener("click", function () {
    document.documentElement.classList.remove("nav-open");
  });

  document.getElementById("net-status").addEventListener("click", function () {
    clearTimeout(net.syncTimer);
    clearTimeout(net.resetTimer);
    if (isOnline()) {
      net.forcedOffline = true;
      net.mode = "offline";
      paintNet();
      toast("Working offline. Changes stay on this computer until you reconnect.");
      return;
    }
    net.forcedOffline = false;
    if (!navigator.onLine) {
      paintNet();
      toast("Still no internet connection.");
      return;
    }
    if (totalDirty()) syncSoon();
    else {
      net.mode = "online";
      paintNet();
      toast("Back online");
    }
  });
  window.addEventListener("offline", function () {
    clearTimeout(net.syncTimer);
    net.mode = "offline";
    paintNet();
    toast("Internet dropped. You can keep working, and changes will sync later.");
  });
  window.addEventListener("online", function () {
    if (net.forcedOffline) return;
    if (totalDirty()) syncSoon();
    else { net.mode = "online"; paintNet(); }
  });
  paintNet();
  if (isOnline() && totalDirty()) syncSoon();

  bindNavigation();
  paintSchoolLevel();
  applyBrand();
  const changeLogo = document.getElementById("change-logo");
  if (changeLogo) changeLogo.addEventListener("click", function () { show("admin-school-settings-branding"); });
  const openVersions = document.getElementById("open-versions");
  if (openVersions) openVersions.addEventListener("click", function () { show("admin-system-release-notes"); });
  window.addEventListener("popstate", function () {
    const next = (location.hash || "").replace(/^#/, "") || "dashboard";
    if (next === state.page) return;
    show(next, true);
  });
  const hash = (location.hash || "").replace(/^#/, "");
  if (hash && window.LarcelNav && (window.LarcelNav.byId[hash] || PAGES[hash] || hash === "dashboard")) show(hash, true);
  else {
    syncNav("dashboard");
    if (window.LarcelNav) window.LarcelNav.paintTabs("dashboard");
  }
  renderApplicants();
  paintNotice();

  window.requestAccount = function (user) {
    if (!user || !user.email) return;
    state.accounts.unshift({ id: "u" + Date.now(), name: user.name, email: user.email, role: "Staff", status: "Invited" });
    logAudit("Requested an account", user.name);
  };
  window.applySession = function (user) {
    if (!user) return;
    state.me = { name: user.name, role: user.role || "Staff", email: user.email };
    const button = document.getElementById("header-profile");
    if (button) {
      button.title = user.name;
      button.setAttribute("aria-label", "Profile, " + user.name);
    }
    logAudit("Signed in", user.name);
  };
  try {
    const saved = JSON.parse(localStorage.getItem("littleroyals-session") || "null");
    if (saved && saved.email) window.applySession(saved);
  } catch (e) {}
})();

export {};
