import React from 'react'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import { Login } from '@/presentation/pages'
import { Validation } from '@/presentation/protocols/validation'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
}

class ValidationSpy implements Validation {
  errorMessage: string
  fieldName: string
  fieldValue: string
  validate (fieldName: string, fieldValue: string): string {
    this.fieldName = fieldName
    this.fieldValue = fieldValue
    this.errorMessage = ''
    return this.errorMessage
  }
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = render(<Login validation={validationSpy} />)
  return {
    sut,
    validationSpy
  }
}

describe('Login Page', () => {
  afterEach(cleanup)
  describe('Initial State', () => {
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

    it('Should have email status title "required field" and text content "🔴" on start', () => {
      const { sut } = makeSut()
      const emailStatus = sut.getByTestId('email-status')
      expect(emailStatus.title).toBe('required field')
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
    it('Should call Validation with correct email on email input change', () => {
      const { sut, validationSpy } = makeSut()
      const emailInput = sut.getByPlaceholderText('enter your e-mail address')
      fireEvent.input(emailInput, { target: { value: 'any_email' } })
      expect(validationSpy.fieldName).toBe('email')
      expect(validationSpy.fieldValue).toBe('any_email')
    })

    it('Should call Validation with correct password on password input change', () => {
      const { sut, validationSpy } = makeSut()
      const passwordInput = sut.getByPlaceholderText('enter your password')
      fireEvent.input(passwordInput, { target: { value: 'any_password' } })
      expect(validationSpy.fieldName).toBe('password')
      expect(validationSpy.fieldValue).toBe('any_password')
    })
  })
})
