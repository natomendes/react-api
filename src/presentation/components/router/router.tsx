import { Login } from '@/presentation/pages'
import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ValidationStub } from '../../../../tests/presentation/mocks/mock-validation'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/login' exact render={() => <Login validation={new ValidationStub()}/>} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
