import React from 'react'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts'

import styles from './App.module.scss'
import { Header } from './components/Header'
import { OrderBook } from './components/OrderBook'
import { Ticker } from './components/Ticker'
import { Trades } from './components/Trades'

export const App = () => {
  const pair = 'BTCUSD'

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <Header />
        <Ticker pair={pair} />
      </div>
      <div className={styles.main}>
        <OrderBook />
        <Trades />
      </div>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.BOTTOM_RIGHT} />
    </div>
  )
}
