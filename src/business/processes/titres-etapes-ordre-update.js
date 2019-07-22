import PQueue from 'p-queue'
import { titreEtapeUpdate } from '../queries/titre-etapes'
import titreEtapesAscSortByDate from '../utils/titre-etapes-asc-sort-by-date'

const titreEtapesOrdreUpdate = titreEtapes =>
  titreEtapesAscSortByDate(titreEtapes).reduce(
    (queries, titreEtape, index) =>
      titreEtape.ordre !== index + 1
        ? [
            ...queries,
            () =>
              titreEtapeUpdate(titreEtape.id, { ordre: index + 1 }).then(
                console.log
              )
          ]
        : queries,
    []
  )

const titresEtapesOrdreUpdate = async titresDemarches => {
  const titresEtapesUpdated = titresDemarches.reduce(
    (arr, titreDemarche) => [
      ...arr,
      ...titreEtapesOrdreUpdate(titreDemarche.etapes)
    ],
    []
  )

  if (titresEtapesUpdated.length) {
    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titresEtapesUpdated)
  }

  return `Mise à jour: ${titresEtapesUpdated.length} étape(s) (ordre).`
}

export default titresEtapesOrdreUpdate
