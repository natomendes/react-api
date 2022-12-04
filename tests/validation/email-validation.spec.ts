import { EmailValidation } from '@/validation/validators'
import { EmailValidator } from '@/validation/protocols'
import { InvalidFieldError } from '@/validation/errors'

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (field: string): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new EmailValidation(emailValidatorStub, field)
  return {
    sut,
    emailValidatorStub
  }
}

describe('EmailValidation', () => {
  it('Should return error if email is invalid', () => {
    const { sut, emailValidatorStub } = makeSut('email')
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate('invalid_email')
    expect(error).toEqual(new InvalidFieldError('email'))
  })
})
