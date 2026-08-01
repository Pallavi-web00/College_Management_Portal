import type { Role } from '../data/types';

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface MenuGroup {
  group: string;
  items: MenuItem[];
}

import {
  BookOpen, Users, GraduationCap, CheckSquare, DollarSign, Users2, Link2,
  Layers, ClipboardCheck, Award, FileText, FlaskConical, BarChart3,
  Building2, Wrench, Calendar, ClipboardList, FileCheck, TrendingUp, UserCheck,
  CalendarDays, Monitor, SquarePen, UserSquare2, TestTube2, FlaskConical as Flask,
  Send, FolderOpen, Cpu, Beaker, Clock, ListChecks, Mail, ShieldCheck, ScrollText,
} from 'lucide-react';

export const menus: Record<Role, MenuGroup[]> = {
  principal: [
    { group: 'Academic Management', items: [
      { id: 'p-curriculum', label: 'Curriculum Overview', icon: BookOpen },
      { id: 'p-subject-alloc', label: 'Subject Allocation', icon: Layers },
      { id: 'p-calendar', label: 'Academic Calendar', icon: CalendarDays },
      { id: 'p-tt-approval', label: 'Timetable Approval', icon: Clock },
    ]},
    { group: 'Faculty Management', items: [
      { id: 'p-teaching', label: 'Teaching Staff', icon: Users },
      { id: 'p-nonteaching', label: 'Non-Teaching Staff', icon: Wrench },
      { id: 'p-performance', label: 'Faculty Performance', icon: Award },
      { id: 'p-workload', label: 'Workload', icon: BarChart3 },
      { id: 'p-daily-ops', label: 'Daily Operations', icon: ClipboardList },
    ]},
    { group: 'Student Management', items: [
      { id: 'p-students', label: 'Student Directory', icon: GraduationCap },
      { id: 'p-attendance', label: 'Attendance Report', icon: ClipboardCheck },
      { id: 'p-academic', label: 'Academic Performance', icon: TrendingUp },
      { id: 'p-discipline', label: 'Discipline Cases', icon: ShieldCheck },
    ]},
    { group: 'Approvals', items: [
      { id: 'p-approvals', label: 'Pending Approvals', icon: CheckSquare },
    ]},
    { group: 'Committees', items: [
      { id: 'p-council', label: 'College Council', icon: Users2 },
      { id: 'p-admission', label: 'Admission Committee', icon: UserCheck },
      { id: 'p-grievance-c', label: 'Grievance Committee', icon: ScrollText },
      { id: 'p-iqac', label: 'IQAC', icon: FileCheck },
    ]},
    { group: 'Liaison', items: [
      { id: 'p-university', label: 'University Communication', icon: Mail },
      { id: 'p-govt', label: 'Government Compliance', icon: ShieldCheck },
      { id: 'p-naac', label: 'Accreditation (NAAC/NBA)', icon: Award },
      { id: 'p-parent', label: 'Parent Communication', icon: Users2 },
    ]},
  ],
  dean: [
    { group: 'Curriculum Oversight', items: [
      { id: 'd-syllabus', label: 'Syllabus Progress', icon: BarChart3 },
      { id: 'd-subject-track', label: 'Subject-wise Tracking', icon: BookOpen },
      { id: 'd-faculty-progress', label: 'Faculty Teaching Progress', icon: TrendingUp },
      { id: 'd-delay', label: 'Delay & Comparison', icon: AlertTriangle },
      { id: 'd-calendar', label: 'Calendar Compliance', icon: CalendarDays },
      { id: 'd-remarks', label: 'Remarks & Reports', icon: FileText },
    ]},
    { group: 'Faculty Recruitment', items: [
      { id: 'd-recruit', label: 'Recruitment Requests', icon: UserCheck },
      { id: 'd-vacancy', label: 'Vacancy & Workload', icon: BarChart3 },
      { id: 'd-candidate', label: 'Candidate Review', icon: Users },
      { id: 'd-rec-status', label: 'Recommendation & Status', icon: ClipboardList },
      { id: 'd-rec-reports', label: 'Recruitment Reports', icon: FileText },
    ]},
    { group: 'Quality Assurance', items: [
      { id: 'd-teaching-q', label: 'Teaching Quality', icon: Award },
      { id: 'd-feedback', label: 'Student Feedback', icon: ClipboardCheck },
      { id: 'd-results', label: 'Result Analysis', icon: BarChart3 },
      { id: 'd-accred', label: 'Accreditation Readiness', icon: FileCheck },
    ]},
    { group: 'Promotion Recommendations', items: [
      { id: 'd-promo', label: 'Promotion Requests', icon: TrendingUp },
      { id: 'd-promo-perf', label: 'Performance Review', icon: Award },
      { id: 'd-eligibility', label: 'Eligibility Verification', icon: CheckSquare },
      { id: 'd-recommend', label: 'Recommendation', icon: Send },
    ]},
    { group: 'Research Management', items: [
      { id: 'd-publications', label: 'Publications', icon: FileText },
      { id: 'd-projects', label: 'Funded Research Projects', icon: FlaskConical },
    ]},
    { group: 'Reports', items: [
      { id: 'd-dept-reports', label: 'Department Reports', icon: BarChart3 },
      { id: 'd-hod-mgmt', label: 'HOD Management', icon: Users2 },
    ]},
    { group: 'Messages', items: [
      { id: 'd-inbox', label: 'Inbox', icon: Mail },
    ]},
  ],
  hod: [
    { group: 'Department Management', items: [
      { id: 'h-dept-info', label: 'Department Information', icon: Building2 },
      { id: 'h-faculty-list', label: 'Faculty List', icon: Users },
      { id: 'h-labs', label: 'Laboratory Management', icon: Beaker },
    ]},
    { group: 'Faculty Management', items: [
      { id: 'h-faculty-mgmt', label: 'Faculty Directory', icon: Users },
      { id: 'h-subject-alloc', label: 'Subject Allocation', icon: Layers },
      { id: 'h-workload', label: 'Teaching Workload', icon: BarChart3 },
      { id: 'h-mentoring', label: 'Mentoring Management', icon: UserSquare2 },
      { id: 'h-perf', label: 'Faculty Performance', icon: Award },
    ]},
    { group: 'Student Management', items: [
      { id: 'h-students', label: 'Student List', icon: GraduationCap },
      { id: 'h-attendance', label: 'Attendance Monitoring', icon: ClipboardCheck },
      { id: 'h-academic', label: 'Academic Performance', icon: TrendingUp },
      { id: 'h-project', label: 'Project / Assignment', icon: FileText },
      { id: 'h-grievance', label: 'Student Grievances', icon: ScrollText },
    ]},
    { group: 'Timetable Management', items: [
      { id: 'h-tt-create', label: 'Create Timetable', icon: Calendar },
      { id: 'h-tt-lab', label: 'Laboratory Scheduling', icon: Beaker },
      { id: 'h-tt-conflict', label: 'Conflict Detection', icon: AlertTriangle },
      { id: 'h-tt-publish', label: 'Publish Timetable', icon: Send },
    ]},
    { group: 'Examination Management', items: [
      { id: 'h-exam-sched', label: 'Examination Schedule', icon: CalendarDays },
      { id: 'h-internal', label: 'Internal Assessment', icon: ClipboardCheck },
      { id: 'h-invig', label: 'Invigilator Allocation', icon: UserCheck },
      { id: 'h-marks', label: 'Marks Entry Monitoring', icon: FileCheck },
      { id: 'h-exam-att', label: 'Exam Attendance', icon: ClipboardList },
    ]},
    { group: 'Syllabus Tracking', items: [
      { id: 'h-syllabus', label: 'Syllabus Overview', icon: BookOpen },
      { id: 'h-fac-progress', label: 'Faculty-wise Progress', icon: TrendingUp },
      { id: 'h-unit', label: 'Unit / Topic Tracking', icon: ListChecks },
      { id: 'h-delayed', label: 'Delayed Subjects', icon: AlertTriangle },
      { id: 'h-extra', label: 'Extra / Remedial Classes', icon: Clock },
    ]},
    { group: 'Result Analysis', items: [
      { id: 'h-sub-result', label: 'Subject-wise Analysis', icon: BarChart3 },
      { id: 'h-student-perf', label: 'Student Performance', icon: TrendingUp },
      { id: 'h-top', label: 'Top Performers', icon: Award },
      { id: 'h-failure', label: 'Failure & Backlog', icon: AlertTriangle },
    ]},
    { group: 'Messages', items: [
      { id: 'h-inbox', label: 'Inbox', icon: Mail },
    ]},
  ],
  professor: [
    { group: 'Professor Dashboard', items: [
      { id: 'pf-teaching', label: 'Advanced Teaching', icon: BookOpen },
      { id: 'pf-phd', label: 'PhD Guidance', icon: GraduationCap },
      { id: 'pf-research', label: 'Research Leadership', icon: FlaskConical },
      { id: 'pf-policy', label: 'Policy Input', icon: ScrollText },
    ]},
    { group: 'Common Modules', items: [
      { id: 'pf-timetable', label: 'My Timetable', icon: Calendar },
      { id: 'pf-class', label: 'My Class', icon: Users },
      { id: 'pf-complaint', label: 'Register Complaint', icon: ShieldCheck },
      { id: 'pf-inbox', label: 'Inbox', icon: Mail },
    ]},
  ],
  'associate-professor': [
    { group: 'Associate Professor', items: [
      { id: 'ap-teaching', label: 'Teaching', icon: BookOpen },
      { id: 'ap-research', label: 'Research Supervision', icon: FlaskConical },
      { id: 'ap-committee', label: 'Committee Work', icon: Users2 },
    ]},
    { group: 'Common Modules', items: [
      { id: 'ap-timetable', label: 'My Timetable', icon: Calendar },
      { id: 'ap-class', label: 'My Class', icon: Users },
      { id: 'ap-complaint', label: 'Register Complaint', icon: ShieldCheck },
      { id: 'ap-inbox', label: 'Inbox', icon: Mail },
    ]},
  ],
  'assistant-professor': [
    { group: 'Assistant Professor', items: [
      { id: 'as-teaching', label: 'Core Teaching Load', icon: BookOpen },
      { id: 'as-mentoring', label: 'Mentoring', icon: UserSquare2 },
      { id: 'as-research', label: 'Research', icon: FlaskConical },
    ]},
    { group: 'Common Modules', items: [
      { id: 'as-timetable', label: 'My Timetable', icon: Calendar },
      { id: 'as-class', label: 'My Class', icon: Users },
      { id: 'as-complaint', label: 'Register Complaint', icon: ShieldCheck },
      { id: 'as-inbox', label: 'Inbox', icon: Mail },
    ]},
  ],
  lecturer: [
    { group: 'Lecturer / Instructor', items: [
      { id: 'lc-teaching', label: 'Undergraduate Teaching', icon: BookOpen },
      { id: 'lc-lab', label: 'Lab Supervision', icon: Beaker },
    ]},
    { group: 'Common Modules', items: [
      { id: 'lc-timetable', label: 'My Timetable', icon: Calendar },
      { id: 'lc-class', label: 'My Class', icon: Users },
      { id: 'lc-complaint', label: 'Register Complaint', icon: ShieldCheck },
      { id: 'lc-inbox', label: 'Inbox', icon: Mail },
    ]},
  ],
  'teaching-assistant': [
    { group: 'Teaching Assistant', items: [
      { id: 'ta-lab', label: 'Lab', icon: Beaker },
      { id: 'ta-tutorial', label: 'Tutorials', icon: BookOpen },
      { id: 'ta-grading', label: 'Grading', icon: FileCheck },
      { id: 'ta-research', label: 'Research Support', icon: FlaskConical },
    ]},
    { group: 'Common Modules', items: [
      { id: 'ta-timetable', label: 'My Timetable', icon: Calendar },
      { id: 'ta-class', label: 'My Class', icon: Users },
      { id: 'ta-complaint', label: 'Register Complaint', icon: ShieldCheck },
      { id: 'ta-inbox', label: 'Inbox', icon: Mail },
    ]},
  ],
  'office-superintendent': [
    { group: 'Office Superintendent', items: [
      { id: 'os-directory', label: 'Staff Directory', icon: Users },
      { id: 'os-letters', label: 'Receive Official Letters', icon: Mail },
      { id: 'os-send', label: 'Send Communications', icon: Send },
      { id: 'os-inbox', label: 'Inbox', icon: Mail },
      { id: 'os-complaint', label: 'Register Complaint', icon: ShieldCheck },
      { id: 'os-docs', label: 'Upload Official Documents', icon: FileText },
      { id: 'os-files', label: 'Department Files', icon: FolderOpen },
    ]},
  ],
  'lab-assistant': [
    { group: 'Lab Assistant / Technician', items: [
      { id: 'la-equipment', label: 'Laboratory Equipment', icon: Cpu },
      { id: 'la-session', label: 'Session Assistance', icon: Beaker },
      { id: 'la-complaint', label: 'Register Complaint', icon: ShieldCheck },
    ]},
  ],
};

import { AlertTriangle } from 'lucide-react';
