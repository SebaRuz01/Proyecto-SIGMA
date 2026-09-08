import axios from 'axios'

const RENDER_URL = 'https://bd-sigma.onrender.com/api'

const api = axios.create({
  baseURL: RENDER_URL,
})


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // Reemplaza localhost o referencias anteriores al vuelo
  if (config.url && config.url.includes('127.0.0.1:8000')) {
    config.url = config.url.replace('http://127.0.0.1:8000/api', RENDER_URL)
  }
  
  return config
})

export default api