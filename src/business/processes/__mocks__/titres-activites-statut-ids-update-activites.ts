import { ITitresActivites } from '../../../types'

const titresActivitesDelaiDepasse = ([
  {
    date: '1000-01-01',
    activiteStatutId: 'abs',
    type: {
      delaiMois: 3
    }
  }
] as unknown) as ITitresActivites[]

const titresActivitesDelaiNonDepasse = ([
  {
    date: '3000-01-01',
    activiteStatutId: 'abs',
    type: {
      delaiMois: 3
    }
  }
] as unknown) as ITitresActivites[]

export { titresActivitesDelaiDepasse, titresActivitesDelaiNonDepasse }
