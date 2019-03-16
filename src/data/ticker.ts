import { Reducer } from 'redux'
import { createAction, createReducer, Dispatch } from 'redux-act'

import { Channel } from '../api/Channel'


export const createTickerChannel = (pair: string, dispatch: Dispatch) =>
    new Channel('ticker', { symbol: `t${pair}` }, (raw: number[]) => dispatch(setTicker(parseTicker(raw))))

const setTicker = createAction<State>()

export type State = {
    price: number
    priceDayChange: number
    priceDayChangePerc: number
    priceDayHigh: number
    priceDayLow: number
    volume: number
}

export const reducer = createReducer<State>(
    {
        [setTicker.toString()]: (state, value: State) => value,
    },
    {
        volume: 0,
        price: 0,
        priceDayChange: 0,
        priceDayChangePerc: 0,
        priceDayHigh: 0,
        priceDayLow: 0,
    },
) as Reducer<State>

const parseTicker = (data: number[]): State => ({
    price: data[6],
    priceDayChange: data[4],
    priceDayChangePerc: Number(data[5].toFixed(2)),
    priceDayHigh: data[8],
    priceDayLow: data[9],
    volume: Math.round(data[7] * data[6]),
})
