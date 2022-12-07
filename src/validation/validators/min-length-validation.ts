import { FieldValidation } from '@/validation/protocols'
import { InvalidFieldError } from '@/validation/errors'

export class MinLengthValidation implements FieldValidation {
  constructor (
    private readonly minLength: number,
    readonly field: string
  ) {}

  validate (input: object): Error {
    return input[this.field]?.length < this.minLength ? new InvalidFieldError(this.field) : null
  }
}
