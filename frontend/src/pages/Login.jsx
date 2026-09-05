import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import logoIcono from '../assets/logo.png'
import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/token/', { username, password })
      localStorage.setItem('access_token', res.data.access)
      localStorage.setItem('refresh_token', res.data.refresh)
      navigate('/panel')
    } catch (err) {
      setError('Usuario o contraseña incorrectos.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-950 text-ink flex">

      {/* PANEL IZQUIERDO — marca */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center border-r border-base-700/60">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(600px circle at 30% 20%, rgba(59,130,246,0.18), transparent 60%)' }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative z-10 max-w-sm px-10 text-center">
          <img src={logoIcono} alt="SIGMA" className="h-16 w-auto mx-auto mb-6" />
          <h2 className="font-display font-bold text-3xl mb-3">SIGMA</h2>
          <p className="text-muted leading-relaxed">
            Sistema Integrado de Gestión para Mecánica y Administración.
            Agenda, órdenes, inventario y reportes en un solo lugar.
          </p>
          <div className="flex items-center justify-center gap-8 mt-10 text-sm">
            <div>
              <div className="font-display font-bold text-xl text-brand">+40</div>
              <div className="text-muted text-xs mt-1">talleres activos</div>
            </div>
            <div className="w-px h-8 bg-base-700" />
            <div>
              <div className="font-display font-bold text-xl text-brand">2.4h</div>
              <div className="text-muted text-xs mt-1">tiempo prom.</div>
            </div>
          </div>
        </div>
      </div>

      {/* PANEL DERECHO — formulario */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center lg:items-start mb-8">
            <img src={logoIcono} alt="SIGMA" className="h-9 w-auto mb-4 lg:hidden" />
            <h1 className="font-display font-bold text-2xl">Bienvenido de vuelta</h1>
            <p className="text-muted text-sm mt-1">Ingresa a tu panel para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted font-medium block mb-1.5">Usuario</label>
              <div className="relative">
                <User className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin_taller"
                  className="w-full bg-base-850 border border-base-700 rounded-lg pl-10 pr-3.5 py-3 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted font-medium block mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-base-850 border border-base-700 rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-400/10 border border-red-400/30 text-red-400 text-xs rounded-lg px-3.5 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-brand hover:bg-brand-dark transition-colors text-white font-semibold py-3 rounded-lg disabled:opacity-60 flex items-center justify-center gap-2 group"
            >
              {cargando ? 'Ingresando...' : (
                <>
                  Ingresar
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-muted text-xs mt-8">
            ¿Problemas para acceder? Contacta a tu administrador.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
