import React, { useEffect, useState } from 'react'
import useSWR from "swr";
import { cmcFetcher } from '../../services/fetcher';
import CryptoListItem from './CryptoListItem'
import './CryptoList.scss'

type CryptoListProps = {
  isFavorites?: boolean
  setPage: (page: string) => void
};

const CryptoList: React.FC<CryptoListProps> = ({ isFavorites, setPage: setOuterPage }) => {
  const [favorites, setFavorites] = useState<any>([]);
  // fetch favorites from chrome storage
  useEffect(() => {
    chrome.storage.sync.get('favorites', (value) => {
      setFavorites(value.favorites?.filter((f: any) => f.slug) ?? [])
    });
  }, [])

  const [page, setPage] = useState(0)
  const { data } = useSWR(
    isFavorites
      ? `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${favorites.map((f: any) => f.id).join(',')}`
      : 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=100',
    cmcFetcher)

  const [meta, setMeta] = useState()
  useEffect(() => {
    if (data) {
      const ids = Object.values(data ?? []).map((coin: any) => coin.id)
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
          {Object.values(data ?? [])?.slice(page * 10, (page * 10) + 10).map((coin: any) => (
            <CryptoListItem coin={coin} meta={meta?.[coin.id]} key={coin.id} />
          ))}
          {isFavorites && favorites.length === 0 && (
            <tr><td colSpan={5}>You don't have any favorites yet. Visit <a href="#" onClick={() => setOuterPage('settings')}>Settings</a> to add some!</td></tr>
          )}
        </tbody>
      </table>

      {!isFavorites && (
        <div className="buttons">
          <div>{page * 10 + 1}- {(page * 10) + 10} / 100</div>
          <button onClick={() => setPage(page - 1)} disabled={page === 0}>{'<'}</button>
          <button onClick={() => setPage(page + 1)} disabled={page === 9}>{'>'}</button>
        </div>
      )}
    </div>
  )
}

export default CryptoList
