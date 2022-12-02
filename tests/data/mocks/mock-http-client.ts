import { HttpPostClient, HttpPostParams } from 'data/protocols/http/http-post-client'
import { HttpResponse, HttpStatusCode } from '@/data/protocols/http/http-response'

export class HttpPostClientSpy<T, R> implements HttpPostClient<T, R> {
  url?: string
  body?: T
  response: HttpResponse<R> = {
    statusCode: HttpStatusCode.ok
  }

  async post ({ url, body }: HttpPostParams<T>): Promise<HttpResponse<R>> {
    this.url = url
    this.body = body

    return this.response
  }
}
