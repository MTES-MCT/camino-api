// import { administrations } from './administrations'

import { titre } from '../../src/api/graphql/resolvers/titres'
import { graphQLCall } from '../_utils'

// Les scénarios de test sur les permissions des administrations
const permissionsAdministrationsScenarios = require('./permissions-administrations/permissions-test-scenarios.json')

// Les administrations
const administrations = require('./permissions-administrations/administrations.json')

// Les administrations Gestionnaires/Associées sur un type de titre
const administrationsTitresTypes = require('./permissions-administrations/administrations--titres-types.json')

// restriction 1 : édition T,D,E selon le statut du titre
const administrationsTitresTypesTitresStatuts = require('./permissions-administrations/administrations--titres-types--titres-statuts.json')

// restriction 2 : visibilité/Création/Modification d'étape selon le type d'étape
const administrationsTitresTypesEtapesTypes = require('./permissions-administrations/administrations--titres-types--etapes-types.json')

// liste des statuts de titre
const titresStatuts = require('./permissions-administrations/titres-statuts.json')

// liste des types d'étape
const etapesTypesJson = require('./permissions-administrations/etapes-types.json')
const etapesTypes = etapesTypesJson.map(et => {
  const etapeType = et
  etapeType.ordre = parseInt(etapeType.ordre)

  return etapeType
})

// interface IEtapeRestriction {
//   etapeTypeId: string
//   lectureInterdit: string
//   creationInterdit: string
//   modificationInterdit: string
// }

// =====================================
// méthodes

// retourne le(s) type(s) de titre dont une administration est gestionnaire
// const titreTypeAdministrationGestionnaireGet = administrationId =>
//   administrationsTitresTypes
//     .filter(
//       att =>
//         att.administration_id === administrationId &&
//         att.gestionnaire === 'true'
//     )
//     .map(att => att.titre_type_id)

// retourne le(s) type(s) de titre dont une administration est associée
// const titreTypeAdministrationAssocieeGet = administrationId =>
//   administrationsTitresTypes
//     .filter(
//       att =>
//         att.administration_id === administrationId && att.associee === 'true'
//     )
//     .map(att => att.titre_type_id)

// écrit les jeux de test des étapes en fonction des restrictions
// restriction de visibilité
// const restrictionsVisibiliteSet = (etapesRestriction: IEtapeRestriction[]) =>
//   etapesRestriction.map(etape => [
//     etape.lecture_interdit === 'false' ? 'peut' : 'ne peut pas',
//     etapesTypes.find(statut => statut.id === etape.etape_type_id)?.nom,
//     etape.etape_type_id,
//     [
//       {
//         id: `titre-id-demarche-id-${etape.etape_type_id}`,
//         typeId: etape.etape_type_id,
//         ordre: etapesTypes.find(statut => statut.id === etape.etape_type_id)
//           ?.ordre,
//         titreDemarcheId: 'titre-id-demarche-id',
//         statutId: 'acc',
//         date: '2020-02-02'
//       }
//     ],
//     etape.lecture_interdit === 'false'
//       ? [
//           {
//             id: `titre-id-demarche-id-${etape.etape_type_id}`
//           }
//         ]
//       : []
//   ])

// restriction de modification
// const restrictionsModificationSet = (etapesRestriction: IEtapeRestriction[]) =>
//   etapesRestriction.map(etape => [
//     etape.modification_interdit === 'false' ? 'peut' : 'ne peut pas',
//     etapesTypes.find(statut => statut.id === etape.etape_type_id)?.nom,
//     etape.etape_type_id,
//     [
//       {
//         id: `titre-id-demarche-id-${etape.etape_type_id}`,
//         typeId: etape.etape_type_id,
//         ordre: etapesTypes.find(statut => statut.id === etape.etape_type_id)
//           ?.ordre,
//         titreDemarcheId: 'titre-id-demarche-id',
//         statutId: 'acc',
//         date: '2020-02-02'
//       }
//     ],
//     etape.lecture_interdit === 'false'
//       ? [
//           {
//             modification: etape.modification_interdit === 'false' ? true : null
//           }
//         ]
//       : []
//   ])

const administrationGet = id =>
  administrations.find(administration => administration.id === id)

const messageGet = scenario => {
  let objet = ''
  if (scenario.cible! === 'titre') {
    objet = 'un titre '
  } else if (scenario.cible! === 'demarche') {
    objet = "les démarches d'un titre "
  } else if (scenario.cible! === 'etape') {
    if (scenario.etape_type_id!) {
      objet = `une étape ${scenario.etape_type_id} d'un titre `
    } else {
      objet = `les étapes d'un titre `
    }
  }
  objet += scenario.titre_type_id
  objet += scenario.titre_statut_id!
    ? ` dont le statut est ${scenario.titre_statut_id}`
    : ''

  return `${scenario.pouvoir} ${scenario.action} ${objet} (${scenario.administration_id})`
}

const titreTestGet = scenario => {
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
  }

  // gère si l'administration est gestionnaire/associée ou non
  // si rien n'est précisé, prendre le paramétrage s'il en existe
  // TODO
  titre.administrationsGestionnaires = [
    administrationGet(scenario.administration_id)
  ]

  titre.typeId = scenario.titre_type_id
  titre.domaineId = titre.typeId.slice(-1)

  if (scenario.titre_statut_id) {
    titre.statutId = scenario.titre_statut_id
  }

  if (scenario.etape_type_id) {
    titre.demarches[0].etapes[0].id = `titre-id-demarche-id-${scenario.etape_type_id}`
  }

  return titre
}

const graphQLResponseGet = scenario => {
  const graphQLResponse = {
    titre: {
      id: 'titre-id',
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
    }
  }

  if (scenario.cible! === 'titre') {
    // on retire les démarches
    delete graphQLResponse.titre.demarches
    if (scenario.pouvoir! === 'peut') {
      if (scenario.action! === 'voir') {
        // on teste juste la visibilité, on retire la 'modification'
        delete graphQLResponse.titre.modification
      } else if (scenario.action! === 'modifier') {
        // on garde l'id et la modification à true
      } else {
        // todo : gérer la création
      }
    } else {
      if (scenario.action! === 'voir') {
        // tout le titre est null
        return { titre: null }
      } else if (scenario.action! === 'modifier') {
        graphQLResponse.titre.modification = null
      } else {
        // todo : gérer la création
      }
    }
  } else if (scenario.cible! === 'demarche') {
    // on retire la modification sur le titre
    delete graphQLResponse.titre.modification
    // on retire les étapes
    delete graphQLResponse.titre.demarches[0].etapes
    if (scenario.pouvoir! === 'peut') {
      if (scenario.action! === 'voir') {
        // on teste juste la visibilité, on retire la 'modification'
        delete graphQLResponse.titre.demarches[0].modification
      } else if (scenario.action! === 'modifier') {
        // on garde l'id et la modification à true
      } else {
        // todo : gérer la création
      }
    } else {
      if (scenario.action! === 'voir') {
        // les démarches sont null
        graphQLResponse.titre.demarches[0] = null
      } else if (scenario.action! === 'modifier') {
        graphQLResponse.titre.demarches[0].modification = null
      } else {
        // todo : gérer la création
      }
    }
  } else if (scenario.cible! === 'etape') {
    // on retire la modification sur le titre
    delete graphQLResponse.titre.modification
    // on retire la modification sur les démarches
    delete graphQLResponse.titre.demarches[0].modification
    // l'id de l'étape contient le type d"étape s'il est indiqué
    if (scenario.etape_type_id!) {
      graphQLResponse.titre.demarches[0].etapes[0].id = `titre-id-demarche-id-${scenario.etape_type_id}`
    }

    if (scenario.pouvoir! === 'peut') {
      if (scenario.action! === 'voir') {
        // on teste juste la visibilité, on retire la 'modification'
        delete graphQLResponse.titre.demarches[0].etapes[0].modification
      } else if (scenario.action! === 'modifier') {
        // on garde l'id et la modification à true
      } else {
        // todo : gérer la création
      }
    } else {
      if (scenario.action! === 'voir') {
        // les étapes sont null
        graphQLResponse.titre.demarches[0].etapes[0] = null
      } else if (scenario.action! === 'modifier') {
        graphQLResponse.titre.demarches[0].etapes[0].modification = null
      } else {
        // todo : gérer la création
      }
    }
  }

  return graphQLResponse
}

const scenariosGet = () =>
  permissionsAdministrationsScenarios.map(scenario => {
    return [
      messageGet(scenario),
      administrationGet(scenario.administration_id),
      titreTestGet(scenario),
      graphQLResponseGet(scenario)
    ]
  })

export {
  // titresStatuts,
  // administrations,
  // titreTypeAdministrationGestionnaireGet,
  // titreTypeAdministrationAssocieeGet,
  // administrationsTitresTypesEtapesTypes,
  // administrationsTitresTypesTitresStatuts,
  // restrictionsVisibiliteSet,
  // restrictionsModificationSet,
  // titreTemplate,
  scenariosGet
}
