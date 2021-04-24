import React, { useMemo } from 'react'
import useSWR from 'swr'
import { ccFetcher } from '../../../services/fetcher'
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';

type CryptoDiagramProps = {
  coin: any
}

const CryptoDiagram: React.FC<CryptoDiagramProps> = ({ coin }) => {
  const { data } = useSWR(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${coin.symbol}&tsym=USD&limit=10`, ccFetcher)

  const chartData = useMemo(() => ({
    labels: data?.Data.map((d: any) => format(new Date(d.time), 'HH:mm')),
    datasets: [
      {
        label: 'USD',
        data: data?.Data.map((d: any) => d.open),
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

  return (
    <Line data={chartData} options={chartOptions} type="line" />
  )
}

export default CryptoDiagram
