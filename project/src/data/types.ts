export type Role =
  | 'principal'
  | 'dean'
  | 'hod'
  | 'professor'
  | 'associate-professor'
  | 'assistant-professor'
  | 'lecturer'
  | 'teaching-assistant'
  | 'office-superintendent'
  | 'lab-assistant';

export interface Department {
  id: string;
  name: string;
  code: string;
  hodId: string;
  email: string;
  contact: string;
  facultyCount: number;
  studentCount: number;
  labCount: number;
  classroomCount: number;
}

export interface Staff {
  id: string;
  name: string;
  designation: string;
  role: Role;
  departmentId: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  status: 'active' | 'on-leave' | 'inactive';
  attendancePct: number;
  feedbackScore: number;
  performanceRating: number;
  pendingWork: number;
  weeklyHours: number;
  employmentType: 'full-time' | 'contract' | 'visiting';
  joinedOn: string;
  qualifications: string;
  publications: number;
  researchProjects: number;
  address: string;
  gender: 'Male' | 'Female';
  dob: string;
  bloodGroup: string;
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  program: string;
  semester: number;
  section: string;
  departmentId: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female';
  dob: string;
  bloodGroup: string;
  address: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  admissionDate: string;
  admissionType: 'Merit' | 'Management' | 'Lateral';
  status: 'active' | 'inactive' | 'graduated';
  attendancePct: number;
  gpa: number;
  cgpa: number;
  backlogs: number;
  internalMarks: { subject: string; marks: number; max: number }[];
  subjects: string[];
  projectTitle: string;
  projectGuide: string;
  projectProgress: number;
  grievances: { id: string; title: string; status: string; date: string; assignedTo: string }[];
  discipline: { id: string; incident: string; date: string; action: string; status: string }[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  semester: number;
  facultyId: string;
  syllabusCompletion: number;
  unitsTotal: number;
  unitsCompleted: number;
  classes: string[];
}

export interface TimetableEntry {
  id: string;
  departmentId: string;
  section: string;
  semester: number;
  day: string;
  slot: string;
  subject: string;
  facultyId: string;
  room: string;
  isLab: boolean;
  published: boolean;
  status: 'draft' | 'pending-principal' | 'approved' | 'rejected';
}

export interface ApprovalDoc {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaded: string;
}

export interface ApprovalRequest {
  id: string;
  type: 'timetable' | 'leave' | 'event' | 'budget' | 'purchase' | 'recruitment' | 'promotion';
  title: string;
  submittedBy: string;
  submittedByRole: Role;
  departmentId: string;
  date: string;
  amount?: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision' | 'dean-recommended' | 'dean-rejected';
  deanStatus?: 'pending' | 'recommended' | 'rejected';
  deanRemarks?: string;
  principalRemarks?: string;
  details: Record<string, string>;
  documents: ApprovalDoc[];
  timetableEntries?: TimetableEntry[];
}

export interface Lab {
  id: string;
  name: string;
  departmentId: string;
  capacity: number;
  inChargeId: string;
  subjects: string[];
  systems: number;
  equipment: { name: string; qty: number; status: 'available' | 'under-repair' }[];
  maintenanceStatus: 'good' | 'needs-attention' | 'under-repair';
}

export interface Grievance {
  id: string;
  title: string;
  studentId: string;
  departmentId: string;
  date: string;
  status: 'open' | 'assigned' | 'resolved' | 'closed';
  assignedTo: string;
  description: string;
  resolution: string;
  history: { date: string; action: string; by: string }[];
}

export interface Committee {
  id: string;
  name: string;
  type: 'council' | 'admission' | 'grievance' | 'iqac';
  members: string[];
  meetingDate: string;
  agenda: string;
}

export interface Publication {
  id: string;
  facultyId: string;
  title: string;
  type: 'journal' | 'conference' | 'book-chapter';
  journal: string;
  year: number;
  departmentId: string;
}

export interface ResearchProject {
  id: string;
  facultyId: string;
  title: string;
  fundingAgency: string;
  amount: number;
  status: 'ongoing' | 'completed';
  startDate: string;
  departmentId: string;
}

export interface ExamSchedule {
  id: string;
  departmentId: string;
  examName: string;
  semester: number;
  date: string;
  timing: string;
  duration: string;
  subject: string;
  hall: string;
  invigilatorId: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  audience: Role[];
  read: boolean;
}

export interface PhdScholar {
  id: string;
  name: string;
  topic: string;
  startDate: string;
  year: number;
  background: string;
  qualification: string;
  progress: number;
  milestone: string;
  status: 'active' | 'submitted' | 'awarded';
  publications: number;
  supervisor: string;
}

export interface Candidate {
  id: string;
  name: string;
  qualification: string;
  experience: string;
  appliedFor: string;
  departmentId: string;
  status: 'shortlisted' | 'interviewed' | 'selected' | 'rejected';
  documents: { id: string; name: string; type: string; size: string }[];
  interviewScore: number;
  interviewNotes: string;
}

export interface Message {
  id: string;
  fromId: string;
  fromName: string;
  fromRole: Role;
  toRole: Role;
  toName: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
}

export interface Policy {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'under-review' | 'approved' | 'rejected';
  submittedBy: string;
  date: string;
  description: string;
  recommendations: string;
}

export interface ExamAttendanceRecord {
  id: string;
  examId: string;
  studentId: string;
  status: 'present' | 'absent' | 'medical-leave' | 'malpractice';
  remarks: string;
}

export interface LiaisonItem {
  id: string;
  category: 'university' | 'government' | 'accreditation' | 'parent';
  title: string;
  from: string;
  date: string;
  type: string;
  description: string;
  status: 'pending' | 'acknowledged' | 'forwarded' | 'submitted' | 'closed';
  deadline?: string;
  assignedTo?: string;
  criteria?: { name: string; progress: number }[];
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  filedBy: string;
  filedById: string;
  filedByRole: Role;
  departmentId: string;
  date: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  category: 'student-discipline' | 'staff-incident' | 'facility' | 'academic' | 'other';
  against?: string;
  resolution?: string;
}

export interface NonTeachingTask {
  id: string;
  staffId: string;
  task: string;
  departmentId: string;
  status: 'completed' | 'in-progress' | 'pending';
  date: string;
}

export interface AppData {
  departments: Department[];
  staff: Staff[];
  students: Student[];
  subjects: Subject[];
  timetable: TimetableEntry[];
  approvals: ApprovalRequest[];
  labs: Lab[];
  grievances: Grievance[];
  committees: Committee[];
  publications: Publication[];
  researchProjects: ResearchProject[];
  exams: ExamSchedule[];
  notifications: Notification[];
  scholars: PhdScholar[];
  candidates: Candidate[];
  messages: Message[];
  policies: Policy[];
  examAttendance: ExamAttendanceRecord[];
  liaison: LiaisonItem[];
  rooms: { id: string; name: string; departmentId: string; capacity: number }[];
  complaints: Complaint[];
  nonTeachingTasks: NonTeachingTask[];
}
