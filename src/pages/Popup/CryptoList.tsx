import React from 'react'
import useSWR from "swr";
import secrets from 'secrets'

const fetcher = (url: string) => fetch(url, { headers: { 'X-CMC_PRO_API_KEY': secrets.CMC_KEY } }).then(r => r.json().then(res => res.data))


type CryptoListProps = {};

const CryptoList: React.FC<CryptoListProps> = () => {
    const { data } = useSWR('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', fetcher)
    return (
        <div>
            {data?.map((coin: any) => (
                <div key={coin.id}>
                    {coin.name}: {coin.quote.USD.price}
                </div>
            ))}
        </div>
    )
}

export default CryptoList