import { titreUpdate } from '../../database/queries/titres'
import titrePropActivitesCount from '../utils/titre-prop-activites-count'
import PQueue from 'p-queue'

const activitesProps = [
  {
    id: 'abs',
    prop: 'activitesAbsentes'
  },
  {
    id: 'enc',
    prop: 'activitesEnConstruction'
  },
  {
    id: 'dep',
    prop: 'activitesDeposees'
  }
]

const titresPropsActivitesUpdate = async titres => {
  const titresToUpdate = titres.reduce((acc, titre) => {
    const props = activitesProps.reduce((props, { id, prop }) => {
      const value = titrePropActivitesCount(titre.activites, id)

      if (value !== titre[prop]) {
        props[prop] = value
      }

      return props
    }, {})

    if (Object.keys(props).length) {
      acc.push({
        id: titre.id,
        ...props
      })
    }

    return acc
  }, [])

  if (!titresToUpdate.length) {
    return []
  }

  const titresUpdated = titresToUpdate.map(({ id, ...props }) => async () => {
    const titreUpdated = await titreUpdate(id, props)
    console.log(`mise à jour: titre ${id} props: ${JSON.stringify(props)}`)

    return titreUpdated
  })

  const queue = new PQueue({
    concurrency: 100
  })

  return queue.addAll(titresUpdated)
}

export default titresPropsActivitesUpdate
