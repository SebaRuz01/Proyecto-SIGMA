import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import logoIcono from '../assets/logo.png'
import { ArrowLeft } from 'lucide-react'

function EditarTaller() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(null)

  useEffect(() => {
    api.get(`/talleres/${id}/`)
      .then((res) => setForm(res.data))
      .finally(() => setCargando(false))
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setGuardando(true)
    try {
      await api.patch(`/talleres/${id}/`, {
        nombre_comercial: form.nombre_comercial,
        rut: form.rut,
        rubro: form.rubro,
        direccion: form.direccion,
        estado: form.estado,
      })
      navigate('/super-admin')
    } catch (err) {
      setError('No se pudo guardar. Revisa los datos.')
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return <div className="bg-base-950 text-ink min-h-screen flex items-center justify-center">Cargando...</div>
  }

  if (!form) {
    return <div className="bg-base-950 text-ink min-h-screen flex items-center justify-center">Taller no encontrado.</div>
  }

  return (
    <div className="bg-base-950 text-ink min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <Link to="/super-admin" className="flex items-center gap-2 text-muted hover:text-ink text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver a talleres clientes
        </Link>

        <div className="flex items-center gap-2 mb-8">
          <img src={logoIcono} alt="SIGMA" className="h-8 w-auto" />
          <h1 className="font-display font-bold text-2xl">Editar taller</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-base-850 border border-base-700 rounded-xl p-6 space-y-4">
          <div>
            <label className="text-xs text-muted block mb-1.5">Nombre comercial</label>
            <input
              name="nombre_comercial"
              value={form.nombre_comercial}
              onChange={handleChange}
              required
              className="w-full bg-base-900 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted block mb-1.5">RUT</label>
              <input
                name="rut"
                value={form.rut}
                onChange={handleChange}
                required
                className="w-full bg-base-900 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1.5">Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full bg-base-900 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
              >
                <option value="prueba">Prueba</option>
                <option value="activo">Activo</option>
                <option value="suspendido">Suspendido</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted block mb-1.5">Rubro</label>
            <input
              name="rubro"
              value={form.rubro}
              onChange={handleChange}
              required
              className="w-full bg-base-900 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1.5">Dirección</label>
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              className="w-full bg-base-900 border border-base-700 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand"
            />
          </div>

          {error && (
            <div className="bg-red-400/10 border border-red-400/30 text-red-400 text-xs rounded-lg px-3.5 py-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={guardando}
            className="w-full bg-brand hover:bg-brand-dark transition-colors text-white font-semibold py-3 rounded-lg disabled:opacity-60"
          >
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditarTaller