import { chain } from 'lodash'
import { Reducer } from 'redux'
import { createAction, createReducer, Dispatch } from 'redux-act'

import { Channel } from '../api/Channel'


export const createOrderBookChannel = (pair: string, dispatch: Dispatch) => new Channel(
    'book',
    { symbol: `t${pair}`, freq: 'F1', prec: 'P0' },
    (raw: unknown) => {
        if (!Array.isArray(raw))
            return

        // handle snapshot
        if (raw.length && Array.isArray(raw[0]))
            dispatch(setSnapshot(raw.map(parsePage)))
        else {
            const page = parsePage(raw)
            if (page.count !== 0)
                dispatch(updatePage(page))
            else
                dispatch(deletePage(page))
        }
    },
)

const setSnapshot = createAction<State>()
const updatePage = createAction<Page>()
const deletePage = createAction<Page>()

export const flushOrderBook = createAction()

export type Page = {
    price: number
    count: number
    amount: number
}

export type State = Page[]

export const reducer = createReducer<State>(
    {
        [setSnapshot.toString()]: (state: State, snapshot: State) => {
            console.warn('persist snapshot', snapshot.length, 'pages')

            return chain(snapshot)
                .sortBy(['price', 'amount']).value()
        },
        [updatePage.toString()]: (state: State, page: Page) => {
            const oldPage = page.amount > 0
                ? state.find(p => p.amount > 0 && p.price === page.price)
                : state.find(p => p.amount < 0 && p.price === page.price)

            // replace old page with new one
            const result = state.filter(p => p !== oldPage)
            if (oldPage) page.amount += oldPage.amount

            console.warn((oldPage ? 'update' : 'add'), 'page', page.price, page.count, page.amount)

            return chain(result.concat(page))
                .sortBy(['price', 'amount']).value()
        },
        [deletePage.toString()]: (state: State, page: Page) => {
            console.warn('delete page', page.price, page.count, page.amount)

            return page.amount === 1
                ? state.filter(p => p.amount > 0 && p.price === page.price)
                : state.filter(p => p.amount < 0 && p.price === page.price)
        },
        [flushOrderBook.toString()]: () => [],
    },
    [],
) as Reducer<State>

const parsePage = (data: number[]): Page => ({
    price: data[0],
    count: data[1],
    amount: Number(data[2].toFixed(2)),
})
