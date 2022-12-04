import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { makeLoginPage } from '@/main/factories/pages/login/login-factory'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/login' exact component={makeLoginPage} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
