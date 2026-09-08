import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { Lock, X, Plus, AlertCircle } from 'lucide-react'

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
    especialidad: '',
    eficiencia_promedio: '',
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
      await api.post('/tecnicos/', {
        ...form,
        eficiencia_promedio: form.eficiencia_promedio || 0,
      })
      setModalAbierto(false)
      setForm({ username: '', password: '', nombre: '', apellido: '', especialidad: '', eficiencia_promedio: '' })
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
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/20 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] pointer-events-none z-0 transition-colors duration-300"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-300/20 dark:bg-cyan-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] pointer-events-none z-0 transition-colors duration-300"></div>

      <Sidebar className="relative z-10" />
      
      <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full relative z-10">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="font-extrabold text-3xl text-slate-800 dark:text-white tracking-tight transition-colors">Equipo Técnico</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium transition-colors">Gestiona tu personal y monitorea su rendimiento.</p>
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
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 bg-blue-50 dark:bg-blue-500/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-500/20 shadow-sm max-w-sm transition-colors">
            <div className="w-4 h-4 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            Cargando técnicos...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-2xl px-5 py-4 mb-6 shadow-sm max-w-md transition-colors">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {bloqueado && (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center max-w-lg mx-auto mt-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-colors">
            <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 flex items-center justify-center mx-auto mb-6 shadow-sm transition-colors">
              <Lock className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h2 className="font-extrabold text-2xl text-slate-800 dark:text-white mb-3 transition-colors">Módulo no contratado</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base mb-8 font-medium leading-relaxed transition-colors">
              Tu taller no tiene contratado el módulo de Técnicos. Actívalo para asignar órdenes a tu equipo y medir su eficiencia.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 text-white text-base font-bold px-8 py-3.5 rounded-full">
              Saber más sobre este módulo
            </button>
          </div>
        )}

        {!cargando && !bloqueado && !error && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tecnicos.length === 0 && (
              <div className="md:col-span-2 xl:col-span-3 text-center py-16 bg-white/50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl transition-colors">
                <p className="text-slate-500 dark:text-slate-400 text-base font-medium transition-colors">No hay técnicos registrados todavía.</p>
                <button onClick={() => setModalAbierto(true)} className="text-blue-600 dark:text-blue-400 font-bold mt-2 hover:underline transition-colors">Agregar tu primer técnico</button>
              </div>
            )}
            
            {tecnicos.map((t) => (
              <div key={t.id} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-blue-200 dark:hover:border-blue-500/50 transition-all group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center font-extrabold text-2xl text-blue-600 dark:text-blue-400 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {t.nombre?.slice(0, 1).toUpperCase()}{t.apellido?.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-lg text-slate-800 dark:text-white leading-tight transition-colors">{t.nombre} {t.apellido}</div>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5 transition-colors">{t.especialidad || 'Mecánico General'}</div>
                  </div>
                </div>
                
                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-5 flex flex-col items-center transition-colors">
                  <div className="font-black text-4xl text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {t.eficiencia_promedio}%
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1.5 transition-colors">
                    Eficiencia promedio
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL AGREGAR TÉCNICO */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center px-4 z-50">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-[500px] p-8 shadow-2xl transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-extrabold text-xl text-slate-800 dark:text-white transition-colors">Agregar nuevo técnico</h2>
                <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Nombre</label>
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Apellido</label>
                    <input
                      name="apellido"
                      value={form.apellido}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-2 transition-colors">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Nombre de usuario</label>
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition-colors"
                    />
                    <p className="text-slate-400 dark:text-slate-500 text-[11px] font-medium mt-1.5 transition-colors">Credencial para que el técnico inicie sesión.</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Contraseña</label>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition-colors"
                    />
                    <p className="text-slate-400 dark:text-slate-500 text-[11px] font-medium mt-1.5 transition-colors">Mínimo 8 caracteres, no solo numérica.</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-2 transition-colors">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Especialidad</label>
                  <input
                    name="especialidad"
                    value={form.especialidad}
                    onChange={handleChange}
                    placeholder="Ej. Motor y transmisión"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition-colors"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Eficiencia inicial (%)</label>
                  <input
                    name="eficiencia_promedio"
                    type="number"
                    min="0"
                    max="100"
                    value={form.eficiencia_promedio}
                    onChange={handleChange}
                    placeholder="100"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition-colors"
                  />
                </div>

                {errorForm && (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl px-4 py-3 flex items-center gap-2 transition-colors">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errorForm}
                  </div>
                )}

                <div className="pt-2">
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