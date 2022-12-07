import { InvalidFieldError } from '@/validation/errors'
import { MinLengthValidation } from '@/validation/validators'
import { faker } from '@faker-js/faker'

const makeSut = (field = faker.random.word()): MinLengthValidation => {
  return new MinLengthValidation(5, field)
}

describe('MinLengthValidation', () => {
  it('Should return error if value is invalid', () => {
    const field = faker.random.word()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: faker.random.alphaNumeric(4) })
    expect(error).toEqual(new InvalidFieldError(field))
  })

  it('Should return falsy if value is valid', () => {
    const field = faker.random.word()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: faker.random.alphaNumeric(5) })
    expect(error).toBeFalsy()
  })

  it('Should return falsy if field does not exists in schema', () => {
    const sut = makeSut(faker.database.column())
    const error = sut.validate({ [faker.database.column()]: faker.random.alphaNumeric(5) })
    expect(error).toBeFalsy()
  })
})
