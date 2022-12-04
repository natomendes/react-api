import { EmailValidatorAdapter } from '@/infra/utils/email-validator-adapter'
import { FieldValidation } from '@/validation/protocols'
import { RequiredFieldValidation, EmailValidation, MinLengthValidation } from '@/validation/validators'

export class ValidationBuilder {
  private constructor (
    private readonly fieldName: string,
    private readonly validations: FieldValidation[]
  ) {}

  static field (fieldName: string): ValidationBuilder {
    return new ValidationBuilder(fieldName, [])
  }

  required (): ValidationBuilder {
    this.validations.push(new RequiredFieldValidation(this.fieldName))
    return this
  }

  email (): ValidationBuilder {
    this.validations.push(new EmailValidation(new EmailValidatorAdapter(), this.fieldName))
    return this
  }

  minLength (minLength: number): ValidationBuilder {
    this.validations.push(new MinLengthValidation(minLength, this.fieldName))
    return this
  }

  build (): FieldValidation[] {
    return this.validations
  }
}
