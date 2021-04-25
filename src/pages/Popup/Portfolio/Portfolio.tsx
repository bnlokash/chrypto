import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import { cmcFetcher } from '../../../services/fetcher';
import { Holding } from '../../../types/settings.types';
import CryptoDiagramTotal from '../CryptoDiagram/CryptoDiagramTotal';
import PortfolioHolding from './PortfolioHolding';
import './Portfolio.scss'

type PortfolioProps = {
  setPage: (page: string) => void
}

const Portfolio: React.FC<PortfolioProps> = ({ setPage }) => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [holdingData, setHoldingData] = useState<{ [key: string]: any }>({});
  const [chartPeriod, setChartPeriod] = useState('1m');

  const { data } = useSWR(holdings.length > 0 ?
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=${holdings.map(c => c.slug).join(',')}`
    : null, cmcFetcher)

  // fetch holdings from chrome storage
  useEffect(() => {
    chrome.storage.sync.get('holdings', (value) => {
      setHoldings(value.holdings?.filter((h: any) => h.slug && h.amount) ?? [])
    });
  }, [])

  const [meta, setMeta] = useState()
  useEffect(() => {
    if (data) {
      const ids = Object.values(data).map((coin: any) => coin.id)
      cmcFetcher(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${ids.join(',')}`).then(r => {
        setMeta(r)
      })
    }
  }, [data])

  return (
    <div className="portfolio">
      <div className="header">
        <h3>Portfolio</h3>
        <div>
          <button onClick={() => setChartPeriod('24h')} className={chartPeriod === '24h' ? 'active' : ''}>24h</button>
          <button onClick={() => setChartPeriod('1w')} className={chartPeriod === '1w' ? 'active' : ''}>1w</button>
          <button onClick={() => setChartPeriod('1m')} className={chartPeriod === '1m' ? 'active' : ''}>1m</button>
        </div>
      </div>

      <h4>Total:{' '}

        {holdings.reduce(
          (prev, current) => prev + current.amount * ((Object.values(data ?? {}).find((d: any) => d.slug === current.slug) as any)?.quote?.USD.price),
          0
        ).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</h4>

      <CryptoDiagramTotal holdingData={holdingData} chartPeriod={chartPeriod} />

      {Object.values(data ?? {}).map((coin: any) => (
        <PortfolioHolding
          key={coin.id}
          coin={coin}
          holding={holdings.find(h => h.slug === coin.slug) as Holding}
          meta={meta?.[coin.id]}
          setHoldingData={setHoldingData}
          chartPeriod={chartPeriod}
        />
      ))}

      {holdings.length === 0 && (
        <p>Your Portfolio is empty. Visit <a href="#" onClick={() => setPage('settings')}>Settings</a> to add your Holdings!</p>
      )}
    </div>
  )
}

export default Portfolio
