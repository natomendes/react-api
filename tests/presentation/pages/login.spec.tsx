import { Login } from '@/presentation/pages'
import { ValidationStub } from '../mocks'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import React from 'react'
import faker from 'faker'

type SutTypes = {
  sut: RenderResult
  validationStub: ValidationStub
}

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = faker.random.words()
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
      const { sut, validationStub } = makeSut()
      const emailStatus = sut.getByTestId('email-status')
      expect(emailStatus.title).toBe(validationStub.errorMessage)
      expect(emailStatus.textContent).toBe('🔴')
    })

    it('Should have password status title "required field" and text content "🔴" on start', () => {
      const { sut, validationStub } = makeSut()
      const passwordStatus = sut.getByTestId('password-status')
      expect(passwordStatus.title).toBe(validationStub.errorMessage)
      expect(passwordStatus.textContent).toBe('🔴')
    })
  })
  describe('Communication with dependencies', () => {
    afterEach(cleanup)
    it('Should show email status error if Validation fails', () => {
      const { sut, validationStub } = makeSut()
      const emailInput = sut.getByPlaceholderText('enter your e-mail address')
      fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
      const emailStatus = sut.getByTestId('email-status')
      expect(emailStatus.title).toBe(validationStub.errorMessage)
      expect(emailStatus.textContent).toBe('🔴')
    })

    it('Should show password status error if Validation fails', () => {
      const { sut, validationStub } = makeSut()
      const passwordInput = sut.getByPlaceholderText('enter your password')
      fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
      const passwordStatus = sut.getByTestId('password-status')
      expect(passwordStatus.title).toBe(validationStub.errorMessage)
      expect(passwordStatus.textContent).toBe('🔴')
    })
  })
})
