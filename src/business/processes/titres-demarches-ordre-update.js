import { titreDemarcheUpdate } from '../queries/titre-demarches'
import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'
import PQueue from 'p-queue'

const titreDemarchesOrdreUpdate = titreDemarches =>
  titreDemarchesAscSort(titreDemarches).reduce(
    (acc, titreDemarche, index) =>
      titreDemarche.ordre !== index + 1
        ? [
            ...acc,
            () =>
              titreDemarcheUpdate(titreDemarche.id, { ordre: index + 1 }).then(
                console.log
              )
          ]
        : acc,
    []
  )

const titresDemarchesOrdreUpdate = async titres => {
  const titresDemarchesUpdated = titres.reduce((acc, titre) => {
    const titreDemarchesOrdreUpdated = titreDemarchesOrdreUpdate(
      titre.demarches.slice().reverse()
    )

    return !titreDemarchesOrdreUpdated.length
      ? acc
      : [...acc, ...titreDemarchesOrdreUpdated]
  }, [])

  if (titresDemarchesUpdated.length) {
    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titresDemarchesUpdated)
  }

  return `Mise à jour: ${titresDemarchesUpdated.length} démarche(s) (ordre).`
}

export default titresDemarchesOrdreUpdate
