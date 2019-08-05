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
      acc = acc.concat(titreDemarchesOrdreUpdated)
    }

    return acc
  }, [])

  if (titresDemarchesUpdated.length) {
    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titresDemarchesUpdated)
  }

  return `mise à jour: ${titresDemarchesUpdated.length} démarche(s) (ordre)`
}

export default titresDemarchesOrdreUpdate
