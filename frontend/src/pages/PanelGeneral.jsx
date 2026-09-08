import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { Plus, Activity, Wrench, Package, AlertCircle } from 'lucide-react'

function PanelGeneral() {
  const [ordenes, setOrdenes] = useState([])
  const [repuestos, setRepuestos] = useState([])
  const [inventarioBloqueado, setInventarioBloqueado] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/ordenes/')
      .then((res) => setOrdenes(res.data))
      .catch(() => setError('No se pudieron cargar las órdenes.'))
      .finally(() => setCargando(false))

    api.get('/repuestos/')
      .then((res) => setRepuestos(res.data))
      .catch((err) => {
        if (err.response?.status === 403) setInventarioBloqueado(true)
      })
  }, [])

  const activas = ordenes.filter((o) => o.estado !== 'entregado')
  const stockBajo = repuestos.filter((r) => r.stock_actual <= r.stock_minimo)

  const estadoLabel = {
    recibido: 'Recibido',
    diagnostico: 'Diagnóstico',
    en_reparacion: 'En reparación',
    listo: 'Listo',
    entregado: 'Entregado',
  }
  
  // Colores con soporte para modo oscuro en los badges
  const estadoColor = {
    recibido: 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60',
    diagnostico: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20',
    en_reparacion: 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20',
    listo: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20',
    entregado: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20',
  }

  return (
    <div className="bg-[#f4f7fb] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 min-h-screen flex font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 relative overflow-hidden transition-colors duration-300">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/20 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] pointer-events-none z-0 transition-colors duration-300"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-300/20 dark:bg-cyan-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] pointer-events-none z-0 transition-colors duration-300"></div>

      <Sidebar className="relative z-10" />
      
      <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full relative z-10">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-bold text-3xl text-slate-800 dark:text-white tracking-tight transition-colors">Panel General</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">Resumen en vivo de tu taller mecánico</p>
          </div>
        </div>

        {cargando && (
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20 shadow-sm transition-colors">
            <div className="w-4 h-4 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            Cargando información...
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl px-4 py-3 mb-6 shadow-sm transition-colors">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* TARJETAS DE MÉTRICAS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 dark:text-blue-400 transition-colors">
                <Activity className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-slate-500 dark:text-slate-400 transition-colors">Órdenes Activas</div>
            </div>
            <div className="font-extrabold text-4xl text-slate-800 dark:text-white transition-colors">{activas.length}</div>
          </div>
          
          <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-slate-500 dark:text-slate-400 transition-colors">Total Histórico</div>
            </div>
            <div className="font-extrabold text-4xl text-slate-800 dark:text-white transition-colors">{ordenes.length}</div>
          </div>
          
          <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-400 dark:text-red-400 transition-colors">
                <Package className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-slate-500 dark:text-slate-400 transition-colors">Repuestos Críticos</div>
            </div>
            <div className="font-extrabold text-4xl text-red-500 dark:text-red-500 transition-colors">
              {inventarioBloqueado ? '—' : stockBajo.length}
            </div>
          </div>
        </div>

        {/* SECCIÓN INFERIOR */}
        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          
          {/* TABLA DE ÓRDENES */}
          <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-white dark:bg-transparent transition-colors">
              <h2 className="font-bold text-slate-800 dark:text-white transition-colors">Órdenes recientes</h2>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20 transition-colors">
                Sistema En Línea
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 transition-colors">
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/60 transition-colors">Orden</th>
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/60 transition-colors">Equipo</th>
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/60 transition-colors">Cliente</th>
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/60 transition-colors">Estado</th>
<<<<<<< HEAD
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/60 transition-colors">Seguimiento</th>
=======
>>>>>>> 2dd7fc896ee552586ccf67d9317ebc02b9a77a3a
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 transition-colors">
                  {ordenes.length === 0 && !cargando && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-slate-400 dark:text-slate-500 text-center text-sm font-medium transition-colors">
                        No hay órdenes registradas todavía.
                      </td>
                    </tr>
                  )}
                  {ordenes.slice(0, 8).map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">OT-{o.id.toString().padStart(3, '0')}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{o.equipo}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{o.cliente_nombre}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${estadoColor[o.estado]}`}>
                          {estadoLabel[o.estado]}
                        </span>
                      </td>
<<<<<<< HEAD
                       <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{o.codigo_seguimiento}</td>
=======
>>>>>>> 2dd7fc896ee552586ccf67d9317ebc02b9a77a3a
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* WIDGET DE ALERTAS DE INVENTARIO */}
          <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-800 dark:text-white transition-colors">Alertas de Stock</h2>
              {!inventarioBloqueado && stockBajo.length > 0 && (
                <span className="bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/20 text-[10px] font-black px-2 py-0.5 rounded-full transition-colors">
                  {stockBajo.length}
                </span>
              )}
            </div>
            
            {inventarioBloqueado ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl transition-colors">
                <Package className="w-8 h-8 text-slate-300 dark:text-slate-500 mb-3" />
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">Tu taller no tiene contratado este módulo.</p>
                <button className="mt-3 text-blue-500 dark:text-blue-400 text-xs font-bold hover:underline transition-colors">Ver Módulos</button>
              </div>
            ) : (
              <div className="space-y-2 flex-1">
                {stockBajo.length === 0 && !cargando && (
                  <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-10 font-medium transition-colors">Stock en niveles óptimos.</p>
                )}
                {stockBajo.map((r) => (
                  <div key={r.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-colors">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{r.nombre}</span>
                    <span className="text-red-500 dark:text-red-400 font-bold text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-red-100 dark:border-red-500/20 shadow-sm dark:shadow-none transition-colors">
                      {r.stock_actual} uds.
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}

export default PanelGeneral