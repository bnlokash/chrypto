import React, { useState } from 'react';
import CryptoList from './CryptoList'
import PopupNav from './Nav/PopupNav';
import Settings from './Settings';
import './Popup.css';

const Popup = () => {
  const [page, setPage] = useState('list');

  return (
    <div>
      <PopupNav page={page} setPage={setPage} />
      {page === 'list' && <CryptoList />}
      {page === 'settings' && <Settings />}
    </div>
  );
};

export default Popup;
