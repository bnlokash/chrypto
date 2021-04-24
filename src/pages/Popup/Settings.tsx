import React, { useCallback, useEffect, useState } from 'react'
import { Holding } from '../../types/settings.types';
import { v4 as uuidv4 } from 'uuid'
import ReactSelect from 'react-select/async-creatable'
import { cmcFetcher } from '../../services/fetcher';

type SettingsProps = {}

const Settings: React.FC<SettingsProps> = () => {


  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // fetch initial holdings from chrome storage
  useEffect(() => {
    chrome.storage.sync.get('holdings', (value) => {
      setHoldings(value.holdings ?? [])
      setIsLoading(false);
    });
  }, [])

  // sync holdings to chrome storage
  useEffect(() => {
    chrome.storage.sync.set({ holdings });
  }, [holdings])


  const onAddHolding = useCallback(() => {
    setHoldings(prev => ([...prev, { slug: 'bitcoin', amount: 0, key: uuidv4() }]))
  }, []);

  const onRemoveHolding = useCallback((holding: Holding) => {
    setHoldings(prev => {
      const prevIndex = prev.findIndex(h => h.key === holding.key)
      return [
        ...prev.slice(0, prevIndex),
        ...prev.slice(prevIndex + 1)
      ]
    })
  }, [])

  const setHoldingValue = useCallback((holding: Holding, field: 'amount' | 'slug', value: string | number) => {
    setHoldings(prev => {
      const prevIndex = prev.findIndex(h => h.key === holding.key)
      return [
        ...prev.slice(0, prevIndex),
        { ...prev[prevIndex], [field]: value },
        ...prev.slice(prevIndex + 1)
      ]
    })
  }, [])


  return (
    <div>
      <h4>Your Holdings</h4>
      {isLoading && (
        <p>Loading...</p>
      )}

      {!isLoading && holdings.map((holding) => (
        <fieldset key={holding.key}>
          <legend><button onClick={() => onRemoveHolding(holding)}>Remove Holding</button></legend>

          <label htmlFor={`coin_${holding.key}`}>Coin: </label>
          <ReactSelect
            value={{ slug: holding.slug, name: holding.slug }}
            cacheOptions
            loadOptions={() => cmcFetcher('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest')}
            getOptionValue={option => option.slug} getOptionLabel={option => option.name}
            onChange={(v: any) => setHoldingValue(holding, 'slug', v?.slug)}
          />

          <label htmlFor={`amount_${holding.key}`}>Amount: </label>
          <input value={holding.amount} id={`amount_${holding.key}`} type="number" onChange={(e) => setHoldingValue(holding, 'amount', e.target.value)} />
        </fieldset>
      ))}
      <button onClick={onAddHolding}>Add Holding</button>
    </div>
  )
}

export default Settings
