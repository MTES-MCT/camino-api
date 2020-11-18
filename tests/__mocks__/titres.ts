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

export { titreWithActiviteGrp, titrePublicLecture }
