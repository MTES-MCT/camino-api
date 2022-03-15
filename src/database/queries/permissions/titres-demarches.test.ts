import { dbManager } from '../../../../tests/db-manager'

import Titres from '../../models/titres'
import { idGenerate } from '../../models/_format/id-create'
import { userSuper } from '../../user-super'
import TitresDemarches from '../../models/titres-demarches'
import {
  titreDemarcheSuppressionSelectQuery,
  titresDemarchesQueryModify
} from './titres-demarches'
import { IPermissionId } from '../../../types'
import TitresEtapes from '../../models/titres-etapes'

console.info = jest.fn()
console.error = jest.fn()

const knex = dbManager.getKnex()

beforeAll(async () => {
  await dbManager.populateDb(knex)
})

afterAll(async () => {
  await dbManager.truncateDb(knex)
  await dbManager.closeKnex(knex)
})

describe('titresDemarchesQueryModify', () => {
  describe('titreDemarcheSuppressionSelectQuery', () => {
    test.each`
      permissionId    | suppression
      ${'super'}      | ${true}
      ${'admin'}      | ${true}
      ${'editeur'}    | ${true}
      ${'lecteur'}    | ${false}
      ${'entreprise'} | ${false}
      ${'default'}    | ${false}
      ${undefined}    | ${false}
    `(
      'un utilisateur $permissionId peut supprimer une démarche qui n’a pas d’étape',
      async ({
        permissionId,
        suppression
      }: {
        permissionId: IPermissionId | undefined
        suppression: boolean
      }) => {
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
        await TitresDemarches.query().insert([
          {
            id: titreDemarcheId,
            typeId: 'oct',
            statutId: 'eco',
            titreId,
            archive: false
          }
        ])
        const q = TitresDemarches.query()
        q.select(
          titreDemarcheSuppressionSelectQuery(
            'titresDemarches',
            permissionId
          ).as('suppression')
        )
        const titreDemarche = await q.findById(titreDemarcheId)

        expect(titreDemarche).toBeTruthy()
        expect(titreDemarche!.suppression).toBe(suppression)
      }
    )

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
      'un utilisateur $permissionId peut supprimer une démarche qui a au moins une étape',
      async ({
        permissionId,
        suppression
      }: {
        permissionId: IPermissionId | undefined
        suppression: boolean
      }) => {
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
        await TitresDemarches.query().insert([
          {
            id: titreDemarcheId,
            typeId: 'oct',
            statutId: 'eco',
            titreId,
            archive: false
          }
        ])

        await TitresEtapes.query().insert({
          titreDemarcheId,
          date: '2020-12-23',
          typeId: 'mfr',
          statutId: 'fai'
        })

        const q = TitresDemarches.query()
        q.select(
          titreDemarcheSuppressionSelectQuery(
            'titresDemarches',
            permissionId
          ).as('suppression')
        )

        const titreDemarche = await q.findById(titreDemarcheId)

        expect(titreDemarche).toBeTruthy()
        expect(titreDemarche!.suppression).toBe(suppression)
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
      const q = TitresDemarches.query().whereIn('titresDemarches.id', [
        titreDemarcheId,
        archivedTitreDemarcheId
      ])
      titresDemarchesQueryModify(q, userSuper)

      const titresDemarches = await q

      expect(titresDemarches).toHaveLength(1)
      expect(titresDemarches[0].id).toBe(titreDemarcheId)
    })
  })
})
