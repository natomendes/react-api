import validator from 'validator'
import faker from 'faker'
import { EmailValidatorAdapter } from '@/infra/utils/email-validator-adapter'

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid(faker.random.word())
    expect(isValid).toBe(false)
  })
})
