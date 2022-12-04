import React from 'react'
import { Login } from '@/presentation/pages'
import { RemoteAuthentication } from '@/data/usecases'
import { AxiosHttpClient } from '@/infra/http/axios-http-client'
import { ValidationBuilder, ValidationComposite } from '@/validation/validators'

export const makeLoginPage: React.FC = () => {
  const url = 'http://localhost:3001/signin'
  const axiosHttpClient = new AxiosHttpClient()
  const remoteAuthentication = new RemoteAuthentication(url, axiosHttpClient)
  const validationComposite = ValidationComposite.build([
    ...ValidationBuilder.field('email').required().email().build(),
    ...ValidationBuilder.field('password').required().minLength(6).build()
  ])
  return (
    <Login
      authentication={remoteAuthentication}
      validation={validationComposite}
    />
  )
}
