import React from 'react'
import { faker } from '@faker-js/faker'
import { createMemoryHistory, MemoryHistory } from 'history'
import { SignUp } from '@/presentation/pages'
import { ValidationStub, AddAccountSpy } from '@/tests/presentation/mocks'
import { cleanup, fireEvent, RenderResult, waitFor } from '@testing-library/react'
import * as Helper from '@/tests/presentation/pages/test-helpers'
import { renderWithRouter } from '@/tests/presentation/pages/renderWithRouter'

type SutTypes = {
  sut: RenderResult
  validationStub: ValidationStub
  addAccountSpy: AddAccountSpy
  history: MemoryHistory
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const addAccountSpy = new AddAccountSpy()
  validationStub.errorMessage = params?.validationError
  const history = createMemoryHistory()
  const sut = renderWithRouter(
    <SignUp
      validation={validationStub}
      addAccount={addAccountSpy}
    />, history
  )
  return {
    sut,
    validationStub,
    addAccountSpy,
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
      Helper.populateInputField(sut, 'enter your full name')
      Helper.checkFieldStatus(sut, 'name', validationStub.errorMessage)
    })

    it('Should show email status error if Validation fails', () => {
      const { sut, validationStub } = makeSut({ validationError: faker.random.words() })
      Helper.populateInputField(sut, 'enter your email address')
      Helper.checkFieldStatus(sut, 'email', validationStub.errorMessage)
    })

    it('Should show password status error if Validation fails', () => {
      const { sut, validationStub } = makeSut({ validationError: faker.random.words() })
      Helper.populateInputField(sut, 'enter your password')
      Helper.checkFieldStatus(sut, 'password', validationStub.errorMessage)
    })

    it('Should show passwordConfirmation status error if Validation fails', () => {
      const { sut, validationStub } = makeSut({ validationError: faker.random.words() })
      Helper.populateInputField(sut, 'confirm your password')
      Helper.checkFieldStatus(sut, 'passwordConfirmation', validationStub.errorMessage)
    })

    it('Should show name status ok if Validation succeeds', () => {
      const { sut } = makeSut()
      Helper.populateInputField(sut, 'enter your full name')
      Helper.checkFieldStatus(sut, 'name')
    })

    it('Should show email status ok if Validation succeeds', () => {
      const { sut } = makeSut()
      Helper.populateInputField(sut, 'enter your email address')
      Helper.checkFieldStatus(sut, 'email')
    })

    it('Should show password status ok if Validation succeeds', () => {
      const { sut } = makeSut()
      Helper.populateInputField(sut, 'enter your password')
      Helper.checkFieldStatus(sut, 'password')
    })

    it('Should show passwordConfirmation status ok if Validation succeeds', () => {
      const { sut } = makeSut()
      Helper.populateInputField(sut, 'confirm your password')
      Helper.checkFieldStatus(sut, 'passwordConfirmation')
    })

    it('Should enabled submit button if form is valid', () => {
      const { sut } = makeSut()
      Helper.populateInputField(sut, 'enter your full name')
      Helper.populateInputField(sut, 'enter your email address')
      Helper.populateInputField(sut, 'enter your password')
      Helper.populateInputField(sut, 'confirm your password')
      Helper.checkButtonIsDisabled(sut, 'Create Account', false)
    })

    it('Should show spinner on submit', async () => {
      const { sut } = makeSut()
      Helper.simulateSignUpSubmit(sut)
      await waitFor(() => {
        Helper.checkElementExists(sut, 'spinner')
      })
    })

    it('Should call Authentication with correct values', async () => {
      const { sut, addAccountSpy } = makeSut()
      const name = faker.name.fullName()
      const email = faker.internet.email()
      const password = faker.internet.password()
      Helper.simulateSignUpSubmit(sut, name, email, password)
      await waitFor(() => {
        expect(addAccountSpy.params).toEqual({
          name,
          email,
          password,
          passwordConfirmation: password
        })
      })
    })
  })
})
