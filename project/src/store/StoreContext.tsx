import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AppData, Role, Staff, Student, ApprovalRequest, Grievance, Message, TimetableEntry, Notification, Policy, Complaint, NonTeachingTask } from '../data/types';
import { sampleData } from '../data/sampleData';

interface StoreContextValue {
  data: AppData;
  currentUser: Staff | null;
  login: (staffId: string) => void;
  logout: () => void;
  updateStudent: (id: string, patch: Partial<Student>) => void;
  updateStaff: (id: string, patch: Partial<Staff>) => void;
  updateApproval: (id: string, patch: Partial<ApprovalRequest>) => void;
  updateGrievance: (id: string, patch: Partial<Grievance>) => void;
  addGrievance: (g: Grievance) => void;
  markNotificationRead: (id: string) => void;
  notifications: AppData['notifications'];
  sendMessage: (m: Message) => void;
  markMessageRead: (id: string) => void;
  messages: AppData['messages'];
  updateTimetableEntry: (id: string, patch: Partial<TimetableEntry>) => void;
  addTimetableEntry: (t: TimetableEntry) => void;
  publishTimetable: (deptId: string, section: string, semester: number) => void;
  submitTimetableForApproval: (approvalId: string) => void;
  addNotification: (n: Notification) => void;
  addPolicy: (p: Policy) => void;
  updatePolicy: (id: string, patch: Partial<Policy>) => void;
  addComplaint: (c: Complaint) => void;
  updateComplaint: (id: string, patch: Partial<Complaint>) => void;
  updateNonTeachingTask: (id: string, patch: Partial<NonTeachingTask>) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(sampleData);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const currentUser = useMemo(
    () => data.staff.find((s) => s.id === currentUserId) ?? null,
    [data.staff, currentUserId]
  );

  const value: StoreContextValue = {
    data,
    currentUser,
    login: (id) => setCurrentUserId(id),
    logout: () => setCurrentUserId(null),
    updateStudent: (id, patch) =>
      setData((d) => ({ ...d, students: d.students.map((s) => (s.id === id ? { ...s, ...patch } : s)) })),
    updateStaff: (id, patch) =>
      setData((d) => ({ ...d, staff: d.staff.map((s) => (s.id === id ? { ...s, ...patch } : s)) })),
    updateApproval: (id, patch) =>
      setData((d) => ({ ...d, approvals: d.approvals.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),
    updateGrievance: (id, patch) =>
      setData((d) => ({ ...d, grievances: d.grievances.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
    addGrievance: (g) => setData((d) => ({ ...d, grievances: [g, ...d.grievances] })),
    markNotificationRead: (id) =>
      setData((d) => ({ ...d, notifications: d.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
    notifications: data.notifications,
    sendMessage: (m) => setData((d) => ({ ...d, messages: [m, ...d.messages] })),
    markMessageRead: (id) =>
      setData((d) => ({ ...d, messages: d.messages.map((m) => (m.id === id ? { ...m, read: true } : m)) })),
    messages: data.messages,
    updateTimetableEntry: (id, patch) =>
      setData((d) => ({ ...d, timetable: d.timetable.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
    addTimetableEntry: (t) => setData((d) => ({ ...d, timetable: [...d.timetable, t] })),
    publishTimetable: (deptId, section, semester) =>
      setData((d) => ({ ...d, timetable: d.timetable.map((t) => (t.departmentId === deptId && t.section === section && t.semester === semester ? { ...t, published: true } : t)) })),
    submitTimetableForApproval: (approvalId) =>
      setData((d) => ({
        ...d,
        approvals: d.approvals.map((a) => (a.id === approvalId ? { ...a, status: 'pending' as const } : a)),
        notifications: [
          { id: `n${Date.now()}`, title: 'Timetable submitted for approval', message: `${d.approvals.find((a) => a.id === approvalId)?.title ?? 'Timetable'} submitted to Principal`, date: new Date().toISOString().slice(0, 10), audience: ['principal'] as Role[], read: false },
          ...d.notifications,
        ],
      })),
    addNotification: (n) => setData((d) => ({ ...d, notifications: [n, ...d.notifications] })),
    addPolicy: (p) => setData((d) => ({ ...d, policies: [p, ...d.policies] })),
    updatePolicy: (id, patch) =>
      setData((d) => ({ ...d, policies: d.policies.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
    addComplaint: (c) => setData((d) => ({ ...d, complaints: [c, ...d.complaints] })),
    updateComplaint: (id, patch) =>
      setData((d) => ({ ...d, complaints: d.complaints.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
    updateNonTeachingTask: (id, patch) =>
      setData((d) => ({ ...d, nonTeachingTasks: d.nonTeachingTasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export const roleLabels: Record<Role, string> = {
  principal: 'Principal',
  dean: 'Dean',
  hod: 'Head of Department',
  professor: 'Professor',
  'associate-professor': 'Associate Professor',
  'assistant-professor': 'Assistant Professor',
  lecturer: 'Lecturer / Instructor',
  'teaching-assistant': 'Teaching Assistant',
  'office-superintendent': 'Office Superintendent',
  'lab-assistant': 'Lab Assistant / Technician',
};

export function deptName(data: AppData, id: string) {
  return data.departments.find((d) => d.id === id)?.name ?? '—';
}
export function deptCode(data: AppData, id: string) {
  return data.departments.find((d) => d.id === id)?.code ?? '—';
}
export function staffName(data: AppData, id: string) {
  return data.staff.find((s) => s.id === id)?.name ?? '—';
}
