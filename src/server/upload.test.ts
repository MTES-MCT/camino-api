import { userTokenGenerate } from '../../tests/_utils'
import { restUpload } from './upload'
import request from 'supertest'

describe('restUpload', () => {
  let userDefaut
  let userPermission

  beforeEach(async () => {
    userDefaut = await userTokenGenerate('defaut')
    userPermission = await userTokenGenerate('lecteur')
  })

  test("retourne un code HTTP 401 si la permission d'utilisateur est 'defaut'", async () => {
    request(restUpload).post('/uploads')
  })
})
