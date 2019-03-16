import React from 'react'

import styles from './App.module.scss'
import { Header } from './components/Header'
import { OrderBook } from './components/OrderBook'
import { Ticker } from './components/Ticker'
import { Trades } from './components/Trades'

export const App = () => (
  <div className={styles.container}>
    <div className={styles.head}>
      <Header />
      <Ticker />
    </div>
    <div className={styles.main}>
      <OrderBook />
      <Trades />
    </div>
  </div>
)
