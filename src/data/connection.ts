import { Reducer } from 'redux'
import { createAction, createReducer, Dispatch } from 'redux-act'

import { Connection } from '../api/Connection'
import { Store } from '../store'

import { createTickerChannel } from './ticker'
import { createTradesChannel } from './trades'

// open connection initially
const connection = new Connection()
connection.open()

Object.defineProperty(window, 'c', { get: () => connection })

export const connect = () => (dispatch: Dispatch, getState: () => Store) => {
    connection.attach(createTickerChannel(getState().pair.selected, dispatch))
    connection.attach(createTradesChannel(getState().pair.selected, dispatch))

    dispatch(handleConnect())
}

export const disconnect = () => (dispatch: Dispatch) => {
    connection.detachAll()

    dispatch(handleDisconnect())
}

export const actions = { connect, disconnect }


const handleConnect = createAction()

const handleDisconnect = createAction()

export type State = {
    isConnected: boolean
}

export const reducer = createReducer<State>(
    {
        [handleConnect.toString()]: () => ({ isConnected: true }),
        [handleDisconnect.toString()]: () => ({ isConnected: false }),
    },
    {
        isConnected: false,
    },
) as Reducer<State>
