import { ValidationBuilder, ValidationComposite } from '@/validation/validators'

export const makeSignUpValidation = (): ValidationComposite => {
  return ValidationComposite.build([
    ...ValidationBuilder.field('name').required().minLength(5).build(),
    ...ValidationBuilder.field('email').required().email().build(),
    ...ValidationBuilder.field('password').required().minLength(6).build(),
    ...ValidationBuilder.field('passwordConfirmation').required().sameAs('password').build()
  ])
}
