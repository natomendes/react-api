import React, { useEffect, useState } from 'react'
import Styles from './login-styles.scss'
import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'

type Props = {
  validation: Validation
}

const Login: React.FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: '',
    emailError: 'required field',
    passwordError: 'required field',
    errorMessage: ''
  })
  useEffect(() => {
    validation.validate('email', state.email)
  }, [state.email])
  useEffect(() => {
    validation.validate('password', state.password)
  }, [state.password])
  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
        <form className={Styles.form}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder='enter your e-mail address' />
          <Input type="password" name="password" placeholder='enter your password' />
          <button className={Styles.submit} type="submit" disabled>Enter</button>
          <span className={Styles.link}>create account</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Login
