import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { Lock, BarChart3, Wrench, PackageCheck, AlertTriangle, Layers, Download, Printer } from 'lucide-react'

function Reportes() {
  const [ordenes, setOrdenes] = useState([])
  const [repuestos, setRepuestos] = useState([])
  const [inventarioBloqueado, setInventarioBloqueado] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [bloqueado, setBloqueado] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/ordenes/')
      .then((res) => setOrdenes(res.data))
      .catch((err) => {
        if (err.response?.status === 403) setBloqueado(true)
        else setError('No se pudieron cargar los datos de reportes.')
      })
      .finally(() => setCargando(false))

    api.get('/repuestos/')
      .then((res) => setRepuestos(res.data))
      .catch((err) => {
        if (err.response?.status === 403) setInventarioBloqueado(true)
      })
  }, [])

  // Conteo de órdenes por estado
  const conteoPorEstado = ordenes.reduce((acc, o) => {
    acc[o.estado] = (acc[o.estado] || 0) + 1
    return acc
  }, {})

  // Conteo de órdenes por técnico
  const porTecnico = ordenes.reduce((acc, o) => {
    const nombre = o.tecnico_nombre || 'Sin asignar'
    acc[nombre] = (acc[nombre] || 0) + 1
    return acc
  }, {})
  const maxPorTecnico = Math.max(1, ...Object.values(porTecnico))

  const stockBajo = repuestos.filter((r) => r.stock_actual <= r.stock_minimo)

  const imprimirReporte = () => {
    window.print()
  }

  return (
    <div className="bg-[#f4f7fb] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 min-h-screen flex font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 relative overflow-hidden transition-colors duration-300">
      
      {/* Fondo decorativo luminoso */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/20 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-300/20 dark:bg-cyan-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] pointer-events-none z-0"></div>

      <Sidebar className="relative z-10" />

      <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full relative z-10 overflow-y-auto h-screen">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Análisis y Rendimiento</div>
            <h1 className="font-extrabold text-3xl text-slate-800 dark:text-white tracking-tight">Reportes Generales</h1>
          </div>
          {!bloqueado && !cargando && (
            <button
              onClick={imprimirReporte}
              className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all text-sm font-bold px-5 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              Imprimir / Exportar PDF
            </button>
          )}
        </div>

        {cargando && (
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 bg-blue-50 dark:bg-blue-500/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-500/20 shadow-sm max-w-sm">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Cargando reportes y analítica...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-2xl px-5 py-4 mb-6 shadow-sm max-w-md">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {bloqueado && (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2rem] p-10 text-center max-w-lg mx-auto mt-16 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Lock className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h2 className="font-extrabold text-2xl text-slate-800 dark:text-white mb-3">Módulo no contratado</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium leading-relaxed">
              Tu taller no tiene contratado el módulo de Reportes. Actívalo desde administración para visualizar métricas de rendimiento.
            </p>
          </div>
        )}

        {!cargando && !bloqueado && !error && (
          <>
            {/* KPIs / Tarjetas Superiores */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total de órdenes</span>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                </div>
                <div className="font-black text-3xl text-slate-800 dark:text-white">{ordenes.length}</div>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">En reparación</span>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Wrench className="w-6 h-6" />
                  </div>
                </div>
                <div className="font-black text-3xl text-amber-600 dark:text-amber-400">
                  {conteoPorEstado['en_reparacion'] || 0}
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Listas para retiro</span>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <PackageCheck className="w-6 h-6" />
                  </div>
                </div>
                <div className="font-black text-3xl text-emerald-600 dark:text-emerald-400">
                  {conteoPorEstado['listo_para_retiro'] || conteoPorEstado['listo'] || 0}
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Stock crítico</span>
                  <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
                <div className="font-black text-3xl text-red-600 dark:text-red-400">
                  {inventarioBloqueado ? '—' : stockBajo.length}
                </div>
              </div>

            </div>

            {/* Gráficos y Métricas */}
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Órdenes por estado */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-[0_4px_30px_rgb(0,0,0,0.03)] transition-colors">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <h2 className="font-extrabold text-lg text-slate-800 dark:text-white">Órdenes por estado</h2>
                </div>
                
                <div className="space-y-4">
                  {Object.keys(conteoPorEstado).length === 0 && (
                    <p className="text-slate-400 dark:text-slate-500 text-xs text-center py-10 font-medium">Aún no hay órdenes registradas en el taller.</p>
                  )}
                  {Object.entries(conteoPorEstado).map(([estado, cantidad]) => (
                    <div key={estado} className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                        <span className="capitalize">{estado.replace('_', ' ')}</span>
                        <span className="text-blue-600 dark:text-blue-400">{cantidad} orden(es)</span>
                      </div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-700"
                          style={{ width: `${ordenes.length > 0 ? (cantidad / ordenes.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carga por técnico */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-[0_4px_30px_rgb(0,0,0,0.03)] transition-colors">
                <div className="flex items-center gap-2 mb-6">
                  <Wrench className="w-5 h-5 text-teal-500" />
                  <h2 className="font-extrabold text-lg text-slate-800 dark:text-white">Carga de trabajo por técnico</h2>
                </div>

                <div className="space-y-4">
                  {Object.keys(porTecnico).length === 0 && (
                    <p className="text-slate-400 dark:text-slate-500 text-xs text-center py-10 font-medium">Aún no hay órdenes asignadas a técnicos.</p>
                  )}
                  {Object.entries(porTecnico).map(([nombre, cantidad]) => (
                    <div key={nombre} className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                        <span>{nombre}</span>
                        <span className="text-teal-600 dark:text-teal-400">{cantidad} asignada(s)</span>
                      </div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-700"
                          style={{ width: `${(cantidad / maxPorTecnico) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Reportes