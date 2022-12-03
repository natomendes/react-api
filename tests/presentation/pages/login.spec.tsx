import React from 'react'
import { render } from '@testing-library/react'
import { Login } from '@/presentation/pages'

describe('Login Page', () => {
  it('Should not render Spinner component on start', () => {
    const { queryByTestId } = render(<Login />)
    const spinnerComponent = queryByTestId('spinner')
    expect(spinnerComponent).toBeNull()
  })

  it('Should not render error message span component on start', () => {
    const { queryByTestId } = render(<Login />)
    const errorMessageSpan = queryByTestId('error-message-span')
    expect(errorMessageSpan).toBeNull()
  })

  it('Should have submit button disable on start', () => {
    const { getByRole } = render(<Login />)
    const submitButton = getByRole('button', { name: /enter/i })
    expect(submitButton).toHaveProperty('disabled', true)
  })

  it('Should have email status title "required field" and text content "🔴" on start', () => {
    const { getByTestId } = render(<Login />)
    const emailStatus = getByTestId('email-status')
    expect(emailStatus.title).toBe('required field')
    expect(emailStatus.textContent).toBe('🔴')
  })
})
