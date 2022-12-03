import { Login } from '@/presentation/pages'
import { ValidationSpy } from '../mocks'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import React from 'react'
import faker from 'faker'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMessage = faker.random.words()
  const sut = render(<Login validation={validationSpy} />)
  return {
    sut,
    validationSpy
  }
}

describe('Login Page', () => {
  describe('Initial State', () => {
    afterEach(cleanup)
    it('Should not render Spinner component on start', () => {
      const { sut } = makeSut()
      const spinnerComponent = sut.queryByTestId('spinner')
      expect(spinnerComponent).toBeNull()
    })

    it('Should not render error message span component on start', () => {
      const { sut } = makeSut()
      const errorMessageSpan = sut.queryByTestId('error-message-span')
      expect(errorMessageSpan).toBeNull()
    })

    it('Should have submit button disable on start', () => {
      const { sut } = makeSut()
      const submitButton = sut.getByRole('button', { name: /enter/i })
      expect(submitButton).toHaveProperty('disabled', true)
    })

    it('Should have email status title = Validation.errorMessage and text content "🔴" on start', () => {
      const { sut, validationSpy } = makeSut()
      const emailStatus = sut.getByTestId('email-status')
      expect(emailStatus.title).toBe(validationSpy.errorMessage)
      expect(emailStatus.textContent).toBe('🔴')
    })

    it('Should have password status title "required field" and text content "🔴" on start', () => {
      const { sut } = makeSut()
      const passwordStatus = sut.getByTestId('password-status')
      expect(passwordStatus.title).toBe('required field')
      expect(passwordStatus.textContent).toBe('🔴')
    })
  })
  describe('Communication with dependencies', () => {
    afterEach(cleanup)
    it('Should call Validation with correct email on email input change', () => {
      const { sut, validationSpy } = makeSut()
      const email = faker.internet.email()
      const emailInput = sut.getByPlaceholderText('enter your e-mail address')
      fireEvent.input(emailInput, { target: { value: email } })
      expect(validationSpy.fieldName).toBe('email')
      expect(validationSpy.fieldValue).toBe(email)
    })

    it('Should call Validation with correct password on password input change', () => {
      const { sut, validationSpy } = makeSut()
      const password = faker.internet.password()
      const passwordInput = sut.getByPlaceholderText('enter your password')
      fireEvent.input(passwordInput, { target: { value: password } })
      expect(validationSpy.fieldName).toBe('password')
      expect(validationSpy.fieldValue).toBe(password)
    })

    it('Should show email status error if Validation fails', () => {
      const { sut, validationSpy } = makeSut()
      const emailInput = sut.getByPlaceholderText('enter your e-mail address')
      fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
      const emailStatus = sut.getByTestId('email-status')
      expect(emailStatus.title).toBe(validationSpy.errorMessage)
      expect(emailStatus.textContent).toBe('🔴')
    })
  })
})
