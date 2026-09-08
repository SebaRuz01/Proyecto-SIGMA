import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

function RutaProtegida({ children, rolRequerido, bloquearRol }) {
  const token = localStorage.getItem('access_token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  let decoded
  try {
    decoded = jwtDecode(token)
  } catch {
    return <Navigate to="/login" replace />
  }

  if (rolRequerido && decoded.rol !== rolRequerido) {
    return <Navigate to="/panel" replace />
  }

  if (bloquearRol && decoded.rol === bloquearRol) {
    return <Navigate to="/super-admin" replace />
  }

  return children
}

export default RutaProtegida