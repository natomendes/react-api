import { LocalSaveAccessToken } from '@/data/usecases'
import { makeLocalStorageAdapter } from './local-storage-adapter-factory'

export const makeLocalSaveAccessToken = (): LocalSaveAccessToken => {
  return new LocalSaveAccessToken(makeLocalStorageAdapter())
}
