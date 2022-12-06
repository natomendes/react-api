import React from 'react'
import { MemoryHistory, createMemoryHistory } from 'history'
import { SignUp } from '@/presentation/pages'
import { renderWithRouter } from './renderWithRouter'
import { RenderResult } from '@testing-library/react'
import { checkElementNotExists } from './test-helpers'

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
  })
})
