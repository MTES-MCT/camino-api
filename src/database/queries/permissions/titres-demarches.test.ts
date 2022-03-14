import { dbManager } from '../../../../tests/db-manager'

import Titres from '../../models/titres'
import { idGenerate } from '../../models/_format/id-create'
import { userSuper } from '../../user-super'
import TitresDemarches from '../../models/titres-demarches'
import { titresDemarchesQueryModify } from './titres-demarches'
import { IPermissionId } from '../../../types'
import { titresSuppressionSelectQuery } from './titres'

console.info = jest.fn()
console.error = jest.fn()

beforeAll(async () => {
  await dbManager.populateDb()
})

afterAll(async () => {
  await dbManager.truncateDb()
  await dbManager.closeKnex()
})

describe('titresDemarchesQueryModify', () => {
  describe('titreDemarcheSuppressionSelectQuery', () => {
    test.each`
      permissionId    | suppression
      ${'super'}      | ${true}
      ${'admin'}      | ${false}
      ${'editeur'}    | ${false}
      ${'lecteur'}    | ${false}
      ${'entreprise'} | ${false}
      ${'default'}    | ${false}
      ${undefined}    | ${false}
    `(
      'un utilisateur $permissionId peut supprimer un titre',
      async ({
        permissionId,
        suppression
      }: {
        permissionId: IPermissionId | undefined
        suppression: boolean
      }) => {
        expect(titresSuppressionSelectQuery(permissionId)).toBe(suppression)
      }
    )
  })
  describe('titresDemarchesArchive', () => {
    test('Vérifie si le statut archivé masque la démarche du titre', async () => {
      const titreId = idGenerate()
      await Titres.query().insert([
        {
          id: titreId,
          nom: titreId,
          statutId: 'val',
          domaineId: 'm',
          typeId: 'arm',
          archive: false
        }
      ])

      const titreDemarcheId = idGenerate()
      const archivedTitreDemarcheId = idGenerate()
      await TitresDemarches.query().insert([
        {
          id: titreDemarcheId,
          typeId: 'oct',
          statutId: 'eco',
          titreId,
          archive: false
        },
        {
          id: archivedTitreDemarcheId,
          typeId: 'oct',
          statutId: 'eco',
          titreId,
          archive: true
        }
      ])
      const q = TitresDemarches.query()
      titresDemarchesQueryModify(q, userSuper)

      const titresDemarches = await q

      expect(titresDemarches).toHaveLength(1)
      expect(titresDemarches[0].id).toBe(titreDemarcheId)
    })
  })
})
