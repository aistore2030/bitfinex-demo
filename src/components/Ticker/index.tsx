import cx from 'classnames'
import React from 'react'
import { connect } from 'react-redux'

import { Store } from '../../store'

import styles from './index.module.scss'


type Props = {
    pair: Store['pair']
    ticker: Store['ticker']
}

const mapStateToProps = ({ pair, ticker }: Store) => ({ pair, ticker })

export const Ticker = connect(mapStateToProps)(({ pair, ticker }: Props) => {
    const { price, priceDayChange, priceDayChangePerc, priceDayHigh, priceDayLow, volume } = ticker

    const changeClassName = cx(styles.change, { positive: priceDayChange > 0, negative: priceDayChange < 0 })

    return (
        <div className={styles.container}>
            <div className={styles.column}>
                <div className={styles.name}>{pair.selected}</div>
                <div className={styles.volume}>vol {volume.toLocaleString()} USD</div>
                <div className={styles.low}>low {priceDayLow}</div>
            </div>
            <div className={styles.column}>
                <div className={styles.price}>{price}</div>
                <div className={changeClassName}>{priceDayChange} ({priceDayChangePerc}%)</div>
                <div className={styles.low}>high {priceDayHigh}</div>
            </div>
        </div >
    )
})
