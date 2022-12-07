import { AxiosHttpClient } from '@/infra/http/axios-http-client'
import { mockedAxiosPostResult, mockPostResquest } from '@/tests/data/mocks'
import axios from 'axios'

const makeSut = (): AxiosHttpClient => {
  return new AxiosHttpClient()
}

describe('AxiosHttpClient', () => {
  describe('PostClient', () => {
    it('Should call axios with correct values', async () => {
      const postSpy = jest.spyOn(axios, 'post').mockResolvedValueOnce(mockedAxiosPostResult)
      const postRequest = mockPostResquest()
      const sut = makeSut()
      await sut.post(postRequest)
      expect(postSpy).toHaveBeenCalledWith(postRequest.url, postRequest.body)
    })

    it('Should return the correct statusCode and body', async () => {
      jest.spyOn(axios, 'post').mockResolvedValueOnce(mockedAxiosPostResult)
      const sut = makeSut()
      const httpResponse = await sut.post(mockPostResquest())
      expect(httpResponse).toEqual({
        statusCode: mockedAxiosPostResult.status,
        body: mockedAxiosPostResult.data
      })
    })

    it('Should return the correct statusCode and body on failure', async () => {
      jest.spyOn(axios, 'post').mockRejectedValueOnce({
        response: mockedAxiosPostResult
      })
      const sut = makeSut()
      const httpResponse = await sut.post(mockPostResquest())
      expect(httpResponse).toEqual({
        statusCode: mockedAxiosPostResult.status,
        body: mockedAxiosPostResult.data
      })
    })
  })
})
