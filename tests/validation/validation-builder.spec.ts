import { EmailValidatorAdapter } from '@/infra/utils/email-validator-adapter'
import { EmailValidation, MinLengthValidation, RequiredFieldValidation, ValidationBuilder as sut } from '@/validation/validators'

describe('ValidationBuilder', () => {
  it('Should return RequiredFieldValidation', () => {
    const validations = sut.field('any_field').required().build()
    expect(validations).toEqual([new RequiredFieldValidation('any_field')])
  })

  it('Should return EmailValidation', () => {
    const validations = sut.field('any_field').email().build()
    expect(validations).toEqual([new EmailValidation(new EmailValidatorAdapter(), 'any_field')])
  })

  it('Should return MinLengthValidation', () => {
    const validations = sut.field('any_field').minLength(5).build()
    expect(validations).toEqual([new MinLengthValidation(5, 'any_field')])
  })
})
