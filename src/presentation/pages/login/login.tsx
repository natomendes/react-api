import React from 'react'
import Styles from './login-styles.scss'
import Spinner from '@/presentation/components/spinner/spinner'
import Header from '@/presentation/components/login-header/login-header'
import Footer from '@/presentation/components/footer/footer'

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <Header />
      <form className={Styles.form}>
        <h2>Login</h2>
        <div className={Styles.inputWrap}>
          <input type="email" name="email" placeholder='enter your e-mail address' />
          <span className={Styles.status}>🔴</span>
        </div>
        <div className={Styles.inputWrap}>
        <input type="password" name="password" placeholder='enter your password' />
          <span className={Styles.status}>🔴</span>
        </div>
        <button type="submit">Enter</button>
        <span className={Styles.link}>create account</span>
        <div className={Styles.errorWrap}>
          <Spinner className={Styles.spinner} />
          <span className={Styles.error}>Error</span>
        </div>
      </form>
      <Footer />
    </div>
  )
}

export default Login
