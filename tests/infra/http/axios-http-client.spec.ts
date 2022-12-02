import { HttpPostParams } from '@/data/protocols/http'
import { AxiosHttpClient } from '@/infra/http/axios-http-client'
import axios from 'axios'
import faker from 'faker'

const mockedAxiosResult = {
  data: faker.random.objectElement(),
  status: faker.datatype.number()
}

const mockPostResquest = (): HttpPostParams<any> => ({
  url: faker.internet.url(),
  body: faker.random.objectElement()
})

const makeSut = (): AxiosHttpClient => {
  return new AxiosHttpClient()
}

describe('AxiosHttpClient', () => {
  describe('PostClient', () => {
    it('Should call axios with correct values', async () => {
      const postSpy = jest.spyOn(axios, 'post').mockResolvedValueOnce(mockedAxiosResult)
      const postRequest = mockPostResquest()
      const sut = makeSut()
      await sut.post(postRequest)
      expect(postSpy).toHaveBeenCalledWith(postRequest.url, postRequest.body)
    })

    it('Should return the correct statusCode and body', async () => {
      jest.spyOn(axios, 'post').mockResolvedValueOnce(mockedAxiosResult)
      const sut = makeSut()
      const httpResponse = await sut.post(mockPostResquest())
      expect(httpResponse).toEqual({
        statusCode: mockedAxiosResult.status,
        body: mockedAxiosResult.data
      })
    })
  })
})
