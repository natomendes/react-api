import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Styles from './signup-styles.scss'
import Context from '@/presentation/contexts/form/form-context'
import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'
// import { Validation } from '@/presentation/protocols'

// type Props = {
//   validation: Validation
// }

const SignUp: React.FC = () => {
  const [state] = useState({
    nameError: 'Your name is invalid',
    emailError: 'Your email is invalid',
    passwordError: 'Your password is invalid',
    passwordConfirmationError: 'Your passwordConfirmation is invalid'
  })
  return (
    <div className={Styles.signup}>
      <LoginHeader />

      <Context.Provider value={{ state }}>
        <form
          className={Styles.form}
          role="form"
        >
          <h2>Create Account</h2>

          <Input
            type="text"
            name="name"
            placeholder='enter your full name'
          />
          <Input
            type="email"
            name="email"
            placeholder='enter your email address'
          />
          <Input
            type="password"
            name="password"
            placeholder='enter your password'
          />
          <Input
            type="password"
            name="passwordConfirmation"
            placeholder='confirm your password'
          />

          <button
            className={Styles.submit}
            type="submit"
            disabled
          >
            Create Account
          </button>

          <Link
            className={Styles.link}
            to='/login'
          >
            sign in
          </Link>

          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  )
}

export default SignUp
