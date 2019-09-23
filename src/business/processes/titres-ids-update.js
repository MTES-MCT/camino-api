import PQueue from 'p-queue'

import titreIdAndRelationsUpdate from '../utils/titre-id-and-relations-update'
import { titreIdUpdate as titreIdUpdateQuery } from '../../database/queries/titres'

const titreIdUpdate = async (titreOld, titreNew) => {
  // TODO
  // si l'id du titre change,
  // vérifier dans tous les titres si cet id existe déjà
  // si l'id existe déja, on modifie le nom en ajoutant un chiffre
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
  // async reduce pour traiter les titres les uns après les autres
  const { titresUpdatedRequests, titresUpdatedIdsIndex } = titresOld.reduce(
    ({ titresUpdatedRequests, titresUpdatedIdsIndex }, titreOld) => {
      const { titreNew, hasChanged } = titreIdAndRelationsUpdate(titreOld)

      if (hasChanged) {
        if (titreNew.id !== titreOld.id) {
          titresUpdatedIdsIndex[titreNew.id] = titreOld.id
        }

        titresUpdatedRequests.push(() =>
          titreIdUpdate(titreOld, titreNew).catch(e => {
            console.error(`erreur: titreIdUpdate ${titreOld.id}`)
            console.error(e)

            return null
          })
        )
      }

      return {
        titresUpdatedRequests,
        titresUpdatedIdsIndex
      }
    },
    {
      titresUpdatedRequests: [],
      titresUpdatedIdsIndex: {}
    }
  )

  // on stock les titres qui ont bien été mis à jour
  let titresUpdated = []

  if (!titresUpdatedRequests.length) {
    return {
      titresUpdated,
      titresUpdatedIdsIndex
    }
  }

  // attention : les transactions ne peuvent pas être exécutées en parallèle
  const queue = new PQueue({
    concurrency: 1
  })
  titresUpdated = await queue.addAll(titresUpdatedRequests)
  // filtre les titres ayant étés réellement mis à jour
  titresUpdated = titresUpdated.filter(e => e)

  return {
    titresUpdated,
    titresUpdatedIdsIndex
  }
}

export { titresIdsUpdate, titreIdsUpdate }
