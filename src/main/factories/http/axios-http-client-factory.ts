import { AxiosHttpClientMock } from '@/infra/http/axios-http-client-mock'

export const makeAxiosHttpClient = (): AxiosHttpClientMock => {
  return new AxiosHttpClientMock()
}
