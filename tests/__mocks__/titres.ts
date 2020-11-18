import { administrations } from './administrations'

const titreWithActiviteGrp = {
  id: 'titre-id',
  nom: 'mon titre',
  domaineId: 'm',
  typeId: 'axm',
  publicLecture: true,
  administrationsGestionnaires: [
    administrations.ptmg,
    administrations.dealGuyane
  ],
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
  demarches: [
    {
      id: 'titre-id-demarche-id',
      titreId: 'titre-id',
      typeId: 'oct',
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
          date: '2020-02-02'
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

export {
  titreWithActiviteGrp,
  titrePublicLecture,
  titrePublicLectureFalse,
  titreEtapesPubliques,
  titreDemarchesPubliques,
  titreActivites
}
