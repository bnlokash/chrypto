import secrets from 'secrets'

export const fetcher = (url: string) => fetch(url, { headers: { 'X-CMC_PRO_API_KEY': secrets.CMC_KEY } }).then(r => r.json().then(res => res.data))
