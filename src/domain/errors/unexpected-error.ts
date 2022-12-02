export class UnexpectedError extends Error {
  constructor () {
    super('Sorry, something went wrong :(')
    this.name = 'UnexpectedError'
  }
}
