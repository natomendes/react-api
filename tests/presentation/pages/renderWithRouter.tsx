import { Router } from 'react-router-dom'
import { MemoryHistory } from 'history'
import { render, RenderResult } from '@testing-library/react'
import React from 'react'

export const renderWithRouter = (component: React.ReactNode, history: MemoryHistory): RenderResult => {
  return render(
    <Router history={history}>
      {component}
    </Router>
  )
}
