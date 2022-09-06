import axios from 'axios'
import { getSecret } from '@/utils'
import store from '@/store'
const server = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000
})

server.interceptors.request.use(
  (config) => {
    const headers = config.headers || {}
    config.headers = {
      Authorization: `Bearer ${store.getters.token}`, // 请求头中携带token
      ...headers,
      ...getSecret()
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

server.interceptors.response.use(
  (response) => {
    const { success, message, data } = response.data
    if (success) {
      return data
    } else {
      return Promise.reject(message)
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default server
