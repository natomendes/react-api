export class CompareFieldError extends Error {
  constructor (field: string) {
    super(`${field}s don't match`)
    this.name = 'CompareFieldError'
  }
}
