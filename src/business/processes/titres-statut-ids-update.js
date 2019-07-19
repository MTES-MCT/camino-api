import { titrePropsUpdate } from '../queries/titres'
import PQueue from 'p-queue'
import titreStatutIdFind from '../rules/titre-statut-id-find'

const titresStatutIdsUpdate = async titres => {
  const titresUpdatedRequests = titres.reduce((arr, titre) => {
    const statutId = titreStatutIdFind(titre)
    const titreUpdated =
      statutId !== titre.statutId &&
      (() => titrePropsUpdate(titre, { statutId }))

    return titreUpdated ? [...arr, titreUpdated] : arr
  }, [])

  if (titresUpdatedRequests.length) {
    const queue = new PQueue({ concurrency: 100 })
    const logs = await queue.addAll(titresUpdatedRequests)
    console.log(logs.join(''))
  }

  return `Mise à jour: statuts de ${titresUpdatedRequests.length} titre(s).`
}
export default titresStatutIdsUpdate
