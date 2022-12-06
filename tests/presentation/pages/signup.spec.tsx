import React from 'react'
import { RenderResult } from '@testing-library/react'
import { MemoryHistory, createMemoryHistory } from 'history'
import { SignUp } from '@/presentation/pages'
import { renderWithRouter } from '@/tests/presentation/pages/renderWithRouter'
import { checkButtonIsDisabled, checkElementNotExists, checkFieldStatus } from '@/tests/presentation/pages/test-helpers'

type SutTypes = {
  sut: RenderResult
  history: MemoryHistory
}

const makeSut = (): SutTypes => {
  const history = createMemoryHistory()
  const sut = renderWithRouter(
    <SignUp />,
    history
  )
  return {
    sut,
    history
  }
}

describe('SignUp Page', () => {
  describe('Initial State', () => {
    it('Should not render Spinner component on start', () => {
      const { sut } = makeSut()
      checkElementNotExists(sut, 'spinner')
    })

    it('Should not render error message span component on start', () => {
      const { sut } = makeSut()
      checkElementNotExists(sut, 'error-message-span')
    })

    it('Should have submit button disable on start', () => {
      const { sut } = makeSut()
      checkButtonIsDisabled(sut, 'Create Account', true)
    })

    it('Should have name status title = "Your name is invalid" and text content "🔴" on start', () => {
      const { sut } = makeSut()
      checkFieldStatus(sut, 'name', 'Your name is invalid')
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
  })
})
