import type { AppData, Department, Staff, Student, Subject, Resource, Lab, TimetableEntry, ExamSchedule, SubjectAllocation, MentorAllocation, Candidate, ApprovalRequest } from './types';

const ACADEMIC_YEAR = '2026–27';
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
const SLOT_DETAILS = [
  { number: 1, start: '09:00', end: '10:00' },
  { number: 2, start: '10:00', end: '11:00' },
  { number: 3, start: '11:00', end: '12:00' },
  { number: 4, start: '13:00', end: '14:00' },
  { number: 5, start: '14:00', end: '15:00' },
  { number: 6, start: '15:00', end: '16:00' },
] as const;

const departments: Department[] = [
  { id: 'd1', name: 'Bachelor of Computer Applications', code: 'BCA', hodId: 's3', email: 'hod.bca@college.edu', contact: '9876543210', facultyCount: 4, studentCount: 13, labCount: 2, classroomCount: 3 },
  { id: 'd2', name: 'Bachelor of Commerce', code: 'B.Com.', hodId: 's7', email: 'hod.bcom@college.edu', contact: '9876543220', facultyCount: 4, studentCount: 6, labCount: 1, classroomCount: 2 },
  { id: 'd3', name: 'Bachelor of Science', code: 'B.Sc.', hodId: 's11', email: 'hod.bsc@college.edu', contact: '9876543230', facultyCount: 4, studentCount: 6, labCount: 2, classroomCount: 2 },
  { id: 'd4', name: 'Bachelor of Arts', code: 'B.A.', hodId: 's15', email: 'hod.ba@college.edu', contact: '9876543240', facultyCount: 4, studentCount: 6, labCount: 1, classroomCount: 2 },
];

const facultySeed: Array<[string, string, string, string, string[]]> = [
  ['s3', 'Priyanka', 'Professor & HOD', 'd1', ['Programming in C', 'Python Programming', 'Database Management Systems', 'Data Structures', 'Major Project']],
  ['s4', 'Rahul', 'Associate Professor', 'd1', ['Digital Fundamentals', 'Java Programming', 'Web Development', 'Computer Architecture', 'Mobile Application Development']],
  ['s5', 'Nandini', 'Assistant Professor', 'd1', ['Web Technologies', 'Computer Networks', 'Software Engineering', 'Cloud Computing', 'Artificial Intelligence Fundamentals']],
  ['s6', 'Karthik', 'Lecturer / Instructor', 'd1', ['Mathematics', 'Statistics', 'Project Management', 'Cyber Security', 'Seminar']],
  ['s7', 'Shwetha', 'Professor & HOD', 'd2', ['Financial Accounting', 'Corporate Accounting', 'Cost Accounting', 'Management Accounting', 'Project Work']],
  ['s8', 'Meghana', 'Associate Professor', 'd2', ['Business Economics', 'Business Law', 'Financial Management', 'Strategic Management', 'Corporate Finance']],
  ['s9', 'Rohan', 'Assistant Professor', 'd2', ['Marketing Management', 'Business Statistics', 'Investment Management', 'GST', 'Business Analytics']],
  ['s10', 'Deepa', 'Lecturer / Instructor', 'd2', ['Business Communication', 'Entrepreneurship', 'Business Research', 'Auditing', 'Viva/Seminar']],
  ['s11', 'Varshini', 'Professor & HOD', 'd3', ['Mathematics', 'Physics', 'Chemistry', 'Statistics', 'Project Work']],
  ['s12', 'Anil', 'Associate Professor', 'd3', ['Differential Equations', 'Real Analysis', 'Numerical Methods', 'Quantum Physics', 'Mathematical Modelling']],
  ['s13', 'Kavya', 'Assistant Professor', 'd3', ['Organic Chemistry', 'Physical Chemistry', 'Electronics', 'Advanced Chemistry', 'Applied Physics']],
  ['s14', 'Sandeep', 'Lecturer / Instructor', 'd3', ['Computer Science', 'Data Analysis', 'Computer Applications', 'Research Methodology', 'Seminar']],
  ['s15', 'Sharanya', 'Professor & HOD', 'd4', ['English Literature', 'Kannada Literature', 'History', 'Political Science', 'Dissertation']],
  ['s16', 'Harish', 'Associate Professor', 'd4', ['Economics', 'Sociology', 'Indian Economy', 'Public Policy', 'Contemporary Society']],
  ['s17', 'Aishwarya', 'Assistant Professor', 'd4', ['Psychology', 'Indian Constitution', 'Social Psychology', 'Human Rights', 'Literature Seminar']],
  ['s18', 'Naveen', 'Lecturer / Instructor', 'd4', ['English Communication', 'Public Administration', 'Research Methodology', 'World History', 'Viva/Seminar']],
];

const staff: Staff[] = [
  { id: 's1', name: 'Bhavesh Suvarna', designation: 'Principal', role: 'principal', departmentId: 'd1', email: 'principal@college.edu', phone: '9876500001', subjects: [], classes: [], status: 'active', attendancePct: 98, feedbackScore: 4.9, performanceRating: 5, pendingWork: 0, weeklyHours: 40, employmentType: 'full-time', joinedOn: '2015-06-01', qualifications: 'Ph.D', publications: 24, researchProjects: 4, address: 'College Campus', gender: 'Male', dob: '1970-03-15', bloodGroup: 'B+' },
  { id: 's2', name: 'Varshitha', designation: 'Dean', role: 'dean', departmentId: 'd1', email: 'dean@college.edu', phone: '9876500002', subjects: [], classes: [], status: 'active', attendancePct: 97, feedbackScore: 4.8, performanceRating: 5, pendingWork: 1, weeklyHours: 38, employmentType: 'full-time', joinedOn: '2016-07-15', qualifications: 'Ph.D', publications: 18, researchProjects: 3, address: 'Faculty Quarters', gender: 'Female', dob: '1974-11-22', bloodGroup: 'O+' },
  ...(facultySeed.map(([id, name, designation, departmentId, subjects], i) => ({
    id,
    name,
    designation,
    role: designation.includes('HOD') ? 'hod' : designation === 'Professor' ? 'professor' : designation.startsWith('Associate') ? 'associate-professor' : designation.startsWith('Assistant') ? 'assistant-professor' : 'lecturer',
    departmentId,
    email: `${name.toLowerCase()}@college.edu`,
    phone: `98765000${String(i + 3).padStart(2, '0')}`,
    subjects,
    classes: [`${departmentId.toUpperCase()}-A`],
    status: 'active' as const,
    attendancePct: 91 + (i % 8),
    feedbackScore: Number((4.2 + (i % 7) / 10).toFixed(1)),
    performanceRating: 4,
    pendingWork: i % 3,
    weeklyHours: 32 + (i % 4) * 2,
    employmentType: 'full-time' as const,
    joinedOn: `20${10 + (i % 12)}-07-01`,
    qualifications: designation.includes('HOD') ? 'Ph.D' : 'M.Com / M.Sc / M.A.',
    publications: 3 + (i % 8),
    researchProjects: i % 3,
    address: 'Faculty Quarters, Campus',
    gender: i % 2 ? 'Female' : 'Male',
    dob: `198${i % 9}-0${(i % 8) + 1}-15`,
    bloodGroup: i % 2 ? 'O+' : 'A+',
  })) as Staff[]),
];

const studentNames: Record<string, string[]> = {
  d1: ['Adila', 'Ajay Raj', 'Hasreena', 'Pallavi', 'Chethan S', 'Chethan A.J.', 'Ananya H', 'Bharathi', 'Kiran', 'Pavan', 'Snigdha', 'Shamitha', 'Shaheed'],
  d2: ['Shaziya', 'Shiyal', 'Shradha', 'Vaishnavi', 'Ziyan', 'Afreen'],
  d3: ['Shreyas', 'Fiona', 'Thejaksha', 'Rakshith', 'Pranav', 'Maya'],
  d4: ['Arun', 'Likith', 'Nikitha', 'Deekshith', 'Sunil', 'Kavana'],
};

const subjectCatalog: Record<string, Record<number, string[]>> = {
  d1: {
    1: ['Programming in C', 'Mathematics', 'Digital Fundamentals', 'Communication Skills', 'Computer Fundamentals'],
    2: ['Python Programming', 'Data Structures', 'Discrete Mathematics', 'Web Technologies', 'Communication Skills'],
    3: ['Database Management Systems', 'Computer Networks', 'Java Programming', 'Operating Systems', 'Statistics'],
    4: ['Software Engineering', 'Advanced Java', 'Web Development', 'Computer Architecture', 'Mathematics'],
    5: ['Python Application Development', 'Data Analytics', 'Cloud Computing', 'Project Management', 'Elective'],
    6: ['Major Project', 'Artificial Intelligence Fundamentals', 'Cyber Security', 'Mobile Application Development', 'Seminar'],
  },
  d2: {
    1: ['Financial Accounting', 'Business Economics', 'Business Communication', 'Business Mathematics', 'Business Environment'],
    2: ['Corporate Accounting', 'Business Law', 'Marketing Management', 'Business Statistics', 'Environmental Studies'],
    3: ['Cost Accounting', 'Income Tax', 'Banking Theory', 'Human Resource Management', 'Entrepreneurship'],
    4: ['Advanced Accounting', 'Financial Management', 'Auditing', 'E-Commerce', 'Business Research'],
    5: ['Management Accounting', 'Investment Management', 'GST', 'Entrepreneurship Development', 'Elective'],
    6: ['Project Work', 'Strategic Management', 'Corporate Finance', 'Business Analytics', 'Viva/Seminar'],
  },
  d3: {
    1: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Communication Skills'],
    2: ['Differential Equations', 'Mechanics', 'Organic Chemistry', 'Programming', 'Statistics'],
    3: ['Mathematical Methods', 'Electricity and Magnetism', 'Physical Chemistry', 'Data Analysis', 'Statistics'],
    4: ['Real Analysis', 'Quantum Physics', 'Inorganic Chemistry', 'Computer Applications', 'Research Methodology'],
    5: ['Numerical Methods', 'Electronics', 'Analytical Chemistry', 'Advanced Statistics', 'Elective'],
    6: ['Project Work', 'Mathematical Modelling', 'Applied Physics', 'Advanced Chemistry', 'Seminar'],
  },
  d4: {
    1: ['English Literature', 'Kannada Literature', 'History', 'Political Science', 'Economics'],
    2: ['Sociology', 'Psychology', 'Indian Constitution', 'English Communication', 'Economics'],
    3: ['Indian History', 'Political Theory', 'Social Psychology', 'Public Administration', 'Kannada Literature'],
    4: ['Modern Literature', 'Indian Economy', 'Sociology of Education', 'Human Rights', 'Research Methodology'],
    5: ['World History', 'Indian Political System', 'Development Economics', 'Social Research', 'Elective'],
    6: ['Dissertation', 'Public Policy', 'Contemporary Society', 'Literature Seminar', 'Viva/Seminar'],
  },
};

const departmentFaculty: Record<string, string[]> = {
  d1: ['s3', 's4', 's5', 's6'],
  d2: ['s7', 's8', 's9', 's10'],
  d3: ['s11', 's12', 's13', 's14'],
  d4: ['s15', 's16', 's17', 's18'],
};

const roomList = ['Room 101', 'Room 102', 'Room 103', 'Room 104', 'Room 105', 'Room 106', 'Room 107', 'Room 108'];
const labList = ['Computer Lab 1', 'Computer Lab 2', 'Physics Lab', 'Chemistry Lab', 'Statistics Lab'];

const rooms = roomList.map((name, index) => ({
  id: `room-${index + 1}`,
  name,
  departmentId: index < 3 ? 'd1' : index < 6 ? 'd2' : index < 8 ? 'd3' : 'd4',
  capacity: 60,
}));

const resources: Resource[] = [
  ...rooms.map((room) => ({
    id: `res-${room.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: room.name,
    category: 'classroom' as const,
    departmentId: room.departmentId,
    location: `Block ${room.name.replace(/\D/g, '')[0] ?? 'A'}`,
    status: 'available' as const,
    isLab: false,
    capacity: 60,
  })),
  ...labList.map((lab, index) => ({
    id: `lab-res-${index + 1}`,
    name: lab,
    category: 'computer' as const,
    departmentId: index < 2 ? 'd1' : index === 2 ? 'd3' : index === 3 ? 'd3' : 'd3',
    location: index < 2 ? 'Computer Block' : 'Science Block',
    status: 'available' as const,
    isLab: true,
    capacity: 40,
  })),
];

const labs: Lab[] = [
  { id: 'lab-1', name: 'Computer Lab 1', departmentId: 'd1', capacity: 40, inChargeId: 's4', subjects: ['Programming in C', 'Python Programming', 'Database Management Systems', 'Web Development'], systems: 30, equipment: [{ name: 'Projector', qty: 1, status: 'available' }, { name: 'Desktop', qty: 30, status: 'available' }], maintenanceStatus: 'good' },
  { id: 'lab-2', name: 'Computer Lab 2', departmentId: 'd1', capacity: 40, inChargeId: 's5', subjects: ['Python Programming', 'Java Programming', 'Cloud Computing', 'Mobile Application Development'], systems: 30, equipment: [{ name: 'Projector', qty: 1, status: 'available' }, { name: 'Desktop', qty: 30, status: 'available' }], maintenanceStatus: 'good' },
  { id: 'lab-3', name: 'Physics Lab', departmentId: 'd3', capacity: 35, inChargeId: 's12', subjects: ['Physics', 'Mechanics', 'Electricity and Magnetism', 'Applied Physics'], systems: 18, equipment: [{ name: 'Oscilloscope', qty: 4, status: 'available' }], maintenanceStatus: 'good' },
  { id: 'lab-4', name: 'Chemistry Lab', departmentId: 'd3', capacity: 35, inChargeId: 's13', subjects: ['Chemistry', 'Organic Chemistry', 'Physical Chemistry', 'Advanced Chemistry'], systems: 16, equipment: [{ name: 'Fume Hood', qty: 3, status: 'available' }], maintenanceStatus: 'good' },
  { id: 'lab-5', name: 'Statistics Lab', departmentId: 'd3', capacity: 30, inChargeId: 's14', subjects: ['Statistics', 'Data Analysis', 'Advanced Statistics'], systems: 12, equipment: [{ name: 'Workstation', qty: 12, status: 'available' }], maintenanceStatus: 'good' },
];

const students: Student[] = Object.entries(studentNames).flatMap(([departmentId, names]) =>
  names.map((name, index) => {
    const department = departments.find((d) => d.id === departmentId)!;
    const score = index % 6 === 0 ? 87 : index % 5 === 0 ? 81 : index % 4 === 0 ? 76 : index % 3 === 0 ? 68 : 74;
    const semester = (index % 6) + 1;
    const section = index % 2 === 0 ? 'A' : 'B';
    const rollNo = `${department.code.replace('.', '')}2026${String(index + 1).padStart(3, '0')}`;

    return {
      id: `st${departmentId}${index + 1}`,
      name,
      rollNo,
      program: department.name,
      semester,
      section,
      departmentId,
      email: `${name.toLowerCase().replace(/[^a-z]/g, '.')}@student.edu`,
      phone: `998877${String(6600 + index).slice(-4)}`,
      gender: index % 2 ? 'Female' : 'Male',
      dob: `200${index % 6}-0${(index % 8) + 1}-12`,
      bloodGroup: index % 2 ? 'O+' : 'B+',
      address: 'Bengaluru',
      parentName: `Parent of ${name}`,
      parentPhone: '9988770000',
      parentEmail: 'parent@student.edu',
      admissionDate: '2024-08-01',
      admissionType: index % 3 === 0 ? 'Merit' : 'Management',
      status: 'active',
      attendancePct: 74 + (index % 18),
      gpa: Number((score / 10).toFixed(1)),
      cgpa: Number(((score / 10) - 0.2).toFixed(1)),
      backlogs: score < 70 ? 1 : 0,
      internalMarks: [],
      subjects: subjectCatalog[departmentId][semester] ?? [],
      projectTitle: `${department.code} Capstone Project`,
      projectGuide: department.hodId,
      projectProgress: 60 + (index % 30),
      projectSubject: 'Project Work',
      projectHod: department.hodId,
      projectType: 'Group',
      projectDescription: 'Semester project aligned with the academic timetable and learning outcomes.',
      projectAcademicYear: ACADEMIC_YEAR,
      projectStartDate: '2026-07-15',
      projectDeadline: '2026-11-30',
      projectStatus: index % 3 === 0 ? 'In Progress' : 'Pending',
      projectMarks: 70 + (index % 20),
      projectGrade: 'A',
      projectRemarks: 'On schedule',
      projectMembers: [name],
      grievances: [],
      discipline: [],
    };
  })
);

const subjects: Subject[] = [];
const subjectAllocations: SubjectAllocation[] = [];
const subjectLookup = new Map<string, Subject>();
const roomResourceMap: Record<string, string> = {
  'Room 101': 'res-room-101',
  'Room 102': 'res-room-102',
  'Room 103': 'res-room-103',
  'Room 104': 'res-room-104',
  'Room 105': 'res-room-105',
  'Room 106': 'res-room-106',
  'Room 107': 'res-room-107',
  'Room 108': 'res-room-108',
  'Computer Lab 1': 'lab-res-1',
  'Computer Lab 2': 'lab-res-2',
  'Physics Lab': 'lab-res-3',
  'Chemistry Lab': 'lab-res-4',
  'Statistics Lab': 'lab-res-5',
};

for (const department of departments) {
  const facultyIds = departmentFaculty[department.id] ?? [department.hodId];

  for (let semester = 1; semester <= 6; semester += 1) {
    const deptSubjects = subjectCatalog[department.id][semester] ?? [];

    deptSubjects.forEach((subjectName, index) => {
      const code = `${department.code.replace(/[^A-Z]/g, '')}${semester}${String(index + 1).padStart(2, '0')}`;
      const facultyId = facultyIds[(semester + index) % facultyIds.length] ?? department.hodId;
      const isPractical = ['Programming in C', 'Python Programming', 'Data Structures', 'Database Management Systems', 'Java Programming', 'Web Development', 'Python Application Development', 'Major Project', 'Mobile Application Development', 'Business Statistics', 'E-Commerce', 'Business Analytics', 'Project Work', 'GST', 'Management Accounting', 'Programming', 'Data Analysis', 'Computer Applications', 'Electronics', 'Project Work', 'Applied Physics', 'Advanced Chemistry', 'Statistics', 'English Communication', 'Research Methodology', 'Dissertation', 'Literature Seminar'].includes(subjectName);
      const subject: Subject = {
        id: `${department.id}-sub-${semester}-${index + 1}`,
        name: subjectName,
        code,
        departmentId: department.id,
        semester,
        facultyId,
        syllabusCompletion: 68 + ((semester + index) % 25),
        unitsTotal: 5,
        unitsCompleted: 3 + (index % 3),
        classes: ['A'],
        type: isPractical ? 'laboratory' : 'theory',
        credits: isPractical ? 2 : 4,
        weeklyHrs: isPractical ? 2 : 4,
        suggestedResources: isPractical ? ['computer'] : ['classroom'],
      };

      subjects.push(subject);
      subjectLookup.set(`${department.id}-${semester}-${subjectName}`, subject);

      const resourceName = isPractical
        ? department.id === 'd1'
          ? index % 2 === 0
            ? 'Computer Lab 1'
            : 'Computer Lab 2'
          : department.id === 'd3' && subjectName.includes('Physics')
            ? 'Physics Lab'
            : department.id === 'd3' && subjectName.includes('Chem')
              ? 'Chemistry Lab'
              : 'Statistics Lab'
        : roomList[(semester + index) % roomList.length];

      subjectAllocations.push({
        id: `alloc-${department.id}-${semester}-${index + 1}`,
        subjectId: subject.id,
        departmentId: department.id,
        semester,
        academicYear: ACADEMIC_YEAR,
        classIds: ['A'],
        facultyId,
        resourceIds: [roomResourceMap[resourceName]],
        requiredTypes: isPractical ? ['computer'] : ['classroom'],
        status: 'allocated',
        weeklyHours: isPractical ? 2 : 4,
        createdBy: department.hodId,
        createdAt: '2026-08-01',
        updatedAt: '2026-08-01',
      });
    });
  }
}

const facultyUsage = new Map<string, string>();
const roomUsage = new Map<string, string>();

function resolveFaculty(deptId: string, slotKey: string, fallbackId: string): string {
  const current = facultyUsage.get(slotKey);
  if (!current) {
    facultyUsage.set(slotKey, fallbackId);
    return fallbackId;
  }
  const facultyPool = departmentFaculty[deptId] ?? [fallbackId];
  for (const candidate of facultyPool) {
    if (candidate !== current) {
      facultyUsage.set(slotKey, candidate);
      return candidate;
    }
  }
  return fallbackId;
}

function resolveRoom(slotKey: string, isLab: boolean, preferred: string): string {
  const current = roomUsage.get(slotKey);
  if (!current) {
    roomUsage.set(slotKey, preferred);
    return preferred;
  }
  const pool = isLab ? labList : roomList;
  const next = pool.find((name) => name !== current && name !== preferred) ?? preferred;
  roomUsage.set(slotKey, next);
  return next;
}

const timetable: TimetableEntry[] = [];

const departmentTemplate: Record<string, Array<[string | number, string | number]>> = {
  d1: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
  d2: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
  d3: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
  d4: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
};

for (const department of departments) {
  const facultyIds = departmentFaculty[department.id] ?? [department.hodId];

  for (let semester = 1; semester <= 6; semester += 1) {
    const classSubjects = subjectCatalog[department.id][semester] ?? [];
    const subjectNames = classSubjects;
    const practicalIndex = 0;

    DAYS.forEach((day, dayIndex) => {
      const periodSubjects = [...subjectNames];
      if (day === 'Wednesday') {
        periodSubjects[2] = subjectNames[practicalIndex];
        periodSubjects[3] = subjectNames[practicalIndex];
      }
      if (day === 'Thursday') {
        periodSubjects[4] = subjectNames[1];
        periodSubjects[5] = 'Mentoring';
      }
      if (day === 'Friday') {
        periodSubjects[5] = 'Library';
      }
      if (day === 'Monday') {
        periodSubjects[5] = 'Seminar';
      }
      if (day === 'Tuesday') {
        periodSubjects[5] = 'Project';
      }

      const daySlots = day === 'Saturday' ? SLOT_DETAILS.slice(0, 3) : SLOT_DETAILS;

      daySlots.forEach((slot, slotIndex) => {
        const rawSubjectName = periodSubjects[slotIndex] ?? subjectNames[(slotIndex + dayIndex) % subjectNames.length];
        const isLab = ['Programming in C', 'Python Programming', 'Data Structures', 'Database Management Systems', 'Java Programming', 'Web Development', 'Python Application Development', 'Major Project', 'Mobile Application Development', 'Business Statistics', 'E-Commerce', 'Business Analytics', 'Project Work', 'GST', 'Management Accounting', 'Programming', 'Data Analysis', 'Computer Applications', 'Electronics', 'Applied Physics', 'Advanced Chemistry', 'Statistics', 'English Communication', 'Research Methodology', 'Dissertation', 'Literature Seminar'].includes(String(rawSubjectName));
        const subjectName = typeof rawSubjectName === 'string' ? rawSubjectName : subjectNames[0];
        const matchedSubject = subjects.find((subject) => subject.departmentId === department.id && subject.semester === semester && subject.name === subjectName) ?? subjects.find((subject) => subject.departmentId === department.id && subject.semester === semester)!
        const resolvedFaculty = resolveFaculty(department.id, `${day}|${slot.start}`, matchedSubject.facultyId || facultyIds[0]);
        const preferredRoom = isLab
          ? department.id === 'd1'
            ? slotIndex % 2 === 0
              ? 'Computer Lab 1'
              : 'Computer Lab 2'
            : department.id === 'd3' && subjectName.includes('Physics')
              ? 'Physics Lab'
              : department.id === 'd3' && subjectName.includes('Chem')
                ? 'Chemistry Lab'
                : 'Statistics Lab'
          : roomList[(dayIndex + slotIndex + semester) % roomList.length];
        const finalRoom = resolveRoom(`${day}|${slot.start}`, isLab, preferredRoom);

        timetable.push({
          id: `tt-${department.id}-s${semester}-${day}-${slot.number}`,
          departmentId: department.id,
          section: 'A',
          semester,
          day,
          slot: `${slot.start}-${slot.end}`,
          subject: subjectName,
          facultyId: resolvedFaculty,
          room: finalRoom,
          isLab,
          published: true,
          status: 'approved',
        });
      });
    });
  }
}

const exams: ExamSchedule[] = subjects.map((subject, index) => ({
  id: `ex${index + 1}`,
  departmentId: subject.departmentId,
  examName: 'End Semester Examination',
  semester: subject.semester,
  date: `2026-11-${String((index % 18) + 2).padStart(2, '0')}`,
  timing: '10:00 AM - 01:00 PM',
  duration: '3 hours',
  subject: subject.name,
  hall: subject.departmentId === 'd1' ? 'Room 101' : subject.departmentId === 'd2' ? 'Room 104' : subject.departmentId === 'd3' ? 'Room 107' : 'Room 105',
  invigilatorId: subject.facultyId,
  invigilatorIds: [subject.facultyId],
  status: 'published',
  academicYear: ACADEMIC_YEAR,
  examType: 'End Semester',
  facultyId: subject.facultyId,
  marksEntered: students.filter((student) => student.departmentId === subject.departmentId).length,
  marksSubmitted: true,
}));

const mentorAllocations: MentorAllocation[] = students.map((student, index) => ({
  id: `ma${index + 1}`,
  studentId: student.id,
  mentorId: departmentFaculty[student.departmentId][index % departmentFaculty[student.departmentId].length],
  previousMentorId: null,
  departmentId: student.departmentId,
  semester: student.semester,
  section: student.section,
  academicYear: ACADEMIC_YEAR,
  allocatedBy: departments.find((d) => d.id === student.departmentId)!.hodId,
  date: '2026-08-12',
  status: 'active',
}));

const candidates: Candidate[] = [
  { id: 'cand1', name: 'Dr. Ananya Rao', qualification: 'Ph.D. in Computer Science', experience: '6 years', appliedFor: 'Assistant Professor — Computer Applications', departmentId: 'd1', status: 'interviewed', documents: [{ id: 'cand1-doc', name: 'CV and Research Profile', type: 'PDF', size: '1.2 MB' }], interviewScore: 88, interviewNotes: 'Strong teaching record and relevant applied research.' },
  { id: 'cand2', name: 'Vivek Menon', qualification: 'M.Tech. in Software Engineering', experience: '4 years', appliedFor: 'Assistant Professor — Computer Applications', departmentId: 'd1', status: 'interviewed', documents: [{ id: 'cand2-doc', name: 'Resume', type: 'PDF', size: '860 KB' }], interviewScore: 82, interviewNotes: 'Good industry exposure and practical curriculum experience.' },
  { id: 'cand3', name: 'Meera Kulkarni', qualification: 'M.Com. and NET', experience: '5 years', appliedFor: 'Assistant Professor — Commerce', departmentId: 'd2', status: 'interviewed', documents: [{ id: 'cand3-doc', name: 'Academic Portfolio', type: 'PDF', size: '980 KB' }], interviewScore: 85, interviewNotes: 'Relevant commerce teaching and assessment experience.' },
];

const approvals: ApprovalRequest[] = [{
  id: 'rec1',
  type: 'recruitment',
  title: 'Recruitment Request — Assistant Professor',
  submittedBy: 'Varshitha',
  submittedByRole: 'dean',
  departmentId: 'd1',
  date: '2026-09-05',
  purpose: 'Fill the vacant Assistant Professor position for Computer Applications.',
  status: 'pending',
  deanStatus: 'pending',
  shortlistedCandidateIds: [],
  details: {
    subject: 'Computer Applications',
    designation: 'Assistant Professor',
    qualification: 'Ph.D. / M.Tech. in Computer Science',
    requirements: 'Teaching, curriculum development, and student mentoring.',
    justification: 'Department workload has increased for the current academic year.',
  },
  documents: [],
}];

export const sampleData: AppData = {
  departments,
  staff,
  students,
  subjects,
  timetable,
  approvals,
  labs,
  grievances: [],
  committees: [],
  publications: [],
  researchProjects: [],
  exams,
  notifications: [],
  scholars: [],
  candidates,
  messages: [],
  policies: [],
  examAttendance: [],
  liaison: [],
  rooms,
  complaints: [],
  nonTeachingTasks: [],
  resources,
  resourceAllocations: [],
  maintenanceRequests: [],
  resourceRequests: [],
  resourceHistory: [],
  subjectAllocations,
  allocationHistory: [],
  mentorAllocations,
  mentoringHistory: [],
  assignedTasks: [],
  workloadSettings: {
    dailyCapacity: 8,
    thresholds: { low: 2, moderate: 4, high: 6 },
    mentoringRule: { enabled: true, scheduleDay: 'Monday', studentsPerBatch: 20, hoursPerBatch: 1 },
  },
};
