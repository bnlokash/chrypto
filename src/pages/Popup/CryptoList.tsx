import React, { useEffect, useState } from 'react'
import useSWR from "swr";
import { cmcFetcher } from '../../services/fetcher';
import CryptoDiagram from './CryptoDiagram/CryptoDiagram';

type CryptoListProps = {};

const CryptoList: React.FC<CryptoListProps> = () => {
  const { data } = useSWR('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5', cmcFetcher)

  const [meta, setMeta] = useState()
  useEffect(() => {
    if (data) {
      const ids = data.map((coin: any) => coin.id)
      cmcFetcher(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${ids.join(',')}`).then(r => {
        setMeta(r)
      })
    }
  }, [data])

  return (
    <div>
      {data?.map((coin: any) => (
        <div key={coin.id}>
          {meta?.[coin.id] && <img style={{ height: '12px', width: '12px' }} src={(meta?.[coin.id] as any).logo}></img>}

          {coin.name}: {coin.quote.USD.price.toFixed(2)} USD
          <CryptoDiagram coin={coin} />
        </div>
      ))}
    </div>
  )
}

export default CryptoList
