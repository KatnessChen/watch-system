import './App.scss';
import 'antd/dist/antd.css';
import { useState, useEffect, useCallback } from 'react'
import { getAllSymbols, getAggTrade, getMarketDepth } from './services/endpoints/market'
import SymbolSelector from './components/SymbolSelector';
import TradeList from './components/TradeList';
import MarketDepth from './components/MarketDepth';
import { toFixed } from './utils'



function App () {
  const [defaultSymbol] = useState('btcusdc')
  const [symbolOptions, setSymbolOptions] = useState([])
  const [currentSymbol, setCurrentSymbol] = useState(defaultSymbol)
  const [ws, setWs] = useState(null)
  const [depthInfo, setDepthInfo] = useState(null)
  const [aggTradeList, setAggTradeList] = useState([])

  const subscribe = useCallback((ws, symbol) => {
    ws.send(JSON.stringify({
      method: 'SUBSCRIBE',
      params: [
        `${symbol}@aggTrade`,
        `${symbol}@depth10`
      ],
      id: 1
    }))
  }, [])

  const unsubscribe = useCallback((ws, symbol) => {
    ws.send(JSON.stringify({
      method: 'UNSUBSCRIBE',
      params: [
        `${symbol}@aggTrade`,
        `${symbol}@depth10`
      ],
      id: 1
    }))
  }, [])

  const initSymbolInfo = useCallback((symbol) => {
    getAggTrade(symbol)
      .then(historyAggTradeList => {
        setAggTradeList(() => historyAggTradeList)
      })
    getMarketDepth(symbol)
      .then(historyDepthInfo => {
        setDepthInfo(() => historyDepthInfo)
      })
  }, [])

  useEffect(() => {
    function connectToWs () {
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${defaultSymbol}@aggTrade`)
      setWs(ws)

      ws.onopen = () => subscribe(ws, defaultSymbol)
      ws.onmessage = ({ data }) => {
        const response = JSON.parse(data)
        if (response.e && response.e === 'aggTrade') {
          document.title = `${toFixed(response.p, 5)} | ${currentSymbol.toUpperCase()}`
          setAggTradeList(cur => [response, ...cur])
        } else if (response.asks && response.bids) {
          setDepthInfo(() => response)
        }
      }
    }
    async function fetchSymbols () {      
      const symbolOptions = (await getAllSymbols()).map(item => ({ value: item.symbol.toLowerCase(), label: item.symbol }))
      setSymbolOptions(symbolOptions)
    }

    try {
      connectToWs()
      fetchSymbols()
      initSymbolInfo(defaultSymbol)
    } catch {
      // error
    }
    return () => ws && ws.close()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectSymbolHandler = useCallback((selectedSymbol) => {
    initSymbolInfo(selectedSymbol)
    unsubscribe(ws, currentSymbol)
    subscribe(ws, selectedSymbol)
    document.title = selectedSymbol.toUpperCase()
    setCurrentSymbol(selectedSymbol)
  }, [currentSymbol, initSymbolInfo, subscribe, unsubscribe, ws])

  return (
    <div className="App">
      <header className="App-header">
        <div className="label">Real-time Binance Market Watch System</div>
        <div className="selector">
          <div>Current Symbol:</div>
          <SymbolSelector
            defaultValue={defaultSymbol}
            options={symbolOptions}
            onSelect={selectSymbolHandler}
          />
        </div>
      </header>
      <main>
        <div className="depth-block">
          <h2>Market Depth</h2>
          <MarketDepth depthInfo={depthInfo} />
        </div>
        <div className="trade-block">
          <h2>Trade List</h2>
          <TradeList list={aggTradeList} />
        </div>
      </main>
      
    </div>
  );
}

export default App;
