import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import api from '../api/axios'
import logoIcono from '../assets/logo.png'
import { LogOut } from 'lucide-react'

function SuperAdmin() {
  const navigate = useNavigate()
  const [talleres, setTalleres] = useState([])
  const [modulos, setModulos] = useState([])
  const [contratados, setContratados] = useState([])
  const [tallerSeleccionado, setTallerSeleccionado] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardandoModulo, setGuardandoModulo] = useState(null)
  const [pagina, setPagina] = useState(1)
  const talleresPorPagina = 8
  const [busqueda, setBusqueda] = useState('')

  const cargarTodo = () => {
    Promise.all([
      api.get('/talleres/'),
      api.get('/modulos/'),
      api.get('/modulos-contratados/'),
    ])
      .then(([t, m, mc]) => {
        setTalleres(t.data)
        setModulos(m.data)
        setContratados(mc.data)
        if (t.data.length > 0) setTallerSeleccionado(t.data[0].id)
      })
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    cargarTodo()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/login')
  }

  const modulosDelTaller = (tallerId) =>
    contratados.filter((c) => c.taller === tallerId)

  const toggleModulo = async (modulo) => {
    const existente = contratados.find(
      (c) => c.taller === tallerSeleccionado && c.modulo === modulo.id
    )
    setGuardandoModulo(modulo.id)
    try {
      if (existente) {
        const res = await api.patch(`/modulos-contratados/${existente.id}/`, {
          activo: !existente.activo,
        })
        setContratados((prev) =>
          prev.map((c) => (c.id === existente.id ? res.data : c))
        )
      } else {
        const res = await api.post('/modulos-contratados/', {
          taller: tallerSeleccionado,
          modulo: modulo.id,
          activo: true,
        })
        setContratados((prev) => [...prev, res.data])
      }
    } finally {
      setGuardandoModulo(null)
    }
  }

  const toggleSuspension = async (taller, e) => {
    e.stopPropagation()
    const nuevoEstado = taller.estado === 'suspendido' ? 'activo' : 'suspendido'
    const res = await api.patch(`/talleres/${taller.id}/`, { estado: nuevoEstado })
    setTalleres((prev) => prev.map((t) => (t.id === taller.id ? res.data : t)))
  }

  const taller = talleres.find((t) => t.id === tallerSeleccionado)

  const talleresFiltrados = talleres.filter((t) =>
    t.nombre_comercial.toLowerCase().includes(busqueda.toLowerCase())
  )
  const totalPaginas = Math.max(1, Math.ceil(talleresFiltrados.length / talleresPorPagina))
  const talleresVisibles = talleresFiltrados.slice(
    (pagina - 1) * talleresPorPagina,
    pagina * talleresPorPagina
  )

  return (
    <div className="bg-base-950 text-ink min-h-screen flex">
      {/* SIDEBAR SIMPLE PARA SUPER-ADMIN */}
      <aside className="w-60 shrink-0 border-r border-base-700/60 min-h-screen p-6 hidden lg:flex flex-col bg-base-950">
        <Link to="/" className="flex items-center gap-2 mb-2">
          <img src={logoIcono} alt="SIGMA" className="h-7 w-auto" />
          <span className="font-display font-bold text-lg tracking-tight">SIGMA</span>
        </Link>
        <div className="text-[10px] uppercase tracking-widest text-red-400 font-semibold mb-10">
          Super admin
        </div>
        <nav className="space-y-1 text-sm font-medium">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-base-850 text-ink border border-base-700">
            Talleres
          </div>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 text-muted hover:text-red-400 transition-colors text-xs px-3 py-2 rounded-lg hover:bg-base-850"
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="text-xs text-muted mb-1">Gestión de clientes</div>
            <h1 className="font-display font-bold text-3xl">Talleres suscritos</h1>
          </div>
          <Link
            to="/super-admin/nuevo-taller"
            className="bg-brand hover:bg-brand-dark transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
          >
            + Nuevo taller
          </Link>
        </div>

        {cargando && <p className="text-muted text-sm">Cargando...</p>}

        {!cargando && (
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
            {/* TABLA DE TALLERES */}
            <div className="bg-base-850 border border-base-700 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-base-700 flex items-center justify-between gap-4">
                <span className="font-display font-semibold">Clientes</span>
                <input
                  type="text"
                  placeholder="Buscar taller..."
                  value={busqueda}
                  onChange={(e) => { setBusqueda(e.target.value); setPagina(1) }}
                  className="bg-base-900 border border-base-700 rounded-lg px-3.5 py-2 text-sm w-48 focus:outline-none focus:border-brand"
                />
              </div>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs text-muted">
                    <th className="px-6 py-3 font-normal">Taller</th>
                    <th className="px-4 py-3 font-normal">Rubro</th>
                    <th className="px-4 py-3 font-normal">Módulos activos</th>
                    <th className="px-4 py-3 font-normal">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {talleresVisibles.map((t) => {
                    const activos = modulosDelTaller(t.id).filter((c) => c.activo)
                    return (
                      <tr
                        key={t.id}
                        onClick={() => setTallerSeleccionado(t.id)}
                        className={`border-t border-base-700/60 cursor-pointer transition-colors ${
                          tallerSeleccionado === t.id ? 'bg-base-900' : 'hover:bg-base-900/50'
                        }`}
                      >
                        <td className="px-6 py-3.5 font-medium">{t.nombre_comercial}</td>
                        <td className="px-4 py-3.5 text-muted capitalize">{t.rubro}</td>
                        <td className="px-4 py-3.5 text-muted">
                          {activos.length === 0
                            ? 'Ninguno'
                            : activos.map((a) => a.modulo_nombre).join(' · ')}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              t.estado === 'activo' ? 'bg-success/10 text-success' :
                              t.estado === 'prueba' ? 'bg-amber-400/10 text-amber-400' :
                              'bg-red-400/10 text-red-400'
                            }`}>
                              {t.estado}
                            </span>
                            <Link
                              to={`/super-admin/talleres/${t.id}/editar`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-muted hover:text-brand transition-colors"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={(e) => toggleSuspension(t, e)}
                              className="text-xs text-muted hover:text-red-400 transition-colors"
                            >
                              {t.estado === 'suspendido' ? 'Reactivar' : 'Suspender'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div className="flex items-center justify-between px-6 py-4 border-t border-base-700/60 text-xs text-muted">
                <span>
                  Mostrando {talleresVisibles.length} de {talleres.length} talleres
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagina((p) => Math.max(1, p - 1))}
                    disabled={pagina === 1}
                    className="px-3 py-1.5 rounded-lg border border-base-700 disabled:opacity-30 disabled:cursor-not-allowed hover:border-muted transition-colors"
                  >
                    Anterior
                  </button>
                  <span>Página {pagina} de {totalPaginas}</span>
                  <button
                    onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                    disabled={pagina === totalPaginas}
                    className="px-3 py-1.5 rounded-lg border border-base-700 disabled:opacity-30 disabled:cursor-not-allowed hover:border-muted transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>

            {/* GESTOR DE MÓDULOS DEL TALLER SELECCIONADO */}
            <div className="bg-base-850 border border-base-700 rounded-xl p-6">
              <div className="text-xs text-muted mb-1">Módulos contratados</div>
              <div className="font-display font-semibold text-lg mb-5">
                {taller?.nombre_comercial || '—'}
              </div>

              <div className="space-y-4">
                {modulos.map((m) => {
                  const contrato = contratados.find(
                    (c) => c.taller === tallerSeleccionado && c.modulo === m.id
                  )
                  const activo = contrato?.activo || false
                  return (
                    <div key={m.id} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm">{m.nombre}</div>
                        <div className="text-[11px] text-muted">{m.descripcion}</div>
                      </div>
                      <button
                        onClick={() => toggleModulo(m)}
                        disabled={guardandoModulo === m.id}
                        className={`w-9 h-5 rounded-full relative transition-colors ${
                          activo ? 'bg-success' : 'bg-base-700'
                        } disabled:opacity-50`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                            activo ? 'left-4.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default SuperAdmin
