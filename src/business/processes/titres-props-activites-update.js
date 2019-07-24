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

      return value !== titre[prop] ? { ...props, [prop]: value } : props
    }, {})

    return Object.keys(props).length
      ? [
          ...acc,
          async () => {
            await titreUpdate(titre.id, props)
            console.log(
              `Mise à jour: titre ${titre.id} props: ${JSON.stringify(props)}`
            )
          }
        ]
      : acc
  }, [])

  if (titreUpdateRequests.length) {
    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titreUpdateRequests)
  }

  return `Mise à jour: ${titreUpdateRequests.length} titre(s) (propriétés-activités).`
}

export default titresPropsActivitesUpdate
