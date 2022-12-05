import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { makeLoginPage } from '@/main/factories/pages/login'
import { SignUp } from '@/presentation/pages'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/login' exact component={makeLoginPage} />
        <Route path='/signup' exact component={SignUp} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
