import 'dotenv/config'

import { dbManager } from './init'
import { graphQLCall, queryImport } from './_utils'
import { administrations } from './__mocks__/administrations'
import {
  titreWithActiviteGrp,
  titrePublicLecture,
  titrePublicLectureFalse,
  titreEtapesPubliques,
  titreDemarchesPubliques,
  titreActivites
} from './__mocks__/titres'
import { titreCreate } from '../src/database/queries/titres'

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

describe('titre', () => {
  const titreQuery = queryImport('titre')

  test('peut voir un titre qui est en "lecture publique" (utilisateur anonyme)', async () => {
    await titreCreate(titrePublicLecture, {}, 'super')
    const res = await graphQLCall(titreQuery, { id: 'titre-id' })

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({
      titre: { id: 'titre-id' }
    })
  })

  test('ne peut pas voir un titre qui n\'est pas en "lecture publique" (utilisateur anonyme)', async () => {
    await titreCreate(titrePublicLectureFalse, {}, 'super')
    const res = await graphQLCall(titreQuery, { id: 'titre-id' })

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({ titre: null })
  })

  test('ne peut pas voir que les démarches qui sont en "lecture publique" (utilisateur anonyme)', async () => {
    await titreCreate(titreDemarchesPubliques, {}, 'super')
    const res = await graphQLCall(titreQuery, { id: 'titre-id' })

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({
      titre: {
        id: 'titre-id',
        demarches: [{ id: 'titre-id-demarche-oct' }]
      }
    })

    expect(res.body.data.titre.demarches.length).toEqual(1)
  })

  test('ne peut pas voir les activités (utilisateur anonyme)', async () => {
    await titreCreate(titreActivites, {}, 'super')
    const res = await graphQLCall(titreQuery, { id: 'titre-id' })

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({
      titre: {
        id: 'titre-id'
      }
    })

    expect(res.body.data.titre.activites.length).toEqual(0)
  })

  test('ne peut voir que les étapes qui sont en "lecture publique" (utilisateur anonyme)', async () => {
    await titreCreate(titreEtapesPubliques, {}, 'super')
    const res = await graphQLCall(titreQuery, { id: 'titre-id' })

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({
      titre: {
        id: 'titre-id',
        demarches: [
          {
            id: 'titre-id-demarche-id',
            etapes: [{ id: 'titre-id-demarche-id-dpu' }]
          }
        ]
      }
    })
    expect(res.body.data.titre.demarches[0].etapes.length).toEqual(1)
  })

  test('ne peut pas voir certaines étapes (utilisateur DGTM)', async () => {
    await titreCreate(titreEtapesPubliques, {}, 'super')
    const res = await graphQLCall(
      titreQuery,
      { id: 'titre-id' },
      'admin',
      administrations.dgtmGuyane
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({
      titre: {
        id: 'titre-id',
        demarches: [
          {
            id: 'titre-id-demarche-id',
            etapes: [
              { id: 'titre-id-demarche-id-aof' },
              { id: 'titre-id-demarche-id-edm' },
              { id: 'titre-id-demarche-id-ede' },
              { id: 'titre-id-demarche-id-pfd' },
              { id: 'titre-id-demarche-id-pfc' },
              { id: 'titre-id-demarche-id-vfd' },
              { id: 'titre-id-demarche-id-vfc' },
              { id: 'titre-id-demarche-id-dpu' }
            ]
          }
        ]
      }
    })
    expect(res.body.data.titre.demarches[0].etapes.length).toEqual(8)
  })

  test('ne peut pas voir certaines étapes (utilisateur ONF)', async () => {
    await titreCreate(titreEtapesPubliques, {}, 'super')
    const res = await graphQLCall(
      titreQuery,
      { id: 'titre-id' },
      'admin',
      administrations.onf
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.titre.demarches[0].etapes.length).toEqual(9)
    expect(res.body.data).toMatchObject({
      titre: {
        id: 'titre-id',
        demarches: [
          {
            id: 'titre-id-demarche-id',
            etapes: [
              { id: 'titre-id-demarche-id-aof' },
              { id: 'titre-id-demarche-id-eof' },
              { id: 'titre-id-demarche-id-edm' },
              { id: 'titre-id-demarche-id-ede' },
              { id: 'titre-id-demarche-id-pfd' },
              { id: 'titre-id-demarche-id-pfc' },
              { id: 'titre-id-demarche-id-vfd' },
              { id: 'titre-id-demarche-id-vfc' },
              { id: 'titre-id-demarche-id-dpu' }
            ]
          }
        ]
      }
    })
  })

  test('peut modifier les activités GRP (utilisateur DEAL Guyane)', async () => {
    await titreCreate(titreWithActiviteGrp, {}, 'super')
    const res = await graphQLCall(
      titreQuery,
      { id: 'titre-id' },
      'admin',
      administrations.dgtmGuyane
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({
      titre: { activites: [{ modification: true }] }
    })
  })

  test('ne peut pas voir les activités GRP (utilisateur CACEM)', async () => {
    await titreCreate(titreWithActiviteGrp, {}, 'super')
    const res = await graphQLCall(
      titreQuery,
      { id: 'titre-id' },
      'admin',
      administrations.cacem
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({
      titre: { activites: [] }
    })
  })
})

describe('titreCreer', () => {
  const titreCreerQuery = queryImport('titre-creer')

  test('ne peut pas créer un titre (utilisateur anonyme)', async () => {
    const res = await graphQLCall(titreCreerQuery, {
      titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' }
    })

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test("ne peut pas créer un titre (un utilisateur 'entreprise')", async () => {
    const res = await graphQLCall(
      titreCreerQuery,
      { titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' } },
      'entreprise'
    )

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test("crée un titre (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      titreCreerQuery,
      { titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' } },
      'super'
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: { titreCreer: { id: 'm-ar-titre-0000', nom: 'titre' } }
    })
  })

  test("ne peut pas créer un titre AXM (un utilisateur 'admin' PTMG)", async () => {
    const res = await graphQLCall(
      titreCreerQuery,
      { titre: { nom: 'titre', typeId: 'axm', domaineId: 'm' } },
      'admin',
      administrations.ptmg
    )

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour créer ce type de titre/
    )
  })

  test("ne peut pas créer un titre ARM (un utilisateur 'admin' Déal Guyane)", async () => {
    const res = await graphQLCall(
      titreCreerQuery,
      { titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' } },
      'admin',
      administrations.dgtmGuyane
    )

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour créer ce type de titre/
    )
  })

  test("crée un titre ARM (un utilisateur 'admin' PTMG)", async () => {
    const res = await graphQLCall(
      titreCreerQuery,
      { titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' } },
      'admin',
      administrations.ptmg
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body).toMatchObject({
      data: { titreCreer: { id: 'm-ar-titre-0000', nom: 'titre' } }
    })
  })
})

describe('titreModifier', () => {
  const titreModifierQuery = queryImport('titre-modifier')

  const id = 'm-ar-mon-titre-0000'

  beforeEach(async () => {
    await titreCreate(
      {
        id,
        nom: 'mon titre',
        domaineId: 'm',
        typeId: 'arm',
        administrationsGestionnaires: [
          administrations.ptmg,
          administrations.dgtmGuyane
        ]
      },
      {},
      'super'
    )
  })

  test('ne peut pas modifier un titre (utilisateur anonyme)', async () => {
    const res = await graphQLCall(titreModifierQuery, {
      titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
    })

    expect(res.body.errors[0].message).toMatch(/le titre n'existe pas/)
  })

  test("ne peut pas modifier un titre (un utilisateur 'entreprise')", async () => {
    const res = await graphQLCall(
      titreModifierQuery,
      {
        titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
      },
      'entreprise'
    )

    expect(res.body.errors[0].message).toMatch(/le titre n'existe pas/)
  })

  test("modifie un titre (un utilisateur 'super')", async () => {
    const res = await graphQLCall(
      titreModifierQuery,
      {
        titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
      },
      'super'
    )

    expect(res.body).toMatchObject({
      data: {
        titreModifier: {
          id: 'm-ar-mon-titre-modifie-0000',
          nom: 'mon titre modifié'
        }
      }
    })
  })

  test("modifie un titre ARM (un utilisateur 'admin' PTMG)", async () => {
    const res = await graphQLCall(
      titreModifierQuery,
      {
        titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
      },
      'admin',
      administrations.ptmg
    )

    expect(res.body).toMatchObject({
      data: {
        titreModifier: {
          id: 'm-ar-mon-titre-modifie-0000',
          nom: 'mon titre modifié'
        }
      }
    })
  })

  test("ne peut pas modifier un titre ARM échu (un utilisateur 'admin' PTMG)", async () => {
    await titreCreate(
      {
        id: 'titre-arm-echu',
        nom: 'mon titre échu',
        domaineId: 'm',
        typeId: 'arm',
        statutId: 'ech',
        administrationsGestionnaires: [
          administrations.ptmg,
          administrations.dgtmGuyane
        ]
      },
      {},
      'super'
    )

    const res = await graphQLCall(
      titreModifierQuery,
      {
        titre: {
          id: 'titre-arm-echu',
          nom: 'mon titre échu modifié',
          typeId: 'arm',
          domaineId: 'm'
        }
      },
      'admin',
      administrations.ptmg
    )

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour modifier ce type de titre/
    )
  })

  test("ne peut pas modifier un titre ARM (un utilisateur 'admin' DGTM)", async () => {
    const res = await graphQLCall(
      titreModifierQuery,
      {
        titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
      },
      'admin',
      administrations.dgtmGuyane
    )

    expect(res.body.errors[0].message).toMatch(
      /droits insuffisants pour modifier ce type de titre/
    )
  })
})

describe('titreSupprimer', () => {
  const titreSupprimerQuery = queryImport('titre-supprimer')

  const id = 'titre-arm'

  beforeEach(async () => {
    await titreCreate(
      { id, nom: 'mon titre', domaineId: 'm', typeId: 'arm' },
      {},
      'super'
    )
  })

  test('ne peut pas supprimer un titre (utilisateur anonyme)', async () => {
    const res = await graphQLCall(titreSupprimerQuery, { id })
    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  test('peut supprimer un titre (utilisateur super)', async () => {
    const res = await graphQLCall(titreSupprimerQuery, { id }, 'super')

    expect(res.body).toMatchObject({ data: { titreSupprimer: { id } } })
  })

  test('ne peut pas supprimer un titre inexistant (utilisateur super)', async () => {
    const res = await graphQLCall(titreSupprimerQuery, { id: 'toto' }, 'super')

    expect(res.body.errors[0].message).toMatch(/aucun titre avec cet id/)
  })
})
// Modification des titres

// describe('titreModifier', () => {
//   const titreModifierQuery = queryImport('titre-modifier')

//   const id = 'titre-arm-0000'

//   beforeEach(async () => {
//     await titreCreate(
//       {
//         id,
//         nom: 'mon titre',
//         domaineId: 'm',
//         typeId: 'arm',
//         administrationsGestionnaires: [
//           administrations.ptmg,
//           administrations.dgtmGuyane
//         ]
//       },
//       {},
//       'super'
//     )
//   })

//   // utilisateur anonyme

//   test('ne peut pas modifier un titre (utilisateur anonyme)', async () => {
//     const res = await graphQLCall(titreModifierQuery, {
//       titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
//     })

//     expect(res.body.errors[0].message).toMatch(/le titre n'existe pas/)
//   })

//   // entreprise

//   test("ne peut pas modifier un titre (un utilisateur 'entreprise')", async () => {
//     const res = await graphQLCall(
//       titreModifierQuery,
//       {
//         titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
//       },
//       'entreprise'
//     )

//     expect(res.body.errors[0].message).toMatch(/le titre n'existe pas/)
//   })

//   // super admin

//   test("modifie un titre (un utilisateur 'super')", async () => {
//     const res = await graphQLCall(
//       titreModifierQuery,
//       {
//         titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
//       },
//       'super'
//     )

//     expect(res.body).toMatchObject({
//       data: {
//         titreModifier: {
//           id: 'm-ar-mon-titre-modifie-0000',
//           nom: 'mon titre modifié'
//         }
//       }
//     })
//   })

//   // admin PTMG

//   test("modifie un titre ARM (un utilisateur 'admin' PTMG)", async () => {
//     const res = await graphQLCall(
//       titreModifierQuery,
//       {
//         titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
//       },
//       'admin',
//       administrations.ptmg
//     )

//     expect(res.body).toMatchObject({
//       data: {
//         titreModifier: {
//           id: 'm-ar-mon-titre-modifie-0000',
//           nom: 'mon titre modifié'
//         }
//       }
//     })
//   })

//   test("ne peut pas modifier un titre ARM échu (un utilisateur 'admin' PTMG)", async () => {
//     await titreCreate(
//       {
//         id: 'titre-arm-echu',
//         nom: 'mon titre échu',
//         domaineId: 'm',
//         typeId: 'arm',
//         statutId: 'ech',
//         administrationsGestionnaires: [
//           administrations.ptmg,
//           administrations.dgtmGuyane
//         ]
//       },
//       {},
//       'super'
//     )

//     const res = await graphQLCall(
//       titreModifierQuery,
//       {
//         titre: {
//           id: 'titre-arm-echu',
//           nom: 'mon titre échu modifié',
//           typeId: 'arm',
//           domaineId: 'm'
//         }
//       },
//       'admin',
//       administrations.ptmg
//     )

//     expect(res.body.errors[0].message).toMatch(
//       /droits insuffisants pour modifier ce type de titre/
//     )
//   })

//   test("ne peut pas modifier un titre ARM (un utilisateur 'admin' DGTM)", async () => {
//     const res = await graphQLCall(
//       titreModifierQuery,
//       {
//         titre: { id, nom: 'mon titre modifié', typeId: 'arm', domaineId: 'm' }
//       },
//       'admin',
//       administrations.dgtmGuyane
//     )

//     expect(res.body.errors[0].message).toMatch(
//       /droits insuffisants pour modifier ce type de titre/
//     )
//   })
// })

// // Suppression des titres

// describe('titreSupprimer', () => {
//   const titreSupprimerQuery = queryImport('titre-supprimer')

//   const id = 'titre-arm'

//   beforeEach(async () => {
//     await titreCreate(
//       { id, nom: 'mon titre', domaineId: 'm', typeId: 'arm' },
//       {},
//       'super'
//     )
//   })

//   // utilisateur anonyme

//   test('ne peut pas supprimer un titre (utilisateur anonyme)', async () => {
//     const res = await graphQLCall(titreSupprimerQuery, { id })
//     expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
//   })

//   // super admin

//   test('peut supprimer un titre (utilisateur super)', async () => {
//     const res = await graphQLCall(titreSupprimerQuery, { id }, 'super')

//     expect(res.body).toMatchObject({ data: { titreSupprimer: { id } } })
//   })

//   test('ne peut pas supprimer un titre inexistant (utilisateur super)', async () => {
//     const res = await graphQLCall(titreSupprimerQuery, { id: 'toto' }, 'super')

//     expect(res.body.errors[0].message).toMatch(/aucun titre avec cet id/)
//   })
// })

// Suppression

// test('ne peut pas supprimer un titre (utilisateur anonyme)', async () => {
//   const res = await graphQLCall(titreSupprimerQuery, { id })
//   expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
// })

// test('peut supprimer un titre (utilisateur super)', async () => {
//   const res = await graphQLCall(titreSupprimerQuery, { id }, 'super')

//   expect(res.body).toMatchObject({ data: { titreSupprimer: { id } } })
// })

// test('ne peut pas supprimer un titre inexistant (utilisateur super)', async () => {
//   const res = await graphQLCall(titreSupprimerQuery, { id: 'toto' }, 'super')

//   expect(res.body.errors[0].message).toMatch(/aucun titre avec cet id/)
// })
