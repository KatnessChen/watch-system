import request from '../request'

export function getAllSymbols () {
  return request({
    url: '/api/v3/ticker/price',
    method: 'GET'
  })
}