import React from 'react'
type CryptoListItemProps = { coin: any, meta: any };

const PercentChange = (props: { change: number }) => {
    const { change } = props
    const isPositive = change > 0

    return <span style={{ color: isPositive ? 'green' : 'red' }}>
        {isPositive ? '▴' : '▾'} {Math.abs(change).toFixed(2)} </span >
}

// https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
function nFormatter(num: number, digits: number) {
    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "B" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

const CryptoListItem: React.FC<CryptoListItemProps> = ({ coin, meta }) => {
    console.log('meta', meta)
    console.log('coin', coin)
    const quote = coin.quote.USD

    return <tr style={{ height: '24px' }}>
        <td>
            {meta &&
                <img
                    style={{ height: '12px', width: '12px' }}
                    src={meta.logo}>
                </img>}

            {coin.name}
        </td>
        <td>
            ${Number(parseFloat(quote.price).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 })}
        </td>
        <td>
            <PercentChange change={quote.percent_change_24h} />
        </td>
        <td>
            <PercentChange change={quote.percent_change_7d} />
        </td>
        <td>
            {nFormatter(quote.volume_24h, 2)}
        </td>
    </tr>
}

export default CryptoListItem