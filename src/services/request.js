import axios from 'axios'
const request = axios.create({
  baseURL: 'https://api.binance.com'
})


// 攔截 response
request.interceptors.response.use(
  (response) => {
    return { data: response.data }
  },
  async (error) => {
    return Promise.reject(error)
  },
)

export default request
