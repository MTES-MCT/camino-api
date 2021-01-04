import { IAdministration, ITitre, ITitreType } from '../../src/types'
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

interface IScenario {
  administrationId: string
  pouvoir: string
  action: string
  cible: string
  titreTypeId: string
  domaineId?: string
  etapeTypeId?: string
  gestionnaire?: boolean
  titreStatutId?: string
}

const titreTypePermissionScenarioBuild = (
  administration: IAdministration,
  titreType: ITitreType
  // gestionnaire: boolean,
  // associee: boolean
) => {
  // TODO
  // const isAdmin = gestionnaire
  const isAdmin = titreType.gestionnaire

  let titreTypePermissionScenario = [] as IScenario[]
  // Création d'un scénario pour chaque cas

  if (titreType.gestionnaire || titreType.associee) {
    // Visibilité des titres
    //   |T|D|E|
    //  V|X| | |
    //  C| | | |
    //  M| | | | <- restriction 1 : sur le statut du titre
    //        ^
    //        |
    //        restriction 2 : sur les types d'étape
    titreTypePermissionScenario.push({
      administrationId: administration.id,
      pouvoir: 'peut',
      action: 'voir',
      cible: 'titre',
      titreTypeId: titreType.id
    })

    // Visibilité des démarches
    //   |T|D|E|
    //  V| |X| |
    //  C| | | |
    //  M| | | | <- restriction 1 : sur le statut du titre
    //        ^
    //        |
    //        restriction 2 : sur les types d'étape
    titreTypePermissionScenario.push({
      administrationId: administration.id,
      pouvoir: 'peut',
      action: 'voir',
      cible: 'demarche',
      titreTypeId: titreType.id
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
      titreTypePermissionScenario.push(
        ...administration.titresTypesEtapesTypes.map(restriction => {
          return {
            administrationId: administration.id,
            pouvoir: restriction.lectureInterdit ? 'ne peut pas' : 'peut',
            action: 'voir',
            cible: 'etape',
            titreTypeId: titreType.id,
            etapeTypeId: restriction.etapeTypeId
          }
        })
      )
    }
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
  if (isAdmin && administration.titresTypesTitresStatuts?.length) {
    titreTypePermissionScenario.push(
      ...administration.titresTypesTitresStatuts.map(restriction => {
        return {
          administrationId: administration.id,
          gestionnaire: true,
          pouvoir: restriction.titresModificationInterdit
            ? 'ne peut pas'
            : 'peut',
          action: 'modifier',
          cible: 'titre',
          titreTypeId: titreType.id,
          titreStatutId: restriction.titreStatutId
        }
      })
    )
  }

  if (!isAdmin) {
    titreTypePermissionScenario.push({
      administrationId: administration.id,
      gestionnaire: false,
      pouvoir: 'ne peut pas',
      action: 'modifier',
      cible: 'titre',
      titreTypeId: titreType.id
    })
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
  if (isAdmin && administration.titresTypesTitresStatuts?.length) {
    titreTypePermissionScenario.push(
      ...administration.titresTypesTitresStatuts.map(restriction => {
        return {
          administrationId: administration.id,
          gestionnaire: true,
          pouvoir: restriction.demarchesModificationInterdit
            ? 'ne peut pas'
            : 'peut',
          action: 'modifier',
          cible: 'demarche',
          titreTypeId: titreType.id,
          titreStatutId: restriction.titreStatutId
        }
      })
    )
  }

  if (!isAdmin) {
    titreTypePermissionScenario.push({
      administrationId: administration.id,
      gestionnaire: false,
      pouvoir: 'ne peut pas',
      action: 'modifier',
      cible: 'demarche',
      titreTypeId: titreType.id
    })
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
  if (isAdmin && administration.titresTypesTitresStatuts?.length) {
    titreTypePermissionScenario.push(
      ...administration.titresTypesTitresStatuts.map(restriction => {
        return {
          administrationId: administration.id,
          gestionnaire: true,
          pouvoir: restriction.etapesModificationInterdit
            ? 'ne peut pas'
            : 'peut',
          action: 'modifier',
          cible: 'etape',
          titreTypeId: titreType.id,
          titreStatutId: restriction.titreStatutId
        }
      })
    )
  }

  // si l'administration n'est pas gestionnaire ou liée par territoire
  // ne peut pas modifier de titre
  if (!isAdmin) {
    titreTypePermissionScenario.push({
      administrationId: administration.id,
      pouvoir: 'ne peut pas',
      action: 'modifier',
      cible: 'etape',
      titreTypeId: titreType.id
    })
  }

  // s'il y a restriction de modification d'étapes
  if (isAdmin && administration.titresTypesEtapesTypes?.length) {
    titreTypePermissionScenario.push(
      ...administration.titresTypesEtapesTypes.map(restriction => {
        return {
          administrationId: administration.id,
          gestionnaire: true,
          pouvoir: restriction.modificationInterdit ? 'ne peut pas' : 'peut',
          action: restriction.lectureInterdit ? 'ne peut pas' : 'peut',
          cible: 'etape',
          titreTypeId: titreType.id,
          etapeTypeId: restriction.etapeTypeId
        }
      })
    )
  }

  return titreTypePermissionScenario
}

// crée un tableau d'objet de scénario pour une administration en fonction du paramétrage
const paramsPermissionsAdministrationJsonGet = (
  administration: IAdministration
) =>
  administration.titresTypes!.flatMap(titreType =>
    titreTypePermissionScenarioBuild(administration, titreType)
  )

// crée un tableau d'objet de scénario des administrations en fonction du paramétrage
const paramsPermissionsAdministrationsJsonGet = (
  administrations: IAdministration[]
) =>
  administrations.flatMap(administration =>
    paramsPermissionsAdministrationJsonGet(administration)
  )

// =====================================
// méthodes

const messageGet = (scenario: IScenario) => {
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

  return `${scenario.pouvoir} ${scenario.action} ${objet} (${scenario.administrationId})`
}

const titreTestGet = (scenario: IScenario) => {
  const titre = {
    id: 'titre-id',
    nom: 'nom titre',
    demarches: [
      {
        id: 'titre-id-demarche-id',
        titreId: 'titre-id',
        typeId: 'oct',
        etapes: [
          {
            id: 'titre-id-demarche-id-etape_id',
            typeId: 'mfr',
            ordre: 0,
            titreDemarcheId: 'titre-id-demarche-id',
            statutId: 'enc',
            date: '2020-01-01'
          }
        ]
      }
    ]
  } as ITitre

  titre.typeId = scenario.titreTypeId
  titre.domaineId = titre.typeId.slice(-1)

  if (scenario.titreStatutId) {
    titre.statutId = scenario.titreStatutId
  }

  if (scenario.etapeTypeId) {
    titre.demarches[0]!.etapes[0]!.id = `titre-id-demarche-id-${scenario.etapeTypeId}`
    titre.demarches[0]!.etapes[0]!.typeId = scenario.etapeTypeId
  }

  return titre
}

const graphQLResponseGet = (scenario: IScenario) => {
  const titre = {
    id: 'titre-id',
    publicLecture: false,
    modification: true,
    demarches: [
      {
        id: 'titre-id-demarche-id',
        modification: true,
        etapes: [
          {
            id: 'titre-id-demarche-id-etape_id',
            modification: true
          }
        ]
      }
    ]
  } as ITitre

  if (scenario.cible! === 'titre') {
    // on retire les démarches
    delete titre.demarches
    if (scenario.pouvoir! === 'peut') {
      if (scenario.action! === 'voir') {
        // on teste juste la visibilité, on retire la 'modification'
        delete titre.modification
      } else if (scenario.action! === 'modifier') {
        // on garde l'id et la modification à true
      } else {
        // todo : gérer la création
      }
    } else {
      if (scenario.action! === 'voir') {
        // tout le titre est null
        return null
      } else if (scenario.action! === 'modifier') {
        titre.modification = null
      } else {
        // todo : gérer la création
      }
    }
  } else if (scenario.cible! === 'demarche') {
    // on retire la modification sur le titre
    delete titre.modification
    // on retire les étapes
    delete titre.demarches[0]!.etapes
    if (scenario.pouvoir! === 'peut') {
      if (scenario.action! === 'voir') {
        // on teste juste la visibilité, on retire la 'modification'
        delete titre.demarches[0]!.modification
      } else if (scenario.action! === 'modifier') {
        // on garde l'id et la modification à true
      } else {
        // todo : gérer la création
      }
    } else {
      if (scenario.action! === 'voir') {
        // les démarches sont vides
        titre.demarches = []
      } else if (scenario.action! === 'modifier') {
        titre.demarches[0]!.modification = null
      } else {
        // todo : gérer la création
      }
    }
  } else if (scenario.cible! === 'etape') {
    // on retire la modification sur le titre
    delete titre.modification
    // on retire la modification sur les démarches
    delete titre.demarches[0]!.modification
    // l'id de l'étape contient le type d"étape s'il est indiqué
    if (scenario.etapeTypeId!) {
      titre.demarches[0]!.etapes[0]!.id = `titre-id-demarche-id-${scenario.etapeTypeId}`
    }

    if (scenario.pouvoir! === 'peut') {
      if (scenario.action! === 'voir') {
        // on teste juste la visibilité, on retire la 'modification'
        delete titre.demarches[0]!.etapes[0]!.modification
      } else if (scenario.action! === 'modifier') {
        // on garde l'id et la modification à true
      } else {
        // todo : gérer la création
      }
    } else {
      if (scenario.action! === 'voir') {
        // les étapes sont vides
        titre.demarches[0]!.etapes = []
      } else if (scenario.action! === 'modifier') {
        titre.demarches[0]!.etapes[0]!.modification = null
      } else if (scenario.action! === 'modifier(voir)') {
        titre.demarches[0]!.etapes = []
      } else {
        // todo : gérer la création
      }
    }
  }

  return titre
}

const scenariosGet = (administrations: IAdministration[]) => {
  // scénarios issus du paramétrage
  const scenarios = paramsPermissionsAdministrationsJsonGet(administrations)

  return scenarios.map(scenario => [
    messageGet(scenario),
    administrations.find(a => a.id === scenario.administrationId),
    titreTestGet(scenario),
    graphQLResponseGet(scenario)
  ]) as [string, IAdministration, ITitre, ITitre][]
}

export { scenariosGet }
