import { titrePropsUpdate } from '../queries/titres'
import titrePropActivitesCount from '../utils/titre-prop-activites-count'
import PQueue from 'p-queue'

const activitesProps = [
  { id: 'abs', prop: 'activitesAbsentes' },
  { id: 'enc', prop: 'activitesEnConstruction' },
  { id: 'dep', prop: 'activitesDeposees' }
]
const titresPropsActivitesUpdate = async titres => {
  const titreUpdateRequests = titres.reduce((acc, titre) => {
    const props = activitesProps.reduce((props, { id, prop }) => {
      const value = titrePropActivitesCount(titre.activites, id)

      return value !== titre[prop] ? { ...props, [prop]: value } : props
    }, {})

    return Object.keys(props).length
      ? [...acc, () => titrePropsUpdate(titre, props)]
      : acc
  }, [])

  if (titreUpdateRequests.length) {
    const queue = new PQueue({ concurrency: 100 })
    const logs = await queue.addAll(titreUpdateRequests)
    console.log(logs.join(''))
  }

  return `Mise à jour: propriétés (activités) de ${titreUpdateRequests.length} titre(s).`
}

export default titresPropsActivitesUpdate
