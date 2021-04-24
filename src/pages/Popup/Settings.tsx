import React, { useCallback, useEffect, useState } from 'react'
import { Holding } from '../../types/settings.types';
import { v4 as uuidv4 } from 'uuid'
import ReactSelect from 'react-select/async'
import { components } from 'react-select'
import { cmcFetcher } from '../../services/fetcher';
import Fuse from 'fuse.js'
import useSWR from "swr";
import './Settings.scss'

type SettingsProps = {}

const Settings: React.FC<SettingsProps> = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: coins } = useSWR('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5000', cmcFetcher)
  const fuse = new Fuse(coins, { keys: ['name'] })


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


  const onAddHolding = useCallback((coin) => {
    setHoldings(prev => ([...prev, { slug: coin.slug, amount: 0, key: uuidv4(), name: coin.name }]))
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

  const setHoldingValue = useCallback((holding: Holding, field: 'amount' | 'slug' | 'name', value: string | number) => {
    setHoldings(prev => {
      const prevIndex = prev.findIndex(h => h.key === holding.key)
      return [
        ...prev.slice(0, prevIndex),
        { ...prev[prevIndex], [field]: value },
        ...prev.slice(prevIndex + 1)
      ]
    })
  }, [])

  const loadOptions = (input: string) => new Promise<any>((resolve, reject) => {
    const matched = fuse.search(input)
    const top = matched.map(m => m.item).slice(0, 9) as any
    const ids = top.map((t: any) => t.id).sort((a: any, b: any) => a < b)
    cmcFetcher(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${ids.join(',')}`).then(result => {
      top.forEach((value: any, i: number) => {
        top[i].meta = result[value.id]
      })

      resolve(top)
    })
  })

  const Option = (props: any) => {
    return (
      <div className="option">
        <img src={props?.data?.meta?.logo}></img>
        <components.Option {...props} />
      </div>
    );
  };

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
            components={{ Option }}
            value={{ slug: holding.slug, name: holding.name }}
            loadOptions={loadOptions}
            getOptionValue={option => option.slug}
            getOptionLabel={option => option.name}
            onChange={(v: any) => {
              setHoldingValue(holding, 'slug', v?.slug)
              setHoldingValue(holding, 'name', v?.name)
            }}
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
