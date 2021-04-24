import React from 'react';
import useSWR from 'swr';
import logo from '../../assets/img/logo.svg';
import './Popup.css';

const fetcher = url => fetch(url, { headers: { 'X-CMC_PRO_API_KEY': process.env.CMC_KEY } }).then(r => r.json().then(res => res.data))

const Popup = () => {
  const { data } = useSWR('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', fetcher)
  console.log(data)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/Popup/Popup.js</code> and save to reload.
        </p>

      </header>
      {data?.map(coin => (
        <div key={coin.id}>
          {coin.name}: {coin.quote.USD.price}
        </div>
      ))}
    </div>
  );
};

export default Popup;
