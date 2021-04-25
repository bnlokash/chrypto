import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';

type CryptoDiagramTotalProps = {
  holdingData: { [key: string]: any }
  chartPeriod: string
}

const CryptoDiagramTotal: React.FC<CryptoDiagramTotalProps> = ({ holdingData, chartPeriod = "1w" }) => {
  const chartData = useMemo(() => ({
    labels: Object.values(holdingData ?? {})[0]?.Data.map((d: any) => format(new Date(d.time * 1000), (chartPeriod === '1w' || chartPeriod === '1m') ? 'MMM dd' : 'HH:00')),
    datasets: [
      {
        label: 'Total Portfolio',
        data: Object.values(holdingData ?? {})[0]?.Data.map((_: any, key: any) => Object.values(holdingData).reduce((prev: any, current: any) => prev + current.Data[key]?.open * current.amount, 0)),
        fill: false,
        backgroundColor: 'rgb(0, 99, 132)',
        borderColor: 'rgba(0, 99, 132, 0.2)',
      }],
  }), [holdingData]);

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

  return (
    <Line data={chartData} options={chartOptions} type="line" />
  )
}

export default CryptoDiagramTotal
