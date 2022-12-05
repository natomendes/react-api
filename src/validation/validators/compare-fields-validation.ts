import { FieldValidation } from '@/validation/protocols'
import { CompareFieldError } from '@/validation/errors'

export class CompareFieldsValidation implements FieldValidation {
  constructor (
    readonly field: string,
    private readonly valueToCompare: string
  ) {}

  validate (value: string): Error {
    return new CompareFieldError(this.field)
  }
}
