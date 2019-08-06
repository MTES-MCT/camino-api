import { titreUpdate } from '../../database/queries/titres'
import PQueue from 'p-queue'
import titreStatutIdFind from '../rules/titre-statut-id-find'

const titresStatutIdsUpdate = async titres => {
  const titresUpdatedRequests = titres.reduce((arr, titre) => {
    const statutId = titreStatutIdFind(titre)

    if (statutId !== titre.statutId) {
      arr.push(async () => {
        await titreUpdate(titre.id, { statutId })
        console.log(
          `mise à jour: titre ${titre.id} props: ${JSON.stringify({
            statutId
          })}`
        )
      })
    }

    return arr
  }, [])

  if (titresUpdatedRequests.length) {
    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titresUpdatedRequests)
  }

  return `mise à jour: ${titresUpdatedRequests.length} titre(s) (statuts)`
}
export default titresStatutIdsUpdate
