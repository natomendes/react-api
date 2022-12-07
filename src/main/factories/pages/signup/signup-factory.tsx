import React from 'react'
import { SignUp } from '@/presentation/pages'
import { makeLocalSaveAccessToken } from '@/main/factories/usecases/cache'
import { makeSignUpValidation } from '@/main/factories/pages/signup'
import { makeRemoteAddAccount } from '@/main/factories/usecases/add-account'

export const makeSignUpPage: React.FC = () => {
  return (
    <SignUp
      addAccount={makeRemoteAddAccount()}
      validation={makeSignUpValidation()}
      saveAccessToken={makeLocalSaveAccessToken()}
    />
  )
}
