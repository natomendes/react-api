import React from 'react'
import Styles from './spinner-styles.scss'

const Spinner: React.FC = () => {
  return (
    <div data-testid="spinner" className={Styles.spinner}>
      <div />
      <div />
      <div />
      <div />
    </div>
  )
}

export default Spinner
