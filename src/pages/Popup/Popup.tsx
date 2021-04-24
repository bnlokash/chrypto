import React, { useState } from 'react';
import CryptoList from './CryptoList'
import PopupNav from './Nav/PopupNav';
import Settings from './Settings';
import Portfolio from './Portfolio/Portfolio';
import './Popup.css';

const Popup = () => {
  const [page, setPage] = useState('list');

  return (
    <div>
      <PopupNav page={page} setPage={setPage} />
      {page === 'list' && <CryptoList />}
      {page === 'portfolio' && <Portfolio setPage={setPage} />}
      {page === 'settings' && <Settings />}
    </div>
  );
};

export default Popup;
