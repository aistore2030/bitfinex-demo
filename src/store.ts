import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'

import { reducer as pair, State as Pair } from './data/pair'
import { reducer as ticker, State as Ticker } from './data/ticker'

export type GetState = () => Store

export type Store = {
    pair: Pair
    ticker: Ticker
}

const reducers = {
    pair,
    ticker,
}


export function configureStore(initialStore?: Store) {
    return createStore(
        combineReducers<Store>(reducers),
        initialStore!,
        applyMiddleware(thunk),
    )
}
