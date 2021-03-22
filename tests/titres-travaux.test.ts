import { dbManager } from './init'
import { graphQLCall, queryImport } from './_utils/index'
import { titreCreate } from '../src/database/queries/titres'
import { administrations } from './__mocks__/administrations'

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

describe('travauxCreer', () => {
  const travauxCreerQuery = queryImport('titre-travaux-creer')

  test('ne peut pas créer des travaux (utilisateur anonyme)', async () => {
    await titreCreate(
      {
        id: 'titre-id',
        nom: 'mon titre',
        domaineId: 'm',
        typeId: 'arm',
        propsTitreEtapesIds: {},
        publicLecture: true
      },
      {}
    )

    const res = await graphQLCall(travauxCreerQuery, {
      travaux: { titreId: 'titre-id', typeId: 'aom' }
    })

    expect(res.body.errors[0].message).toBe('droits insuffisants')
  })

  // test('peut créer des travaux (administration locale / éditeur)', async () => {
  //   await titreCreate(
  //     {
  //       id: 'titre-id',
  //       nom: 'mon titre',
  //       domaineId: 'm',
  //       typeId: 'arm',
  //       propsTitreEtapesIds: {},
  //       publicLecture: true,
  //       administrationsLocales: [administrations.ptmg]
  //     },
  //     {}
  //   )

  //   const res = await graphQLCall(
  //     travauxCreerQuery,
  //     { travaux: { titreId: 'titre-id', typeId: 'aom' } },
  //     'editeur',
  //     administrations.ptmg.id
  //   )

  //   expect(res.body.data.travauxCreer).toMatchObject({
  //     id: 'titre-id',
  //     nom: 'mon titre',
  //     travaux: [{ id: 'titre-id-aom99', type: { id: 'aom' } }]
  //   })
  // })
})
