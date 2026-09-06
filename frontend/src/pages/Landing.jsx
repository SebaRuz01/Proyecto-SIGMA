import logo from '../assets/logo.png'
import { Calendar, ClipboardList, Package, BarChart3, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Landing() {
  const [numeroOrden, setNumeroOrden] = useState('')
  const navigate = useNavigate()

  const buscarOrden = (e) => {
    e.preventDefault()
    if (numeroOrden.trim()) {
      navigate(`/seguimiento/${numeroOrden.trim()}`)
    }
  }

  return (
    <div className="bg-[#f4f7fb] text-slate-900 min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 relative">
      
      {/* IMAGEN DE FONDO SIMULADA (Taller brillante/claro) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex justify-center opacity-30">
        <div className="w-full max-w-[1400px] h-[800px] bg-gradient-to-b from-blue-100 via-transparent to-transparent bg-[length:100px_100px] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)]"></div>
        {/* Luces y reflejos de fondo */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
      </div>

      {/* NAVBAR */}
      <header className="relative z-50 bg-white shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo Original */}
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="SIGMA" className="h-8 w-auto" />
            <span className="font-bold text-xl tracking-tight text-slate-800">SIGMA</span>
          </div>
          
          {/* Enlaces centrales */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Inicio</a>
            <a href="#modulos" className="hover:text-blue-600 transition-colors pb-1 border-b-2 border-transparent hover:border-blue-200">Soluciones</a>
            <a href="#modulos" className="hover:text-blue-600 transition-colors pb-1 border-b-2 border-transparent hover:border-blue-200">Módulos</a>
            <a href="#seguimiento" className="hover:text-blue-600 transition-colors pb-1 border-b-2 border-transparent hover:border-blue-200">Portal Clientes</a>
            <a href="#contacto" className="hover:text-blue-600 transition-colors pb-1 border-b-2 border-transparent hover:border-blue-200">Contacto</a>
          </nav>
          
          {/* Botones derechos */}
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-blue-600">
              Sign In
            </Link>
            <button className="bg-blue-400 hover:bg-blue-500 transition-colors text-white text-sm font-medium px-6 py-2 rounded-full shadow-sm">
              Solicitar Demo
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-12 px-6 flex flex-col items-center text-center">
        <h1 className="font-bold text-4xl sm:text-5xl lg:text-[54px] text-slate-800 leading-tight mb-4 max-w-4xl tracking-tight">
          Revoluciona tu Taller Mecánico:<br />
          Inteligencia y Eficiencia en un Solo Lugar
        </h1>
        <p className="text-slate-600 text-lg mb-8 max-w-2xl">
          Agenda, reparaciones, inventario y reportes predictivos. Paga solo por lo que necesitas.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <button className="bg-blue-400 hover:bg-blue-500 transition-colors text-white font-medium px-8 py-3 rounded-full text-base shadow-md shadow-blue-400/20">
            Solicitar una Demostración Gratuita
          </button>
          <a href="#modulos" className="bg-white border border-slate-300 hover:border-blue-400 text-blue-500 transition-colors font-medium px-8 py-3 rounded-full text-base shadow-sm">
            Explorar los Módulos
          </a>
        </div>
        
        <div className="flex items-center justify-center gap-6 text-sm text-slate-600 font-medium mb-12">
          <span className="flex items-center gap-1.5"><span className="text-black">✓</span> No se requiere tarjeta de crédito</span>
          <span className="flex items-center gap-1.5"><span className="text-black">✓</span> Utilizado por talleres líderes</span>
        </div>

        {/* DASHBOARD MOCKUP (Simulación visual central) */}
        <div className="w-full max-w-[1000px] bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden transform perspective-1000 rotate-x-2 scale-95 md:scale-100">
          <div className="border-b border-slate-200 px-4 py-3 flex items-center bg-white">
            <div className="flex gap-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-blue-400"></div>
              SIGMA Dashboard: AutoFix Ñuñoa
            </div>
          </div>
          
          {/* Contenido del Mockup */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/50">
            <div className="md:col-span-3 bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <h4 className="text-xs font-bold text-slate-800 mb-4">Weekly scheduling</h4>
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5].map(i => <div key={i} className="flex-1 h-2 bg-slate-100 rounded"></div>)}
              </div>
              <div className="grid grid-cols-5 gap-1 h-32">
                <div className="col-start-1 col-end-2 row-start-1 row-end-3 bg-blue-100 rounded border border-blue-200"></div>
                <div className="col-start-2 col-end-3 row-start-2 row-end-5 bg-green-100 rounded border border-green-200"></div>
                <div className="col-start-3 col-end-4 row-start-1 row-end-2 bg-purple-100 rounded border border-purple-200"></div>
                <div className="col-start-4 col-end-5 row-start-3 row-end-6 bg-amber-100 rounded border border-amber-200"></div>
                <div className="col-start-5 col-end-6 row-start-1 row-end-4 bg-blue-100 rounded border border-blue-200"></div>
              </div>
            </div>

            <div className="md:col-span-6 bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-slate-800">Live Work Orders</h4>
                <div className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100">8 en progreso</div>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-3">
                <div className="flex text-[10px] font-medium text-white text-center">
                  <div className="flex-1 bg-blue-400 py-2 rounded-l relative">Recepción <div className="absolute -right-2 top-0 border-t-[14px] border-b-[14px] border-l-[8px] border-t-transparent border-b-transparent border-l-blue-400 z-10"></div></div>
                  <div className="flex-1 bg-blue-500 py-2 relative">Diagnóstico <div className="absolute -right-2 top-0 border-t-[14px] border-b-[14px] border-l-[8px] border-t-transparent border-b-transparent border-l-blue-500 z-10"></div></div>
                  <div className="flex-1 bg-teal-400 py-2 relative">Reparación <div className="absolute -right-2 top-0 border-t-[14px] border-b-[14px] border-l-[8px] border-t-transparent border-b-transparent border-l-teal-400 z-10"></div></div>
                  <div className="flex-1 bg-purple-400 py-2 rounded-r">Entrega</div>
                </div>
                <div className="flex gap-2">
                   <div className="h-16 w-1/3 bg-slate-50 border border-slate-200 rounded p-2"><div className="h-2 w-1/2 bg-slate-200 rounded mb-2"></div><div className="h-2 w-3/4 bg-slate-200 rounded"></div></div>
                   <div className="h-16 w-1/3 bg-slate-50 border border-blue-200 rounded p-2 relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div><div className="h-2 w-1/2 bg-blue-200 rounded mb-2"></div><div className="h-2 w-3/4 bg-slate-200 rounded"></div></div>
                   <div className="h-16 w-1/3 bg-slate-50 border border-slate-200 rounded p-2"><div className="h-2 w-1/2 bg-slate-200 rounded mb-2"></div><div className="h-2 w-3/4 bg-slate-200 rounded"></div></div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 flex flex-col gap-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex-1">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Órdenes Hoy</h4>
                <div className="text-2xl font-black text-blue-500 mb-1">14</div>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full w-2/3 bg-blue-500"></div></div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex-1 flex items-end gap-1">
                 <div className="w-1/4 h-[30%] bg-blue-200 rounded-t"></div>
                 <div className="w-1/4 h-[60%] bg-blue-400 rounded-t"></div>
                 <div className="w-1/4 h-[90%] bg-teal-400 rounded-t"></div>
                 <div className="w-1/4 h-[40%] bg-blue-200 rounded-t"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO SIGMA MEJORA TU NEGOCIO */}
      <section id="modulos" className="relative z-10 py-16 bg-white border-t border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-bold text-2xl md:text-3xl text-slate-800 mb-16">
            Cómo SIGMA Mejora Tu Negocio
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 relative">
            <div className="hidden md:block absolute top-1/3 left-10 right-10 h-0.5 bg-blue-100 z-0 -translate-y-1/2"></div>
            
            {[
              { icon: Calendar, title: 'Agendamiento\nOnline' },
              { icon: ClipboardList, title: 'Seguimiento en\nTiempo Real' },
              { icon: Package, title: 'Gestión de\nInventario' },
              { icon: BarChart3, title: 'Reportes\nPredictivos' },
            ].map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-4 z-10 w-full md:w-auto">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-24 bg-white border-2 border-blue-100 rounded-xl shadow-lg shadow-blue-100/50 flex flex-col items-center justify-center mb-4 relative overflow-hidden group hover:border-blue-300 transition-colors">
                    <div className="absolute top-0 w-full h-3 bg-slate-100 border-b border-blue-100 flex justify-center items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                      <div className="w-3 h-1 rounded-full bg-slate-300"></div>
                    </div>
                    <item.icon className="w-8 h-8 text-blue-500 mt-2" strokeWidth={1.5} />
                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 text-center whitespace-pre-line leading-tight">
                    {item.title}
                  </span>
                </div>
                
                {index < 3 && (
                  <ArrowRight className="w-6 h-6 text-blue-300 rotate-90 md:rotate-0 my-4 md:my-0 md:-mt-8" strokeWidth={2} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTAL DE CLIENTES / SEGUIMIENTO (CORREGIDO) */}
      <section id="seguimiento" className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
            <h2 className="font-bold text-3xl text-slate-800 dark:text-white mb-3 transition-colors">Portal de Clientes</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 transition-colors">
              ¿Dejaste tu vehículo en el taller? Ingresa el número de tu orden para revisar el progreso en vivo.
            </p>
            
            <form onSubmit={buscarOrden} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="text"
                value={numeroOrden}
                onChange={(e) => setNumeroOrden(e.target.value)}
                placeholder="Ej. 4 o ORD-042"
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-5 py-3.5 text-slate-800 dark:text-white font-medium focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 transition-colors text-white font-semibold px-8 py-3.5 rounded-xl whitespace-nowrap shadow-md shadow-blue-500/20"
              >
                Rastrear Vehículo
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Landing