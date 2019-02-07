import { communeInsert } from '../database/queries/communes'

const communesInsert = (communesNew, communesOld) =>
  communesNew.reduce(
    (queries, { id, nom, departementId }) =>
      communesOld.find(cOld => cOld.id === id)
        ? queries
        : [
            ...queries,
            communeInsert({ id, nom, departementId })
              .then(u => {
                const commune = JSON.stringify({
                  id,
                  nom,
                  departementId
                })
                console.log(`Mise à jour: commune, ${commune}`)
                return u
              })
              .catch(err => {
                const commune = JSON.stringify({
                  id,
                  nom,
                  departementId
                })
                console.log(`Erreur: commune, ${commune}, ${err}`)
              })
          ],
    []
  )

export { communesInsert }
