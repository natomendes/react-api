import React from 'react'
import Styles from './login-styles.scss'
import Header from '@/presentation/components/login-header/login-header'
import Footer from '@/presentation/components/footer/footer'
import Input from '@/presentation/components/input/input'
import FormStatus from '@/presentation/components/form-status/form-status'

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <Header />
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
