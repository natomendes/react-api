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
})
