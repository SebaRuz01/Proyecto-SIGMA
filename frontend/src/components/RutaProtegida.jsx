import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

function RutaProtegida({ children, rolRequerido }) {
  const token = localStorage.getItem('access_token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (rolRequerido) {
    try {
      const decoded = jwtDecode(token)
      if (decoded.rol !== rolRequerido) {
        return <Navigate to="/panel" replace />
      }
    } catch {
      return <Navigate to="/login" replace />
    }
  }

  return children
}

export default RutaProtegida