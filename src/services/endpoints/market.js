import request from '../request'

export function getAllSymbols () {
  return request({
    url: '/ticker/price',
    method: 'GET'
  })
}

export function getMarketDepth (symbol, limit = 10) {
  return request({
    url: '/depth',
    method: 'GET',
    params: {
      symbol: symbol.toUpperCase(),
      limit
    }
  })
}

export function getAggTrade (symbol, limit = 50) {
  return request({
    url: '/aggTrades',
    method: 'GET',
    params: {
      symbol: symbol.toUpperCase(),
      limit
    }
  })
}