import React from 'react'
import { Login } from '@/presentation/pages'
import { RemoteAuthentication } from '@/data/usecases'
import { ValidationBuilder, ValidationComposite } from '@/validation/validators'
import { AxiosHttpClientMock } from '@/infra/http/axios-http-client-mock'

export const makeLoginPage: React.FC = () => {
  const url = 'http://localhost:3001/signin'
  const axiosHttpClient = new AxiosHttpClientMock()
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
