import { HttpPostParams } from '@/data/protocols/http'
import { faker } from '@faker-js/faker'

export const mockPostResquest = (): HttpPostParams<any> => ({
  url: faker.internet.url(),
  body: faker.random.word()
})

export const mockedAxiosPostResult = {
  data: faker.random.word(),
  status: faker.datatype.number()
}
