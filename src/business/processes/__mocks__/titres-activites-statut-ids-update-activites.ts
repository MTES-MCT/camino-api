import { ITitreActivite } from '../../../types'

const titresActivitesDelaiDepasse = [
  {
    date: '1000-01-01',
    statutId: 'abs',
    type: { delaiMois: 3 }
  }
] as ITitreActivite[]

const titresActivitesDelaiNonDepasse = [
  {
    date: '3000-01-01',
    statutId: 'abs',
    type: { delaiMois: 3 }
  }
] as ITitreActivite[]

export { titresActivitesDelaiDepasse, titresActivitesDelaiNonDepasse }
