import { ITitreActivite } from '../../../types'

const titreActiviteFermee = {
  statutId: 'fer',
  date: '1000-01-01',
  type: { delaiMois: 3 }
} as ITitreActivite

const titreActiviteDeposee = {
  statutId: 'dep',
  date: '1000-01-01',
  type: { delaiMois: 3 }
} as ITitreActivite

const titreActiviteAbsenteDelaiDepasse = {
  statutId: 'abs',
  date: '1000-01-01',
  type: { delaiMois: 3 }
} as ITitreActivite

const titreActiviteEnCoursDelaiNonDepasse = {
  statutId: 'enc',
  date: '3000-01-01',
  type: { delaiMois: 3 }
} as ITitreActivite

export {
  titreActiviteFermee,
  titreActiviteDeposee,
  titreActiviteAbsenteDelaiDepasse,
  titreActiviteEnCoursDelaiNonDepasse
}
