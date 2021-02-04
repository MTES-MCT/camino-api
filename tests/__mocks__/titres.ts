import { administrations } from './administrations'
import { IAdministration, ITitre } from '../../src/types'

const titreWithActiviteGrp = {
  id: 'titre-id',
  nom: 'mon titre',
  domaineId: 'm',
  typeId: 'axm',
  publicLecture: true,
  propsTitreEtapesIds: { administrations: 'titre-id-demarche-id-dpu' },
  administrationsGestionnaires: [administrations.ptmg],
  activites: [
    {
      titreId: 'titre-id',
      id: 'titre-id-grp-2020-03',
      date: '2020-10-01',
      typeId: 'grp',
      statutId: 'abs',
      periodeId: 3,
      annee: 2020,
      utilisateurId: null,
      sections: [
        {
          id: 'renseignements',
          elements: [
            {
              id: 'orBrut',
              nom: 'Or brut extrait (g)',
              type: 'number',
              description: 'Masse d’or brut'
            },
            {
              id: 'orExtrait',
              nom: 'Or extrait (g)',
              type: 'number',
              description: "Masse d'or brut extrait au cours du trimestre."
            }
          ]
        }
      ]
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
          administrations: [{ id: 'dea-guyane-01' }] as IAdministration[]
        }
      ]
    }
  ]
} as ITitre

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
  propsTitreEtapesIds: { administrations: 'titre-id-demarche-id-dpu' },
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
      periodeId: 1,
      annee: 2020,
      sections: [
        {
          id: 'renseignements',
          elements: [
            {
              id: 'orBrut',
              nom: 'Or brut extrait (g)',
              type: 'number',
              dateDebut: '2018-01-01',
              description: 'Masse d’or brut'
            },
            {
              id: 'orExtrait',
              nom: 'Or extrait (g)',
              type: 'number',
              description: "Masse d'or brut extrait au cours du trimestre."
            }
          ]
        }
      ]
    },
    {
      id: 'titre-id-activites-pro',
      titreId: 'titre-id',
      typeId: 'gra',
      date: '2020-01-01',
      statutId: 'dep',
      periodeId: 1,
      annee: 2020,
      sections: [
        {
          id: 'renseignements',
          elements: [
            {
              id: 'orBrut',
              nom: 'Or brut extrait (g)',
              type: 'number',
              description: 'Masse d’or brut'
            },
            {
              id: 'orExtrait',
              nom: 'Or extrait (g)',
              type: 'number',
              description: "Masse d'or brut extrait au cours du trimestre."
            }
          ]
        }
      ]
    }
  ]
} as ITitre

export {
  titreWithActiviteGrp,
  titrePublicLecture,
  titrePublicLectureFalse,
  titreEtapesPubliques,
  titreDemarchesPubliques,
  titreActivites
}
