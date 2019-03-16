import { chain } from 'lodash'
import { Reducer } from 'redux'
import { createAction, createReducer, Dispatch } from 'redux-act'

import { Channel } from '../api/Channel'


export const createTradesChannel = (pair: string, dispatch: Dispatch) => new Channel(
    'trades',
    { symbol: `t${pair}` },
    (raw: number[][]) => Array.isArray(raw) && dispatch(pushTrades(raw.map(parseTrade))),
)

const pushTrades = createAction<State>()

type Trade = {
    time: number
    amount: number
    price: number
}

export type State = Trade[]

export const reducer = createReducer<State>(
    {
        [pushTrades.toString()]: (state, value: Trade[]) => chain(state.concat(value))
            .sortBy(['time']).reverse().value().slice(-20),
    },
    [],
) as Reducer<State>

const parseTrade = (data: number[]): Trade => ({
    time: data[1],
    amount: data[2],
    price: data[3],
})
