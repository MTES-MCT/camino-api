import { communeInsert } from '../../database/queries/communes'

const communesInsert = (communesNew, communesOld) =>
  communesNew.reduce(
    (queries, { id, nom, departementId }) =>
      communesOld.find(cOld => cOld.id === id)
        ? queries
        : [
            ...queries,
            communeInsert({ id, nom, departementId }).then(u => {
              const commune = JSON.stringify({
                id,
                nom,
                departementId
              })
              return `Mise à jour: commune, ${commune}`
            })
          ],
    []
  )

export { communesInsert }
