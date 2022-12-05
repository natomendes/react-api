import { SaveAccessToken } from '@/domain/usecases'

export class SaveAccesTokenMock implements SaveAccessToken {
  accessToken: string
  async save (accessToken: string): Promise<void> {
    this.accessToken = accessToken
  }
}
