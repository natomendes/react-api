import { faker } from '@faker-js/faker'
import { LocalSaveAccessToken } from '@/data/usecases'
import { SetStorageSpy } from '@/tests/data/mocks'

describe('LocalSaveAccessToken', () => {
  it('Should call SetStorage with correct value', async () => {
    const setStorageSpy = new SetStorageSpy()
    const sut = new LocalSaveAccessToken(setStorageSpy)
    const accessToken = faker.datatype.uuid()
    await sut.save(accessToken)
    expect(setStorageSpy.key).toBe('accessToken')
    expect(setStorageSpy.value).toBe(accessToken)
  })
})
