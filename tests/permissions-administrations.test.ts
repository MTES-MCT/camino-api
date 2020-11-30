import 'dotenv/config'

import { dbManager } from './init'
import { graphQLCall, queryImport } from './_utils'
import {
  // titresStatuts,
  // administrations,
  administrationGet,
  titreTypeAdministrationGestionnaireGet,
  titreTypeAdministrationAssocieeGet,
  administrationsTitresTypeEtapesTypes,
  restrictionsVisibiliteSet,
  restrictionsModificationSet,
  onfArmEtapesRestrictions,
  onfAxmEditionRestriction,
  onfAxmEtapesRestrictions,
  onfPerEtapesRestrictions,
  titre,
  titreAxm,
  titrePrm
} from './__mocks__/permissions-administrations'
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

// matrice des permissions/restrictions
//
// pour une administration et un type de titre donnés
//   |T|D|E|
//  V| | | |
//  C| | | |
//  M| | | | <- restriction 1 : sur le statut du titre
//        ^
//        |
//        restriction 2 : sur les types d'étape

// Les administrations
const administrations = [
  {
    id: 'ope-onf-973-01',
    type_id: 'ope',
    nom: 'Office national des forêts',
    service: 'Direction territoriale Guyane',
    abreviation: 'Office national des forêts',
    url: 'http://www1.onf.fr/guyane/@@index.html',
    email: 'pole.minier@onf.fr',
    telephone: '+594 (0)5 94 25 53 78',
    adresse1: '541 route de Montabo',
    adresse2: 'Adresse postale\r\n541 route de Montabo\nCS87002',
    code_postal: '97300',
    commune: 'Cayenne'
  }
]

// pour chaque administration
administrations.forEach(administration => {
  // trouver l'objet 'administration'
  // const administration = administrationGet(administrationId)

  titre.administrationsGestionnaires = [administration]

  // 1. tester les gestionnaires
  // trouver les types de titre pour lesquels l'administration est gestionnaire
  const titreTypesAdministrationGestionnaire = ['arm']
  // const titreTypesAdministrationGestionnaire = titreTypeAdministrationGestionnaireGet(
  //   administration.id
  //   )

  titreTypesAdministrationGestionnaire.forEach(titreType => {
    titre.typeId = titreType
    titre.domaineId = titreType.slice(-1)

    // ==================================== Visibilité des titres ===================================
    describe('Vivibilité des titres', () => {
      const titreQuery = queryImport('titre')

      //   |T|D|E|
      //  V|X| | |
      //  C| | | |
      //  M| | | | <- restriction 1 : sur le statut du titre
      //        ^
      //        |
      //        restriction 2 : sur les types d'étape

      test('peut voir un titre arm dont elle est gestionnaire (admin ONF)', async () => {
        await titreCreate(titre, {}, 'super')
        const res = await graphQLCall(
          titreQuery,
          { id: 'titre-id' },
          'admin',
          administration
        )

        expect(res.body.errors).toBeUndefined()
        expect(res.body.data).toMatchObject({
          titre: {
            id: 'titre-id'
          }
        })
      })
    })

    describe('Vivibilité des démarches', () => {
      const titreQuery = queryImport('titre')

      //   |T|D|E|
      //  V| |X| |
      //  C| | | |
      //  M| | | | <- restriction 1 : sur le statut du titre
      //        ^
      //        |
      //        restriction 2 : sur les types d'étape

      test("peut voir les démarches d'un titre dont elle est gestionnaire (admin ONF)", async () => {
        await titreCreate(titre, {}, 'super')
        const res = await graphQLCall(
          titreQuery,
          { id: 'titre-id' },
          'admin',
          administration
        )

        expect(res.body.errors).toBeUndefined()
        expect(res.body.data).toMatchObject({
          titre: {
            id: 'titre-id',
            demarches: [
              {
                id: 'titre-id-demarche-id'
              }
            ]
          }
        })
      })
    })

    describe('Vivibilité des étapes', () => {
      const titreQuery = queryImport('titre')

      //   |T|D|E|
      //  V| | |X|
      //  C| | | |
      //  M| | | | <- restriction 1 : sur le statut du titre
      //        ^
      //        |
      //        restriction 2 : sur les types d'étape

      // Définir onfArmEtapesRestrictions dynamiquement

      // si PAS DE RESTRICTION

      // SINON
      // restriction de visibilité
      // const etapesVisibilite = restrictionsVisibiliteSet(
      //   administrationsTitresTypeEtapesTypes.fliter(attet => attet.administrationId === administration.id && attet.titreTypeId === titreType)
      // )
      const etapesVisibilite = restrictionsVisibiliteSet(
        onfArmEtapesRestrictions
      )

      test.each(etapesVisibilite)(
        "%s voir l'étape '%s'(%s) sur un titre arm (admin ONF)",
        async (visibilite, etapeNom, etapeId, etape, graphQLResponse) => {
          titre.demarches[0].etapes = etape
          await titreCreate(titre, {}, 'super')
          const res = await graphQLCall(
            titreQuery,
            { id: 'titre-id' },
            'admin',
            administration
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
    })

    // vérifier comment fonctionne le paramétrage des créations
    describe('Création des titres', () => {})
    describe('Création des démarches', () => {})
    describe('Création des étapes', () => {})

    describe('Modification des titres', () => {
      const titreQuery = queryImport('titre')

      //   |T|D|E|
      //  V| | | |
      //  C| | | |
      //  M|X| | | <- restriction 1 : sur le statut du titre
      //        ^
      //        |
      //        restriction 2 : sur les types d'étape

      // Définir onfArmEditionRestrictions dynamiquement
      // si PAS DE RESTRICTION
      test('peut modifier un titre arm, dont elle est gestionnaire (admin ONF)', async () => {
        await titreCreate(titre, {}, 'super')
        const res = await graphQLCall(
          titreQuery,
          { id: 'titre-id' },
          'admin',
          administration
        )

        expect(res.body.errors).toBeUndefined()
        expect(res.body.data).toMatchObject({
          titre: {
            id: 'titre-id',
            modification: true
          }
        })
      })

      // SINON

      // const restrictionsAXMstatuts = titresStatuts
      //   .map(titreStatut => [titreStatut.nom, titreStatut.id])
      //   .filter(restriction => onfAxmEditionRestriction.includes(restriction[1]))

      // test.each(restrictionsAXMstatuts)(
      //   "ne peut pas modifier des titres axm avec le statut '%s' (admin ONF)",
      //   async (statutNom, statutId) => {
      //     titreAxm.statutId = statutId
      //     await titreCreate(titreAxm, {}, 'super')
      //     const res = await graphQLCall(
      //       titreQuery,
      //       { id: 'titre-id' },
      //       'admin',
      //       administration
      //     )

      //     expect(res.body.errors).toBeUndefined()
      //     expect(res.body.data).toMatchObject({
      //       titre: {
      //         id: 'titre-id',
      //         modification: null,
      //       }
      //     })
      //   }
      // )
    })

    describe('Modification des démarches', () => {
      const titreQuery = queryImport('titre')

      //   |T|D|E|
      //  V| | | |
      //  C| | | |
      //  M| |X| | <- restriction 1 : sur le statut du titre
      //        ^
      //        |
      //        restriction 2 : sur les types d'étape

      // Définir onfArmEditionRestrictions dynamiquement
      // si PAS DE RESTRICTION
      test("peut modifier les démarches d'un titre arm, dont elle est gestionnaire (admin ONF)", async () => {
        await titreCreate(titre, {}, 'super')
        const res = await graphQLCall(
          titreQuery,
          { id: 'titre-id' },
          'admin',
          administration
        )

        expect(res.body.errors).toBeUndefined()
        expect(res.body.data).toMatchObject({
          titre: {
            id: 'titre-id',
            demarches: [
              {
                id: 'titre-id-demarche-id',
                modification: true
              }
            ]
          }
        })
      })

      // SINON

      // const restrictionsAXMstatuts = titresStatuts
      //   .map(titreStatut => [titreStatut.nom, titreStatut.id])
      //   .filter(restriction => onfAxmEditionRestriction.includes(restriction[1]))

      // test.each(restrictionsAXMstatuts)(
      //   "ne peut pas modifier les démarches d'un titres axm avec le statut '%s' (admin ONF)",
      //   async (statutNom, statutId) => {
      //     titreAxm.statutId = statutId
      //     await titreCreate(titreAxm, {}, 'super')
      //     const res = await graphQLCall(
      //       titreQuery,
      //       { id: 'titre-id' },
      //       'admin',
      //       administration
      //     )

      //     expect(res.body.errors).toBeUndefined()
      //     expect(res.body.data).toMatchObject({
      //       titre: {
      //         id: 'titre-id',
      //         demarches: [
      //           {
      //             id: 'titre-id-demarche-id',
      //             modification: null
      //           }
      //         ]
      //       }
      //     })
      //   }
      // )
    })

    describe('Modification des étapes', () => {
      const titreQuery = queryImport('titre')

      //   |T|D|E|
      //  V| | | |
      //  C| | | |
      //  M| | |X| <- restriction 1 : sur le statut du titre
      //        ^
      //        |
      //        restriction 2 : sur les types d'étape

      // restriction d'édition TDE
      // Définir onfAxmEditionRestriction dynamiquement

      // si restriction d'édition TDE

      // const restrictionsAXMstatuts = titresStatuts
      //   .map(titreStatut => [titreStatut.nom, titreStatut.id])
      //   .filter(restriction => onfAxmEditionRestriction.includes(restriction[1]))

      // test.each(restrictionsAXMstatuts)(
      //   "ne peut pas l'étape '%s'(%s) sur un titre axm avec le statut '%s' (admin ONF)",
      //   async (statutNom, statutId) => {
      //     titreAxm.statutId = statutId
      //     await titreCreate(titreAxm, {}, 'super')
      //     const res = await graphQLCall(
      //       titreQuery,
      //       { id: 'titre-id' },
      //       'admin',
      //       administration
      //     )

      //     expect(res.body.errors).toBeUndefined()
      //     expect(res.body.data).toMatchObject({
      //       titre: {
      //         id: 'titre-id',
      //         demarches: [
      //           {
      //             id: 'titre-id-demarche-id',
      //             modification: null
      // etapes: [
      //   {
      //     id: 'titre-id-demarche-id-xxxx',//etapeType
      //     modification: null
      //   }
      // ]
      //           }
      //         ]
      //       }
      //     })
      //   }
      // )

      // ELSEIF
      // restriction de modification
      // Définir onfArmEtapesModification dynamiquement
      const onfArmEtapesModification = restrictionsModificationSet(
        onfArmEtapesRestrictions
      )

      // si restriction de modification
      test.each(onfArmEtapesModification)(
        "%s modifier l'étape '%s'(%s) sur un titre arm (admin ONF)",
        async (modification, etapeNom, etapeId, etape, graphQLResponse) => {
          titre.demarches[0].etapes = etape
          await titreCreate(titre, {}, 'super')
          const res = await graphQLCall(
            titreQuery,
            { id: 'titre-id' },
            'admin',
            administration
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

      // ELSE
      // test("peut modifier l'étape '%s'(%s) sur un titre arm (admin ONF)", async () => {
      //   await titreCreate(titre, {}, 'super')
      //   const res = await graphQLCall(
      //     titreQuery,
      //     { id: 'titre-id' },
      //     'admin',
      //     administration
      //   )

      //   expect(res.body.errors).toBeUndefined()
      // expect(res.body.data).toMatchObject({
      //   titre: {
      //     id: 'titre-id',
      //     demarches: [
      //       {
      //         id: 'titre-id-demarche-id',
      //         etapes: [
      //           {
      //             id: 'titre-id-demarche-id-xxxx',//etapeType
      //             modification: true
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // })
      // })
    })
  })

  // 2. tester les associés
  // trouver les types de titre pour lesquels l'administration est associée
  // const titreTypesAdministrationAssociee = titreTypeAdministrationAssocieeGet(
  //   administration.id
  // )
})

// describe('AXM', () => {
//   // matrice des permissions/restrictions
//   //
//   // Administration : ope-onf-973-01
//   // titreType (AXM) |T|D|E|
//   //                V|O|O|X|
//   //                C|O|O|X|
//   //                M|X|X|X| <- restriction 1 : titresStatuts
//   //                      ^
//   //                      |
//   //                      restriction 2 : etapesTypes

//   // ONF gestionnaire d'AXM avec restrictions d'édition sur les titres et démarches sur les stauts
//   // dmc, ech, val

//   // todo : création ?
//   const titreQuery = queryImport('titre')

//   titreAxm.domaineId = 'm'
//   titreAxm.typeId = 'axm'
//   titreAxm.administrationsGestionnaires = [administration]

//   test('peut voir des titres axm, et leurs démarches dont elle est gestionnaire (admin ONF)', async () => {
//     await titreCreate(titreAxm, {}, 'super')
//     const res = await graphQLCall(
//       titreQuery,
//       { id: 'titre-id' },
//       'admin',
//       administration
//     )

//     expect(res.body.errors).toBeUndefined()
//     expect(res.body.data).toMatchObject({
//       titre: {
//         id: 'titre-id',
//         // todo ? --> creation: true,
//         demarches: [
//           {
//             id: 'titre-id-demarche-id'
//           }
//         ]
//       }
//     })
//   })

//   // ONF gestionnaire d'AXM avec restrictions d'édition T,D,E sur titres dont le statut est :dmc, ech, ou val
//   const restrictionsAXMstatuts = titresStatuts
//     .map(titreStatut => [titreStatut.nom, titreStatut.id])
//     .filter(restriction => onfAxmEditionRestriction.includes(restriction[1]))

//   test.each(restrictionsAXMstatuts)(
//     "ne peut pas créer, et modifier des titres axm avec le statut '%s', leurs démarches, et étapes dont elle est gestionnaire (admin ONF)",
//     async (statutNom, statutId) => {
//       titreAxm.statutId = statutId
//       await titreCreate(titreAxm, {}, 'super')
//       const res = await graphQLCall(
//         titreQuery,
//         { id: 'titre-id' },
//         'admin',
//         administration
//       )

//       expect(res.body.errors).toBeUndefined()
//       expect(res.body.data).toMatchObject({
//         titre: {
//           id: 'titre-id',
//           modification: null,
//           demarches: [
//             {
//               id: 'titre-id-demarche-id',
//               modification: null
//             }
//           ]
//         }
//       })
//     }
//   )

//   const nonRestrictionsAXMstatuts = titresStatuts
//     .map(titreStatut => [titreStatut.nom, titreStatut.id])
//     .filter(restriction => !onfAxmEditionRestriction.includes(restriction[1]))

//   test.each(nonRestrictionsAXMstatuts)(
//     "peut voir, créer, et modifier des titres axm avec le statut '%s', leurs démarches, et étapes dont elle est gestionnaire (admin ONF)",
//     async (statutNom, statutId) => {
//       titreAxm.statutId = statutId
//       await titreCreate(titreAxm, {}, 'super')
//       const res = await graphQLCall(
//         titreQuery,
//         { id: 'titre-id' },
//         'admin',
//         administration
//       )

//       expect(res.body.errors).toBeUndefined()
//       expect(res.body.data).toMatchObject({
//         titre: {
//           id: 'titre-id',
//           modification: true,
//           demarches: [
//             {
//               id: 'titre-id-demarche-id',
//               modification: true
//             }
//           ]
//         }
//       })
//     }
//   )

//   // restriction de visibilité
//   const onfAxmEtapesVisibilite = restrictionsVisibiliteSet(
//     onfAxmEtapesRestrictions
//   )

//   test.each(onfAxmEtapesVisibilite)(
//     "%s voir l'étape '%s'(%s) sur un titre axm (admin ONF)",
//     async (visibilite, etapeNom, etapeId, etape, graphQLResponse) => {
//       titreAxm.demarches[0].etapes = etape
//       await titreCreate(titreAxm, {}, 'super')
//       const res = await graphQLCall(
//         titreQuery,
//         { id: 'titre-id' },
//         'admin',
//         administration
//       )

//       expect(res.body.errors).toBeUndefined()
//       expect(res.body.data).toMatchObject({
//         titre: {
//           id: 'titre-id',
//           demarches: [
//             {
//               id: 'titre-id-demarche-id',
//               etapes: graphQLResponse
//             }
//           ]
//         }
//       })
//     }
//   )

//   // restriction de modification
//   const onfAxmEtapesModification = restrictionsModificationSet(
//     onfAxmEtapesRestrictions
//   )

//   test.each(onfAxmEtapesModification)(
//     "%s modifier l'étape '%s'(%s) sur un titre axm (admin ONF)",
//     async (modification, etapeNom, etapeId, etape, graphQLResponse) => {
//       titreAxm.demarches[0].etapes = etape
//       await titreCreate(titreAxm, {}, 'super')
//       const res = await graphQLCall(
//         titreQuery,
//         { id: 'titre-id' },
//         'admin',
//         administration
//       )

//       expect(res.body.errors).toBeUndefined()
//       expect(res.body.data).toMatchObject({
//         titre: {
//           id: 'titre-id',
//           demarches: [
//             {
//               id: 'titre-id-demarche-id',
//               etapes: graphQLResponse
//             }
//           ]
//         }
//       })
//     }
//   )
// })

// describe('PRM', () => {
//   // PRM
//   // ONF peut voir, créer et modifier une 'aof' (Avis de l'Office national des forêts) sur un permis exclusif de recherche
//   const titreQuery = queryImport('titre')

//   titrePrm.domaineId = 'm'
//   titrePrm.typeId = 'prm'
//   titrePrm.administrationsGestionnaires = [administration]

//   // restriction de visibilité
//   const onfPrmEtapesVisibilite = restrictionsVisibiliteSet(
//     onfPerEtapesRestrictions
//   )

//   test.each(onfPrmEtapesVisibilite)(
//     "%s voir l'étape '%s'(%s) sur un titre prm (admin ONF)",
//     async (visibilite, etapeNom, etapeId, etape, graphQLResponse) => {
//       titrePrm.demarches[0].etapes = etape
//       await titreCreate(titrePrm, {}, 'super')
//       const res = await graphQLCall(
//         titreQuery,
//         { id: 'titre-id' },
//         'admin',
//         administration
//       )

//       expect(res.body.errors).toBeUndefined()
//       expect(res.body.data).toMatchObject({
//         titre: {
//           id: 'titre-id',
//           demarches: [
//             {
//               id: 'titre-id-demarche-id',
//               etapes: graphQLResponse
//             }
//           ]
//         }
//       })
//     }
//   )

//   // restriction de modification
//   const onfPrmEtapesModification = restrictionsModificationSet(
//     onfPerEtapesRestrictions
//   )

//   test.each(onfPrmEtapesModification)(
//     "%s modifier l'étape '%s'(%s) sur un titre prm (admin ONF)",
//     async (modification, etapeNom, etapeId, etape, graphQLResponse) => {
//       titrePrm.demarches[0].etapes = etape
//       await titreCreate(titrePrm, {}, 'super')
//       const res = await graphQLCall(
//         titreQuery,
//         { id: 'titre-id' },
//         'admin',
//         administration
//       )

//       expect(res.body.errors).toBeUndefined()
//       expect(res.body.data).toMatchObject({
//         titre: {
//           id: 'titre-id',
//           demarches: [
//             {
//               id: 'titre-id-demarche-id',
//               etapes: graphQLResponse
//             }
//           ]
//         }
//       })
//     }
//   )
// })
