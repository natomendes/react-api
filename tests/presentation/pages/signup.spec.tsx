import React from 'react'
import { faker } from '@faker-js/faker'
import { createMemoryHistory, MemoryHistory } from 'history'
import { SignUp } from '@/presentation/pages'
import { ValidationStub, AddAccountSpy, SaveAccesTokenMock } from '@/tests/presentation/mocks'
import { cleanup, fireEvent, RenderResult, waitFor } from '@testing-library/react'
import * as Helper from '@/tests/presentation/pages/test-helpers'
import { renderWithRouter } from '@/tests/presentation/pages/renderWithRouter'
import { EmailInUseError, UnexpectedError } from '@/domain/errors'

type SutTypes = {
  sut: RenderResult
  validationStub: ValidationStub
  addAccountSpy: AddAccountSpy
  saveAccessTokenMock: SaveAccesTokenMock
  history: MemoryHistory
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const addAccountSpy = new AddAccountSpy()
  const saveAccessTokenMock = new SaveAccesTokenMock()
  validationStub.errorMessage = params?.validationError
  const history = createMemoryHistory({ initialEntries: ['/signup'] })
  const sut = renderWithRouter(
    <SignUp
      validation={validationStub}
      addAccount={addAccountSpy}
      saveAccessToken={saveAccessTokenMock}
    />, history
  )
  return {
    sut,
    validationStub,
    addAccountSpy,
    saveAccessTokenMock,
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
      const { sut, history } = makeSut()
      Helper.simulateSignUpSubmit(sut)
      await waitFor(() => {
        Helper.checkElementExists(sut, 'spinner')
        expect(history.location.pathname).toBe('/')
      })
    })

    it('Should call AddAccount with correct values', async () => {
      const { sut, addAccountSpy, history } = makeSut()
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
        expect(history.location.pathname).toBe('/')
      })
    })

    it('Should call AddAccount only once', async () => {
      const { sut, addAccountSpy, history } = makeSut()
      Helper.simulateSignUpSubmit(sut)
      Helper.simulateSignUpSubmit(sut)
      expect(addAccountSpy.callsCount).toBe(1)
      await waitFor(() => expect(history.location.pathname).toBe('/'))
    })

    it('Should not call AddAccount if form is invalid', async () => {
      const { sut, addAccountSpy } = makeSut({ validationError: faker.random.words() })
      Helper.simulateSignUpSubmit(sut)
      await waitFor(() => sut.getByRole('form'))
      expect(addAccountSpy.callsCount).toBe(0)
    })

    it('Should present error if AddAccount fails', async () => {
      const { sut, addAccountSpy } = makeSut()
      const error = new EmailInUseError()
      jest.spyOn(addAccountSpy, 'add')
        .mockRejectedValueOnce(error)
      Helper.simulateSignUpSubmit(sut)
      await waitFor(() => {
        Helper.checkElementNotExists(sut, 'spinner')
      })
      Helper.checkElementTextContent(sut, 'error-message-span', error.message)
    })

    it('Should call SaveAccessToken on success', async () => {
      const { sut, addAccountSpy, saveAccessTokenMock, history } = makeSut()
      Helper.simulateSignUpSubmit(sut)
      await waitFor(async () => {
        expect(saveAccessTokenMock.accessToken).toBe(addAccountSpy.account.accessToken)
        expect(history.length).toBe(1)
        expect(history.location.pathname).toBe('/')
      })
    })

    it('Should present error if SaveAccessToken fails', async () => {
      const { sut, saveAccessTokenMock } = makeSut()
      const error = new UnexpectedError()
      jest.spyOn(saveAccessTokenMock, 'save')
        .mockRejectedValueOnce(error)
      Helper.simulateSignUpSubmit(sut)
      await waitFor(() => {
        Helper.checkElementNotExists(sut, 'spinner')
        Helper.checkElementTextContent(sut, 'error-message-span', error.message)
      })
    })

    it('Should go to singup page', async () => {
      const { sut, history } = makeSut()
      const login = sut.getByText(/sign in/i)
      fireEvent.click(login)
      await waitFor(() => {
        expect(history.length).toBe(1)
        expect(history.location.pathname).toBe('/login')
      })
    })
  })
})
