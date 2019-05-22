import {
  titreEtapeAdministrationsInsert,
  titreEtapeAdministrationsDelete
} from '../queries/titre-etapes'

const administrationsIdsFind = (titreEtape, administrations, domaineId) => {
  let departementsAdministrationsIds = []
  let regionsAdministrationsIds = []
  let globaleAdministrationsIds = []

  if (titreEtape.communes && titreEtape.communes.length) {
    const { departementIds, regionIds } = titreEtape.communes.reduce(
      ({ departementIds, regionIds }, commune) => {
        if (commune.departementId && !departementIds[commune.departementId]) {
          departementIds.push(commune.departementId)
        }

        if (
          commune.departement &&
          commune.departement.regionId &&
          !regionIds[commune.departement.regionId]
        ) {
          regionIds.push(commune.departement.regionId)
        }

        return {
          departementIds,
          regionIds
        }
      },
      { regionIds: [], departementIds: [] }
    )

    const departementsAndRegionsAdministrationsIds = administrations.reduce(
      (
        { departementsAdministrationsIds, regionsAdministrationsIds },
        administration
      ) => {
        if (
          administration.departementId &&
          departementIds.find(id => id === administration.departementId)
        ) {
          departementsAdministrationsIds.push(administration.id)
        }

        if (
          administration.regionId &&
          regionIds.find(id => id === administration.regionId)
        ) {
          regionsAdministrationsIds.push(administration.id)
        }

        return { departementsAdministrationsIds, regionsAdministrationsIds }
      },
      { departementsAdministrationsIds: [], regionsAdministrationsIds: [] }
    )

    departementsAdministrationsIds =
      departementsAndRegionsAdministrationsIds.departementsAdministrationsIds
    regionsAdministrationsIds =
      departementsAndRegionsAdministrationsIds.regionsAdministrationsIds
  }

  if (['dex', 'dpu', 'men'].includes(titreEtape.typeId)) {
    globaleAdministrationsIds = administrations.reduce(
      (acc, administration) =>
        administration.domaines &&
        administration.domaines.length &&
        administration.domaines.find(({ id }) => id === domaineId)
          ? [...acc, administration.id]
          : acc,
      []
    )
  }

  return [
    ...departementsAdministrationsIds,
    ...regionsAdministrationsIds,
    ...globaleAdministrationsIds
  ]
}

const titresEtapesAdministrationsUpdate = async (titres, administrations) => {
  // parcourt les étapes à partir des titres
  // car on a besoin de titre.domaineId
  const titresEtapesAdministrations = titres.reduce(
    (titresEtapesAdministrations, titre) =>
      titre.demarches.reduce(
        (titresEtapesAdministrations, titreDemarche) =>
          titreDemarche.etapes.reduce(
            (titresEtapesAdministrations, titreEtape) => {
              const administrationsIds = administrationsIdsFind(
                titreEtape,
                administrations,
                titre.domaineId
              )

              return administrationsIds.length
                ? {
                    ...titresEtapesAdministrations,
                    [titreEtape.id]: {
                      titreEtape,
                      administrationsIds
                    }
                  }
                : titresEtapesAdministrations
            },
            titresEtapesAdministrations
          ),
        titresEtapesAdministrations
      ),
    {}
  )

  const {
    titresEtapesAdministrationsInsertQueries,
    titresEtapesAdministrationsDeleteQueries
  } = titresEtapesAdministrationsQueriesBuild(titresEtapesAdministrations)

  const titreEtapesAdministrationsQueries = [
    ...titresEtapesAdministrationsInsertQueries,
    ...titresEtapesAdministrationsDeleteQueries
  ].map(q => q.then(log => console.log(log)))

  await Promise.all(titreEtapesAdministrationsQueries)

  return `Mise à jour: ${titresEtapesAdministrationsInsertQueries.length +
    titresEtapesAdministrationsDeleteQueries.length} administrations dans des étapes.`
}

const titresEtapesAdministrationsQueriesBuild = titresEtapesAdministrations =>
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
