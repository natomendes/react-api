import { EmailValidatorAdapter } from '@/infra/utils/email-validator-adapter'
import { EmailValidation, MinLengthValidation, RequiredFieldValidation, ValidationBuilder as sut } from '@/validation/validators'
import { faker } from '@faker-js/faker'

describe('ValidationBuilder', () => {
  it('Should return RequiredFieldValidation', () => {
    const field = faker.database.column()
    const validations = sut.field(field).required().build()
    expect(validations).toEqual([new RequiredFieldValidation(field)])
  })

  it('Should return EmailValidation', () => {
    const field = faker.database.column()
    const validations = sut.field(field).email().build()
    expect(validations).toEqual([new EmailValidation(new EmailValidatorAdapter(), field)])
  })

  it('Should return MinLengthValidation', () => {
    const field = faker.database.column()
    const length = faker.datatype.number()
    const validations = sut.field(field).minLength(length).build()
    expect(validations).toEqual([new MinLengthValidation(length, field)])
  })

  it('Should return MinLengthValidation', () => {
    const field = faker.database.column()
    const length = faker.datatype.number()
    const validations = sut.field(field).required().minLength(length).email().build()
    expect(validations).toEqual([
      new RequiredFieldValidation(field),
      new MinLengthValidation(length, field),
      new EmailValidation(new EmailValidatorAdapter(), field)
    ])
  })
})
