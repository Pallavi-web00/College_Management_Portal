import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/DataTable';
import { useStore, deptName, roleLabels } from '../../store/StoreContext';
import type { Staff } from '../../data/types';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

/* Faculty Performance Details — performance-review modal for the HOD Faculty Management → Faculty
   Performance view. Opens on double-click of a faculty row. Focused on teaching performance, student
   outcomes, mentoring and professional contributions. Personal/HR details (gender, DOB, blood group,
   address) intentionally excluded — they belong to the staff profile modal. */

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</dt>
      <dd className="text-sm text-slate-900 mt-0.5">{value || '—'}</dd>
    </div>
  );
}

function MetricCard({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: string; tone?: 'emerald' | 'amber' | 'rose' }) {
  const toneCls = tone === 'emerald' ? 'text-emerald-600' : tone === 'amber' ? 'text-amber-600' : tone === 'rose' ? 'text-rose-600' : 'text-slate-900';
  return (
    <div className="card p-3 text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-lg font-bold ${toneCls}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

const SYLLABUS_ON_TRACK = { label: 'On Track', badge: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500', text: 'text-emerald-600' };
const SYLLABUS_AT_RISK = { label: 'At Risk', badge: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500', text: 'text-amber-600' };
const SYLLABUS_DELAYED = { label: 'Delayed', badge: 'bg-rose-100 text-rose-700', bar: 'bg-rose-500', text: 'text-rose-600' };

function syllabusStatus(pct: number) {
  return pct >= 85 ? SYLLABUS_ON_TRACK : pct >= 70 ? SYLLABUS_AT_RISK : SYLLABUS_DELAYED;
}

/* Overall performance status — composite of attendance (15), student feedback (25), overall
   rating (20), syllabus completion (20) and student outcomes (20). Missing components are
   excluded with weights renormalised; each pending item deducts 5 points. */
function overallPerformance(staff: Staff, avgSyllabus: number, passPct: number, hasStudentData: boolean, hasSubjects: boolean) {
  const parts: { w: number; v: number | null }[] = [
    { w: 15, v: staff.attendancePct / 100 },
    { w: 25, v: staff.feedbackScore ? staff.feedbackScore / 5 : null },
    { w: 20, v: staff.performanceRating ? staff.performanceRating / 5 : null },
    { w: 20, v: hasSubjects ? avgSyllabus / 100 : null },
    { w: 20, v: hasStudentData ? passPct / 100 : null },
  ];
  const usable = parts.filter((p) => p.v !== null);
  const totalW = usable.reduce((a, p) => a + p.w, 0) || 1;
  const score = Math.max(0, Math.round((usable.reduce((a, p) => a + (p.v ?? 0) * p.w, 0) / totalW) * 100) - staff.pendingWork * 5);
  const label = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 55 ? 'Satisfactory' : 'Needs Attention';
  const badge = score >= 85 ? 'bg-emerald-100 text-emerald-700' : score >= 70 ? 'bg-blue-100 text-blue-700' : score >= 55 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700';
  return { label, badge };
}

/* Compact trend visual for student performance (per-subject average marks) */
function TrendSparkline({ values, labels }: { values: number[]; labels: string[] }) {
  const w = 260;
  const h = 76;
  const padX = 22;
  const padTop = 18;
  const padBottom = 20;
  const xs = values.map((_, i) => padX + (i * (w - padX * 2)) / Math.max(values.length - 1, 1));
  const ys = values.map((v) => padTop + (1 - Math.min(100, Math.max(0, v)) / 100) * (h - padTop - padBottom));
  const path = values.length > 1 ? xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(' ') : '';
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
      <line x1={padX} y1={h - padBottom} x2={w - padX} y2={h - padBottom} stroke="#e2e8f0" strokeWidth="1" />
      {values.length > 1 && <path d={path} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
      {values.map((v, i) => (
        <g key={i}>
          <circle cx={xs[i]} cy={ys[i]} r="3.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
          <text x={xs[i]} y={ys[i] - 8} textAnchor="middle" fontSize="9" fontWeight="600" fill="#334155">{`${Math.round(v)}%`}</text>
          <text x={xs[i]} y={h - 5} textAnchor="middle" fontSize="8.5" fill="#94a3b8">{labels[i]}</text>
        </g>
      ))}
    </svg>
  );
}

export function FacultyPerformanceModal({ staff, open, onClose, onNavigate }: {
  staff: Staff | null;
  open: boolean;
  onClose: () => void;
  onNavigate?: (menuId: string) => void;
}) {
  const { data } = useStore();
  if (!staff) return null;

  const dept = data.departments.find((d) => d.id === staff.departmentId);
  const subjects = data.subjects.filter((s) => s.facultyId === staff.id);
  const subjectNames = new Set(subjects.map((s) => s.name));
  const avgSyllabus = subjects.length ? Math.round(subjects.reduce((a, s) => a + s.syllabusCompletion, 0) / subjects.length) : 0;

  /* Students taught — enrolled in at least one of the faculty's assigned subjects */
  const taughtStudents = data.students.filter((st) => st.subjects.some((sub) => subjectNames.has(sub)));
  const markEntries = taughtStudents.flatMap((st) => st.internalMarks.filter((m) => subjectNames.has(m.subject)));
  const avgMarksPct = markEntries.length ? Math.round(markEntries.reduce((a, m) => a + (m.marks / m.max) * 100, 0) / markEntries.length) : 0;
  const passPct = markEntries.length ? Math.round((markEntries.filter((m) => m.marks / m.max >= 0.4).length / markEntries.length) * 100) : 0;
  const assignmentCompletion = taughtStudents.length ? Math.round((taughtStudents.filter((st) => st.backlogs === 0).length / taughtStudents.length) * 100) : 0;
  const subjectAvgs = subjects.map((s) => {
    const es = markEntries.filter((m) => m.subject === s.name);
    return { code: s.code, avg: es.length ? Math.round(es.reduce((a, m) => a + (m.marks / m.max) * 100, 0) / es.length) : 0 };
  });

  /* Mentoring — mentees guided by this faculty (same link used across faculty mentoring views) */
  const mentees = data.students.filter((st) => st.projectGuide === staff.name);
  const menteeAttendance = mentees.length ? Math.round(mentees.reduce((a, m) => a + m.attendancePct, 0) / mentees.length) : 0;
  const menteeGpa = mentees.length ? (mentees.reduce((a, m) => a + m.gpa, 0) / mentees.length).toFixed(1) : '—';
  const mentoringFollowUps = mentees.filter((st) => st.attendancePct < 75 || st.backlogs > 0).length;

  /* Feedback breakdown — deterministic criteria scores around the overall feedback score */
  const seed = [...staff.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const deltas = [-0.2, 0.1, -0.1, 0.2, 0];
  const feedbackCriteria = ['Teaching Effectiveness', 'Subject Clarity', 'Doubt Resolution', 'Communication', 'Student Engagement'];
  const breakdown = feedbackCriteria.map((label, i) => ({
    label,
    value: staff.feedbackScore ? Math.round(Math.min(5, Math.max(1, staff.feedbackScore + deltas[(seed + i) % 5])) * 10) / 10 : 0,
  }));
  const responses = taughtStudents.reduce((a, st) => a + st.subjects.filter((s) => subjectNames.has(s)).length, 0);

  /* Professional contributions */
  const pubs = data.publications.filter((p) => p.facultyId === staff.id);
  const projects = data.researchProjects.filter((r) => r.facultyId === staff.id);
  const committees = data.committees.filter((c) => c.members.includes(staff.name));

  /* Actionable pending items detected from current department data */
  const pendingMarks = data.exams.filter((e) => e.facultyId === staff.id && !e.marksSubmitted);
  const behindSyllabus = subjects.filter((s) => s.syllabusCompletion < 70);
  const pendingItems: { id: string; label: string; detail: string; menu: string }[] = [
    ...pendingMarks.map((e) => ({
      id: `exam-${e.id}`,
      label: 'Internal assessment marks entry',
      detail: `${e.subject} · Sem ${e.semester}${e.marksSubmissionDeadline ? ` · due ${e.marksSubmissionDeadline}` : ''}`,
      menu: 'h-assessment-marks',
    })),
    ...behindSyllabus.map((s) => ({
      id: `syll-${s.id}`,
      label: 'Syllabus behind schedule',
      detail: `${s.code} ${s.name} · ${s.syllabusCompletion}% completed`,
      menu: 'h-syllabus',
    })),
    ...(mentoringFollowUps > 0 ? [{ id: 'mentoring-followup', label: 'Mentoring follow-up', detail: `${mentoringFollowUps} mentee${mentoringFollowUps === 1 ? '' : 's'} need attention`, menu: 'h-faculty-mgmt' }] : []),
  ];

  const overall = overallPerformance(staff, avgSyllabus, passPct, markEntries.length > 0, subjects.length > 0);

  return (
    <Modal open={open} onClose={onClose} title={staff.name} subtitle={`${staff.designation} · ${deptName(data, staff.departmentId)}`} size="lg">
      <div className="space-y-6">

        {/* 1. Faculty header */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-xl font-semibold shrink-0">
            {staff.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-slate-900">{staff.name}</h3>
            <p className="text-sm text-slate-500">{staff.designation} · {dept?.name}</p>
            <div className="mt-1.5 flex items-center gap-2 flex-wrap">
              <StatusBadge status={staff.status} />
              <span className={`badge ${overall.badge}`} title="Composite of attendance, student feedback, rating, syllabus completion, student outcomes and pending work">
                Overall: {overall.label}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Professional information */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Professional Information</h4>
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Field label="Employee ID" value={staff.id.toUpperCase()} />
            <Field label="Role" value={roleLabels[staff.role]} />
            <Field label="Department" value={dept?.name} />
            <Field label="Email" value={staff.email} />
            <Field label="Phone" value={staff.phone} />
            <Field label="Qualifications" value={staff.qualifications} />
            <Field label="Employment Type" value={<span className="capitalize">{staff.employmentType}</span>} />
            <Field label="Joined On" value={staff.joinedOn} />
            <Field label="Weekly Hours" value={`${staff.weeklyHours} hrs`} />
          </dl>
        </div>

        {/* 3. Performance overview */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Performance Overview</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard label="Attendance" value={`${staff.attendancePct}%`} tone={staff.attendancePct >= 90 ? 'emerald' : staff.attendancePct >= 80 ? 'amber' : 'rose'} />
            <MetricCard label="Student Feedback" value={staff.feedbackScore ? `${staff.feedbackScore} / 5` : '—'} />
            <MetricCard label="Overall Rating" value={staff.performanceRating ? `${staff.performanceRating} / 5` : '—'} />
            <MetricCard label="Pending Work" value={staff.pendingWork} tone={staff.pendingWork > 0 ? 'amber' : 'emerald'} />
          </div>
        </div>

        {/* 4. Teaching & syllabus progress */}
        {subjects.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Teaching & Syllabus Progress</h4>
            <div className="space-y-2">
              {subjects.map((s) => {
                const c = syllabusStatus(s.syllabusCompletion);
                return (
                  <div key={s.id} className="card p-3">
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900">{s.name}</p>
                        <p className="text-xs text-slate-500">{s.code} · Sem-{s.semester}{s.classes.length ? ` · ${s.classes.join(', ')}` : ''}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-semibold ${c.text}`}>{s.syllabusCompletion}%</p>
                        <span className={`badge ${c.badge} mt-0.5`}>{c.label}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${s.syllabusCompletion}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 card p-3 flex items-center justify-between bg-slate-50">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Average Syllabus Completion</p>
              <p className="text-lg font-bold text-slate-900">{avgSyllabus}%</p>
            </div>
          </div>
        )}

        {/* 5. Student performance */}
        {taughtStudents.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Student Performance</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <MetricCard label="Average Student Marks" value={`${avgMarksPct}%`} sub="internal assessments" />
              <MetricCard label="Pass Percentage" value={`${passPct}%`} tone={passPct >= 85 ? 'emerald' : passPct >= 70 ? 'amber' : 'rose'} sub="marks ≥ 40% of max" />
              <MetricCard label="Assignment Completion" value={`${assignmentCompletion}%`} tone={assignmentCompletion >= 85 ? 'emerald' : assignmentCompletion >= 70 ? 'amber' : 'rose'} sub="students with no backlogs" />
            </div>
            {subjectAvgs.length > 1 && (
              <div className="card p-4 mt-3">
                <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                  <p className="text-xs font-semibold text-slate-900">Student Performance Trend</p>
                  <p className="text-xs text-slate-400">Average marks by assigned subject</p>
                </div>
                <TrendSparkline values={subjectAvgs.map((s) => s.avg)} labels={subjectAvgs.map((s) => s.code)} />
              </div>
            )}
          </div>
        )}

        {/* 6. Mentoring performance */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Mentoring Performance</h4>
          {mentees.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MetricCard label="Total Mentees" value={mentees.length} />
              <MetricCard label="Avg Mentee Attendance" value={`${menteeAttendance}%`} tone={menteeAttendance >= 75 ? 'emerald' : 'rose'} />
              <MetricCard label="Avg Mentee Performance" value={menteeGpa === '—' ? '—' : `${menteeGpa} / 10`} sub="average GPA" />
              <MetricCard label="Pending Mentoring Activities" value={mentoringFollowUps} tone={mentoringFollowUps > 0 ? 'amber' : 'emerald'} sub="mentees needing follow-up" />
            </div>
          ) : (
            <div className="card p-4 text-sm text-slate-500">No mentees currently assigned to this faculty.</div>
          )}
        </div>

        {/* 7. Student feedback */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Student Feedback</h4>
          <div className="card p-4">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div className="flex items-baseline gap-2">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Overall Feedback</p>
                <p className="text-lg font-bold text-slate-900">{staff.feedbackScore ? `${staff.feedbackScore} / 5` : '—'}</p>
              </div>
              {responses > 0 && <p className="text-xs text-slate-400">Based on {responses} student response{responses === 1 ? '' : 's'}</p>}
            </div>
            <div className="space-y-2.5">
              {breakdown.map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                  <p className="text-xs text-slate-600 w-44 shrink-0">{b.label}</p>
                  <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(b.value / 5) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-900 w-9 text-right">{b.value ? b.value.toFixed(1) : '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 8. Research & professional contributions */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Research & Professional Contributions</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="card p-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Publications ({pubs.length})</p>
              {pubs.length > 0 ? (
                <div className="space-y-2">
                  {pubs.map((p) => (
                    <div key={p.id}>
                      <p className="text-sm font-medium text-slate-900">{p.title}</p>
                      <p className="text-xs text-slate-500">{p.journal} · {p.year} · <span className="capitalize">{p.type}</span></p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No publication records.</p>
              )}
            </div>
            <div className="card p-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Research Projects ({projects.length})</p>
              {projects.length > 0 ? (
                <div className="space-y-2">
                  {projects.map((r) => (
                    <div key={r.id}>
                      <p className="text-sm font-medium text-slate-900">{r.title}</p>
                      <p className="text-xs text-slate-500">{r.fundingAgency} · ₹{r.amount.toLocaleString('en-IN')}</p>
                      <div className="mt-1"><StatusBadge status={r.status} /></div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No funded projects.</p>
              )}
            </div>
            <div className="card p-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">FDPs / Workshops</p>
              <p className="text-xs text-slate-400">No FDP or workshop records.</p>
            </div>
            <div className="card p-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Committee Responsibilities ({committees.length})</p>
              {committees.length > 0 ? (
                <div className="space-y-2">
                  {committees.map((c) => (
                    <div key={c.id}>
                      <p className="text-sm font-medium text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-500"><span className="capitalize">{c.type}</span> · Meets {c.meetingDate}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No committee assignments.</p>
              )}
            </div>
          </div>
        </div>

        {/* 9. Pending work — actionable */}
        {(pendingItems.length > 0 || staff.pendingWork > 0) && (
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Pending Work</h4>
            {pendingItems.length > 0 ? (
              <>
                <p className="text-xs text-slate-500 mb-2">
                  <span className="badge bg-amber-100 text-amber-700 mr-2">{pendingItems.length} pending</span>
                  Detected from current department data
                </p>
                <div className="card divide-y divide-slate-100">
                  {pendingItems.map((item) => {
                    const clickable = !!onNavigate;
                    const content = (
                      <>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.detail}</p>
                        </div>
                        {clickable && (
                          <span className="text-xs font-medium text-blue-600 inline-flex items-center gap-1 shrink-0">
                            Open <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </>
                    );
                    return clickable ? (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onNavigate?.(item.menu)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        {content}
                      </button>
                    ) : (
                      <div key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">{content}</div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="card p-4 text-sm text-slate-500">
                {staff.pendingWork} pending task{staff.pendingWork === 1 ? '' : 's'} — details not yet updated by the faculty.
              </div>
            )}
          </div>
        )}

      </div>
    </Modal>
  );
}