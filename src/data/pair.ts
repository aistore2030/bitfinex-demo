import { Reducer } from 'redux'
import { createAction, createReducer, Dispatch } from 'redux-act'

import { Store } from '../store'

import { connect, disconnect } from './connection'
import { flushOrderBook } from './orderBook'
import { flushTrades } from './trades'


export const setPair = (pair: string) => (dispatch: Dispatch, getState: () => Store) => {
    const available = getState().pair.available
    if (available.indexOf(pair) < 0) return

    dispatch(handleSetPair(pair))

    // cleanup
    dispatch(flushTrades())
    dispatch(flushOrderBook())

    // after pair set - need to reconnect
    disconnect()(dispatch)
    connect()(dispatch, getState)
}

export const actions = { setPair }



const handleSetPair = createAction<string>()

export type State = {
    available: string[]
    selected: string
}

export const reducer = createReducer<State>(
    {
        [handleSetPair.toString()]: (state, selected: string) => ({
            ...state,
            selected,
        }),
    },
    {
        available: ['BTCUSD', 'LTCUSD'],
        selected: 'BTCUSD',
    },
) as Reducer<State>
