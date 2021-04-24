import React, { useEffect, useState } from 'react'
import useSWR from "swr";
import { cmcFetcher } from '../../services/fetcher';
import CryptoListItem from './CryptoListItem'
import './CryptoList.scss'

type CryptoListProps = {};

const CryptoList: React.FC<CryptoListProps> = () => {
  const { data } = useSWR('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=100', cmcFetcher)

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
      <table>
        <thead>
          <th>Name</th>
          <th>Price USD</th>
          <th>24h%</th>
          <th>7d%</th>
          <th>Volume (24h)</th>
        </thead>
        <tbody>
          {data?.map((coin: any) => (
            <CryptoListItem coin={coin} meta={meta?.[coin.id]} key={coin.id} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CryptoList
