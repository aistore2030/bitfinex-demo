import React from 'react'
import { connect } from 'react-redux'

import { Store } from '../../store'

import styles from './index.module.scss'


type Props = {
    pair: Store['pair']
}

const mapStateToProps = ({ pair }: Store) => ({ pair })

export const Header = connect(mapStateToProps)(({ pair }: Props) => (
    <div className={styles.container}>Selected pair: {pair.selected}</div>
))
