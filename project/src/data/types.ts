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

export type SubjectType = 'theory' | 'laboratory' | 'seminar' | 'special';

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
  /* Subject Allocation enrichment */
  type: SubjectType;
  credits: number;
  weeklyHrs: number;
  suggestedResources?: ResourceCategory[];
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
  type: 'timetable' | 'leave' | 'event' | 'budget' | 'purchase' | 'recruitment' | 'promotion' | 'syllabus' | 'result';
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
  hodStatus?: 'pending' | 'recommended' | 'rejected';
  hodRemarks?: string;
  shortlistedCandidateIds?: string[];
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
  invigilatorIds?: string[];
  status?: 'draft' | 'pending-dean' | 'pending-principal' | 'rejected' | 'published';
  rejectionRemarks?: string;
  notes?: string;
  academicYear?: string;
  examType?: string;
  facultyId?: string;
  marksSubmissionDeadline?: string;
  marksEntered?: number;
  marksSubmitted?: boolean;
  attendanceSubmittedBy?: string;
  attendanceSubmittedOn?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  audience: Role[];
  targetUserIds?: string[];
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

/* ========== RESOURCE MANAGEMENT ========== */
export type ResourceCategory =
  | 'classroom'
  | 'computer'
  | 'projector'
  | 'smart-board'
  | 'furniture'
  | 'teaching-equipment'
  | 'book'
  | 'other-equipment';

export type ResourceStatus =
  | 'available'
  | 'in-use'
  | 'under-maintenance'
  | 'damaged'
  | 'retired';

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  departmentId: string;
  location: string;
  status: ResourceStatus;
  isLab: boolean;
  capacity?: number;
  equipment?: { name: string; qty: number; status: 'available' | 'under-repair' }[];
}

export interface ResourceAllocation {
  id: string;
  resourceId: string;
  allocatedTo: string;   /* staffId */
  date: string;          /* YYYY-MM-DD */
  fromTime: string;      /* "09:00" */
  toTime: string;        /* "11:00" */
}

export interface MaintenanceRequest {
  id: string;
  resourceId: string;
  requestedBy: string;   /* HOD staffId */
  assignedTo: string;    /* lab-assistant staffId */
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;      /* 0-100 */
  date: string;
}

export interface ResourceRequest {
  id: string;
  resourceName: string;
  category: ResourceCategory;
  departmentId: string;
  requestedBy: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string;
}

export interface ResourceHistory {
  id: string;
  resourceId: string;
  action: 'allocated' | 'returned' | 'maintenance' | 'maintenance-completed' | 'damaged' | 'retired';
  date: string;
  staffId?: string;
  details: string;
}

/* ========== SUBJECT ALLOCATION (central academic allocation layer) ========== */
export type AllocationStatus = 'pending' | 'partially-allocated' | 'allocated' | 'conflict' | 'draft';

/**
 * One subject allocation = Subject + Faculty + Class/Sections + Required Resources.
 * This is the source of truth used by Timetable, Faculty Dashboard and Resource
 * Management. Timetable adds day/time on top of this allocation (never repeats it).
 */
export interface SubjectAllocation {
  id: string;
  subjectId: string;
  departmentId: string;
  semester: number;
  academicYear: string;
  classIds: string[];            /* section letters, e.g. ['A','B'] → 3A, 3B */
  facultyId: string | null;      /* assigned faculty (null until chosen) */
  resourceIds: string[];         /* preferred / assigned resources */
  requiredTypes: ResourceCategory[]; /* resource categories required for this subject */
  status: AllocationStatus;
  weeklyHours: number;
  createdBy: string;             /* staffId of the HOD */
  createdAt: string;
  updatedAt: string;
}

export type AllocationChangeType =
  | 'created'
  | 'draft-saved'
  | 'confirmed'
  | 'faculty-changed'
  | 'resource-changed'
  | 'class-added'
  | 'class-removed'
  | 'resource-added'
  | 'resource-removed'
  | 'status-changed';

export interface AllocationHistory {
  id: string;
  allocationId: string;
  subjectId: string;
  date: string;
  changeType: AllocationChangeType;
  previous: string;
  current: string;
  changedBy: string;
  reason?: string;
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
  resources: Resource[];
  resourceAllocations: ResourceAllocation[];
  maintenanceRequests: MaintenanceRequest[];
  resourceRequests: ResourceRequest[];
  resourceHistory: ResourceHistory[];
  subjectAllocations: SubjectAllocation[];
  allocationHistory: AllocationHistory[];
}
