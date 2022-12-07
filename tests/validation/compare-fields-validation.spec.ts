import { faker } from '@faker-js/faker'
import { CompareFieldsValidation } from '@/validation/validators'
import { CompareFieldError } from '@/validation/errors'

interface SutTypes {
  sut: CompareFieldsValidation
  field: string
}

const makeSut = (fieldToCompare: string): SutTypes => {
  const field = faker.database.column()
  const sut = new CompareFieldsValidation(field, fieldToCompare)
  return {
    sut,
    field
  }
}

describe('CompareFieldsValidation', () => {
  it('Should return error if compare is invalid', () => {
    const fieldToCompare = faker.database.column()
    const { sut, field } = makeSut(fieldToCompare)
    const error = sut.validate({
      [field]: faker.random.word(),
      [fieldToCompare]: faker.random.word()
    })
    expect(error).toEqual(new CompareFieldError(field))
  })

  it('Should return falsy if compare is valid', () => {
    const fieldToCompare = faker.database.column()
    const value = faker.random.word()
    const { sut, field } = makeSut(fieldToCompare)
    const error = sut.validate({
      [field]: value,
      [fieldToCompare]: value
    })
    expect(error).toBeFalsy()
  })
})
