import { restUploadCall } from '../../tests/_utils'
import { dbManager } from '../../tests/db-manager'
import { Request, Response } from 'express'

jest.mock('tus-node-server')
jest.mock('./upload.ts', () => {
  const original = jest.requireActual('./upload.ts')

  return {
    uploadAllowedMiddleware: original.uploadAllowedMiddleware,
    graphqlUpload: original.graphqlUpload,
    restUpload: jest.fn().mockImplementation((req: Request, res: Response) => {
      res.sendStatus(200)
    })
  }
})

console.info = jest.fn()

describe('téléversement de fichier par rest (tus)', () => {
  beforeAll(async () => {
    await dbManager.populateDb()
    jest.mock('fs', () => {
      return {
        ...jest.requireActual('fs').default,
        mkdir: jest.fn()
      }
    })
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
