import { HttpPostParams } from '@/data/protocols/http'
import { AxiosHttpClient } from '@/infra/http/axios-http-client'
import axios from 'axios'
import faker from 'faker'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const makeSut = (): AxiosHttpClient => {
  return new AxiosHttpClient()
}

const mockPostResquest = (): HttpPostParams<any> => ({
  url: faker.internet.url(),
  body: faker.random.objectElement()
})

describe('AxiosHttpClient', () => {
  describe('PostClient', () => {
    it('Should call axios with correct url and verb', async () => {
      const postRequest = mockPostResquest()
      const sut = makeSut()
      await sut.post(postRequest)
      expect(mockedAxios.post).toHaveBeenCalledWith(postRequest.url)
    })
  })
})
