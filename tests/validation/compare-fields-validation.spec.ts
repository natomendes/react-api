import { faker } from '@faker-js/faker'
import { CompareFieldsValidation } from '@/validation/validators'
import { CompareFieldError } from '@/validation/errors'

interface SutTypes {
  sut: CompareFieldsValidation
  field: string
}

const makeSut = (valueToCompare: string): SutTypes => {
  const field = faker.database.column()
  const sut = new CompareFieldsValidation(field, valueToCompare)
  return {
    sut,
    field
  }
}

describe('CompareFieldsValidation', () => {
  it('Should return error if compare is invalid', () => {
    const { sut, field } = makeSut(faker.random.word())
    const error = sut.validate(faker.random.word())
    expect(error).toEqual(new CompareFieldError(field))
  })
})
