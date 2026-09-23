import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { Lock } from 'lucide-react'

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

  // Conteo de órdenes por estado, calculado desde los datos reales
  const conteoPorEstado = ordenes.reduce((acc, o) => {
    acc[o.estado] = (acc[o.estado] || 0) + 1
    return acc
  }, {})

  // Conteo de órdenes por técnico, para la comparativa de eficiencia
  const porTecnico = ordenes.reduce((acc, o) => {
    const nombre = o.tecnico_nombre || 'Sin asignar'
    acc[nombre] = (acc[nombre] || 0) + 1
    return acc
  }, {})
  const maxPorTecnico = Math.max(1, ...Object.values(porTecnico))

  const stockBajo = repuestos.filter((r) => r.stock_actual <= r.stock_minimo)

  return (
    <div className="bg-base-950 text-ink min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="font-display font-bold text-3xl">Reportes</h1>
        </div>

        {cargando && <p className="text-muted text-sm">Cargando...</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {bloqueado && (
          <div className="bg-base-850 border border-base-700 rounded-xl p-10 text-center max-w-md mx-auto mt-10">
            <div className="w-12 h-12 rounded-full bg-base-900 border border-base-700 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-5 h-5 text-muted" />
            </div>
            <h2 className="font-display font-semibold text-lg mb-2">Módulo no contratado</h2>
            <p className="text-muted text-sm">
              Tu taller no tiene contratado el módulo de Reportes.
            </p>
          </div>
        )}

        {!cargando && !bloqueado && !error && (
          <>
            {/* KPIs */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-base-850 border border-base-700 rounded-xl p-5">
                <div className="text-xs text-muted mb-2">Total de órdenes</div>
                <div className="font-display font-bold text-2xl">{ordenes.length}</div>
              </div>
              <div className="bg-base-850 border border-base-700 rounded-xl p-5">
                <div className="text-xs text-muted mb-2">En reparación</div>
                <div className="font-display font-bold text-2xl text-amber-400">
                  {conteoPorEstado['en_reparacion'] || 0}
                </div>
              </div>
              <div className="bg-base-850 border border-base-700 rounded-xl p-5">
                <div className="text-xs text-muted mb-2">Listas para retiro</div>
                <div className="font-display font-bold text-2xl text-success">
                  {conteoPorEstado['listo'] || 0}
                </div>
              </div>
              <div className="bg-base-850 border border-base-700 rounded-xl p-5">
                <div className="text-xs text-muted mb-2">Repuestos bajo stock</div>
                <div className="font-display font-bold text-2xl text-red-400">
                  {inventarioBloqueado ? '—' : stockBajo.length}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Órdenes por estado */}
              <div className="bg-base-850 border border-base-700 rounded-xl p-6">
                <div className="text-xs text-muted mb-5">Órdenes por estado</div>
                <div className="space-y-3">
                  {Object.keys(conteoPorEstado).length === 0 && (
                    <p className="text-muted text-xs">Aún no hay órdenes registradas.</p>
                  )}
                  {Object.entries(conteoPorEstado).map(([estado, cantidad]) => (
                    <div key={estado}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="capitalize">{estado.replace('_', ' ')}</span>
                        <span>{cantidad}</span>
                      </div>
                      <div className="h-2 bg-base-700 rounded-full">
                        <div
                          className="h-2 bg-brand rounded-full"
                          style={{ width: `${(cantidad / ordenes.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carga por técnico */}
              <div className="bg-base-850 border border-base-700 rounded-xl p-6">
                <div className="text-xs text-muted mb-5">Órdenes por técnico</div>
                <div className="space-y-3">
                  {Object.keys(porTecnico).length === 0 && (
                    <p className="text-muted text-xs">Aún no hay órdenes asignadas.</p>
                  )}
                  {Object.entries(porTecnico).map(([nombre, cantidad]) => (
                    <div key={nombre}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{nombre}</span>
                        <span>{cantidad}</span>
                      </div>
                      <div className="h-2 bg-base-700 rounded-full">
                        <div
                          className="h-2 bg-success rounded-full"
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