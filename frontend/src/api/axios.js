import axios from 'axios'

const PROD_URL = 'https://bd-sigma.onrender.com/api'

const api = axios.create({
  baseURL: PROD_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Asegura que cualquier petición local sea redirigida automáticamente al servidor online
  if (config.url) {
    config.url = config.url
      .replace('http://127.0.0.1:8000/api', PROD_URL)
      .replace('http://localhost:8000/api', PROD_URL)
      .replace('http://127.0.0.1:8000', 'https://bd-sigma.onrender.com')
      .replace('http://localhost:8000', 'https://bd-sigma.onrender.com')
  }

  return config
}, (error) => {
  return Promise.reject(error)
})

export default api