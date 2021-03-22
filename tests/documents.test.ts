import { dbManager } from './init'
import { graphQLCall, queryImport } from './_utils/index'
import { IPermissionId, ITitreEtapeJustificatif } from '../src/types'
import { documentCreate, documentGet } from '../src/database/queries/documents'
import { entrepriseUpsert } from '../src/database/queries/entreprises'
import { titreCreate } from '../src/database/queries/titres'
import { titresEtapesJustificatifsUpsert } from '../src/database/queries/titres-etapes'
import { userSuper } from '../src/database/user-super'
import { knex } from '../src/knex'
import EtapesTypesDocumentsTypes from '../src/database/models/etapes-types--documents-types'
import TitresEtapes from '../src/database/models/titres-etapes'
import TitresActivites from '../src/database/models/titres-activites'
import ActivitesTypesDocumentsTypes from '../src/database/models/activites-types--documents-types'
const each = require('jest-each').default

console.info = jest.fn()
console.error = jest.fn()

beforeEach(async () => {
  await dbManager.populateDb()
})

afterEach(async () => {
  await dbManager.truncateDb()
})

afterAll(async () => {
  dbManager.closeKnex()
})

describe('documentSupprimer', () => {
  const documentSupprimerQuery = queryImport('documents-supprimer')

  each([undefined]).test(
    'ne peut pas supprimer un document (utilisateur %s)',
    async (permissionId: IPermissionId) => {
      const res = await graphQLCall(
        documentSupprimerQuery,
        { id: 'toto' },
        permissionId
      )

      expect(res.body.errors[0].message).toBe('droits insuffisants')
    }
  )

  test('ne peut pas supprimer un document inexistant (utilisateur super)', async () => {
    const res = await graphQLCall(
      documentSupprimerQuery,
      { id: 'toto' },
      'super'
    )

    expect(res.body.errors[0].message).toBe('aucun document avec cette id')
  })

  test('peut supprimer un document d’entreprise (utilisateur super)', async () => {
    const entrepriseId = 'entreprise-id'
    await entrepriseUpsert({ id: entrepriseId, nom: entrepriseId })

    const documentId = 'document-id'
    await documentCreate({
      id: documentId,
      typeId: 'fac',
      date: '',
      entrepriseId
    })

    const res = await graphQLCall(
      documentSupprimerQuery,
      { id: documentId },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.documentSupprimer).toBeTruthy()
    expect(await documentGet(documentId, {}, userSuper)).toBeUndefined()
  })

  test.each`
    optionnel    | suppression
    ${true}      | ${true}
    ${false}     | ${false}
    ${undefined} | ${false}
  `(
    'vérifie la possibilité de supprimer un document optionnel ou non d’une étape (utilisateur super)',
    async ({ optionnel, suppression }) => {
      // suppression de la clé étrangère sur la démarche pour ne pas avoir à tout créer
      await TitresEtapes.query().delete()
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
        statutId: 'acc'
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

      const documentRes = await documentGet(documentId, {}, userSuper)

      expect(documentRes.suppression).toBe(suppression)
    }
  )

  test.each`
    optionnel    | suppression
    ${true}      | ${true}
    ${false}     | ${false}
    ${undefined} | ${false}
  `(
    'vérifie la possibilité de supprimer un document optionnel ou non d’une activité (utilisateur super)',
    async ({ optionnel, suppression }) => {
      // suppression de la clé étrangère sur le titre pour ne pas avoir à tout créer
      await TitresActivites.query().delete()
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
        statutId: 'dep',
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

      const documentRes = await documentGet(documentId, {}, userSuper)

      expect(documentRes.suppression).toBe(suppression)
    }
  )

  test('ne peut pas supprimer un document d’entreprise lié à une étape (utilisateur super)', async () => {
    const entrepriseId = 'entreprise-id'
    await entrepriseUpsert({ id: entrepriseId, nom: entrepriseId })

    const titreId = 'titre-id'
    const demarcheId = 'demarche-id'
    const etapeId = 'etape-id'
    await titreCreate(
      {
        domaineId: 'm',
        id: titreId,
        nom: '',
        typeId: 'arm',
        propsTitreEtapesIds: {},
        demarches: [
          {
            id: 'demarche-id',
            titreId,
            typeId: 'oct',
            etapes: [
              {
                id: etapeId,
                typeId: 'mfr',
                statutId: 'fai',
                titreDemarcheId: demarcheId,
                date: ''
              }
            ]
          }
        ]
      },
      {}
    )

    const documentId = 'document-id'
    await documentCreate({
      id: documentId,
      typeId: 'fac',
      date: '',
      entrepriseId
    })

    await titresEtapesJustificatifsUpsert([
      {
        documentId,
        titreEtapeId: etapeId
      } as ITitreEtapeJustificatif
    ])

    const res = await graphQLCall(
      documentSupprimerQuery,
      { id: documentId },
      'super'
    )

    expect(res.body.errors[0].message).toBe(
      `impossible de supprimer ce document lié à l’étape ${etapeId}`
    )
  })

  test('peut supprimer un document d’étape (utilisateur super)', async () => {
    const entrepriseId = 'entreprise-id'
    await entrepriseUpsert({ id: entrepriseId, nom: entrepriseId })

    const titreId = 'titre-id'
    const demarcheId = 'demarche-id'
    const etapeId = 'etape-id'
    await titreCreate(
      {
        domaineId: 'm',
        id: titreId,
        nom: '',
        typeId: 'arm',
        propsTitreEtapesIds: {},
        demarches: [
          {
            id: 'demarche-id',
            titreId,
            typeId: 'oct',
            etapes: [
              {
                id: etapeId,
                typeId: 'mfr',
                statutId: 'fai',
                titreDemarcheId: demarcheId,
                date: ''
              }
            ]
          }
        ]
      },
      {}
    )

    const documentId = 'document-id'
    await documentCreate({
      id: documentId,
      typeId: 'fac',
      date: '',
      entrepriseId,
      titreEtapeId: etapeId
    })

    const res = await graphQLCall(
      documentSupprimerQuery,
      { id: documentId },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.documentSupprimer).toBeTruthy()
    expect(await documentGet(documentId, {}, userSuper)).toBeUndefined()
  })
})
