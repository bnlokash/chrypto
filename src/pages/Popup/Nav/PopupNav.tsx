import React from 'react'
import './PopupNav.scss'

type PopupNavProps = {
  page: string
  setPage: (p: string) => void
}

const PopupNav: React.FC<PopupNavProps> = ({ page, setPage }) => {
  return (
    <ul className="popupNav">
      <li onClick={() => setPage('list')} className={page === 'list' ? 'active' : ''}>Popular</li>
      <li onClick={() => setPage('portfolio')} className={page === 'portfolio' ? 'active' : ''}>Portfolio</li>
      <li onClick={() => setPage('settings')} className={page === 'settings' ? 'active' : ''}>Settings</li>
    </ul>
  )
}

export default PopupNav
