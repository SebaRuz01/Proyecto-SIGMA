import logo from '../assets/logo.png'
import { Calendar, ClipboardList, Package, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div className="bg-base-950 text-ink min-h-screen">

      <header className="sticky top-0 z-50 bg-base-950/85 backdrop-blur border-b border-base-700/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="SIGMA" className="h-8 w-auto" />
            <span className="font-display font-bold text-lg tracking-tight">SIGMA</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
            <a href="#modulos" className="hover:text-ink transition-colors">Módulos</a>
            <a href="#contacto" className="hover:text-ink transition-colors">Contacto</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:block text-sm font-medium text-muted hover:text-ink">
                Iniciar sesión
            </Link>
            <button className="bg-brand hover:bg-brand-dark transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
              Solicitar demo
            </button>
          </div>
        </div>
      </header>

      <section className="border-b border-base-700/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-28 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-base-850 border border-base-700 rounded-full px-3.5 py-1.5 text-xs font-medium mb-6 text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              Plataforma para talleres mecánicos
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight mb-6">
              Gestiona tu taller mecánico<br className="hidden sm:block" /> de forma profesional
            </h1>
            <p className="text-muted text-lg max-w-md mb-8 leading-relaxed">
              Agenda, reparaciones, inventario y reportes en una sola plataforma.
              Paga solo por los módulos que tu taller realmente necesita.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button className="bg-brand hover:bg-brand-dark transition-colors text-white font-semibold px-6 py-3.5 rounded-lg">
                Solicitar demo gratuita
              </button>
              <a href="#modulos" className="border border-base-700 hover:border-muted transition-colors px-6 py-3.5 rounded-lg font-medium">
                Ver módulos
              </a>
            </div>
          </div>

          <div className="bg-base-850 border border-base-700 rounded-2xl p-5 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs text-muted font-medium">Panel general</div>
                <div className="font-display font-semibold">AutoFix Ñuñoa</div>
              </div>
              <span className="text-xs bg-success/10 text-success font-medium px-2.5 py-1 rounded-full">
                En línea
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-base-900 rounded-lg p-3 border border-base-700/60">
                <div className="text-xs text-muted mb-1">Órdenes</div>
                <div className="font-display font-bold text-xl">18</div>
              </div>
              <div className="bg-base-900 rounded-lg p-3 border border-base-700/60">
                <div className="text-xs text-muted mb-1">Prom.</div>
                <div className="font-display font-bold text-xl">2.4h</div>
              </div>
              <div className="bg-base-900 rounded-lg p-3 border border-base-700/60">
                <div className="text-xs text-muted mb-1">Stock bajo</div>
                <div className="font-display font-bold text-xl text-red-400">3</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULOS */}
      <section id="modulos" className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-brand font-semibold text-sm uppercase tracking-wide">Módulos</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3">Contrata solo lo que necesitas</h2>
          <p className="text-muted mt-4">
            Cada módulo se activa de forma independiente — empieza simple y agrega funciones a medida que tu taller crece.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Calendar, title: 'Agendamiento online', desc: 'Tus clientes reservan hora por internet, sin llamadas.' },
            { icon: ClipboardList, title: 'Órdenes de trabajo', desc: 'Seguimiento del estado de reparación en tiempo real.' },
            { icon: Package, title: 'Inventario', desc: 'Control de repuestos y alertas de quiebre de stock.' },
            { icon: BarChart3, title: 'Reportes predictivos', desc: 'Eficiencia por técnico y proyección de demanda.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-base-850 border border-base-700 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-brand" />
              </div>
              <h3 className="font-display font-semibold mb-2">{title}</h3>
              <p className="text-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contacto" className="border-t border-base-700/60 bg-base-850">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display font-bold text-3xl mb-4">Lleva tu taller al siguiente nivel</h2>
          <p className="text-muted mb-8">Agenda una demo y te mostramos cómo SIGMA se adapta a tu operación.</p>
          <button className="bg-brand hover:bg-brand-dark transition-colors text-white font-semibold px-8 py-3.5 rounded-lg">
            Solicitar demo gratuita
          </button>
        </div>
      </section>

      <footer className="border-t border-base-700/60 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <img src={logo} alt="SIGMA" className="w-6 h-6" />
            <span className="font-display font-semibold text-ink">SIGMA</span>
          </div>
          <span>Sistema Integrado de Gestión para Mecánica y Administración</span>
        </div>
      </footer>
    </div>
  )
}

export default Landing