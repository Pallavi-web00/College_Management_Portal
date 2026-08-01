import { useStore, deptName, deptCode, staffName, roleLabels } from '../../store/StoreContext';
import { PageHeader } from '../../components/PageHeader';
import { StatCard } from '../../components/StatCard';
import { DataTable, StatusBadge } from '../../components/DataTable';
import { SyllabusProgressView, Placeholder, InboxView } from '../../components/SharedViews';
import { BarChart3, TrendingUp, Award, FileText, FlaskConical, Users2, CheckSquare, XCircle, Send, AlertTriangle, Download, FileCheck } from 'lucide-react';
import { useState } from 'react';
import type { ApprovalRequest, Candidate } from '../../data/types';

export function DeanDashboard({ activeMenu }: { activeMenu: string }) {
  switch (activeMenu) {
    case 'd-syllabus': return <SyllabusProgressFilter />;
    case 'd-subject-track': return <SubjectTrackingFilter />;
    case 'd-faculty-progress': return <FacultyProgressFilter />;
    case 'd-delay': return <DelayComparison />;
    case 'd-calendar': return <CalendarCompliance />;
    case 'd-remarks': return <RemarksReports />;
    case 'd-recruit': return <RecruitmentRequests />;
    case 'd-vacancy': return <VacancyWorkload />;
    case 'd-candidate': return <CandidateReview />;
    case 'd-rec-status': return <RecommendationStatus />;
    case 'd-rec-reports': return <RecruitmentReports />;
    case 'd-teaching-q': return <TeachingQualityFilter />;
    case 'd-feedback': return <StudentFeedbackFilter />;
    case 'd-results': return <ResultAnalysisFilter />;
    case 'd-accred': return <AccreditationReadiness />;
    case 'd-promo': return <PromotionRequests />;
    case 'd-promo-perf': return <PromoPerfReview />;
    case 'd-eligibility': return <EligibilityVerification />;
    case 'd-recommend': return <RecommendationView />;
    case 'd-publications': return <PublicationsView />;
    case 'd-projects': return <ProjectsView />;
    case 'd-dept-reports': return <DeptReports />;
    case 'd-hod-mgmt': return <HodManagement />;
    case 'd-inbox': return <InboxView recipientRole="dean" recipientName="Dean Academics" />;
    default: return <DeanHome />;
  }
}

function DeptSelector({ value, onChange, label = 'Department' }: { value: string; onChange: (v: string) => void; label?: string }) {
  const { data } = useStore();
  return (
    <select className="input w-auto" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="all">{label}: All</option>
      {data.departments.map((d) => <option key={d.id} value={d.id}>{d.code} - {d.name}</option>)}
    </select>
  );
}

function DeanHome() {
  const { data } = useStore();
  const pendingRec = data.approvals.filter((a) => (a.type === 'recruitment' || a.type === 'promotion') && a.status === 'pending').length;
  return (
    <div>
      <PageHeader title="Dean Dashboard" description="Monitoring, review, and recommendation across departments" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Departments" value={data.departments.length} icon={<BarChart3 className="w-5 h-5" />} accent="slate" />
        <StatCard label="HODs" value={data.staff.filter((s) => s.role === 'hod').length} icon={<Users2 className="w-5 h-5" />} accent="blue" />
        <StatCard label="Pending Reviews" value={pendingRec} icon={<CheckSquare className="w-5 h-5" />} accent="amber" />
        <StatCard label="Publications" value={data.publications.length} icon={<FileText className="w-5 h-5" />} accent="indigo" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Syllabus Progress by Department</h3>
          <div className="space-y-3">
            {data.departments.map((d) => {
              const subs = data.subjects.filter((s) => s.departmentId === d.id);
              const avg = subs.length ? Math.round(subs.reduce((a, s) => a + s.syllabusCompletion, 0) / subs.length) : 0;
              return (
                <div key={d.id}>
                  <div className="flex justify-between text-sm mb-1"><span className="font-medium text-slate-900">{d.code}</span><span className="text-slate-600">{avg}%</span></div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${avg < 70 ? 'bg-rose-500' : avg < 85 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${avg}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Pending Recommendations</h3>
          <div className="space-y-2">
            {data.approvals.filter((a) => (a.type === 'recruitment' || a.type === 'promotion') && a.status === 'pending').map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div><p className="text-sm font-medium text-slate-900">{a.title}</p><p className="text-xs text-slate-500">{a.submittedBy} · {a.date}</p></div>
                <StatusBadge status={a.status} />
              </div>
            ))}
            {data.approvals.filter((a) => (a.type === 'recruitment' || a.type === 'promotion') && a.status === 'pending').length === 0 && <p className="text-sm text-slate-400">No pending reviews.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function SyllabusProgressFilter() {
  const { data } = useStore();
  const [dept, setDept] = useState('all');
  const [sem, setSem] = useState('all');
  const semesters = [...new Set(data.subjects.filter((s) => dept === 'all' || s.departmentId === dept).map((s) => s.semester))].sort((a, b) => a - b);
  let rows = data.subjects.filter((s) => (dept === 'all' || s.departmentId === dept) && (sem === 'all' || s.semester === Number(sem)));
  const avg = rows.length ? Math.round(rows.reduce((a, s) => a + s.syllabusCompletion, 0) / rows.length) : 0;
  return (
    <div>
      <PageHeader title="Syllabus Progress" description="Select class/section/year to view syllabus completion" action={
        <div className="flex gap-2">
          <DeptSelector value={dept} onChange={(v) => { setDept(v); setSem('all'); }} />
          <select className="input w-auto" value={sem} onChange={(e) => setSem(e.target.value)}>
            <option value="all">Semester: All</option>
            {semesters.map((s) => <option key={s} value={s}>Sem {s}</option>)}
          </select>
        </div>
      } />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Subjects" value={rows.length} icon={<FileText className="w-5 h-5" />} accent="blue" />
        <StatCard label="Avg Completion" value={`${avg}%`} icon={<TrendingUp className="w-5 h-5" />} accent={avg < 75 ? 'amber' : 'emerald'} />
        <StatCard label="Behind Schedule" value={rows.filter((r) => r.syllabusCompletion < 75).length} icon={<AlertTriangle className="w-5 h-5" />} accent="rose" />
        <StatCard label="On Track" value={rows.filter((r) => r.syllabusCompletion >= 75).length} icon={<CheckSquare className="w-5 h-5" />} accent="emerald" />
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: 'name', header: 'Subject', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'code', header: 'Code' },
          { key: 'departmentId', header: 'Dept', render: (s) => deptCode(data, s.departmentId) },
          { key: 'semester', header: 'Sem' },
          { key: 'facultyId', header: 'Faculty', render: (s) => staffName(data, s.facultyId) },
          { key: 'syllabusCompletion', header: 'Completion', render: (s) => (
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${s.syllabusCompletion < 70 ? 'bg-rose-500' : s.syllabusCompletion < 85 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${s.syllabusCompletion}%` }} /></div>
              <span className="text-xs font-medium text-slate-700">{s.syllabusCompletion}%</span>
            </div>
          ) },
        ]}
      />
    </div>
  );
}

function SubjectTrackingFilter() {
  const { data } = useStore();
  const [dept, setDept] = useState('all');
  const [subjectId, setSubjectId] = useState('all');
  const subjects = data.subjects.filter((s) => dept === 'all' || s.departmentId === dept);
  const selected = data.subjects.find((s) => s.id === subjectId);
  return (
    <div>
      <PageHeader title="Subject-wise Tracking" description="Select class and subject to view completion status" action={
        <div className="flex gap-2">
          <DeptSelector value={dept} onChange={(v) => { setDept(v); setSubjectId('all'); }} />
          <select className="input w-auto" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            <option value="all">Subject: All</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      } />
      {selected ? (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="text-lg font-semibold text-slate-900">{selected.name}</h3><p className="text-sm text-slate-500">{selected.code} · Sem {selected.semester} · {deptCode(data, selected.departmentId)}</p></div>
              <div className="text-right"><p className="text-3xl font-bold text-slate-900">{selected.syllabusCompletion}%</p><p className="text-xs text-slate-500">Completion</p></div>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-4"><div className={`h-full rounded-full ${selected.syllabusCompletion < 70 ? 'bg-rose-500' : selected.syllabusCompletion < 85 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${selected.syllabusCompletion}%` }} /></div>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div><dt className="text-xs text-slate-500">Faculty</dt><dd className="text-sm text-slate-900 mt-0.5">{staffName(data, selected.facultyId)}</dd></div>
              <div><dt className="text-xs text-slate-500">Units</dt><dd className="text-sm text-slate-900 mt-0.5">{selected.unitsCompleted}/{selected.unitsTotal}</dd></div>
              <div><dt className="text-xs text-slate-500">Classes</dt><dd className="text-sm text-slate-900 mt-0.5">{selected.classes.join(', ')}</dd></div>
              <div><dt className="text-xs text-slate-500">Remaining</dt><dd className="text-sm text-slate-900 mt-0.5">{selected.unitsTotal - selected.unitsCompleted} units</dd></div>
            </dl>
          </div>
        </div>
      ) : (
        <DataTable
          rows={subjects}
          columns={[
            { key: 'name', header: 'Subject', render: (s) => <span className="font-medium">{s.name}</span> },
            { key: 'code', header: 'Code' },
            { key: 'departmentId', header: 'Dept', render: (s) => deptCode(data, s.departmentId) },
            { key: 'facultyId', header: 'Faculty', render: (s) => staffName(data, s.facultyId) },
            { key: 'unitsCompleted', header: 'Units', render: (s) => `${s.unitsCompleted}/${s.unitsTotal}` },
            { key: 'syllabusCompletion', header: 'Completion', render: (s) => <span className={s.syllabusCompletion < 75 ? 'text-rose-600 font-semibold' : ''}>{s.syllabusCompletion}%</span> },
          ]}
        />
      )}
    </div>
  );
}

function FacultyProgressFilter() {
  const { data } = useStore();
  const [dept, setDept] = useState('all');
  const teaching = data.staff.filter((s) => ['professor', 'associate-professor', 'assistant-professor', 'lecturer', 'teaching-assistant'].includes(s.role) && (dept === 'all' || s.departmentId === dept));
  return (
    <div>
      <PageHeader title="Faculty Teaching Progress" description="Select department to view faculty and their completion percentage" action={<DeptSelector value={dept} onChange={setDept} />} />
      <DataTable
        rows={teaching.map((f) => {
          const subs = data.subjects.filter((s) => s.facultyId === f.id);
          const avg = subs.length ? Math.round(subs.reduce((a, s) => a + s.syllabusCompletion, 0) / subs.length) : 0;
          return { id: f.id, name: f.name, dept: deptCode(data, f.departmentId), designation: f.designation, subjects: subs.length, avg, pending: subs.filter((s) => s.syllabusCompletion < 75).length };
        })}
        columns={[
          { key: 'name', header: 'Faculty', render: (f) => <span className="font-medium">{f.name}</span> },
          { key: 'designation', header: 'Designation' },
          { key: 'dept', header: 'Dept' },
          { key: 'subjects', header: 'Subjects' },
          { key: 'avg', header: 'Avg Completion', render: (f) => (
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${f.avg < 70 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${f.avg}%` }} /></div>
              <span className={f.avg < 75 ? 'text-rose-600 font-semibold' : ''}>{f.avg}%</span>
            </div>
          ) },
          { key: 'pending', header: 'Behind Schedule', render: (f) => f.pending || '—' },
        ]}
      />
    </div>
  );
}

function DelayComparison() {
  const { data } = useStore();
  const delayed = data.subjects.filter((s) => s.syllabusCompletion < 75);
  return (
    <div>
      <PageHeader title="Delay & Department Comparison" description="Subjects and departments behind schedule" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {data.departments.map((d) => {
          const subs = data.subjects.filter((s) => s.departmentId === d.id);
          const delayedCount = subs.filter((s) => s.syllabusCompletion < 75).length;
          return <StatCard key={d.id} label={d.code} value={`${delayedCount} delayed`} icon={<AlertTriangle className="w-5 h-5" />} accent={delayedCount > 0 ? 'rose' : 'emerald'} />;
        })}
      </div>
      <DataTable
        rows={delayed}
        columns={[
          { key: 'name', header: 'Subject', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'departmentId', header: 'Dept', render: (s) => deptCode(data, s.departmentId) },
          { key: 'facultyId', header: 'Faculty', render: (s) => staffName(data, s.facultyId) },
          { key: 'syllabusCompletion', header: 'Completion', render: (s) => <span className="text-rose-600 font-semibold">{s.syllabusCompletion}%</span> },
        ]}
      />
    </div>
  );
}

function CalendarCompliance() {
  const { data } = useStore();
  return (
    <div>
      <PageHeader title="Academic Calendar Compliance" description="Syllabus progress against scheduled milestones" />
      <DataTable
        rows={data.subjects.map((s) => ({ id: s.id, name: s.name, dept: deptCode(data, s.departmentId), planned: 80, actual: s.syllabusCompletion, deviation: s.syllabusCompletion - 80 }))}
        columns={[
          { key: 'name', header: 'Subject', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'dept', header: 'Dept' },
          { key: 'planned', header: 'Planned', render: (s) => `${s.planned}%` },
          { key: 'actual', header: 'Actual', render: (s) => `${s.actual}%` },
          { key: 'deviation', header: 'Deviation', render: (s) => <span className={s.deviation < 0 ? 'text-rose-600 font-semibold' : 'text-emerald-600'}>{s.deviation > 0 ? '+' : ''}{s.deviation}%</span> },
        ]}
      />
    </div>
  );
}

function RemarksReports() {
  const { data } = useStore();
  const [dept, setDept] = useState(data.departments[0]?.id ?? '');
  const [remark, setRemark] = useState('');
  const [savedRemarks, setSavedRemarks] = useState<{ id: string; dept: string; text: string; date: string }[]>([
    { id: 'rm1', dept: 'd1', text: 'CSE department syllabus progress is satisfactory. Focus on Distributed Systems completion.', date: '2026-07-15' },
    { id: 'rm2', dept: 'd2', text: 'ECE needs attention on Microprocessors — behind schedule. Please arrange remedial classes.', date: '2026-07-12' },
  ]);

  const submit = () => {
    if (!remark.trim()) return;
    setSavedRemarks([{ id: `rm${Date.now()}`, dept, text: remark, date: new Date().toISOString().slice(0, 10) }, ...savedRemarks]);
    setRemark('');
  };

  const exportReport = (type: 'pdf' | 'excel') => {
    alert(`Exporting ${type.toUpperCase()} report for ${deptName(data, dept)}...`);
  };

  return (
    <div>
      <PageHeader title="Remarks & Progress Reports" description="Record observations for HODs and generate reports" action={
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => exportReport('pdf')}><FileText className="w-4 h-4" /> PDF</button>
          <button className="btn-secondary" onClick={() => exportReport('excel')}><Download className="w-4 h-4" /> Excel</button>
        </div>
      } />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Issue Remark to HOD</h3>
          <div className="space-y-3">
            <DeptSelector value={dept} onChange={setDept} label="To HOD of" />
            <textarea className="input" rows={4} placeholder="Enter observation or instruction for the HOD..." value={remark} onChange={(e) => setRemark(e.target.value)} />
            <button className="btn-primary w-full" onClick={submit}><Send className="w-4 h-4" /> Send Remark</button>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Issued Remarks</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {savedRemarks.map((r) => (
              <div key={r.id} className="p-3 rounded-lg bg-slate-50">
                <div className="flex justify-between mb-1"><span className="text-xs font-semibold text-slate-700">{deptName(data, r.dept)}</span><span className="text-xs text-slate-400">{r.date}</span></div>
                <p className="text-sm text-slate-700">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card p-5 mt-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Department-wise Report Summary</h3>
        <DataTable
          rows={data.departments.map((d) => {
            const subs = data.subjects.filter((s) => s.departmentId === d.id);
            const avg = subs.length ? Math.round(subs.reduce((a, s) => a + s.syllabusCompletion, 0) / subs.length) : 0;
            const studs = data.students.filter((s) => s.departmentId === d.id);
            const passPct = studs.length ? Math.round((studs.filter((s) => s.backlogs === 0).length / studs.length) * 100) : 0;
            return { id: d.id, name: d.name, syllabus: avg, pass: passPct, faculty: d.facultyCount, students: d.studentCount };
          })}
          columns={[
            { key: 'name', header: 'Department', render: (d) => <span className="font-medium">{d.name}</span> },
            { key: 'syllabus', header: 'Syllabus Avg', render: (d) => `${d.syllabus}%` },
            { key: 'pass', header: 'Pass Rate', render: (d) => `${d.pass}%` },
            { key: 'faculty', header: 'Faculty' },
            { key: 'students', header: 'Students' },
          ]}
        />
      </div>
    </div>
  );
}

function RecruitmentRequests() {
  const { data, updateApproval, addNotification } = useStore();
  const [selected, setSelected] = useState<ApprovalRequest | null>(null);
  const [remarks, setRemarks] = useState('');
  const rows = data.approvals.filter((a) => a.type === 'recruitment');
  const recommend = (status: ApprovalRequest['deanStatus']) => {
    if (!selected) return;
    const newStatus = status === 'recommended' ? 'dean-recommended' : 'dean-rejected';
    updateApproval(selected.id, { deanStatus: status, deanRemarks: remarks, status: newStatus });
    addNotification({ id: `n${Date.now()}`, title: 'Dean recommendation recorded', message: `${selected.title} — Dean has ${status === 'recommended' ? 'recommended' : 'rejected'} the request`, date: new Date().toISOString().slice(0, 10), audience: ['principal', 'hod'], read: false });
    setSelected(null); setRemarks('');
  };
  return (
    <div>
      <PageHeader title="Recruitment Requests" description="Review faculty recruitment requests from HODs" />
      <DataTable
        rows={rows}
        columns={[
          { key: 'title', header: 'Request', render: (a) => <span className="font-medium">{a.title}</span> },
          { key: 'submittedBy', header: 'HOD' },
          { key: 'date', header: 'Date' },
          { key: 'purpose', header: 'Purpose' },
          { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
        ]}
        onRowClick={(a) => { setSelected(a); setRemarks(a.deanRemarks ?? ''); }}
      />
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative max-w-lg w-full bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 sticky top-0 bg-white"><h2 className="text-lg font-semibold text-slate-900">{selected.title}</h2><p className="text-sm text-slate-500">{selected.submittedBy} · {selected.date}</p></div>
            <div className="px-6 py-5 space-y-3">
              <div className="card p-3"><p className="text-xs text-slate-500">Purpose</p><p className="text-sm text-slate-900">{selected.purpose}</p></div>
              <div className="card p-3"><p className="text-xs text-slate-500 mb-1">Details</p><dl className="grid grid-cols-2 gap-2">{Object.entries(selected.details).map(([k, v]) => <div key={k}><dt className="text-xs text-slate-400 capitalize">{k}</dt><dd className="text-sm text-slate-900">{v}</dd></div>)}</dl></div>
              {selected.documents && selected.documents.length > 0 && (
                <div><p className="text-xs text-slate-500 mb-2">Supporting Documents</p><div className="space-y-2">{selected.documents.map((doc) => <div key={doc.id} className="card p-3 flex items-center justify-between"><div className="flex items-center gap-3"><FileText className="w-5 h-5 text-slate-400" /><div><p className="text-sm font-medium text-slate-900">{doc.name}</p><p className="text-xs text-slate-500">{doc.type} · {doc.size} · {doc.uploaded}</p></div></div><button className="btn-secondary text-xs"><Download className="w-3.5 h-3.5" /> View</button></div>)}</div></div>
              )}
              <textarea className="input" rows={3} placeholder="Recommendation remarks..." value={remarks} onChange={(e) => setRemarks(e.target.value)} />
              <div className="flex gap-2">
                <button className="btn-success flex-1" onClick={() => recommend('recommended')}><CheckSquare className="w-4 h-4" /> Recommend</button>
                <button className="btn-danger flex-1" onClick={() => recommend('rejected')}><XCircle className="w-4 h-4" /> Reject</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VacancyWorkload() {
  const { data } = useStore();
  return (
    <div>
      <PageHeader title="Vacancy & Workload Review" description="Faculty strength, vacancies, student-to-faculty ratio, and workload" />
      <DataTable
        rows={data.departments.map((d) => {
          const faculty = data.staff.filter((s) => s.departmentId === d.id && ['professor', 'associate-professor', 'assistant-professor', 'lecturer', 'teaching-assistant'].includes(s.role));
          const ratio = faculty.length ? Math.round(d.studentCount / faculty.length) : 0;
          const avgHours = faculty.length ? Math.round(faculty.reduce((a, f) => a + f.weeklyHours, 0) / faculty.length) : 0;
          const overloaded = faculty.filter((f) => f.weeklyHours > 42).length;
          const vacancy = Math.max(0, 10 - faculty.length);
          return { id: d.id, name: d.name, code: d.code, strength: faculty.length, students: d.studentCount, ratio, vacancy, avgHours, overloaded };
        })}
        columns={[
          { key: 'name', header: 'Department', render: (d) => <span className="font-medium">{d.name}</span> },
          { key: 'strength', header: 'Faculty Strength' },
          { key: 'vacancy', header: 'Vacancies', render: (d) => <span className={d.vacancy > 0 ? 'text-amber-600 font-semibold' : ''}>{d.vacancy}</span> },
          { key: 'students', header: 'Students' },
          { key: 'ratio', header: 'S:F Ratio', render: (d) => `${d.ratio}:1` },
          { key: 'avgHours', header: 'Avg Weekly Hours', render: (d) => `${d.avgHours} hrs` },
          { key: 'overloaded', header: 'Overloaded Faculty', render: (d) => <span className={d.overloaded > 0 ? 'text-rose-600 font-semibold' : ''}>{d.overloaded}</span> },
        ]}
      />
    </div>
  );
}

function CandidateReview() {
  const { data } = useStore();
  const [selected, setSelected] = useState<Candidate | null>(null);
  return (
    <div>
      <PageHeader title="Candidate Review" description="Shortlisted candidate profiles, qualifications, and supporting documents" />
      <DataTable
        rows={data.candidates}
        columns={[
          { key: 'name', header: 'Candidate', render: (c) => <span className="font-medium">{c.name}</span> },
          { key: 'qualification', header: 'Qualification' },
          { key: 'experience', header: 'Experience' },
          { key: 'appliedFor', header: 'Applied For' },
          { key: 'status', header: 'Status', render: (c) => <StatusBadge status={c.status} /> },
        ]}
        onRowClick={(c) => setSelected(c)}
      />
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative max-w-lg w-full bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 sticky top-0 bg-white flex items-center justify-between">
              <div><h2 className="text-lg font-semibold text-slate-900">{selected.name}</h2><p className="text-sm text-slate-500">{selected.appliedFor}</p></div>
              <StatusBadge status={selected.status} />
            </div>
            <div className="px-6 py-5 space-y-3">
              <dl className="grid grid-cols-2 gap-4">
                <div><dt className="text-xs text-slate-500">Qualification</dt><dd className="text-sm text-slate-900 mt-0.5">{selected.qualification}</dd></div>
                <div><dt className="text-xs text-slate-500">Experience</dt><dd className="text-sm text-slate-900 mt-0.5">{selected.experience}</dd></div>
                {selected.interviewScore > 0 && <div><dt className="text-xs text-slate-500">Interview Score</dt><dd className="text-sm text-slate-900 mt-0.5 font-semibold">{selected.interviewScore}/100</dd></div>}
              </dl>
              {selected.interviewNotes && <div className="card p-3"><p className="text-xs text-slate-500">Interview Notes</p><p className="text-sm text-slate-900 mt-1">{selected.interviewNotes}</p></div>}
              <div>
                <p className="text-xs text-slate-500 mb-2">Supporting Documents</p>
                <div className="space-y-2">
                  {selected.documents.map((doc) => (
                    <div key={doc.id} className="card p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-slate-400" /><div><p className="text-sm font-medium text-slate-900">{doc.name}</p><p className="text-xs text-slate-500">{doc.type} · {doc.size}</p></div></div>
                      <button className="btn-secondary text-xs"><Download className="w-3.5 h-3.5" /> View</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end"><button className="btn-secondary" onClick={() => setSelected(null)}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function RecommendationStatus() {
  const { data } = useStore();
  const rows = data.approvals.filter((a) => a.type === 'recruitment' || a.type === 'promotion');
  return (
    <div>
      <PageHeader title="Recommendation & Status Tracking" description="Track recommendations forwarded to the Principal" />
      <DataTable
        rows={rows}
        columns={[
          { key: 'title', header: 'Request', render: (a) => <span className="font-medium">{a.title}</span> },
          { key: 'submittedBy', header: 'HOD' },
          { key: 'deanStatus', header: 'Dean Decision', render: (a) => a.deanStatus ? <StatusBadge status={a.deanStatus} /> : <span className="text-slate-400">Pending</span> },
          { key: 'deanRemarks', header: 'Dean Remarks', render: (a) => a.deanRemarks ?? '—' },
          { key: 'status', header: 'Principal Status', render: (a) => <StatusBadge status={a.status} /> },
        ]}
      />
    </div>
  );
}

function RecruitmentReports() {
  const { data } = useStore();
  const report = data.departments.map((d) => {
    const reqs = data.approvals.filter((a) => a.type === 'recruitment' && a.departmentId === d.id);
    const approved = reqs.filter((a) => a.status === 'approved' || a.status === 'dean-recommended').length;
    const pending = reqs.filter((a) => a.status === 'pending').length;
    const faculty = data.staff.filter((s) => s.departmentId === d.id && ['professor', 'associate-professor', 'assistant-professor', 'lecturer', 'teaching-assistant'].includes(s.role));
    const vacancy = Math.max(0, 10 - faculty.length);
    return { id: d.id, name: d.name, code: d.code, vacancy, requests: reqs.length, approved, pending, completed: approved };
  });
  return (
    <div>
      <PageHeader title="Recruitment Reports" description="Department-wise vacancies, requests, approved positions, and completed hiring" action={
        <div className="flex gap-2"><button className="btn-secondary" onClick={() => alert('Exporting PDF...')}><FileText className="w-4 h-4" /> PDF</button><button className="btn-secondary" onClick={() => alert('Exporting Excel...')}><Download className="w-4 h-4" /> Excel</button></div>
      } />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Requests" value={report.reduce((a, r) => a + r.requests, 0)} icon={<FileText className="w-5 h-5" />} accent="blue" />
        <StatCard label="Approved" value={report.reduce((a, r) => a + r.approved, 0)} icon={<CheckSquare className="w-5 h-5" />} accent="emerald" />
        <StatCard label="Pending" value={report.reduce((a, r) => a + r.pending, 0)} icon={<AlertTriangle className="w-5 h-5" />} accent="amber" />
        <StatCard label="Total Vacancies" value={report.reduce((a, r) => a + r.vacancy, 0)} icon={<Users2 className="w-5 h-5" />} accent="rose" />
      </div>
      <DataTable
        rows={report}
        columns={[
          { key: 'name', header: 'Department', render: (r) => <span className="font-medium">{r.name}</span> },
          { key: 'vacancy', header: 'Vacancies' },
          { key: 'requests', header: 'Requests' },
          { key: 'approved', header: 'Approved' },
          { key: 'pending', header: 'Pending' },
          { key: 'completed', header: 'Completed Hiring', render: (r) => <span className={r.completed > 0 ? 'text-emerald-600 font-semibold' : ''}>{r.completed}</span> },
        ]}
      />
    </div>
  );
}

function TeachingQualityFilter() {
  const { data } = useStore();
  const [dept, setDept] = useState('all');
  const teaching = data.staff.filter((s) => ['professor', 'associate-professor', 'assistant-professor', 'lecturer', 'teaching-assistant'].includes(s.role) && (dept === 'all' || s.departmentId === dept));
  return (
    <div>
      <PageHeader title="Teaching Quality" description="Select department to view faculty performance" action={<DeptSelector value={dept} onChange={setDept} />} />
      <DataTable
        rows={teaching}
        columns={[
          { key: 'name', header: 'Faculty', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'designation', header: 'Designation' },
          { key: 'departmentId', header: 'Dept', render: (s) => deptCode(data, s.departmentId) },
          { key: 'attendancePct', header: 'Attendance', render: (s) => `${s.attendancePct}%` },
          { key: 'feedbackScore', header: 'Feedback', render: (s) => s.feedbackScore ? `${s.feedbackScore}/5` : '—' },
          { key: 'performanceRating', header: 'Rating', render: (s) => s.performanceRating ? `${s.performanceRating}/5` : '—' },
          { key: 'pendingWork', header: 'Pending Work', render: (s) => s.pendingWork },
        ]}
      />
    </div>
  );
}

function StudentFeedbackFilter() {
  const { data } = useStore();
  const [dept, setDept] = useState('all');
  const teaching = data.staff.filter((s) => ['professor', 'associate-professor', 'assistant-professor', 'lecturer', 'teaching-assistant'].includes(s.role) && (dept === 'all' || s.departmentId === dept) && s.feedbackScore > 0);
  return (
    <div>
      <PageHeader title="Student Feedback" description="Select department to view faculty ratings" action={<DeptSelector value={dept} onChange={setDept} />} />
      <DataTable
        rows={teaching}
        columns={[
          { key: 'name', header: 'Faculty', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'designation', header: 'Designation' },
          { key: 'departmentId', header: 'Dept', render: (s) => deptCode(data, s.departmentId) },
          { key: 'feedbackScore', header: 'Rating', render: (s) => (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">{s.feedbackScore}</span>
              <div className="flex">{[1,2,3,4,5].map((i) => <Award key={i} className={`w-3.5 h-3.5 ${i <= Math.round(s.feedbackScore) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />)}</div>
            </div>
          ) },
          { key: 'subjects', header: 'Subjects', render: (s) => s.subjects.length },
        ]}
      />
    </div>
  );
}

function ResultAnalysisFilter() {
  const { data } = useStore();
  const [dept, setDept] = useState('all');
  const students = data.students.filter((s) => dept === 'all' || s.departmentId === dept);
  const passed = students.filter((s) => s.backlogs === 0).length;
  const passPct = students.length ? Math.round((passed / students.length) * 100) : 0;
  return (
    <div>
      <PageHeader title="Result Analysis" description="Select department to view student results" action={<DeptSelector value={dept} onChange={setDept} />} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Students" value={students.length} icon={<Users2 className="w-5 h-5" />} accent="blue" />
        <StatCard label="Pass Rate" value={`${passPct}%`} icon={<CheckSquare className="w-5 h-5" />} accent="emerald" />
        <StatCard label="With Backlogs" value={students.filter((s) => s.backlogs > 0).length} icon={<AlertTriangle className="w-5 h-5" />} accent="rose" />
        <StatCard label="Avg CGPA" value={students.length ? (students.reduce((a, s) => a + s.cgpa, 0) / students.length).toFixed(2) : '—'} icon={<TrendingUp className="w-5 h-5" />} accent="indigo" />
      </div>
      <DataTable
        rows={students}
        columns={[
          { key: 'name', header: 'Student', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'rollNo', header: 'Roll No' },
          { key: 'departmentId', header: 'Dept', render: (s) => deptCode(data, s.departmentId) },
          { key: 'semester', header: 'Sem' },
          { key: 'gpa', header: 'GPA' },
          { key: 'cgpa', header: 'CGPA' },
          { key: 'backlogs', header: 'Backlogs', render: (s) => <span className={s.backlogs > 0 ? 'text-rose-600 font-semibold' : ''}>{s.backlogs}</span> },
        ]}
      />
    </div>
  );
}

function AccreditationReadiness() {
  const criteria = [
    { id: 'cr1', name: 'Criterion 1: Curricular Aspects', progress: 85, status: 'on-track' },
    { id: 'cr2', name: 'Criterion 2: Teaching-Learning & Evaluation', progress: 78, status: 'on-track' },
    { id: 'cr3', name: 'Criterion 3: Research, Innovations & Extension', progress: 72, status: 'needs-attention' },
    { id: 'cr4', name: 'Criterion 4: Infrastructure & Learning Resources', progress: 88, status: 'on-track' },
    { id: 'cr5', name: 'Criterion 5: Student Support & Progression', progress: 80, status: 'on-track' },
    { id: 'cr6', name: 'Criterion 6: Governance, Leadership & Management', progress: 75, status: 'needs-attention' },
    { id: 'cr7', name: 'Criterion 7: Institutional Values & Best Practices', progress: 82, status: 'on-track' },
  ];
  return (
    <div>
      <PageHeader title="Accreditation Readiness (NAAC/NBA)" description="Criteria-wise compliance progress" />
      <div className="space-y-3">
        {criteria.map((c) => (
          <div key={c.id} className="card p-4">
            <div className="flex justify-between mb-2"><span className="text-sm font-medium text-slate-900">{c.name}</span><span className="text-sm text-slate-600">{c.progress}%</span></div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${c.progress < 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${c.progress}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PromotionRequests() {
  const { data, updateApproval, addNotification } = useStore();
  const [selected, setSelected] = useState<ApprovalRequest | null>(null);
  const [remarks, setRemarks] = useState('');
  const rows = data.approvals.filter((a) => a.type === 'promotion');
  const recommend = (status: ApprovalRequest['deanStatus']) => {
    if (!selected) return;
    const newStatus = status === 'recommended' ? 'dean-recommended' : 'dean-rejected';
    updateApproval(selected.id, { deanStatus: status, deanRemarks: remarks, status: newStatus });
    addNotification({ id: `n${Date.now()}`, title: 'Dean recommendation recorded', message: `${selected.title} — Dean has ${status === 'recommended' ? 'recommended' : 'rejected'} the promotion`, date: new Date().toISOString().slice(0, 10), audience: ['principal', 'hod'], read: false });
    setSelected(null); setRemarks('');
  };
  return (
    <div>
      <PageHeader title="Promotion Requests" description="Review faculty promotion requests from HODs" />
      <DataTable
        rows={rows}
        columns={[
          { key: 'title', header: 'Request', render: (a) => <span className="font-medium">{a.title}</span> },
          { key: 'submittedBy', header: 'HOD' },
          { key: 'date', header: 'Date' },
          { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
        ]}
        onRowClick={(a) => { setSelected(a); setRemarks(a.deanRemarks ?? ''); }}
      />
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative max-w-lg w-full bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 sticky top-0 bg-white"><h2 className="text-lg font-semibold text-slate-900">{selected.title}</h2><p className="text-sm text-slate-500">{selected.submittedBy} · {selected.date}</p></div>
            <div className="px-6 py-5 space-y-3">
              <div className="card p-3"><p className="text-xs text-slate-500">Purpose</p><p className="text-sm text-slate-900">{selected.purpose}</p></div>
              <div className="card p-3"><p className="text-xs text-slate-500 mb-1">Details</p><dl className="grid grid-cols-2 gap-2">{Object.entries(selected.details).map(([k, v]) => <div key={k}><dt className="text-xs text-slate-400 capitalize">{k}</dt><dd className="text-sm text-slate-900">{v}</dd></div>)}</dl></div>
              {selected.documents && selected.documents.length > 0 && (
                <div><p className="text-xs text-slate-500 mb-2">Supporting Documents</p><div className="space-y-2">{selected.documents.map((doc) => <div key={doc.id} className="card p-3 flex items-center justify-between"><div className="flex items-center gap-3"><FileText className="w-5 h-5 text-slate-400" /><div><p className="text-sm font-medium text-slate-900">{doc.name}</p><p className="text-xs text-slate-500">{doc.type} · {doc.size} · {doc.uploaded}</p></div></div><button className="btn-secondary text-xs"><Download className="w-3.5 h-3.5" /> View</button></div>)}</div></div>
              )}
              <textarea className="input" rows={3} placeholder="Recommendation remarks..." value={remarks} onChange={(e) => setRemarks(e.target.value)} />
              <div className="flex gap-2">
                <button className="btn-success flex-1" onClick={() => recommend('recommended')}><CheckSquare className="w-4 h-4" /> Recommend</button>
                <button className="btn-danger flex-1" onClick={() => recommend('rejected')}><XCircle className="w-4 h-4" /> Reject</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PromoPerfReview() {
  const { data } = useStore();
  const promoReqs = data.approvals.filter((a) => a.type === 'promotion');
  return (
    <div>
      <PageHeader title="Performance Review" description="Teaching performance, student feedback, research, and appraisal for promotion candidates" />
      <div className="space-y-4">
        {promoReqs.map((a) => {
          const faculty = data.staff.find((s) => s.name.includes(a.title.split(' - ')[1] ?? '') || a.title.includes(s.name));
          const pubs = faculty ? data.publications.filter((p) => p.facultyId === faculty.id) : [];
          return (
            <div key={a.id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div><h3 className="text-sm font-semibold text-slate-900">{a.title}</h3><p className="text-xs text-slate-500">{a.purpose} · Submitted by {a.submittedBy}</p></div>
                <StatusBadge status={a.status} />
              </div>
              {faculty && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="card p-3 text-center"><p className="text-xs text-slate-500">Attendance</p><p className="text-lg font-bold text-slate-900">{faculty.attendancePct}%</p></div>
                  <div className="card p-3 text-center"><p className="text-xs text-slate-500">Feedback</p><p className="text-lg font-bold text-slate-900">{faculty.feedbackScore}/5</p></div>
                  <div className="card p-3 text-center"><p className="text-xs text-slate-500">Rating</p><p className="text-lg font-bold text-slate-900">{faculty.performanceRating}/5</p></div>
                  <div className="card p-3 text-center"><p className="text-xs text-slate-500">Publications</p><p className="text-lg font-bold text-slate-900">{pubs.length}</p></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EligibilityVerification() {
  const { data } = useStore();
  const promoReqs = data.approvals.filter((a) => a.type === 'promotion');
  return (
    <div>
      <PageHeader title="Eligibility Verification" description="Check years of service, qualifications, certifications, and research contributions" />
      <div className="space-y-4">
        {promoReqs.map((a) => {
          const faculty = data.staff.find((s) => a.title.includes(s.name));
          const pubs = faculty ? data.publications.filter((p) => p.facultyId === faculty.id) : [];
          const projects = faculty ? data.researchProjects.filter((r) => r.facultyId === faculty.id) : [];
          const yearsOfService = faculty ? new Date().getFullYear() - new Date(faculty.joinedOn).getFullYear() : 0;
          const eligible = yearsOfService >= 10 && (pubs.length + projects.length) >= 3;
          return (
            <div key={a.id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div><h3 className="text-sm font-semibold text-slate-900">{a.title}</h3><p className="text-xs text-slate-500">{a.purpose}</p></div>
                <span className={`badge ${eligible ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{eligible ? 'Eligible' : 'Not Eligible'}</span>
              </div>
              {faculty && (
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div><dt className="text-xs text-slate-500">Years of Service</dt><dd className="text-sm text-slate-900 mt-0.5">{yearsOfService} years</dd></div>
                  <div><dt className="text-xs text-slate-500">Qualification</dt><dd className="text-sm text-slate-900 mt-0.5">{faculty.qualifications}</dd></div>
                  <div><dt className="text-xs text-slate-500">Publications</dt><dd className="text-sm text-slate-900 mt-0.5">{pubs.length}</dd></div>
                  <div><dt className="text-xs text-slate-500">Research Projects</dt><dd className="text-sm text-slate-900 mt-0.5">{projects.length}</dd></div>
                </dl>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecommendationView() {
  const { data, updateApproval, addNotification } = useStore();
  const [selected, setSelected] = useState<ApprovalRequest | null>(null);
  const [remarks, setRemarks] = useState('');
  const rows = data.approvals.filter((a) => a.type === 'promotion' || a.type === 'recruitment');
  const recommend = (status: ApprovalRequest['deanStatus']) => {
    if (!selected) return;
    const newStatus = status === 'recommended' ? 'dean-recommended' : 'dean-rejected';
    updateApproval(selected.id, { deanStatus: status, deanRemarks: remarks, status: newStatus });
    addNotification({ id: `n${Date.now()}`, title: 'Dean recommendation recorded', message: `${selected.title} — Dean has ${status === 'recommended' ? 'recommended' : 'rejected'}`, date: new Date().toISOString().slice(0, 10), audience: ['principal', 'hod'], read: false });
    setSelected(null); setRemarks('');
  };
  return (
    <div>
      <PageHeader title="Recommendation" description="Record approval, rejection, or further review with remarks — forwarded to Principal" />
      <DataTable
        rows={rows}
        columns={[
          { key: 'title', header: 'Request', render: (a) => <span className="font-medium">{a.title}</span> },
          { key: 'type', header: 'Type', render: (a) => <span className="badge bg-slate-100 text-slate-700 capitalize">{a.type}</span> },
          { key: 'submittedBy', header: 'Submitted By' },
          { key: 'deanStatus', header: 'Current Decision', render: (a) => a.deanStatus ? <StatusBadge status={a.deanStatus} /> : <span className="text-slate-400">Pending</span> },
          { key: 'status', header: 'Principal Status', render: (a) => <StatusBadge status={a.status} /> },
        ]}
        onRowClick={(a) => { setSelected(a); setRemarks(a.deanRemarks ?? ''); }}
      />
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative max-w-lg w-full bg-white rounded-2xl shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100"><h2 className="text-lg font-semibold text-slate-900">{selected.title}</h2><p className="text-sm text-slate-500">{selected.submittedBy} · {selected.date}</p></div>
            <div className="px-6 py-5 space-y-3">
              <div className="card p-3"><p className="text-xs text-slate-500">Purpose</p><p className="text-sm text-slate-900">{selected.purpose}</p></div>
              <div className="card p-3"><p className="text-xs text-slate-500 mb-1">Details</p><dl className="grid grid-cols-2 gap-2">{Object.entries(selected.details).map(([k, v]) => <div key={k}><dt className="text-xs text-slate-400 capitalize">{k}</dt><dd className="text-sm text-slate-900">{v}</dd></div>)}</dl></div>
              <textarea className="input" rows={3} placeholder="Record recommendation with remarks..." value={remarks} onChange={(e) => setRemarks(e.target.value)} />
              <div className="flex gap-2">
                <button className="btn-success flex-1" onClick={() => recommend('recommended')}><CheckSquare className="w-4 h-4" /> Recommend Approval</button>
                <button className="btn-danger flex-1" onClick={() => recommend('rejected')}><XCircle className="w-4 h-4" /> Reject</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PublicationsView() {
  const { data } = useStore();
  return (
    <div>
      <PageHeader title="Publications" description="Faculty research publications" />
      <DataTable
        rows={data.publications}
        columns={[
          { key: 'title', header: 'Title', render: (p) => <span className="font-medium">{p.title}</span> },
          { key: 'type', header: 'Type', render: (p) => <span className="badge bg-slate-100 text-slate-700 capitalize">{p.type}</span> },
          { key: 'journal', header: 'Journal/Conference' },
          { key: 'year', header: 'Year' },
          { key: 'facultyId', header: 'Faculty', render: (p) => staffName(data, p.facultyId) },
          { key: 'departmentId', header: 'Dept', render: (p) => deptCode(data, p.departmentId) },
        ]}
      />
    </div>
  );
}

function ProjectsView() {
  const { data } = useStore();
  return (
    <div>
      <PageHeader title="Funded Research Projects" description="Ongoing and completed funded research" />
      <DataTable
        rows={data.researchProjects}
        columns={[
          { key: 'title', header: 'Title', render: (r) => <span className="font-medium">{r.title}</span> },
          { key: 'fundingAgency', header: 'Funding Agency' },
          { key: 'amount', header: 'Amount', render: (r) => `₹${r.amount.toLocaleString('en-IN')}` },
          { key: 'facultyId', header: 'Investigator', render: (r) => staffName(data, r.facultyId) },
          { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </div>
  );
}

function DeptReports() {
  const { data } = useStore();
  return (
    <div>
      <PageHeader title="Department Reports & Analytics" description="Consolidated reports submitted to the Principal" action={
        <div className="flex gap-2"><button className="btn-secondary" onClick={() => alert('Exporting PDF...')}><FileText className="w-4 h-4" /> PDF</button><button className="btn-secondary" onClick={() => alert('Exporting Excel...')}><Download className="w-4 h-4" /> Excel</button></div>
      } />
      <div className="grid lg:grid-cols-2 gap-4">
        {data.departments.map((d) => {
          const subs = data.subjects.filter((s) => s.departmentId === d.id);
          const avg = subs.length ? Math.round(subs.reduce((a, s) => a + s.syllabusCompletion, 0) / subs.length) : 0;
          const studs = data.students.filter((s) => s.departmentId === d.id);
          const passPct = studs.length ? Math.round((studs.filter((s) => s.backlogs === 0).length / studs.length) * 100) : 0;
          const pubs = data.publications.filter((p) => p.departmentId === d.id).length;
          const reqs = data.approvals.filter((a) => (a.type === 'recruitment' || a.type === 'promotion') && a.departmentId === d.id).length;
          return (
            <div key={d.id} className="card p-5">
              <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-slate-900">{d.name}</h3><span className="badge bg-slate-100 text-slate-700">{d.code}</span></div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="text-xs text-slate-500">Syllabus</p><p className="text-lg font-bold text-slate-900">{avg}%</p></div>
                <div><p className="text-xs text-slate-500">Pass Rate</p><p className="text-lg font-bold text-slate-900">{passPct}%</p></div>
                <div><p className="text-xs text-slate-500">Faculty</p><p className="text-lg font-bold text-slate-900">{d.facultyCount}</p></div>
                <div><p className="text-xs text-slate-500">Publications</p><p className="text-lg font-bold text-slate-900">{pubs}</p></div>
                <div><p className="text-xs text-slate-500">Requests</p><p className="text-lg font-bold text-slate-900">{reqs}</p></div>
                <div><p className="text-xs text-slate-500">Students</p><p className="text-lg font-bold text-slate-900">{d.studentCount}</p></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HodManagement() {
  const { data } = useStore();
  const hods = data.staff.filter((s) => s.role === 'hod');
  return (
    <div>
      <PageHeader title="HOD Management" description="Direct reports — issue remarks and instructions to HODs" />
      <DataTable
        rows={hods}
        columns={[
          { key: 'name', header: 'HOD', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'departmentId', header: 'Department', render: (s) => deptName(data, s.departmentId) },
          { key: 'email', header: 'Email' },
          { key: 'phone', header: 'Phone' },
          { key: 'status', header: 'Status', render: (s) => <StatusBadge status={s.status} /> },
        ]}
      />
    </div>
  );
}
