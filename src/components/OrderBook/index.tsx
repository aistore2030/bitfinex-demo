import { sum } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'

import { Page } from '../../data/orderBook'
import { Store } from '../../store'

import styles from './index.module.scss'

type Props = {
    pair: Store['pair']
    orderBook: Store['orderBook']
}

const mapStateToProps = ({ pair, orderBook }: Store) => ({ pair, orderBook })

export const OrderBook = connect(mapStateToProps)(({ pair, orderBook }: Props) => (
    <div className={styles.container}>
        <div className={styles.caption}>
            <div className={styles.section}>order book</div>
            <div className={styles.pair}>{pair.selected}</div>
        </div>
        <div className={styles.books}>
            {renderBook(orderBook.filter(p => p.amount > 0))}
            {renderBook(orderBook.filter(p => p.amount < 0))}
        </div>
    </div >
))

const renderBook = (book: Page[]) => (
    <div className={styles.book}>
        <div className={styles.head}>
            <div className={styles.count}>count</div>
            <div className={styles.amount}>amount</div>
            <div className={styles.total}>total</div>
            <div className={styles.price}>price</div>
        </div>
        <div className={styles.table}>
            {book.map(page => renderPage(book, page))}
        </div>
    </div>
)

const renderPage = (book: Page[], { amount, count, price }: Page) => (
    <div key={price} className={styles.page}>
        <div className={styles.count}>{count}</div>
        <div className={styles.amount}>{amount}</div>
        <div className={styles.total}>
            {sum((amount > 0
                ? book.filter(p => p.amount > 0 && p.price >= price)
                : book.filter(p => p.amount < 0 && p.price <= price))
                .map(p => p.amount)).toFixed(2)}
        </div>
        <div className={styles.price}>{price}</div>
    </div>
)
