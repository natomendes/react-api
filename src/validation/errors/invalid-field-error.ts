export class InvalidFieldError extends Error {
  constructor (field: string) {
    super(`${field} is invalid`)
    this.name = 'InvalidFieldError'
  }
}
