import { css } from '@emotion/react'
import { AssetWeight } from '../../atoms/assetsState'
import palette from '../../lib/palette'
import Chart from 'chart.js'
import { useEffect, useRef } from 'react'
import chartColors from '../../lib/chartColors'

export type PortfolioItemProps = {
  id: number
  assets: AssetWeight[]
  name: string
}

function PortfolioItem({ id, assets, name }: PortfolioItemProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    const ctx = ref.current?.getContext('2d')
    const data = {
      datasets: [
        {
          data: assets.map((asset) => asset.weight),
          backgroundColor: chartColors.slice(0, assets.length),
        },
      ],
      labels: assets.map((asset) => asset.ticker),
    }

    if (!ctx) return
    if (!chartRef.current) {
      const chart = new Chart(ctx, {
        type: 'pie',
        data,
        options: {
          legend: {
            display: false,
          },
        },
      })
      chartRef.current = chart
    } else {
      const chart = chartRef.current
      chart.data = data
      chart.update()
    }
  }, [assets])

  return (
    <div css={gridItem}>
      <div css={pieBox}>
        <canvas ref={ref} />
      </div>
      <div css={nameStyle}>{name}</div>
    </div>
  )
}

const gridItem = css`
  height: 6rem;
  background: white;
  border-radius: 0.5rem;
  border: 0.0625rem solid ${palette.blueGrey[50]};
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0.5rem;
  cursor: pointer;
  transition: all ease-in 0.125s;
  transform: scale3d(1, 1, 1);
  &:hover {
    box-shadow: 0rem 0.25rem 0.5rem rgba(0, 0, 0, 0.05);
    transform: scale3d(1.025, 1.025, 1.025);
    border: 0.0625rem solid ${palette.cyan[500]};
  }
`

const pieBox = css`
  flex: 1;
  width: 100%;
  position: relative;
  canvas {
    width: 100%;
    height: 100%;
  }
`
const nameStyle = css`
  width: 7.625rem;
  color: ${palette.blueGrey[700]};
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
`

export default PortfolioItem
