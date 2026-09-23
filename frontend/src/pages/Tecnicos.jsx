import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { Lock, X, Plus, AlertCircle, Award, Wrench, UserCheck, Mail, Phone } from 'lucide-react'

function Tecnicos() {
  const [tecnicos, setTecnicos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [bloqueado, setBloqueado] = useState(false)
  const [error, setError] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [errorForm, setErrorForm] = useState('')

  const [form, setForm] = useState({
    username: '',
    password: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    especialidad: '',
  })

  const cargarTecnicos = () => {
    api.get('/tecnicos/')
      .then((res) => setTecnicos(res.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          setBloqueado(true)
        } else {
          setError('No se pudieron cargar los técnicos.')
        }
      })
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    cargarTecnicos()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorForm('')
    setGuardando(true)
    try {
      await api.post('/tecnicos/', form)
      setModalAbierto(false)
      setForm({ username: '', password: '', nombre: '', apellido: '', email: '', telefono: '', especialidad: '' })
      cargarTecnicos()
    } catch (err) {
      if (err.response?.data?.username) {
        setErrorForm('Ese nombre de usuario ya existe, elige otro.')
      } else {
        setErrorForm('No se pudo crear el técnico. Revisa los datos.')
      }
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="bg-[#f4f7fb] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 min-h-screen flex font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 relative overflow-hidden transition-colors duration-300">
      
      {/* Fondo decorativo luminoso */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/20 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-300/20 dark:bg-cyan-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] pointer-events-none z-0"></div>

      <Sidebar className="relative z-10" />
      
      <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full relative z-10 overflow-y-auto h-screen">
        
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Recursos Humanos</div>
            <h1 className="font-extrabold text-3xl text-slate-800 dark:text-white tracking-tight">Equipo Técnico</h1>
          </div>
          {!bloqueado && (
            <button
              onClick={() => setModalAbierto(true)}
              className="bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 text-white text-sm font-bold px-6 py-3 rounded-full flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar técnico
            </button>
          )}
        </div>

        {cargando && (
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 bg-blue-50 dark:bg-blue-500/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-500/20 shadow-sm max-w-sm">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Cargando técnicos...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-2xl px-5 py-4 mb-6 shadow-sm max-w-md">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {bloqueado && (
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center max-w-lg mx-auto mt-16 shadow-xl">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Lock className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h2 className="font-extrabold text-2xl text-slate-800 dark:text-white mb-3">Módulo no contratado</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium leading-relaxed">
              Tu taller no tiene contratado el módulo de Técnicos. Actívalo desde el panel de administración para asignar personal y medir su rendimiento.
            </p>
          </div>
        )}

        {!cargando && !bloqueado && !error && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tecnicos.length === 0 && (
              <div className="md:col-span-2 xl:col-span-3 text-center py-16 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <UserCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No hay técnicos registrados todavía.</p>
                <button onClick={() => setModalAbierto(true)} className="text-blue-600 dark:text-blue-400 font-bold text-xs mt-2 hover:underline">Agregar tu primer técnico</button>
              </div>
            )}
            
            {tecnicos.map((t) => (
              <div key={t.id} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500/50 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                        {t.nombre?.slice(0, 1).toUpperCase()}{t.apellido?.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-tight">{t.nombre} {t.apellido}</h3>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-0.5 rounded-full mt-1.5 border border-blue-100 dark:border-blue-500/20">
                          <Wrench className="w-3 h-3" /> {t.especialidad || 'Mecánico General'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contacto */}
                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{t.email || 'Sin correo'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.telefono || 'Sin teléfono'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL AGREGAR TÉCNICO */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center px-4 z-50">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-[500px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-extrabold text-xl text-slate-800 dark:text-white">Agregar nuevo técnico</h2>
                <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">Nombre</label>
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Ej. Carlos"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">Apellido</label>
                    <input
                      name="apellido"
                      value={form.apellido}
                      onChange={handleChange}
                      placeholder="Ej. Santana"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">Correo electrónico</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="carlos@taller.com"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">Teléfono</label>
                    <input
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                      placeholder="+569..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">Nombre de usuario</label>
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="csantana"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">Contraseña</label>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">Especialidad</label>
                  <input
                    name="especialidad"
                    value={form.especialidad}
                    onChange={handleChange}
                    placeholder="Ej. Motor y frenos"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                  />
                </div>

                {errorForm && (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium rounded-xl px-4 py-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errorForm}
                  </div>
                )}

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={guardando}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 text-white font-bold py-3.5 rounded-xl disabled:opacity-60 text-sm"
                  >
                    {guardando ? 'Guardando...' : 'Crear técnico'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Tecnicos