import React, { useCallback, useState } from 'react'
import { Holding } from '../../types/settings.types';
import { v4 as uuidv4 } from 'uuid'
import ReactSelect from 'react-select/async'


type SettingsProps = {}

const Settings: React.FC<SettingsProps> = () => {

  // chrome.storage.sync.get('options', (data) => {
  //   console.log(data)
  // });

  const [holdings, setHoldings] = useState<Holding[]>([]);

  const onAddHolding = useCallback(() => {
    setHoldings(prev => ([...prev, { slug: 'bitcoin', amount: 0, key: uuidv4() }]))
  }, []);

  return (
    <div>
      <h4>Your Holdings</h4>
      {holdings.map((holding) => (
        <div key={holding.key}>
          <label htmlFor={`coin_${holding.key}`}>Coin</label>
          <ReactSelect />

          <label htmlFor={`amount_${holding.key}`}>Amount</label>
          <input id={`amount_${holding.key}`} type="number" />
        </div>
      ))}
      <button onClick={onAddHolding}>Add Holding</button>
    </div>
  )
}

export default Settings
