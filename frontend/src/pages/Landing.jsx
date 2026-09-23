import logo from '../assets/logo.png'
import { Calendar, ClipboardList, Package, BarChart3, ArrowRight, Sun, Moon, Wrench, ShieldCheck, Clock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Landing() {
  const [numeroOrden, setNumeroOrden] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate()

  // Efecto para manejar el modo oscuro en el DOM
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const buscarOrden = (e) => {
    e.preventDefault()
    if (numeroOrden.trim()) {
      navigate(`/seguimiento/${numeroOrden.trim()}`)
    }
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen font-sans transition-colors duration-300">
      
      {/* HEADER / NAVEGACIÓN */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <img src={logo} alt="SIGMA Logo" className="h-9 w-auto" />
            <span className="font-extrabold text-2xl tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SIGMA
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Inicio</a>
            <a href="#modulos" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Soluciones</a>
            <a href="#seguimiento" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Portal Clientes</a>
          </nav>
          
          <div className="flex items-center gap-4">
            {/* Botón Modo Oscuro */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Cambiar modo oscuro"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            <Link 
              to="/login" 
              className="hidden sm:inline-block text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 transition-colors"
            >
              Iniciar Sesión
            </Link>
            
            <button className="bg-blue-600 hover:bg-blue-700 transition-all text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95">
              Acceso Taller
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6">
            <Wrench className="w-3.5 h-3.5" /> La plataforma definitiva para talleres mecánicos
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
            Control total de tu taller, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              sin complicaciones.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Optimiza tus órdenes de trabajo, administra repuestos en tiempo real y ofrece un portal transparente para tus clientes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#seguimiento" 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-xl shadow-blue-600/20 transition-all text-center"
            >
              Rastrear mi Vehículo
            </a>
            <a 
              href="#modulos" 
              className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-8 py-4 rounded-xl transition-all text-center"
            >
              Conocer Módulos
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Datos seguros en la nube
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> Implementación inmediata
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN DE MÓDULOS / CARACTERÍSTICAS */}
      <section id="modulos" className="py-24 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Diseñado para el flujo real de un taller
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Cada herramienta en SIGMA está pensada para ahorrar tiempo y eliminar errores humanos en el día a día.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Calendar, 
                title: 'Agendamiento Online', 
                desc: 'Organiza las citas de los clientes y asigna técnicos de forma visual y rápida.' 
              },
              { 
                icon: ClipboardList, 
                title: 'Órdenes en Tiempo Real', 
                desc: 'Controla el estado exacto de cada vehículo: recepción, diagnóstico, taller y entrega.' 
              },
              { 
                icon: Package, 
                title: 'Control de Inventario', 
                desc: 'Lleva el registro automático de repuestos, stock mínimo y precios actualizados.' 
              },
              { 
                icon: BarChart3, 
                title: 'Reportes y Métricas', 
                desc: 'Visualiza el rendimiento financiero y la productividad del personal con estadísticas claras.' 
              },
            ].map((item, index) => (
              <div 
                key={index} 
                className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* PORTAL DE CLIENTES (SEGUIMIENTO) */}
      <section id="seguimiento" className="py-24 px-6 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-3xl mx-auto text-center">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Portal de Seguimiento
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto text-sm sm:text-base">
              ¿Dejaste tu vehículo en el taller? Ingresa tu número de orden o código de seguimiento para ver su estado actual al instante.
            </p>
            
            <form onSubmit={buscarOrden} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="text"
                value={numeroOrden}
                onChange={(e) => setNumeroOrden(e.target.value)}
                placeholder="Ej. ORD-042 o ID de orden"
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-6 py-3.5 rounded-xl text-sm shadow-md shadow-blue-600/20 whitespace-nowrap"
              >
                Consultar
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center text-sm text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="SIGMA" className="h-6 w-auto" />
            <span className="font-bold text-slate-800 dark:text-white">SIGMA Taller</span>
          </div>
          <p>© {new Date().getFullYear()} Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  )
}

export default Landing