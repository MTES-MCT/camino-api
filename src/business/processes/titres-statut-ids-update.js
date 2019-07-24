import { titreUpdate } from '../../database/queries/titres'
import PQueue from 'p-queue'
import titreStatutIdFind from '../rules/titre-statut-id-find'

const titresStatutIdsUpdate = async titres => {
  const titresUpdatedRequests = titres.reduce((arr, titre) => {
    const statutId = titreStatutIdFind(titre)

    return statutId !== titre.statutId
      ? [
          ...arr,
          async () => {
            await titreUpdate(titre.id, { statutId })
            console.log(
              `Mise à jour: titre ${titre.id} props: ${JSON.stringify({
                statutId
              })}`
            )
          }
        ]
      : arr
  }, [])

  if (titresUpdatedRequests.length) {
    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titresUpdatedRequests)
  }

  return `Mise à jour: ${titresUpdatedRequests.length} titre(s) (statuts).`
}
export default titresStatutIdsUpdate
