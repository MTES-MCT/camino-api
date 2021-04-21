import { knex } from '../../../knex'
import { dbManager } from '../../../../tests/init-db-manager'

import { userSuper } from '../../user-super'
import TitresEtapes from '../../models/titres-etapes'
import EtapesTypesDocumentsTypes from '../../models/etapes-types--documents-types'
import ActivitesTypesDocumentsTypes from '../../models/activites-types--documents-types'
import TitresActivites from '../../models/titres-activites'
import Document from '../../models/documents'

import { documentCreate, documentGet } from '../documents'
import { etapeTypeDocumentTypeUsedCheck } from './documents'

console.info = jest.fn()
console.error = jest.fn()

beforeAll(async () => {
  await dbManager.populateDb()
})

afterAll(async () => {
  await dbManager.truncateDb()
  await dbManager.closeKnex()
})

describe('documentSupprimer', () => {
  test.each`
    optionnel    | statutId | suppression
    ${true}      | ${'aco'} | ${true}
    ${false}     | ${'aco'} | ${true}
    ${undefined} | ${'aco'} | ${true}
    ${true}      | ${'fai'} | ${true}
    ${false}     | ${'fai'} | ${false}
    ${undefined} | ${'fai'} | ${false}
  `(
    'vérifie la possibilité de supprimer un document optionnel ou non d’une étape (utilisateur super)',
    async ({ optionnel, statutId, suppression }) => {
      // suppression de la clé étrangère sur la démarche pour ne pas avoir à tout créer
      await TitresEtapes.query().delete()
      await Document.query().delete()
      await EtapesTypesDocumentsTypes.query().delete()
      await knex.schema.alterTable(TitresEtapes.tableName, table => {
        table.dropColumns('titreDemarcheId')
      })

      await knex.schema.alterTable(TitresEtapes.tableName, table => {
        table.string('titreDemarcheId').index().notNullable()
      })

      await TitresEtapes.query().insertGraph({
        id: 'titreEtapeId',
        typeId: 'dpu',
        titreDemarcheId: 'titreDemarcheId',
        date: '',
        statutId
      })

      const documentId = 'document-id'
      await documentCreate({
        id: documentId,
        typeId: 'dec',
        date: '',
        titreEtapeId: 'titreEtapeId'
      })

      await EtapesTypesDocumentsTypes.query().insertGraph({
        etapeTypeId: 'dpu',
        documentTypeId: 'dec',
        optionnel
      })

      const documentRes = await documentGet(
        documentId,
        { fields: {} },
        userSuper
      )

      expect(documentRes.suppression).toBe(suppression)
    }
  )

  test.each`
    optionnel    | statutId | suppression
    ${true}      | ${'enc'} | ${true}
    ${false}     | ${'enc'} | ${true}
    ${undefined} | ${'enc'} | ${true}
    ${true}      | ${'dep'} | ${true}
    ${false}     | ${'dep'} | ${false}
    ${undefined} | ${'dep'} | ${false}
  `(
    'vérifie la possibilité de supprimer un document optionnel ou non d’une activité (utilisateur super)',
    async ({ optionnel, suppression, statutId }) => {
      // suppression de la clé étrangère sur le titre pour ne pas avoir à tout créer
      await TitresActivites.query().delete()
      await Document.query().delete()
      await ActivitesTypesDocumentsTypes.query().delete()
      await knex.schema.alterTable(TitresActivites.tableName, table => {
        table.dropColumns('titreId')
      })

      await knex.schema.alterTable(TitresActivites.tableName, table => {
        table.string('titreId').index().notNullable()
      })

      await TitresActivites.query().insertGraph({
        id: 'titreActiviteId',
        typeId: 'grx',
        titreId: '',
        date: '',
        statutId,
        periodeId: 1,
        annee: 2000
      })

      const documentId = 'document-id'
      await documentCreate({
        id: documentId,
        typeId: 'dec',
        date: '',
        titreActiviteId: 'titreActiviteId'
      })

      await ActivitesTypesDocumentsTypes.query().insertGraph({
        activiteTypeId: 'grx',
        documentTypeId: 'dec',
        optionnel
      })

      const documentRes = await documentGet(
        documentId,
        { fields: {} },
        userSuper
      )

      expect(documentRes.suppression).toBe(suppression)
    }
  )
})

describe('etapeTypeDocumentTypeUsedCheck', () => {
  test('il existe un etapeTypeDocumentType (utilisateur super)', async () => {
    // suppression de la clé étrangère sur la démarche pour ne pas avoir à tout créer
    await TitresEtapes.query().delete()
    await Document.query().delete()
    await knex.schema.alterTable(TitresEtapes.tableName, table => {
      table.dropColumns('titreDemarcheId')
    })

    await knex.schema.alterTable(TitresEtapes.tableName, table => {
      table.string('titreDemarcheId').index().notNullable()
    })

    await TitresEtapes.query().insertGraph({
      id: 'titreEtapeId',
      typeId: 'dpu',
      titreDemarcheId: 'titreDemarcheId',
      date: '',
      statutId: 'aco'
    })

    const documentId = 'document-id'
    await documentCreate({
      id: documentId,
      typeId: 'dec',
      date: '',
      titreEtapeId: 'titreEtapeId'
    })

    const check = await etapeTypeDocumentTypeUsedCheck('dpu', 'dec')

    expect(check).toBe(true)
  })

  test('il n’existe pas un etapeTypeDocumentType (utilisateur super)', async () => {
    // suppression de la clé étrangère sur la démarche pour ne pas avoir à tout créer
    await TitresEtapes.query().delete()
    await Document.query().delete()
    await knex.schema.alterTable(TitresEtapes.tableName, table => {
      table.dropColumns('titreDemarcheId')
    })

    await knex.schema.alterTable(TitresEtapes.tableName, table => {
      table.string('titreDemarcheId').index().notNullable()
    })

    await TitresEtapes.query().insertGraph({
      id: 'titreEtapeId',
      typeId: 'dpu',
      titreDemarcheId: 'titreDemarcheId',
      date: '',
      statutId: 'aco'
    })

    const documentId = 'document-id'
    await documentCreate({
      id: documentId,
      typeId: 'arr',
      date: '',
      titreEtapeId: 'titreEtapeId'
    })

    const check = await etapeTypeDocumentTypeUsedCheck('dpu', 'dec')

    expect(check).toBe(false)
  })
})
