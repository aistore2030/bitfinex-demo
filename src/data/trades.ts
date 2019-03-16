import { chain } from 'lodash'
import { Reducer } from 'redux'
import { createAction, createReducer, Dispatch } from 'redux-act'

import { Channel } from '../api/Channel'


const TRADES_COUNT = 100

export const createTradesChannel = (pair: string, dispatch: Dispatch) => new Channel(
    'trades',
    { symbol: `t${pair}` },
    (raw: number[][]) => Array.isArray(raw) && dispatch(pushTrades(raw.map(parseTrade))),
)

const pushTrades = createAction<State>()

export const flushTrades = createAction()

export type Trade = {
    id: number
    time: number
    amount: number
    price: number
}

export type State = Trade[]

export const reducer = createReducer<State>(
    {
        [pushTrades.toString()]: (state, value: Trade[]) => chain(state.concat(value))
            .sortBy(['time']).reverse().value().slice(-TRADES_COUNT),
        [flushTrades.toString()]: (state, value: Trade[]) => [],
    },
    [],
) as Reducer<State>

const parseTrade = (data: number[]): Trade => ({
    id: data[0],
    time: data[1],
    amount: data[2],
    price: data[3],
})
