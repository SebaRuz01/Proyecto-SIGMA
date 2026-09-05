import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'

function PanelGeneral() {
  const [ordenes, setOrdenes] = useState([])
  const [repuestos, setRepuestos] = useState([])
  const [inventarioBloqueado, setInventarioBloqueado] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

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
  const estadoColor = {
    recibido: 'text-muted',
    diagnostico: 'text-muted',
    en_reparacion: 'text-amber-400',
    listo: 'text-success',
    entregado: 'text-muted',
  }

  return (
    <div className="bg-base-950 text-ink min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="font-display font-bold text-3xl">Panel general</h1>
          <button className="bg-brand hover:bg-brand-dark transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
            + Nueva orden
          </button>
        </div>

        {cargando && <p className="text-muted text-sm mb-6">Cargando...</p>}
        {error && <p className="text-red-400 text-sm mb-6">{error}</p>}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-base-850 border border-base-700 rounded-xl p-5">
            <div className="text-xs text-muted mb-2">Órdenes activas</div>
            <div className="font-display font-bold text-2xl">{activas.length}</div>
          </div>
          <div className="bg-base-850 border border-base-700 rounded-xl p-5">
            <div className="text-xs text-muted mb-2">Total órdenes</div>
            <div className="font-display font-bold text-2xl">{ordenes.length}</div>
          </div>
          <div className="bg-base-850 border border-base-700 rounded-xl p-5">
            <div className="text-xs text-muted mb-2">Repuestos bajo stock</div>
            <div className="font-display font-bold text-2xl text-red-400">
              {inventarioBloqueado ? '—' : stockBajo.length}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
          <div className="bg-base-850 border border-base-700 rounded-xl">
            <div className="px-6 py-4 border-b border-base-700 flex items-center justify-between">
              <span className="font-display font-semibold">Órdenes recientes</span>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-muted">
                  <th className="px-6 py-3 font-normal">Orden</th>
                  <th className="px-4 py-3 font-normal">Equipo</th>
                  <th className="px-4 py-3 font-normal">Cliente</th>
                  <th className="px-4 py-3 font-normal">Estado</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.length === 0 && !cargando && (
                  <tr><td colSpan={4} className="px-6 py-6 text-muted text-center">No hay órdenes registradas todavía.</td></tr>
                )}
                {ordenes.slice(0, 6).map((o) => (
                  <tr key={o.id} className="border-t border-base-700/60">
                    <td className="px-6 py-3.5">OT-{o.id}</td>
                    <td className="px-4 py-3.5">{o.equipo}</td>
                    <td className="px-4 py-3.5">{o.cliente_nombre}</td>
                    <td className={`px-4 py-3.5 ${estadoColor[o.estado]}`}>{estadoLabel[o.estado]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-base-850 border border-base-700 rounded-xl p-6">
            <div className="text-xs text-muted mb-4">Alertas de inventario</div>
            {inventarioBloqueado ? (
              <p className="text-muted text-xs">Tu taller no tiene contratado el módulo de Inventario.</p>
            ) : (
              <div className="space-y-3 text-sm">
                {stockBajo.length === 0 && <p className="text-muted text-xs">Sin alertas por ahora.</p>}
                {stockBajo.map((r) => (
                  <div key={r.id} className="flex justify-between">
                    <span>{r.nombre}</span>
                    <span className="text-red-400">{r.stock_actual} uds.</span>
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