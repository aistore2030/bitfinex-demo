import cx from 'classnames'
import React, { useEffect, useState } from 'react'

import { connect } from '../../api/ws'

import styles from './index.module.scss'

export type Data = {
    price: number
    priceDayChange: number
    priceDayChangePerc: number
    priceDayHigh: number
    priceDayLow: number
    volume: number
}

type Props = {
    pair: string
}

export const Ticker = ({ pair }: Props) => {
    const [data, setData] = useState<Data>({
        volume: 0,
        price: 0,
        priceDayChange: 0,
        priceDayChangePerc: 0,
        priceDayHigh: 0,
        priceDayLow: 0,
    })
    useEffect(() => connect('ticker', { symbol: `t${pair}` }, (raw: number[]) => setData(parseData(raw))), [])

    const { price, priceDayChange, priceDayChangePerc, priceDayHigh, priceDayLow, volume } = data

    const changeClassName = cx(styles.change, { positive: priceDayChange > 0, negative: priceDayChange < 0 })

    return (
        <div className={styles.container}>
            <div className={styles.column}>
                <div className={styles.name}>{pair}</div>
                <div className={styles.volume}>vol {volume.toLocaleString()} USD</div>
                <div className={styles.low}>low {priceDayLow}</div>
            </div>
            <div className={styles.column}>
                <div className={styles.price}>{price}</div>
                <div className={changeClassName}>{priceDayChange} ({priceDayChangePerc}%) USDT</div>
                <div className={styles.low}>high {priceDayHigh}</div>
            </div>
        </div >
    )
}

const parseData = (data: number[]): Data => {
    console.warn('parseData', data)

    return {
        price: data[6],
        priceDayChange: data[4],
        priceDayChangePerc: Math.round(data[5] * 10000) / 100,
        priceDayHigh: data[8],
        priceDayLow: data[9],
        volume: Math.round(data[7] * data[6]),
    }
}