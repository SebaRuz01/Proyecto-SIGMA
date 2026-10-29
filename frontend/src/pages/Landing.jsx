import logo from '../assets/logo.png'
import api from '../api/axios'
import { 
  Search, Sun, Moon, Wrench, ArrowRight, CheckCircle2, 
  ClipboardList, Package, UserCheck, Car, Clock, 
  ShieldCheck, ChevronRight, Sparkles, Mail, Plus, X, RotateCcw,
  Building2, Send, Check, AlertCircle
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const CATALOGO_REPUESTOS_DEMO = [
  { id: 1, nombre: 'Juego Pastillas Cerámica (Yaris)', stockInicial: 6 },
  { id: 2, nombre: 'Líquido de Frenos DOT4 Sintético', stockInicial: 12 },
  { id: 3, nombre: 'Filtro de Aceite Original Toyota', stockInicial: 9 },
]

function Landing() {
  const [numeroOrden, setNumeroOrden] = useState('')
  const [errorBusqueda, setErrorBusqueda] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [tabActiva, setTabActiva] = useState('kanban')
  const navigate = useNavigate()

  // 1. Estados interactivos para la Demo 1: Kanban
  const [indiceEstadoKanban, setIndiceEstadoKanban] = useState(1)
  const [iaCalculadaDemo, setIaCalculadaDemo] = useState(false)
  const [calculandoIaDemo, setCalculandoIaDemo] = useState(false)
  const [correoEnviadoDemo, setCorreoEnviadoDemo] = useState(false)

  // 2. Estados interactivos para la Demo 2: Repuestos
  const [repuestosCargadosDemo, setRepuestosCargadosDemo] = useState([
    { id: 1, nombre: 'Juego Pastillas Cerámica (Yaris)', cantidad: 1 },
    { id: 2, nombre: 'Líquido de Frenos DOT4 Sintético', cantidad: 2 },
  ])
  const [repuestoSelectDemo, setRepuestoSelectDemo] = useState('3')

  // 3. Estados interactivos para la Demo 3: Recepción / Sin asignar
  const [tecnicoElegidoDemo, setTecnicoElegidoDemo] = useState('')
  const [ordenAsignadaDemo, setOrdenAsignadaDemo] = useState(false)

  // 4. Estados para Planes y Formulario de Contacto validado
  const [planSeleccionado, setPlanSeleccionado] = useState('Profesional')
  const [formContacto, setFormContacto] = useState({
    nombreTaller: '',
    nombreContacto: '',
    email: '',
    telefono: '',
    mensaje: ''
  })
  const [errorContacto, setErrorContacto] = useState('')
  const [enviandoForm, setEnviandoForm] = useState(false)
  const [enviadoExito, setEnviadoExito] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleOrdenChange = (e) => {
    setErrorBusqueda('')
    const valorLimpio = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '')
    setNumeroOrden(valorLimpio)
  }

  const buscarOrden = (e) => {
    e.preventDefault()
    const raw = numeroOrden.trim().toUpperCase()
    
    if (!raw || raw.length < 1) {
      setErrorBusqueda('Ingresa un código de seguimiento válido (Ej: 2CFF9F7A).')
      return
    }

    let codigoFinal = raw
    if (raw.startsWith('OT-')) {
      codigoFinal = raw.replace('OT-', '').replace(/^0+/, '') || '0'
    }

    if (codigoFinal.length < 1) {
      setErrorBusqueda('Ingresa un código de seguimiento válido (Ej: 2CFF9F7A).')
      return
    }

    navigate(`/seguimiento/${codigoFinal}`)
  }

  const scrollToSection = (e, id) => {
    e.preventDefault()
    if (id === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const avanzarEstadoKanban = () => {
    setIndiceEstadoKanban((prev) => (prev + 1) % 4)
  }

  const simularCalculoIA = () => {
    setCalculandoIaDemo(true)
    setTimeout(() => {
      setCalculandoIaDemo(false)
      setIaCalculadaDemo(true)
    }, 450)
  }

  const agregarRepuestoDemo = () => {
    const itemCatalogo = CATALOGO_REPUESTOS_DEMO.find(r => r.id === Number(repuestoSelectDemo))
    if (!itemCatalogo) return

    setRepuestosCargadosDemo(prev => {
      const existe = prev.find(p => p.id === itemCatalogo.id)
      if (existe) {
        if (existe.cantidad >= itemCatalogo.stockInicial) return prev
        return prev.map(p => p.id === itemCatalogo.id ? { ...p, cantidad: p.cantidad + 1 } : p)
      }
      return [...prev, { id: itemCatalogo.id, nombre: itemCatalogo.nombre, cantidad: 1 }]
    })
  }

  const quitarRepuestoDemo = (id) => {
    setRepuestosCargadosDemo(prev => prev.filter(p => p.id !== id))
  }

  const handleContactoChange = (e) => {
    const { name, value } = e.target
    setErrorContacto('')

    if (name === 'telefono') {
      const soloNumeros = value.replace(/\D/g, '').slice(0, 8)
      setFormContacto({ ...formContacto, telefono: soloNumeros })
      return
    }

    if (name === 'nombreContacto') {
      const sinNumeros = value.replace(/[0-9]/g, '')
      setFormContacto({ ...formContacto, nombreContacto: sinNumeros })
      return
    }

    setFormContacto({ ...formContacto, [name]: value })
  }

  const handleEnviarContacto = async (e) => {
    e.preventDefault()
    setErrorContacto('')

    if (formContacto.nombreTaller.trim().length < 2) {
      setErrorContacto('Por favor ingresa el nombre de tu taller.')
      return
    }

    if (formContacto.nombreContacto.trim().length < 3) {
      setErrorContacto('Por favor ingresa tu nombre y apellido.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formContacto.email.trim())) {
      setErrorContacto('Ingresa un correo electrónico válido.')
      return
    }

    if (formContacto.telefono.length !== 8) {
      setErrorContacto('El teléfono debe tener exactamente 8 dígitos después del +56 9.')
      return
    }

    setEnviandoForm(true)

    const payload = {
      nombre_taller: formContacto.nombreTaller.trim(),
      nombre_contacto: formContacto.nombreContacto.trim(),
      email: formContacto.email.trim(),
      telefono: `+569${formContacto.telefono}`,
      plan: planSeleccionado,
      mensaje: formContacto.mensaje.trim() || 'Ninguno especificado.'
    }

    try {
      // Conexión limpia con la instancia de Axios a Render
      await api.post('/contacto/', payload)
      setEnviandoForm(false)
      setEnviadoExito(true)
    } catch (error) {
      console.error('Error al guardar solicitud en la BD:', error)
      setErrorContacto('No se pudo registrar la solicitud en el servidor. Intenta nuevamente.')
      setEnviandoForm(false)
    }
  }

  const obtenerEtapaKanbanConfig = (idx) => {
    switch(idx) {
      case 0:
        return { label: 'Recibido', badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700', bar: 'bg-slate-500' }
      case 1:
        return { label: 'Diagnóstico', badgeBg: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30', bar: 'bg-blue-500' }
      case 2:
        return { label: 'En reparación', badgeBg: 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-500/30', bar: 'bg-teal-500' }
      case 3:
      default:
        return { label: 'Listo para retiro', badgeBg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20', bar: 'bg-emerald-500' }
    }
  }

  const etapaKanbanActual = obtenerEtapaKanbanConfig(indiceEstadoKanban)

  return (
    <div 
      className="bg-white dark:bg-[#090d16] text-slate-900 dark:text-slate-100 min-h-screen antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200 overflow-x-hidden overflow-y-scroll"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700;800&family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .font-heading { font-family: 'Outfit', sans-serif; letter-spacing: -0.025em; }
        .font-mono-code { font-family: 'JetBrains Mono', monospace; }
      `}</style>
      
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-teal-500 to-amber-500"></div>
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0d1320]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-8">
            <a href="#" onClick={(e) => scrollToSection(e, '#')} className="flex items-center gap-2.5 group">
              <img src={logo} alt="SIGMA" className="h-8 w-auto group-hover:scale-105 transition-transform" />
              <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                SIGMA
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <a href="#plataforma" onClick={(e) => scrollToSection(e, '#plataforma')} className="hover:text-blue-600 dark:hover:text-white transition-colors">
                Simulador Interactivo
              </a>
              <a href="#ventajas" onClick={(e) => scrollToSection(e, '#ventajas')} className="hover:text-teal-600 dark:hover:text-white transition-colors">
                Ventajas Operativas
              </a>
              <a href="#planes" onClick={(e) => scrollToSection(e, '#planes')} className="hover:text-blue-600 dark:hover:text-white transition-colors">
                Planes
              </a>
              <a href="#contacto" onClick={(e) => scrollToSection(e, '#contacto')} className="hover:text-amber-500 dark:hover:text-white transition-colors">
                Contratar
              </a>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Cambiar modo de color"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link 
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-sm shadow-blue-600/20 transition-all flex items-center gap-1.5 active:scale-95"
            >
              Acceso Taller <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </header>

      {/* SECCIÓN PRINCIPAL DIVIDIDA */}
      <section className="py-12 md:py-20 px-6 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-slate-50 to-white dark:from-[#0d1320] dark:to-[#090d16]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 px-3 py-1.5 rounded-lg">
              <Wrench className="w-3.5 h-3.5" /> Plataforma de Gestión Automotriz
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-slate-900 dark:text-white leading-[1.08]">
              El taller ordenado. <br />
              <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                El cliente informado al instante.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              SIGMA organiza el flujo completo desde que un vehículo ingresa por recepción hasta que se entregan las llaves: asignación de mecánicos, control de repuestos utilizados y consulta de estado en línea.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <a 
                href="#contacto"
                onClick={(e) => scrollToSection(e, '#contacto')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md shadow-blue-600/20 transition-all"
              >
                Contratar para mi Taller
              </a>
              <a 
                href="#plataforma"
                onClick={(e) => scrollToSection(e, '#plataforma')}
                className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 px-5 py-3.5 rounded-xl transition-colors flex items-center gap-1"
              >
                Probar simulador abajo <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 dark:border-slate-800/80 max-w-lg text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="border-l-2 border-blue-500 pl-3">
                <strong className="font-heading block text-slate-900 dark:text-white text-base font-bold">4 Etapas</strong>
                Recibido a Listo
              </div>
              <div className="border-l-2 border-teal-500 pl-3">
                <strong className="font-heading block text-slate-900 dark:text-white text-base font-bold">Inventario</strong>
                Descuento por OT
              </div>
              <div className="border-l-2 border-amber-500 pl-3">
                <strong className="font-heading block text-slate-900 dark:text-white text-base font-bold">Alertas IA</strong>
                Aviso vía Email
              </div>
            </div>
          </div>

          {/* Lado Derecho: Tarjeta de Clientes */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#111827] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-colors">
              
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-2.5 py-1 rounded-md">
                    Portal de Clientes
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    En línea
                  </span>
                </div>

                <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-1.5">
                  Rastrea tu vehículo
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  Ingresa tu código de seguimiento entregado por el taller para consultar el progreso en tiempo real.
                </p>

                <form onSubmit={buscarOrden} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Código de Seguimiento
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={numeroOrden}
                        onChange={handleOrdenChange}
                        maxLength={12}
                        placeholder="Ej: 2CFF9F7A"
                        className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-300 dark:border-slate-700 focus:border-teal-500 rounded-xl pl-10 pr-20 py-3.5 text-sm text-slate-900 dark:text-white font-mono-code font-bold focus:outline-none transition-colors placeholder:text-slate-400 placeholder:font-sans placeholder:font-normal"
                        required
                      />
                      {numeroOrden && (
                        <button
                          type="button"
                          onClick={() => {
                            setNumeroOrden('')
                            setErrorBusqueda('')
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold cursor-pointer"
                        >
                          Limpiar
                        </button>
                      )}
                    </div>
                  </div>

                  {errorBusqueda && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errorBusqueda}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold py-3.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-blue-600/20 active:scale-[0.99]"
                  >
                    Consultar estado real
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-center">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    ¿Eres mecánico o administrador? <Link to="/login" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">Accede al panel interno</Link>
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN INTERACTIVA: SANDBOX DE MÓDULOS */}
      <section id="plataforma" className="py-16 md:py-24 px-6 overflow-hidden bg-white dark:bg-[#090d16]">
        <div className="max-w-6xl mx-auto">
          
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Simulador en Vivo
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Interactúa con los módulos del taller aquí mismo
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
              Prueba cómo se comporta una tarjeta de trabajo, cómo se rebaja el inventario o cómo se asigna un mecánico.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 mb-8">
            <button
              type="button"
              onClick={() => {
                setTabActiva('kanban')
                setIndiceEstadoKanban(2)
              }}
              className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                tabActiva === 'kanban'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-100 dark:bg-[#111827] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-400'
              }`}
            >
              <ClipboardList className="w-4 h-4 shrink-0" /> 1. Probar Tarjeta de Orden
            </button>

            <button
              type="button"
              onClick={() => setTabActiva('repuestos')}
              className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                tabActiva === 'repuestos'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-slate-100 dark:bg-[#111827] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-teal-400'
              }`}
            >
              <Package className="w-4 h-4 shrink-0" /> 2. Probar Descuento de Stock
            </button>

            <button
              type="button"
              onClick={() => setTabActiva('recepcion')}
              className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                tabActiva === 'recepcion'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-[#111827] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-400'
              }`}
            >
              <UserCheck className="w-4 h-4 shrink-0" /> 3. Probar Asignación de Técnico
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start shadow-sm">
            
            <div className="lg:col-span-5 space-y-4 min-w-0">
              {tabActiva === 'kanban' && (
                <>
                  <span className="inline-block text-[11px] font-mono-code font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    Módulo interactivo 01
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Avanza el estado y estima la entrega con IA
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Haz clic en los botones de la tarjeta derecha para cambiar el vehículo de etapa (incluyendo <strong>"En reparación"</strong>), calcular su fecha estimada de entrega y enviar el aviso al correo del cliente.
                  </p>
                </>
              )}

              {tabActiva === 'repuestos' && (
                <>
                  <span className="inline-block text-[11px] font-mono-code font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    Módulo interactivo 02
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Agrega o quita repuestos en vivo
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Selecciona un repuesto en el panel derecho y agrégalo a la orden. Verás cómo el stock disponible en bodega disminuye al instante, y si lo eliminas, el stock se recupera.
                  </p>
                </>
              )}

              {tabActiva === 'recepcion' && (
                <>
                  <span className="inline-block text-[11px] font-mono-code font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
                    Módulo interactivo 03
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Asigna un técnico y limpia la bandeja
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Las órdenes recién creadas sin mecánico no ensucian el tablero principal. Elige un técnico en el selector de la derecha para enviar el vehículo directamente al Kanban.
                  </p>
                </>
              )}
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-[#090d16] p-4 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 min-w-0 overflow-hidden h-[500px] flex flex-col justify-center">
              
              {/* DEMO 1: KANBAN INTERACTIVO */}
              {tabActiva === 'kanban' && (
                <div className="max-w-md mx-auto w-full bg-[#f8fafc] dark:bg-[#111827] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md relative overflow-hidden min-w-0">
                  <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${etapaKanbanActual.bar}`}></div>
                  
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-3 min-w-0">
                    <span className="text-[11px] font-mono-code font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shrink-0">
                      2CFF9F7A
                    </span>
                    <span className={`text-[11px] font-bold border px-2.5 py-1 rounded-full uppercase transition-all tracking-tight shrink-0 max-w-full truncate ${etapaKanbanActual.badgeBg}`}>
                      {etapaKanbanActual.label}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                        Hyundai - Accent (2021)
                      </h4>
                      <span className="inline-block mt-1 font-mono-code bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase truncate max-w-full">
                        Patente: ABCD22
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={avanzarEstadoKanban}
                      className="text-xs font-bold bg-slate-900 dark:bg-white hover:bg-blue-600 dark:hover:bg-blue-400 text-white dark:text-slate-950 px-3 py-2 rounded-xl transition-colors cursor-pointer shrink-0 shadow-sm"
                    >
                      Avanzar →
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 mb-3 leading-relaxed break-words">
                    Fallo en rueda delantera y revisión de pastillas de freno.
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs min-w-0">
                    <div className="flex justify-between gap-2 min-w-0">
                      <span className="text-slate-500 dark:text-slate-400 shrink-0">Cliente</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">Juan Pérez</span>
                    </div>
                    <div className="flex justify-between gap-2 min-w-0">
                      <span className="text-slate-500 dark:text-slate-400 shrink-0">Técnico</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded truncate">
                        Isaac Arriagada
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 min-w-0">
                    {!iaCalculadaDemo ? (
                      <button
                        type="button"
                        onClick={simularCalculoIA}
                        disabled={calculandoIaDemo}
                        className="w-full bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer min-w-0"
                      >
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{calculandoIaDemo ? 'Calculando con IA...' : 'Probar Estimación de Entrega (IA)'}</span>
                      </button>
                    ) : (
                      <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-500/10 border border-blue-200/70 dark:border-blue-500/20 space-y-2 min-w-0">
                        <div className="flex items-center justify-between text-xs gap-2">
                          <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 truncate">
                            <Sparkles className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Entrega Est. (IA)</span>
                          </span>
                          <span className="font-mono-code font-extrabold text-slate-900 dark:text-white shrink-0">
                            29-10-2026
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCorreoEnviadoDemo(true)}
                          className={`w-full text-xs font-extrabold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer min-w-0 ${
                            correoEnviadoDemo
                              ? 'bg-emerald-600 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{correoEnviadoDemo ? '¡Correo enviado!' : 'Notificar al cliente (Email)'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* DEMO 2: REPUESTOS E INVENTARIO INTERACTIVO */}
              {tabActiva === 'repuestos' && (
                <div className="max-w-md mx-auto w-full bg-[#f8fafc] dark:bg-[#111827] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4 relative overflow-hidden min-w-0">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500"></div>

                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2 min-w-0">
                    <div className="min-w-0">
                      <span className="font-heading text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block">
                        Repuestos en Orden ({repuestosCargadosDemo.length})
                      </span>
                      <p className="text-[11px] text-slate-500 truncate">Toyota - Yaris (2020) · Patente ABXD98</p>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 px-2 py-1 rounded-lg shrink-0">
                      Stock en vivo
                    </span>
                  </div>

                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {repuestosCargadosDemo.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4 italic">
                        No hay repuestos cargados. Agrega uno abajo para probar.
                      </p>
                    ) : (
                      repuestosCargadosDemo.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs gap-2 min-w-0">
                          <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                            {item.nombre} <span className="font-mono-code font-bold text-teal-600 dark:text-teal-400 ml-1">x{item.cantidad}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => quitarRepuestoDemo(item.id)}
                            className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer shrink-0"
                            title="Quitar repuesto y devolver stock"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-2 min-w-0">
                    <select
                      value={repuestoSelectDemo}
                      onChange={(e) => setRepuestoSelectDemo(e.target.value)}
                      className="flex-1 min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-teal-500 truncate"
                    >
                      {CATALOGO_REPUESTOS_DEMO.map((cat) => {
                        const usado = repuestosCargadosDemo.find(u => u.id === cat.id)?.cantidad || 0
                        const disponible = cat.stockInicial - usado
                        return (
                          <option key={cat.id} value={cat.id}>
                            {cat.nombre} — Stock disp: {disponible}
                          </option>
                        )
                      })}
                    </select>
                    <button
                      type="button"
                      onClick={agregarRepuestoDemo}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Agregar
                    </button>
                  </div>
                </div>
              )}

              {/* DEMO 3: RECEPCIÓN Y BANDEJA SIN ASIGNAR INTERACTIVA */}
              {tabActiva === 'recepcion' && (
                <div className="max-w-md mx-auto w-full bg-[#f8fafc] dark:bg-[#111827] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md relative overflow-hidden min-w-0">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>

                  <div className="flex items-center justify-between mb-4 gap-2 min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2.5 py-1 rounded-lg truncate">
                      Bandeja: Órdenes sin asignar
                    </span>
                    <span className="text-xs font-mono-code text-slate-400 shrink-0">
                      {ordenAsignadaDemo ? '0 pendientes' : '1 pendiente'}
                    </span>
                  </div>

                  {!ordenAsignadaDemo ? (
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 min-w-0">
                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <p className="font-heading text-sm font-bold text-slate-900 dark:text-white truncate">
                              Chevrolet - Sail (2020)
                            </p>
                            <span className="text-[10px] font-mono-code font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded shrink-0">
                              HBNO90
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">
                            Cliente: Juan Pérez · Ruido metálico en motor
                          </p>
                        </div>
                        <span className="text-[11px] italic text-amber-600 dark:text-amber-400 font-semibold shrink-0">
                          Sin técnico
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 min-w-0">
                        <select
                          value={tecnicoElegidoDemo}
                          onChange={(e) => setTecnicoElegidoDemo(e.target.value)}
                          className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white font-semibold focus:outline-none focus:border-amber-500 truncate"
                        >
                          <option value="">Seleccionar técnico disponible...</option>
                          <option value="Isaac Arriagada">Isaac Arriagada (Frenos y Motor)</option>
                          <option value="Sebastián Ruz">Sebastián Ruz (Diagnóstico y Electrónica)</option>
                          <option value="Lucas Baeza">Lucas Baeza (Suspensión y Transmisión)</option>
                        </select>
                        <button
                          type="button"
                          disabled={!tecnicoElegidoDemo}
                          onClick={() => setOrdenAsignadaDemo(true)}
                          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
                        >
                          Asignar al Kanban
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-center space-y-3">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                      <div>
                        <p className="font-heading text-sm font-bold text-slate-900 dark:text-white">
                          ¡Orden asignada a {tecnicoElegidoDemo}!
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          El Chevrolet Sail (2020) salió de esta bandeja y ya aparece en la columna "Recibido" del tablero principal.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setOrdenAsignadaDemo(false)
                          setTecnicoElegidoDemo('')
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reiniciar demostración
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN DE VENTAJAS CON TARJETAS CROMÁTICAS */}
      <section id="ventajas" className="py-16 px-6 bg-slate-50 dark:bg-[#0d1320] border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base mb-1">
                  Ficha Única por Patente
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Si el vehículo vuelve al taller, sus datos de marca, modelo, año y cliente se actualizan sin duplicar registros.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base mb-1">
                  Estimación y Aviso por Correo
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Calcula la fecha estimada de término directamente desde la tarjeta de la orden y notifica al cliente con un clic.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base mb-1">
                  Roles de Administrador y Técnico
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Accesos separados para administración y mecánicos, manteniendo protegida la creación y eliminación de órdenes.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECCIÓN DE PLANES Y SUSCRIPCIÓN */}
      <section id="planes" className="py-16 md:py-24 px-6 bg-white dark:bg-[#090d16] border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Planes para Talleres
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Elige la modalidad para tu operación
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Plan Profesional */}
            <div className={`p-7 rounded-3xl transition-all flex flex-col justify-between ${
              planSeleccionado === 'Profesional' 
                ? 'bg-slate-50 dark:bg-[#111827] border-2 border-blue-600 dark:border-blue-500 shadow-xl' 
                : 'bg-white dark:bg-[#111827]/60 border border-slate-200 dark:border-slate-800'
            }`}>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full">
                    Plan Profesional
                  </span>
                  <span className="text-[11px] font-mono-code text-slate-400">Taller independiente</span>
                </div>
                <div className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                  $49.990 <span className="text-xs font-sans font-normal text-slate-500">/ mes + IVA</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                  Digitalización completa de recepción, tablero Kanban e inventario de repuestos.
                </p>

                <ul className="space-y-2.5 mb-8 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" /> Órdenes de trabajo ilimitadas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" /> Hasta 5 cuentas de técnicos mecánicos
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" /> Control de inventario y stock en vivo
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" /> Portal público de seguimiento para clientes
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPlanSeleccionado('Profesional')
                  const el = document.getElementById('contacto')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                  planSeleccionado === 'Profesional'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {planSeleccionado === 'Profesional' ? 'Plan seleccionado ✓' : 'Elegir Plan Profesional'}
              </button>
            </div>

            {/* Plan Empresas */}
            <div className={`p-7 rounded-3xl transition-all flex flex-col justify-between ${
              planSeleccionado === 'Empresas' 
                ? 'bg-slate-50 dark:bg-[#111827] border-2 border-teal-600 dark:border-teal-500 shadow-xl' 
                : 'bg-white dark:bg-[#111827]/60 border border-slate-200 dark:border-slate-800'
            }`}>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-3 py-1 rounded-full">
                    Plan Empresas
                  </span>
                  <span className="text-[11px] font-mono-code text-slate-400">Alto volumen / Multitaller</span>
                </div>
                <div className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                  $89.990 <span className="text-xs font-sans font-normal text-slate-500">/ mes + IVA</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                  Capacidad extendida, estimación con IA y soporte prioritario para tu operación.
                </p>

                <ul className="space-y-2.5 mb-8 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-600 shrink-0" /> Todo lo incluido en el plan Profesional
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-600 shrink-0" /> Técnicos mecánicos ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-600 shrink-0" /> Estimación de entregas con IA y avisos email
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-600 shrink-0" /> Reportes financieros y métricas de taller
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPlanSeleccionado('Empresas')
                  const el = document.getElementById('contacto')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                  planSeleccionado === 'Empresas'
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {planSeleccionado === 'Empresas' ? 'Plan seleccionado ✓' : 'Elegir Plan Empresas'}
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FORMULARIO DE CONTACTO Y CONTRATACIÓN GUARDADO EN BASE DE DATOS */}
      <section id="contacto" className="py-16 md:py-24 px-6 bg-slate-50 dark:bg-[#0d1320] border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-2xl mx-auto">
          
          <div className="mb-8 text-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Contacto Comercial
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Solicita SIGMA para tu taller
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Modalidad elegida: <strong className="text-blue-600 dark:text-blue-400">Plan {planSeleccionado}</strong>. Completa tus datos para activar tu cuenta.
            </p>
          </div>

          {!enviadoExito ? (
            <form onSubmit={handleEnviarContacto} className="space-y-4 bg-white dark:bg-[#111827] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm" noValidate>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nombre del Taller
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="nombreTaller"
                      maxLength={60}
                      value={formContacto.nombreTaller}
                      onChange={handleContactoChange}
                      placeholder="Ej. Taller Autofix"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-3 py-3 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    name="nombreContacto"
                    maxLength={60}
                    value={formContacto.nombreContacto}
                    onChange={handleContactoChange}
                    placeholder="Ej. Sebastián Ruz"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      maxLength={80}
                      value={formContacto.email}
                      onChange={handleContactoChange}
                      placeholder="contacto@taller.cl"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-3 py-3 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Teléfono (Chile)
                  </label>
                  <div className="flex items-center w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 focus-within:border-blue-600 transition-colors">
                    <span className="text-slate-400 text-xs font-mono-code font-bold mr-1.5 shrink-0 select-none">
                      +56 9
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      name="telefono"
                      maxLength={8}
                      value={formContacto.telefono}
                      onChange={handleContactoChange}
                      placeholder="12345678"
                      className="w-full bg-transparent text-xs font-mono-code text-slate-900 dark:text-white font-bold focus:outline-none"
                      required
                    />
                    <span className="text-[10px] font-mono-code text-slate-400 ml-1">
                      {formContacto.telefono.length}/8
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mensaje o requerimientos (Opcional)
                </label>
                <textarea
                  name="mensaje"
                  maxLength={300}
                  value={formContacto.mensaje}
                  onChange={handleContactoChange}
                  rows={3}
                  placeholder="Cuéntanos cuántos mecánicos trabajan en tu taller..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-3 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              {errorContacto && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorContacto}
                </div>
              )}

              <button
                type="submit"
                disabled={enviandoForm}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {enviandoForm ? 'Enviando solicitud...' : `Solicitar contratación Plan ${planSeleccionado}`}
              </button>
            </form>
          ) : (
            <div className="p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                ¡Solicitud recibida con éxito!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Hemos registrado los datos de <strong>{formContacto.nombreTaller}</strong> para el <strong>Plan {planSeleccionado}</strong>. Te contactaremos al <strong>+56 9 {formContacto.telefono}</strong> y al correo <strong>{formContacto.email}</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setEnviadoExito(false)
                  setFormContacto({ nombreTaller: '', nombreContacto: '', email: '', telefono: '', mensaje: '' })
                }}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer pt-2"
              >
                Enviar otra consulta
              </button>
            </div>
          )}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-[#090d16]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="SIGMA" className="h-5 w-auto" />
            <span className="font-heading font-extrabold text-slate-800 dark:text-white">SIGMA</span>
            <span>— Gestión de Talleres Automotrices</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-colors">
              Iniciar sesión
            </Link>
            <span>© {new Date().getFullYear()} SIGMA</span>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Landing