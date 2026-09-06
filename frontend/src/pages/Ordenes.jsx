import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { X, Trash2, Plus, AlertCircle } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'

// Colores actualizados con soporte para modo oscuro (dark:)
const ESTADOS = [
  { key: 'recibido', titulo: 'Recibido', bgHeader: 'bg-slate-100 dark:bg-slate-800/60', textHeader: 'text-slate-600 dark:text-slate-300', borderHeader: 'border-slate-200 dark:border-slate-700/60' },
  { key: 'diagnostico', titulo: 'Diagnóstico', bgHeader: 'bg-blue-50 dark:bg-blue-500/10', textHeader: 'text-blue-600 dark:text-blue-400', borderHeader: 'border-blue-200 dark:border-blue-500/20' },
  { key: 'en_reparacion', titulo: 'En reparación', bgHeader: 'bg-teal-50 dark:bg-teal-500/10', textHeader: 'text-teal-600 dark:text-teal-400', borderHeader: 'border-teal-200 dark:border-teal-500/20' },
  { key: 'listo', titulo: 'Listo para retiro', bgHeader: 'bg-emerald-50 dark:bg-emerald-500/10', textHeader: 'text-emerald-700 dark:text-emerald-400', borderHeader: 'border-emerald-200 dark:border-emerald-500/20' },
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
  const [ordenAEliminar, setOrdenAEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)
  const [repuestos, setRepuestos] = useState([])
  const [repuestosBloqueados, setRepuestosBloqueados] = useState(false)
  const [ordenExpandida, setOrdenExpandida] = useState(null)
  const [repuestoSeleccionado, setRepuestoSeleccionado] = useState('')
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1)
  const [errorRepuesto, setErrorRepuesto] = useState('')

  const token = localStorage.getItem('access_token')
  let rolUsuario = ''
  if (token) {
    try {
      rolUsuario = jwtDecode(token).rol
    } catch {
      rolUsuario = ''
    }
  }
  const puedeEliminar = rolUsuario === 'admin_taller' || rolUsuario === 'super_admin'

  const [form, setForm] = useState({
    cliente_nombre: '',
    cliente_telefono: '',
    equipo: '',
    descripcion_problema: '',
    tecnico: '',
    estado: 'recibido',
  })

  const pedirConfirmacionEliminar = (orden, e) => {
    e.stopPropagation()
    setOrdenAEliminar(orden)
  }

  const confirmarEliminar = async () => {
    if (!ordenAEliminar) return
    setEliminando(true)
    try {
      await api.delete(`/ordenes/${ordenAEliminar.id}/`)
      setOrdenes((prev) => prev.filter((o) => o.id !== ordenAEliminar.id))
      setOrdenAEliminar(null)
    } catch (err) {
      alert('No se pudo eliminar la orden. Verifica que tengas permisos de administrador.')
    } finally {
      setEliminando(false)
    }
  }

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
    api.get('/repuestos/')
      .then((res) => setRepuestos(res.data))
      .catch((err) => {
        if (err.response?.status === 403) setRepuestosBloqueados(true)
      })
  }, [])

  const agregarRepuesto = async (ordenId) => {
    setErrorRepuesto('')
    if (!repuestoSeleccionado) return
    try {
      await api.post('/ordenes-repuestos/', {
        orden: ordenId,
        repuesto: repuestoSeleccionado,
        cantidad: cantidadSeleccionada,
      })
      setRepuestoSeleccionado('')
      setCantidadSeleccionada(1)
      cargarOrdenes()
      api.get('/repuestos/').then((res) => setRepuestos(res.data))
    } catch (err) {
      setErrorRepuesto(err.response?.data?.[0] || 'No se pudo agregar el repuesto.')
    }
  }

  const quitarRepuesto = async (ordenRepuestoId) => {
    try {
      await api.delete(`/ordenes-repuestos/${ordenRepuestoId}/`)
      cargarOrdenes()
      api.get('/repuestos/').then((res) => setRepuestos(res.data))
    } catch (err) {
      alert('No se pudo quitar el repuesto.')
    }
  }

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

  const handleDragStart = (orden) => {
    setOrdenArrastrada(orden)
  }

  const handleDragOver = (e, columnaKey) => {
    e.preventDefault()
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

    setOrdenes((prev) =>
      prev.map((o) => (o.id === ordenId ? { ...o, estado: nuevoEstado } : o))
    )
    setOrdenArrastrada(null)

    try {
      await api.patch(`/ordenes/${ordenId}/`, { estado: nuevoEstado })
    } catch (err) {
      setOrdenes((prev) =>
        prev.map((o) => (o.id === ordenId ? { ...o, estado: estadoAnterior } : o))
      )
    }
  }

  return (
    <div className="bg-[#f4f7fb] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 min-h-screen flex font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 relative overflow-hidden transition-colors duration-300">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/20 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] pointer-events-none z-0 transition-colors duration-300"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-300/20 dark:bg-cyan-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] pointer-events-none z-0 transition-colors duration-300"></div>

      <Sidebar className="relative z-10" />
      
      <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full relative z-10 overflow-y-auto h-screen">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-extrabold text-3xl text-slate-800 dark:text-white tracking-tight transition-colors">Órdenes de trabajo</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium transition-colors">Gestiona y mueve las órdenes arrastrando las tarjetas.</p>
          </div>
          <button
            onClick={() => setModalAbierto(true)}
            className="bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 text-white text-sm font-bold px-5 py-2.5 rounded-full flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva orden
          </button>
        </div>

        {cargando && (
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20 shadow-sm transition-colors">
            <div className="w-4 h-4 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            Cargando órdenes...
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl px-4 py-3 mb-6 shadow-sm transition-colors">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {!cargando && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
            {ESTADOS.map((col) => {
              const ordenesCol = ordenes.filter((o) => o.estado === col.key)
              const esDestino = columnaSobre === col.key
              return (
                <div
                  key={col.key}
                  onDragOver={(e) => handleDragOver(e, col.key)}
                  onDragLeave={handleDragLeave}
                  onDrop={() => handleDrop(col.key)}
                  className={`bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border rounded-3xl p-4 flex flex-col transition-all duration-200 ${
                    esDestino 
                      ? 'border-blue-400 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg shadow-blue-100 dark:shadow-none' 
                      : 'border-slate-200/80 dark:border-slate-800/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] dark:shadow-none'
                  }`}
                >
                  <div className={`flex items-center justify-between mb-4 px-3 py-2 rounded-xl border transition-colors ${col.bgHeader} ${col.borderHeader}`}>
                    <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${col.textHeader}`}>{col.titulo}</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full bg-white/60 dark:bg-slate-900/60 transition-colors ${col.textHeader}`}>
                      {ordenesCol.length}
                    </span>
                  </div>
                  
                  <div className="space-y-3 min-h-[150px]">
                    {ordenesCol.length === 0 && (
                      <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl py-8 transition-colors">
                        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium transition-colors">Arrastra una orden aquí</p>
                      </div>
                    )}
                    
                    {ordenesCol.map((o) => (
                      <div
                        key={o.id}
                        draggable
                        onDragStart={() => handleDragStart(o)}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/50 rounded-2xl p-5 cursor-grab active:cursor-grabbing transition-all group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[10px] font-black px-2 py-1 rounded-md tracking-wider transition-colors">
                            OT-{o.id.toString().padStart(3, '0')}
                          </span>
                          <div className="flex items-center gap-2">
                            {puedeEliminar && (
                              <button
                                onClick={(e) => pedirConfirmacionEliminar(o, e)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md"
                                title="Eliminar orden"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <h3 className="font-bold text-slate-800 dark:text-white text-base leading-tight mb-2 transition-colors">{o.equipo}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 transition-colors">
                          {o.descripcion_problema || 'Sin descripción'}
                        </p>
                        
                        <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-700/50 transition-colors">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-slate-400 dark:text-slate-500">Cliente</span>
                            <span className="text-slate-700 dark:text-slate-300 transition-colors">{o.cliente_nombre}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-slate-400 dark:text-slate-500">Técnico</span>
                            <span className={o.tecnico_nombre ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-md transition-colors' : 'text-slate-400 dark:text-slate-600 italic transition-colors'}>
                              {o.tecnico_nombre || 'Sin asignar'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/50 transition-colors">
                          <button
                            onClick={() => setOrdenExpandida(ordenExpandida === o.id ? null : o.id)}
                            className="text-xs font-bold text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors w-full text-left flex items-center justify-between"
                          >
                            {ordenExpandida === o.id ? 'Ocultar repuestos' : `Repuestos utilizados (${o.repuestos_usados?.length || 0})`}
                            <span className="text-[10px] bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 rounded transition-colors">{ordenExpandida === o.id ? '-' : '+'}</span>
                          </button>

                          {ordenExpandida === o.id && (
                            <div className="mt-3 space-y-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                              {o.repuestos_usados?.map((r) => (
                                <div key={r.id} className="flex items-center justify-between text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 shadow-sm transition-colors">
                                  <span className="font-medium text-slate-700 dark:text-slate-200 transition-colors">{r.repuesto_nombre} <span className="text-slate-400 dark:text-slate-500">x{r.cantidad}</span></span>
                                  <button onClick={() => quitarRepuesto(r.id)} className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}

                              {!repuestosBloqueados && (
                                <div className="flex gap-2 mt-3">
                                  <select
                                    value={repuestoSeleccionado}
                                    onChange={(e) => setRepuestoSeleccionado(e.target.value)}
                                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 font-medium transition-colors"
                                  >
                                    <option value="">Añadir repuesto...</option>
                                    {repuestos.map((r) => (
                                      <option key={r.id} value={r.id}>{r.nombre} (Stock: {r.stock_actual})</option>
                                    ))}
                                  </select>
                                  <input
                                    type="number"
                                    min="1"
                                    value={cantidadSeleccionada}
                                    onChange={(e) => setCantidadSeleccionada(Number(e.target.value))}
                                    className="w-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 font-medium text-center transition-colors"
                                  />
                                  <button
                                    onClick={() => agregarRepuesto(o.id)}
                                    className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-3 rounded-lg text-xs font-bold"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                              {errorRepuesto && <p className="text-red-500 dark:text-red-400 text-[11px] font-medium mt-1.5">{errorRepuesto}</p>}
                            </div>
                          )}
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
          <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center px-4 z-50">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-8 shadow-2xl transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-extrabold text-xl text-slate-800 dark:text-white transition-colors">Nueva orden de trabajo</h2>
                <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Nombre del cliente</label>
                  <input
                    name="cliente_nombre"
                    value={form.cliente_nombre}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Teléfono (opcional)</label>
                  <input
                    name="cliente_telefono"
                    value={form.cliente_telefono}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Equipo / Vehículo</label>
                  <input
                    name="equipo"
                    value={form.equipo}
                    onChange={handleChange}
                    placeholder="Ej. Toyota Corolla — Frenos"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Descripción del problema</label>
                  <textarea
                    name="descripcion_problema"
                    value={form.descripcion_problema}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium resize-none transition-colors"
                  />
                </div>

                {tecnicosBloqueados ? (
                  <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">
                    Tu taller no tiene contratado el módulo de Técnicos. Las órdenes se crean sin asignar.
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Técnico asignado (opcional)</label>
                    <select
                      name="tecnico"
                      value={form.tecnico}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium appearance-none transition-colors"
                    >
                      <option value="">Sin asignar</option>
                      {tecnicos.map((t) => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                      ))}
                    </select>
                  </div>
                )}

                {errorForm && <p className="text-red-500 dark:text-red-400 text-sm font-medium">{errorForm}</p>}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={guardando}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 text-white font-bold py-3.5 rounded-xl disabled:opacity-60"
                  >
                    {guardando ? 'Guardando...' : 'Crear orden'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL CONFIRMAR ELIMINACIÓN */}
        {ordenAEliminar && (
          <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center px-4 z-50">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm p-8 shadow-2xl text-center transition-colors">
              <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 border-8 border-red-50 dark:border-red-500/10 flex items-center justify-center mx-auto mb-5 transition-colors">
                <Trash2 className="w-8 h-8 text-red-500 dark:text-red-400" />
              </div>
              <h2 className="font-extrabold text-xl text-slate-800 dark:text-white mb-2 transition-colors">¿Eliminar esta orden?</h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm font-medium mb-1 transition-colors">
                OT-{ordenAEliminar.id.toString().padStart(3, '0')} — {ordenAEliminar.equipo}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mb-8 transition-colors">
                Esta acción es permanente y no se puede deshacer.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setOrdenAEliminar(null)}
                  className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarEliminar}
                  disabled={eliminando}
                  className="flex-1 bg-red-500 hover:bg-red-600 transition-colors shadow-md shadow-red-500/20 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-60"
                >
                  {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Ordenes