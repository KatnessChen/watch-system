import './App.scss';
import 'antd/dist/antd.css';
import { useState, useEffect } from 'react'
import { getAllSymbols } from './services/endpoints/market'
import SymbolSelector from './components/SymbolSelector';
import TradeList from './components/TradeList';
import MarketDepth from './components/MarketDepth';

function App () {
  const [symbolOptions, setSymbolOptions] = useState([])
  const [currentSymbol, setCurrentSymbol] = useState('BTCUSDC')
  const [depthSocket, setDepthSocket] = useState(null)
  const [aggTradeSocket, setAggTradeSocket] = useState(null)
  const [depthInfo, setDepthInfo] = useState(null)
  const [aggTradeList, setAggTradeList] = useState([])

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
  }, [depthSocket, aggTradeSocket])

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
      setAggTradeList(cur => [JSON.parse(data), ...cur])
    }
    setDepthSocket(newDepthSocket)
    setAggTradeSocket(newAggTradeSocket)
  }, [currentSymbol])

  function selectSymbolHandler (symbol) {
    // document.title = `${symbol} |`
    setCurrentSymbol(symbol)
  }

  function closeWebSockets () {
    if (depthSocket) depthSocket.close()
    if (aggTradeSocket) aggTradeSocket.close()
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="label">Real-time Binance Market Watch System</div>
      </header>
      <header className="App-header">
        <div className="label">Current Symbol:</div>
        <SymbolSelector options={symbolOptions} onSelect={selectSymbolHandler} />
      </header>
      <main>
        <aside>
          <h2>Market Depth</h2>
          <MarketDepth depthInfo={depthInfo} />
        </aside>
        <article>
          <h2>Trade List</h2>
          <TradeList list={aggTradeList} />
        </article>
      </main>
      
    </div>
  );
}

export default App;
