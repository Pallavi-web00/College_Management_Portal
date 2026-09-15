import { useStore, deptName, deptCode, staffName } from '../../store/StoreContext';
import { PageHeader } from '../../components/PageHeader';
import { StatCard } from '../../components/StatCard';
import { DataTable, StatusBadge } from '../../components/DataTable';
import { StudentsDirectory, StaffDirectory, GrievancesPanel, SyllabusProgressView, Placeholder, LeaveManagementView } from '../../components/SharedViews';
import { ResourceManagement } from '../../components/ResourceViews';
import { TimetableWorkspace } from './TimetableWorkspace';
import { SubjectAllocationWorkspace } from './SubjectAllocationWorkspace';
import { AssessmentMarksWorkspace, ExaminationManagementWorkspace } from '../exam/ExamWorkflow';
import { Building2, Users, Beaker, GraduationCap, ClipboardCheck, TrendingUp, FileText, Calendar, Award, AlertTriangle, Clock, CheckSquare, Send, Plus, XCircle, ArrowLeft, RotateCcw, ListChecks } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Student, Staff, TimetableEntry, Candidate, ApprovalRequest } from '../../data/types';
import { StudentDetailModal } from '../../components/DetailModals';
import { FacultyPerformanceModal } from './FacultyPerformanceModal';

const TEACHING_ROLES = ['professor', 'associate-professor', 'assistant-professor', 'lecturer', 'teaching-assistant'];
const LUNCH_SLOTS = ['13:00-14:00'];
const MAX_WEEKLY_HOURS = 44;
const MAX_CONTINUOUS = 4;

export function HodDashboard({ activeMenu, onNavigate }: { activeMenu: string; onNavigate?: (id: string) => void }) {
  const { currentUser } = useStore();
  const deptId = currentUser?.departmentId ?? '';

switch (activeMenu) {
    case 'h-apply-leave': return <LeaveManagementView />;
    case 'h-dept-mgmt': return <DepartmentManagement deptId={deptId} />;
    case 'h-faculty-mgmt': return <FacultyManagement deptId={deptId} onNavigate={onNavigate} />;
    case 'h-student-mgmt': return <StudentManagement deptId={deptId} />;
    case 'h-tt-create':
    case 'h-tt-lab':
    case 'h-tt-conflict':
    case 'h-tt-publish':
      return <TimetableWorkspace deptId={deptId} />;
    case 'h-subject-alloc':
      return <SubjectAllocationWorkspace deptId={deptId} />;
    case 'h-recruit': return <RecruitmentShortlist deptId={deptId} />;
    case 'h-examination-management': return <ExaminationManagementWorkspace deptId={deptId} />;
    case 'h-assessment-marks': return <AssessmentMarksWorkspace deptId={deptId} />;
    case 'h-syllabus': return <SyllabusTracking deptId={deptId} />;
    case 'h-extra': return <ExtraClasses deptId={deptId} />;
    case 'h-results': return <ResultAnalysis deptId={deptId} />;
    default: return <HodHome deptId={deptId} />;
  }
}

function HodHome({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const dept = data.departments.find((d) => d.id === deptId);
  const faculty = data.staff.filter((s) => s.departmentId === deptId && TEACHING_ROLES.includes(s.role));
  const students = data.students.filter((s) => s.departmentId === deptId);
  const subs = data.subjects.filter((s) => s.departmentId === deptId);
  const avgSyllabus = subs.length ? Math.round(subs.reduce((a, s) => a + s.syllabusCompletion, 0) / subs.length) : 0;
  return (
    <div>
      <PageHeader title={`${dept?.name} — HOD Dashboard`} description="Department oversight" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Faculty" value={faculty.length} icon={<Users className="w-5 h-5" />} accent="blue" />
        <StatCard label="Students" value={students.length} icon={<GraduationCap className="w-5 h-5" />} accent="indigo" />
        <StatCard label="Subjects" value={subs.length} icon={<FileText className="w-5 h-5" />} accent="emerald" />
        <StatCard label="Avg Syllabus" value={`${avgSyllabus}%`} icon={<TrendingUp className="w-5 h-5" />} accent={avgSyllabus < 75 ? 'amber' : 'emerald'} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Faculty Status</h3>
          <div className="space-y-2">
            {faculty.map((f) => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div><p className="text-sm font-medium text-slate-900">{f.name}</p><p className="text-xs text-slate-500">{f.designation}</p></div>
                <StatusBadge status={f.status} />
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Subject Progress</h3>
          <div className="space-y-3">
            {subs.map((s) => (
              <div key={s.id}>
                <div className="flex justify-between text-sm mb-1"><span className="font-medium text-slate-900">{s.name}</span><span className="text-slate-600">{s.syllabusCompletion}%</span></div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${s.syllabusCompletion < 70 ? 'bg-rose-500' : s.syllabusCompletion < 85 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${s.syllabusCompletion}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Department Management — main menu hosting the sub-pages as tabs */
const DEPT_TABS: TabDef[] = [
  { id: 'dept-info', label: 'Department Information' },
  { id: 'faculty-list', label: 'Faculty List' },
  { id: 'labs', label: 'Laboratory Management' },
  { id: 'resources', label: 'Resources' },
];

function DepartmentManagement({ deptId }: { deptId: string }) {
  const [tab, setTab] = useState('dept-info');
  return (
    <div>
      <Tabs tabs={DEPT_TABS} active={tab} onChange={setTab} />
      {tab === 'dept-info' && <DeptInfo deptId={deptId} />}
      {tab === 'faculty-list' && <StaffDirectory scopeDept={deptId} roles={TEACHING_ROLES} title="Department Faculty" />}
      {tab === 'labs' && <LabMgmt deptId={deptId} />}
      {tab === 'resources' && <ResourceManagement deptId={deptId} />}
    </div>
  );
}

function DeptInfo({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const dept = data.departments.find((d) => d.id === deptId);
  const hod = data.staff.find((s) => s.id === dept?.hodId);
  return (
    <div>
      <PageHeader title="Department Information" description={dept?.name} />
      <div className="card p-6 mb-6">
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div><dt className="text-xs text-slate-500 uppercase">Name</dt><dd className="text-sm text-slate-900 mt-0.5">{dept?.name}</dd></div>
          <div><dt className="text-xs text-slate-500 uppercase">Code</dt><dd className="text-sm text-slate-900 mt-0.5">{dept?.code}</dd></div>
          <div><dt className="text-xs text-slate-500 uppercase">HOD</dt><dd className="text-sm text-slate-900 mt-0.5">{hod?.name}</dd></div>
          <div><dt className="text-xs text-slate-500 uppercase">Email</dt><dd className="text-sm text-slate-900 mt-0.5">{dept?.email}</dd></div>
          <div><dt className="text-xs text-slate-500 uppercase">Contact</dt><dd className="text-sm text-slate-900 mt-0.5">{dept?.contact}</dd></div>
        </dl>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Faculty" value={dept?.facultyCount ?? 0} icon={<Users className="w-5 h-5" />} accent="blue" />
        <StatCard label="Students" value={dept?.studentCount ?? 0} icon={<GraduationCap className="w-5 h-5" />} accent="indigo" />
        <StatCard label="Labs" value={dept?.labCount ?? 0} icon={<Beaker className="w-5 h-5" />} accent="emerald" />
        <StatCard label="Classrooms" value={dept?.classroomCount ?? 0} icon={<Building2 className="w-5 h-5" />} accent="slate" />
      </div>
    </div>
  );
}

function LabMgmt({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const labs = data.labs.filter((l) => l.departmentId === deptId);
  return (
    <div>
      <PageHeader title="Laboratory Management" description="Department laboratory infrastructure" />
      <DataTable
        rows={labs}
        columns={[
          { key: 'name', header: 'Lab', render: (l) => <span className="font-medium">{l.name}</span> },
          { key: 'capacity', header: 'Capacity' },
          {
            key: 'inChargeId',
            header: 'In-Charge',
            render: (l) => {
              const incharge = data.staff.find((s) => s.id === l.inChargeId);
              if (!incharge) return <span className="text-slate-400">—</span>;
              return (
                <div className="max-w-[200px]" title={`${incharge.name} — ${incharge.designation}`}>
                  <p className="text-sm font-medium text-slate-900 truncate">{incharge.name}</p>
                  <p className="text-xs text-slate-500 truncate">{incharge.designation}</p>
                </div>
              );
            },
          },
          { key: 'subjects', header: 'Subjects', render: (l) => l.subjects.join(', ') },
          { key: 'systems', header: 'Systems' },
          { key: 'maintenanceStatus', header: 'Maintenance', render: (l) => <StatusBadge status={l.maintenanceStatus} /> },
        ]}
      />
    </div>
  );
}

function RecruitmentShortlist({ deptId }: { deptId: string }) {
  const { data, updateApproval, addNotification } = useStore();
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  const requests = data.approvals.filter(
    (a) => a.type === 'recruitment' && a.submittedByRole === 'dean' && a.departmentId === deptId && a.status === 'pending'
  );
  const candidates = data.candidates.filter((c) => c.departmentId === deptId);

  const toggleCandidate = (id: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const submitShortlist = () => {
    if (!selectedRequest) return;
    updateApproval(selectedRequest.id, { shortlistedCandidateIds: selectedCandidates });
    addNotification({
      id: `n${Date.now()}`,
      title: 'Candidate shortlist submitted',
      message: `${selectedCandidates.length} candidate${selectedCandidates.length !== 1 ? 's' : ''} shortlisted for ${selectedRequest.title} and forwarded to the Dean for recommendation.`,
      date: new Date().toISOString().slice(0, 10),
      audience: ['dean'],
      read: false,
    });
    setSelectedRequest(null);
    setSelectedCandidates([]);
  };

  return (
    <div>
      <PageHeader title="Shortlist Candidates" description="Review candidates for faculty recruitment requests" />
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-5 lg:col-span-1">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Recruitment Requests</h3>
          <div className="space-y-3">
            {requests.length === 0 && <p className="text-sm text-slate-400">No active recruitment requests from the Dean for your department.</p>}
            {requests.map((request) => (
              <button
                key={request.id}
                type="button"
                onClick={() => {
                  setSelectedRequest(request);
                  setSelectedCandidates(request.shortlistedCandidateIds ?? []);
                }}
                className={`w-full text-left p-3 rounded-xl border ${selectedRequest?.id === request.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'} hover:border-blue-400 transition`}
              >
                <p className="font-medium text-slate-900">{request.title}</p>
                <p className="text-xs text-slate-500">{request.date}</p>
                <div className="mt-2 text-xs text-slate-600">{request.shortlistedCandidateIds?.length ?? 0} shortlisted</div>
              </button>
            ))}
          </div>
        </div>
        <div className="card p-5 lg:col-span-2">
          {selectedRequest ? (
            <>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-900">{selectedRequest.title}</h3>
                <p className="text-sm text-slate-500">{selectedRequest.purpose}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="card p-3 bg-slate-50">
                  <p className="text-xs text-slate-500">Required Qualification</p>
                  <p className="text-sm text-slate-900 mt-1">{selectedRequest.details.qualification}</p>
                </div>
                <div className="card p-3 bg-slate-50">
                  <p className="text-xs text-slate-500">Justification</p>
                  <p className="text-sm text-slate-900 mt-1">{selectedRequest.details.justification}</p>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Candidates</h4>
                <div className="space-y-2">
                  {candidates.map((candidate) => (
                    <label key={candidate.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-400 transition">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => toggleCandidate(candidate.id)}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{candidate.name}</p>
                        <p className="text-xs text-slate-500">{candidate.qualification} · {candidate.experience}</p>
                      </div>
                    </label>
                  ))}
                  {candidates.length === 0 && <p className="text-sm text-slate-400">No candidates available for your department.</p>}
                </div>
              </div>
              <button className="btn-primary" onClick={submitShortlist} disabled={!selectedCandidates.length}>
                Forward shortlist to Dean
              </button>
            </>
          ) : (
            <div className="text-sm text-slate-500">Select a recruitment request to shortlist candidates and forward the selected profiles to the Dean.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Workload({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const faculty = data.staff.filter((s) => s.departmentId === deptId && TEACHING_ROLES.includes(s.role));
  return (
    <div>
      <PageHeader title="Teaching Workload" description="Subjects, weekly hours, and practical sessions per faculty" />
      <DataTable
        rows={faculty}
        columns={[
          { key: 'name', header: 'Faculty', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'designation', header: 'Designation' },
          { key: 'subjects', header: 'Subjects', render: (s) => s.subjects.length },
          { key: 'classes', header: 'Classes', render: (s) => s.classes.length },
          { key: 'weeklyHours', header: 'Weekly Hours', render: (s) => <span className={s.weeklyHours > 42 ? 'text-rose-600 font-semibold' : ''}>{s.weeklyHours}</span> },
        ]}
      />
    </div>
  );
}

function Mentoring({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const students = data.students.filter((s) => s.departmentId === deptId);
  const mentors: Record<string, string> = { st1: 'Dr. Priya Sharma', st2: 'Dr. Arjun Nair', st3: 'Mr. Karthik Rao', st4: 'Dr. Priya Sharma', st5: 'Dr. Arjun Nair', st6: 'Prof. Neha Verma', st7: 'Dr. Lakshmi Menon', st8: 'Dr. Vivek Krishnan', st9: 'Dr. Kavitha Ramesh', st10: 'Dr. Mahesh Pandey' };
  return (
    <div>
      <PageHeader title="Mentoring Management" description="Student mentoring assignments" />
      <DataTable
        rows={students}
        columns={[
          { key: 'name', header: 'Student', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'rollNo', header: 'Roll No' },
          { key: 'semester', header: 'Sem' },
          { key: 'mentor', header: 'Mentor', render: (s) => mentors[s.id] ?? 'Not assigned' },
        ]}
      />
    </div>
  );
}

/* Faculty Management — main menu hosting the sub-pages as tabs */
const FACULTY_TABS: TabDef[] = [
  { id: 'faculty-perf', label: 'Faculty Performance' },
  { id: 'subject-alloc', label: 'Subject Allocation' },
  { id: 'workload', label: 'Teaching Workload' },
  { id: 'mentoring', label: 'Mentoring Management' },
];

function FacultyManagement({ deptId, onNavigate }: { deptId: string; onNavigate?: (id: string) => void }) {
  const [tab, setTab] = useState('faculty-perf');
  return (
    <div>
      <Tabs tabs={FACULTY_TABS} active={tab} onChange={setTab} />
      {tab === 'faculty-perf' && <FacultyPerf deptId={deptId} onNavigate={onNavigate} />}
      {tab === 'subject-alloc' && <SubjectAllocationWorkspace deptId={deptId} />}
      {tab === 'workload' && <Workload deptId={deptId} />}
      {tab === 'mentoring' && <Mentoring deptId={deptId} />}
    </div>
  );
}

function FacultyPerf({ deptId, onNavigate }: { deptId: string; onNavigate?: (id: string) => void }) {
  const { data } = useStore();
  const [selected, setSelected] = useState<Staff | null>(null);
  const faculty = data.staff.filter((s) => s.departmentId === deptId && TEACHING_ROLES.includes(s.role));
  return (
    <div>
      <PageHeader title="Faculty Performance" description="Multiple performance indicators" />
      <DataTable
        rows={faculty}
        columns={[
          { key: 'name', header: 'Faculty', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'attendancePct', header: 'Attendance' },
          { key: 'feedbackScore', header: 'Feedback', render: (s) => s.feedbackScore || '—' },
          { key: 'performanceRating', header: 'Rating', render: (s) => s.performanceRating || '—' },
          { key: 'pendingWork', header: 'Pending', render: (s) => s.pendingWork },
        ]}
        onRowDoubleClick={(s) => setSelected(s)}
      />
      <FacultyPerformanceModal staff={selected} open={!!selected} onClose={() => setSelected(null)} onNavigate={onNavigate} />
    </div>
  );
}

function SubjectAlloc({ deptId, onBack }: { deptId: string; onBack?: () => void }) {
  const { data } = useStore();
  const subs = data.subjects.filter((s) => s.departmentId === deptId);
  return (
    <div>
      <PageHeader title="Subject Allocation" description="Assign faculty to subjects each semester" action={onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          title="Back"
          aria-label="Back to Faculty Performance"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )} />
      <DataTable
        rows={subs}
        columns={[
          { key: 'name', header: 'Subject', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'code', header: 'Code' },
          { key: 'semester', header: 'Sem' },
          { key: 'facultyId', header: 'Assigned Faculty', render: (s) => staffName(data, s.facultyId) },
          { key: 'classes', header: 'Classes', render: (s) => s.classes.join(', ') },
        ]}
      />
    </div>
  );
}

/* Student Management — main menu hosting the sub-pages as tabs */
const STUDENT_TABS: TabDef[] = [
  { id: 'students', label: 'Student List' },
  { id: 'academic', label: 'Academic Performance' },
  { id: 'projects', label: 'Project / Assignment' },
  { id: 'grievances', label: 'Student Grievances' },
];

function StudentManagement({ deptId }: { deptId: string }) {
  const [tab, setTab] = useState('students');
  return (
    <div>
      <Tabs tabs={STUDENT_TABS} active={tab} onChange={setTab} />
      {tab === 'students' && <StudentsWithAttendance deptId={deptId} />}
      {tab === 'academic' && <AcademicPerfView deptId={deptId} />}
      {tab === 'projects' && <ProjectProgress deptId={deptId} />}
      {tab === 'grievances' && <GrievancesPanel scopeDept={deptId} canAssign />}
    </div>
  );
}

function StudentsWithAttendance({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const students = data.students.filter((s) => s.departmentId === deptId);
  return (
    <div>
      <StudentsDirectory
        scopeDept={deptId}
        editable
        extraStats={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatCard label="Dept Average" value={`${Math.round(students.reduce((a, s) => a + s.attendancePct, 0) / students.length)}%`} icon={<TrendingUp className="w-5 h-5" />} accent="blue" />
            <StatCard label="Above 75%" value={students.filter((s) => s.attendancePct >= 75).length} icon={<CheckSquare className="w-5 h-5" />} accent="emerald" />
            <StatCard label="Below 75%" value={students.filter((s) => s.attendancePct < 75).length} icon={<AlertTriangle className="w-5 h-5" />} accent="rose" />
            <StatCard label="Below 70%" value={students.filter((s) => s.attendancePct < 70).length} icon={<AlertTriangle className="w-5 h-5" />} accent="amber" />
          </div>
        }
      />
    </div>
  );
}

function AcademicPerfView({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const [selected, setSelected] = useState<Student | null>(null);
  const students = data.students.filter((s) => s.departmentId === deptId);
  return (
    <div>
      <PageHeader title="Academic Performance" description="View-only — internal marks, GPA/CGPA, backlogs, and trends" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Avg GPA" value={students.length ? (students.reduce((a, s) => a + s.gpa, 0) / students.length).toFixed(2) : '—'} icon={<TrendingUp className="w-5 h-5" />} accent="blue" />
        <StatCard label="Avg CGPA" value={students.length ? (students.reduce((a, s) => a + s.cgpa, 0) / students.length).toFixed(2) : '—'} icon={<TrendingUp className="w-5 h-5" />} accent="indigo" />
        <StatCard label="With Backlogs" value={students.filter((s) => s.backlogs > 0).length} icon={<AlertTriangle className="w-5 h-5" />} accent="rose" />
        <StatCard label="Top GPA" value={students.length ? Math.max(...students.map((s) => s.gpa)).toFixed(1) : '—'} icon={<Award className="w-5 h-5" />} accent="emerald" />
      </div>
      <DataTable
        rows={students}
        columns={[
          { key: 'name', header: 'Student', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'rollNo', header: 'Roll No' },
          { key: 'semester', header: 'Sem' },
          { key: 'internalMarks', header: 'Internal Marks', render: (s) => s.internalMarks.map((m) => `${m.subject}: ${m.marks}/${m.max}`).join(' · ') },
          { key: 'gpa', header: 'GPA', render: (s) => s.gpa },
          { key: 'cgpa', header: 'CGPA', render: (s) => s.cgpa },
          { key: 'backlogs', header: 'Backlogs', render: (s) => <span className={s.backlogs > 0 ? 'text-rose-600 font-semibold' : ''}>{s.backlogs}</span> },
        ]}
        onRowDoubleClick={(s) => setSelected(s)}
      />
      <p className="text-xs text-slate-400 mt-3">This is a view-only module. To update student information, use the Student List menu.</p>
      <StudentDetailModal student={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function ProjectProgress({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const students = data.students.filter((s) => s.departmentId === deptId && s.projectTitle);
  return (
    <div>
      <PageHeader title="Project / Assignment Progress" description="Student project tracking with guide and review status" />
      <div className="grid lg:grid-cols-2 gap-4">
        {students.map((s) => (
          <div key={s.id} className="card p-5">
            <div className="flex justify-between mb-2">
              <div><p className="text-sm font-semibold text-slate-900">{s.name}</p><p className="text-xs text-slate-500">{s.rollNo}</p></div>
              <span className="text-sm font-semibold text-slate-900">{s.projectProgress}%</span>
            </div>
            <p className="text-sm text-slate-700 mb-1">{s.projectTitle}</p>
            <p className="text-xs text-slate-500 mb-3">Guide: {s.projectGuide}</p>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${s.projectProgress}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const SLOTS = ['09:00-10:00', '10:00-11:00', '11:30-12:30', '13:00-14:00', '14:00-15:00', '15:00-16:00'];

function TimetableEditor({ deptId }: { deptId: string }) {
  const { data, addTimetableEntry, updateTimetableEntry, addNotification } = useStore();
  const entries = data.timetable.filter((t) => t.departmentId === deptId);
  const deptSubs = data.subjects.filter((s) => s.departmentId === deptId);
  const deptFaculty = data.staff.filter((s) => s.departmentId === deptId && TEACHING_ROLES.includes(s.role));
  const deptRooms = data.rooms.filter((r) => r.departmentId === deptId);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ section: 'A', semester: 6, day: 'Monday', slot: '09:00-10:00', subject: '', facultyId: '', room: '', isLab: false });

  const addEntry = () => {
    if (!form.subject || !form.facultyId || !form.room) return;
    const entry: TimetableEntry = { id: `t${Date.now()}`, departmentId: deptId, section: form.section, semester: Number(form.semester), day: form.day, slot: form.slot, subject: form.subject, facultyId: form.facultyId, room: form.room, isLab: form.isLab, published: false, status: 'draft' };
    addTimetableEntry(entry);
    setShowForm(false);
    setForm({ section: 'A', semester: 6, day: 'Monday', slot: '09:00-10:00', subject: '', facultyId: '', room: '', isLab: false });
  };

  const submitForApproval = () => {
    entries.filter((e) => e.status === 'draft').forEach((e) => updateTimetableEntry(e.id, { status: 'pending-principal' }));
    addNotification({ id: `n${Date.now()}`, title: 'Timetable submitted for approval', message: `${deptName(data, deptId)} timetable submitted to Principal for approval`, date: new Date().toISOString().slice(0, 10), audience: ['principal'], read: false });
    addNotification({ id: `n${Date.now() + 1}`, title: 'Timetable submitted', message: `Your department timetable has been submitted to the Principal for approval. You will be notified of the decision.`, date: new Date().toISOString().slice(0, 10), audience: ['hod'], read: false });
    alert('Timetable submitted to Principal for approval. You will be notified of the decision.');
  };

  const hasDrafts = entries.some((e) => e.status === 'draft');

  return (
    <div>
      <PageHeader title="Create Timetable" description="Create and submit department timetable for Principal approval" action={
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> Add Entry</button>
          {hasDrafts && <button className="btn-primary" onClick={submitForApproval}><Send className="w-4 h-4" /> Submit for Approval</button>}
        </div>
      } />
      {showForm && (
        <div className="card p-5 mb-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">New Timetable Entry</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <select className="input" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}><option value="A">Section A</option><option value="B">Section B</option></select>
            <select className="input" value={form.semester} onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}>{[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Sem {s}</option>)}</select>
            <select className="input" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>{DAYS.map((d) => <option key={d} value={d}>{d}</option>)}</select>
            <select className="input" value={form.slot} onChange={(e) => setForm({ ...form, slot: e.target.value })}>{SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}</select>
            <select className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}><option value="">Select subject...</option>{deptSubs.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}</select>
            <select className="input" value={form.facultyId} onChange={(e) => setForm({ ...form, facultyId: e.target.value })}><option value="">Select faculty...</option>{deptFaculty.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
            <select className="input" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })}><option value="">Select room...</option>{deptRooms.map((r) => <option key={r.id} value={r.name}>{r.name} (cap {r.capacity})</option>)}</select>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isLab} onChange={(e) => setForm({ ...form, isLab: e.target.checked })} /> Lab session</label>
          </div>
          <button className="btn-primary mt-3" onClick={addEntry}>Add to Timetable</button>
        </div>
      )}
      <DataTable
        rows={entries}
        columns={[
          { key: 'day', header: 'Day' },
          { key: 'slot', header: 'Time' },
          { key: 'subject', header: 'Subject', render: (t) => <span className="font-medium">{t.subject}</span> },
          { key: 'facultyId', header: 'Faculty', render: (t) => staffName(data, t.facultyId) },
          { key: 'room', header: 'Room' },
          { key: 'section', header: 'Section', render: (t) => `${t.section} · Sem ${t.semester}` },
          { key: 'isLab', header: 'Type', render: (t) => t.isLab ? <span className="badge bg-blue-100 text-blue-700">Lab</span> : <span className="badge bg-slate-100 text-slate-600">Theory</span> },
          { key: 'status', header: 'Status', render: (t) => <StatusBadge status={t.status} /> },
        ]}
      />
    </div>
  );
}

function LabScheduling({ deptId }: { deptId: string }) {
  const { data, addTimetableEntry } = useStore();
  const labs = data.labs.filter((l) => l.departmentId === deptId);
  const deptSubs = data.subjects.filter((s) => s.departmentId === deptId);
  const labEntries = data.timetable.filter((t) => t.departmentId === deptId && t.isLab);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ section: 'A', semester: 6, day: 'Monday', slot: '09:00-10:00', subject: '', facultyId: '', lab: '' });

  const schedule = () => {
    if (!form.subject || !form.facultyId || !form.lab) return;
    addTimetableEntry({ id: `t${Date.now()}`, departmentId: deptId, section: form.section, semester: Number(form.semester), day: form.day, slot: form.slot, subject: form.subject, facultyId: form.facultyId, room: form.lab, isLab: true, published: false, status: 'draft' });
    setShowForm(false);
  };

  return (
    <div>
      <PageHeader title="Laboratory Scheduling" description="Schedule practical sessions in available laboratories without conflicts" action={<button className="btn-secondary" onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> Schedule Lab Session</button>} />
      {showForm && (
        <div className="card p-5 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <select className="input" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}><option value="A">Section A</option><option value="B">Section B</option></select>
            <select className="input" value={form.semester} onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}>{[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Sem {s}</option>)}</select>
            <select className="input" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>{DAYS.map((d) => <option key={d} value={d}>{d}</option>)}</select>
            <select className="input" value={form.slot} onChange={(e) => setForm({ ...form, slot: e.target.value })}>{SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}</select>
            <select className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}><option value="">Select subject...</option>{deptSubs.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}</select>
            <select className="input" value={form.facultyId} onChange={(e) => setForm({ ...form, facultyId: e.target.value })}><option value="">Select faculty...</option>{data.staff.filter((s) => s.departmentId === deptId && TEACHING_ROLES.includes(s.role)).map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
            <select className="input" value={form.lab} onChange={(e) => setForm({ ...form, lab: e.target.value })}><option value="">Select lab...</option>{labs.map((l) => <option key={l.id} value={l.name}>{l.name} (cap {l.capacity})</option>)}</select>
          </div>
          <button className="btn-primary mt-3" onClick={schedule}>Schedule Session</button>
        </div>
      )}
      <DataTable
        rows={labEntries}
        columns={[
          { key: 'day', header: 'Day' },
          { key: 'slot', header: 'Time' },
          { key: 'subject', header: 'Subject', render: (t) => <span className="font-medium">{t.subject}</span> },
          { key: 'facultyId', header: 'Faculty', render: (t) => staffName(data, t.facultyId) },
          { key: 'room', header: 'Lab' },
          { key: 'section', header: 'Section', render: (t) => `${t.section} · Sem ${t.semester}` },
        ]}
      />
    </div>
  );
}

interface Conflict {
  id: string;
  severity: 'error' | 'warning';
  message: string;
  entries: string[];
}

function detectConflicts(entries: TimetableEntry[], rooms: { name: string; capacity: number }[], students: { id: string; semester: number; section: string; departmentId: string }[], facultyHours: Record<string, number>, staffLookup: (id: string) => string): Conflict[] {
  const conflicts: Conflict[] = [];
  const seen = new Set<string>();

  // Group by day+slot
  const bySlot: Record<string, TimetableEntry[]> = {};
  entries.forEach((e) => { const k = `${e.day}|${e.slot}`; (bySlot[k] ??= []).push(e); });

  Object.entries(bySlot).forEach(([key, group]) => {
    // 1. Faculty double-booking
    const byFaculty: Record<string, TimetableEntry[]> = {};
    group.forEach((e) => (byFaculty[e.facultyId] ??= []).push(e));
    Object.entries(byFaculty).forEach(([fid, items]) => {
      if (items.length > 1) {
        const cid = `faculty-${fid}-${key}`;
        if (!seen.has(cid)) { seen.add(cid); conflicts.push({ id: cid, severity: 'error', message: `Faculty ${staffLookup(fid)} is assigned to ${items.length} classes on ${items[0].day} at ${items[0].slot} (one faculty cannot teach two classes at the same time)`, entries: items.map((i) => i.id) }); }
      }
    });

    // 2. Room double-booking
    const byRoom: Record<string, TimetableEntry[]> = {};
    group.forEach((e) => (byRoom[e.room] ??= []).push(e));
    Object.entries(byRoom).forEach(([room, items]) => {
      if (items.length > 1) {
        const cid = `room-${room}-${key}`;
        if (!seen.has(cid)) { seen.add(cid); conflicts.push({ id: cid, severity: 'error', message: `Room ${room} has ${items.length} classes scheduled on ${items[0].day} at ${items[0].slot} (one classroom cannot have two classes at the same time)`, entries: items.map((i) => i.id) }); }
      }
    });

    // 3. Student batch conflict (same dept+sem+section, two subjects)
    const byBatch: Record<string, TimetableEntry[]> = {};
    group.forEach((e) => { const k = `${e.departmentId}|${e.semester}|${e.section}`; (byBatch[k] ??= []).push(e); });
    Object.entries(byBatch).forEach(([batch, items]) => {
      if (items.length > 1) {
        const cid = `batch-${batch}-${key}`;
        if (!seen.has(cid)) { seen.add(cid); conflicts.push({ id: cid, severity: 'error', message: `Student batch ${batch} has ${items.length} subjects on ${items[0].day} at ${items[0].slot} (a student batch cannot attend two subjects simultaneously)`, entries: items.map((i) => i.id) }); }
      }
    });

    // 4. Lab conflict (lab room used by 2 classes)
    const labs = group.filter((e) => e.isLab);
    const byLab: Record<string, TimetableEntry[]> = {};
    labs.forEach((e) => (byLab[e.room] ??= []).push(e));
    Object.entries(byLab).forEach(([lab, items]) => {
      if (items.length > 1) {
        const cid = `lab-${lab}-${key}`;
        if (!seen.has(cid)) { seen.add(cid); conflicts.push({ id: cid, severity: 'error', message: `Laboratory ${lab} is booked by ${items.length} classes on ${items[0].day} at ${items[0].slot} (a laboratory can only be used by one class at a time)`, entries: items.map((i) => i.id) }); }
      }
    });

    // 6. Lunch break
    if (group.length > 0 && LUNCH_SLOTS.includes(group[0].slot)) {
      const cid = `lunch-${key}`;
      if (!seen.has(cid)) { seen.add(cid); conflicts.push({ id: cid, severity: 'warning', message: `Classes scheduled during official lunch break (${group[0].slot}) on ${group[0].day} (no class should be scheduled during the lunch break)`, entries: group.map((i) => i.id) }); }
    }
  });

  // 5. Faculty exceeds allowed teaching hours
  Object.entries(facultyHours).forEach(([fid, hours]) => {
    if (hours > MAX_WEEKLY_HOURS) {
      const cid = `hours-${fid}`;
      if (!seen.has(cid)) { seen.add(cid); conflicts.push({ id: cid, severity: 'warning', message: `Faculty ${staffLookup(fid)} has ${hours} weekly teaching hours (exceeds allowed maximum of ${MAX_WEEKLY_HOURS} hours)`, entries: [] }); }
    }
  });

  // 7. Too many continuous classes (faculty)
  const byFacultyDay: Record<string, TimetableEntry[]> = {};
  entries.forEach((e) => { const k = `${e.facultyId}|${e.day}`; (byFacultyDay[k] ??= []).push(e); });
  Object.entries(byFacultyDay).forEach(([key, items]) => {
    const slotIndex = items.map((i) => SLOTS.indexOf(i.slot)).sort((a, b) => a - b);
    let continuous = 1, maxCont = 1;
    for (let i = 1; i < slotIndex.length; i++) { if (slotIndex[i] === slotIndex[i-1] + 1) { continuous++; maxCont = Math.max(maxCont, continuous); } else continuous = 1; }
    if (maxCont > MAX_CONTINUOUS) {
      const cid = `cont-${key}`;
      if (!seen.has(cid)) { seen.add(cid); conflicts.push({ id: cid, severity: 'warning', message: `Faculty has ${maxCont} continuous classes on ${items[0].day} (should not exceed ${MAX_CONTINUOUS} continuous classes)`, entries: items.map((i) => i.id) }); }
    }
  });

  // 8. Room capacity vs class strength
  entries.forEach((e) => {
    const room = rooms.find((r) => r.name === e.room);
    if (room) {
      const classStrength = students.filter((s) => s.departmentId === e.departmentId && s.semester === e.semester && s.section === e.section).length;
      if (classStrength > room.capacity) {
        const cid = `cap-${e.id}`;
        if (!seen.has(cid)) { seen.add(cid); conflicts.push({ id: cid, severity: 'warning', message: `Room ${e.room} (capacity ${room.capacity}) is too small for ${classStrength} students in ${e.section} Sem ${e.semester} on ${e.day} ${e.slot} (room capacity must be >= class strength)`, entries: [e.id] }); }
      }
    }
  });

  // 9. Same subject twice for same class in same slot
  const byClassSubj: Record<string, TimetableEntry[]> = {};
  entries.forEach((e) => { const k = `${e.departmentId}|${e.semester}|${e.section}|${e.subject}|${e.day}|${e.slot}`; (byClassSubj[k] ??= []).push(e); });
  Object.entries(byClassSubj).forEach(([key, items]) => {
    if (items.length > 1) {
      const cid = `dupsubj-${key}`;
      if (!seen.has(cid)) { seen.add(cid); conflicts.push({ id: cid, severity: 'warning', message: `Subject "${items[0].subject}" is scheduled ${items.length} times for ${items[0].section} Sem ${items[0].semester} on ${items[0].day} at ${items[0].slot} (same subject should not be scheduled twice in the same slot)`, entries: items.map((i) => i.id) }); }
    }
  });

  return conflicts;
}

function ConflictDetection({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const entries = data.timetable.filter((t) => t.departmentId === deptId);
  const deptRooms = data.rooms.filter((r) => r.departmentId === deptId).map((r) => ({ name: r.name, capacity: r.capacity }));
  const deptStudents = data.students.filter((s) => s.departmentId === deptId);

  // Compute faculty weekly hours from entries
  const facultyHours: Record<string, number> = {};
  entries.forEach((e) => { facultyHours[e.facultyId] = (facultyHours[e.facultyId] ?? 0) + 1; });

  const conflicts = detectConflicts(entries, deptRooms, deptStudents, facultyHours, (id) => staffName(data, id));
  const errors = conflicts.filter((c) => c.severity === 'error');
  const warnings = conflicts.filter((c) => c.severity === 'warning');

  return (
    <div>
      <PageHeader title="Timetable Conflict Detection" description="Automatic checking of all scheduling constraints" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Entries" value={entries.length} icon={<Calendar className="w-5 h-5" />} accent="blue" />
        <StatCard label="Errors" value={errors.length} icon={<XCircle className="w-5 h-5" />} accent={errors.length > 0 ? 'rose' : 'emerald'} />
        <StatCard label="Warnings" value={warnings.length} icon={<AlertTriangle className="w-5 h-5" />} accent={warnings.length > 0 ? 'amber' : 'emerald'} />
        <StatCard label="Status" value={conflicts.length === 0 ? 'Clean' : 'Issues'} icon={<CheckSquare className="w-5 h-5" />} accent={conflicts.length === 0 ? 'emerald' : 'rose'} />
      </div>

      {conflicts.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 mx-auto flex items-center justify-center mb-4"><CheckSquare className="w-7 h-7 text-emerald-600" /></div>
          <p className="text-sm font-medium text-slate-900">No conflicts detected</p>
          <p className="text-xs text-slate-500 mt-1">All scheduling constraints are satisfied. The timetable is clean.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conflicts.map((c) => (
            <div key={c.id} className={`card p-4 border-l-4 ${c.severity === 'error' ? 'border-l-rose-500' : 'border-l-amber-500'}`}>
              <div className="flex items-start gap-3">
                {c.severity === 'error' ? <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />}
                <div>
                  <p className="text-sm font-medium text-slate-900">{c.severity === 'error' ? 'Conflict' : 'Warning'}</p>
                  <p className="text-sm text-slate-700 mt-0.5">{c.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Checked Constraints</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            'One faculty + same day + same time = not allowed',
            'One classroom cannot have two classes at the same time',
            'A student batch cannot attend two subjects simultaneously',
            'A laboratory can only be used by one class at a time',
            'A faculty should not exceed allowed teaching hours',
            'No class should be scheduled during the official lunch break',
            'A faculty or student should not have too many continuous classes',
            'Room capacity must be >= class strength',
            'Same subject should not be scheduled twice for same class in same slot',
          ].map((rule) => (
            <div key={rule} className="flex items-center gap-2 text-sm text-slate-700 p-2 rounded-lg bg-slate-50"><CheckSquare className="w-4 h-4 text-slate-400 flex-shrink-0" /> {rule}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PublishTimetable({ deptId }: { deptId: string }) {
  const { data, publishTimetable, addNotification } = useStore();
  const entries = data.timetable.filter((t) => t.departmentId === deptId);
  const approved = entries.filter((t) => t.status === 'approved' && !t.published);
  const published = entries.filter((t) => t.published);
  const pending = entries.filter((t) => t.status === 'pending-principal');
  const rejected = entries.filter((t) => t.status === 'rejected');

  const publish = (section: string, semester: number) => {
    publishTimetable(deptId, section, semester);
    const facultyIds = [...new Set(entries.filter((t) => t.section === section && t.semester === semester).map((t) => t.facultyId))];
    facultyIds.forEach((fid) => {
      addNotification({ id: `n${Date.now()}-${fid}`, title: 'Timetable published', message: `Your timetable for Sec ${section} Sem ${semester} has been published. Check My Timetable.`, date: new Date().toISOString().slice(0, 10), audience: [data.staff.find((s) => s.id === fid)?.role ?? 'professor'], read: false });
    });
    alert(`Timetable for Section ${section} Sem ${semester} published. Teaching staff will see it in My Timetable.`);
  };

  const approvedGroups = [...new Set(approved.map((t) => `${t.section}|${t.semester}`))];

  return (
    <div>
      <PageHeader title="Publish Timetable" description="Publish approved timetables to the department" />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Approved — Ready to Publish</h3>
          {approvedGroups.length === 0 ? <p className="text-sm text-slate-400">No approved timetables ready for publishing.</p> :
            <div className="space-y-3">
              {approvedGroups.map((g) => { const [sec, sem] = g.split('|'); return (
                <div key={g} className="flex items-center justify-between p-3 rounded-lg bg-emerald-50">
                  <div><p className="text-sm font-medium text-slate-900">Section {sec} · Sem {sem}</p><p className="text-xs text-slate-500">{approved.filter((t) => t.section === sec && t.semester === Number(sem)).length} entries approved</p></div>
                  <button className="btn-success" onClick={() => publish(sec, Number(sem))}><Send className="w-4 h-4" /> Publish</button>
                </div>
              ); })}
            </div>}
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Status Summary</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50"><span className="text-sm text-slate-700">Pending Principal Approval</span><StatusBadge status="pending-principal" /></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50"><span className="text-sm text-slate-700">Approved (unpublished)</span><span className="text-sm font-semibold">{approved.length}</span></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50"><span className="text-sm text-slate-700">Published</span><span className="text-sm font-semibold">{published.length}</span></div>
            {rejected.length > 0 && <div className="flex items-center justify-between p-3 rounded-lg bg-rose-50"><span className="text-sm text-slate-700">Rejected</span><span className="text-sm font-semibold text-rose-600">{rejected.length}</span></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExamSched({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const exams = data.exams.filter((e) => e.departmentId === deptId);
  return (
    <div>
      <PageHeader title="Examination Schedule" description="Department examination timetable" />
      <DataTable
        rows={exams}
        columns={[
          { key: 'examName', header: 'Exam' },
          { key: 'subject', header: 'Subject' },
          { key: 'date', header: 'Date' },
          { key: 'timing', header: 'Time' },
          { key: 'duration', header: 'Duration' },
          { key: 'hall', header: 'Hall' },
          { key: 'invigilatorId', header: 'Invigilator', render: (e) => staffName(data, e.invigilatorId) },
        ]}
      />
    </div>
  );
}

function InternalAssess({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const students = data.students.filter((s) => s.departmentId === deptId);
  return (
    <div>
      <PageHeader title="Internal Assessment Management" description="Monitor internal assessments for policy compliance" />
      <DataTable
        rows={students}
        columns={[
          { key: 'name', header: 'Student', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'rollNo', header: 'Roll No' },
          { key: 'internalMarks', header: 'Marks Summary', render: (s) => s.internalMarks.map((m) => `${m.subject}: ${m.marks}/${m.max}`).join(' · ') },
        ]}
      />
    </div>
  );
}

function Invigilator({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const exams = data.exams.filter((e) => e.departmentId === deptId);
  return (
    <div>
      <PageHeader title="Invigilator Allocation" description="Faculty invigilation duties" />
      <DataTable
        rows={exams}
        columns={[
          { key: 'examName', header: 'Exam' },
          { key: 'date', header: 'Date' },
          { key: 'timing', header: 'Time' },
          { key: 'hall', header: 'Hall' },
          { key: 'invigilatorId', header: 'Invigilator', render: (e) => staffName(data, e.invigilatorId) },
        ]}
      />
    </div>
  );
}

function MarksMonitor({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const students = data.students.filter((s) => s.departmentId === deptId);
  return (
    <div>
      <PageHeader title="Marks Entry Monitoring" description="Ensure marks are entered accurately and on time" />
      <DataTable
        rows={students}
        columns={[
          { key: 'name', header: 'Student', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'rollNo', header: 'Roll No' },
          { key: 'internalMarks', header: 'Subjects Entered', render: (s) => s.internalMarks.length },
          { key: 'status', header: 'Status', render: () => <StatusBadge status="completed" /> },
        ]}
      />
    </div>
  );
}

function ExamAttendanceView({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const exams = data.exams.filter((e) => e.departmentId === deptId);
  const deptStudents = data.students.filter((s) => s.departmentId === deptId);
  const records = data.examAttendance.filter((r) => exams.some((e) => e.id === r.examId));

  const stats = {
    present: records.filter((r) => r.status === 'present').length,
    absent: records.filter((r) => r.status === 'absent').length,
    medical: records.filter((r) => r.status === 'medical-leave').length,
    malpractice: records.filter((r) => r.status === 'malpractice').length,
  };

  return (
    <div>
      <PageHeader title="Student Examination Attendance" description="View students present, absent, medical leave, and malpractice cases" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Present" value={stats.present} icon={<CheckSquare className="w-5 h-5" />} accent="emerald" />
        <StatCard label="Absent" value={stats.absent} icon={<XCircle className="w-5 h-5" />} accent="rose" />
        <StatCard label="Medical Leave" value={stats.medical} icon={<ClipboardCheck className="w-5 h-5" />} accent="amber" />
        <StatCard label="Malpractice" value={stats.malpractice} icon={<AlertTriangle className="w-5 h-5" />} accent="rose" />
      </div>
      <DataTable
        rows={records.map((r) => {
          const exam = exams.find((e) => e.id === r.examId);
          const student = deptStudents.find((s) => s.id === r.studentId) ?? data.students.find((s) => s.id === r.studentId);
          return { id: r.id, examName: exam?.examName ?? '—', subject: exam?.subject ?? '—', date: exam?.date ?? '—', studentName: student?.name ?? '—', rollNo: student?.rollNo ?? '—', status: r.status, remarks: r.remarks };
        })}
        columns={[
          { key: 'examName', header: 'Exam' },
          { key: 'subject', header: 'Subject' },
          { key: 'date', header: 'Date' },
          { key: 'studentName', header: 'Student', render: (r) => <span className="font-medium">{r.studentName}</span> },
          { key: 'rollNo', header: 'Roll No' },
          { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          { key: 'remarks', header: 'Remarks', render: (r) => r.remarks || '—' },
        ]}
      />
    </div>
  );
}

/* Syllabus Tracking — main menu hosting the sub-pages as tabs */
const SYLLABUS_TABS: TabDef[] = [
  { id: 'overview', label: 'Syllabus Overview' },
  { id: 'fac-progress', label: 'Faculty-wise Progress' },
  { id: 'unit', label: 'Unit / Topic Tracking' },
  { id: 'delayed', label: 'Delayed Subjects' },
];

function SyllabusTracking({ deptId }: { deptId: string }) {
  const [tab, setTab] = useState('overview');
  return (
    <div>
      <Tabs tabs={SYLLABUS_TABS} active={tab} onChange={setTab} />
      {tab === 'overview' && <SyllabusProgressView scopeDept={deptId} />}
      {tab === 'fac-progress' && <FacultySyllabusProgress deptId={deptId} />}
      {tab === 'unit' && <UnitTracking deptId={deptId} />}
      {tab === 'delayed' && <DelayedSubjects deptId={deptId} />}
    </div>
  );
}

function FacultySyllabusProgress({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const faculty = data.staff.filter((s) => s.departmentId === deptId && TEACHING_ROLES.includes(s.role));
  return (
    <div>
      <PageHeader title="Faculty-wise Syllabus Progress" description="Completion by faculty member" />
      <DataTable
        rows={faculty.map((f) => {
          const subs = data.subjects.filter((s) => s.facultyId === f.id);
          const avg = subs.length ? Math.round(subs.reduce((a, s) => a + s.syllabusCompletion, 0) / subs.length) : 0;
          return { id: f.id, name: f.name, subjects: subs.length, avg, pending: subs.filter((s) => s.syllabusCompletion < 100).length };
        })}
        columns={[
          { key: 'name', header: 'Faculty', render: (f) => <span className="font-medium">{f.name}</span> },
          { key: 'subjects', header: 'Subjects' },
          { key: 'avg', header: 'Avg Completion', render: (f) => `${f.avg}%` },
          { key: 'pending', header: 'Pending Topics', render: (f) => f.pending },
        ]}
      />
    </div>
  );
}

function UnitTracking({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const subs = data.subjects.filter((s) => s.departmentId === deptId);
  return (
    <div>
      <PageHeader title="Unit / Topic Tracking" description="Unit-level completion status" />
      <DataTable
        rows={subs}
        columns={[
          { key: 'name', header: 'Subject', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'facultyId', header: 'Faculty', render: (s) => staffName(data, s.facultyId) },
          { key: 'unitsCompleted', header: 'Units Completed', render: (s) => `${s.unitsCompleted}/${s.unitsTotal}` },
          { key: 'syllabusCompletion', header: 'Completion', render: (s) => `${s.syllabusCompletion}%` },
        ]}
      />
    </div>
  );
}

function DelayedSubjects({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const delayed = data.subjects.filter((s) => s.departmentId === deptId && s.syllabusCompletion < 75);
  return (
    <div>
      <PageHeader title="Delayed Subjects" description="Subjects behind planned schedule" />
      {delayed.length === 0 ? <div className="card p-8 text-center text-sm text-slate-400">No delayed subjects.</div> :
        <DataTable
          rows={delayed}
          columns={[
            { key: 'name', header: 'Subject', render: (s) => <span className="font-medium">{s.name}</span> },
            { key: 'facultyId', header: 'Faculty', render: (s) => staffName(data, s.facultyId) },
            { key: 'syllabusCompletion', header: 'Completion', render: (s) => <span className="text-rose-600 font-semibold">{s.syllabusCompletion}%</span> },
          ]}
        />}
    </div>
  );
}

function ExtraClasses({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const delayed = data.subjects.filter((s) => s.departmentId === deptId && s.syllabusCompletion < 75);
  return (
    <div>
      <PageHeader title="Extra / Remedial Classes" description="Request extra classes for delayed subjects" action={<button className="btn-primary"><Send className="w-4 h-4" /> Request Extra Class</button>} />
      <DataTable
        rows={delayed}
        columns={[
          { key: 'name', header: 'Subject', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'facultyId', header: 'Faculty', render: (s) => staffName(data, s.facultyId) },
          { key: 'syllabusCompletion', header: 'Completion', render: (s) => <span className="text-rose-600 font-semibold">{s.syllabusCompletion}%</span> },
          { key: 'action', header: 'Action', render: () => <span className="badge bg-amber-100 text-amber-700">Eligible</span> },
        ]}
      />
    </div>
  );
}

/* Result Analysis — main menu hosting the sub-pages as tabs */
interface TabDef {
  id: string;
  label: string;
}

function Tabs({ tabs, active, onChange }: { tabs: TabDef[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="border-b border-slate-200 mb-6 flex items-center justify-between gap-3">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
              active === t.id ? 'border-blue-600 text-blue-700 font-medium' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const RESULT_TABS: TabDef[] = [
  { id: 'sub-result', label: 'Subject-wise Analysis' },
  { id: 'student-perf', label: 'Student Performance' },
  { id: 'top', label: 'Top Performers' },
  { id: 'failure', label: 'Failure & Backlog' },
];

function ResultAnalysis({ deptId }: { deptId: string }) {
  const [tab, setTab] = useState('sub-result');
  return (
    <div>
      <Tabs tabs={RESULT_TABS} active={tab} onChange={setTab} />
      {tab === 'sub-result' && <SubjectResult deptId={deptId} />}
      {tab === 'student-perf' && <StudentPerf deptId={deptId} />}
      {tab === 'top' && <TopPerformers deptId={deptId} />}
      {tab === 'failure' && <FailureAnalysis deptId={deptId} />}
    </div>
  );
}

function SubjectResult({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const subs = data.subjects.filter((s) => s.departmentId === deptId);
  return (
    <div>
      <PageHeader title="Subject-wise Result Analysis" description="Performance of each subject" />
      <DataTable
        rows={subs.map((sub) => {
          const studs = data.students.filter((s) => s.departmentId === deptId && s.subjects.includes(sub.name));
          const avg = studs.length ? (studs.reduce((a, s) => a + s.gpa, 0) / studs.length).toFixed(2) : '—';
          return { id: sub.id, name: sub.name, code: sub.code, students: studs.length, avgGpa: avg };
        })}
        columns={[
          { key: 'name', header: 'Subject', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'code', header: 'Code' },
          { key: 'students', header: 'Students' },
          { key: 'avgGpa', header: 'Avg GPA' },
        ]}
      />
    </div>
  );
}

function StudentPerf({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const [selected, setSelected] = useState<Student | null>(null);
  const students = data.students.filter((s) => s.departmentId === deptId);
  return (
    <div>
      <PageHeader title="Student Performance" description="Individual performance review" />
      <DataTable
        rows={students}
        columns={[
          { key: 'name', header: 'Student', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'rollNo', header: 'Roll No' },
          { key: 'gpa', header: 'GPA' },
          { key: 'cgpa', header: 'CGPA' },
          { key: 'backlogs', header: 'Backlogs' },
        ]}
        onRowDoubleClick={(s) => setSelected(s)}
      />
      <StudentDetailModal student={selected} open={!!selected} onClose={() => setSelected(null)} editable onSave={() => setSelected(null)} />
    </div>
  );
}

function TopPerformers({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const [selected, setSelected] = useState<Student | null>(null);
  const top = [...data.students.filter((s) => s.departmentId === deptId)].sort((a, b) => b.cgpa - a.cgpa).slice(0, 5).map((s, i) => ({ ...s, rank: i + 1 }));
  return (
    <div>
      <PageHeader title="Top Performers" description="Highest-performing students for awards/scholarships" />
      <DataTable
        rows={top}
        columns={[
          { key: 'rank', header: 'Rank', render: (s) => <span className="font-bold text-amber-600">#{s.rank}</span> },
          { key: 'name', header: 'Student', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'rollNo', header: 'Roll No' },
          { key: 'cgpa', header: 'CGPA', render: (s) => <span className="font-semibold text-emerald-600">{s.cgpa}</span> },
        ]}
        onRowDoubleClick={(s) => setSelected(s)}
      />
      <StudentDetailModal student={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function FailureAnalysis({ deptId }: { deptId: string }) {
  const { data } = useStore();
  const [selected, setSelected] = useState<Student | null>(null);
  const atRisk = data.students.filter((s) => s.departmentId === deptId && (s.backlogs > 0 || s.cgpa < 7));
  return (
    <div>
      <PageHeader title="Failure & Backlog Analysis" description="Students and subjects with poor performance" />
      <DataTable
        rows={atRisk}
        columns={[
          { key: 'name', header: 'Student', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'rollNo', header: 'Roll No' },
          { key: 'cgpa', header: 'CGPA', render: (s) => <span className="text-rose-600 font-semibold">{s.cgpa}</span> },
          { key: 'backlogs', header: 'Backlogs', render: (s) => <span className="text-rose-600 font-semibold">{s.backlogs}</span> },
        ]}
        onRowDoubleClick={(s) => setSelected(s)}
      />
      <StudentDetailModal student={selected} open={!!selected} onClose={() => setSelected(null)} editable onSave={() => setSelected(null)} />
    </div>
  );
}
