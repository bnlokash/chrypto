import React from 'react'
import { Holding } from '../../../types/settings.types'

type PortfolioHoldingProps = {
  holding: Holding
  coin: any
}

const PortfolioHolding: React.FC<PortfolioHoldingProps> = ({ holding, coin }) => {
  return (
    <div>
      {coin.name}:
      {holding.amount} {coin.symbol} / {' '}
      {(coin.quote?.USD.price * holding.amount).toFixed(2)} USD
    </div>
  )
}

export default PortfolioHolding
