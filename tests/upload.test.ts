import { restUploadCall } from './_utils'
import { dbManager } from './db-manager'

jest.mock('tus-node-server')

console.info = jest.fn()

describe('téléversement de fichier par rest (tus)', () => {
  beforeAll(async () => {
    await dbManager.populateDb()
  })

  afterAll(async () => {
    await dbManager.truncateDb()
    await dbManager.closeKnex()
  })

  describe('permission de téléverser', () => {
    test.each`
      permission      | code
      ${'admin'}      | ${200}
      ${'super'}      | ${200}
      ${'editeur'}    | ${200}
      ${'lecteur'}    | ${200}
      ${'entreprise'} | ${200}
      ${'defaut'}     | ${403}
    `(
      'retourne le code $code pour un utilisateur "$permission"',
      async ({ permission, code }) => {
        const res = await restUploadCall(permission)
        expect(res.statusCode).toBe(code)
      }
    )
  })
})
