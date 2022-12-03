import React from 'react'
import faker from 'faker'
import { Login } from '@/presentation/pages'
import { ValidationStub } from '../mocks'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import { Authentication, AuthenticationParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '../../domain/mocks'

class AuthenticationSpy implements Authentication {
  account = mockAccountModel()
  params: AuthenticationParams
  async auth (params: AuthenticationParams): Promise<AccountModel> {
    this.params = params
    return this.account
  }
}

type SutTypes = {
  sut: RenderResult
  validationStub: ValidationStub
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError
  const sut = render(<Login validation={validationStub} authentication={authenticationSpy} />)
  return {
    sut,
    validationStub,
    authenticationSpy
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
  describe('Communication with dependencies', () => {
    afterEach(cleanup)
    it('Should show email status error if Validation fails', () => {
      const { sut, validationStub } = makeSut()
      validationStub.errorMessage = faker.random.words()
      const emailInput = sut.getByPlaceholderText('enter your e-mail address')
      fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
      const emailStatus = sut.getByTestId('email-status')
      expect(emailStatus.title).toBe(validationStub.errorMessage)
      expect(emailStatus.textContent).toBe('🔴')
    })

    it('Should show password status error if Validation fails', () => {
      const { sut, validationStub } = makeSut()
      validationStub.errorMessage = faker.random.words()
      const passwordInput = sut.getByPlaceholderText('enter your password')
      fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
      const passwordStatus = sut.getByTestId('password-status')
      expect(passwordStatus.title).toBe(validationStub.errorMessage)
      expect(passwordStatus.textContent).toBe('🔴')
    })

    it('Should show email status ok if Validation succeeds', () => {
      const { sut } = makeSut()
      const emailInput = sut.getByPlaceholderText('enter your e-mail address')
      fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
      const emailStatus = sut.getByTestId('email-status')
      expect(emailStatus.title).toBe('Your e-mail is valid')
      expect(emailStatus.textContent).toBe('🟢')
    })

    it('Should show password status ok if Validation succeeds', () => {
      const { sut } = makeSut()
      const passwordInput = sut.getByPlaceholderText('enter your password')
      fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
      const passwordStatus = sut.getByTestId('password-status')
      expect(passwordStatus.title).toBe('Your password is valid')
      expect(passwordStatus.textContent).toBe('🟢')
    })

    it('Should enabled submit button if form is valid', () => {
      const { sut } = makeSut()
      const emailInput = sut.getByPlaceholderText('enter your e-mail address')
      fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
      const passwordInput = sut.getByPlaceholderText('enter your password')
      fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
      const submitButton = sut.getByRole('button', { name: /enter/i })
      expect(submitButton).toHaveProperty('disabled', false)
    })

    it('Should show spinner on submit', () => {
      const { sut } = makeSut()
      const emailInput = sut.getByPlaceholderText('enter your e-mail address')
      fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
      const passwordInput = sut.getByPlaceholderText('enter your password')
      fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
      const submitButton = sut.getByRole('button', { name: /enter/i })
      fireEvent.click(submitButton)
      const spinnerComponent = sut.getByTestId('spinner')
      expect(spinnerComponent).toBeTruthy()
    })

    it('Should call Authentication with correct values', () => {
      const { sut, authenticationSpy } = makeSut()
      const email = faker.internet.email()
      const emailInput = sut.getByPlaceholderText('enter your e-mail address')
      fireEvent.input(emailInput, { target: { value: email } })
      const password = faker.internet.password()
      const passwordInput = sut.getByPlaceholderText('enter your password')
      fireEvent.input(passwordInput, { target: { value: password } })
      const submitButton = sut.getByRole('button', { name: /enter/i })
      fireEvent.click(submitButton)
      expect(authenticationSpy.params).toEqual({
        email,
        password
      })
    })
  })
})
