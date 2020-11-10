import TitresActivites from '../../../database/models/titres-activites'

const titresActivitesDelaiDepasse = [
  {
    date: '1000-01-01',
    statutId: 'abs',
    type: { delaiMois: 3 }
  }
] as TitresActivites[]

const titresActivitesDelaiNonDepasse = [
  {
    date: '3000-01-01',
    statutId: 'abs',
    type: { delaiMois: 3 }
  }
] as TitresActivites[]

export { titresActivitesDelaiDepasse, titresActivitesDelaiNonDepasse }
