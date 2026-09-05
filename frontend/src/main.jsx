import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import PanelGeneral from './pages/PanelGeneral.jsx'
import Ordenes from './pages/Ordenes.jsx'
import Tecnicos from './pages/Tecnicos.jsx'
import Inventario from './pages/Inventario.jsx'
import Reportes from './pages/Reportes.jsx'
import RutaProtegida from './components/RutaProtegida.jsx'
import SuperAdmin from './pages/SuperAdmin.jsx'
import NuevoTaller from './pages/NuevoTaller.jsx'
import EditarTaller from './pages/EditarTaller.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/panel" element={<RutaProtegida><PanelGeneral /></RutaProtegida>} />
        <Route path="/ordenes" element={<RutaProtegida><Ordenes /></RutaProtegida>} />
        <Route path="/tecnicos" element={<RutaProtegida><Tecnicos /></RutaProtegida>} />
        <Route path="/inventario" element={<RutaProtegida><Inventario /></RutaProtegida>} />
        <Route path="/reportes" element={<RutaProtegida><Reportes /></RutaProtegida>} />
        <Route
          path="/super-admin"
          element={
            <RutaProtegida rolRequerido="super_admin">
              <SuperAdmin />
            </RutaProtegida>
          }
        />
        <Route
          path="/super-admin/nuevo-taller"
          element={
            <RutaProtegida rolRequerido="super_admin">
              <NuevoTaller />
            </RutaProtegida>
          }
        />
        <Route
          path="/super-admin/talleres/:id/editar"
          element={
            <RutaProtegida rolRequerido="super_admin">
              <EditarTaller />
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)