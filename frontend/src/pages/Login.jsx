import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import logoIcono from '../assets/logo.png'
import { User, Lock, Eye, EyeOff, ArrowRight, Home } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'

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

      const { rol } = jwtDecode(res.data.access)
      if (rol === 'super_admin') {
        navigate('/super-admin')
      } else {
        navigate('/panel')
      }
    } catch (err) {
      setError('Usuario o contraseña incorrectos.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center font-sans text-slate-900 bg-[#f8fafc] relative overflow-hidden selection:bg-blue-100 selection:text-blue-900 px-4">
      
      {/* FONDO DECORATIVO: Cuadrícula y luces suaves */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-300/20 rounded-full blur-[100px] mix-blend-multiply"></div>
      </div>

      {/* TARJETA CENTRAL */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Enlace para volver (opcional, pero mejora la navegación) */}
        <div className="mb-6 flex justify-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <Home className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>

        <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-200/60">
          
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-5">
              <img src={logoIcono} alt="SIGMA" className="h-8 w-auto" />
            </div>
            <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight">Acceso a SIGMA</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 ml-1">Usuario</label>
              <div className="relative group">
                <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin_taller"
                  className="w-full bg-white border-2 border-slate-200 text-slate-900 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-0 transition-all font-medium placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 ml-1">Contraseña</label>
              <div className="relative group">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border-2 border-slate-200 text-slate-900 rounded-2xl pl-12 pr-12 py-3.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-0 transition-all font-medium placeholder:text-slate-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-2xl px-4 py-3 text-center animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-slate-900 hover:bg-slate-800 transition-all text-white font-bold py-4 rounded-2xl disabled:opacity-70 flex items-center justify-center gap-2 group shadow-xl shadow-slate-900/10 mt-6"
            >
              {cargando ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-8 font-medium">
          ¿Necesitas ayuda? <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">Soporte técnico</a>
        </p>
      </div>
    </div>
  )
}

export default Login