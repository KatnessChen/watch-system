import { toFixed } from '../utils'

const MarketDepth = ({
  depthInfo
}) => {
  return depthInfo ? (
    <div className="market-depth">
      <div className="market-depth-label">
        <span className="item">Price</span>
        <span className="item">Quantity</span>
      </div>
      <ol className="market-depth-list">
        {depthInfo.asks
          .sort((a, b) => b[0] - a[0])
          .map((item, index) => 
            <li key={index} className="li">
              <span className="item is-red">{toFixed(item[0], 8)}</span>
              <span className="item">{toFixed(item[1], 5)}</span>
            </li>
          )
        }
      </ol>
      <br />
      <ol className="market-depth-list">
        {depthInfo.bids.map((item, index) =>
            <li key={index} className="li">
              <span className="item is-green">{toFixed(item[0], 8)}</span>
              <span className="item">{toFixed(item[1], 5)}</span>
            </li>
          )
        }
      </ol>
    </div>
  ) : 'Waiting for depth info...'
}

export default MarketDepth