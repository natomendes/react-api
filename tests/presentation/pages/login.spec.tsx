import { Login } from '@/presentation/pages'
import { ValidationStub } from '../mocks'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import React from 'react'
import faker from 'faker'

type SutTypes = {
  sut: RenderResult
  validationStub: ValidationStub
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const sut = render(<Login validation={validationStub} />)
  return {
    sut,
    validationStub
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
      const passwordInput = sut.getByPlaceholderText('enter your e-mail address')
      fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
      const passwordStatus = sut.getByTestId('password-status')
      expect(passwordStatus.title).toBe('Your password is valid')
      expect(passwordStatus.textContent).toBe('🟢')
    })

    it('Should enabled submit button if form is valid', () => {
      const { sut } = makeSut()
      const passwordInput = sut.getByPlaceholderText('enter your e-mail address')
      fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
      const emailInput = sut.getByPlaceholderText('enter your e-mail address')
      fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
      const submitButton = sut.getByRole('button', { name: /enter/i })
      expect(submitButton).toHaveProperty('disabled', false)
    })
  })
})
