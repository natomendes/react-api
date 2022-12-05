import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Styles from './login-styles.scss'
import { Authentication, SaveAccessToken } from '@/domain/usecases'
import { Validation } from '@/presentation/protocols'
import Context from '@/presentation/contexts/form/form-context'
import { LoginHeader, Footer, Input, FormStatus, Spinner } from '@/presentation/components'
import { initialState } from './login-initial-state'

type Props = {
  validation: Validation
  authentication: Authentication
  saveAccessToken: SaveAccessToken
}

const Login: React.FC<Props> = ({ validation, authentication, saveAccessToken }: Props) => {
  const history = useHistory()
  const [state, setState] = useState(initialState)

  useEffect(() => {
    setState({
      ...state,
      emailError: validation.validate('email', state.email),
      passwordError: validation.validate('password', state.password)
    })
  }, [state.email, state.password])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!state.isLoading && !(state.emailError || state.passwordError)) {
      try {
        setState({ ...state, isLoading: true })
        const { accessToken } = await authentication.auth({ email: state.email, password: state.password })
        await saveAccessToken.save(accessToken)
        history.replace('/')
      } catch (error) {
        setState({ ...state, errorMessage: error.message })
      }
    }
  }

  return (
    <div className={Styles.login}>
      <LoginHeader />

      <Context.Provider value={{ state, setState }}>
        <form
          className={Styles.form}
          onSubmit={handleSubmit}
          role="form"
        >
          <h2>Login</h2>

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

          <button
            className={Styles.submit}
            type="submit"
            disabled={!!state.emailError || !!state.passwordError}
            data-testid="submit-login-button"
          >
            { state.isLoading ? <Spinner className={Styles.spinner} /> : 'Enter' }
          </button>

          <Link
            className={Styles.link}
            to='/signup'
          >
            create account
          </Link>

          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  )
}

export default Login
