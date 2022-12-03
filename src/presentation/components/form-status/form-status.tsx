import React, { useContext } from 'react'
import Styles from './form-status-styles.scss'
import { Spinner } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'

type Props = React.HTMLAttributes<HTMLElement>

const FormStatus: React.FC<Props> = (props: Props) => {
  const { state: { isLoading }, errorState: { message } } = useContext(Context)
  return (
    <div className={Styles.errorWrap}>
    { isLoading && <Spinner className={Styles.spinner} data-testid="spinner"/> }
    { message && <span className={Styles.error} data-testid="error-message-span">{ message }</span> }
  </div>
  )
}

export default FormStatus
