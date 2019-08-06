import { titreUpdate } from '../../database/queries/titres'
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

      if (value !== titre[prop]) {
        props[prop] = value
      }

      return props
    }, {})

    if (Object.keys(props).length) {
      acc.push(async () => {
        await titreUpdate(titre.id, props)
        console.log(
          `mise à jour: titre ${titre.id} props: ${JSON.stringify(props)}`
        )
      })
    }

    return acc
  }, [])

  if (titreUpdateRequests.length) {
    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titreUpdateRequests)
  }

  return `mise à jour: ${titreUpdateRequests.length} titre(s) (propriétés-activités)`
}

export default titresPropsActivitesUpdate
