import { titrePropUpdate } from '../queries/titres'
import titrePropActivitesCount from '../utils/titre-prop-activites-count'

const activitesProps = [
  { id: 'abs', prop: 'activitesAbsentes' },
  { id: 'enc', prop: 'activitesEnConstruction' },
  { id: 'dep', prop: 'activitesDeposees' }
]
const titresPropsActivitesUpdate = async titres => {
  const titreUpdateRequests = titres.reduce((arr, titre) => {
    const titrePropsUpdateRequests = activitesProps.reduce(
      (acc, { id, prop }) => {
        const value = titrePropActivitesCount(titre.activites, id)
        const titrePropUpdated = titrePropUpdate(titre, prop, value)

        return titrePropUpdated ? [...acc, titrePropUpdated] : acc
      },
      []
    )

    return [...arr, ...titrePropsUpdateRequests]
  }, [])

  if (titreUpdateRequests.length) {
    const titreUpdateQueries = titreUpdateRequests.map(q =>
      q.then(log => console.log(log))
    )
    await Promise.all(titreUpdateQueries)
  }

  return `Mise à jour: ${titreUpdateRequests.length} propriétés (activités) de titres.`
}

export default titresPropsActivitesUpdate
