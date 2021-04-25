import React from 'react'
import { Holding } from '../../../types/settings.types'
import CryptoDiagram from '../CryptoDiagram/CryptoDiagram'

type PortfolioHoldingProps = {
  holding: Holding
  setHoldingData: any
  coin: any
}

const PortfolioHolding: React.FC<PortfolioHoldingProps> = ({ holding, coin, setHoldingData }) => {
  return (
    <div>
      {coin.name}:
      {holding.amount} {coin.symbol} / {' '}
      {(coin.quote?.USD.price * holding.amount).toFixed(2)} USD

      <CryptoDiagram coin={coin} holding={holding} setHoldingData={setHoldingData} />
    </div>
  )
}

export default PortfolioHolding
