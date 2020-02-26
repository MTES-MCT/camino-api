import { ITitre } from '../../../types'

const titresSortAndLimit = (
  titres: ITitre[],
  {
    intervalle,
    page,
    ordre
  }: {
    intervalle?: number | null
    page?: number | null
    ordre?: 'asc' | 'desc' | null
  }
) => {
  titres = titres.sort((a, b) => {
    const aActivitesTotal = a.activitesAbsentes! + a.activitesEnConstruction!

    const bActivitesTotal = b.activitesAbsentes! + b.activitesEnConstruction!

    const diff = aActivitesTotal - bActivitesTotal

    return diff * (ordre && ordre === 'desc' ? -1 : 1)
  })

  if (intervalle) {
    page = page || 0
    titres = titres.slice((page - 1) * intervalle, page * intervalle)
  }

  return titres
}

export { titresSortAndLimit }
