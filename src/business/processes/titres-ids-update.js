import titreIdAndRelationsUpdate from '../utils/titre-id-and-relations-update'
import { titreIdsUpdate as titreIdsUpdateQuery } from '../queries/titres'
import { titreActivitesRowUpdate } from '../../tools/export/titre-activites'
import PQueue from 'p-queue'

const titreIdUpdate = async (titreOld, titreNew) => {
  // TODO
  // si l'id du titre change,
  // vérifier dans tous les titres si cet id existe déjà
  // si l'id existe déja, on modifie le nom en ajoutant un chiffre
  await titreIdsUpdateQuery(titreOld.id, titreNew).then(console.log)

  // met à jour toutes les activités dans la spreadsheet
  if (
    titreOld.id !== titreNew.id &&
    titreNew.activites &&
    titreNew.activites.length
  ) {
    const idGet = titreActiviteId =>
      titreActiviteId.replace(titreNew.id, titreOld.id)
    await titreActivitesRowUpdate(titreNew.activites, idGet)
  }

  return titreNew
}

const titreIdsUpdate = async titreOld => {
  const { titreNew, hasChanged } = titreIdAndRelationsUpdate(titreOld)

  if (hasChanged) {
    await titreIdUpdate(titreOld, titreNew)
  }

  return titreNew
}

const titresIdsUpdate = async titresOld => {
  // async reduce pour traiter les titres les uns après les autres
  const titresUpdatedRequests = await titresOld.reduce(
    async (titresUpdatedRequests, titreOld) => {
      const { titreNew, hasChanged } = titreIdAndRelationsUpdate(titreOld)

      return hasChanged
        ? [
            ...(await titresUpdatedRequests),
            () =>
              titreIdUpdate(titreOld, titreNew).catch(e => {
                console.error(titreOld.id)
                console.error(e)

                return null
              })
          ]
        : titresUpdatedRequests
    },
    []
  )

  // on stock les titres qui ont bien été mis à jour
  let titresUpdated = []

  if (titresUpdatedRequests.length) {
    const queue = new PQueue({ concurrency: 100 })
    titresUpdated = await queue.addAll(titresUpdatedRequests)
    // filtre les titres ayant été réellement mis à jour
    titresUpdated = titresUpdated.filter(e => e)
  }

  return `Mise à jour: ${titresUpdated.length} titre(s) (ids).`
}

export { titresIdsUpdate, titreIdsUpdate }
