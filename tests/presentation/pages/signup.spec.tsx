import React from 'react'
import { faker } from '@faker-js/faker'
import { createMemoryHistory, MemoryHistory } from 'history'
import { SignUp } from '@/presentation/pages'
import { ValidationStub } from '@/tests/presentation/mocks'
import { cleanup, fireEvent, RenderResult } from '@testing-library/react'
import * as Helper from '@/tests/presentation/pages/test-helpers'
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
      Helper.checkElementNotExists(sut, 'spinner')
    })

    it('Should not render error message span component on start', () => {
      const { sut } = makeSut({ validationError: faker.random.words() })
      Helper.checkElementNotExists(sut, 'error-message-span')
    })

    it('Should have submit button disable on start', () => {
      const { sut } = makeSut({ validationError: faker.random.words() })
      Helper.checkButtonIsDisabled(sut, 'Create Account', true)
    })

    it('Should have name status title = "Your name is invalid" and text content "🔴" on start', () => {
      const { sut, validationStub } = makeSut({ validationError: faker.random.words() })
      Helper.checkFieldStatus(sut, 'name', validationStub.errorMessage)
    })

    it('Should have email status title = "Your email is invalid" and text content "🔴" on start', () => {
      const { sut, validationStub } = makeSut({ validationError: faker.random.words() })
      Helper.checkFieldStatus(sut, 'email', validationStub.errorMessage)
    })

    it('Should have password status title = "Your password is invalid" and text content "🔴" on start', () => {
      const { sut, validationStub } = makeSut({ validationError: faker.random.words() })
      Helper.checkFieldStatus(sut, 'password', validationStub.errorMessage)
    })

    it('Should have passwordConfirmation status title = "Your passwordConfirmation is invalid" and text content "🔴" on start', () => {
      const { sut, validationStub } = makeSut({ validationError: faker.random.words() })
      Helper.checkFieldStatus(sut, 'passwordConfirmation', validationStub.errorMessage)
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
      Helper.populateNameField(sut)
      Helper.checkFieldStatus(sut, 'name', validationStub.errorMessage)
    })

    it('Should show email status error if Validation fails', () => {
      const { sut, validationStub } = makeSut({ validationError: faker.random.words() })
      Helper.populateEmailField(sut)
      Helper.checkFieldStatus(sut, 'email', validationStub.errorMessage)
    })

    it('Should show password status error if Validation fails', () => {
      const { sut, validationStub } = makeSut({ validationError: faker.random.words() })
      Helper.populatePasswordField(sut)
      Helper.checkFieldStatus(sut, 'password', validationStub.errorMessage)
    })

    it('Should show passwordConfirmation status error if Validation fails', () => {
      const { sut, validationStub } = makeSut({ validationError: faker.random.words() })
      Helper.populatePasswordConfirmationField(sut)
      Helper.checkFieldStatus(sut, 'passwordConfirmation', validationStub.errorMessage)
    })

    it('Should show name status ok if Validation succeeds', () => {
      const { sut } = makeSut()
      Helper.populateNameField(sut)
      Helper.checkFieldStatus(sut, 'name')
    })

    it('Should show email status ok if Validation succeeds', () => {
      const { sut } = makeSut()
      Helper.populateEmailField(sut)
      Helper.checkFieldStatus(sut, 'email')
    })

    it('Should show password status ok if Validation succeeds', () => {
      const { sut } = makeSut()
      Helper.populatePasswordField(sut)
      Helper.checkFieldStatus(sut, 'password')
    })
  })
})
