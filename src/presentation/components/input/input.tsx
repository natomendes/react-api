import React, { useContext } from 'react'
import Styles from './input-styles.scss'
import Context from '@/presentation/contexts/form/form-context'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(Context)
  const enableInput = (event: React.FocusEvent<HTMLInputElement, Element>): void => {
    event.target.readOnly = false
  }
  const handleChange = (event: React.FocusEvent<HTMLInputElement, Element>): void => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    })
  }

  const getStatus = (): string => {
    return state[`${props.name}Error`] ? '🔴' : '🟢'
  }
  const getTitle = (): string => {
    return state[`${props.name}Error`] || `Your ${props.name} is valid`
  }
  return (
    <div className={Styles.inputWrap}>
      <input {...props} readOnly onFocus={enableInput} onChange={handleChange}/>
      <span data-testid={`${props.name}-status`} title={getTitle()} className={Styles.status}>{getStatus()}</span>
    </div>
  )
}

export default Input
