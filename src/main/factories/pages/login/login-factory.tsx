import React from 'react'
import { Login } from '@/presentation/pages'
import { makeRemoteAuthentication } from '@/main/factories/usecases/authentication'
import { makeLoginValidation } from '@/main/factories/pages/login'
import { makeLocalSaveAccessToken } from '@/main/factories/usecases/cache'

export const makeLoginPage: React.FC = () => {
  return (
    <Login
      authentication={makeRemoteAuthentication()}
      validation={makeLoginValidation()}
      saveAccessToken={makeLocalSaveAccessToken()}
    />
  )
}
