import { HttpPostClient, HttpPostParams, HttpResponse } from '@/data/protocols/http'

type Response = {
  status: number
  data: any
}

export class AxiosHttpClientMock implements HttpPostClient<any, any> {
  async post ({ body }: HttpPostParams<any>): Promise<HttpResponse<any>> {
    const httpResponse: Response = {
      status: 200,
      data: {
        accessToken: 'valid_token'
      }
    }
    if (body.email !== 'teste@gmail.com' || body.password !== '123456') {
      httpResponse.status = 401
      httpResponse.data = new Error('Unauthorized')
    }

    return {
      statusCode: httpResponse.status,
      body: httpResponse.data
    }
  }
}
