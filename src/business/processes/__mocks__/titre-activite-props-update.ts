import Titres from '../../../database/models/titres'
const activiteType = {
  frequence: {
    periodesNom: 'trimestres',
    trimestres: [
      { id: 1, nom: '1er trimestre', frequenceId: 'tri' },
      { id: 2, nom: '2e trimestre', frequenceId: 'tri' },
      { id: 3, nom: '3e trimestre', frequenceId: 'tri' },
      { id: 4, nom: '4e trimestre', frequenceId: 'tri' }
    ]
  }
}

const titresActivitesToUpdate = [
  {
    id: 'titre-id',
    typeId: 'axm',
    demarches: [{}],
    activites: [
      {
        id: 'titre-activite-id-2019-03',
        date: '2019-10-01',
        annee: 2019,
        periodeId: 3,
        type: activiteType,
        suppression: true
      },
      {
        id: 'titre-activite-id-2019-04',
        date: '2020-01-01',
        annee: 2019,
        periodeId: 4,
        type: activiteType
      },
      {
        id: 'titre-activite-id-2020-01',
        date: '2020-04-01',
        annee: 2020,
        periodeId: 1,
        type: activiteType,
        suppression: true
      },
      {
        id: 'titre-activite-id-2020-02',
        date: '2020-07-01',
        annee: 2020,
        periodeId: 2,
        type: activiteType
      }
    ]
  }
] as unknown as Titres[]

const titresActivitesNotToUpdate = [
  {
    id: 'titre-id',
    typeId: 'axm'
  },
  {
    id: 'titre-id',
    typeId: 'axm',
    activites: []
  },
  {
    id: 'titre-id',
    typeId: 'axm',
    activites: [
      {
        id: 'titre-activite-id-2019-03',
        date: '2019-10-01',
        annee: 2019,
        periodeId: 3,
        type: activiteType,
        suppression: true
      }
    ]
  },
  {
    id: 'titre-id',
    typeId: 'axm',
    demarches: [],
    activites: [
      {
        id: 'titre-activite-id-2019-03',
        date: '2019-10-01',
        annee: 2019,
        statutId: 'abs',
        periodeId: 3,
        type: activiteType,
        suppression: true
      }
    ]
  }
] as unknown as Titres[]

export { titresActivitesToUpdate, titresActivitesNotToUpdate }
