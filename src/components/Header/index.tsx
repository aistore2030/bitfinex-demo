import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { actions as connectionActions } from '../../data/connection'
import { actions as pairActions } from '../../data/pair'
import { Store } from '../../store'

import styles from './index.module.scss'


type Props = {
    connection: Store['connection']
    pair: Store['pair']
    connect(): void
    disconnect(): void
    setPair(pair: string): void
}

const mapStateToProps = ({ connection, pair }: Store) => ({ connection, pair })

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
    {
        ...connectionActions,
        ...pairActions,
    },
    dispatch,
)

export const Header = connect(mapStateToProps, mapDispatchToProps)((props: Props) => {
    console.warn('render')

    const handleSetPair = (e: React.ChangeEvent<HTMLSelectElement>) => props.setPair(e.target.value)

    return (
        <div className={styles.container}>
            <select onChange={handleSetPair}>
                {props.pair.available.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
            Selected pair: {props.pair.selected}
            {props.connection.isConnected ? 'Connected' : 'Disconnected'}
            <button onClick={props.connection.isConnected ? props.disconnect : props.connect}>
                {props.connection.isConnected ? 'Disconnect' : 'Connect'}
            </button>
        </div>
    )
})
