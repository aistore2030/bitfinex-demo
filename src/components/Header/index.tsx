import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { actions as pairActions } from '../../data/pair'
import { Store } from '../../store'

import styles from './index.module.scss'


type Props = {
    pair: Store['pair']
    setPair(pair: string): void
}

const mapStateToProps = ({ pair }: Store) => ({ pair })

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
    {
        ...pairActions,
    },
    dispatch,
)

export const Header = connect(mapStateToProps, mapDispatchToProps)(({ pair, setPair }: Props) => {
    console.warn('render')

    const handleSetPair = (e: React.ChangeEvent<HTMLSelectElement>) => setPair(e.target.value)

    return (
        <div className={styles.container}>
            <select onChange={handleSetPair}>
                {pair.available.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
            Selected pair: {pair.selected}
        </div>
    )
})
