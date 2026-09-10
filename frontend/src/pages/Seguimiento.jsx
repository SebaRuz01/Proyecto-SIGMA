import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import logoIcono from '../assets/logo.png'
import { ArrowLeft, AlertCircle, Sun, Moon, RefreshCw, CheckCircle2 } from 'lucide-react'

const ESTADOS_INFO = {
  recibido: { label: 'Recibido', color: 'text-slate-500 dark:text-slate-400', pct: 15 },
  diagnostico: { label: 'En diagnóstico', color: 'text-blue-500 dark:text-blue-400', pct: 40 },
  en_reparacion: { label: 'En reparación', color: 'text-amber-500 dark:text-amber-400', pct: 70 },
  listo: { label: 'Listo para retiro', color: 'text-emerald-500 dark:text-emerald-400', pct: 100 },
  entregado: { label: 'Entregado', color: 'text-slate-400 dark:text-slate-500', pct: 100 },
}

function Seguimiento() {
  const { codigo } = useParams()
  const [orden, setOrden] = useState(null)
  const [error, setError] = useState('')
  const [conectado, setConectado] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [actualizando, setActualizando] = useState(false)

  // Manejo de modo oscuro en el DOM
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Función para obtener la orden por HTTP sin recargar toda la página
  const fetchOrden = (esRecargaManual = false) => {
    if (esRecargaManual) setActualizando(true)
    axios.get(`http://127.0.0.1:8000/api/publico/ordenes/${codigo}/`)
      .then((res) => {
        setOrden(res.data)
        setError('')
      })
      .catch(() => {
        if (!orden) setError('No se encontró ninguna orden con ese código.')
      })
      .finally(() => {
        if (esRecargaManual) {
          setTimeout(() => setActualizando(false), 500) // Pequeño delay visual para el botón
        }
      })
  }

  // Carga inicial
  useEffect(() => {
    fetchOrden()
  }, [codigo])

  // WebSocket para actualizaciones en vivo automáticas
  useEffect(() => {
    const ws = new WebSocket(`wss://bd-sigma.onrender.com/ws/ordenes/${codigo}/`)

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
      <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-14 h-14 bg-red-50 dark:bg-red-950/50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="font-bold text-xl text-slate-800 dark:text-white mb-2">Orden no encontrada</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{error}</p>
          <Link to="/" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors w-full shadow-md shadow-blue-500/20">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  if (!orden) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center transition-colors duration-300">
        <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 text-sm font-medium bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          Buscando información de tu vehículo...
        </div>
      </div>
    )
  }

  const info = ESTADOS_INFO[orden.estado] || ESTADOS_INFO.recibido

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden transition-colors duration-300">
      
      {/* Botones superiores flotantes (Modo Oscuro & Volver) */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <ArrowLeft className="w-4 h-4" /> Inicio
        </Link>
        
        <div className="flex items-center gap-3">
          {/* Indicador WebSocket */}
          <div className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className={`w-2 h-2 rounded-full ${conectado ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-slate-600 dark:text-slate-300">{conectado ? 'En vivo' : 'Desconectado'}</span>
          </div>

          {/* Botón Modo Oscuro */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
            aria-label="Cambiar modo oscuro"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">

        <div className="flex flex-col items-center mb-6">
          <img src={logoIcono} alt="SIGMA" className="h-10 w-auto mb-2" />
          <h2 className="font-bold text-xl text-slate-800 dark:text-white">Estado de Reparación</h2>
        </div>

        {/* Tarjeta de Seguimiento */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Número de orden</span>
            <span className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-black px-2.5 py-1 rounded-md border border-blue-100 dark:border-blue-900">
              OT-{orden.id.toString().padStart(3, '0')}
            </span>
          </div>
          <h1 className="font-extrabold text-2xl text-slate-800 dark:text-white mb-6">{orden.equipo}</h1>

          {/* Barra de Progreso */}
          <div className="mb-8 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between text-xs font-bold mb-3">
              <span className={info.color}>{info.label}</span>
              <span className="text-slate-400">{info.pct}%</span>
            </div>
            <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${info.pct}%` }}
              />
            </div>
          </div>

          {/* Detalles */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800/60">
              <span className="text-slate-400 font-medium">Cliente</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{orden.cliente_nombre}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400 font-medium">Técnico Asignado</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{orden.tecnico_nombre || 'Sin asignar'}</span>
            </div>
          </div>

          {/* Botón de Actualizar Manual sin recargar la página */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
            <button
              onClick={() => fetchOrden(true)}
              disabled={actualizando}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-3 px-4 rounded-xl text-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${actualizando ? 'animate-spin text-blue-600' : ''}`} />
              {actualizando ? 'Actualizando datos...' : 'Actualizar Estado Manualmente'}
            </button>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6 font-medium">
          La información se actualiza de forma automática en tiempo real.
        </p>
      </div>
    </div>
  )
}

export default Seguimiento