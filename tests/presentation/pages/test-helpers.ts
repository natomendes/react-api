import { RenderResult, fireEvent } from '@testing-library/react'
import faker from 'faker'

export const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByPlaceholderText('enter your e-mail address')
  fireEvent.input(emailInput, { target: { value: email } })
}

export const populatePasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
  const passwordInput = sut.getByPlaceholderText('enter your password')
  fireEvent.input(passwordInput, { target: { value: password } })
}

export const simulateValidSubmit = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): void => {
  populateEmailField(sut, email)
  populatePasswordField(sut, password)
  const submitButton = sut.getByRole('button', { name: /enter/i })
  fireEvent.click(submitButton)
}

export const checkFieldStatus = (sut: RenderResult, fieldName: string, message: string, content: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(message)
  expect(fieldStatus.textContent).toBe(content)
}
