import { toFixed, toTime } from '../utils'
import { Fragment } from 'react'

const TradeList = ({
  list = []
}) => {
  return list.length > 0 ? (
    <Fragment>
      <div className="trade-label">
        <span className="item">Time</span>
        <span className="item">Price</span>
        <span className="item">Quantity</span>
      </div>
      <ol className="trade-list">
        {list.map((item, index) =>
          <li key={index} className="li">
            <span className="item">{toTime(item.T || item.E)}</span>
            <span className="item">{toFixed(item.p, 8)}</span>
            <span className="item">{toFixed(item.q, 5)}</span>
          </li>)
        }
      </ol>
    </Fragment>
  ) : 'Waiting for new Trade...'
}

export default TradeList