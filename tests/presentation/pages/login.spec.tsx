import React from 'react'
import faker from 'faker'
import 'jest-localstorage-mock'
import { createMemoryHistory, MemoryHistory } from 'history'
import { Login } from '@/presentation/pages'
import { ValidationStub, AuthenticationSpy } from '../mocks'
import { cleanup, fireEvent, RenderResult, waitFor } from '@testing-library/react'
import { populateEmailField, populatePasswordField, simulateValidSubmit, checkFieldStatus } from './test-helpers'
import { InvalidCredentialsError } from '@/domain/errors'
import { renderWithRouter } from './renderWithRouter'

type SutTypes = {
  sut: RenderResult
  validationStub: ValidationStub
  authenticationSpy: AuthenticationSpy
  history: MemoryHistory
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  const history = createMemoryHistory()
  validationStub.errorMessage = params?.validationError
  const sut = renderWithRouter(<Login validation={validationStub} authentication={authenticationSpy} />, history)
  return {
    sut,
    validationStub,
    authenticationSpy,
    history
  }
}

describe('Login Page', () => {
  describe('Initial State', () => {
    afterEach(cleanup)
    it('Should not render Spinner component on start', () => {
      const { sut, validationStub } = makeSut()
      validationStub.errorMessage = faker.random.words()
      const spinnerComponent = sut.queryByTestId('spinner')
      expect(spinnerComponent).toBeNull()
    })

    it('Should not render error message span component on start', () => {
      const { sut, validationStub } = makeSut()
      validationStub.errorMessage = faker.random.words()

      const errorMessageSpan = sut.queryByTestId('error-message-span')
      expect(errorMessageSpan).toBeNull()
    })

    it('Should have submit button disable on start', () => {
      const { sut } = makeSut({ validationError: faker.random.words() })

      const submitButton = sut.getByRole('button', { name: /enter/i })
      expect(submitButton).toHaveProperty('disabled', true)
    })

    it('Should have email status title = Validation.errorMessage and text content "🔴" on start', () => {
      const { sut, validationStub } = makeSut({ validationError: faker.random.words() })
      const emailStatus = sut.getByTestId('email-status')
      expect(emailStatus.title).toBe(validationStub.errorMessage)
      expect(emailStatus.textContent).toBe('🔴')
    })

    it('Should have password status title "required field" and text content "🔴" on start', () => {
      const { sut, validationStub } = makeSut({ validationError: faker.random.words() })
      const passwordStatus = sut.getByTestId('password-status')
      expect(passwordStatus.title).toBe(validationStub.errorMessage)
      expect(passwordStatus.textContent).toBe('🔴')
    })
  })
  describe('Component Flow', () => {
    afterEach(cleanup)
    beforeEach(() => {
      localStorage.clear()
    })
    it('Should show email status error if Validation fails', () => {
      const { sut, validationStub } = makeSut()
      validationStub.errorMessage = faker.random.words()
      populateEmailField(sut)
      checkFieldStatus(sut, 'email', validationStub.errorMessage)
    })

    it('Should show password status error if Validation fails', () => {
      const { sut, validationStub } = makeSut()
      validationStub.errorMessage = faker.random.words()
      populatePasswordField(sut)
      checkFieldStatus(sut, 'password', validationStub.errorMessage)
    })

    it('Should show email status ok if Validation succeeds', () => {
      const { sut } = makeSut()
      populateEmailField(sut)
      checkFieldStatus(sut, 'email')
    })

    it('Should show password status ok if Validation succeeds', () => {
      const { sut } = makeSut()
      populatePasswordField(sut)
      checkFieldStatus(sut, 'password')
    })

    it('Should enabled submit button if form is valid', () => {
      const { sut } = makeSut()
      populateEmailField(sut)
      populatePasswordField(sut)
      const submitButton = sut.getByRole('button', { name: /enter/i })
      expect(submitButton).toHaveProperty('disabled', false)
    })

    it('Should show spinner on submit', () => {
      const { sut } = makeSut()
      simulateValidSubmit(sut)
      const spinnerComponent = sut.getByTestId('spinner')
      expect(spinnerComponent).toBeTruthy()
    })

    it('Should call Authentication with correct values', () => {
      const { sut, authenticationSpy } = makeSut()
      const email = faker.internet.email()
      const password = faker.internet.password()
      simulateValidSubmit(sut, email, password)
      expect(authenticationSpy.params).toEqual({
        email,
        password
      })
    })

    it('Should call Authentication with correct values', () => {
      const { sut, authenticationSpy } = makeSut()
      simulateValidSubmit(sut)
      simulateValidSubmit(sut)
      expect(authenticationSpy.callsCount).toBe(1)
    })

    it('Should not call Authentication if form is invalid', () => {
      const { sut, validationStub, authenticationSpy } = makeSut()
      validationStub.errorMessage = faker.random.words()
      populateEmailField(sut)
      fireEvent.submit(sut.getByRole('form'))
      expect(authenticationSpy.callsCount).toBe(0)
    })

    it('Should present error if Authentication fails', async () => {
      const { sut, authenticationSpy } = makeSut()
      const error = new InvalidCredentialsError()
      jest.spyOn(authenticationSpy, 'auth')
        .mockRejectedValueOnce(error)
      simulateValidSubmit(sut)
      await waitFor(() => expect(sut.queryByTestId('spinner')).toBeNull())
      const errorMessageSpan = sut.queryByTestId('error-message-span')
      expect(errorMessageSpan.textContent).toBe(error.message)
    })

    it('Should add accessToken to localStorage on success', async () => {
      const { sut, authenticationSpy } = makeSut()
      simulateValidSubmit(sut)
      await waitFor(() => sut.getByRole('form'))
      expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)
    })

    it('Should go to singup page', async () => {
      const { sut, history } = makeSut()
      const register = sut.getByText(/create account/i)
      fireEvent.click(register)
      expect(history.length).toBe(2)
      expect(history.location.pathname).toBe('/signup')
    })
  })
})
