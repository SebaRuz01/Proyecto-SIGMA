import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import logoIcono from '../assets/logo.png'
import { ArrowLeft, AlertCircle } from 'lucide-react'

const ESTADOS_INFO = {
  recibido: { label: 'Recibido', color: 'text-slate-500', pct: 15 },
  diagnostico: { label: 'En diagnóstico', color: 'text-blue-500', pct: 40 },
  en_reparacion: { label: 'En reparación', color: 'text-amber-500', pct: 70 },
  listo: { label: 'Listo para retiro', color: 'text-emerald-500', pct: 100 },
  entregado: { label: 'Entregado', color: 'text-slate-400', pct: 100 },
}

function Seguimiento() {
  const { codigo } = useParams()
  const [orden, setOrden] = useState(null)
  const [error, setError] = useState('')
  const [conectado, setConectado] = useState(false)

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/publico/ordenes/${codigo}/`)
      .then((res) => setOrden(res.data))
      .catch(() => setError('No se encontró ninguna orden con ese código.'))
  }, [codigo])

  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/ordenes/${codigo}/`)

    ws.onopen = () => setConectado(true)
    ws.onclose = () => setConectado(false)
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setOrden((prev) => prev ? { ...prev, ...data } : prev)
    }

    return () => ws.close()
  }, [codigo])

  if (error) {
    return (
      <div className="bg-[#f4f7fb] text-slate-900 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="font-bold text-xl text-slate-800 mb-2">Orden no encontrada</h2>
          <p className="text-slate-500 text-sm mb-6">{error}</p>
          <Link to="/" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors w-full shadow-md shadow-blue-500/20">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  if (!orden) {
    return (
      <div className="bg-[#f4f7fb] text-slate-900 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-blue-600 text-sm font-medium bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          Buscando información de tu vehículo...
        </div>
      </div>
    )
  }

  const info = ESTADOS_INFO[orden.estado] || ESTADOS_INFO.recibido

  return (
    <div className="bg-[#f4f7fb] text-slate-900 min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      
      {/* Fondo decorativo luminoso idéntico a la landing */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/20 rounded-full mix-blend-multiply filter blur-[80px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-300/20 rounded-full mix-blend-multiply filter blur-[80px] pointer-events-none z-0"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Botón Volver y Logo */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Inicio
          </Link>
          
          <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
            <span className={`w-2 h-2 rounded-full ${conectado ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-slate-600">{conectado ? 'En vivo' : 'Conectando...'}</span>
          </div>
        </div>

        <div className="flex flex-col items-center mb-6">
          <img src={logoIcono} alt="SIGMA" className="h-10 w-auto mb-2" />
          <h2 className="font-bold text-xl text-slate-800">Estado de Reparación</h2>
        </div>

        {/* Tarjeta de Seguimiento */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Número de orden</span>
            <span className="bg-blue-50 text-blue-600 text-xs font-black px-2.5 py-1 rounded-md border border-blue-100">
              OT-{orden.id.toString().padStart(3, '0')}
            </span>
          </div>
          <h1 className="font-extrabold text-2xl text-slate-800 mb-6">{orden.equipo}</h1>

          {/* Barra de Progreso */}
          <div className="mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between text-xs font-bold mb-3">
              <span className={info.color}>{info.label}</span>
              <span className="text-slate-400">{info.pct}%</span>
            </div>
            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${info.pct}%` }}
              />
            </div>
          </div>

          {/* Detalles */}
          <div className="space-y-3 pt-2 border-t border-slate-100 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-400 font-medium">Cliente</span>
              <span className="font-bold text-slate-700">{orden.cliente_nombre}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400 font-medium">Técnico Asignado</span>
              <span className="font-bold text-slate-700">{orden.tecnico_nombre || 'Sin asignar'}</span>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6 font-medium">
          Esta página se actualiza automáticamente en tiempo real cuando el taller cambia el estado de tu vehículo.
        </p>
      </div>
    </div>
  )
}

export default Seguimiento