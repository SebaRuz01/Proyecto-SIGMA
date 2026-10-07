import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { X, Trash2, Plus, AlertCircle, Search, ChevronLeft, ChevronRight, Sparkles, Mail } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'
import datosChile from '../utils/regiones.json'

const ESTADOS = [
  { key: 'recibido', titulo: 'Recibido', bgHeader: 'bg-slate-100 dark:bg-slate-800/60', textHeader: 'text-slate-600 dark:text-slate-300', borderHeader: 'border-slate-200 dark:border-slate-700/60' },
  { key: 'diagnostico', titulo: 'Diagnóstico', bgHeader: 'bg-blue-50 dark:bg-blue-500/10', textHeader: 'text-blue-600 dark:text-blue-400', borderHeader: 'border-blue-200 dark:border-blue-500/20' },
  { key: 'en_reparacion', titulo: 'En reparación', bgHeader: 'bg-teal-50 dark:bg-teal-500/10', textHeader: 'text-teal-600 dark:text-teal-400', borderHeader: 'border-teal-200 dark:border-teal-500/20' },
  { key: 'listo', titulo: 'Listo para retiro', bgHeader: 'bg-emerald-50 dark:bg-emerald-500/10', textHeader: 'text-emerald-700 dark:text-emerald-400', borderHeader: 'border-emerald-200 dark:border-emerald-500/20' },
]

const validarRutChilenoSimple = (rut) => {
  if (!rut) return false
  const limpio = rut.trim().replace(/\./g, '').toUpperCase()
  const regexRut = /^\d{7,8}-[0-9K]$/
  return regexRut.test(limpio)
}

const validarPatenteChilena = (patente) => {
  if (!patente) return false
  const p = patente.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const regexAntigua = /^[A-Z]{4}[0-9]{2}$/
  const regexNueva = /^[A-Z]{2}[0-9]{4}$/
  const regexMoto = /^[A-Z]{3}[0-9]{2}$/
  return regexAntigua.test(p) || regexNueva.test(p) || regexMoto.test(p)
}

const validarTelefonoChile = (tel) => {
  const regexTel = /^[0-9]{8}$/
  return regexTel.test(tel.trim())
}

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
  const [busquedaRepuesto, setBusquedaRepuesto] = useState('')
  const [busquedaOrden, setBusquedaOrden] = useState('')
  const [calculandoIA, setCalculandoIA] = useState(null)
  const [enviandoCorreo, setEnviandoCorreo] = useState(null)
  const [comunasDisponibles, setComunasDisponibles] = useState([])
  
  const [paginaGlobal, setPaginaGlobal] = useState(1)
  const porPagina = 3

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
    cliente_rut: '',
    cliente_telefono: '',
    cliente_email: '',
    cliente_calle: '',
    cliente_numero: '',
    cliente_region: '',
    cliente_comuna: '',
    equipo: '',
    vehiculo_patente: '',
    descripcion_problema: '',
    tecnico: '',
    estado: 'recibido',
  })

  const handleRegionChange = (e) => {
    const regionElegida = e.target.value
    setForm({ ...form, cliente_region: regionElegida, cliente_comuna: '' })
    
    if (regionElegida) {
      const regionData = datosChile.regiones.find(r => r.region === regionElegida)
      setComunasDisponibles(regionData ? regionData.comunas : [])
    } else {
      setComunasDisponibles([])
    }
  }

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
    } catch {
      alert('No se pudo eliminar la orden. Verifica que tengas permisos de administrador.')
    } finally {
      setEliminando(false)
    }
  }

  const cargarDatos = () => {
    api.get('/ordenes/')
      .then((res) => {
        const activas = res.data.filter(o => o.estado?.toLowerCase() !== 'entregado')
        setOrdenes(activas)
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          setError('Tu taller no tiene contratado el módulo de Órdenes.')
        } else {
          setError('No se pudieron cargar las órdenes.')
        }
      })
      .finally(() => setCargando(false))

    api.get('/repuestos/')
      .then((res) => setRepuestos(res.data))
      .catch((err) => {
        if (err.response?.status === 403) setRepuestosBloqueados(true)
      })
  }

  useEffect(() => {
    cargarDatos()
    api.get('/tecnicos/')
      .then((res) => setTecnicos(res.data))
      .catch((err) => {
        if (err.response?.status === 403) setTecnicosBloqueados(true)
      })
  }, [])

  const calcularEstimacionIA = async (ordenId, e) => {
    e.stopPropagation()
    setCalculandoIA(ordenId)
    try {
      const res = await api.post(`/ordenes/${ordenId}/estimar-ia/`)
      setOrdenes(prev => prev.map(o => o.id === ordenId ? { ...o, fecha_estimada: res.data.fecha_estimada } : o))
    } catch {
      alert('No se pudo calcular la estimación con IA. Asegúrate de tener suficientes datos históricos.')
    } finally {
      setCalculandoIA(null)
    }
  }

  const enviarCorreoCliente = async (orden, e) => {
    e.stopPropagation()
    if (!orden.fecha_estimada) {
      alert('Primero debes calcular el tiempo estimado con la IA antes de notificar al cliente.')
      return
    }
    setEnviandoCorreo(orden.id)
    try {
      await api.post(`/ordenes/${orden.id}/enviar-correo/`)
      alert(`¡Correo enviado con éxito a ${orden.cliente_email || 'correo del cliente'} con la fecha estimada de entrega!`)
    } catch {
      alert('Error al enviar el correo desde el servidor.')
    } finally {
      setEnviandoCorreo(null)
    }
  }

  const handleEntregarOrden = async (ordenId, e) => {
    e.stopPropagation()
    try {
      const fechaActual = new Date().toISOString()
      await api.patch(`/ordenes/${ordenId}/`, { 
        estado: 'entregado',
        fecha_entrega: fechaActual 
      })
      setOrdenes((prev) => prev.filter((o) => o.id !== ordenId))
    } catch {
      alert('No se pudo marcar la orden como entregada.')
    }
  }

  const agregarRepuesto = async (ordenId) => {
    setErrorRepuesto('')
    if (!repuestoSeleccionado) return

    const ordenActual = ordenes.find((o) => o.id === ordenId)
    const repuestoExistente = ordenActual?.repuestos_usados?.find(
      (r) => r.repuesto === Number(repuestoSeleccionado) || r.repuesto_id === Number(repuestoSeleccionado)
    )

    try {
      if (repuestoExistente) {
        const nuevaCantidad = repuestoExistente.cantidad + Number(cantidadSeleccionada)
        await api.patch(`/ordenes-repuestos/${repuestoExistente.id}/`, {
          cantidad: nuevaCantidad,
        })
      } else {
        await api.post('/ordenes-repuestos/', {
          orden: ordenId,
          repuesto: repuestoSeleccionado,
          cantidad: cantidadSeleccionada,
        })
      }

      setRepuestoSeleccionado('')
      setCantidadSeleccionada(1)
      setBusquedaRepuesto('')
      cargarDatos()
    } catch (err) {
      const errorMsg = err.response?.data?.non_field_errors?.[0] || 
                       err.response?.data?.detail || 
                       err.response?.data?.cantidad?.[0] || 
                       err.response?.data?.[0] || 
                       'No se pudo agregar el repuesto (stock insuficiente).'
      setErrorRepuesto(errorMsg)
    }
  }

  const quitarRepuesto = async (ordenRepuestoId) => {
    try {
      await api.delete(`/ordenes-repuestos/${ordenRepuestoId}/`)
      cargarDatos()
    } catch {
      alert('No se pudo quitar el repuesto.')
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorForm('')

    if (!validarRutChilenoSimple(form.cliente_rut)) {
      setErrorForm('El RUT debe tener el formato correcto (ej: 20543210-9).')
      return
    }

    if (!validarTelefonoChile(form.cliente_telefono)) {
      setErrorForm('El teléfono debe tener exactamente 8 dígitos después del +56 9.')
      return
    }

    if (!validarPatenteChilena(form.vehiculo_patente)) {
      setErrorForm('La patente ingresada no cumple con el formato chileno válido (Ej: ABCD12 o AB1234).')
      return
    }

    setGuardando(true)
    try {
      const telefonoCompleto = `+569${form.cliente_telefono.trim()}`
      
      const payload = { 
        ...form, 
        cliente_telefono: telefonoCompleto,
        vehiculo_patente: form.vehiculo_patente.toUpperCase()
      }

      if (tecnicosBloqueados) {
        delete payload.tecnico
      } else {
        payload.tecnico = form.tecnico || null
      }

      await api.post('/ordenes/', payload)
      setModalAbierto(false)
      setForm({ 
        cliente_nombre: '', 
        cliente_rut: '', 
        cliente_telefono: '', 
        cliente_email: '', 
        cliente_calle: '', 
        cliente_numero: '', 
        cliente_region: '',
        cliente_comuna: '',
        equipo: '', 
        vehiculo_patente: '', 
        descripcion_problema: '', 
        tecnico: '', 
        estado: 'recibido' 
      })
      setComunasDisponibles([])
      cargarDatos()
    } catch (err) {
      const errorMsg = JSON.stringify(err.response?.data) || 'Revisa los datos.'
      setErrorForm(`Error al crear: ${errorMsg}`)
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
    } catch {
      setOrdenes((prev) =>
        prev.map((o) => (o.id === ordenId ? { ...o, estado: estadoAnterior } : o))
      )
    }
  }

  const repuestosFiltradosSelect = repuestos.filter((r) => {
    const texto = busquedaRepuesto.toLowerCase()
    const nombre = r.nombre?.toLowerCase() || ''
    const modelo = r.modelo?.toLowerCase() || ''
    const compatibilidades = r.compatibilidades?.toLowerCase() || ''
    return nombre.includes(texto) || modelo.includes(texto) || compatibilidades.includes(texto)
  })

  const ordenesFiltradas = ordenes.filter((o) => {
    if (!busquedaOrden.trim()) return true
    const codigoOT = `ot-${o.id}`
    const query = busquedaOrden.trim().toLowerCase()
    return codigoOT.includes(query) || o.id.toString() === query.replace('ot-', '')
  })

  const totalPaginasGlobal = Math.ceil(ordenesFiltradas.length / porPagina) || 1
  
  useEffect(() => {
    if (paginaGlobal > totalPaginasGlobal) {
      setPaginaGlobal(Math.max(totalPaginasGlobal, 1))
    }
  }, [ordenesFiltradas.length, totalPaginasGlobal, paginaGlobal])

  const inicioGlobal = (paginaGlobal - 1) * porPagina
  const finGlobal = inicioGlobal + porPagina

  const formatearFechaCorta = (fechaStr) => {
    if (!fechaStr) return null
    try {
      const fecha = new Date(fechaStr)
      if (isNaN(fecha.getTime())) return null
      return fecha.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
    } catch {
      return null
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
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={busquedaOrden}
                onChange={(e) => {
                  setBusquedaOrden(e.target.value)
                  setPaginaGlobal(1)
                }}
                placeholder="Buscar por código (Ej: OT-01)..."
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-medium shadow-sm transition-colors w-64"
              />
              {busquedaOrden && (
                <button 
                  onClick={() => setBusquedaOrden('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
                >
                  Limpiar
                </button>
              )}
            </div>

            <button
              onClick={() => setModalAbierto(true)}
              className="bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 text-white text-sm font-bold px-5 py-2.5 rounded-full flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Nueva orden
            </button>
          </div>
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start pb-6">
              {ESTADOS.map((col) => {
                const ordenesCol = ordenesFiltradas.filter((o) => o.estado === col.key)
                const esDestino = columnaSobre === col.key
                const ordenesPaginadas = ordenesCol.slice(inicioGlobal, finGlobal)

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
                    <div className={`flex items-center justify-between mb-3 px-3 py-2 rounded-xl border shrink-0 transition-colors ${col.bgHeader} ${col.borderHeader}`}>
                      <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${col.textHeader}`}>{col.titulo}</span>
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full bg-white/60 dark:bg-slate-900/60 transition-colors ${col.textHeader}`}>
                        {ordenesCol.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 min-h-[460px] flex flex-col">
                      {ordenesCol.length === 0 ? (
                        <div className="bg-white/40 dark:bg-slate-800/40 border-2 border-dashed border-slate-300 dark:border-slate-700/60 rounded-2xl p-6 text-center h-[444px] flex items-center justify-center transition-colors">
                          <p className="text-slate-400 dark:text-slate-500 text-xs font-medium transition-colors">No hay órdenes aquí</p>
                        </div>
                      ) : (
                        ordenesPaginadas.map((o) => (
                          <div
                            key={o.id}
                            draggable
                            onDragStart={() => handleDragStart(o)}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/50 rounded-2xl p-3.5 cursor-grab active:cursor-grabbing transition-all group w-full flex flex-col"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider transition-colors">
                                OT-{o.id.toString().padStart(3, '0')}
                              </span>
                              <div className="flex items-center gap-2">
                                {puedeEliminar && (
                                  <button
                                    onClick={(e) => pedirConfirmacionEliminar(o, e)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md cursor-pointer"
                                    title="Eliminar orden"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            <div className="mb-1.5">
                              <h3 className="font-bold text-slate-800 dark:text-white text-sm leading-tight transition-colors">{o.equipo}</h3>
                              {o.vehiculo_patente && (
                                <span className="inline-block mt-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold px-1.5 py-0.2 rounded tracking-wide uppercase transition-colors">
                                  Patente: {o.vehiculo_patente}
                                </span>
                              )}
                            </div>

                            <p className="text-slate-500 dark:text-slate-400 text-xs mb-3 line-clamp-2 transition-colors">
                              {o.descripcion_problema || 'Sin descripción'}
                            </p>
                            
                            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-700/50 transition-colors">
                              <div className="flex items-center justify-between text-[11px] font-medium">
                                <span className="text-slate-400 dark:text-slate-500">Cliente</span>
                                <span className="text-slate-700 dark:text-slate-300 font-semibold transition-colors">{o.cliente_nombre}</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] font-medium">
                                <span className="text-slate-400 dark:text-slate-500">Técnico</span>
                                <span className={o.tecnico_nombre ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.2 rounded transition-colors' : 'text-slate-400 dark:text-slate-600 italic transition-colors'}>
                                  {o.tecnico_nombre || 'Sin asignar'}
                                </span>
                              </div>
                              
                              {/* SECCIÓN DE IA: SOLO APARECE SI ESTÁ EN DIAGNÓSTICO, EN REPARACIÓN O LISTO, Y YA TIENE REPUESTOS */}
                              {['diagnostico', 'en_reparacion', 'listo'].includes(o.estado?.toLowerCase()) && (o.repuestos_usados?.length > 0) && (
                                <>
                                  {o.fecha_estimada ? (
                                    <div className="mt-2 p-2 rounded-xl bg-blue-50/60 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 space-y-2">
                                      <div className="flex items-center justify-between text-[11px]">
                                        <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                                          <Sparkles className="w-3 h-3" /> Entrega Est. (IA)
                                        </span>
                                        <span className="font-extrabold text-slate-800 dark:text-white">
                                          {formatearFechaCorta(o.fecha_estimada)}
                                        </span>
                                      </div>
                                      <button
                                        onClick={(e) => enviarCorreoCliente(o, e)}
                                        disabled={enviandoCorreo === o.id}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-extrabold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                                      >
                                        <Mail className="w-3 h-3" /> {enviandoCorreo === o.id ? 'Enviando...' : 'Notificar al cliente (Email)'}
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="pt-1">
                                      <button
                                        onClick={(e) => calcularEstimacionIA(o.id, e)}
                                        disabled={calculandoIA === o.id}
                                        className="w-full bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                      >
                                        <Sparkles className="w-3.5 h-3.5" /> {calculandoIA === o.id ? 'Calculando IA...' : 'Estimar tiempo (IA)'}
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                            
                            <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-700/50 transition-colors">
                              <button
                                onClick={() => {
                                  setOrdenExpandida(ordenExpandida === o.id ? null : o.id)
                                  setBusquedaRepuesto('')
                                }}
                                className="text-[11px] font-bold text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors w-full text-left flex items-center justify-between cursor-pointer"
                              >
                                {ordenExpandida === o.id ? 'Ocultar repuestos' : `Repuestos utilizados (${o.repuestos_usados?.length || 0})`}
                                <span className="text-[10px] bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.2 rounded transition-colors">{ordenExpandida === o.id ? '-' : '+'}</span>
                              </button>

                              {ordenExpandida === o.id && (
                                <div className="mt-2 space-y-1.5 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                                  {o.repuestos_usados?.map((r) => (
                                    <div key={r.id} className="flex items-center justify-between text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 shadow-sm transition-colors">
                                      <span className="font-medium text-slate-700 dark:text-slate-200 truncate pr-2 transition-colors">{r.repuesto_nombre} <span className="text-slate-400 dark:text-slate-500">x{r.cantidad}</span></span>
                                      <button onClick={() => quitarRepuesto(r.id)} className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0 cursor-pointer">
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}

                                  {!repuestosBloqueados && (
                                    <div className="flex flex-col gap-1.5 mt-2">
                                      <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">
                                          <Search className="w-3 h-3" />
                                        </span>
                                        <input
                                          type="text"
                                          value={busquedaRepuesto}
                                          onChange={(e) => setBusquedaRepuesto(e.target.value)}
                                          placeholder="Filtrar repuesto..."
                                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-7 pr-2 py-1 text-[11px] text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-400 font-medium transition-colors"
                                        />
                                      </div>

                                      <div className="flex gap-1.5">
                                        <select
                                          value={repuestoSeleccionado}
                                          onChange={(e) => setRepuestoSeleccionado(e.target.value)}
                                          className="w-full min-w-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-1.5 py-1 text-[11px] text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 font-medium transition-colors"
                                        >
                                          <option value="">Seleccionar ({repuestosFiltradosSelect.length})...</option>
                                          {repuestosFiltradosSelect.map((r) => {
                                            const compatText = r.compatibilidades ? `(${r.compatibilidades})` : (r.modelo ? `(${r.modelo})` : '(Universal)')
                                            return (
                                              <option key={r.id} value={r.id}>
                                                {r.nombre} {compatText} — Stock: {r.stock_actual}
                                              </option>
                                            )
                                          })}
                                        </select>
                                        <input
                                          type="number"
                                          min="1"
                                          value={cantidadSeleccionada}
                                          onChange={(e) => setCantidadSeleccionada(Number(e.target.value))}
                                          className="w-12 shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-1 py-1 text-[11px] text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 font-medium text-center transition-colors"
                                        />
                                      </div>
                                      <button
                                        onClick={() => agregarRepuesto(o.id)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                                      >
                                        <Plus className="w-3 h-3" /> Agregar repuesto
                                      </button>
                                    </div>
                                  )}
                                  {errorRepuesto && <p className="text-red-500 dark:text-red-400 text-[10px] font-medium mt-1">{errorRepuesto}</p>}
                                </div>
                              )}
                            </div>

                            {col.key === 'listo' && (
                              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                                <button
                                  onClick={(e) => handleEntregarOrden(o.id, e)}
                                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all cursor-pointer active:scale-95 group shadow-sm"
                                >
                                  <span className="text-xs font-bold uppercase tracking-wider">Entregar vehículo</span>
                                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-900/60 shadow-sm">
                                    ✓
                                  </span>
                                </button>
                              </div>
                            )}

                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {totalPaginasGlobal > 1 && (
              <div className="flex items-center justify-center gap-4 py-5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm mb-10">
                <button
                  onClick={() => setPaginaGlobal((p) => Math.max(p - 1, 1))}
                  disabled={paginaGlobal === 1}
                  className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </button>
                
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Página {paginaGlobal} de {totalPaginasGlobal}
                </span>

                <button
                  onClick={() => setPaginaGlobal((p) => Math.min(p + 1, totalPaginasGlobal))}
                  disabled={paginaGlobal === totalPaginasGlobal}
                  className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-30 transition-colors cursor-pointer"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* MODAL NUEVA ORDEN */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center px-4 z-50 overflow-y-auto py-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-8 shadow-2xl transition-colors my-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-extrabold text-xl text-slate-800 dark:text-white transition-colors">Nueva orden de trabajo</h2>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">🇨🇱 Validación Chile activa</span>
                </div>
                <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Nombre del cliente</label>
                    <input
                      name="cliente_nombre"
                      value={form.cliente_nombre}
                      onChange={handleChange}
                      placeholder="Ej. Juan Pérez"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">RUT (Ej: 12345678-9)</label>
                    <input
                      name="cliente_rut"
                      value={form.cliente_rut}
                      onChange={handleChange}
                      placeholder="12345678-9"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Correo electrónico</label>
                  <input
                    type="email"
                    name="cliente_email"
                    value={form.cliente_email}
                    onChange={handleChange}
                    placeholder="cliente@correo.cl"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Teléfono (Chile)</label>
                    <div className="flex items-center w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 focus-within:border-blue-500 transition-colors">
                      <span className="text-slate-400 dark:text-slate-500 text-sm font-bold mr-1 shrink-0 select-none">
                        +56 9
                      </span>
                      <input
                        name="cliente_telefono"
                        maxLength="8"
                        value={form.cliente_telefono}
                        onChange={handleChange}
                        placeholder="12345678"
                        required
                        className="w-full bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Región</label>
                    <select
                      value={form.cliente_region || ''}
                      onChange={handleRegionChange}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                    >
                      <option value="">Selecciona región...</option>
                      {datosChile.regiones.map((r) => (
                        <option key={r.region} value={r.region}>{r.region}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Comuna</label>
                    <select
                      name="cliente_comuna"
                      value={form.cliente_comuna || ''}
                      onChange={handleChange}
                      disabled={!form.cliente_region}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <option value="">Selecciona comuna...</option>
                      {comunasDisponibles.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">Calle</label>
                      <input
                        name="cliente_calle"
                        value={form.cliente_calle}
                        onChange={handleChange}
                        placeholder="Av. Libertador"
                        required
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">Número</label>
                      <input
                        name="cliente_numero"
                        value={form.cliente_numero}
                        onChange={handleChange}
                        placeholder="1234"
                        required
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Modelo del vehículo</label>
                    <input
                      name="equipo"
                      value={form.equipo}
                      onChange={handleChange}
                      placeholder="Ej. Toyota Corolla"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Patente (Chile)</label>
                    <input
                      name="vehiculo_patente"
                      value={form.vehiculo_patente}
                      onChange={handleChange}
                      placeholder="Ej. ABCD12 o AB1234"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium uppercase transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Descripción del problema</label>
                  <textarea
                    name="descripcion_problema"
                    value={form.descripcion_problema}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Detalle de la falla..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium resize-none transition-colors"
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
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium appearance-none transition-colors"
                    >
                      <option value="">Sin asignar</option>
                      {tecnicos.map((t) => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                      ))}
                    </select>
                  </div>
                )}

                {errorForm && (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium rounded-xl px-4 py-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errorForm}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={guardando}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 text-white font-bold py-3.5 rounded-xl disabled:opacity-60 text-sm cursor-pointer"
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
                  className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarEliminar}
                  disabled={eliminando}
                  className="flex-1 bg-red-500 hover:bg-red-600 transition-colors shadow-md shadow-red-500/20 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-60 cursor-pointer"
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