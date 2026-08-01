import { useStore, deptName, staffName, roleLabels } from '../../store/StoreContext';
import { PageHeader } from '../../components/PageHeader';
import { StatCard } from '../../components/StatCard';
import { DataTable, StatusBadge } from '../../components/DataTable';
import { Placeholder, InboxView, RegisterComplaintView } from '../../components/SharedViews';
import { Modal } from '../../components/Modal';
import { BookOpen, GraduationCap, FlaskConical, ScrollText, Users, Calendar, Award, FileCheck, FileText, Beaker, Users2, Send, Plus, CheckSquare, XCircle, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import type { Student, PhdScholar, Policy } from '../../data/types';
import { StudentDetailModal } from '../../components/DetailModals';

export function TeachingDashboard({ activeMenu }: { activeMenu: string }) {
  const { currentUser } = useStore();
  if (!currentUser) return null;
  const role = currentUser.role;

  if (activeMenu.endsWith('-timetable')) return <MyTimetable />;
  if (activeMenu.endsWith('-class')) return <MyClass />;
  if (activeMenu.endsWith('-inbox')) return <InboxView recipientRole={role} recipientName={currentUser.name} />;
  if (activeMenu.endsWith('-complaint')) return <RegisterComplaintView />;

  if (role === 'professor') {
    switch (activeMenu) {
      case 'pf-teaching': return <AdvancedTeaching />;
      case 'pf-phd': return <PhdGuidance />;
      case 'pf-research': return <ResearchLeadership />;
      case 'pf-policy': return <PolicyInput />;
    }
  }
  if (role === 'associate-professor') {
    switch (activeMenu) {
      case 'ap-teaching': return <TeachingView />;
      case 'ap-research': return <ResearchSupervision />;
      case 'ap-committee': return <CommitteeWork />;
    }
  }
  if (role === 'assistant-professor') {
    switch (activeMenu) {
      case 'as-teaching': return <CoreTeaching />;
      case 'as-mentoring': return <MentoringView />;
      case 'as-research': return <ResearchProfile />;
    }
  }
  if (role === 'lecturer') {
    switch (activeMenu) {
      case 'lc-teaching': return <UndergradTeaching />;
      case 'lc-lab': return <LabSupervision />;
    }
  }
  if (role === 'teaching-assistant') {
    switch (activeMenu) {
      case 'ta-lab': return <TaLab />;
      case 'ta-tutorial': return <Tutorials />;
      case 'ta-grading': return <Grading />;
      case 'ta-research': return <ResearchSupport />;
    }
  }
  return <TeachingHome />;
}

function TeachingHome() {
  const { currentUser, data } = useStore();
  if (!currentUser) return null;
  const subs = data.subjects.filter((s) => s.facultyId === currentUser.id);
  const avgCompletion = subs.length ? Math.round(subs.reduce((a, s) => a + s.syllabusCompletion, 0) / subs.length) : 0;
  return (
    <div>
      <PageHeader title={`${currentUser.designation} Dashboard`} description={`${currentUser.name} · ${deptName(data, currentUser.departmentId)}`} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="My Subjects" value={subs.length} icon={<BookOpen className="w-5 h-5" />} accent="blue" />
        <StatCard label="My Classes" value={currentUser.classes.length} icon={<Users className="w-5 h-5" />} accent="indigo" />
        <StatCard label="Weekly Hours" value={currentUser.weeklyHours} icon={<Calendar className="w-5 h-5" />} accent="slate" />
        <StatCard label="Syllabus Done" value={`${avgCompletion}%`} icon={<Award className="w-5 h-5" />} accent={avgCompletion < 75 ? 'amber' : 'emerald'} />
      </div>
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">My Subjects</h3>
        <div className="space-y-3">
          {subs.length === 0 ? <p className="text-sm text-slate-400">No subjects assigned yet. Subjects will appear here once allocated by the HOD.</p> :
          subs.map((s) => (
            <div key={s.id}>
              <div className="flex justify-between text-sm mb-1"><span className="font-medium text-slate-900">{s.name} ({s.code})</span><span className="text-slate-600">{s.syllabusCompletion}%</span></div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${s.syllabusCompletion < 70 ? 'bg-rose-500' : s.syllabusCompletion < 85 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${s.syllabusCompletion}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MyTimetable() {
  const { currentUser, data } = useStore();
  if (!currentUser) return null;
  const entries = data.timetable.filter((t) => t.facultyId === currentUser.id && t.published);
  return (
    <div>
      <PageHeader title="My Timetable" description="Your published teaching schedule" />
      {entries.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-4"><Calendar className="w-7 h-7 text-slate-400" /></div>
          <p className="text-sm font-medium text-slate-900">No published timetable yet</p>
          <p className="text-xs text-slate-500 mt-1">Your timetable will appear here once the HOD creates and publishes it.</p>
        </div>
      ) : (
        <DataTable
          rows={entries}
          columns={[
            { key: 'day', header: 'Day' },
            { key: 'slot', header: 'Time' },
            { key: 'subject', header: 'Subject' },
            { key: 'room', header: 'Room' },
            { key: 'section', header: 'Class', render: (t) => `${t.section} · Sem ${t.semester}` },
            { key: 'isLab', header: 'Type', render: (t) => t.isLab ? <span className="badge bg-blue-100 text-blue-700">Lab</span> : <span className="badge bg-slate-100 text-slate-600">Theory</span> },
          ]}
        />
      )}
    </div>
  );
}

function MyClass() {
  const { currentUser, data } = useStore();
  const [selected, setSelected] = useState<Student | null>(null);
  if (!currentUser) return null;
  const myTimetable = data.timetable.filter((t) => t.facultyId === currentUser.id && t.published);
  const myClassCodes = [...new Set(myTimetable.map((t) => `${t.section} Sem ${t.semester}`))];
  const myStudents = data.students.filter((s) => s.departmentId === currentUser.departmentId && myClassCodes.some((c) => c.includes(`Sem ${s.semester}`) && c.startsWith(s.section)));
  return (
    <div>
      <PageHeader title="My Class" description="Students in your assigned classes (from published timetable)" />
      {myTimetable.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-4"><Users className="w-7 h-7 text-slate-400" /></div>
          <p className="text-sm font-medium text-slate-900">No classes assigned yet</p>
          <p className="text-xs text-slate-500 mt-1">Your class lists will appear here once the HOD publishes a timetable assigning you to classes.</p>
        </div>
      ) : (
        <>
          <div className="card p-4 mb-4">
            <p className="text-xs text-slate-500 mb-2">Your Classes (from published timetable)</p>
            <div className="flex flex-wrap gap-2">{myClassCodes.map((c) => <span key={c} className="badge bg-blue-100 text-blue-700">{c}</span>)}</div>
          </div>
          <DataTable
            rows={myStudents}
            columns={[
              { key: 'name', header: 'Name', render: (s) => <span className="font-medium text-slate-900">{s.name}</span> },
              { key: 'rollNo', header: 'Roll No' },
              { key: 'semester', header: 'Sem' },
              { key: 'section', header: 'Section' },
              { key: 'attendancePct', header: 'Attendance', render: (s) => `${s.attendancePct}%` },
              { key: 'gpa', header: 'GPA' },
            ]}
            onRowDoubleClick={(s) => setSelected(s)}
          />
          <p className="text-xs text-slate-400 mt-3">Double-click a student to view full profile.</p>
          <StudentDetailModal student={selected} open={!!selected} onClose={() => setSelected(null)} />
        </>
      )}
    </div>
  );
}

function AdvancedTeaching() {
  const { currentUser, data } = useStore();
  if (!currentUser) return null;
  const subs = data.subjects.filter((s) => s.facultyId === currentUser.id);
  return (
    <div>
      <PageHeader title="Advanced Teaching" description="Postgraduate and advanced course management" />
      <DataTable
        rows={subs}
        columns={[
          { key: 'name', header: 'Course', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'code', header: 'Code' },
          { key: 'semester', header: 'Sem' },
          { key: 'syllabusCompletion', header: 'Completion', render: (s) => `${s.syllabusCompletion}%` },
        ]}
      />
    </div>
  );
}

function PhdGuidance() {
  const { data } = useStore();
  const [selected, setSelected] = useState<PhdScholar | null>(null);
  const scholars = data.scholars;
  return (
    <div>
      <PageHeader title="PhD Guidance" description="Supervise PhD scholars — double-click a scholar to view full details" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Scholars" value={scholars.length} icon={<GraduationCap className="w-5 h-5" />} accent="blue" />
        <StatCard label="Active" value={scholars.filter((s) => s.status === 'active').length} icon={<Users className="w-5 h-5" />} accent="emerald" />
        <StatCard label="Submitted" value={scholars.filter((s) => s.status === 'submitted').length} icon={<FileCheck className="w-5 h-5" />} accent="amber" />
        <StatCard label="Avg Progress" value={`${Math.round(scholars.reduce((a, s) => a + s.progress, 0) / scholars.length)}%`} icon={<Award className="w-5 h-5" />} accent="indigo" />
      </div>
      <DataTable
        rows={scholars}
        columns={[
          { key: 'name', header: 'Scholar', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'topic', header: 'Research Topic' },
          { key: 'year', header: 'Year' },
          { key: 'milestone', header: 'Current Milestone' },
          { key: 'progress', header: 'Progress', render: (s) => (
            <div className="flex items-center gap-2"><div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${s.progress}%` }} /></div><span className="text-xs">{s.progress}%</span></div>
          ) },
          { key: 'status', header: 'Status', render: (s) => <StatusBadge status={s.status} /> },
        ]}
        onRowDoubleClick={(s) => setSelected(s)}
      />
      <p className="text-xs text-slate-400 mt-3">Double-click a scholar to view full details.</p>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} subtitle={selected?.topic} size="md">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center text-lg font-semibold">{selected.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}</div>
              <div><h3 className="text-lg font-semibold text-slate-900">{selected.name}</h3><p className="text-sm text-slate-500">Year {selected.year} · {selected.milestone}</p><div className="mt-1"><StatusBadge status={selected.status} /></div></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div><dt className="text-xs text-slate-500 uppercase">Start Date</dt><dd className="text-sm text-slate-900 mt-0.5">{selected.startDate}</dd></div>
              <div><dt className="text-xs text-slate-500 uppercase">Year</dt><dd className="text-sm text-slate-900 mt-0.5">Year {selected.year}</dd></div>
              <div><dt className="text-xs text-slate-500 uppercase">Supervisor</dt><dd className="text-sm text-slate-900 mt-0.5">{selected.supervisor}</dd></div>
              <div><dt className="text-xs text-slate-500 uppercase">Qualification</dt><dd className="text-sm text-slate-900 mt-0.5">{selected.qualification}</dd></div>
              <div><dt className="text-xs text-slate-500 uppercase">Publications</dt><dd className="text-sm text-slate-900 mt-0.5">{selected.publications}</dd></div>
              <div><dt className="text-xs text-slate-500 uppercase">Current Milestone</dt><dd className="text-sm text-slate-900 mt-0.5">{selected.milestone}</dd></div>
            </div>
            <div className="card p-4"><p className="text-xs text-slate-500 uppercase mb-1">Research Topic</p><p className="text-sm text-slate-900">{selected.topic}</p></div>
            <div className="card p-4"><p className="text-xs text-slate-500 uppercase mb-1">Background</p><p className="text-sm text-slate-900">{selected.background}</p></div>
            <div>
              <p className="text-xs text-slate-500 uppercase mb-2">Progress</p>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${selected.progress}%` }} /></div>
              <p className="text-xs text-slate-500 mt-1">{selected.progress}% complete</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function ResearchLeadership() {
  const { currentUser, data } = useStore();
  if (!currentUser) return null;
  const pubs = data.publications.filter((p) => p.facultyId === currentUser.id);
  const projects = data.researchProjects.filter((r) => r.facultyId === currentUser.id);
  return (
    <div>
      <PageHeader title="Research Leadership" description="Departmental research, funded projects, and publications" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Publications" value={pubs.length} icon={<FileText className="w-5 h-5" />} accent="indigo" />
        <StatCard label="Funded Projects" value={projects.length} icon={<FlaskConical className="w-5 h-5" />} accent="blue" />
        <StatCard label="Ongoing" value={projects.filter((r) => r.status === 'ongoing').length} icon={<FlaskConical className="w-5 h-5" />} accent="amber" />
        <StatCard label="Completed" value={projects.filter((r) => r.status === 'completed').length} icon={<FileCheck className="w-5 h-5" />} accent="emerald" />
      </div>
      <DataTable
        rows={pubs}
        columns={[
          { key: 'title', header: 'Title', render: (p) => <span className="font-medium">{p.title}</span> },
          { key: 'type', header: 'Type', render: (p) => <span className="badge bg-slate-100 text-slate-700 capitalize">{p.type}</span> },
          { key: 'journal', header: 'Venue' },
          { key: 'year', header: 'Year' },
        ]}
      />
    </div>
  );
}

function PolicyInput() {
  const { data, addPolicy, updatePolicy } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Academic', description: '', recommendations: '' });
  const policies = data.policies;

  const submit = () => {
    if (!form.title || !form.description) return;
    addPolicy({ id: `pol${Date.now()}`, title: form.title, category: form.category, status: 'under-review', submittedBy: 'Dr. Priya Sharma', date: new Date().toISOString().slice(0, 10), description: form.description, recommendations: form.recommendations });
    setShowForm(false);
    setForm({ title: '', category: 'Academic', description: '', recommendations: '' });
  };

  return (
    <div>
      <PageHeader title="Policy Input" description="Review academic policies, submit recommendations, and participate in policy discussions" action={<button className="btn-primary" onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> Submit Policy Recommendation</button>} />
      {showForm && (
        <div className="card p-5 mb-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">New Policy Recommendation</h3>
          <div className="space-y-3">
            <input className="input" placeholder="Policy title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <select className="input w-auto" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Academic</option><option>Research</option><option>Student Welfare</option><option>Faculty</option><option>Administration</option></select>
            <textarea className="input" rows={3} placeholder="Policy description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <textarea className="input" rows={3} placeholder="Recommendations..." value={form.recommendations} onChange={(e) => setForm({ ...form, recommendations: e.target.value })} />
            <button className="btn-primary" onClick={submit}><Send className="w-4 h-4" /> Submit for Review</button>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {policies.map((p) => (
          <div key={p.id} className="card p-5">
            <div className="flex items-start justify-between mb-2">
              <div><h3 className="text-sm font-semibold text-slate-900">{p.title}</h3><p className="text-xs text-slate-500">{p.category} · Submitted by {p.submittedBy} · {p.date}</p></div>
              <StatusBadge status={p.status} />
            </div>
            <p className="text-sm text-slate-700 mb-2">{p.description}</p>
            {p.recommendations && <div className="p-3 rounded-lg bg-slate-50"><p className="text-xs text-slate-500 mb-1">Recommendations</p><p className="text-sm text-slate-700">{p.recommendations}</p></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TeachingView() {
  const { currentUser, data } = useStore();
  if (!currentUser) return null;
  const subs = data.subjects.filter((s) => s.facultyId === currentUser.id);
  return (
    <div>
      <PageHeader title="Teaching" description="Assigned subjects, schedule, and course progress" />
      <DataTable
        rows={subs}
        columns={[
          { key: 'name', header: 'Subject', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'code', header: 'Code' },
          { key: 'semester', header: 'Sem' },
          { key: 'classes', header: 'Classes', render: (s) => s.classes.join(', ') },
          { key: 'syllabusCompletion', header: 'Progress', render: (s) => `${s.syllabusCompletion}%` },
        ]}
      />
    </div>
  );
}

function ResearchSupervision() {
  const { data } = useStore();
  const scholars = [
    { id: 'ms1', name: 'Karthik S', level: 'PhD', topic: 'Edge Computing Optimization', progress: 60, status: 'active' },
    { id: 'ms2', name: 'Divya R', level: 'Masters', topic: 'IoT Security Framework', progress: 75, status: 'active' },
  ];
  return (
    <div>
      <PageHeader title="Research Supervision" description="Master's and PhD dissertation supervision" />
      <DataTable
        rows={scholars}
        columns={[
          { key: 'name', header: 'Scholar', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'level', header: 'Level' },
          { key: 'topic', header: 'Topic' },
          { key: 'progress', header: 'Progress', render: (s) => (
            <div className="flex items-center gap-2"><div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${s.progress}%` }} /></div><span className="text-xs">{s.progress}%</span></div>
          ) },
          { key: 'status', header: 'Status', render: (s) => <StatusBadge status={s.status} /> },
        ]}
      />
    </div>
  );
}

function CommitteeWork() {
  const committees = [
    { id: 'cm1', name: 'Academic Council', role: 'Member', nextMeeting: '2026-08-01' },
    { id: 'cm2', name: 'Research Committee', role: 'Chair', nextMeeting: '2026-07-28' },
    { id: 'cm3', name: 'Curriculum Review', role: 'Member', nextMeeting: '2026-08-10' },
  ];
  return (
    <div>
      <PageHeader title="Committee Work" description="Committee memberships and meeting schedules" />
      <DataTable
        rows={committees}
        columns={[
          { key: 'name', header: 'Committee', render: (c) => <span className="font-medium">{c.name}</span> },
          { key: 'role', header: 'Role' },
          { key: 'nextMeeting', header: 'Next Meeting' },
        ]}
      />
    </div>
  );
}

function CoreTeaching() {
  const { currentUser, data } = useStore();
  if (!currentUser) return null;
  const subs = data.subjects.filter((s) => s.facultyId === currentUser.id);
  return (
    <div>
      <PageHeader title="Core Teaching Load" description="Assigned teaching hours, subjects, and weekly workload" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Weekly Hours" value={currentUser.weeklyHours} icon={<Calendar className="w-5 h-5" />} accent="slate" />
        <StatCard label="Subjects" value={subs.length} icon={<BookOpen className="w-5 h-5" />} accent="blue" />
        <StatCard label="Classes" value={currentUser.classes.length} icon={<Users className="w-5 h-5" />} accent="indigo" />
      </div>
      <DataTable
        rows={subs}
        columns={[
          { key: 'name', header: 'Subject', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'code', header: 'Code' },
          { key: 'semester', header: 'Sem' },
          { key: 'syllabusCompletion', header: 'Progress', render: (s) => `${s.syllabusCompletion}%` },
        ]}
      />
    </div>
  );
}

function MentoringView() {
  const { currentUser, data } = useStore();
  if (!currentUser) return null;
  const mentees = data.students.filter((s) => s.projectGuide === currentUser.name || s.departmentId === currentUser.departmentId).slice(0, 6);
  return (
    <div>
      <PageHeader title="Mentoring" description="Assigned mentee students and mentoring sessions" />
      <DataTable
        rows={mentees}
        columns={[
          { key: 'name', header: 'Mentee', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'rollNo', header: 'Roll No' },
          { key: 'semester', header: 'Sem' },
          { key: 'gpa', header: 'GPA' },
          { key: 'attendancePct', header: 'Attendance' },
        ]}
      />
    </div>
  );
}

function ResearchProfile() {
  const { currentUser, data } = useStore();
  if (!currentUser) return null;
  const pubs = data.publications.filter((p) => p.facultyId === currentUser.id);
  return (
    <div>
      <PageHeader title="Research Profile" description="Publications, conferences, projects, and grants" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Publications" value={currentUser.publications} icon={<FileText className="w-5 h-5" />} accent="indigo" />
        <StatCard label="Projects" value={currentUser.researchProjects} icon={<FlaskConical className="w-5 h-5" />} accent="blue" />
        <StatCard label="Conferences" value={2} icon={<Users2 className="w-5 h-5" />} accent="emerald" />
        <StatCard label="Grants" value={currentUser.researchProjects > 0 ? 1 : 0} icon={<Award className="w-5 h-5" />} accent="amber" />
      </div>
      <DataTable
        rows={pubs}
        columns={[
          { key: 'title', header: 'Title', render: (p) => <span className="font-medium">{p.title}</span> },
          { key: 'type', header: 'Type', render: (p) => <span className="badge bg-slate-100 text-slate-700 capitalize">{p.type}</span> },
          { key: 'journal', header: 'Venue' },
          { key: 'year', header: 'Year' },
        ]}
      />
    </div>
  );
}

function UndergradTeaching() {
  return <TeachingView />;
}

function LabSupervision() {
  const { currentUser, data } = useStore();
  if (!currentUser) return null;
  const labs = data.labs.filter((l) => l.inChargeId === currentUser.id || l.departmentId === currentUser.departmentId);
  return (
    <div>
      <PageHeader title="Lab Supervision" description="Laboratory sessions, batches, and experiment tracking" />
      <DataTable
        rows={labs}
        columns={[
          { key: 'name', header: 'Lab', render: (l) => <span className="font-medium">{l.name}</span> },
          { key: 'capacity', header: 'Capacity' },
          { key: 'systems', header: 'Systems' },
          { key: 'subjects', header: 'Subjects', render: (l) => l.subjects.join(', ') },
          { key: 'maintenanceStatus', header: 'Status', render: (l) => <StatusBadge status={l.maintenanceStatus} /> },
        ]}
      />
    </div>
  );
}

function TaLab() {
  return <LabSupervision />;
}

function Tutorials() {
  const tutorials = [
    { id: 't1', group: 'CSE-A Sem-3', subject: 'Data Structures', schedule: 'Wed 14:00-15:00', students: 30, attendance: 92 },
    { id: 't2', group: 'CSE-A Sem-2', subject: 'Python Programming', schedule: 'Fri 15:00-16:00', students: 28, attendance: 88 },
  ];
  return (
    <div>
      <PageHeader title="Tutorials" description="Tutorial schedules, attendance, and materials" />
      <DataTable
        rows={tutorials}
        columns={[
          { key: 'group', header: 'Group' },
          { key: 'subject', header: 'Subject', render: (t) => <span className="font-medium">{t.subject}</span> },
          { key: 'schedule', header: 'Schedule' },
          { key: 'students', header: 'Students' },
          { key: 'attendance', header: 'Attendance', render: (t) => `${t.attendance}%` },
        ]}
      />
    </div>
  );
}

function Grading() {
  const { currentUser, data } = useStore();
  if (!currentUser) return null;
  const students = data.students.filter((s) => s.departmentId === currentUser.departmentId).slice(0, 8);
  return (
    <div>
      <PageHeader title="Grading" description="Evaluate assignments and enter marks" />
      <DataTable
        rows={students}
        columns={[
          { key: 'name', header: 'Student', render: (s) => <span className="font-medium">{s.name}</span> },
          { key: 'rollNo', header: 'Roll No' },
          { key: 'internalMarks', header: 'Marks Entered', render: (s) => s.internalMarks.length },
          { key: 'status', header: 'Status', render: () => <StatusBadge status="completed" /> },
        ]}
      />
    </div>
  );
}

function ResearchSupport() {
  const { currentUser, data } = useStore();
  if (!currentUser) return null;
  const tasks = [
    { id: 'rs1', title: 'Literature Review - Blockchain Consensus', faculty: 'Dr. Priya Sharma', status: 'in-progress', deadline: '2026-07-30', description: 'Collect and summarize recent papers on consensus mechanisms for the funded project on academic credentialing.' },
    { id: 'rs2', title: 'Data Collection - Federated Learning', faculty: 'Dr. Priya Sharma', status: 'in-progress', deadline: '2026-08-15', description: 'Assist with dataset preparation and preprocessing for the federated learning privacy experiments.' },
    { id: 'rs3', title: 'Documentation - ZKP Systems', faculty: 'Dr. Priya Sharma', status: 'completed', deadline: '2026-07-10', description: 'Prepare documentation for the zero-knowledge proof system implementation.' },
    { id: 'rs4', title: 'Experiment Setup - Edge Computing', faculty: 'Dr. Arjun Nair', status: 'pending', deadline: '2026-08-01', description: 'Set up benchmarking environment for edge computing optimization experiments.' },
  ];
  return (
    <div>
      <PageHeader title="Research Support" description="Assist faculty with research data collection, documentation, literature reviews, and project tasks" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Tasks" value={tasks.length} icon={<ClipboardCheck className="w-5 h-5" />} accent="blue" />
        <StatCard label="In Progress" value={tasks.filter((t) => t.status === 'in-progress').length} icon={<FlaskConical className="w-5 h-5" />} accent="amber" />
        <StatCard label="Completed" value={tasks.filter((t) => t.status === 'completed').length} icon={<CheckSquare className="w-5 h-5" />} accent="emerald" />
        <StatCard label="Pending" value={tasks.filter((t) => t.status === 'pending').length} icon={<FileText className="w-5 h-5" />} accent="rose" />
      </div>
      <div className="space-y-3">
        {tasks.map((t) => (
          <div key={t.id} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <div><h3 className="text-sm font-semibold text-slate-900">{t.title}</h3><p className="text-xs text-slate-500">Assigned by {t.faculty} · Deadline: {t.deadline}</p></div>
              <StatusBadge status={t.status} />
            </div>
            <p className="text-sm text-slate-700">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
