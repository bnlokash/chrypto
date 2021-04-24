import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import { cmcFetcher } from '../../../services/fetcher';
import { Holding } from '../../../types/settings.types';
import PortfolioHolding from './PortfolioHolding';

type PortfolioProps = {
  setPage: (page: string) => void
}

const Portfolio: React.FC<PortfolioProps> = ({ setPage }) => {
  const [holdings, setHoldings] = useState<Holding[]>([]);

  const { data } = useSWR(holdings.length > 0 ?
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=${holdings.map(c => c.slug).join(',')}`
    : null, cmcFetcher)

  // fetch holdings from chrome storage
  useEffect(() => {
    chrome.storage.sync.get('holdings', (value) => {
      setHoldings(value.holdings ?? [])
    });
  }, [])

  return (
    <div>
      <h4>Portfolio</h4>

      {Object.values(data ?? {}).map((coin: any) => (
        <PortfolioHolding key={coin.id} coin={coin} holding={holdings.find(h => h.slug === coin.slug) as Holding} />
      ))}

      {holdings.length === 0 && (
        <p>Your Portfolio is empty. Visit <a href="#" onClick={() => setPage('settings')}>Settings</a> to add your Holdings!</p>
      )}
    </div>
  )
}

export default Portfolio
