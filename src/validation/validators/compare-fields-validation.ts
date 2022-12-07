import { FieldValidation } from '@/validation/protocols'
import { CompareFieldError } from '@/validation/errors'

export class CompareFieldsValidation implements FieldValidation {
  constructor (
    readonly field: string,
    private readonly fieldToCompare: string
  ) {}

  validate (input: object): Error {
    return input[this.field] === input[this.fieldToCompare]
      ? null
      : new CompareFieldError(this.field)
  }
}
