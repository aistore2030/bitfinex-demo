import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'

import { reducer as connection, State as Connection } from './data/connection'
import { reducer as pair, State as Pair } from './data/pair'
import { reducer as ticker, State as Ticker } from './data/ticker'
import { reducer as trades, State as Trades } from './data/trades'

export type GetState = () => Store

export type Store = {
    connection: Connection
    pair: Pair
    ticker: Ticker
    trades: Trades
}

const reducers = {
    connection,
    pair,
    ticker,
    trades,
}


export function configureStore(initialStore?: Store) {
    return createStore(
        combineReducers<Store>(reducers),
        initialStore!,
        applyMiddleware(thunk),
    )
}
