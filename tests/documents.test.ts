import { graphQLCall, queryImport } from './_utils/index'
import { ITitreEtapeJustificatif } from '../src/types'
import { documentCreate, documentGet } from '../src/database/queries/documents'
import { entrepriseUpsert } from '../src/database/queries/entreprises'
import { titreCreate } from '../src/database/queries/titres'
import {
  titreEtapeCreate,
  titresEtapesJustificatifsUpsert
} from '../src/database/queries/titres-etapes'
import { userSuper } from '../src/database/user-super'
import { dbManager } from './db-manager'
import { titreDemarcheCreate } from '../src/database/queries/titres-demarches'

console.info = jest.fn()
console.error = jest.fn()
const knex = dbManager.getKnex()
beforeEach(async () => {
  await dbManager.populateDb(knex)
})

afterEach(async () => {
  await dbManager.truncateDb(knex)
})

afterAll(async () => {
  await dbManager.closeKnex(knex)
})

describe('documentSupprimer', () => {
  const documentSupprimerQuery = queryImport('documents-supprimer')

  test('ne peut pas supprimer un document (utilisateur anonyme)', async () => {
    const res = await graphQLCall(
      documentSupprimerQuery,
      { id: 'toto' },
      undefined
    )

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

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

  test('ne peut pas supprimer un document d’entreprise lié à une étape (utilisateur super)', async () => {
    const entrepriseId = 'entreprise-id'
    await entrepriseUpsert({ id: entrepriseId, nom: entrepriseId })

    const titre = await titreCreate(
      {
        nom: '',
        typeId: 'arm',
        propsTitreEtapesIds: {},
        domaineId: 'm'
      },
      {}
    )
    const titreDemarche = await titreDemarcheCreate({
      titreId: titre.id,
      typeId: 'oct'
    })

    const titreEtape = await titreEtapeCreate(
      {
        typeId: 'mfr',
        statutId: 'fai',
        titreDemarcheId: titreDemarche.id,
        date: ''
      },
      userSuper,
      titre.id
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
        titreEtapeId: titreEtape.id
      } as ITitreEtapeJustificatif
    ])

    const res = await graphQLCall(
      documentSupprimerQuery,
      { id: documentId },
      'super'
    )

    expect(res.body.errors[0].message).toBe(
      `impossible de supprimer ce document lié à l’étape ${titreEtape.id}`
    )
  })

  test('peut supprimer un document d’étape (utilisateur super)', async () => {
    const entrepriseId = 'entreprise-id'
    await entrepriseUpsert({ id: entrepriseId, nom: entrepriseId })

    const titre = await titreCreate(
      {
        nom: '',
        typeId: 'arm',
        propsTitreEtapesIds: {},
        domaineId: 'm'
      },
      {}
    )

    const titreDemarche = await titreDemarcheCreate({
      titreId: titre.id,
      typeId: 'oct'
    })

    const titreEtape = await titreEtapeCreate(
      {
        typeId: 'mfr',
        statutId: 'aco',
        titreDemarcheId: titreDemarche.id,
        date: ''
      },
      userSuper,
      titre.id
    )

    const documentId = 'document-id'
    await documentCreate({
      id: documentId,
      typeId: 'fac',
      date: '',
      entrepriseId,
      titreEtapeId: titreEtape.id
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
