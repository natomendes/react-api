import { faker } from '@faker-js/faker'
import { MemoryHistory } from 'history'
import { RenderResult, fireEvent } from '@testing-library/react'
import { AuthenticationSpy, SaveAccesTokenMock } from '@/tests/presentation/mocks'

export const populateInputField = (sut: RenderResult, placeholderText: string, value = faker.random.word()): void => {
  const emailInput = sut.getByPlaceholderText(placeholderText)
  fireEvent.input(emailInput, { target: { value } })
}

export const simulateLoginSubmit = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): void => {
  populateInputField(sut, 'enter your email address', email)
  populateInputField(sut, 'enter your password', password)
  const form = sut.getByRole('form')
  fireEvent.submit(form)
}

export const simulateSignUpSubmit = (
  sut: RenderResult,
  name = faker.name.fullName(),
  email = faker.internet.email(),
  password = faker.internet.password()
): void => {
  populateInputField(sut, 'enter your full name', name)
  populateInputField(sut, 'enter your email address', email)
  populateInputField(sut, 'enter your password', password)
  populateInputField(sut, 'confirm your password', password)
  const form = sut.getByRole('form')
  fireEvent.submit(form)
}

export const checkFieldStatus = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || `Your ${fieldName} is valid`)
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

export const checkButtonIsDisabled = (sut: RenderResult, fieldName: string, isDisabled: boolean): void => {
  const button = sut.getByRole('button', { name: fieldName })
  expect(button).toHaveProperty('disabled', isDisabled)
}

export const checkElementExists = (sut: RenderResult, fieldName: string): void => {
  expect(sut.getByTestId(fieldName)).toBeDefined()
}

export const checkElementNotExists = (sut: RenderResult, fieldName: string): void => {
  expect(sut.queryByTestId(fieldName)).toBeNull()
}

export const checkElementTextContent = (sut: RenderResult, fieldName: string, text: string): void => {
  const element = sut.queryByTestId(fieldName)
  expect(element.textContent).toBe(text)
}

export const awaitSubmitAsyncProcess = (
  saveAccessTokenMock: SaveAccesTokenMock,
  authenticationSpy: AuthenticationSpy,
  history: MemoryHistory
): void => {
  expect(saveAccessTokenMock.accessToken).toBe(authenticationSpy.account.accessToken)
  expect(history.length).toBe(1)
  expect(history.location.pathname).toBe('/')
}
