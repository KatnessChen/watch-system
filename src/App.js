import './App.scss';
import 'antd/dist/antd.css';
import { useState, useEffect, useCallback } from 'react'
import { getAllSymbols } from './services/endpoints/market'
import SymbolSelector from './components/SymbolSelector';
import TradeList from './components/TradeList';
import MarketDepth from './components/MarketDepth';
import { toFixed } from './utils'

function App () {
  const [symbolOptions, setSymbolOptions] = useState([])
  const [currentSymbol, setCurrentSymbol] = useState('BTCUSDC')
  const [depthSocket, setDepthSocket] = useState(null)
  const [aggTradeSocket, setAggTradeSocket] = useState(null)
  const [depthInfo, setDepthInfo] = useState(null)
  const [aggTradeList, setAggTradeList] = useState([])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const closeWebSockets = useCallback(() => {
    if (depthSocket) depthSocket.close()
    if (aggTradeSocket) aggTradeSocket.close()
  })

  useEffect(() => {
    async function fetchSymbols () {
      try {
        const { data: allSymbols } = await getAllSymbols()
        const symbolOptions = allSymbols.map(item => ({ value: item.symbol, label: item.symbol }))
        setSymbolOptions(symbolOptions)
      } catch {
        // show error message
      }
    }
    fetchSymbols()

    return () => {
      closeWebSockets()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {
    closeWebSockets()

    // clear trade list & depth info
    setDepthInfo(null)
    setAggTradeList([])

    const newDepthSocket = new WebSocket(`wss://stream.binance.com:9443/ws/${currentSymbol.toLowerCase()}@depth10`)
    const newAggTradeSocket = new WebSocket(`wss://stream.binance.com:9443/ws/${currentSymbol.toLowerCase()}@aggTrade`)
        
    newDepthSocket.onmessage = function ({ data }) {
      setDepthInfo(JSON.parse(data))
    }
    newAggTradeSocket.onmessage = function ({ data }) {
      const response = JSON.parse(data)
      document.title = `${toFixed(response.p, 2)} | ${currentSymbol}`
      setAggTradeList(cur => [response, ...cur])
    }
    setDepthSocket(() => newDepthSocket)
    setAggTradeSocket(() => newAggTradeSocket)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSymbol])

  function selectSymbolHandler (symbol) {
    document.title = symbol
    setCurrentSymbol(symbol)
  }


  return (
    <div className="App">
      <header className="App-header">
        <div className="label">Real-time Binance Market Watch System</div>
        <div className="selector">
          <div>Current Symbol:</div>
          <SymbolSelector options={symbolOptions} onSelect={selectSymbolHandler} />
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
