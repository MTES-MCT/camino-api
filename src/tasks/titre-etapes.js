import {
  titreEtapeUpdate,
  titreEtapeCommuneInsert as titreEtapeCommuneInsertQuery,
  titreEtapeCommuneDelete as titreEtapeCommuneDeleteQuery
} from '../database/queries/titres-etapes'

const titreEtapesOrdreUpdate = titreEtapesByDemarche =>
  titreEtapesByDemarche
    .sort((a, b) => a.date - b.date)
    .map((titreEtape, index) => {
      titreEtape.ordreNew = index + 1
      return titreEtape
    })
    .filter(titreEtape => titreEtape.ordreNew !== titreEtape.ordre)
    .map(titreEtape => {
      const props = {
        ordre: titreEtape.ordreNew
      }

      titreEtapeUpdate({ id: titreEtape.id, props }).then(u => {
        console.log(
          `Mise à jour: étape ${titreEtape.id}, ${JSON.stringify(props)}`
        )
        return u
      })
    })

const titreEtapeCommunesInsert = (titreEtape, communesIds) =>
  communesIds.reduce(
    (queries, communeId) =>
      titreEtape.communes && titreEtape.communes.find(c => c.id === communeId)
        ? queries
        : [
            ...queries,
            titreEtapeCommuneInsertQuery({
              titreEtapeId: titreEtape.id,
              communeId
            })
              .then(u => {
                console.log(
                  `Mise à jour: étape ${titreEtape.id}, commune ${communeId}`
                )
                return u
              })
              .catch(err => {
                console.log(
                  `Erreur: étape ${titreEtape.id}, commune ${communeId}, ${err}`
                )
              })
          ],
    []
  )

const titreEtapeCommunesDelete = (titreEtape, communesIds) =>
  titreEtape.communes
    ? titreEtape.communes.reduce(
        (queries, commune) =>
          communesIds.find(communeId => communeId === commune.id)
            ? queries
            : [
                ...queries,
                titreEtapeCommuneDeleteQuery({
                  titreEtapeId: titreEtape.id,
                  communeId: commune.id
                }).then(u => {
                  console.log(
                    `Suppression: étape ${titreEtape.id}, commune ${commune.id}`
                  )
                  return u
                })
              ],
        []
      )
    : []

export {
  titreEtapesOrdreUpdate,
  titreEtapeCommunesInsert,
  titreEtapeCommunesDelete
}
