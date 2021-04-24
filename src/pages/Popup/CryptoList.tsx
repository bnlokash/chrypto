import React, { useEffect, useState } from 'react'
import useSWR from "swr";
import secrets from 'secrets'

const fetcher = (url: string) => fetch(url, { headers: { 'X-CMC_PRO_API_KEY': secrets.CMC_KEY } }).then(r => r.json().then(res => res.data))


type CryptoListProps = {};

const CryptoList: React.FC<CryptoListProps> = () => {
  const { data } = useSWR('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', fetcher)

  const [meta, setMeta] = useState()
  useEffect(() => {
    if (data) {
      const ids = data.map((coin: any) => coin.id)
      fetcher(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${ids.join(',')}`).then(r => {
        setMeta(r)
      })
    }
  }, [data])

  return (
    <div>
      {data?.map((coin: any) => (
        <div key={coin.id}>
          {meta?.[coin.id] && <img style={{ height: '12px', width: '12px' }} src={(meta?.[coin.id] as any).logo}></img>}

          {coin.name}: {coin.quote.USD.price}
        </div>
      ))}
    </div>
  )
}

export default CryptoList
