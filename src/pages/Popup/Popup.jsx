import React, { useState } from 'react';
import CryptoList from './CryptoList'
import './Popup.css';

const Popup = () => {
  const [page, setPage] = useState('list');

  if (page === 'list') {
    return <CryptoList />
  }
};

export default Popup;
