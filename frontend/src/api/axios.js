import axios from 'axios'

<<<<<<< HEAD
const RENDER_URL = 'https://bd-sigma.onrender.com/api'

const api = axios.create({
  baseURL: RENDER_URL,
})


=======
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

>>>>>>> 2dd7fc896ee552586ccf67d9317ebc02b9a77a3a
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

<<<<<<< HEAD

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

=======
>>>>>>> 2dd7fc896ee552586ccf67d9317ebc02b9a77a3a
export default api