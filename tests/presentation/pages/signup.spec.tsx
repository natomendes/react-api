import React from 'react'
import { faker } from '@faker-js/faker'
import { createMemoryHistory, MemoryHistory } from 'history'
import { SignUp } from '@/presentation/pages'
import { ValidationStub } from '@/tests/presentation/mocks'
import { cleanup, fireEvent, RenderResult } from '@testing-library/react'
import { checkFieldStatus, checkButtonIsDisabled, checkElementNotExists, populateNameField } from '@/tests/presentation/pages/test-helpers'
import { renderWithRouter } from '@/tests/presentation/pages/renderWithRouter'

type SutTypes = {
  sut: RenderResult
  validationStub: ValidationStub
  history: MemoryHistory
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const history = createMemoryHistory()
  validationStub.errorMessage = params?.validationError
  const sut = renderWithRouter(
    <SignUp
      validation={validationStub}
    />, history
  )
  return {
    sut,
    validationStub,
    history
  }
}

describe('SignUp Page', () => {
  describe('Initial State', () => {
    afterEach(cleanup)
    it('Should not render Spinner component on start', () => {
      const { sut } = makeSut({ validationError: faker.random.words() })
      checkElementNotExists(sut, 'spinner')
    })

    it('Should not render error message span component on start', () => {
      const { sut } = makeSut({ validationError: faker.random.words() })
      checkElementNotExists(sut, 'error-message-span')
    })

    it('Should have submit button disable on start', () => {
      const { sut } = makeSut({ validationError: faker.random.words() })
      checkButtonIsDisabled(sut, 'Create Account', true)
    })

    it('Should have name status title = "Your name is invalid" and text content "🔴" on start', () => {
      const { sut, validationStub } = makeSut({ validationError: faker.random.words() })
      checkFieldStatus(sut, 'name', validationStub.errorMessage)
    })

    it('Should have email status title = "Your email is invalid" and text content "🔴" on start', () => {
      const { sut } = makeSut()
      checkFieldStatus(sut, 'email', 'Your email is invalid')
    })

    it('Should have password status title = "Your password is invalid" and text content "🔴" on start', () => {
      const { sut } = makeSut()
      checkFieldStatus(sut, 'password', 'Your password is invalid')
    })

    it('Should have passwordConfirmation status title = "Your passwordConfirmation is invalid" and text content "🔴" on start', () => {
      const { sut } = makeSut()
      checkFieldStatus(sut, 'passwordConfirmation', 'Your passwordConfirmation is invalid')
    })

    it('Should have inputs as read only on start', () => {
      const { sut } = makeSut()
      const emailInput = sut.getByPlaceholderText('enter your email address')
      expect(emailInput).toHaveProperty('readOnly', true)
    })
  })
  describe('Component Flow', () => {
    afterEach(cleanup)
    it('Should have inputs as read only false on focus', () => {
      const { sut } = makeSut()
      const emailInput = sut.getByPlaceholderText('enter your email address')
      fireEvent.focus(emailInput)
      expect(emailInput).toHaveProperty('readOnly', false)
    })

    it('Should show name status error if Validation fails', () => {
      const { sut, validationStub } = makeSut({ validationError: faker.random.words() })
      populateNameField(sut)
      checkFieldStatus(sut, 'name', validationStub.errorMessage)
    })
  })
})
