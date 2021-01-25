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

type IAction = 'rien' | 'voir' | 'modifier' | 'creer'

interface IAdministrationTitreTypeTest {
  titreId: string
  administrationId: string
  pouvoir: boolean
  action: IAction
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
  let uniqueId = 0
  // Visibilité des titres
  //   |T|D|E|
  //  V|X| | |
  //  C| | | |
  //  M| | | |

  administrationTitreTypeTests.push({
    titreId: `titre-${titreTypeId}-${administration.id}-${uniqueId++}`,
    administrationId: administration.id,
    pouvoir: true,
    action: 'voir',
    cible: 'titre',
    titreTypeId
  })

  // Visibilité des démarches
  //   |T|D|E|
  //  V| |X| |
  //  C| | | |
  //  M| | | |
  administrationTitreTypeTests.push({
    titreId: `titre-${titreTypeId}-${administration.id}-${uniqueId++}`,
    administrationId: administration.id,
    pouvoir: true,
    action: 'voir',
    cible: 'demarche',
    titreTypeId
  })

  // Visibilité des étapes
  //   |T|D|E|
  //  V| | |X|
  //  C| | | |
  //  M| | | |

  // s'il y a restriction de visibilité `lectureInterdit`
  // dans titresTypesEtapesTypes
  if (administration.titresTypesEtapesTypes?.length) {
    administrationTitreTypeTests.push(
      ...administration.titresTypesEtapesTypes
        .filter(ttet => ttet.titreTypeId === titreTypeId)
        .map(restriction => ({
          titreId: `titre-${titreTypeId}-${administration.id}-${uniqueId++}`,
          administrationId: restriction.administrationId,
          pouvoir: !restriction.lectureInterdit,
          action: 'voir' as IAction,
          cible: 'etape',
          titreTypeId,
          etapeTypeId: restriction.etapeTypeId
        }))
    )
  }

  // TODO : création T, D, E

  //   |T|D|E|
  //  V| | | |
  //  C| | | |
  //  M|X| | |

  // s'il y a restriction d'édition `titresModificationInterdit`
  // dans  titresTypesTitresStatuts
  if (administration.titresTypesTitresStatuts?.length) {
    administrationTitreTypeTests.push(
      ...administration.titresTypesTitresStatuts
        .filter(ttts => ttts.titreTypeId === titreTypeId)
        .map(restriction => ({
          titreId: `titre-${titreTypeId}-${administration.id}-${uniqueId++}`,
          administrationId: administration.id,
          gestionnaire: restriction.titreType!.gestionnaire,
          pouvoir:
            (restriction.titreType!.gestionnaire &&
              !restriction.titresModificationInterdit) ||
            false,
          action: 'modifier' as IAction,
          cible: 'titre',
          titreTypeId,
          titreStatutId: restriction.titreStatutId
        }))
    )
  }

  // Modification des démarches
  //   |T|D|E|
  //  V| | | |
  //  C| | | |
  //  M| |X| |

  // s'il y a restriction d'édition `demarchesModificationInterdit`
  // dans  titresTypesTitresStatuts
  if (administration.titresTypesTitresStatuts?.length) {
    administrationTitreTypeTests.push(
      ...administration.titresTypesTitresStatuts
        .filter(ttts => ttts.titreTypeId === titreTypeId)
        .map(restriction => ({
          titreId: `titre-${titreTypeId}-${administration.id}-${uniqueId++}`,
          administrationId: administration.id,
          gestionnaire: restriction.titreType!.gestionnaire,
          pouvoir:
            (restriction.titreType!.gestionnaire &&
              !restriction.demarchesModificationInterdit) ||
            false,
          action: 'modifier' as IAction,
          cible: 'demarche',
          titreTypeId,
          titreStatutId: restriction.titreStatutId
        }))
    )
  }

  // Modification des étapes
  //   |T|D|E|
  //  V| | | |
  //  C| | | |
  //  M| | |X|

  // s'il y a restriction d'édition `etapesModificationInterdit`
  // dans titresTypesTitresStatuts
  if (administration.titresTypesTitresStatuts?.length) {
    administrationTitreTypeTests.push(
      ...administration.titresTypesTitresStatuts
        .filter(ttts => ttts.titreTypeId === titreTypeId)
        .map(restriction => ({
          titreId: `titre-${titreTypeId}-${administration.id}-${uniqueId++}`,
          administrationId: administration.id,
          gestionnaire: restriction.titreType!.gestionnaire,
          pouvoir:
            (restriction.titreType!.gestionnaire &&
              !restriction.etapesModificationInterdit) ||
            false,
          action: 'modifier' as IAction,
          cible: 'etape',
          titreTypeId,
          titreStatutId: restriction.titreStatutId
        }))
    )
  }

  // s'il y a restriction de modification d'étapes
  // if (administration.titresTypesEtapesTypes?.length) {
  //   administrationTitreTypeTests.push(
  //     ...administration.titresTypesEtapesTypes
  //       .filter(ttet => ttet.titreTypeId === titreTypeId)
  //       .map(restriction => {
  //         return {
  //           titreId: `titre-${titreTypeId}-${administration.id}-${uniqueId++}`,
  //           administrationId: administration.id,
  //           gestionnaire: restriction.titreType.gestionnaire,
  //           pouvoir:
  //             restriction.titreType.gestionnaire &&
  //             !restriction.modificationInterdit,
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
  let message = ''
  if (scenario.cible! === 'titre') {
    message = 'un titre '
  } else if (scenario.cible! === 'demarche') {
    message = "les démarches d'un titre "
  } else if (scenario.cible! === 'etape') {
    if (scenario.etapeTypeId!) {
      message = `une étape ${scenario.etapeTypeId} d'un titre `
    } else {
      message = `les étapes d'un titre `
    }
  }
  message += scenario.titreTypeId
  message += scenario.titreStatutId!
    ? ` dont le statut est ${scenario.titreStatutId}`
    : ''

  return `${scenario.administrationId}: ${
    scenario.pouvoir ? 'peut' : 'ne peut pas'
  } ${scenario.action} ${message}`
}

const titreBuild = (
  {
    titreId,
    titreTypeId,
    titreStatutId,
    etapeTypeId
  }: IAdministrationTitreTypeTest,
  administration: IAdministration
) => {
  const titre = {
    id: titreId,
    nom: 'nom titre',
    demarches: [
      {
        id: `${titreId}-demarche-id`,
        titreId: titreId,
        typeId: 'oct',
        etapes: [
          {
            id: `${titreId}-demarche-id-etape-id`,
            typeId: 'mfr',
            ordre: 0,
            titreDemarcheId: `${titreId}-demarche-id`,
            statutId: 'enc',
            date: '2020-01-01'
          }
        ]
      }
    ],
    publicLecture: false
  } as ITitre

  titre.typeId = titreTypeId
  titre.domaineId = titre.typeId.slice(-1)
  titre.administrationsGestionnaires = []

  const administrationTitreType = administration.titresTypes?.find(
    att => att.id === titreTypeId
  )

  if (administrationTitreType?.gestionnaire) {
    titre.administrationsGestionnaires.push(administration)
  }
  // titre.administrationsLocales = []

  if (titreStatutId) {
    titre.statutId = titreStatutId
  }

  if (etapeTypeId) {
    titre.demarches![0]!.etapes![0]!.id = `${titreId}-demarche-id-${etapeTypeId}`
    titre.demarches![0]!.etapes![0]!.typeId = etapeTypeId
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

    if (scenario.pouvoir) {
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
    if (scenario.pouvoir) {
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

    if (scenario.pouvoir) {
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
      } else if (scenario.action === 'rien') {
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
