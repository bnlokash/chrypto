import React, { useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { ccFetcher } from '../../../services/fetcher'
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { Holding } from '../../../types/settings.types';

type CryptoDiagramProps = {
  coin: any
  holding?: Holding
  setHoldingData?: any
  chartPeriod?: string
}

const CryptoDiagram: React.FC<CryptoDiagramProps> = ({ coin, holding, setHoldingData, chartPeriod = '1w' }) => {
  const { data } = useSWR(`https://min-api.cryptocompare.com/data/v2/${chartPeriod === '24h' ? 'histohour' : 'histoday'
    }?fsym=${coin.symbol}&tsym=USD&limit=${chartPeriod === '1w' ? 7 : chartPeriod === '1m' ? 30 : 24
    }&aggregate=1`, ccFetcher)

  const chartData = useMemo(() => ({
    labels: data?.Data?.map((d: any) => format(new Date(d.time * 1000), (chartPeriod === '1w' || chartPeriod === '1m') ? 'MMM dd' : 'HH:00')),
    datasets: [
      {
        label: coin?.name,
        data: data?.Data?.map((d: any) => holding ? d?.open * holding.amount : d?.open),
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  }), [data]);

  const chartOptions = useMemo(() => ({
    scales: {
      y: {
        display: true,
        ticks: {
          // Include a dollar sign in the ticks
          callback: (value: any) => `$${value}`
        },
        title: {
          display: true,
          text: 'USD'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            var label = context.dataset.label || '';

            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    }
  }), []);

  useEffect(() => {
    if (holding && data) {
      setHoldingData((prev: any) => ({ ...prev, [holding.key]: { ...data, ...holding } }))
    }
  }, [data, holding])

  if (!data || Object.entries(data).length === 0) {
    return <p>Unable to get chart for {coin.name}</p>
  }

  return (
    <Line data={chartData} options={chartOptions} type="line" />
  )
}

export default CryptoDiagram
