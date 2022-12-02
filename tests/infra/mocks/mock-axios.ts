import { HttpPostParams } from '@/data/protocols/http'
import faker from 'faker'

export const mockPostResquest = (): HttpPostParams<any> => ({
  url: faker.internet.url(),
  body: faker.random.objectElement()
})

export const mockedAxiosPostResult = {
  data: faker.random.objectElement(),
  status: faker.datatype.number()
}
