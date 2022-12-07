import { ValidationBuilder, ValidationComposite } from '@/validation/validators'
import { makeSignUpValidation } from '@/main/factories/pages/signup'

describe('LoginValidationFactory', () => {
  it('Should make ValidationComposite with correct validations', () => {
    const composite = makeSignUpValidation()
    expect(composite).toEqual(ValidationComposite.build([
      ...ValidationBuilder.field('name').required().minLength(5).build(),
      ...ValidationBuilder.field('email').required().email().build(),
      ...ValidationBuilder.field('password').required().minLength(6).build(),
      ...ValidationBuilder.field('passwordConfirmation').required().sameAs('password').build()
    ]))
  })
})
