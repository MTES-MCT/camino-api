import 'dotenv/config'

import { dbManager } from './init'
import { graphQLCall, queryImport } from './_utils'
import { administrations } from './__mocks__/administrations'
import {
  titresStatuts,
  restrictionsVisibiliteSet,
  restrictionsModificationSet,
  onfArmEtapesRestrictions,
  onfAxmEditionRestriction,
  onfAxmEtapesRestrictions,
  onfPerEtapesRestrictions,
  titreOnfArm,
  titreOnfAxm,
  titreOnfPrm
  // titreWithActiviteGrp,
  titrePublicLecture,
  titrePublicLectureFalse,
  titreEtapesPubliques,
  titreDemarchesPubliques,
  titreActivites,
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

// ==================================== Visibilité des titres ===================================
describe('titre', () => {
  const titreQuery = queryImport('titre')

  // ===================
  // utilisateur anonyme
  // ===================

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

  test('ne peut voir que les démarches qui sont en "lecture publique" (utilisateur anonyme)', async () => {
    await titreCreate(titreDemarchesPubliques, {}, 'super')
    const res = await graphQLCall(titreQuery, { id: 'titre-id' })

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.titre.demarches.length).toEqual(1)
    expect(res.body.data).toMatchObject({
      titre: {
        id: 'titre-id',
        demarches: [{ id: 'titre-id-demarche-oct' }]
      }
    })
  })

  test('ne peut pas voir les activités (utilisateur anonyme)', async () => {
    await titreCreate(titreActivites, {}, 'super')
    const res = await graphQLCall(titreQuery, { id: 'titre-id' })

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.titre.activites.length).toEqual(0)
    expect(res.body.data).toMatchObject({
      titre: {
        id: 'titre-id'
      }
    })
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

  // =========
  // admin ONF
  // =========

  // matrice des permissions/restrictions
  //
  // Administration : ope-onf-973-01
  // titreType (ARM) |T|D|E|
  //                V|O|O|X|
  //                C|O|O|X|
  //                M|O|O|X| <- restriction 1 : titresStatuts
  //                      ^
  //                      |
  //                      restriction 2 : etapesTypes

  // ONF gestionnaire d'ARM sans restriction d'édition sur les titres et démarches
  // todo : création ?
  test('peut voir, et modifier des titres arm, et leurs démarches dont elle est gestionnaire (admin ONF)', async () => {
    await titreCreate(titreOnfArm, {}, 'super')
    const res = await graphQLCall(
      titreQuery,
      { id: 'titre-id' },
      'admin',
      administrations.onf
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({
      titre: {
        id: 'titre-id',
        modification: true,
        // todo ? --> creation: true
        demarches: [
          {
            id: 'titre-id-demarche-id',
            modification: true
          }
        ]
      }
    })
  })

  // restriction de visibilité
  const onfArmEtapesVisibilite = restrictionsVisibiliteSet(
    onfArmEtapesRestrictions
  )

  test.each(onfArmEtapesVisibilite)(
    "%s voir l'étape '%s'(%s) sur un titre arm (admin ONF)",
    async (visibilite, etapeNom, etapeId, etape, graphQLResponse) => {
      titreOnfArm.demarches[0].etapes = etape
      await titreCreate(titreOnfArm, {}, 'super')
      const res = await graphQLCall(
        titreQuery,
        { id: 'titre-id' },
        'admin',
        administrations.onf
      )

      expect(res.body.errors).toBeUndefined()
      expect(res.body.data).toMatchObject({
        titre: {
          id: 'titre-id',
          demarches: [
            {
              id: 'titre-id-demarche-id',
              etapes: graphQLResponse
            }
          ]
        }
      })
    }
  )

  // restriction de modification
  const onfArmEtapesModification = restrictionsModificationSet(
    onfArmEtapesRestrictions
  )

  test.each(onfArmEtapesModification)(
    "%s modifier l'étape '%s'(%s) sur un titre arm (admin ONF)",
    async (modification, etapeNom, etapeId, etape, graphQLResponse) => {
      titreOnfArm.demarches[0].etapes = etape
      await titreCreate(titreOnfArm, {}, 'super')
      const res = await graphQLCall(
        titreQuery,
        { id: 'titre-id' },
        'admin',
        administrations.onf
      )

      expect(res.body.errors).toBeUndefined()
      expect(res.body.data).toMatchObject({
        titre: {
          id: 'titre-id',
          demarches: [
            {
              id: 'titre-id-demarche-id',
              etapes: graphQLResponse
            }
          ]
        }
      })
    }
  )

  // matrice des permissions/restrictions
  //
  // Administration : ope-onf-973-01
  // titreType (AXM) |T|D|E|
  //                V|O|O|X|
  //                C|O|O|X|
  //                M|X|X|X| <- restriction 1 : titresStatuts
  //                      ^
  //                      |
  //                      restriction 2 : etapesTypes

  // ONF gestionnaire d'AXM avec restrictions d'édition sur les titres et démarches sur les stauts
  // dmc, ech, val

  // todo : création ?
  test('peut voir des titres axm, et leurs démarches dont elle est gestionnaire (admin ONF)', async () => {
    await titreCreate(titreOnfAxm, {}, 'super')
    const res = await graphQLCall(
      titreQuery,
      { id: 'titre-id' },
      'admin',
      administrations.onf
    )

    expect(res.body.errors).toBeUndefined()
    expect(res.body.data).toMatchObject({
      titre: {
        id: 'titre-id',
        // todo ? --> creation: true,
        demarches: [
          {
            id: 'titre-id-demarche-id'
          }
        ]
      }
    })
  })

  // ONF gestionnaire d'AXM avec restrictions d'édition T,D,E sur titres dont le statut est :dmc, ech, ou val
  const restrictionsAXMstatuts = titresStatuts
    .map(titreStatut => [titreStatut.nom, titreStatut.id])
    .filter(restriction => onfAxmEditionRestriction.includes(restriction[1]))

  test.each(restrictionsAXMstatuts)(
    "ne peut pas créer, et modifier des titres axm avec le statut '%s', leurs démarches, et étapes dont elle est gestionnaire (admin ONF)",
    async (statutNom, statuId) => {
      titreOnfAxm.statutId = statuId
      await titreCreate(titreOnfAxm, {}, 'super')
      const res = await graphQLCall(
        titreQuery,
        { id: 'titre-id' },
        'admin',
        administrations.onf
      )

      expect(res.body.errors).toBeUndefined()
      expect(res.body.data).toMatchObject({
        titre: {
          id: 'titre-id',
          modification: null,
          demarches: [
            {
              id: 'titre-id-demarche-id',
              modification: null
            }
          ]
        }
      })
    }
  )

  const nonRestrictionsAXMstatuts = titresStatuts
    .map(titreStatut => [titreStatut.nom, titreStatut.id])
    .filter(restriction => !onfAxmEditionRestriction.includes(restriction[1]))

  test.each(nonRestrictionsAXMstatuts)(
    "peut voir, créer, et modifier des titres axm avec le statut '%s', leurs démarches, et étapes dont elle est gestionnaire (admin ONF)",
    async (statutNom, statuId) => {
      titreOnfAxm.statutId = statuId
      await titreCreate(titreOnfAxm, {}, 'super')
      const res = await graphQLCall(
        titreQuery,
        { id: 'titre-id' },
        'admin',
        administrations.onf
      )

      expect(res.body.errors).toBeUndefined()
      expect(res.body.data).toMatchObject({
        titre: {
          id: 'titre-id',
          modification: true,
          demarches: [
            {
              id: 'titre-id-demarche-id',
              modification: true
            }
          ]
        }
      })
    }
  )

  // restriction de visibilité
  const onfAxmEtapesVisibilite = restrictionsVisibiliteSet(
    onfAxmEtapesRestrictions
  )

  test.each(onfAxmEtapesVisibilite)(
    "%s voir l'étape '%s'(%s) sur un titre axm (admin ONF)",
    async (visibilite, etapeNom, etapeId, etape, graphQLResponse) => {
      titreOnfAxm.demarches[0].etapes = etape
      await titreCreate(titreOnfAxm, {}, 'super')
      const res = await graphQLCall(
        titreQuery,
        { id: 'titre-id' },
        'admin',
        administrations.onf
      )

      expect(res.body.errors).toBeUndefined()
      expect(res.body.data).toMatchObject({
        titre: {
          id: 'titre-id',
          demarches: [
            {
              id: 'titre-id-demarche-id',
              etapes: graphQLResponse
            }
          ]
        }
      })
    }
  )

  // restriction de modification
  const onfAxmEtapesModification = restrictionsModificationSet(
    onfAxmEtapesRestrictions
  )

  test.each(onfAxmEtapesModification)(
    "%s modifier l'étape '%s'(%s) sur un titre axm (admin ONF)",
    async (modification, etapeNom, etapeId, etape, graphQLResponse) => {
      titreOnfAxm.demarches[0].etapes = etape
      await titreCreate(titreOnfAxm, {}, 'super')
      const res = await graphQLCall(
        titreQuery,
        { id: 'titre-id' },
        'admin',
        administrations.onf
      )

      expect(res.body.errors).toBeUndefined()
      expect(res.body.data).toMatchObject({
        titre: {
          id: 'titre-id',
          demarches: [
            {
              id: 'titre-id-demarche-id',
              etapes: graphQLResponse
            }
          ]
        }
      })
    }
  )

  // PRM
  // ONF peut voir, créer et modifier une 'aof' (Avis de l'Office national des forêts) sur un permis exclusif de recherche

  // restriction de visibilité
  const onfPrmEtapesVisibilite = restrictionsVisibiliteSet(
    onfPerEtapesRestrictions
  )

  test.each(onfPrmEtapesVisibilite)(
    "%s voir l'étape '%s'(%s) sur un titre prm (admin ONF)",
    async (visibilite, etapeNom, etapeId, etape, graphQLResponse) => {
      titreOnfPrm.demarches[0].etapes = etape
      await titreCreate(titreOnfPrm, {}, 'super')
      const res = await graphQLCall(
        titreQuery,
        { id: 'titre-id' },
        'admin',
        administrations.onf
      )

      expect(res.body.errors).toBeUndefined()
      expect(res.body.data).toMatchObject({
        titre: {
          id: 'titre-id',
          demarches: [
            {
              id: 'titre-id-demarche-id',
              etapes: graphQLResponse
            }
          ]
        }
      })
    }
  )

  // restriction de modification
  const onfPrmEtapesModification = restrictionsModificationSet(
    onfPerEtapesRestrictions
  )

  test.each(onfPrmEtapesModification)(
    "%s modifier l'étape '%s'(%s) sur un titre prm (admin ONF)",
    async (modification, etapeNom, etapeId, etape, graphQLResponse) => {
      titreOnfPrm.demarches[0].etapes = etape
      await titreCreate(titreOnfPrm, {}, 'super')
      const res = await graphQLCall(
        titreQuery,
        { id: 'titre-id' },
        'admin',
        administrations.onf
      )

      expect(res.body.errors).toBeUndefined()
      expect(res.body.data).toMatchObject({
        titre: {
          id: 'titre-id',
          demarches: [
            {
              id: 'titre-id-demarche-id',
              etapes: graphQLResponse
            }
          ]
        }
      })
    }
  )

  //   // ==========
  //   // admin DGTM
  //   // ==========

  //   test('ne peut pas voir certaines étapes (utilisateur DGTM)', async () => {
  //     await titreCreate(titreEtapesPubliques, {}, 'super')
  //     const res = await graphQLCall(
  //       titreQuery,
  //       { id: 'titre-id' },
  //       'admin',
  //       administrations.dgtmGuyane
  //     )

  //     expect(res.body.errors).toBeUndefined()
  //     expect(res.body.data).toMatchObject({
  //       titre: {
  //         id: 'titre-id',
  //         demarches: [
  //           {
  //             id: 'titre-id-demarche-id',
  //             etapes: [
  //               { id: 'titre-id-demarche-id-aof' },
  //               { id: 'titre-id-demarche-id-edm' },
  //               { id: 'titre-id-demarche-id-ede' },
  //               { id: 'titre-id-demarche-id-pfd' },
  //               { id: 'titre-id-demarche-id-pfc' },
  //               { id: 'titre-id-demarche-id-vfd' },
  //               { id: 'titre-id-demarche-id-vfc' },
  //               { id: 'titre-id-demarche-id-dpu' }
  //             ]
  //           }
  //         ]
  //       }
  //     })
  //     expect(res.body.data.titre.demarches[0].etapes.length).toEqual(8)
  //   })

  //   // admin DEAL Guyane = DGTM ? (mock: admin gestionnaire = ptmg !)

  //   test('peut modifier les activités GRP (utilisateur DEAL Guyane)', async () => {
  //     await titreCreate(titreWithActiviteGrp, {}, 'super')
  //     const res = await graphQLCall(
  //       titreQuery,
  //       { id: 'titre-id' },
  //       'admin',
  //       administrations.dgtmGuyane
  //     )

  //     expect(res.body.errors).toBeUndefined()
  //     expect(res.body.data).toMatchObject({
  //       titre: { activites: [{ modification: true }] }
  //     })
  //   })

  //   // =====
  //   // CACEM
  //   // =====

  //   test('ne peut pas voir les activités GRP (utilisateur CACEM)', async () => {
  //     await titreCreate(titreWithActiviteGrp, {}, 'super')
  //     const res = await graphQLCall(
  //       titreQuery,
  //       { id: 'titre-id' },
  //       'admin',
  //       administrations.cacem
  //     )

  //     expect(res.body.errors).toBeUndefined()
  //     expect(res.body.data).toMatchObject({
  //       titre: { activites: [] }
  //     })
  //   })
  // })
})

// ==================================== Création des titres ===================================

describe('titreCreer', () => {
  const titreCreerQuery = queryImport('titre-creer')

  // ===================
  // utilisateur anonyme
  // ===================

  test('ne peut pas créer un titre (utilisateur anonyme)', async () => {
    const res = await graphQLCall(titreCreerQuery, {
      titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' }
    })

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  // ==========
  // entreprise
  // ==========

  test("ne peut pas créer un titre (un utilisateur 'entreprise')", async () => {
    const res = await graphQLCall(
      titreCreerQuery,
      { titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' } },
      'entreprise'
    )

    expect(res.body.errors[0].message).toMatch(/droits insuffisants/)
  })

  // ===========
  // super admin
  // ===========

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

  // ==========
  // admin PTMG
  // ==========

//   test("ne peut pas créer un titre AXM (un utilisateur 'admin' PTMG)", async () => {
//     const res = await graphQLCall(
//       titreCreerQuery,
//       { titre: { nom: 'titre', typeId: 'axm', domaineId: 'm' } },
//       'admin',
//       administrations.ptmg
//     )

//     expect(res.body.errors[0].message).toMatch(
//       /droits insuffisants pour créer ce type de titre/
//     )
//   })

//   test("crée un titre ARM (un utilisateur 'admin' PTMG)", async () => {
//     const res = await graphQLCall(
//       titreCreerQuery,
//       { titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' } },
//       'admin',
//       administrations.ptmg
//     )

//     expect(res.body.errors).toBeUndefined()
//     expect(res.body).toMatchObject({
//       data: { titreCreer: { id: 'm-ar-titre-0000', nom: 'titre' } }
//     })
//   })

  // ==========
  // admin DGTM
  // ==========

//   test("ne peut pas créer un titre ARM (un utilisateur 'admin' Déal Guyane)", async () => {
//     const res = await graphQLCall(
//       titreCreerQuery,
//       { titre: { nom: 'titre', typeId: 'arm', domaineId: 'm' } },
//       'admin',
//       administrations.dgtmGuyane
//     )

//     expect(res.body.errors[0].message).toMatch(
//       /droits insuffisants pour créer ce type de titre/
//     )
//   })
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
