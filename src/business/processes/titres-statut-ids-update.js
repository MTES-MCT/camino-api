import { titrePropsUpdate } from '../queries/titres'
import PQueue from 'p-queue'
import titreStatutIdFind from '../rules/titre-statut-id-find'

const titresStatutIdsUpdate = async titres => {
  const titresUpdatedRequests = titres.reduce((arr, titre) => {
    const statutId = titreStatutIdFind(titre)
    const titreUpdated =
      statutId !== titre.statutId &&
      (() => titrePropsUpdate(titre.id, { statutId }).then(console.log))

    return titreUpdated ? [...arr, titreUpdated] : arr
  }, [])

  if (titresUpdatedRequests.length) {
    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titresUpdatedRequests)
  }

  return `Mise à jour: statuts de ${titresUpdatedRequests.length} titre(s).`
}
export default titresStatutIdsUpdate
