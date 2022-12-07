import { AddAccount, AddAccountParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/tests/domain/mocks'

export class AddAccountSpy implements AddAccount {
  account = mockAccountModel()
  params: AddAccountParams
  callsCount = 0
  async add (params: AddAccountParams): Promise<AccountModel> {
    this.callsCount += 1
    this.params = params
    return this.account
  }
}
