export class RequiredFieldError extends Error {
  constructor (field: string) {
    super(`${field} is required`)
    this.name = 'RequiredFieldError'
  }
}
