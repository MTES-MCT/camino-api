import { dbManager } from './init'
import { graphQLCall, queryImport } from './_utils/index'
import { IPermissionId, ITitreEtapeJustificatif } from '../src/types'
import { documentCreate, documentGet } from '../src/database/queries/documents'
import { entrepriseUpsert } from '../src/database/queries/entreprises'
import { titreCreate } from '../src/database/queries/titres'
import { titresEtapesJustificatifsUpsert } from '../src/database/queries/titres-etapes'
import { userSuper } from '../src/database/user-super'
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

    expect(res.body.errors[0].message).toBe("le document n'existe pas")
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
      {},
      userSuper
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
      {},
      userSuper
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
