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
  Building2, Wrench, Calendar, CalendarDays, ClipboardList, FileCheck, TrendingUp, UserCheck,
  Monitor, SquarePen, UserSquare2, TestTube2, FlaskConical as Flask,
  Send, FolderOpen, Cpu, Beaker, Clock, Mail, ShieldCheck, ScrollText,
} from 'lucide-react';

export const menus: Record<Role, MenuGroup[]> = {
principal: [
    { group: 'Academic Management', items: [
      { id: 'p-curriculum', label: 'Curriculum Overview', icon: BookOpen },
      { id: 'p-tt-approval', label: 'Timetable Approval', icon: Clock },
    ]},
    { group: 'Faculty Management', items: [
      { id: 'p-performance', label: 'Faculty Performance', icon: Award },
      { id: 'p-workload', label: 'Workload', icon: BarChart3 },
      { id: 'p-daily-ops', label: 'Daily Operations', icon: ClipboardList },
    ]},
    { group: 'Student Management', items: [
      { id: 'p-students', label: 'Student Directory', icon: GraduationCap },
      { id: 'p-academic', label: 'Academic Performance', icon: TrendingUp },
      { id: 'p-discipline', label: 'Discipline Cases', icon: ShieldCheck },
    ]},
    { group: 'Approvals', items: [
      { id: 'p-approvals', label: 'Pending Approvals', icon: CheckSquare },
      { id: 'p-exam-approvals', label: 'Examination Approvals', icon: CalendarDays },
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
    { group: 'Leave', items: [
      { id: 'p-apply-leave', label: 'Apply for Leave', icon: Calendar },
    ]}
  ],
dean: [
    { group: 'Curriculum Oversight', items: [
      { id: 'd-syllabus', label: 'Syllabus Progress', icon: BarChart3 },
      { id: 'd-faculty-progress', label: 'Faculty Teaching Progress', icon: TrendingUp },
      { id: 'd-remarks', label: 'Remarks & Reports', icon: FileText },
    ]},
    { group: 'Faculty Recruitment', items: [
      { id: 'd-recruit', label: 'Send HR Request', icon: UserCheck },
      { id: 'd-shortlist', label: 'Shortlisted Candidates', icon: Users },
    ]},
    { group: 'Quality Assurance', items: [
      { id: 'd-teaching-q', label: 'Teaching Standards', icon: Award },
      { id: 'd-results', label: 'Result Analysis', icon: BarChart3 },
      { id: 'd-accred', label: 'Accreditation Readiness', icon: FileCheck },
    ]},
     { group: 'Promotion Recommendations', items: [
       { id: 'd-promo', label: 'Promotion Requests', icon: TrendingUp },
     ]},
    { group: 'Research Management', items: [
      { id: 'd-publications', label: 'Publications', icon: FileText },
      { id: 'd-projects', label: 'Funded Research Projects', icon: FlaskConical },
    ]},
    { group: 'Reports', items: [
      { id: 'd-dept-reports', label: 'Department Reports', icon: BarChart3 },
      { id: 'd-hod-mgmt', label: 'HOD Management', icon: Users2 },
    ]},
    { group: 'Approvals', items: [
      { id: 'd-exam-approvals', label: 'Examination Approvals', icon: CheckSquare },
    ]},
    { group: 'Leave', items: [
      { id: 'd-apply-leave', label: 'Apply for Leave', icon: Calendar },
    ]},
  ],
hod: [
     { group: 'Department Management', items: [
       { id: 'h-dept-mgmt', label: 'Department Management', icon: Building2 },
     ]},
     { group: 'Faculty Management', items: [
       { id: 'h-faculty-mgmt', label: 'Faculty Management', icon: Award },
     ]},
     { group: 'Student Management', items: [
       { id: 'h-student-mgmt', label: 'Student Management', icon: GraduationCap },
     ]},
    { group: 'Timetable Management', items: [
      { id: 'h-tt-create', label: 'Timetable Management', icon: Calendar },
    ]},
    { group: 'Academic Allocation', items: [
      { id: 'h-subject-alloc', label: 'Subject Allocation', icon: BookOpen },
    ]},
    { group: 'Recruitment', items: [
      { id: 'h-recruit', label: 'Shortlist Candidates', icon: Users },
    ]},
    { group: 'Examination Management', items: [
      { id: 'h-examination-management', label: 'Examination Management', icon: CalendarDays },
      { id: 'h-assessment-marks', label: 'Assessment & Marks', icon: ClipboardCheck },
    ]},
    { group: 'Syllabus Tracking', items: [
      { id: 'h-syllabus', label: 'Syllabus Tracking', icon: BookOpen },
      { id: 'h-extra', label: 'Extra / Remedial Classes', icon: Clock },
    ]},
    { group: 'Result Analysis', items: [
      { id: 'h-results', label: 'Result Analysis', icon: BarChart3 },
    ]},
    { group: 'Leave', items: [
      { id: 'h-apply-leave', label: 'Apply for Leave', icon: Calendar },
    ]}
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
       { id: 'pf-resources', label: 'My Resources', icon: Wrench },
       { id: 'pf-complaint', label: 'Register Complaint', icon: ShieldCheck },
     ]},
     { group: 'Leave', items: [
       { id: 'pf-apply-leave', label: 'Apply for Leave', icon: Calendar },
     ]}
   ],
'associate-professor': [
    { group: 'Associate Professor', items: [
      { id: 'ap-teaching', label: 'Teaching', icon: BookOpen },
      { id: 'ap-research', label: 'Research', icon: FlaskConical },
      { id: 'ap-committee', label: 'Committee Work', icon: Users2 },
    ]},
    { group: 'Common Modules', items: [
      { id: 'ap-timetable', label: 'My Timetable', icon: Calendar },
      { id: 'ap-class', label: 'My Class', icon: Users },
      { id: 'ap-resources', label: 'My Resources', icon: Wrench },
      { id: 'ap-complaint', label: 'Register Complaint', icon: ShieldCheck },
    ]},
    { group: 'Leave', items: [
      { id: 'ap-apply-leave', label: 'Apply for Leave', icon: Calendar },
    ]}
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
      { id: 'as-resources', label: 'My Resources', icon: Wrench },
      { id: 'as-complaint', label: 'Register Complaint', icon: ShieldCheck },
    ]},
    { group: 'Leave', items: [
      { id: 'as-apply-leave', label: 'Apply for Leave', icon: Calendar },
    ]}
  ],
lecturer: [
    { group: 'Lecturer / Instructor', items: [
      { id: 'lc-teaching', label: 'Undergraduate Teaching', icon: BookOpen },
      { id: 'lc-lab', label: 'Lab Supervision', icon: Beaker },
    ]},
    { group: 'Common Modules', items: [
      { id: 'lc-timetable', label: 'My Timetable', icon: Calendar },
      { id: 'lc-class', label: 'My Class', icon: Users },
      { id: 'lc-resources', label: 'My Resources', icon: Wrench },
      { id: 'lc-complaint', label: 'Register Complaint', icon: ShieldCheck },
    ]},
    { group: 'Leave', items: [
      { id: 'lc-apply-leave', label: 'Apply for Leave', icon: Calendar },
    ]}
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
      { id: 'ta-resources', label: 'My Resources', icon: Wrench },
      { id: 'ta-complaint', label: 'Register Complaint', icon: ShieldCheck },
    ]},
    { group: 'Leave', items: [
      { id: 'ta-apply-leave', label: 'Apply for Leave', icon: Calendar },
    ]},
  ],
'office-superintendent': [
    { group: 'Office Superintendent', items: [
      { id: 'os-directory', label: 'Staff Directory', icon: Users },
      { id: 'os-letters', label: 'Receive Official Letters', icon: Mail },
      { id: 'os-send', label: 'Send Communications', icon: Send },
      { id: 'os-complaint', label: 'Register Complaint', icon: ShieldCheck },
      { id: 'os-docs', label: 'Upload Official Documents', icon: FileText },
      { id: 'os-files', label: 'Department Files', icon: FolderOpen },
    ]},
    { group: 'Leave', items: [
      { id: 'os-apply-leave', label: 'Apply for Leave', icon: Calendar },
    ]}
  ],
'lab-assistant': [
     { group: 'Lab Assistant / Technician', items: [
       { id: 'la-equipment', label: 'Laboratory Equipment', icon: Cpu },
       { id: 'la-session', label: 'Session Assistance', icon: Beaker },
       { id: 'la-maintenance', label: 'Maintenance Requests', icon: ClipboardCheck },
       { id: 'la-complaint', label: 'Register Complaint', icon: ShieldCheck },
     ]},
    { group: 'Leave', items: [
      { id: 'la-apply-leave', label: 'Apply for Leave', icon: Calendar },
    ]}
  ],
};
