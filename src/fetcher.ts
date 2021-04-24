import secrets from 'secrets'

const getStorage = (key: string) => new Promise<any>((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
        resolve(result[key])
    })
})

export const fetcher = async (url: string) => {
    const storage = await getStorage(url)
    if (!storage || Object.entries(storage).length === 0) {
        return fetch(url, { headers: { 'X-CMC_PRO_API_KEY': secrets.CMC_KEY } })
            .then(r => r.json().then(res => {
                chrome.storage.local.set({ [url]: res.data }, () => {
                })
                return res.data
            }))
    } else {
        return storage
    }
}