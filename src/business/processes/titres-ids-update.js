import PQueue from 'p-queue'

import { titreIdUpdate as titreIdUpdateQuery } from '../../database/queries/titres'
import titreIdAndRelationsUpdate from '../utils/titre-id-and-relations-update'

const titreIdUpdate = async (titreOld, titreNew) => {
  await titreIdUpdateQuery(titreOld.id, titreNew)

  console.log(`mise à jour: titre ids: ${titreNew.id}`)

  return titreNew
}

const titreIdsUpdate = async titreOld => {
  const { titreNew, hasChanged } = titreIdAndRelationsUpdate(titreOld)

  if (!hasChanged) {
    return null
  }

  return titreIdUpdate(titreOld, titreNew)
}

const titresIdsUpdate = async titresOld => {
  // attention : les transactions ne peuvent pas être exécutées en parallèle
  const queue = new PQueue({ concurrency: 1 })

  // async reduce pour traiter les titres les uns après les autres
  const { titresUpdated, titresUpdatedIdsIndex } = titresOld.reduce(
    ({ titresUpdated, titresUpdatedIdsIndex }, titreOld) => {
      const { titreNew, hasChanged } = titreIdAndRelationsUpdate(titreOld)

      if (hasChanged) {
        if (titreNew.id !== titreOld.id) {
          titresUpdatedIdsIndex[titreNew.id] = titreOld.id
        }

        queue.add(async () => {
          try {
            const titreUpdated = await titreIdUpdate(titreOld, titreNew)

            titresUpdated.push(titreUpdated)
          } catch (e) {
            console.error(`erreur: titreIdUpdate ${titreOld.id}`)
            console.error(e)
          }
        })
      }

      return {
        titresUpdated,
        titresUpdatedIdsIndex
      }
    },
    {
      titresUpdated: [],
      titresUpdatedIdsIndex: {}
    }
  )

  await queue.onIdle()

  return {
    titresUpdated,
    titresUpdatedIdsIndex
  }
}

export { titresIdsUpdate, titreIdsUpdate }
