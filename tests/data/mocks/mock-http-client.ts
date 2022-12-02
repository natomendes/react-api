import { HttpPostClient, HttpPostParams } from 'data/protocols/http/http-post-client'

export class HttpPostClientSpy implements HttpPostClient {
  url?: string
  async post ({ url }: HttpPostParams): Promise<void> {
    this.url = url
  }
}
