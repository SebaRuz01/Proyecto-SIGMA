import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { Lock, X } from 'lucide-react'

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

  const [form, setForm] = useState({
    nombre: '',
    stock_actual: '',
    stock_minimo: '',
    precio: '',
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
      })
      setModalAbierto(false)
      setForm({ nombre: '', stock_actual: '', stock_minimo: '', precio: '' })
      cargarRepuestos()
    } catch (err) {
      setErrorForm('No se pudo crear el repuesto. Revisa los datos.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="bg-base-950 text-ink min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="font-display font-bold text-3xl">Repuestos y stock</h1>
          {!bloqueado && (
            <button
              onClick={() => setModalAbierto(true)}
              className="bg-brand hover:bg-brand-dark transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
            >
              + Nuevo repuesto
            </button>
          )}
        </div>

        {cargando && <p className="text-muted text-sm">Cargando...</p>}

        {bloqueado && (
          <div className="bg-base-850 border border-base-700 rounded-xl p-10 text-center max-w-md mx-auto mt-10">
            <div className="w-12 h-12 rounded-full bg-base-900 border border-base-700 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-5 h-5 text-muted" />
            </div>
            <h2 className="font-display font-semibold text-lg mb-2">Módulo no contratado</h2>
            <p className="text-muted text-sm mb-6">
              Tu taller no tiene contratado el módulo de Inventario. Contáctanos para habilitarlo.
            </p>
            <button className="bg-brand hover:bg-brand-dark transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
              Contratar módulo
            </button>
          </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {!cargando && !bloqueado && !error && (
          <div className="bg-base-850 border border-base-700 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-muted">
                  <th className="px-6 py-3 font-normal">Repuesto</th>
                  <th className="px-4 py-3 font-normal">Stock</th>
                  <th className="px-4 py-3 font-normal">Mínimo</th>
                  <th className="px-4 py-3 font-normal">Precio</th>
                  <th className="px-4 py-3 font-normal">Estado</th>
                </tr>
              </thead>
              <tbody>
                {repuestos.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-6 text-muted text-center">No hay repuestos registrados todavía.</td></tr>
                )}
                {repuestos.map((r) => {
                  const bajoStock = r.stock_actual <= r.stock_minimo
                  return (
                    <tr key={r.id} className="border-t border-base-700/60">
                      <td className="px-6 py-3.5">{r.nombre}</td>
                      <td className="px-4 py-3.5">{r.stock_actual}</td>
                      <td className="px-4 py-3.5 text-muted">{r.stock_minimo}</td>
                      <td className="px-4 py-3.5">{formatearPrecio(r.precio)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${bajoStock ? 'bg-red-400/10 text-red-400' : 'bg-success/10 text-success'}`}>
                          {bajoStock ? 'Bajo stock' : 'Óptimo'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL NUEVO REPUESTO */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
            <div className="bg-base-900 border border-base-700 rounded-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-lg">Nuevo repuesto</h2>
                <button onClick={() => setModalAbierto(false)} className="text-muted hover:text-ink">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-muted block mb-1.5">Nombre del repuesto</label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej. Pastillas de freno delanteras"
                    required
                    className="w-full bg-base-850 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted block mb-1.5">Stock actual</label>
                    <input
                      name="stock_actual"
                      type="number"
                      min="0"
                      value={form.stock_actual}
                      onChange={handleChange}
                      required
                      className="w-full bg-base-850 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1.5">Stock mínimo</label>
                    <input
                      name="stock_minimo"
                      type="number"
                      min="0"
                      value={form.stock_minimo}
                      onChange={handleChange}
                      required
                      className="w-full bg-base-850 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1.5">Precio ($)</label>
                  <input
                    name="precio"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.precio}
                    onChange={handleChange}
                    required
                    className="w-full bg-base-850 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
                  />
                </div>

                {errorForm && <p className="text-red-400 text-xs">{errorForm}</p>}

                <button
                  type="submit"
                  disabled={guardando}
                  className="w-full bg-brand hover:bg-brand-dark transition-colors text-white font-semibold py-2.5 rounded-lg disabled:opacity-60"
                >
                  {guardando ? 'Guardando...' : 'Crear repuesto'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Inventario