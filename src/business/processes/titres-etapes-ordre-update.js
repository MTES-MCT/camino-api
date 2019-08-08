import PQueue from 'p-queue'
import { titreEtapeUpdate } from '../../database/queries/titres-etapes'
import titreEtapesAscSortByDate from '../utils/titre-etapes-asc-sort-by-date'

const titreEtapesOrdreUpdate = titreEtapes =>
  titreEtapesAscSortByDate(titreEtapes).reduce((queries, titreEtape, index) => {
    if (titreEtape.ordre !== index + 1) {
      queries.push(async () => {
        await titreEtapeUpdate(titreEtape.id, { ordre: index + 1 })

        console.log(
          `mise à jour: étape ${titreEtape.id}, ${JSON.stringify({
            ordre: index + 1
          })}`
        )
      })
    }

    return queries
  }, [])

const titresEtapesOrdreUpdate = async titresDemarches => {
  const titresEtapesUpdated = titresDemarches.reduce((arr, titreDemarche) => {
    arr.push(...titreEtapesOrdreUpdate(titreDemarche.etapes))

    return arr
  }, [])

  if (titresEtapesUpdated.length) {
    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titresEtapesUpdated)
  }

  return `mise à jour: ${titresEtapesUpdated.length} étape(s) (ordre)`
}

export default titresEtapesOrdreUpdate
