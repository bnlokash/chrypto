import React from 'react'
import { Holding } from '../../../types/settings.types'
import CryptoDiagram from '../CryptoDiagram/CryptoDiagram'

type PortfolioHoldingProps = {
  holding: Holding
  setHoldingData: any
  chartPeriod: string
  coin: any
  meta: any
}

const PortfolioHolding: React.FC<PortfolioHoldingProps> = ({ holding, coin, setHoldingData, meta, chartPeriod }) => {
  return (
    <div>
      <div className="icon-and-name">
        {meta &&
          <img
            style={{ height: '24px', width: '24px' }}
            src={meta.logo}>
          </img>}
        {coin.name}:{' '}
      </div>
      {holding.amount} {coin.symbol} / {' '}
      {(coin.quote?.USD.price * holding.amount).toFixed(2)} USD

      <CryptoDiagram coin={coin} holding={holding} setHoldingData={setHoldingData} chartPeriod={chartPeriod} />
    </div>
  )
}

export default PortfolioHolding
