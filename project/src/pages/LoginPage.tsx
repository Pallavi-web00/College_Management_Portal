import { useState } from 'react';
import { GraduationCap, ChevronRight, Shield, Users, BookOpen, FlaskConical, Wrench } from 'lucide-react';
import { useStore, roleLabels } from '../store/StoreContext';
import type { Role } from '../data/types';

const roleGroups: { group: string; icon: React.ReactNode; roles: Role[] }[] = [
  { group: 'Leadership', icon: <Shield className="w-4 h-4" />, roles: ['principal', 'dean'] },
  { group: 'Department Head', icon: <Users className="w-4 h-4" />, roles: ['hod'] },
  { group: 'Teaching Staff', icon: <BookOpen className="w-4 h-4" />, roles: ['professor', 'associate-professor', 'assistant-professor', 'lecturer', 'teaching-assistant'] },
  { group: 'Non-Teaching Staff', icon: <Wrench className="w-4 h-4" />, roles: ['office-superintendent', 'lab-assistant'] },
];

export function LoginPage() {
  const { data, login } = useStore();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const usersForRole = selectedRole ? data.staff.filter((s) => s.role === selectedRole) : [];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold">College Management Portal</h1>
              <p className="text-sm text-slate-300">College-Level Academic Leadership</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight">Manage your institution with clarity & control.</h2>
          <p className="text-slate-300 mt-4 max-w-md">Role-based dashboards for Principal, Dean, HOD, Teaching and Non-Teaching staff — connected, auditable, and aligned to your SOP.</p>
          <div className="mt-8 flex gap-6">
            <div><p className="text-3xl font-bold">5</p><p className="text-sm text-slate-400">Role tiers</p></div>
            <div><p className="text-3xl font-bold">4</p><p className="text-sm text-slate-400">Departments</p></div>
            <div><p className="text-3xl font-bold">10+</p><p className="text-sm text-slate-400">Modules</p></div>
          </div>
        </div>
        <p className="relative text-xs text-slate-400">SOP-DASH-MASTER-01 · v1.0 · Internal Use</p>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-2xl">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold text-slate-900">College Management Portal</h1>
          </div>

          {!selectedRole ? (
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Sign in to your dashboard</h2>
              <p className="text-sm text-slate-500 mt-1 mb-8">Select your role to continue. Each role has its own scoped menus and dashboard.</p>
              <div className="space-y-6">
                {roleGroups.map((g) => (
                  <div key={g.group}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-slate-500">{g.icon}</span>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{g.group}</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {g.roles.map((r) => {
                        const count = data.staff.filter((s) => s.role === r).length;
                        return (
                          <button
                            key={r}
                            onClick={() => setSelectedRole(r)}
                            className="card card-hover p-4 text-left flex items-center justify-between group"
                          >
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{roleLabels[r]}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{count} user{count !== 1 ? 's' : ''} available</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-1 transition-all" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <button onClick={() => setSelectedRole(null)} className="text-sm text-slate-500 hover:text-slate-900 mb-4 flex items-center gap-1">
                <ChevronRight className="w-4 h-4 rotate-180" /> Back to roles
              </button>
              <h2 className="text-2xl font-bold text-slate-900">{roleLabels[selectedRole]}</h2>
              <p className="text-sm text-slate-500 mt-1 mb-6">Choose your account to sign in.</p>
              <div className="space-y-3">
                {usersForRole.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => login(u.id)}
                    className="card card-hover p-4 w-full text-left flex items-center gap-4"
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-sm font-semibold">
                      {u.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.designation} · {u.email}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
