import { titreDemarcheUpdate } from '../../database/queries/titres-demarches'
import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'
import PQueue from 'p-queue'

const titreDemarchesOrdreUpdate = titreDemarches =>
  titreDemarchesAscSort(titreDemarches).reduce((acc, titreDemarche, index) => {
    if (titreDemarche.ordre !== index + 1) {
      acc.push(async () => {
        await titreDemarcheUpdate(titreDemarche.id, { ordre: index + 1 })
        console.log(
          `mise à jour: démarche ${titreDemarche.id}, ${JSON.stringify({
            ordre: index + 1
          })}`
        )
      })
    }

    return acc
  }, [])

const titresDemarchesOrdreUpdate = async titres => {
  const titresDemarchesUpdated = titres.reduce((acc, titre) => {
    const titreDemarchesOrdreUpdated = titreDemarchesOrdreUpdate(
      titre.demarches.slice().reverse()
    )

    if (titreDemarchesOrdreUpdated.length) {
      acc.push(...titreDemarchesOrdreUpdated)
    }

    return acc
  }, [])

  if (!titresDemarchesUpdated.length) {
    return []
  }

  const queue = new PQueue({ concurrency: 100 })

  return queue.addAll(titresDemarchesUpdated)
}

export default titresDemarchesOrdreUpdate
