import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Styles from './signup-styles.scss'
import Context from '@/presentation/contexts/form/form-context'
import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'
import { Validation } from '@/presentation/protocols'
import { AddAccount, SaveAccessToken } from '@/domain/usecases'
import SubmitButton from '@/presentation/components/submit-button/submit-button'

type Props = {
  validation: Validation
  addAccount: AddAccount
  saveAccessToken: SaveAccessToken
}

const SignUp: React.FC<Props> = ({ validation, addAccount, saveAccessToken }: Props) => {
  const history = useHistory()
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    nameError: '',
    emailError: '',
    passwordError: '',
    passwordConfirmationError: '',
    errorMessage: ''
  })

  useEffect(() => {
    const { name, email, password, passwordConfirmation } = state
    const formData = { name, email, password, passwordConfirmation }
    const nameError = validation.validate('name', formData)
    const emailError = validation.validate('email', formData)
    const passwordError = validation.validate('password', formData)
    const passwordConfirmationError = validation.validate('passwordConfirmation', formData)

    setState({
      ...state,
      nameError,
      emailError,
      passwordError,
      passwordConfirmationError,
      isFormInvalid: !!nameError || !!emailError || !!passwordError || !!passwordConfirmationError
    })
  }, [state.name, state.email, state.password, state.passwordConfirmation])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    try {
      if (!state.isLoading && !state.isFormInvalid) {
        setState({ ...state, isLoading: true })
        const account = await addAccount.add({
          name: state.name,
          email: state.email,
          password: state.password,
          passwordConfirmation: state.passwordConfirmation
        })
        await saveAccessToken.save(account.accessToken)
        history.replace('/')
      }
    } catch (error) {
      setState({ ...state, isLoading: false, errorMessage: error.message })
    }
  }

  return (
    <div className={Styles.signup}>
      <LoginHeader />

      <Context.Provider value={{ state, setState }}>
        <form
          onSubmit={handleSubmit}
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

          <SubmitButton text="Create Account"/>

          <Link
            className={Styles.link}
            replace
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
