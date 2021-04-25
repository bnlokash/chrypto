import React, { useEffect, useState } from 'react'
import useSWR from "swr";
import { cmcFetcher } from '../../services/fetcher';
import CryptoListItem from './CryptoListItem'
import './CryptoList.scss'

type CryptoListProps = {};

const CryptoList: React.FC<CryptoListProps> = () => {
  const [page, setPage] = useState(0)
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
          {data?.slice(page * 10, (page * 10) + 10).map((coin: any) => (
            <CryptoListItem coin={coin} meta={meta?.[coin.id]} key={coin.id} />
          ))}
        </tbody>
      </table>
      <div className="buttons">
        <div>{page * 10 + 1}- {(page * 10) + 10} / 100</div>
        <button onClick={() => setPage(page - 1)} disabled={page === 0}>{'<'}</button>
        <button onClick={() => setPage(page + 1)} disabled={page === 9}>{'>'}</button>
      </div>
    </div>
  )
}

export default CryptoList
