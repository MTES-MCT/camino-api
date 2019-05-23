import {
  titreEtapeAdministrationsInsert,
  titreEtapeAdministrationsDelete
} from '../queries/titre-etapes'

const administrationsIdsFind = (titreEtape, administrations, domaineId) => {
  let adminDepartementsIds = []
  let adminRegionsIds = []
  let adminGlobalesIds = []

  if (titreEtape.communes && titreEtape.communes.length) {
    const { departementIds, regionIds } = titreEtape.communes.reduce(
      ({ departementIds, regionIds }, commune) => {
        if (commune.departementId) {
          departementIds.add(commune.departementId)
        }

        if (commune.departement && commune.departement.regionId) {
          regionIds.add(commune.departement.regionId)
        }

        return {
          departementIds,
          regionIds
        }
      },
      { regionIds: new Set(), departementIds: new Set() }
    )

    const adminIds = administrations.reduce(
      ({ adminDepartementsIds, adminRegionsIds }, administration) => {
        if (
          administration.departementId &&
          departementIds.has(administration.departementId)
        ) {
          adminDepartementsIds.add(administration.id)
        }

        if (administration.regionId && regionIds.has(administration.regionId)) {
          adminRegionsIds.add(administration.id)
        }

        return { adminDepartementsIds, adminRegionsIds }
      },
      { adminDepartementsIds: new Set(), adminRegionsIds: new Set() }
    )

    // const dedup = arr => [...new Set(...arr)]

    adminDepartementsIds = [...adminIds.adminDepartementsIds]
    adminRegionsIds = [...adminIds.adminRegionsIds]
  }

  if (['dex', 'dpu', 'men'].includes(titreEtape.typeId)) {
    adminGlobalesIds = administrations.reduce(
      (acc, administration) =>
        administration.domaines &&
        administration.domaines.length &&
        administration.domaines.find(({ id }) => id === domaineId)
          ? [...acc, administration.id]
          : acc,
      []
    )
  }

  return [...adminDepartementsIds, ...adminRegionsIds, ...adminGlobalesIds]
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
