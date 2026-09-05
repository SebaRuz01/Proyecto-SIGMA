import { NavLink, Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import logoIcono from '../assets/logo.png'
import { LayoutDashboard, ClipboardList, Wrench, Package, BarChart3, LogOut } from 'lucide-react'

const links = [
  { to: '/panel', label: 'Panel general', icon: LayoutDashboard },
  { to: '/ordenes', label: 'Órdenes', icon: ClipboardList },
  { to: '/tecnicos', label: 'Técnicos', icon: Wrench },
  { to: '/inventario', label: 'Inventario', icon: Package },
  { to: '/reportes', label: 'Reportes', icon: BarChart3 },
]

function Sidebar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('access_token')
  let username = 'Usuario'
  let rol = ''

  if (token) {
    try {
      const decoded = jwtDecode(token)
      username = decoded.username || 'Usuario'
      rol = decoded.rol || ''
    } catch {
      // token inválido, se mantiene el valor por defecto
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/login')
  }

  return (
    <aside className="w-60 shrink-0 border-r border-base-700/60 min-h-screen p-6 hidden lg:flex flex-col bg-base-950">
      <Link to="/" className="flex items-center gap-2 mb-10">
        <img src={logoIcono} alt="SIGMA" className="h-7 w-auto" />
        <span className="font-display font-bold text-lg tracking-tight">SIGMA</span>
      </Link>
      <nav className="space-y-1 text-sm font-medium">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-base-850 text-ink border border-base-700'
                  : 'text-muted hover:text-ink'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-6 border-t border-base-700/60">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-base-850 border border-base-700 flex items-center justify-center font-display text-sm">
            {username.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-xs">
            <div>{username}</div>
            <div className="text-muted capitalize">{rol.replace('_', ' ')}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-muted hover:text-red-400 transition-colors text-xs px-3 py-2 rounded-lg hover:bg-base-850"
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

export default Sidebar