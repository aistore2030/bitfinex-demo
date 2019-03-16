import React, { useEffect } from 'react'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts'

import { connect } from './api/ws'
import styles from './App.module.scss'
import { Header } from './components/Header'
import { OrderBook } from './components/OrderBook'
import { Ticker } from './components/Ticker'
import { Trades } from './components/Trades'

export const App = () => {
  useEffect(listenTickers, [])

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <Header />
        <Ticker />
      </div>
      <div className={styles.main}>
        <OrderBook />
        <Trades />
      </div>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  )
}

const listenTickers = () => connect('ticker', { symbol: 'tBTCUSD' }, console.info.bind(console))
