import { Authentication, AuthenticationParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '../../domain/mocks'

export class AuthenticationSpy implements Authentication {
  account = mockAccountModel()
  params: AuthenticationParams
  callsCount = 0
  async auth (params: AuthenticationParams): Promise<AccountModel> {
    this.callsCount += 1
    this.params = params
    return this.account
  }
}
