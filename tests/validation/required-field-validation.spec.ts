import { RequiredFieldError } from '@/validation/errors'
import { RequiredFieldValidation } from '@/validation/validators'
import faker from 'faker'

interface SutTypes {
  sut: RequiredFieldValidation
  field: string
}

const makeSut = (): SutTypes => {
  const field = faker.database.column()
  const sut = new RequiredFieldValidation(field)
  return {
    sut,
    field
  }
}

describe('RequiredFieldValidation', () => {
  it('Should return error if field is empty', () => {
    const { sut, field } = makeSut()
    const error = sut.validate('')
    expect(error).toEqual(new RequiredFieldError(field))
  })

  it('Should return falsy if field is not empty', () => {
    const { sut } = makeSut()
    const error = sut.validate(faker.random.word())
    expect(error).toBeFalsy()
  })
})
