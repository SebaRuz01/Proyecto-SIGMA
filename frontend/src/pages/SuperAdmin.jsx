import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import logoIcono from '../assets/logo.png'
import { LogOut, Plus, Search, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext' // <-- Importamos el contexto del tema

function SuperAdmin() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme() // <-- Obtenemos el tema actual y la función para cambiarlo
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
    <div className="bg-[#f4f7fb] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 min-h-screen flex font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 relative overflow-hidden transition-colors duration-300">
      
      {/* Fondo Decorativo */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/20 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-300/20 dark:bg-cyan-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] pointer-events-none z-0"></div>

      {/* SIDEBAR SUPER-ADMIN */}
      <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800/60 min-h-screen p-6 hidden lg:flex flex-col bg-white/90 dark:bg-[#0b0f19]/95 backdrop-blur-xl z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-colors">
        <Link to="/" className="flex items-center gap-3 mb-2 pl-2">
          <img src={logoIcono} alt="SIGMA" className="h-8 w-auto" />
          <span className="font-extrabold text-xl text-slate-800 dark:text-white tracking-tight">SIGMA</span>
        </Link>
        
        <div className="text-[10px] uppercase tracking-widest text-red-500 font-extrabold mb-10 pl-2">
          Super Admin Panel
        </div>

        <nav className="space-y-1.5 text-sm font-medium flex-1">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold shadow-sm">
            Talleres y Módulos
          </div>
        </nav>

        {/* SECCIÓN INFERIOR CON MODO OSCURO Y CERRAR SESIÓN */}
        <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800/60 space-y-2">
          
          {/* Botón de Modo Oscuro */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200 transition-colors group"
          >
            <div className="flex items-center gap-3 text-sm font-semibold">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-blue-400 transition-colors" />
              ) : (
                <Sun className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
              )}
              <span>{theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}</span>
            </div>
            
            <div className={`w-9 h-5 rounded-full flex items-center p-0.5 transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-500' : 'bg-slate-300'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm font-semibold px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 group"
          >
            <LogOut className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full relative z-10 overflow-y-auto h-screen">
        
        {/* ENCABEZADO */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Gestión Global de Clientes</div>
            <h1 className="font-extrabold text-3xl text-slate-800 dark:text-white tracking-tight">Talleres Suscritos</h1>
          </div>
          <Link
            to="/super-admin/nuevo-taller"
            className="bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 text-white text-sm font-bold px-6 py-3 rounded-full flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo taller
          </Link>
        </div>

        {cargando && (
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20 shadow-sm max-w-sm">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Cargando talleres y licencias...
          </div>
        )}

        {!cargando && (
          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 items-start">
            
            {/* TABLA DE TALLERES */}
            <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-colors">
              
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-4 bg-white dark:bg-transparent">
                <span className="font-bold text-slate-800 dark:text-white text-lg">Directorio de Clientes</span>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar taller..."
                    value={busqueda}
                    onChange={(e) => { setBusqueda(e.target.value); setPagina(1) }}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm w-56 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 font-medium transition-colors"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-bold border-b border-slate-100 dark:border-slate-800/60">Taller</th>
                      <th className="px-4 py-4 font-bold border-b border-slate-100 dark:border-slate-800/60">Rubro</th>
                      <th className="px-4 py-4 font-bold border-b border-slate-100 dark:border-slate-800/60">Módulos activos</th>
                      <th className="px-4 py-4 font-bold border-b border-slate-100 dark:border-slate-800/60">Estado / Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {talleresVisibles.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-slate-400 text-sm">
                          No se encontraron talleres.
                        </td>
                      </tr>
                    )}
                    {talleresVisibles.map((t) => {
                      const activos = modulosDelTaller(t.id).filter((c) => c.activo)
                      return (
                        <tr
                          key={t.id}
                          onClick={() => setTallerSeleccionado(t.id)}
                          className={`cursor-pointer transition-colors ${
                            tallerSeleccionado === t.id 
                              ? 'bg-blue-50/60 dark:bg-blue-900/20' 
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{t.nombre_comercial}</td>
                          <td className="px-4 py-4 text-slate-600 dark:text-slate-400 capitalize font-medium">{t.rubro}</td>
                          <td className="px-4 py-4 text-slate-500 dark:text-slate-400 text-xs">
                            {activos.length === 0
                              ? <span className="text-slate-400 italic">Ninguno</span>
                              : activos.map((a) => a.modulo_nombre).join(' · ')}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${
                                t.estado === 'activo' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' :
                                t.estado === 'prueba' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' :
                                'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20'
                              }`}>
                                {t.estado}
                              </span>
                              
                              <Link
                                to={`/super-admin/talleres/${t.id}/editar`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 px-2.5 py-1.5 rounded-lg transition-colors border border-blue-200 dark:border-blue-500/30"
                              >
                                Editar
                              </Link>
                              
                              <button
                                onClick={(e) => toggleSuspension(t, e)}
                                className={`text-xs font-bold transition-colors px-2.5 py-1.5 rounded-lg border ${
                                  t.estado === 'suspendido' 
                                    ? 'text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/10' 
                                    : 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                                }`}
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
              </div>

              {/* PAGINACIÓN */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-800/30">
                <span>
                  Mostrando {talleresVisibles.length} de {talleresFiltrados.length} talleres
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPagina((p) => Math.max(1, p - 1))}
                    disabled={pagina === 1}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-semibold"
                  >
                    Anterior
                  </button>
                  <span className="font-bold text-slate-700 dark:text-slate-300">Página {pagina} de {totalPaginas}</span>
                  <button
                    onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                    disabled={pagina === totalPaginas}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-semibold"
                  >
                    Siguiente
                  </button>
                </div>
              </div>

            </div>

            {/* GESTOR DE MÓDULOS DEL TALLER SELECCIONADO */}
            <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-colors">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Módulos Contratados</div>
              <div className="font-extrabold text-xl text-slate-800 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                {taller?.nombre_comercial || 'Selecciona un taller'}
              </div>

              {!taller ? (
                <p className="text-slate-400 text-sm text-center py-10 font-medium">Haz clic en un taller de la lista para gestionar sus accesos.</p>
              ) : (
                <div className="space-y-4">
                  {modulos.map((m) => {
                    const contrato = contratados.find(
                      (c) => c.taller === tallerSeleccionado && c.modulo === m.id
                    )
                    const activo = contrato?.activo || false
                    return (
                      <div key={m.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 transition-colors">
                        <div className="pr-4">
                          <div className="text-sm font-bold text-slate-800 dark:text-white">{m.nombre}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{m.descripcion}</div>
                        </div>
                        {/* SWITCH DE MÓDULOS */}
                        <button
                          onClick={() => toggleModulo(m)}
                          disabled={guardandoModulo === m.id}
                          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 shrink-0 ${
                            activo ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                          } disabled:opacity-50 cursor-pointer`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                              activo ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  )
}

export default SuperAdmin