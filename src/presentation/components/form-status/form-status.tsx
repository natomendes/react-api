import React from 'react'
import Styles from './form-status-styles.scss'
import { Spinner } from '@/presentation/components'

type Props = React.HTMLAttributes<HTMLElement>

const FormStatus: React.FC<Props> = (props: Props) => {
  return (
    <div className={Styles.errorWrap}>
    <Spinner className={Styles.spinner} />
    <span className={Styles.error}>Error</span>
  </div>
  )
}

export default FormStatus
