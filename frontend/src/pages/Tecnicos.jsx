import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { Lock, X } from 'lucide-react'

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
      setForm({ username: '', password: '', especialidad: '', eficiencia_promedio: '' })
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
    <div className="bg-base-950 text-ink min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="font-display font-bold text-3xl">Equipo técnico</h1>
          {!bloqueado && (
            <button
              onClick={() => setModalAbierto(true)}
              className="bg-brand hover:bg-brand-dark transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
            >
              + Agregar técnico
            </button>
          )}
        </div>

        {cargando && <p className="text-muted text-sm">Cargando...</p>}

        {bloqueado && (
          <div className="bg-base-850 border border-base-700 rounded-xl p-10 text-center max-w-md mx-auto mt-10">
            <div className="w-12 h-12 rounded-full bg-base-900 border border-base-700 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-5 h-5 text-muted" />
            </div>
            <h2 className="font-display font-semibold text-lg mb-2">Módulo no contratado</h2>
            <p className="text-muted text-sm mb-6">
              Tu taller no tiene contratado el módulo de Técnicos. Contáctanos para habilitarlo.
            </p>
            <button className="bg-brand hover:bg-brand-dark transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
              Contratar módulo
            </button>
          </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {!cargando && !bloqueado && !error && (
          <div className="grid md:grid-cols-2 gap-5">
            {tecnicos.length === 0 && (
              <p className="text-muted text-sm">No hay técnicos registrados todavía.</p>
            )}
            {tecnicos.map((t) => (
              <div key={t.id} className="bg-base-850 border border-base-700 rounded-xl p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-base-900 border border-base-700 flex items-center justify-center font-display font-semibold">
                      {t.nombre?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{t.nombre}</div>
                      <div className="text-xs text-muted">{t.especialidad}</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 text-center border-t border-base-700 pt-4">
                  <div>
                    <div className="font-display font-bold text-lg text-brand">{t.eficiencia_promedio}%</div>
                    <div className="text-[10px] text-muted uppercase tracking-wide mt-1">Eficiencia promedio</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL AGREGAR TÉCNICO */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
            <div className="bg-base-900 border border-base-700 rounded-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-lg">Agregar técnico</h2>
                <button onClick={() => setModalAbierto(false)} className="text-muted hover:text-ink">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted block mb-1.5">Nombre</label>
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      className="w-full bg-base-850 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1.5">Apellido</label>
                    <input
                      name="apellido"
                      value={form.apellido}
                      onChange={handleChange}
                      className="w-full bg-base-850 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1.5">Nombre de usuario</label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full bg-base-850 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
                  />
                  <p className="text-muted text-[11px] mt-1">Este es solo para que el técnico inicie sesión (no se muestra en pantalla).</p>
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1.5">Contraseña</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full bg-base-850 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
                  />
                  <p className="text-muted text-[11px] mt-1">Mínimo 8 caracteres, no puede ser solo numérica.</p>
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1.5">Especialidad</label>
                  <input
                    name="especialidad"
                    value={form.especialidad}
                    onChange={handleChange}
                    placeholder="Ej. Motor y transmisión"
                    className="w-full bg-base-850 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1.5">Eficiencia inicial (%)</label>
                  <input
                    name="eficiencia_promedio"
                    type="number"
                    min="0"
                    max="100"
                    value={form.eficiencia_promedio}
                    onChange={handleChange}
                    className="w-full bg-base-850 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
                  />
                </div>

                {errorForm && <p className="text-red-400 text-xs">{errorForm}</p>}

                <button
                  type="submit"
                  disabled={guardando}
                  className="w-full bg-brand hover:bg-brand-dark transition-colors text-white font-semibold py-2.5 rounded-lg disabled:opacity-60"
                >
                  {guardando ? 'Guardando...' : 'Crear técnico'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Tecnicos