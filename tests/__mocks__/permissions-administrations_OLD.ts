// import { administrations } from './administrations'

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

interface IEtapeRestriction {
  etapeTypeId: string
  lectureInterdit: string
  creationInterdit: string
  modificationInterdit: string
}

// =====================================
// méthodes

// retourne le(s) type(s) de titre dont une administration est gestionnaire
const titreTypeAdministrationGestionnaireGet = administrationId =>
  administrationsTitresTypes
    .filter(
      att =>
        att.administration_id === administrationId &&
        att.gestionnaire === 'true'
    )
    .map(att => att.titre_type_id)

// retourne le(s) type(s) de titre dont une administration est associée
const titreTypeAdministrationAssocieeGet = administrationId =>
  administrationsTitresTypes
    .filter(
      att =>
        att.administration_id === administrationId && att.associee === 'true'
    )
    .map(att => att.titre_type_id)

// écrit les jeux de test des étapes en fonction des restrictions
// restriction de visibilité
const restrictionsVisibiliteSet = (etapesRestriction: IEtapeRestriction[]) =>
  etapesRestriction.map(etape => [
    etape.lecture_interdit === 'false' ? 'peut' : 'ne peut pas',
    etapesTypes.find(statut => statut.id === etape.etape_type_id)?.nom,
    etape.etape_type_id,
    [
      {
        id: `titre-id-demarche-id-${etape.etape_type_id}`,
        typeId: etape.etape_type_id,
        ordre: etapesTypes.find(statut => statut.id === etape.etape_type_id)
          ?.ordre,
        titreDemarcheId: 'titre-id-demarche-id',
        statutId: 'acc',
        date: '2020-02-02'
      }
    ],
    etape.lecture_interdit === 'false'
      ? [
          {
            id: `titre-id-demarche-id-${etape.etape_type_id}`
          }
        ]
      : []
  ])

// restriction de modification
const restrictionsModificationSet = (etapesRestriction: IEtapeRestriction[]) =>
  etapesRestriction.map(etape => [
    etape.modification_interdit === 'false' ? 'peut' : 'ne peut pas',
    etapesTypes.find(statut => statut.id === etape.etape_type_id)?.nom,
    etape.etape_type_id,
    [
      {
        id: `titre-id-demarche-id-${etape.etape_type_id}`,
        typeId: etape.etape_type_id,
        ordre: etapesTypes.find(statut => statut.id === etape.etape_type_id)
          ?.ordre,
        titreDemarcheId: 'titre-id-demarche-id',
        statutId: 'acc',
        date: '2020-02-02'
      }
    ],
    etape.lecture_interdit === 'false'
      ? [
          {
            modification: etape.modification_interdit === 'false' ? true : null
          }
        ]
      : []
  ])

// ONF gestionnaire de PER avec restrictions visibilité/création/modification des étapes

// const onfPerEtapesRestrictions = [
//   {
//     etapeType: 'aof',
//     visibilite: true,
//     modification: true,
//     creation: true
//   }
// ]

const titreTemplate = {
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

export {
  titresStatuts,
  administrations,
  titreTypeAdministrationGestionnaireGet,
  titreTypeAdministrationAssocieeGet,
  administrationsTitresTypesEtapesTypes,
  administrationsTitresTypesTitresStatuts,
  restrictionsVisibiliteSet,
  restrictionsModificationSet,
  titreTemplate
}
