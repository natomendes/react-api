import { FieldValidation, EmailValidator } from '@/validation/protocols'
import { InvalidFieldError } from '@/validation/errors'

export class EmailValidation implements FieldValidation {
  constructor (
    private readonly emailValidator: EmailValidator,
    readonly field: string
  ) {}

  validate (input: object): Error {
    if (!input[this.field]) return null

    const isValid = this.emailValidator.isValid(input[this.field])
    return isValid ? null : new InvalidFieldError(this.field)
  }
}
