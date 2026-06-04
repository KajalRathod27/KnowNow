// import axios from 'axios'

// const api = axios.create({
//   baseURL: '/api',
//   timeout: 30000,
// })

// export const checkHealth = () => api.get('/health')

// export const predictSingle = (text) =>
//   api.post('/predict', { text })

// export const predictBatch = (texts) =>
//   api.post('/predict/batch', { texts })

// export const predictCSV = (file) => {
//   const form = new FormData()
//   form.append('file', file)
//   return api.post('/predict/csv', form, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   })
// }

// export default api

import axios from 'axios'

// const api = axios.create({
//   baseURL: '/api',    // ← must be exactly this, not http://localhost:8000
//   timeout: 30000,
// })

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://knownow-q1rq.onrender.com',
  timeout: 30000,
})

export const checkHealth  = ()       => api.get('/health')
export const predictSingle = (text)  => api.post('/predict', { text })
export const predictBatch  = (texts) => api.post('/predict/batch', { texts })
export const predictCSV    = (file)  => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/predict/csv', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export default api