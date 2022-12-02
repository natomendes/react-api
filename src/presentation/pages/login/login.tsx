import React, { useState } from 'react'
import Styles from './login-styles.scss'
import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'

type StateProps = {
  isLoading: boolean
}

const Login: React.FC = () => {
  const [state] = useState<StateProps>({
    isLoading: false
  })
  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={state}>
        <form className={Styles.form}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder='enter your e-mail address' />
          <Input type="password" name="password" placeholder='enter your password' />
          <button type="submit">Enter</button>
          <span className={Styles.link}>create account</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Login
