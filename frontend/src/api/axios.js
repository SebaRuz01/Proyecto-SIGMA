import axios from 'axios'

const LOCAL_URL = 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: LOCAL_URL,
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
  
  if (config.url && config.url.includes('bd-sigma.onrender.com')) {
    config.url = config.url.replace('https://bd-sigma.onrender.com/api', LOCAL_URL)
  }
  
  return config
})

export default api