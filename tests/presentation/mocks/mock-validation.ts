import { Validation } from '@/presentation/protocols'

export class ValidationSpy implements Validation {
  errorMessage: string
  fieldName: string
  fieldValue: string
  validate (fieldName: string, fieldValue: string): string {
    this.fieldName = fieldName
    this.fieldValue = fieldValue
    this.errorMessage = ''
    return this.errorMessage
  }
}
