import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { X } from 'lucide-react'

const ESTADOS = [
  { key: 'recibido', titulo: 'Recibido', color: 'text-muted' },
  { key: 'diagnostico', titulo: 'Diagnóstico', color: 'text-muted' },
  { key: 'en_reparacion', titulo: 'En reparación', color: 'text-amber-400' },
  { key: 'listo', titulo: 'Listo para retiro', color: 'text-success' },
]

function Ordenes() {
  const [ordenes, setOrdenes] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [tecnicosBloqueados, setTecnicosBloqueados] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [errorForm, setErrorForm] = useState('')
  const [ordenArrastrada, setOrdenArrastrada] = useState(null)
  const [columnaSobre, setColumnaSobre] = useState(null)

  const [form, setForm] = useState({
    cliente_nombre: '',
    cliente_telefono: '',
    equipo: '',
    descripcion_problema: '',
    tecnico: '',
    estado: 'recibido',
  })

  const cargarOrdenes = () => {
    api.get('/ordenes/')
      .then((res) => setOrdenes(res.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          setError('Tu taller no tiene contratado el módulo de Órdenes.')
        } else {
          setError('No se pudieron cargar las órdenes.')
        }
      })
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    cargarOrdenes()
    api.get('/tecnicos/')
      .then((res) => setTecnicos(res.data))
      .catch((err) => {
        if (err.response?.status === 403) setTecnicosBloqueados(true)
      })
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorForm('')
    setGuardando(true)
    try {
      const payload = { ...form }
      if (tecnicosBloqueados) {
        delete payload.tecnico
      } else {
        payload.tecnico = form.tecnico || null
      }
      await api.post('/ordenes/', payload)
      setModalAbierto(false)
      setForm({ cliente_nombre: '', cliente_telefono: '', equipo: '', descripcion_problema: '', tecnico: '', estado: 'recibido' })
      cargarOrdenes()
    } catch (err) {
      setErrorForm('No se pudo crear la orden. Revisa los datos.')
    } finally {
      setGuardando(false)
    }
  }

  // --- DRAG & DROP ---
  const handleDragStart = (orden) => {
    setOrdenArrastrada(orden)
  }

  const handleDragOver = (e, columnaKey) => {
    e.preventDefault() // necesario para permitir el drop
    setColumnaSobre(columnaKey)
  }

  const handleDragLeave = () => {
    setColumnaSobre(null)
  }

  const handleDrop = async (nuevoEstado) => {
    setColumnaSobre(null)
    if (!ordenArrastrada || ordenArrastrada.estado === nuevoEstado) {
      setOrdenArrastrada(null)
      return
    }

    const ordenId = ordenArrastrada.id
    const estadoAnterior = ordenArrastrada.estado

    // Actualización optimista: se mueve en pantalla al instante
    setOrdenes((prev) =>
      prev.map((o) => (o.id === ordenId ? { ...o, estado: nuevoEstado } : o))
    )
    setOrdenArrastrada(null)

    try {
      await api.patch(`/ordenes/${ordenId}/`, { estado: nuevoEstado })
    } catch (err) {
      // si falla el guardado, la devolvemos a su columna original
      setOrdenes((prev) =>
        prev.map((o) => (o.id === ordenId ? { ...o, estado: estadoAnterior } : o))
      )
    }
  }

  return (
    <div className="bg-base-950 text-ink min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="font-display font-bold text-3xl">Órdenes de trabajo</h1>
          <button
            onClick={() => setModalAbierto(true)}
            className="bg-brand hover:bg-brand-dark transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
          >
            + Nueva orden
          </button>
        </div>

        {cargando && <p className="text-muted text-sm">Cargando órdenes...</p>}
        {error && (
          <div className="bg-red-400/10 border border-red-400/30 text-red-400 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {!cargando && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ESTADOS.map((col) => {
              const ordenesCol = ordenes.filter((o) => o.estado === col.key)
              const esDestino = columnaSobre === col.key
              return (
                <div
                  key={col.key}
                  onDragOver={(e) => handleDragOver(e, col.key)}
                  onDragLeave={handleDragLeave}
                  onDrop={() => handleDrop(col.key)}
                  className={`rounded-lg transition-colors ${esDestino ? 'bg-brand/5 ring-1 ring-brand/40' : ''}`}
                >
                  <div className={`flex items-center justify-between mb-3 px-1 pt-1 text-xs font-semibold uppercase tracking-wide ${col.color}`}>
                    <span>{col.titulo}</span>
                    <span>{ordenesCol.length}</span>
                  </div>
                  <div className="space-y-3 min-h-[60px] px-1 pb-1">
                    {ordenesCol.length === 0 && (
                      <p className="text-muted text-xs">Arrastra una orden aquí.</p>
                    )}
                    {ordenesCol.map((o) => (
                      <div
                        key={o.id}
                        draggable
                        onDragStart={() => handleDragStart(o)}
                        className="bg-base-850 border border-base-700 rounded-lg p-4 cursor-grab active:cursor-grabbing hover:border-muted transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2 text-xs text-muted">
                          <span>OT-{o.id}</span>
                          <span>{o.equipo}</span>
                        </div>
                        <div className="text-sm mb-3">{o.descripcion_problema || 'Sin descripción'}</div>
                        <div className="space-y-1.5 pt-3 border-t border-base-700/60">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted">Cliente</span>
                            <span>{o.cliente_nombre}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted">Técnico</span>
                            <span className={o.tecnico_nombre ? '' : 'text-muted italic'}>
                              {o.tecnico_nombre || 'Sin asignar'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* MODAL NUEVA ORDEN */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
            <div className="bg-base-900 border border-base-700 rounded-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-lg">Nueva orden de trabajo</h2>
                <button onClick={() => setModalAbierto(false)} className="text-muted hover:text-ink">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-muted block mb-1.5">Nombre del cliente</label>
                  <input
                    name="cliente_nombre"
                    value={form.cliente_nombre}
                    onChange={handleChange}
                    required
                    className="w-full bg-base-850 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1.5">Teléfono (opcional)</label>
                  <input
                    name="cliente_telefono"
                    value={form.cliente_telefono}
                    onChange={handleChange}
                    className="w-full bg-base-850 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1.5">Equipo</label>
                  <input
                    name="equipo"
                    value={form.equipo}
                    onChange={handleChange}
                    placeholder="Ej. Toyota Corolla — frenos"
                    required
                    className="w-full bg-base-850 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1.5">Descripción del problema</label>
                  <textarea
                    name="descripcion_problema"
                    value={form.descripcion_problema}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-base-850 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand resize-none"
                  />
                </div>

                {tecnicosBloqueados ? (
                  <div className="bg-base-850 border border-base-700 rounded-lg px-3.5 py-2.5 text-xs text-muted">
                    Tu taller no tiene contratado el módulo de Técnicos, así que las órdenes se crean sin asignar por ahora.
                  </div>
                ) : (
                  <div>
                    <label className="text-xs text-muted block mb-1.5">Técnico asignado (opcional)</label>
                    <select
                      name="tecnico"
                      value={form.tecnico}
                      onChange={handleChange}
                      className="w-full bg-base-850 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
                    >
                      <option value="">Sin asignar</option>
                      {tecnicos.map((t) => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                      ))}
                    </select>
                  </div>
                )}

                {errorForm && <p className="text-red-400 text-xs">{errorForm}</p>}

                <button
                  type="submit"
                  disabled={guardando}
                  className="w-full bg-brand hover:bg-brand-dark transition-colors text-white font-semibold py-2.5 rounded-lg disabled:opacity-60"
                >
                  {guardando ? 'Guardando...' : 'Crear orden'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Ordenes