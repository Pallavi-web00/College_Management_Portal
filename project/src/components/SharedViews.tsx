import { useState, type ReactNode } from 'react';
import { useStore, deptName, deptCode, staffName, roleLabels } from '../store/StoreContext';
import { DataTable, StatusBadge } from './DataTable';
import { PageHeader, SectionTitle } from './PageHeader';
import { StatCard } from './StatCard';
import { StudentDetailModal, StaffDetailModal } from './DetailModals';
import { Search, Users, GraduationCap, CheckSquare, XCircle, RotateCcw, MessageSquare, FileText, Download, Mail, ShieldCheck, Send } from 'lucide-react';
import type { Student, Staff, ApprovalRequest, Message, Role, Complaint } from '../data/types';

export function StudentsDirectory({ scopeDept, editable, showStats = true, classFilter = false, courseFilter = false }: { scopeDept?: string; editable?: boolean; showStats?: boolean; classFilter?: boolean; courseFilter?: boolean }) {
  const { data, updateStudent } = useStore();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Student | null>(null);
  const [filterSem, setFilterSem] = useState<string>('all');
  const [filterSec, setFilterSec] = useState<string>('all');
  const [filterCourse, setFilterCourse] = useState<string>('all');

  const semesters = [...new Set(data.students.filter((s) => !scopeDept || s.departmentId === scopeDept).map((s) => s.semester))].sort((a, b) => a - b);
  const sections = [...new Set(data.students.filter((s) => !scopeDept || s.departmentId === scopeDept).map((s) => s.section))].sort();
  const courses = [...new Set(data.students.filter((s) => !scopeDept || s.departmentId === scopeDept).map((s) => s.program))].sort();

  let rows = data.students.filter((s) => (!scopeDept || s.departmentId === scopeDept) && s.name.toLowerCase().includes(query.toLowerCase()));
  if (classFilter) {
    rows = rows.filter((s) => (filterSem === 'all' || s.semester === Number(filterSem)) && (filterSec === 'all' || s.section === filterSec));
  }
  if (courseFilter) {
    rows = rows.filter((s) => (filterSem === 'all' || s.semester === Number(filterSem)) && (filterSec === 'all' || s.section === filterSec) && (filterCourse === 'all' || s.program === filterCourse));
  }

  return (
    <div>
      <PageHeader title="Student Directory" description={scopeDept ? `${deptName(data, scopeDept)} students` : 'All college students'} action={
        <div className="flex flex-wrap items-center gap-2">
          {classFilter && (
            <>
              {courseFilter && (
                <select className="input w-auto" value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
                  <option value="all">All Courses</option>
                  {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
              <select className="input w-auto" value={filterSem} onChange={(e) => setFilterSem(e.target.value)}>
                <option value="all">All Semesters</option>
                {semesters.map((s) => <option key={s} value={s}>Sem {s}</option>)}
              </select>
              <select className="input w-auto" value={filterSec} onChange={(e) => setFilterSec(e.target.value)}>
                <option value="all">All Sections</option>
                {sections.map((s) => <option key={s} value={s}>Sec {s}</option>)}
              </select>
            </>
          )}
          <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 w-56">
            <Search className="w-4 h-4 text-slate-400" />
            <input className="bg-transparent border-0 outline-0 text-sm ml-2 flex-1" placeholder="Search by name..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
      } />
      {showStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Students" value={rows.length} icon={<GraduationCap className="w-5 h-5" />} accent="blue" />
          <StatCard label="Active" value={rows.filter((s) => s.status === 'active').length} icon={<Users className="w-5 h-5" />} accent="emerald" />
          <StatCard label="Low Attendance" value={rows.filter((s) => s.attendancePct < 75).length} icon={<XCircle className="w-5 h-5" />} accent="rose" />
          <StatCard label="With Backlogs" value={rows.filter((s) => s.backlogs > 0).length} icon={<RotateCcw className="w-5 h-5" />} accent="amber" />
        </div>
      )}
      <DataTable
        rows={rows}
        columns={[
          { key: 'rollNo', header: 'Roll No' },
          { key: 'name', header: 'Name', render: (s) => <span className="font-medium text-slate-900">{s.name}</span> },
          { key: 'program', header: 'Program' },
          { key: 'semester', header: 'Sem', render: (s) => `Sem ${s.semester}` },
          { key: 'section', header: 'Sec' },
          { key: 'attendancePct', header: 'Attendance', render: (s) => <span className={s.attendancePct < 75 ? 'text-rose-600 font-semibold' : ''}>{s.attendancePct}%</span> },
          { key: 'gpa', header: 'GPA', render: (s) => s.gpa },
          { key: 'status', header: 'Status', render: (s) => <StatusBadge status={s.status} /> },
        ]}
        onRowDoubleClick={(s) => setSelected(s)}
      />
      <p className="text-xs text-slate-400 mt-3">Double-click a row to view full profile.</p>
      <StudentDetailModal student={selected} open={!!selected} onClose={() => setSelected(null)} editable={editable} onSave={(patch) => { if (selected) { updateStudent(selected.id, patch); setSelected({ ...selected, ...patch }); } }} />
    </div>
  );
}

export function StaffDirectory({ scopeDept, roles, editable, title = 'Staff Directory' }: { scopeDept?: string; roles?: string[]; editable?: boolean; title?: string }) {
  const { data, updateStaff } = useStore();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Staff | null>(null);

  const rows = data.staff.filter((s) =>
    (!scopeDept || s.departmentId === scopeDept) &&
    (!roles || roles.includes(s.role)) &&
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <PageHeader title={title} description={scopeDept ? `${deptName(data, scopeDept)}` : 'All staff'} action={
        <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 w-64">
          <Search className="w-4 h-4 text-slate-400" />
          <input className="bg-transparent border-0 outline-0 text-sm ml-2 flex-1" placeholder="Search by name..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      } />
      <DataTable
        rows={rows}
        columns={[
          { key: 'id', header: 'ID', render: (s) => s.id.toUpperCase() },
          { key: 'name', header: 'Name', render: (s) => <span className="font-medium text-slate-900">{s.name}</span> },
          { key: 'designation', header: 'Designation' },
          { key: 'departmentId', header: 'Dept', render: (s) => deptCode(data, s.departmentId) },
          { key: 'subjects', header: 'Subjects', render: (s) => s.subjects.length || '—' },
          { key: 'status', header: 'Status', render: (s) => <StatusBadge status={s.status} /> },
          { key: 'email', header: 'Email' },
        ]}
        onRowDoubleClick={(s) => setSelected(s)}
      />
      <p className="text-xs text-slate-400 mt-3">Double-click a row to view full profile.</p>
      <StaffDetailModal staff={selected} open={!!selected} onClose={() => setSelected(null)} editable={editable} onSave={(patch) => { if (selected) { updateStaff(selected.id, patch); setSelected({ ...selected, ...patch }); } }} />
    </div>
  );
}

export function ApprovalsPanel({ filter, canAct }: { filter?: ApprovalRequest['type'][]; canAct?: boolean }) {
  const { data, updateApproval, addNotification } = useStore();
  const [selected, setSelected] = useState<ApprovalRequest | null>(null);
  const [remarks, setRemarks] = useState('');

  const rows = data.approvals.filter((a) => (!filter || filter.includes(a.type)) && a.status !== 'approved' && a.status !== 'rejected');

  const act = (status: ApprovalRequest['status']) => {
    if (!selected) return;
    updateApproval(selected.id, { status, principalRemarks: remarks });
    const title = selected.title;
    const decision = status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'sent back for revision';
    addNotification({ id: `n${Date.now()}`, title: `Approval ${decision}`, message: `${title} has been ${decision} by Principal`, date: new Date().toISOString().slice(0, 10), audience: [selected.submittedByRole], read: false });
    setSelected({ ...selected, status, principalRemarks: remarks });
    setRemarks('');
  };

  return (
    <div>
      <PageHeader title="Pending Approvals" description="Review and act on requests submitted by HODs, Faculty, and Accounts" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pending" value={rows.length} icon={<CheckSquare className="w-5 h-5" />} accent="amber" />
        <StatCard label="Timetable" value={rows.filter((r) => r.type === 'timetable').length} icon={<CheckSquare className="w-5 h-5" />} accent="blue" />
        <StatCard label="Budget/Purchase" value={rows.filter((r) => r.type === 'budget' || r.type === 'purchase').length} icon={<CheckSquare className="w-5 h-5" />} accent="slate" />
        <StatCard label="Events/Leave" value={rows.filter((r) => r.type === 'event' || r.type === 'leave').length} icon={<CheckSquare className="w-5 h-5" />} accent="indigo" />
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: 'title', header: 'Title', render: (a) => <span className="font-medium text-slate-900">{a.title}</span> },
          { key: 'type', header: 'Type', render: (a) => <span className="badge bg-slate-100 text-slate-700 capitalize">{a.type}</span> },
          { key: 'submittedBy', header: 'Submitted By' },
          { key: 'date', header: 'Date' },
          { key: 'amount', header: 'Amount', render: (a) => a.amount ? `₹${a.amount.toLocaleString('en-IN')}` : '—' },
          { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
        ]}
        onRowClick={(a) => { setSelected(a); setRemarks(a.principalRemarks ?? ''); }}
      />
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-slate-900">{selected.title}</h2>
              <p className="text-sm text-slate-500 capitalize">{selected.type} · {selected.submittedBy} · {selected.date}</p>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="card p-3"><p className="text-xs text-slate-500">Purpose</p><p className="text-sm text-slate-900">{selected.purpose}</p></div>
              {selected.amount && <div className="card p-3"><p className="text-xs text-slate-500">Amount</p><p className="text-sm text-slate-900 font-semibold">₹{selected.amount.toLocaleString('en-IN')}</p></div>}
              <div className="card p-3"><p className="text-xs text-slate-500 mb-1">Details</p><dl className="grid grid-cols-2 gap-2">{Object.entries(selected.details).map(([k, v]) => <div key={k}><dt className="text-xs text-slate-400 capitalize">{k}</dt><dd className="text-sm text-slate-900">{v}</dd></div>)}</dl></div>

              {selected.timetableEntries && selected.timetableEntries.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Submitted Timetable</p>
                  <div className="card overflow-hidden">
                    <table className="w-full">
                      <thead><tr className="bg-slate-50 border-b border-slate-200"><th className="text-left px-3 py-2 text-xs font-semibold text-slate-600">Day</th><th className="text-left px-3 py-2 text-xs font-semibold text-slate-600">Time</th><th className="text-left px-3 py-2 text-xs font-semibold text-slate-600">Subject</th><th className="text-left px-3 py-2 text-xs font-semibold text-slate-600">Faculty</th><th className="text-left px-3 py-2 text-xs font-semibold text-slate-600">Room</th></tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {selected.timetableEntries.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50"><td className="px-3 py-2 text-sm text-slate-700">{t.day}</td><td className="px-3 py-2 text-sm text-slate-700">{t.slot}</td><td className="px-3 py-2 text-sm font-medium text-slate-900">{t.subject}</td><td className="px-3 py-2 text-sm text-slate-700">{staffName(data, t.facultyId)}</td><td className="px-3 py-2 text-sm text-slate-700">{t.room}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selected.documents && selected.documents.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Submitted Documents</p>
                  <div className="space-y-2">
                    {selected.documents.map((doc) => (
                      <div key={doc.id} className="card p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-slate-400" /><div><p className="text-sm font-medium text-slate-900">{doc.name}</p><p className="text-xs text-slate-500">{doc.type} · {doc.size} · {doc.uploaded}</p></div></div>
                        <button className="btn-secondary text-xs"><Download className="w-3.5 h-3.5" /> View</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selected.deanRemarks && <div className="card p-3 bg-blue-50/50"><p className="text-xs text-slate-500">Dean's Remarks</p><p className="text-sm text-slate-900">{selected.deanRemarks}</p></div>}
              {canAct && (
                <>
                  <textarea className="input" rows={3} placeholder="Add remarks..." value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                  <div className="flex gap-2">
                    <button className="btn-success flex-1" onClick={() => act('approved')}><CheckSquare className="w-4 h-4" /> Approve</button>
                    <button className="btn-danger flex-1" onClick={() => act('rejected')}><XCircle className="w-4 h-4" /> Reject</button>
                    <button className="btn-warning flex-1" onClick={() => act('revision')}><RotateCcw className="w-4 h-4" /> Send Back</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function GrievancesPanel({ scopeDept, canAssign }: { scopeDept?: string; canAssign?: boolean }) {
  const { data, updateGrievance } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [assignTo, setAssignTo] = useState('');
  const [resolution, setResolution] = useState('');

  const rows = data.grievances.filter((g) => !scopeDept || g.departmentId === scopeDept);
  const selected = rows.find((g) => g.id === selectedId);
  const faculty = data.staff.filter((s) => (!scopeDept || s.departmentId === scopeDept) && ['professor', 'associate-professor', 'assistant-professor', 'lecturer', 'hod'].includes(s.role));

  return (
    <div>
      <PageHeader title="Student Grievances" description="Review, assign, and resolve student grievances" />
      <DataTable
        rows={rows}
        columns={[
          { key: 'title', header: 'Title', render: (g) => <span className="font-medium text-slate-900">{g.title}</span> },
          { key: 'studentId', header: 'Student', render: (g) => data.students.find((s) => s.id === g.studentId)?.name ?? '—' },
          { key: 'date', header: 'Date' },
          { key: 'assignedTo', header: 'Assigned To' },
          { key: 'status', header: 'Status', render: (g) => <StatusBadge status={g.status} /> },
        ]}
        onRowClick={(g) => { setSelectedId(g.id); setAssignTo(g.assignedTo); setResolution(g.resolution); }}
      />
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedId(null)} />
          <div className="relative max-w-lg w-full bg-white rounded-2xl shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">{selected.title}</h2>
              <StatusBadge status={selected.status} />
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="card p-3"><p className="text-xs text-slate-500">Student</p><p className="text-sm text-slate-900">{data.students.find((s) => s.id === selected.studentId)?.name}</p></div>
              <div className="card p-3"><p className="text-xs text-slate-500">Description</p><p className="text-sm text-slate-900">{selected.description}</p></div>
              <div>
                <p className="text-xs text-slate-500 mb-2">History</p>
                <div className="space-y-2">{selected.history.map((h, i) => <div key={i} className="text-sm text-slate-700 border-l-2 border-slate-200 pl-3"><span className="text-xs text-slate-400">{h.date}</span> · {h.action} <span className="text-xs text-slate-400">by {h.by}</span></div>)}</div>
              </div>
              {canAssign && (
                <>
                  <select className="input" value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
                    <option value="">Assign to faculty...</option>
                    {faculty.map((f) => <option key={f.id} value={f.name}>{f.name} ({f.designation})</option>)}
                  </select>
                  <textarea className="input" rows={2} placeholder="Resolution notes..." value={resolution} onChange={(e) => setResolution(e.target.value)} />
                  <div className="flex gap-2">
                    <button className="btn-primary flex-1" onClick={() => { updateGrievance(selected.id, { assignedTo: assignTo, status: 'assigned' }); setSelectedId(null); }}><MessageSquare className="w-4 h-4" /> Assign</button>
                    <button className="btn-success flex-1" onClick={() => { updateGrievance(selected.id, { resolution, status: 'resolved' }); setSelectedId(null); }}><CheckSquare className="w-4 h-4" /> Resolve</button>
                    <button className="btn-secondary flex-1" onClick={() => { updateGrievance(selected.id, { resolution, status: 'closed' }); setSelectedId(null); }}>Close</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SyllabusProgressView({ scopeDept }: { scopeDept?: string }) {
  const { data } = useStore();
  const rows = data.subjects.filter((s) => !scopeDept || s.departmentId === scopeDept);
  return (
    <div>
      <PageHeader title="Syllabus Progress" description="Subject-wise syllabus completion tracking" />
      <DataTable
        rows={rows}
        columns={[
          { key: 'name', header: 'Subject', render: (s) => <span className="font-medium text-slate-900">{s.name}</span> },
          { key: 'code', header: 'Code' },
          { key: 'departmentId', header: 'Dept', render: (s) => deptCode(data, s.departmentId) },
          { key: 'semester', header: 'Sem' },
          { key: 'facultyId', header: 'Faculty', render: (s) => staffName(data, s.facultyId) },
          { key: 'unitsCompleted', header: 'Units', render: (s) => `${s.unitsCompleted}/${s.unitsTotal}` },
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

export function TimetableView({ scopeDept, showStatus = false }: { scopeDept?: string; showStatus?: boolean }) {
  const { data } = useStore();
  const rows = data.timetable.filter((t) => !scopeDept || t.departmentId === scopeDept);
  const cols: { key: string; header: string; render?: (row: typeof rows[0]) => ReactNode }[] = [
    { key: 'day', header: 'Day' },
    { key: 'slot', header: 'Time' },
    { key: 'subject', header: 'Subject' },
    { key: 'facultyId', header: 'Faculty', render: (t) => staffName(data, t.facultyId) },
    { key: 'room', header: 'Room' },
    { key: 'section', header: 'Section', render: (t) => `${t.section} · Sem ${t.semester}` },
  ];
  if (showStatus) cols.push({ key: 'status', header: 'Status', render: (t) => <StatusBadge status={t.status} /> });
  return (
    <div>
      <PageHeader title="Timetable" description={scopeDept ? `${deptName(data, scopeDept)}` : 'All department timetables'} />
      <DataTable rows={rows} columns={cols} />
    </div>
  );
}

export function Placeholder({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="card p-12 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-4">
          <MessageSquare className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-sm text-slate-500 max-w-md mx-auto">This module is configured per the SOP. Sample data and read-only views are available in connected modules. Full operational data-entry workflows are scoped to authorized roles.</p>
      </div>
    </div>
  );
}

export { SectionTitle };

export function InboxView({ recipientRole, recipientName }: { recipientRole: Role; recipientName: string }) {
  const { data, markMessageRead } = useStore();
  const [selected, setSelected] = useState<Message | null>(null);
  const rows = data.messages.filter((m) => m.toRole === recipientRole);

  return (
    <div>
      <PageHeader title="Inbox" description={`Messages received by ${recipientName}`} />
      <DataTable
        rows={rows}
        columns={[
          { key: 'fromName', header: 'From', render: (m) => <span className="font-medium text-slate-900">{m.fromName}</span> },
          { key: 'fromRole', header: 'Role', render: (m) => <span className="badge bg-slate-100 text-slate-700">{roleLabels[m.fromRole]}</span> },
          { key: 'subject', header: 'Subject' },
          { key: 'date', header: 'Date' },
          { key: 'read', header: 'Status', render: (m) => m.read ? <span className="text-xs text-slate-400">Read</span> : <span className="badge bg-blue-100 text-blue-700">New</span> },
        ]}
        onRowClick={(m) => { setSelected(m); if (!m.read) markMessageRead(m.id); }}
      />
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative max-w-lg w-full bg-white rounded-2xl shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">{selected.subject}</h2>
              <p className="text-sm text-slate-500">From: {selected.fromName} ({roleLabels[selected.fromRole]}) · {selected.date}</p>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{selected.body}</p>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <button className="btn-secondary" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function LiaisonView({ category, title }: { category: 'university' | 'government' | 'accreditation' | 'parent'; title: string }) {
  const { data } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const rows = data.liaison.filter((l) => l.category === category);
  const selected = rows.find((l) => l.id === selectedId);

  return (
    <div>
      <PageHeader title={title} description="Communication and compliance with external bodies" />
      <DataTable
        rows={rows}
        columns={[
          { key: 'title', header: 'Title', render: (l) => <span className="font-medium text-slate-900">{l.title}</span> },
          { key: 'from', header: 'From' },
          { key: 'type', header: 'Type', render: (l) => <span className="badge bg-slate-100 text-slate-700">{l.type}</span> },
          { key: 'date', header: 'Date' },
          { key: 'deadline', header: 'Deadline', render: (l) => l.deadline ?? '—' },
          { key: 'status', header: 'Status', render: (l) => <StatusBadge status={l.status} /> },
        ]}
        onRowClick={(l) => setSelectedId(l.id)}
      />
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedId(null)} />
          <div className="relative max-w-xl w-full bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-slate-900">{selected.title}</h2>
              <p className="text-sm text-slate-500">{selected.from} · {selected.date} · {selected.type}</p>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="card p-3"><p className="text-xs text-slate-500">Description</p><p className="text-sm text-slate-900">{selected.description}</p></div>
              {selected.deadline && <div className="card p-3"><p className="text-xs text-slate-500">Deadline</p><p className="text-sm text-slate-900 font-semibold">{selected.deadline}</p></div>}
              {selected.assignedTo && <div className="card p-3"><p className="text-xs text-slate-500">Assigned To</p><p className="text-sm text-slate-900">{selected.assignedTo}</p></div>}
              <div className="flex items-center gap-2"><StatusBadge status={selected.status} /></div>
              {selected.criteria && selected.criteria.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Criteria Progress</p>
                  <div className="space-y-3">
                    {selected.criteria.map((c) => (
                      <div key={c.name}>
                        <div className="flex justify-between text-sm mb-1"><span className="font-medium text-slate-900">{c.name}</span><span className="text-slate-600">{c.progress}%</span></div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${c.progress < 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${c.progress}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-2">
              <button className="btn-secondary flex-1" onClick={() => setSelectedId(null)}>Close</button>
              {selected.status === 'pending' && <button className="btn-primary flex-1" onClick={() => setSelectedId(null)}>Acknowledge</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function RegisterComplaintView() {
  const { currentUser, data, addComplaint } = useStore();
  const [form, setForm] = useState({ title: '', description: '', category: 'student-discipline' as Complaint['category'], against: '' });
  if (!currentUser) return null;
  const myComplaints = data.complaints.filter((c) => c.filedById === currentUser.id);

  const submit = () => {
    if (!form.title || !form.description) return;
    addComplaint({
      id: `cmp${Date.now()}`,
      title: form.title,
      description: form.description,
      filedBy: currentUser.name,
      filedById: currentUser.id,
      filedByRole: currentUser.role,
      departmentId: currentUser.departmentId,
      date: new Date().toISOString().slice(0, 10),
      status: 'open',
      category: form.category,
      against: form.against || undefined,
    });
    setForm({ title: '', description: '', category: 'student-discipline', against: '' });
  };

  return (
    <div>
      <PageHeader title="Register Complaint" description="File a complaint or disciplinary incident for Principal review" />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">New Complaint</h3>
          <div className="space-y-3">
            <input className="input" placeholder="Complaint title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <select className="input w-auto" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Complaint['category'] })}>
              <option value="student-discipline">Student Discipline</option>
              <option value="staff-incident">Staff Incident</option>
              <option value="facility">Facility / Equipment</option>
              <option value="academic">Academic</option>
              <option value="other">Other</option>
            </select>
            <input className="input" placeholder="Against (optional)" value={form.against} onChange={(e) => setForm({ ...form, against: e.target.value })} />
            <textarea className="input" rows={5} placeholder="Describe the incident..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button className="btn-primary" onClick={submit}><Send className="w-4 h-4" /> Submit Complaint</button>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">My Filed Complaints</h3>
          {myComplaints.length === 0 ? <p className="text-sm text-slate-400">No complaints filed yet.</p> :
          <div className="space-y-2">
            {myComplaints.map((c) => (
              <div key={c.id} className="p-3 rounded-lg bg-slate-50">
                <div className="flex justify-between"><p className="text-sm font-medium text-slate-900">{c.title}</p><StatusBadge status={c.status} /></div>
                <p className="text-xs text-slate-500">{c.date} · {c.category}</p>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </div>
  );
}
