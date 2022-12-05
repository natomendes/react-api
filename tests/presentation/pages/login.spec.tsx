import React from 'react'
import { faker } from '@faker-js/faker'
import { createMemoryHistory, MemoryHistory } from 'history'
import { Login } from '@/presentation/pages'
import { ValidationStub, AuthenticationSpy, SaveAccesTokenMock } from '@/tests/presentation/mocks'
import { cleanup, fireEvent, RenderResult, waitFor } from '@testing-library/react'
import { populateEmailField, populatePasswordField, simulateValidSubmit, checkFieldStatus, checkButtonIsDisabled, checkElementExists, checkElementNotExists, checkElementTextContent, awaitSubmitAsyncProcess } from '@/tests/presentation/pages/test-helpers'
import { InvalidCredentialsError } from '@/domain/errors'
import { renderWithRouter } from '@/tests/presentation/pages/renderWithRouter'

type SutTypes = {
  sut: RenderResult
  validationStub: ValidationStub
  authenticationSpy: AuthenticationSpy
  saveAccessTokenMock: SaveAccesTokenMock
  history: MemoryHistory
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  const saveAccessTokenMock = new SaveAccesTokenMock()
  const history = createMemoryHistory()
  validationStub.errorMessage = params?.validationError
  const sut = renderWithRouter(
    <Login
      validation={validationStub}
      authentication={authenticationSpy}
      saveAccessToken={saveAccessTokenMock}
    />, history
  )
  return {
    sut,
    validationStub,
    authenticationSpy,
    saveAccessTokenMock,
    history
  }
}

describe('Login Page', () => {
  afterEach(cleanup)
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
      checkButtonIsDisabled(sut, 'Enter', true)
    })

    it('Should have email status title = Validation.errorMessage and text content "🔴" on start', () => {
      const { sut, validationStub } = makeSut({ validationError: faker.random.words() })
      checkFieldStatus(sut, 'email', validationStub.errorMessage)
    })

    it('Should have password status title "required field" and text content "🔴" on start', () => {
      const { sut, validationStub } = makeSut({ validationError: faker.random.words() })
      checkFieldStatus(sut, 'password', validationStub.errorMessage)
    })

    it('Should have inputs as read only on start', () => {
      const { sut } = makeSut({ validationError: faker.random.words() })
      const emailInput = sut.getByPlaceholderText('enter your email address')
      expect(emailInput).toHaveProperty('readOnly', true)
    })
  })
  describe('Component Flow', () => {
    it('Should have inputs as read only false on focus', () => {
      const { sut } = makeSut({ validationError: faker.random.words() })
      const emailInput = sut.getByPlaceholderText('enter your email address')
      fireEvent.focus(emailInput)
      expect(emailInput).toHaveProperty('readOnly', false)
    })

    it('Should show email status error if Validation fails', () => {
      const { sut, validationStub } = makeSut({ validationError: faker.random.words() })
      populateEmailField(sut)
      checkFieldStatus(sut, 'email', validationStub.errorMessage)
    })

    it('Should show password status error if Validation fails', () => {
      const { sut, validationStub } = makeSut({ validationError: faker.random.words() })
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
      checkButtonIsDisabled(sut, 'Enter', false)
    })

    it('Should show spinner on submit', async () => {
      const { sut, saveAccessTokenMock, authenticationSpy, history } = makeSut()
      simulateValidSubmit(sut)
      await waitFor(() => {
        checkElementExists(sut, 'spinner')
        awaitSubmitAsyncProcess(saveAccessTokenMock, authenticationSpy, history)
      })
    })

    it('Should call Authentication with correct values', async () => {
      const { sut, authenticationSpy, saveAccessTokenMock, history } = makeSut()
      const email = faker.internet.email()
      const password = faker.internet.password()
      simulateValidSubmit(sut, email, password)
      await waitFor(() => {
        expect(authenticationSpy.params).toEqual({
          email,
          password
        })
        awaitSubmitAsyncProcess(saveAccessTokenMock, authenticationSpy, history)
      })
    })

    it('Should call Authentication with correct values', async () => {
      const { sut, authenticationSpy, saveAccessTokenMock, history } = makeSut()
      simulateValidSubmit(sut)
      simulateValidSubmit(sut)
      await waitFor(() => {
        awaitSubmitAsyncProcess(saveAccessTokenMock, authenticationSpy, history)
      })
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
      await waitFor(() => {
        checkElementNotExists(sut, 'spinner')
        checkElementTextContent(sut, 'error-message-span', error.message)
      })
    })

    it('Should call SaveAccessToken on success', async () => {
      const { sut, authenticationSpy, saveAccessTokenMock, history } = makeSut()
      simulateValidSubmit(sut)
      await waitFor(async () => {
        awaitSubmitAsyncProcess(saveAccessTokenMock, authenticationSpy, history)
      })
    })

    it('Should present error if SaveAccessToken fails', async () => {
      const { sut, saveAccessTokenMock } = makeSut()
      const error = new InvalidCredentialsError()
      jest.spyOn(saveAccessTokenMock, 'save')
        .mockRejectedValueOnce(error)
      simulateValidSubmit(sut)
      await waitFor(() => {
        checkElementNotExists(sut, 'spinner')
        checkElementTextContent(sut, 'error-message-span', error.message)
      })
    })

    it('Should go to singup page', async () => {
      const { sut, history } = makeSut()
      const register = sut.getByText(/create account/i)
      fireEvent.click(register)
      await waitFor(() => {
        expect(history.length).toBe(2)
        expect(history.location.pathname).toBe('/signup')
      })
    })

    it('Should go to main page on success', async () => {
      const { sut, history, saveAccessTokenMock, authenticationSpy } = makeSut()
      simulateValidSubmit(sut)
      await waitFor(() => {
        awaitSubmitAsyncProcess(saveAccessTokenMock, authenticationSpy, history)
      })
    })
  })
})
