import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { makeLoginPage } from '@/main/factories/pages/login'
import { makeSignUpPage } from '@/main/factories/pages/signup'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/login' exact component={makeLoginPage} />
        <Route path='/signup' exact component={makeSignUpPage} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
