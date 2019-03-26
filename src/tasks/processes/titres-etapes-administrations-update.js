import {
  titreEtapeAdministrationsInsert,
  titreEtapeAdministrationsDelete
} from '../queries/titre-etapes'

const titresEtapesAdministrationsUpdate = async (
  titresEtapes,
  administrations
) => {
  const administrationsIndex = administrations.reduce(
    (acc, a) => ({ ...acc, [a.departementId]: a }),
    {}
  )

  const titresEtapesAdministrations = titresEtapes.reduce(
    (acc, titreEtape) =>
      titreEtape.communes && titreEtape.communes.length
        ? {
            ...acc,
            [titreEtape.id]: {
              titreEtape,
              administrationsIds: Object.keys(
                titreEtape.communes.reduce(
                  (acc, commune) =>
                    !acc[commune.departementId] &&
                    administrationsIndex[commune.departementId]
                      ? {
                          ...acc,
                          [administrationsIndex[commune.departementId].id]: true
                        }
                      : acc,
                  {}
                )
              )
            }
          }
        : acc,
    {}
  )

  const {
    titresEtapesAdministrationsInsertQueries,
    titresEtapesAdministrationsDeleteQueries
  } = titresEtapesAdministrationsQueriesBuild(
    titresEtapes,
    titresEtapesAdministrations
  )

  const titreEtapesAdministrationsQueries = [
    ...titresEtapesAdministrationsInsertQueries,
    ...titresEtapesAdministrationsDeleteQueries
  ].map(q => q.then(log => console.log(log)))

  await Promise.all(titreEtapesAdministrationsQueries)

  return `Mise à jour: ${titresEtapesAdministrationsInsertQueries.length +
    titresEtapesAdministrationsDeleteQueries.length} administrations dans des étapes.`
}

const titresEtapesAdministrationsQueriesBuild = (
  titresEtapes,
  titresEtapesAdministrations
) =>
  Object.values(titresEtapesAdministrations).reduce(
    (
      {
        titresEtapesAdministrationsInsertQueries,
        titresEtapesAdministrationsDeleteQueries
      },
      { titreEtape, administrationsIds }
    ) => {
      const titreEtapeAdministrationsInsertQueriesNew = titreEtapeAdministrationsInsert(
        titreEtape,
        administrationsIds
      )

      const titreEtapeAdministrationsDeleteQueriesNew = titreEtapeAdministrationsDelete(
        titreEtape,
        administrationsIds
      )

      return {
        titresEtapesAdministrationsInsertQueries: [
          ...titresEtapesAdministrationsInsertQueries,
          ...titreEtapeAdministrationsInsertQueriesNew
        ],
        titresEtapesAdministrationsDeleteQueries: [
          ...titresEtapesAdministrationsDeleteQueries,
          ...titreEtapeAdministrationsDeleteQueriesNew
        ]
      }
    },
    {
      titresEtapesAdministrationsInsertQueries: [],
      titresEtapesAdministrationsDeleteQueries: []
    }
  )

export default titresEtapesAdministrationsUpdate
