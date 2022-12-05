export class EmailInUseError extends Error {
  constructor () {
    super('An account with this email already exists')
    this.name = 'EmailInUseError'
  }
}
