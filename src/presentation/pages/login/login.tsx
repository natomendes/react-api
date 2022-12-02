import React from 'react'
import Styles from './login-styles.scss'
import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <LoginHeader />
      <form className={Styles.form}>
        <h2>Login</h2>
        <Input type="email" name="email" placeholder='enter your e-mail address' />
        <Input type="password" name="password" placeholder='enter your password' />
        <button type="submit">Enter</button>
        <span className={Styles.link}>create account</span>
        <FormStatus />
      </form>
      <Footer />
    </div>
  )
}

export default Login
