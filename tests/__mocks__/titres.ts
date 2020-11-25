// import { titre } from '../../src/api/graphql/resolvers/titres'
import { administrations } from './administrations'

// liste des statuts de titre
const titresStatuts = [
  { id: 'dmc', nom: 'demande classée' },
  { id: 'dmi', nom: 'demande initiale' },
  { id: 'ech', nom: 'échu' },
  { id: 'ind', nom: 'indéterminé' },
  { id: 'mod', nom: 'modification en instance' },
  { id: 'val', nom: 'valide' }
]

// liste des statuts d'étape
const etapesStatuts = [
  {
    id: 'aac',
    nom: 'avis de direction régionale des affaires culturelles',
    ordre: 58
  },
  {
    id: 'aaf',
    nom: "avis de la direction d'alimentation de l'agriculture et de la forêt",
    ordre: 56
  },
  { id: 'abd', nom: 'abrogation de la décision', ordre: 88 },
  {
    id: 'abs',
    nom:
      'avis DGTM service milieux naturels, biodiversité, sites et paysages (MNBST)',
    ordre: 53
  },
  {
    id: 'aca',
    nom:
      'avis de la commission des autorisations de recherches minières (CARM)',
    ordre: 66
  },
  {
    id: 'acd',
    nom:
      "avis du conseil départemental de l'environnement et des risques sanitaires et technologiques (Coderst)",
    ordre: 102
  },
  { id: 'acg', nom: 'avis du conseil général chargé des mines', ordre: 73 },
  { id: 'acl', nom: "avis d'une collectivité locale", ordre: 45 },
  {
    id: 'aco',
    nom: "signature de l'avenant à l’autorisation de recherche minière",
    ordre: 95
  },
  {
    id: 'aec',
    nom:
      "avis de la direction des entreprises, de la concurrence, de la consommation, du travail et de l'emploi",
    ordre: 62
  },
  { id: 'aep', nom: "avis d'un président d'EPCI", ordre: 44 },
  {
    id: 'afp',
    nom: 'avis de la direction régionale des finances publiques',
    ordre: 61
  },
  { id: 'agn', nom: 'avis de la gendarmerie nationale', ordre: 60 },
  { id: 'aim', nom: "avis de l'Ifremer", ordre: 51 },
  { id: 'ama', nom: "avis d'un maire", ordre: 43 },
  { id: 'ami', nom: 'avis du parc naturel marin', ordre: 52 },
  { id: 'and', nom: 'décision du juge administratif', ordre: 89 },
  { id: 'ane', nom: 'avis de mise en concurrence au JOUE', ordre: 25 },
  { id: 'anf', nom: 'avis de mise en concurrence au JORF', ordre: 24 },
  { id: 'aof', nom: "avis de l'Office national des forêts", ordre: 37 },
  {
    id: 'aop',
    nom: "avis de l'Institut national de l'origine et de la qualité",
    ordre: 38
  },
  { id: 'apd', nom: 'avis du DREAL, DEAL ou DGTM', ordre: 46 },
  { id: 'ape', nom: "avis du Conseil d'Etat", ordre: 76 },
  {
    id: 'api',
    nom: "avis de l'état major orpaillage et pêche illicite (EMOPI)",
    ordre: 59
  },
  { id: 'apl', nom: "avis d'un service administratif local", ordre: 39 },
  { id: 'apm', nom: "avis de l'autorité militaire", ordre: 40 },
  { id: 'apn', nom: 'avis du parc national', ordre: 48 },
  {
    id: 'apo',
    nom: 'avis de la commission départementale des mines (CDM)',
    ordre: 64
  },
  { id: 'app', nom: 'avis du préfet', ordre: 67 },
  { id: 'apu', nom: "publication de l'avis de décision implicite", ordre: 19 },
  { id: 'apw', nom: 'avis du préfet maritime', ordre: 68 },
  { id: 'ari', nom: 'avis de la réunion interservice', ordre: 50 },
  { id: 'ars', nom: "avis de l'agence régionale de santé", ordre: 57 },
  { id: 'asl', nom: 'décision du propriétaire du sol', ordre: 4 },
  {
    id: 'ass',
    nom: 'avis de la caisse générale de sécurité sociale',
    ordre: 55
  },
  {
    id: 'auc',
    nom:
      'avis DGTM service aménagement, urbanisme, construction, logement (AUCL)',
    ordre: 54
  },

  { id: 'awd', nom: 'second donné acte', ordre: 98 },
  { id: 'awu', nom: 'premier donné acte', ordre: 97 },
  { id: 'cac', nom: 'consultation des administrations centrales', ordre: 69 },
  { id: 'cim', nom: 'concertation interministérielle', ordre: 70 },
  {
    id: 'cod',
    nom:
      "saisine du conseil départemental de l'environnement et des risques sanitaires et technologiques  (Coderst)",
    ordre: 41
  },
  {
    id: 'cps',
    nom: "confirmation de l'accord du propriétaire du sol",
    ordre: 32
  },
  { id: 'css', nom: 'classement sans suite', ordre: 79 },
  {
    id: 'dae',
    nom:
      'décision de la mission autorité environnementale (examen au cas par cas du projet)',
    ordre: 7
  },

  { id: 'def', nom: "décision de l'Office national des forêts", ordre: 47 },
  { id: 'des', nom: 'désistement du demandeur', ordre: 10 },
  { id: 'dex', nom: "décision de l'administration", ordre: 80 },
  { id: 'dim', nom: 'décision implicite', ordre: 78 },
  { id: 'dpu', nom: 'publication de décision au JORF', ordre: 81 },
  { id: 'dsl', nom: "demande d'accord du propriétaire du sol", ordre: 2 },
  {
    id: 'dup',
    nom: 'publication de décision administrative au JORF',
    ordre: 83
  },
  { id: 'dux', nom: 'décision administrative', ordre: 82 },
  { id: 'ede', nom: 'expertise DREAL ou DGTM service eau', ordre: 33 },
  {
    id: 'edm',
    nom:
      'expertise DGTM service prévention des risques et industries extractives (DATE)',
    ordre: 34
  },
  { id: 'eof', nom: "expertise de l'Office national des forêts", ordre: 36 },
  { id: 'epc', nom: "clôture de l'enquête publique", ordre: 30 },
  { id: 'epu', nom: "ouverture de l'enquête publique", ordre: 28 },
  { id: 'esb', nom: 'expertise DREAL ou DGTM service biodiversité', ordre: 35 },
  { id: 'ide', nom: 'initiation de la démarche de retrait', ordre: 8 },
  { id: 'ihi', nom: 'informations historiques incomplètes', ordre: 96 },
  { id: 'mco', nom: 'demande de compléments', ordre: 13 },
  { id: 'mcp', nom: 'complétude de la demande', ordre: 17 },
  { id: 'mcr', nom: 'recevabilité de la demande', ordre: 18 },
  { id: 'mdp', nom: 'dépôt de la demande', ordre: 5 },
  { id: 'mec', nom: 'avis de demande concurrente', ordre: 26 },
  { id: 'men', nom: 'enregistrement de la demande', ordre: 6 },
  {
    id: 'meo',
    nom: "prise en charge par l'Office national des forêts",
    ordre: 22
  },
  { id: 'mfr', nom: 'demande', ordre: 1 },
  { id: 'mif', nom: "demande d'informations", ordre: 15 },
  { id: 'mno', nom: 'notification au demandeur', ordre: 90 },
  { id: 'mod', nom: 'modification de la demande', ordre: 12 },
  { id: 'ncl', nom: 'notification des collectivités locales', ordre: 91 },
  { id: 'nis', nom: 'note interne signalée', ordre: 101 },
  { id: 'npp', nom: 'notification au préfet', ordre: 84 },
  {
    id: 'pfc',
    nom: 'paiement des frais de dossier complémentaires',
    ordre: 92
  },
  { id: 'pfd', nom: 'paiement des frais de dossier', ordre: 11 },
  { id: 'pnr', nom: 'avis du parc naturel régional', ordre: 49 },
  { id: 'ppc', nom: 'clôture de la participation du public', ordre: 29 },
  { id: 'ppu', nom: 'ouverture de la participation du public', ordre: 27 },
  {
    id: 'pqr',
    nom: 'publication dans un journal local ou national',
    ordre: 86
  },
  { id: 'qae', nom: "demande d'examen au cas par cas", ordre: 3 },
  { id: 'rcg', nom: 'rapport du conseil général chargé des mines', ordre: 72 },
  { id: 'rco', nom: 'réception de compléments', ordre: 14 },
  { id: 'rde', nom: "récépissé de déclaration loi sur l'eau", ordre: 20 },
  {
    id: 'rdt',
    nom: "récépissé de déclaration d'ouverture de travaux miniers",
    ordre: 21
  },
  { id: 'rif', nom: "réception d'information", ordre: 16 },
  { id: 'rpe', nom: 'rapport du Conseil d’État', ordre: 75 },
  {
    id: 'rpu',
    nom: 'publication de décision au recueil des actes administratifs',
    ordre: 85
  },
  { id: 'rtd', nom: 'retrait de la décision', ordre: 87 },
  { id: 'rwp', nom: 'récolement partiel', ordre: 99 },
  { id: 'rwt', nom: 'récolement complet', ordre: 100 },
  { id: 'sas', nom: "saisine de l'autorité signataire", ordre: 77 },
  {
    id: 'sca',
    nom:
      'saisine de la commission des autorisations de recherches minières (CARM)',
    ordre: 65
  },
  { id: 'scg', nom: 'saisine du conseil général chargé des mines', ordre: 71 },
  { id: 'scl', nom: 'saisine des collectivités locales', ordre: 42 },
  {
    id: 'sco',
    nom: 'signature de l’autorisation de recherche minière',
    ordre: 94
  },
  { id: 'spe', nom: "saisine du Conseil d'Etat", ordre: 74 },
  {
    id: 'spo',
    nom: 'saisine de la commission départementale des mines (CDM)',
    ordre: 63
  },
  { id: 'spp', nom: 'saisine du préfet', ordre: 9 },
  { id: 'ssr', nom: 'saisine des services', ordre: 31 },
  {
    id: 'vfc',
    nom: 'validation du paiement des frais de dossier complémentaires',
    ordre: 93
  },
  { id: 'vfd', nom: 'validation du paiement des frais de dossier', ordre: 23 }
]

interface IEtapeRestriction {
  etapeType: string
  visibilite: boolean
  modification: boolean
  creation: boolean
}

// écrit les jeux de test des étapes en fonction des restrictions
// restriction de visibilité
const restrictionsVisibiliteSet = (etapesRestriction: IEtapeRestriction[]) =>
  etapesRestriction.map(etape => [
    etape.visibilite ? 'peut' : 'ne peut pas',
    etapesStatuts.find(statut => statut.id === etape.etapeType)?.nom,
    etape.etapeType,
    [
      {
        id: `titre-id-demarche-id-${etape.etapeType}`,
        typeId: etape.etapeType,
        ordre: etapesStatuts.find(statut => statut.id === etape.etapeType)
          ?.ordre,
        titreDemarcheId: 'titre-id-demarche-id',
        statutId: 'acc',
        date: '2020-02-02'
      }
    ],
    etape.visibilite
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
    etape.modification ? 'peut' : 'ne peut pas',
    etapesStatuts.find(statut => statut.id === etape.etapeType)?.nom,
    etape.etapeType,
    [
      {
        id: `titre-id-demarche-id-${etape.etapeType}`,
        typeId: etape.etapeType,
        ordre: etapesStatuts.find(statut => statut.id === etape.etapeType)
          ?.ordre,
        titreDemarcheId: 'titre-id-demarche-id',
        statutId: 'acc',
        date: '2020-02-02'
      }
    ],
    etape.visibilite
      ? [
          {
            modification: etape.modification ? true : null
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
    visibilite: true,
    modification: true,
    creation: true
  },
  {
    etapeType: 'mcp',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'dae',
    visibilite: true,
    modification: true,
    creation: true
  },
  { etapeType: 'mif', visibilite: true, modification: true, creation: true },
  {
    etapeType: 'men',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'edm',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'ede',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'mod',
    visibilite: true,
    modification: true,
    creation: true
  },
  {
    etapeType: 'nis',
    visibilite: false,
    modification: true,
    creation: true
  },
  {
    etapeType: 'rde',
    visibilite: true,
    modification: false,
    creation: false
  },
  {
    etapeType: 'rif',
    visibilite: true,
    modification: true,
    creation: true
  },
  {
    etapeType: 'mcr',
    visibilite: true,
    modification: true,
    creation: true
  },
  {
    etapeType: 'sca',
    visibilite: true,
    modification: true,
    creation: true
  }
]

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

const titreWithActiviteGrp = {
  id: 'titre-id',
  nom: 'mon titre',
  domaineId: 'm',
  typeId: 'axm',
  publicLecture: true,
  administrationsTitreEtapeId: 'titre-id-demarche-id-dpu',
  administrationsGestionnaires: [administrations.ptmg],
  activites: [
    {
      titreId: 'titre-id',
      id: 'titre-id-grp-2020-03',
      date: '2020-10-01',
      typeId: 'grp',
      statutId: 'abs',
      frequencePeriodeId: 3,
      annee: 2020,
      utilisateurId: null
    }
  ],
  demarches: [
    {
      id: 'titre-id-demarche-id',
      titreId: 'titre-id',
      typeId: 'oct',
      publicLecture: true,
      etapes: [
        {
          id: 'titre-id-demarche-id-dpu',
          typeId: 'dpu',
          ordre: 0,
          titreDemarcheId: 'titre-id-demarche-id',
          statutId: 'acc',
          date: '2020-02-02',
          administrationsIds: ['dea-guyane-01']
        }
      ]
    }
  ]
}

const titrePublicLecture = {
  id: 'titre-id',
  nom: 'mon titre',
  domaineId: 'm',
  typeId: 'arm',
  publicLecture: true
}

const titrePublicLectureFalse = {
  id: 'titre-id',
  nom: 'mon titre',
  domaineId: 'm',
  typeId: 'arm',
  publicLecture: false
}

const titreEtapesPubliques = {
  id: 'titre-id',
  nom: 'mon titre',
  domaineId: 'm',
  typeId: 'arm',
  publicLecture: true,
  administrationsGestionnaires: [administrations.onf],
  administrationsTitreEtapeId: 'titre-id-demarche-id-dpu',
  demarches: [
    {
      id: 'titre-id-demarche-id',
      titreId: 'titre-id',
      typeId: 'oct',
      statutId: 'acc',
      publicLecture: true,
      etapes: [
        {
          id: 'titre-id-demarche-id-aof',
          typeId: 'aof',
          ordre: 0,
          titreDemarcheId: 'titre-id-demarche-id',
          statutId: 'acc',
          date: '2020-02-02'
        },
        {
          id: 'titre-id-demarche-id-eof',
          typeId: 'eof',
          ordre: 0,
          titreDemarcheId: 'titre-id-demarche-id',
          statutId: 'acc',
          date: '2020-02-02'
        },
        {
          id: 'titre-id-demarche-id-edm',
          typeId: 'edm',
          ordre: 0,
          titreDemarcheId: 'titre-id-demarche-id',
          statutId: 'acc',
          date: '2020-02-02'
        },
        {
          id: 'titre-id-demarche-id-ede',
          typeId: 'ede',
          ordre: 0,
          titreDemarcheId: 'titre-id-demarche-id',
          statutId: 'acc',
          date: '2020-02-02'
        },
        {
          id: 'titre-id-demarche-id-pfd',
          typeId: 'pfd',
          ordre: 0,
          titreDemarcheId: 'titre-id-demarche-id',
          statutId: 'acc',
          date: '2020-02-02'
        },
        {
          id: 'titre-id-demarche-id-pfc',
          typeId: 'pfc',
          ordre: 0,
          titreDemarcheId: 'titre-id-demarche-id',
          statutId: 'acc',
          date: '2020-02-02'
        },
        {
          id: 'titre-id-demarche-id-vfd',
          typeId: 'vfd',
          ordre: 0,
          titreDemarcheId: 'titre-id-demarche-id',
          statutId: 'acc',
          date: '2020-02-02'
        },
        {
          id: 'titre-id-demarche-id-vfc',
          typeId: 'vfc',
          ordre: 0,
          titreDemarcheId: 'titre-id-demarche-id',
          statutId: 'acc',
          date: '2020-02-02'
        },
        {
          id: 'titre-id-demarche-id-dpu',
          typeId: 'dpu',
          ordre: 0,
          titreDemarcheId: 'titre-id-demarche-id',
          statutId: 'acc',
          date: '2020-02-02',
          administrationsIds: ['dea-guyane-01']
        }
      ]
    }
  ]
}

const titreDemarchesPubliques = {
  id: 'titre-id',
  nom: 'mon titre',
  domaineId: 'm',
  typeId: 'arm',
  publicLecture: true,
  demarches: [
    {
      id: 'titre-id-demarche-oct',
      titreId: 'titre-id',
      typeId: 'oct',
      publicLecture: true
    },
    {
      id: 'titre-id-demarche-pro',
      titreId: 'titre-id',
      typeId: 'pro',
      publicLecture: false
    }
  ]
}

const titreActivites = {
  id: 'titre-id',
  nom: 'mon titre',
  domaineId: 'm',
  typeId: 'arm',
  publicLecture: true,
  activites: [
    {
      id: 'titre-id-activites-oct',
      titreId: 'titre-id',
      typeId: 'grp',
      date: '2020-01-01',
      statutId: 'dep',
      frequencePeriodeId: 1,
      annee: 2020
    },
    {
      id: 'titre-id-activites-pro',
      titreId: 'titre-id',
      typeId: 'gra',
      date: '2020-01-01',
      statutId: 'dep',
      frequencePeriodeId: 1,
      annee: 2020
    }
  ]
}

const titreOnfArm = {
  id: 'titre-id',
  nom: 'nom titre',
  domaineId: 'm',
  typeId: 'arm',
  administrationsGestionnaires: [administrations.onf],
  demarches: [
    {
      id: 'titre-id-demarche-id',
      titreId: 'titre-id',
      typeId: 'oct',
      etapes: []
    }
  ]
}

const titreOnfAxm = {
  id: 'titre-id',
  nom: 'nom titre',
  domaineId: 'm',
  typeId: 'axm',
  administrationsGestionnaires: [administrations.onf],
  demarches: [
    {
      id: 'titre-id-demarche-id',
      titreId: 'titre-id',
      typeId: 'oct',
      etapes: []
    }
  ]
}

const titreOnfPrm = {
  id: 'titre-id',
  nom: 'nom titre',
  domaineId: 'm',
  typeId: 'prm',
  administrationsGestionnaires: [administrations.onf],
  demarches: [
    {
      id: 'titre-id-demarche-id',
      titreId: 'titre-id',
      typeId: 'oct',
      etapes: []
    }
  ]
}

export {
  titresStatuts,
  restrictionsVisibiliteSet,
  restrictionsModificationSet,
  onfArmEtapesRestrictions,
  onfAxmEditionRestriction,
  onfAxmEtapesRestrictions,
  onfPerEtapesRestrictions,
  titreWithActiviteGrp,
  titrePublicLecture,
  titrePublicLectureFalse,
  titreEtapesPubliques,
  titreDemarchesPubliques,
  titreActivites,
  titreOnfArm,
  titreOnfAxm,
  titreOnfPrm
}
