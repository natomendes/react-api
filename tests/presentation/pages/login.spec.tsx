import React from 'react'
import faker from 'faker'
import 'jest-localstorage-mock'
import { createMemoryHistory, MemoryHistory } from 'history'
import { Login } from '@/presentation/pages'
import { ValidationStub, AuthenticationSpy } from '../mocks'
import { cleanup, fireEvent, RenderResult, waitFor } from '@testing-library/react'
import { populateEmailField, populatePasswordField, simulateValidSubmit, checkFieldStatus, checkButtonIsDisabled, checkElementExists, checkElementNotExists, checkElementTextContent } from './test-helpers'
import { InvalidCredentialsError } from '@/domain/errors'
import { renderWithRouter } from './renderWithRouter'

type SutTypes = {
  sut: RenderResult
  validationStub: ValidationStub
  authenticationSpy: AuthenticationSpy
  history: MemoryHistory
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  const history = createMemoryHistory()
  validationStub.errorMessage = params?.validationError
  const sut = renderWithRouter(<Login validation={validationStub} authentication={authenticationSpy} />, history)
  return {
    sut,
    validationStub,
    authenticationSpy,
    history
  }
}

afterEach(cleanup)
beforeEach(() => {
  localStorage.clear()
})

describe('Login Page', () => {
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
  })
  describe('Component Flow', () => {
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
      const { sut } = makeSut()
      simulateValidSubmit(sut)
      await waitFor(() => {
        checkElementExists(sut, 'spinner')
      })
    })

    it('Should call Authentication with correct values', async () => {
      const { sut, authenticationSpy } = makeSut()
      const email = faker.internet.email()
      const password = faker.internet.password()
      simulateValidSubmit(sut, email, password)
      await waitFor(() => {
        expect(authenticationSpy.params).toEqual({
          email,
          password
        })
      })
    })

    it('Should call Authentication with correct values', async () => {
      const { sut, authenticationSpy } = makeSut()
      simulateValidSubmit(sut)
      simulateValidSubmit(sut)
      await waitFor(() => {
        expect(authenticationSpy.callsCount).toBe(1)
      })
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

    it('Should add accessToken to localStorage on success', async () => {
      const { sut, authenticationSpy } = makeSut()
      simulateValidSubmit(sut)
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)
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
      const { sut, history } = makeSut()
      simulateValidSubmit(sut)
      await waitFor(() => {
        expect(history.length).toBe(1)
        expect(history.location.pathname).toBe('/')
      })
    })
  })
})
