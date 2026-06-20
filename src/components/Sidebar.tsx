import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Inbox } from 'lucide-react'
import { useTriageContext } from '../store/TriageContext'

function NorthwindLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="13" cy="13" r="12" stroke="#22c55e" strokeWidth="1.5" />
      <path d="M13 2.5 L15 9.5 L13 11.5 L11 9.5 Z" fill="#22c55e" />
      <path d="M13 23.5 L11 16.5 L13 14.5 L15 16.5 Z" fill="#475569" />
      <path d="M23.5 13 L16.5 15 L14.5 13 L16.5 11 Z" fill="#475569" />
      <path d="M2.5 13 L9.5 11 L11.5 13 L9.5 15 Z" fill="#475569" />
      <circle cx="13" cy="13" r="2" fill="#22c55e" />
    </svg>
  )
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/triage', label: 'Triage', icon: Inbox },
]

export default function Sidebar() {
  const { hotCount, overdueCount } = useTriageContext()

  return (
    <aside className="w-56 flex-shrink-0 bg-sidebar h-screen flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <NorthwindLogo />
        <div>
          <div className="text-white font-semibold text-sm leading-tight tracking-wide">Northwind</div>
          <div className="text-slate-500 text-xs leading-tight">Command Center</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sidebar-active text-white'
                  : 'text-green-200/60 hover:bg-sidebar-hover hover:text-green-100'
              }`
            }
          >
            <span className="flex items-center gap-3">
              <Icon size={16} />
              {label}
            </span>
            {label === 'Triage' && (hotCount > 0 || overdueCount > 0) && (
              <span className="flex items-center gap-1">
                {hotCount > 0 && (
                  <span className="bg-red-500/20 text-red-400 text-xs font-semibold px-1.5 py-0.5 rounded-full leading-none">
                    {hotCount}
                  </span>
                )}
                {overdueCount > 0 && (
                  <span className="bg-amber-500/20 text-amber-400 text-xs font-semibold px-1.5 py-0.5 rounded-full leading-none">
                    !
                  </span>
                )}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/5">
        <div className="text-green-900/70 text-xs">Northwind OS · v1.0</div>
      </div>
    </aside>
  )
}
