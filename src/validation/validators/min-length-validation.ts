import { FieldValidation } from '@/validation/protocols'
import { InvalidFieldError } from '@/validation/errors'

export class MinLengthValidation implements FieldValidation {
  constructor (
    private readonly minLength: number,
    readonly field: string
  ) {}

  validate (value: string): Error {
    return value.length >= this.minLength ? null : new InvalidFieldError(this.field)
  }
}
