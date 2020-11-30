// import { administrations } from './administrations'

// Les administrations
const administrations = require('./permissions-administrations/administrations.json')

// Les administrations Gestionnaires/Associées sur un type de titre
const administrationsTitresTypes = require('./permissions-administrations/administrations--titres-types.json')

// restriction 1 : édition T,D,E selon le statut du titre
const administrationsTitresTypeTitresStatuts = require('./permissions-administrations/administrations--titres-types--titres-statuts.json')

// restriction 2 : visibilité/Création/Modification d'étape selon le type d'étape
const administrationsTitresTypeEtapesTypes = require('./permissions-administrations/administrations--titres-types--etapes-types.json')

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
  etapeType: string
  lectureInterdit: string
  creationInterdit: string
  modificationInterdit: string
}

// =====================================
// méthodes
// -> types de titre dont 1 administration est gestionnaire/associée
// -> restrictions 1 selon (administration,type de titre)
// -> restrictions 2 selon (administration,type de titre) sur chaque etape type

// retourne un objet 'administration' selon son id
const administrationGet = administrationId =>
  administrations.find(administration => administration.id === administrationId)

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
        att.administrationId === administrationId && att.associee === 'true'
    )
    .map(att => att.titreTypeId)

// écrit les jeux de test des étapes en fonction des restrictions
// restriction de visibilité
const restrictionsVisibiliteSet = (etapesRestriction: IEtapeRestriction[]) =>
  etapesRestriction.map(etape => [
    etape.lecture_interdit === 'false' ? 'peut' : 'ne peut pas',
    etapesTypes.find(statut => statut.id === etape.etapeType)?.nom,
    etape.etapeType,
    [
      {
        id: `titre-id-demarche-id-${etape.etapeType}`,
        typeId: etape.etapeType,
        ordre: etapesTypes.find(statut => statut.id === etape.etapeType)?.ordre,
        titreDemarcheId: 'titre-id-demarche-id',
        statutId: 'acc',
        date: '2020-02-02'
      }
    ],
    etape.lecture_interdit === 'false'
      ? [
          {
            id: `titre-id-demarche-id-${etape.etapeType}`
          }
        ]
      : []
  ])

// restriction de modification
const restrictionsModificationSet = (etapesRestriction: IEtapeRestriction[]) =>
  etapesRestriction.map(etape => [
    etape.modification_interdit === 'false' ? 'peut' : 'ne peut pas',
    etapesTypes.find(statut => statut.id === etape.etapeType)?.nom,
    etape.etapeType,
    [
      {
        id: `titre-id-demarche-id-${etape.etapeType}`,
        typeId: etape.etapeType,
        ordre: etapesTypes.find(statut => statut.id === etape.etapeType)?.ordre,
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

// restriction de création
// todo ?

// ONF gestionnaire d'ARM avec restrictions visibilité/création/modification des étapes
const onfArmEtapesRestrictions = [
  {
    etapeType: 'css',
    lecture_interdit: 'false',
    modification_interdit: 'false',
    creation_interdit: 'false'
  },
  {
    etapeType: 'mcp',
    lecture_interdit: 'false',
    modification_interdit: 'true',
    creation_interdit: 'true'
  },
  {
    etapeType: 'dae',
    lecture_interdit: 'false',
    modification_interdit: 'false',
    creation_interdit: 'false'
  },
  {
    etapeType: 'mif',
    lecture_interdit: 'false',
    modification_interdit: 'false',
    creation_interdit: 'false'
  },
  {
    etapeType: 'men',
    lecture_interdit: 'false',
    modification_interdit: 'true',
    creation_interdit: 'true'
  },
  {
    etapeType: 'edm',
    lecture_interdit: 'false',
    modification_interdit: 'true',
    creation_interdit: 'true'
  },
  {
    etapeType: 'ede',
    lecture_interdit: 'false',
    modification_interdit: 'true',
    creation_interdit: 'true'
  },
  {
    etapeType: 'mod',
    lecture_interdit: 'false',
    modification_interdit: 'false',
    creation_interdit: 'false'
  },
  {
    etapeType: 'nis',
    lecture_interdit: 'true',
    modification_interdit: 'false',
    creation_interdit: 'false'
  },
  {
    etapeType: 'rde',
    lecture_interdit: 'false',
    modification_interdit: 'true',
    creation_interdit: 'true'
  },
  {
    etapeType: 'rif',
    lecture_interdit: 'false',
    modification_interdit: 'false',
    creation_interdit: 'false'
  },
  {
    etapeType: 'mcr',
    lecture_interdit: 'false',
    modification_interdit: 'false',
    creation_interdit: 'false'
  },
  {
    etapeType: 'sca',
    lecture_interdit: 'false',
    modification_interdit: 'false',
    creation_interdit: 'false'
  }
]
// const onfArmEtapesRestrictions = [
//   {
//     etapeType: 'css',
//     visibilite: true,
//     modification: true,
//     creation: true
//   },
//   {
//     etapeType: 'mcp',
//     visibilite: true,
//     modification: false,
//     creation: false
//   },
//   {
//     etapeType: 'dae',
//     visibilite: true,
//     modification: true,
//     creation: true
//   },
//   { etapeType: 'mif', visibilite: true, modification: true, creation: true },
//   {
//     etapeType: 'men',
//     visibilite: true,
//     modification: false,
//     creation: false
//   },
//   {
//     etapeType: 'edm',
//     visibilite: true,
//     modification: false,
//     creation: false
//   },
//   {
//     etapeType: 'ede',
//     visibilite: true,
//     modification: false,
//     creation: false
//   },
//   {
//     etapeType: 'mod',
//     visibilite: true,
//     modification: true,
//     creation: true
//   },
//   {
//     etapeType: 'nis',
//     visibilite: false,
//     modification: true,
//     creation: true
//   },
//   {
//     etapeType: 'rde',
//     visibilite: true,
//     modification: false,
//     creation: false
//   },
//   {
//     etapeType: 'rif',
//     visibilite: true,
//     modification: true,
//     creation: true
//   },
//   {
//     etapeType: 'mcr',
//     visibilite: true,
//     modification: true,
//     creation: true
//   },
//   {
//     etapeType: 'sca',
//     visibilite: true,
//     modification: true,
//     creation: true
//   }
// ]

// ONF gestionnaire d'AXM avec restrictions d'édition sur T,D,E
const onfAxmEditionRestriction = ['dmc', 'ech', 'val']

// ONF gestionnaire d'AXM avec restrictions visibilité/création/modification des étapes
const onfAxmEtapesRestrictions = [
  {
    etapeType: 'aac',
    visibilite: false,
    modification: false,
    creation: false
  },
  {
    etapeType: 'aaf',
    visibilite: false,
    modification: false,
    creation: false
  },
  {
    etapeType: 'abs',
    visibilite: false,
    modification: false,
    creation: false
  },
  {
    etapeType: 'aec',
    visibilite: false,
    modification: false,
    creation: false
  },
  {
    etapeType: 'afp',
    visibilite: false,
    modification: false,
    creation: false
  },
  {
    etapeType: 'agn',
    visibilite: false,
    modification: false,
    creation: false
  },
  {
    etapeType: 'apd',
    visibilite: false,
    modification: false,
    creation: false
  },
  {
    etapeType: 'api',
    visibilite: false,
    modification: false,
    creation: false
  },
  {
    etapeType: 'ars',
    visibilite: false,
    modification: false,
    creation: false
  },
  {
    etapeType: 'ass',
    visibilite: false,
    modification: false,
    creation: false
  },
  {
    etapeType: 'auc',
    visibilite: false,
    modification: false,
    creation: false
  },
  {
    etapeType: 'mco',
    visibilite: false,
    modification: false,
    creation: false
  },
  {
    etapeType: 'nis',
    visibilite: false,
    modification: false,
    creation: false
  },
  {
    etapeType: 'abd',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'ama',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'and',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'apo',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'css',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'dae',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'des',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'dex',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'dim',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'ihi',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'mcr',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'mdp',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'men',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'mno',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'mod',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'ncl',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'pqr',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'qae',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'rco',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'rpu',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'rtd',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'sas',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'scl',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'spo',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'ssr',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'aof',
    visibilite: true,
    modification: true,
    creation: true
  },
  {
    etapeType: 'asl',
    visibilite: true,
    modification: true,
    creation: true
  },
  {
    etapeType: 'cps',
    visibilite: true,
    modification: true,
    creation: true
  },
  {
    etapeType: 'dsl',
    visibilite: true,
    modification: true,
    creation: true
  },
  {
    etapeType: 'eof',
    visibilite: true,
    modification: true,
    creation: true
  },
  {
    etapeType: 'mfr',
    visibilite: true,
    modification: true,
    creation: true
  },
  {
    etapeType: 'mif',
    visibilite: true,
    modification: true,
    creation: true
  },
  {
    etapeType: 'rif',
    visibilite: true,
    modification: true,
    creation: true
  }
]

// ONF gestionnaire de PER avec restrictions visibilité/création/modification des étapes
const onfPerEtapesRestrictions = [
  {
    etapeType: 'aof',
    visibilite: true,
    modification: true,
    creation: true
  }
]

const titreArm = {
  id: 'titre-id',
  nom: 'nom titre',
  // domaineId: 'm',
  // typeId: 'arm',
  // administrationsGestionnaires: [administrations.onf],
  demarches: [
    {
      id: 'titre-id-demarche-id',
      titreId: 'titre-id',
      typeId: 'oct',
      etapes: [
        {
          id: 'titre-id-demarche-id-etape_id',
          typeId: 'aac',
          ordre: 0,
          titreDemarcheId: 'titre-id-demarche-id',
          statutId: 'enc',
          date: '2020-01-01'
        }
      ]
    }
  ]
}

const titreAxm = {
  id: 'titre-id',
  nom: 'nom titre',
  // domaineId: 'm',
  // typeId: 'axm',
  // administrationsGestionnaires: [administrations.onf],
  demarches: [
    {
      id: 'titre-id-demarche-id',
      titreId: 'titre-id',
      typeId: 'oct',
      etapes: [
        {
          id: 'titre-id-demarche-id-etape_id',
          typeId: 'aac',
          ordre: 0,
          titreDemarcheId: 'titre-id-demarche-id',
          statutId: 'enc',
          date: '2020-01-01'
        }
      ]
    }
  ]
}

const titrePrm = {
  id: 'titre-id',
  nom: 'nom titre',
  // domaineId: 'm',
  // typeId: 'prm',
  // administrationsGestionnaires: [administrations.onf],
  demarches: [
    {
      id: 'titre-id-demarche-id',
      titreId: 'titre-id',
      typeId: 'oct',
      etapes: [
        {
          id: 'titre-id-demarche-id-etape_id',
          typeId: 'aac',
          ordre: 0,
          titreDemarcheId: 'titre-id-demarche-id',
          statutId: 'enc',
          date: '2020-01-01'
        }
      ]
    }
  ]
}

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
          typeId: 'aac',
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
  titreArm,
  titreAxm,
  titrePrm,
  titre
}
