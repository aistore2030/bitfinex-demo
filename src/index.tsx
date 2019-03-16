import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { App } from './App'
import { configureStore } from './store'
// tslint:disable-next-line:no-import-side-effect
import './styles/layout.scss'

export const store = configureStore()

// for debug
Object.defineProperty(window, 's', { get: store.getState })

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'),
)
