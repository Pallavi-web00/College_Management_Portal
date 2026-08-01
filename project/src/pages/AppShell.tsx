import { useMemo, useState, type ReactNode } from 'react';
import { GraduationCap, LogOut, Bell, Search, ChevronDown, Menu, X } from 'lucide-react';
import { useStore, roleLabels, deptName } from '../store/StoreContext';
import { menus } from '../config/menus';
import { DashboardRouter } from './DashboardRouter';

export function AppShell() {
  const { currentUser, data, logout, notifications, markNotificationRead } = useStore();
  const [activeMenu, setActiveMenu] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const userMenus = useMemo(
    () => (currentUser ? menus[currentUser.role] : []),
    [currentUser]
  );

  // default active menu = first item
  const currentActive = activeMenu || userMenus[0]?.items[0]?.id || '';

  const userNotifs = notifications.filter((n) => currentUser && n.audience.includes(currentUser.role));
  const unreadCount = userNotifs.filter((n) => !n.read).length;

  if (!currentUser) return null;

  const dept = data.departments.find((d) => d.id === currentUser.departmentId);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 z-40 h-screen w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-5 py-5 flex items-center gap-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">College Portal</p>
            <p className="text-xs text-slate-400 truncate">{roleLabels[currentUser.role]}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {userMenus.map((g) => (
            <div key={g.group}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{g.group}</p>
              <div className="space-y-0.5">
                {g.items.map((item) => {
                  const Icon = item.icon;
                  const active = currentActive === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveMenu(item.id); setMobileOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        active ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
                <Menu className="w-5 h-5 text-slate-700" />
              </button>
              <div className="hidden sm:block">
                <p className="text-xs text-slate-500">{deptName(data, currentUser.departmentId)}</p>
                <p className="text-sm font-semibold text-slate-900">
                  {userMenus.flatMap((g) => g.items).find((i) => i.id === currentActive)?.label ?? 'Dashboard'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 w-64">
                <Search className="w-4 h-4 text-slate-400" />
                <input className="bg-transparent border-0 outline-0 text-sm ml-2 flex-1 placeholder-slate-400" placeholder="Search..." />
              </div>

              <div className="relative">
                <button onClick={() => setNotifOpen((v) => !v)} className="relative p-2 rounded-lg hover:bg-slate-100">
                  <Bell className="w-5 h-5 text-slate-600" />
                  {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">{unreadCount}</span>}
                </button>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-40 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">Notifications</p>
                        <button onClick={() => setNotifOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {userNotifs.length === 0 ? (
                          <p className="px-4 py-8 text-center text-sm text-slate-400">No notifications</p>
                        ) : userNotifs.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 ${!n.read ? 'bg-blue-50/50' : ''}`}
                          >
                            <p className="text-sm font-medium text-slate-900">{n.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{n.date}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-sm font-semibold">
                  {currentUser.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900 leading-tight">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">{currentUser.designation}</p>
                </div>
                <ChevronDown className="hidden sm:block w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          <DashboardRouter activeMenu={currentActive} />
        </main>
      </div>
    </div>
  );
}

// re-export for convenience
export { useStore };
export type { ReactNode };
