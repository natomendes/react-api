import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Styles from './login-styles.scss'
import { Authentication, SaveAccessToken } from '@/domain/usecases'
import { Validation } from '@/presentation/protocols'
import Context from '@/presentation/contexts/form/form-context'
import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'
import { initialState } from './login-initial-state'
import SubmitButton from '@/presentation/components/submit-button/submit-button'

type Props = {
  validation: Validation
  authentication: Authentication
  saveAccessToken: SaveAccessToken
}

const Login: React.FC<Props> = ({ validation, authentication, saveAccessToken }: Props) => {
  const history = useHistory()
  const [state, setState] = useState(initialState)

  useEffect(() => {
    const { email, password } = state
    const formData = { email, password }
    const emailError = validation.validate('email', formData)
    const passwordError = validation.validate('password', formData)

    setState({
      ...state,
      emailError,
      passwordError,
      isFormInvalid: !!emailError || !!passwordError
    })
  }, [state.email, state.password])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    try {
      if (!state.isLoading && !state.isFormInvalid) {
        setState({ ...state, isLoading: true })
        const { accessToken } = await authentication.auth({ email: state.email, password: state.password })
        await saveAccessToken.save(accessToken)
        history.replace('/')
      }
    } catch (error) {
      setState({ ...state, isLoading: false, errorMessage: error.message })
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

          <SubmitButton text="Enter" />

          <Link
            className={Styles.link}
            replace
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
