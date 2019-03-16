import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts'
import { bindActionCreators, Dispatch } from 'redux'

import styles from './App.module.scss'
import { Header } from './components/Header'
import { OrderBook } from './components/OrderBook'
import { Ticker } from './components/Ticker'
import { Trades } from './components/Trades'
import { actions as connectionActions } from './data/connection'


type Props = {
  connect(): void
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
  {
    ...connectionActions,
  },
  dispatch,
)

export const App = connect(null, mapDispatchToProps)((props: Props) => {
  useEffect(() => { props.connect() }, [connect])

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
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.BOTTOM_RIGHT} />
    </div>
  )
})
