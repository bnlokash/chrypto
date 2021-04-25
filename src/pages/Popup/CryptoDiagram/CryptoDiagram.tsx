import React, { useMemo } from 'react'
import useSWR from 'swr'
import { ccFetcher } from '../../../services/fetcher'
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { Holding } from '../../../types/settings.types';

type CryptoDiagramProps = {
  coin: any
  holding?: Holding
}

const CryptoDiagram: React.FC<CryptoDiagramProps> = ({ coin, holding }) => {
  const { data } = useSWR(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${coin.symbol}&tsym=USD&limit=10&aggregate=1`, ccFetcher)

  const chartData = useMemo(() => ({
    labels: data?.Data?.map((d: any) => format(new Date(d.time * 1000), 'MMM dd')),
    datasets: [
      {
        label: 'USD',
        data: data?.Data?.map((d: any) => holding ? d.open * holding.amount : d.open),
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  }), [data]);

  const chartOptions = useMemo(() => ({
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }), []);

  if (!data || Object.entries(data).length === 0) {
    return <p>Unable to get chart for {coin.name}</p>
  }

  return (
    <Line data={chartData} options={chartOptions} type="line" />
  )
}

export default CryptoDiagram
