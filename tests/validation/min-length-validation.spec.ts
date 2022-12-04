import { InvalidFieldError } from '@/validation/errors'
import { MinLengthValidation } from '@/validation/validators'
import faker from 'faker'

const makeSut = (field = faker.random.word()): MinLengthValidation => {
  return new MinLengthValidation(5, field)
}

describe('MinLengthValidation', () => {
  it('Should return error if value is invalid', () => {
    const field = faker.random.word()
    const sut = makeSut(field)
    const error = sut.validate(faker.random.alphaNumeric(4))
    expect(error).toEqual(new InvalidFieldError(field))
  })

  it('Should return falsy if value is valid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.alphaNumeric(5))
    expect(error).toBeFalsy()
  })
})
