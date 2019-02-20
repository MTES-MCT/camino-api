import {
  titreEtapeUpdate,
  titreEtapeCommuneInsert as titreEtapeCommuneInsertQuery,
  titreEtapeCommuneDelete as titreEtapeCommuneDeleteQuery
} from '../database/queries/titres-etapes'

const titreEtapesOrdreUpdate = titreEtapesByDemarche =>
  titreEtapesByDemarche
    .sort((a, b) => {
      a = new Date(a.date)
      b = new Date(b.date)
      return a < b ? -1 : a > b ? 1 : 0
    })
    .reduce(
      (acc, titreEtape, index) =>
        titreEtape.ordre === index + 1
          ? acc
          : [
              ...acc,
              titreEtapeUpdate({
                id: titreEtape.id,
                props: { ordre: index + 1 }
              }).then(
                u =>
                  `Mise à jour: étape ${titreEtape.id}, ${JSON.stringify({
                    ordre: index + 1
                  })}`
              )
            ],
      []
    )

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
            }).then(
              u => `Mise à jour: étape ${titreEtape.id}, commune ${communeId}`
            )
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
                }).then(
                  u =>
                    `Suppression: étape ${titreEtape.id}, commune ${commune.id}`
                )
              ],
        []
      )
    : []

export {
  titreEtapesOrdreUpdate,
  titreEtapeCommunesInsert,
  titreEtapeCommunesDelete
}
