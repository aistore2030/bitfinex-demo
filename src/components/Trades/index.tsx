import cx from 'classnames'
import moment from 'moment'
import React from 'react'
import { connect } from 'react-redux'

import { Trade } from '../../data/trades'
import { Store } from '../../store'

import styles from './index.module.scss'

type Props = {
    pair: Store['pair']
    trades: Store['trades']
}

const mapStateToProps = ({ pair, trades }: Store) => ({ pair, trades })

export const Trades = connect(mapStateToProps)(({ pair, trades }: Props) => (
    <div className={styles.container}>
        <div className={styles.caption}>
            <div className={styles.section}>trades</div>
            <div className={styles.pair}>{pair.selected}</div>
            <div className={styles.source}>market</div>
        </div>
        <div className={styles.head}>
            <div className={styles.time}>time</div>
            <div className={styles.price}>price</div>
            <div className={styles.amount}>amount</div>
        </div>
        <div className={styles.table}>
            {trades.map(renderTrade)}
        </div>
    </div >
))

const renderTrade = (trade: Trade) => {
    const cls = cx(styles.trade, { positive: trade.amount > 0, negative: trade.amount < 0 })

    return (
        <div key={trade.id} className={cls}>
            <div className={styles.time}>{moment(trade.time).format('HH:mm:ss')}</div>
            <div className={styles.price}>{trade.price}</div>
            <div className={styles.amount}>{trade.amount}</div>
        </div>
    )
}
