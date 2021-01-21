import { IAdministration, ITitre } from '../../src/types'
// import { departementsGet } from '../../src/database/queries/territoires'

// const titresBuild = async () => {
//   const departements = await departementsGet()

//   const titres = departements.map(d => ({
//     id: `titre-id-${d.id}`,
//     demarches: [
//       {
//         id: `demarche-id-${d.id}`,
//         typeId: 'oct',
//         etapes: [
//           {
//             id: `etape-id-${d.id}`,
//             typeId: 'dpu',
//             communes: [
//               {
//                 id: `commune-id-${d.id}`,
//                 departementId: d.id,
//                 departement: d,
//                 regionId: d.regionId
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }))
// }

let titreIndex = 0

interface IAdministrationTitreTypeTest {
  titreId: string
  administrationId: string
  pouvoir: string
  action: string
  cible: string
  titreTypeId: string
  domaineId?: string
  etapeTypeId?: string
  gestionnaire?: boolean | null | undefined
  titreStatutId?: string
}

type IAdministrationTitreTypeTestFormatted = [
  string,
  IAdministration,
  ITitre,
  ITitre
]

const testAdministrationTitreTypeBuild = (
  administration: IAdministration,
  titreTypeId: string
) => {
  const administrationTitreTypeTests = [] as IAdministrationTitreTypeTest[]

  // Visibilité des titres
  //   |T|D|E|
  //  V|X| | |
  //  C| | | |
  //  M| | | | <- restriction 1 : sur le statut du titre
  //        ^
  //        |
  //        restriction 2 : sur les types d'étape
  administrationTitreTypeTests.push({
    titreId: `titre_${++titreIndex}`,
    administrationId: administration.id,
    pouvoir: 'peut',
    action: 'voir',
    cible: 'titre',
    titreTypeId
  })

  // Visibilité des démarches
  //   |T|D|E|
  //  V| |X| |
  //  C| | | |
  //  M| | | | <- restriction 1 : sur le statut du titre
  //        ^
  //        |
  //        restriction 2 : sur les types d'étape
  administrationTitreTypeTests.push({
    titreId: `titre_${++titreIndex}`,
    administrationId: administration.id,
    pouvoir: 'peut',
    action: 'voir',
    cible: 'demarche',
    titreTypeId
  })

  // Visibilité des étapes
  //   |T|D|E|
  //  V| | |X|
  //  C| | | |
  //  M| | | | <- restriction 1 : sur le statut du titre
  //        ^
  //        |
  //        restriction 2 : sur les types d'étape

  // s'il y a restriction de visibilité
  if (administration.titresTypesEtapesTypes?.length) {
    administrationTitreTypeTests.push(
      ...administration.titresTypesEtapesTypes
        .filter(ttet => ttet.titreTypeId === titreTypeId)
        .map(restriction => {
          return {
            titreId: `titre_${++titreIndex}`,
            administrationId: restriction.administrationId,
            pouvoir: restriction.lectureInterdit ? 'ne peut pas' : 'peut',
            action: 'voir',
            cible: 'etape',
            titreTypeId,
            etapeTypeId: restriction.etapeTypeId
          }
        })
    )
  }

  // TODO : création T, D, E

  //   |T|D|E|
  //  V| | | |
  //  C| | | |
  //  M|X| | | <- restriction 1 : sur le statut du titre
  //        ^
  //        |
  //        restriction 2 : sur les types d'étape

  // s'il y a restriction d'édition TDE : sur les titres
  if (administration.titresTypesTitresStatuts?.length) {
    administrationTitreTypeTests.push(
      ...administration.titresTypesTitresStatuts
        .filter(ttts => ttts.titreTypeId === titreTypeId)
        .map(restriction => {
          return {
            titreId: `titre_${++titreIndex}`,
            administrationId: administration.id,
            gestionnaire: restriction.titreType.gestionnaire,
            pouvoir:
              restriction.titreType.gestionnaire &&
              !restriction.titresModificationInterdit
                ? 'peut'
                : 'ne peut pas',
            action: 'modifier',
            cible: 'titre',
            titreTypeId,
            titreStatutId: restriction.titreStatutId
          }
        })
    )
  }

  // Modification des démarches
  //   |T|D|E|
  //  V| | | |
  //  C| | | |
  //  M| |X| | <- restriction 1 : sur le statut du titre
  //        ^
  //        |
  //        restriction 2 : sur les types d'étape

  // s'il y a restriction d'édition TDE : sur les démarches
  if (administration.titresTypesTitresStatuts?.length) {
    administrationTitreTypeTests.push(
      ...administration.titresTypesTitresStatuts
        .filter(ttts => ttts.titreTypeId === titreTypeId)
        .map(restriction => {
          return {
            titreId: `titre_${++titreIndex}`,
            administrationId: administration.id,
            gestionnaire: restriction.titreType.gestionnaire,
            pouvoir:
              restriction.titreType.gestionnaire &&
              !restriction.demarchesModificationInterdit
                ? 'peut'
                : 'ne peut pas',
            action: 'modifier',
            cible: 'demarche',
            titreTypeId,
            titreStatutId: restriction.titreStatutId
          }
        })
    )
  }

  // Modification des étapes
  //   |T|D|E|
  //  V| | | |
  //  C| | | |
  //  M| | |X| <- restriction 1 : sur le statut du titre
  //        ^
  //        |
  //        restriction 2 : sur les types d'étape

  // s'il y a restriction d'édition TDE : sur les étapes
  if (administration.titresTypesTitresStatuts?.length) {
    administrationTitreTypeTests.push(
      ...administration.titresTypesTitresStatuts
        .filter(ttts => ttts.titreTypeId === titreTypeId)
        .map(restriction => {
          return {
            titreId: `titre_${++titreIndex}`,
            administrationId: administration.id,
            gestionnaire: restriction.titreType.gestionnaire,
            pouvoir:
              restriction.titreType.gestionnaire &&
              !restriction.etapesModificationInterdit
                ? 'peut'
                : 'ne peut pas',
            action: 'modifier',
            cible: 'etape',
            titreTypeId,
            titreStatutId: restriction.titreStatutId
          }
        })
    )
  }

  // s'il y a restriction de modification d'étapes
  // if (administration.titresTypesEtapesTypes?.length) {
  //   administrationTitreTypeTests.push(
  //     ...administration.titresTypesEtapesTypes
  //       .filter(ttet => ttet.titreTypeId === titreTypeId)
  //       .map(restriction => {
  //         return {
  //           titreId: `titre_${++titreIndex}`,
  //           administrationId: administration.id,
  //           gestionnaire: restriction.titreType.gestionnaire,
  //           pouvoir:
  //             restriction.titreType.gestionnaire &&
  //             !restriction.modificationInterdit
  //               ? 'peut'
  //               : 'ne peut pas',
  //           action: restriction.lectureInterdit ? 'modifier(voir)' : 'modifier',
  //           cible: 'etape',
  //           titreTypeId,
  //           etapeTypeId: restriction.etapeTypeId
  //         }
  //       })
  //   )
  // }

  return administrationTitreTypeTests
}

const administrationTestsBuild = (administration: IAdministration) =>
  administration.titresTypes!.flatMap(titreType =>
    testAdministrationTitreTypeBuild(administration, titreType.id)
  )

const administrationsTestsBuild = (administrations: IAdministration[]) =>
  administrations.flatMap(administration =>
    administrationTestsBuild(administration)
  )

const messageBuild = (scenario: IAdministrationTitreTypeTest) => {
  let objet = ''
  if (scenario.cible! === 'titre') {
    objet = 'un titre '
  } else if (scenario.cible! === 'demarche') {
    objet = "les démarches d'un titre "
  } else if (scenario.cible! === 'etape') {
    if (scenario.etapeTypeId!) {
      objet = `une étape ${scenario.etapeTypeId} d'un titre `
    } else {
      objet = `les étapes d'un titre `
    }
  }
  objet += scenario.titreTypeId
  objet += scenario.titreStatutId!
    ? ` dont le statut est ${scenario.titreStatutId}`
    : ''

  return `${scenario.administrationId}: ${scenario.pouvoir} ${scenario.action} ${objet}`
}

const titreBuild = (
  scenario: IAdministrationTitreTypeTest,
  administration: IAdministration
) => {
  const titre = {
    id: scenario.titreId,
    nom: 'nom titre',
    demarches: [
      {
        id: `${scenario.titreId}-demarche-id`,
        titreId: scenario.titreId,
        typeId: 'oct',
        etapes: [
          {
            id: `${scenario.titreId}-demarche-id-etape-id`,
            typeId: 'mfr',
            ordre: 0,
            titreDemarcheId: `${scenario.titreId}-demarche-id`,
            statutId: 'enc',
            date: '2020-01-01'
          }
        ]
      }
    ],
    publicLecture: false
  } as ITitre

  titre.typeId = scenario.titreTypeId
  titre.domaineId = titre.typeId.slice(-1)
  titre.administrationsGestionnaires = [administration]
  // titre.administrationsLocales = []

  if (scenario.titreStatutId) {
    titre.statutId = scenario.titreStatutId
  }

  if (scenario.etapeTypeId) {
    titre.demarches![0]!.etapes![0]!.id = `${scenario.titreId}-demarche-id-${scenario.etapeTypeId}`
    titre.demarches![0]!.etapes![0]!.typeId = scenario.etapeTypeId
  }

  return titre
}

const resultBuild = (scenario: IAdministrationTitreTypeTest) => {
  const titre = {
    id: scenario.titreId,
    modification: true,
    demarches: [
      {
        id: `${scenario.titreId}-demarche-id`,
        modification: true,
        etapes: [
          {
            id: `${scenario.titreId}-demarche-id-etape-id`,
            modification: true
          }
        ]
      }
    ]
  } as ITitre

  if (scenario.cible! === 'titre') {
    // on retire les démarches
    delete titre.demarches

    if (scenario.pouvoir === 'peut') {
      if (scenario.action === 'voir') {
        // on teste juste la visibilité, on retire la 'modification'
        delete titre.modification
      } else if (scenario.action === 'modifier') {
        // on garde l'id et la modification à true
      } else {
        // todo : gérer la création
      }
    } else {
      if (scenario.action === 'voir') {
        // tout le titre est null
        return null
      } else if (scenario.action === 'modifier') {
        titre.modification = null
      } else {
        // todo : gérer la création
      }
    }
  } else if (scenario.cible! === 'demarche') {
    // on retire la modification sur le titre
    delete titre.modification
    // on retire les étapes
    delete titre.demarches![0]!.etapes
    if (scenario.pouvoir === 'peut') {
      if (scenario.action === 'voir') {
        // on teste juste la visibilité, on retire la 'modification'
        delete titre.demarches![0]!.modification
      } else if (scenario.action === 'modifier') {
        // on garde l'id et la modification à true
      } else {
        // todo : gérer la création
      }
    } else {
      if (scenario.action === 'voir') {
        // les démarches sont vides
        titre.demarches = []
      } else if (scenario.action === 'modifier') {
        titre.demarches![0]!.modification = null
      } else {
        // todo : gérer la création
      }
    }
  } else if (scenario.cible! === 'etape') {
    // on retire la modification sur le titre
    delete titre.modification
    // on retire la modification sur les démarches
    delete titre.demarches![0]!.modification
    // l'id de l'étape contient le type d"étape s'il est indiqué
    if (scenario.etapeTypeId!) {
      titre!.demarches![0]!.etapes![0]!.id = `${scenario.titreId}-demarche-id-${scenario.etapeTypeId}`
    }

    if (scenario.pouvoir === 'peut') {
      if (scenario.action === 'voir') {
        // on teste juste la visibilité, on retire la 'modification'
        delete titre.demarches![0]!.etapes![0]!.modification
      } else if (scenario.action === 'modifier') {
        // on garde l'id et la modification à true
      } else {
        // todo : gérer la création
      }
    } else {
      if (scenario.action === 'voir') {
        // les étapes sont vides
        titre.demarches![0]!.etapes = []
      } else if (scenario.action === 'modifier') {
        titre.demarches![0]!.etapes![0]!.modification = null
      } else if (scenario.action === 'modifier(voir)') {
        titre.demarches![0]!.etapes = []
      } else {
        // todo : gérer la création
      }
    }
  }

  return titre
}

const scenariosBuild = (administrations: IAdministration[]) => {
  const administrationsTests = administrationsTestsBuild(administrations)

  return administrationsTests.map(t => {
    const administration = administrations.find(
      a => a.id === t.administrationId
    ) as IAdministration

    return [
      messageBuild(t),
      administration,
      titreBuild(t, administration),
      resultBuild(t)
    ]
  }) as IAdministrationTitreTypeTestFormatted[]
}

export { scenariosBuild }
