import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { Lock, X, Search, Plus } from 'lucide-react'

const formatearPrecio = (valor) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(valor)
}

function Inventario() {
  const [repuestos, setRepuestos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [bloqueado, setBloqueado] = useState(false)
  const [error, setError] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [errorForm, setErrorForm] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const [form, setForm] = useState({
    nombre: '',
    stock_actual: '',
    stock_minimo: '',
    precio: '',
    anio: '',
    modelo: '',
    compatibilidades: '',
  })

  const cargarRepuestos = () => {
    api.get('/repuestos/')
      .then((res) => setRepuestos(res.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          setBloqueado(true)
        } else {
          setError('No se pudieron cargar los repuestos.')
        }
      })
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    cargarRepuestos()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorForm('')
    setGuardando(true)
    try {
      await api.post('/repuestos/', {
        nombre: form.nombre,
        stock_actual: Number(form.stock_actual) || 0,
        stock_minimo: Number(form.stock_minimo) || 0,
        precio: Number(form.precio) || 0,
        anio: form.anio ? Number(form.anio) : null,
        modelo: form.modelo || '',
        compatibilidades: form.compatibilidades || '',
      })
      setModalAbierto(false)
      setForm({ nombre: '', stock_actual: '', stock_minimo: '', precio: '', anio: '', modelo: '', compatibilidades: '' })
      cargarRepuestos()
    } catch (err) {
      setErrorForm('No se pudo crear el repuesto. Revisa los datos.')
    } finally {
      setGuardando(false)
    }
  }

  // Filtrar repuestos según el texto introducido en el buscador
  const repuestosFiltrados = repuestos.filter((r) => {
    const texto = busqueda.toLowerCase()
    const nombre = r.nombre?.toLowerCase() || ''
    const modelo = r.modelo?.toLowerCase() || ''
    const compatibilidades = r.compatibilidades?.toLowerCase() || ''
    return nombre.includes(texto) || modelo.includes(texto) || compatibilidades.includes(texto)
  })

  return (
    <div className="bg-[#f4f7fb] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 min-h-screen flex font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 relative overflow-hidden transition-colors duration-300">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/20 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] pointer-events-none z-0 transition-colors duration-300"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-300/20 dark:bg-cyan-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] pointer-events-none z-0 transition-colors duration-300"></div>

      <Sidebar className="relative z-10" />
      
      <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full relative z-10 overflow-y-auto h-screen">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-extrabold text-3xl text-slate-800 dark:text-white tracking-tight transition-colors">Repuestos y stock</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium transition-colors">Administra el inventario y las compatibilidades de repuestos.</p>
          </div>
          {!bloqueado && (
            <button
              onClick={() => setModalAbierto(true)}
              className="bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 text-white text-sm font-bold px-5 py-2.5 rounded-full flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo repuesto
            </button>
          )}
        </div>

        {cargando && (
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20 shadow-sm transition-colors">
            <div className="w-4 h-4 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            Cargando repuestos...
          </div>
        )}

        {bloqueado && (
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center max-w-md mx-auto mt-10 shadow-sm transition-colors">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto mb-4 transition-colors">
              <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            </div>
            <h2 className="font-extrabold text-lg text-slate-800 dark:text-white mb-2 transition-colors">Módulo no contratado</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 font-medium transition-colors">
              Tu taller no tiene contratado el módulo de Inventario. Contáctanos para habilitarlo.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20">
              Contratar módulo
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl px-4 py-3 mb-6 shadow-sm transition-colors">
            {error}
          </div>
        )}

        {!cargando && !bloqueado && !error && (
          <>
            {/* BUSCADOR */}
            <div className="mb-6 relative max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por repuesto, modelo o compatibilidad..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-medium shadow-sm transition-colors"
              />
            </div>

            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-colors">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">Repuesto</th>
                    <th className="px-4 py-4 font-bold">Modelo / Año</th>
                    <th className="px-4 py-4 font-bold">Compatibilidades</th>
                    <th className="px-4 py-4 font-bold">Stock</th>
                    <th className="px-4 py-4 font-bold">Mínimo</th>
                    <th className="px-4 py-4 font-bold">Precio</th>
                    <th className="px-4 py-4 font-bold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {repuestosFiltrados.length === 0 && (
                    <tr><td colSpan={7} className="px-6 py-8 text-slate-400 text-center font-medium">No se encontraron repuestos.</td></tr>
                  )}
                  {repuestosFiltrados.map((r) => {
                    const bajoStock = r.stock_actual <= r.stock_minimo
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{r.nombre}</td>
                        <td className="px-4 py-4 text-slate-500 dark:text-slate-400 font-medium">
                          {r.modelo || 'N/A'} {r.anio ? `(${r.anio})` : ''}
                        </td>
                        <td className="px-4 py-4 text-slate-500 dark:text-slate-400 font-medium max-w-xs truncate" title={r.compatibilidades}>
                          {r.compatibilidades || 'Universal / Sin especificar'}
                        </td>
                        <td className="px-4 py-4 font-bold text-slate-700 dark:text-slate-300">{r.stock_actual}</td>
                        <td className="px-4 py-4 text-slate-400 dark:text-slate-500">{r.stock_minimo}</td>
                        <td className="px-4 py-4 font-semibold text-slate-800 dark:text-white">{formatearPrecio(r.precio)}</td>
                        <td className="px-4 py-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${bajoStock ? 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                            {bajoStock ? 'Bajo stock' : 'Óptimo'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* MODAL NUEVO REPUESTO */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center px-4 z-50">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-8 shadow-2xl transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-extrabold text-xl text-slate-800 dark:text-white transition-colors">Nuevo repuesto</h2>
                <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Nombre del repuesto</label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej. Pastillas de freno delanteras"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Modelo</label>
                    <input
                      name="modelo"
                      value={form.modelo}
                      onChange={handleChange}
                      placeholder="Ej. Hilux / Spark"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Año</label>
                    <input
                      name="anio"
                      type="number"
                      value={form.anio}
                      onChange={handleChange}
                      placeholder="Ej. 2020"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Compatibilidades</label>
                  <input
                    name="compatibilidades"
                    value={form.compatibilidades}
                    onChange={handleChange}
                    placeholder="Ej. Toyota Hilux 2.4, Fortuner (2016-2022)"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Stock actual</label>
                    <input
                      name="stock_actual"
                      type="number"
                      min="0"
                      value={form.stock_actual}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Stock mínimo</label>
                    <input
                      name="stock_minimo"
                      type="number"
                      min="0"
                      value={form.stock_minimo}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5 transition-colors">Precio ($)</label>
                    <input
                      name="precio"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.precio}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-medium transition-colors"
                    />
                  </div>
                </div>

                {errorForm && <p className="text-red-500 dark:text-red-400 text-sm font-medium">{errorForm}</p>}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={guardando}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 text-white font-bold py-3.5 rounded-xl disabled:opacity-60"
                  >
                    {guardando ? 'Guardando...' : 'Crear repuesto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Inventario