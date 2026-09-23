import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

// 1. IMPORTAR EL THEME PROVIDER
import { ThemeProvider } from './context/ThemeContext.jsx'

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
import Seguimiento from './pages/Seguimiento.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. ENVOLVER LA APLICACIÓN CON EL PROVIDER */}
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/panel"
            element={
              <RutaProtegida bloquearRol="super_admin">
                <PanelGeneral />
              </RutaProtegida>
            }
          />
          <Route
            path="/ordenes"
            element={
              <RutaProtegida bloquearRol="super_admin">
                <Ordenes />
              </RutaProtegida>
            }
          />
          <Route
            path="/tecnicos"
            element={
              <RutaProtegida bloquearRol="super_admin">
                <Tecnicos />
              </RutaProtegida>
            }
          />
          <Route
            path="/inventario"
            element={
              <RutaProtegida bloquearRol="super_admin">
                <Inventario />
              </RutaProtegida>
            }
          />
          <Route
            path="/reportes"
            element={
              <RutaProtegida bloquearRol="super_admin">
                <Reportes />
              </RutaProtegida>
            }
          />

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

          <Route path="/seguimiento/:codigo" element={<Seguimiento />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)