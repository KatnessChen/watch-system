import axios from 'axios'
const request = axios.create({
  baseURL: 'https://api.binance.com/api/v3'
})

request.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error),
)

export default request
