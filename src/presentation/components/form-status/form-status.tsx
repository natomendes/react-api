import React, { useContext } from 'react'
import Styles from './form-status-styles.scss'
import { Spinner } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'

type Props = React.HTMLAttributes<HTMLElement>

const FormStatus: React.FC<Props> = (props: Props) => {
  const { state: { isLoading, errorMessage } } = useContext(Context)
  return (
    <div className={Styles.errorWrap}>
    { isLoading && <Spinner className={Styles.spinner} /> }
    { errorMessage && <span className={Styles.error} data-testid="error-message-span">{ errorMessage }</span> }
  </div>
  )
}

export default FormStatus
