import 'dotenv/config'

import { dbManager } from './init'
import { graphQLCall, queryImport } from './_utils'
import {
  titresStatuts,
  // administrations,
  titreTypeAdministrationGestionnaireGet,
  titreTypeAdministrationAssocieeGet,
  administrationsTitresTypesEtapesTypes,
  administrationsTitresTypesTitresStatuts,
  restrictionsVisibiliteSet,
  restrictionsModificationSet,
  titreTemplate
} from './__mocks__/permissions-administrations'
import { titreCreate } from '../src/database/queries/titres'

console.info = jest.fn()
// console.error = jest.fn()

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
// const administrations = [
//   {
//     "id": "ope-brgm-02",
//     "type_id": "ope",
//     "nom": "BRGM - Projet Zercoa",
//     "service": "BRGM - Equipe projet \"zones favorables à une exploitation et à un réaménagement coordonné de l'or alluvionnaire\"",
//     "abreviation": "BRGM - Projet Zercoa",
//     "url": "https://www.brgm.fr//",
//     "telephone": "02 38 64 34 34",
//     "adresse1": "3 avenue Claude-Guillemin",
//     "adresse2": "BP 36009",
//     "code_postal": "45060",
//     "commune": "Orléans",
//     "cedex": "Cedex 2"
//   }
// ]
// const administrations = [
//   {
//     "id": "min-mtes-dgaln-01",
//     "type_id": "min",
//     "nom": "Ministère de l'Economie et des Finances & Ministère de la Transition écologique et solidaire",
//     "service": "Bureau de la politique des ressources minérales non énergétiques - Direction générale de l'aménagement, du logement et de la nature (DGALN)",
//     "abreviation": "DGALN/DEB/EARM2",
//     "url": "http://www.mineralinfo.fr",
//     "email": "earm2.deb.dgaln@developpement-durable.gouv.fr",
//     "telephone": "+33 (0)1 40 81 21 22",
//     "adresse1": "Tour Séquoia\n1 place Carpeaux\n92800 Puteaux",
//     "adresse2": "Adresse postale\n92055 Paris-La-Défense Cedex",
//     "code_postal": "92800",
//     "commune": "Puteaux",
//     "cedex": "Cedex"
//   }
// ]
// const administrations = [
//     {
//     "id": "dea-guyane-01",
//     "type_id": "dea",
//     "nom": "Direction Générale des Territoires et de la Mer de Guyane",
//     "abreviation": "DGTM - Guyane",
//     "url": "http://www.guyane.developpement-durable.gouv.fr",
//     "telephone": "+594 5 94 39 80 00",
//     "adresse1": "Route du Vieux-Port\n97300 Cayenne",
//     "adresse2": "Adresse postale\nRoute du Vieux-Port\nCS 76003\n97306 Cayenne",
//     "code_postal": "97300",
//     "commune": "Cayenne",
//     "cedex": "Cedex",
//     "region_id": "03"
//   }
// ]
// const administrations = [
//     {
//       "id": "min-mtes-dgec-01",
//       "type_id": "min",
//       "nom": "Ministère de l'Economie et des Finances & Ministère de la Transition écologique et solidaire",
//       "service": "Bureau Ressources énergétiques du sous-sol (2A) - Direction générale de l'énergie et du climat (DGEC)",
//       "abreviation": "DGEC/DE/SD2/2A",
//       "url": "http://www.minergies.fr",
//       "email": "2a.sd2.de.dgec@developpement-durable.gouv.fr",
//       "telephone": "+33 (0)1 40 81 95 63",
//       "adresse1": "Tour Séquoia\n1 place Carpeaux\n92800 Puteaux",
//       "adresse2": "Adresse postale\r\n92055 Paris-La-Défense Cedex",
//       "code_postal": "92800",
//       "commune": "Puteaux",
//       "cedex": "Cedex"
//     }
// ]

const titresTypePermissionsTestRun = (
  administration,
  titreAdministration,
  titreType,
  gestionnaire
) => {
  const titre = Object.assign({}, titreAdministration)
  titre.typeId = titreType
  titre.domaineId = titreType.slice(-1)

  // restriction de visibilité/Création/modification sur les étapes
  const etapesRestrictions = administrationsTitresTypesEtapesTypes.filter(
    attet =>
      attet.administration_id === administration.id &&
      attet.titre_type_id === titreType
  )

  // restriction d'édition TDE
  const editionRestrictions = administrationsTitresTypesTitresStatuts
    .filter(
      attts =>
        attts.administration_id === administration.id &&
        attts.titre_type_id === titreType
    )
    .map(attts => attts.titre_statut_id)

  let restrictionsStatuts
  if (editionRestrictions && editionRestrictions.length) {
    restrictionsStatuts = titresStatuts
      .map(titreStatut => [titreStatut.nom, titreStatut.id])
      .filter(restriction => editionRestrictions.includes(restriction[1]))
  }

  // ==================================== Visibilité des titres ===================================

  if (gestionnaire) {
    describe('Visibilité des titres', () => {
      const titreQuery = queryImport('titre')

      //   |T|D|E|
      //  V|X| | |
      //  C| | | |
      //  M| | | | <- restriction 1 : sur le statut du titre
      //        ^
      //        |
      //        restriction 2 : sur les types d'étape

      test(`peut voir un titre ${titreType} (admin ${
        administration.abreviation
      } = ${
        administration.associee ? 'associée' : 'gestionnaire'
      })`, async () => {
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

    describe('Visibilité des démarches', () => {
      const titreQuery = queryImport('titre')

      //   |T|D|E|
      //  V| |X| |
      //  C| | | |
      //  M| | | | <- restriction 1 : sur le statut du titre
      //        ^
      //        |
      //        restriction 2 : sur les types d'étape

      test(`peut voir les démarches d'un titre ${titreType} (admin ${
        administration.abreviation
      } = ${
        administration.associee ? 'associée' : 'gestionnaire'
      })`, async () => {
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
  }

  describe('Visibilité des étapes', () => {
    const titreQuery = queryImport('titre')

    //   |T|D|E|
    //  V| | |X|
    //  C| | | |
    //  M| | | | <- restriction 1 : sur le statut du titre
    //        ^
    //        |
    //        restriction 2 : sur les types d'étape

    // s'il n'y a pas de restriction de visibilité
    if (!etapesRestrictions || !etapesRestrictions.length) {
      test(`peut voir les étapes d'un titre ${titreType} (admin ${
        administration.abreviation
      } = ${
        administration.associee ? 'associée' : 'gestionnaire'
      })`, async () => {
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
                etapes: [
                  {
                    id: titre.demarches[0].etapes[0].id
                  }
                ]
              }
            ]
          }
        })
      })
    } else {
      // appliquer la restriction
      const etapesVisibilite = restrictionsVisibiliteSet(etapesRestrictions)

      test.each(etapesVisibilite)(
        `%s voir l'étape '%s'(%s) sur un titre ${titreType} (admin ${
          administration.abreviation
        } = ${administration.associee ? 'associée' : 'gestionnaire'})`,
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
    }
  })

  // vérifier comment fonctionne le paramétrage des créations
  if (gestionnaire) {
    describe('Création des titres', () => {})
    describe('Création des démarches', () => {})
  }
  describe('Création des étapes', () => {})

  if (gestionnaire) {
    describe('Modification des titres', () => {
      const titreQuery = queryImport('titre')

      //   |T|D|E|
      //  V| | | |
      //  C| | | |
      //  M|X| | | <- restriction 1 : sur le statut du titre
      //        ^
      //        |
      //        restriction 2 : sur les types d'étape

      // si l'administration est associée
      if (administration.associee) {
        test(`ne peut pas modifier de titre ${titreType} (admin ${administration.abreviation} = associée)`, async () => {
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
              modification: null
            }
          })
        })
      } else {
        // s'il n'y a pas de restriction
        if (!editionRestrictions || !editionRestrictions.length) {
          test(`peut modifier un titre ${titreType} (admin ${
            administration.abreviation
          } = ${
            administration.associee ? 'associée' : 'gestionnaire'
          })`, async () => {
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
        } else {
          // appliquer la restriction
          test.each(restrictionsStatuts)(
            `ne peut pas modifier des titres ${titreType} avec le statut '%s' (admin ${
              administration.abreviation
            } = ${administration.associee ? 'associée' : 'gestionnaire'})`,
            async (statutNom, statutId) => {
              titre.statutId = statutId
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
                  modification: null
                }
              })
            }
          )
        }
      }
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

      // si l'administration est associée
      if (administration.associee) {
        test(`ne peut pas modifier les démarches d'un titre ${titreType} (admin ${administration.abreviation} = associée)`, async () => {
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
                  modification: null
                }
              ]
            }
          })
        })
      } else {
        // s'il n'y a pas de restriction
        if (!editionRestrictions || !editionRestrictions.length) {
          test(`peut modifier les démarches d'un titre ${titreType} (admin ${
            administration.abreviation
          } = ${
            administration.associee ? 'associée' : 'gestionnaire'
          })`, async () => {
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
        } else {
          // appliquer la restriction
          test.each(restrictionsStatuts)(
            `ne peut pas modifier les démarches d'un titre ${titreType} avec le statut '%s' (admin ${
              administration.abreviation
            } = ${administration.associee ? 'associée' : 'gestionnaire'})`,
            async (statutNom, statutId) => {
              titre.statutId = statutId
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
                      modification: null
                    }
                  ]
                }
              })
            }
          )
        }
      }
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

      // si l'administration est associée
      if (administration.associee) {
        test(`ne peut pas modifier les étapes sur un titre ${titreType} (admin ${administration.abreviation} = associée)`, async () => {
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
                  etapes: [
                    {
                      id: titre.demarches[0].etapes[0].id,
                      modification: true
                    }
                  ]
                }
              ]
            }
          })
        })
      } else {
        // s'il y a une restriction d'édition d'étape
        if (editionRestrictions && editionRestrictions.length) {
          test.each(restrictionsStatuts)(
            `ne peut pas modifier d'étape sur un titre ${titreType} avec le statut '%s'(%s) (admin ${
              administration.abreviation
            } = ${administration.associee ? 'associée' : 'gestionnaire'})`,
            async (statutNom, statutId) => {
              titre.statutId = statutId
              titre.demarches[0].etapes[0].id = 'titre-id-demarche-id-etape-id'
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
                      modification: null,
                      etapes: [
                        {
                          id: 'titre-id-demarche-id-etape-id',
                          modification: null
                        }
                      ]
                    }
                  ]
                }
              })
            }
          )
        } else if (etapesRestrictions && etapesRestrictions.length) {
          // restriction de modification
          const etapesModification = restrictionsModificationSet(
            etapesRestrictions
          )

          // si restriction de modification
          test.each(etapesModification)(
            `%s modifier l'étape '%s'(%s) sur un titre ${titreType} (admin ${
              administration.abreviation
            } = ${administration.associee ? 'associée' : 'gestionnaire'})`,
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
        } else {
          test(`peut modifier les étapes sur un titre ${titreType} (admin ${
            administration.abreviation
          }  = ${
            administration.associee ? 'associée' : 'gestionnaire'
          })`, async () => {
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
                    etapes: [
                      {
                        id: titre.demarches[0].etapes[0].id,
                        modification: true
                      }
                    ]
                  }
                ]
              }
            })
          })
        }
      }
    })
  }
}

const administrationsPermissionsTestRun = administration => {
  // 1. tester les administrations gestionnaires
  // trouver les types de titre pour lesquels l'administration est gestionnaire
  // const titreTypesAdministrationGestionnaire = ['arm']
  // const titreTypesAdministrationGestionnaire = ['axm']
  const titreAdministration = Object.assign({}, titreTemplate)

  const titreTypesAdministrationGestionnaire = titreTypeAdministrationGestionnaireGet(
    administration.id
  )

  titreAdministration.administrationsGestionnaires = [administration]

  // pour chaque type de titre
  titreTypesAdministrationGestionnaire.forEach(titreType =>
    titresTypePermissionsTestRun(
      administration,
      titreAdministration,
      titreType,
      true
    )
  )

  // 2. tester les administrations associées
  // trouver les types de titre pour lesquels l'administration est associée
  const administrationAssociee = Object.assign(
    { associee: true },
    administration
  )
  const titreAdministrationAssociee = Object.assign({}, titreTemplate)
  const titreTypesAdministrationAssociee = titreTypeAdministrationAssocieeGet(
    administrationAssociee.id
  )

  titreAdministrationAssociee.administrationsGestionnaires = [
    administrationAssociee
  ]

  // pour chaque type de titre
  // titreTypesAdministrationAssociee.forEach(titreType => titresTypePermissionsTestRun(administrationAssociee,titreAdministrationAssociee,titreType,true))

  // 3. tester les permissions/restrictions de l'administration sur les types de titre / types d'étape sur lesquels l'administration n'est pas gestionnaire ou associée

  // restriction de visibilité/Création/modification sur les étapes
  const titreTypesEtapesRestrictions = administrationsTitresTypesEtapesTypes
    .filter(
      attet =>
        attet.administration_id === administration.id &&
        !titreTypesAdministrationGestionnaire.includes(attet.titre_type_id) &&
        !titreTypesAdministrationAssociee.includes(attet.titre_type_id)
    )
    .map(attet => attet.titre_type_id)
    .reduce(
      (acc, titreType) => (acc.includes(titreType) ? acc : [...acc, titreType]),
      []
    )

  if (titreTypesEtapesRestrictions && titreTypesEtapesRestrictions.length) {
    console.log(
      'titreTypesEtapesRestrictions :>> ',
      titreTypesEtapesRestrictions
    )

    const titreAdministrationNonGestionnaire = Object.assign({}, titreTemplate)
    titreAdministrationNonGestionnaire.administrationsGestionnaires = []

    // pour chaque type de titre
    titreTypesEtapesRestrictions.forEach(titreType =>
      titresTypePermissionsTestRun(
        administration,
        titreAdministrationNonGestionnaire,
        titreType,
        false
      )
    )
  }
}

// pour chaque administration
administrations.forEach(administration =>
  administrationsPermissionsTestRun(administration)
)
