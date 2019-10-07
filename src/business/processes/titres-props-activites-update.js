import PQueue from 'p-queue'

import { titreUpdate } from '../../database/queries/titres'
import titrePropActivitesCount from '../utils/titre-prop-activites-count'

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
  const queue = new PQueue({ concurrency: 100 })

  const titresUpdated = titres.reduce((titresUpdated, titre) => {
    const props = activitesProps.reduce((props, { id, prop }) => {
      const value = titrePropActivitesCount(titre.activites, id)

      if (value !== titre[prop]) {
        props[prop] = value
      }

      return props
    }, {})

    if (Object.keys(props).length) {
      queue.add(async () => {
        const titreUpdated = await titreUpdate(titre.id, props)
        console.log(
          `mise à jour: titre ${titre.id} props: ${JSON.stringify(props)}`
        )

        titresUpdated.push(titreUpdated)
      })
    }

    return titresUpdated
  }, [])

  await queue.onIdle()

  return titresUpdated
}

export default titresPropsActivitesUpdate
