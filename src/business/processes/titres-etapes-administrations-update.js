import {
  titreEtapeAdministrationsInsert,
  titreEtapeAdministrationsDelete
} from '../queries/titre-etapes'

const typesAdministrationsLocalesLink = {
  arm: false
}

const typesAdministrationsCentralesLink = {
  axm: false,
  arm: ['ope-onf-973-01']
}

const administrationsIdsFind = (
  titreEtape,
  administrations,
  { domaineId, typeId }
) => {
  let adminsLocalesIds = []
  let adminsCentralesIds = []

  if (
    typesAdministrationsLocalesLink[typeId] !== false &&
    titreEtape.communes &&
    titreEtape.communes.length
  ) {
    const {
      titreDepartementsIds,
      titreRegionsIds
    } = titreEtape.communes.reduce(
      ({ titreDepartementsIds, titreRegionsIds }, commune) => {
        if (commune.departementId) {
          titreDepartementsIds.add(commune.departementId)
        }

        if (commune.departement && commune.departement.regionId) {
          titreRegionsIds.add(commune.departement.regionId)
        }

        return {
          titreDepartementsIds,
          titreRegionsIds
        }
      },
      { titreRegionsIds: new Set(), titreDepartementsIds: new Set() }
    )

    adminsLocalesIds = administrations.reduce(
      (adminsLocalesIds, administration) =>
        (administration.departementId &&
          titreDepartementsIds.has(administration.departementId)) ||
        (administration.regionId &&
          titreRegionsIds.has(administration.regionId))
          ? [...adminsLocalesIds, administration.id]
          : adminsLocalesIds,
      []
    )
  }

  if (
    typesAdministrationsCentralesLink[typeId] !== false &&
    ['dex', 'dpu', 'men'].includes(titreEtape.typeId)
  ) {
    if (Array.isArray(typesAdministrationsCentralesLink[typeId])) {
      adminsCentralesIds = typesAdministrationsCentralesLink[typeId]
    } else {
      adminsCentralesIds = administrations.reduce(
        (adminsCentralesIds, administration) =>
          administration.domaines &&
          administration.domaines.length &&
          administration.domaines.find(({ id }) => id === domaineId)
            ? [...adminsCentralesIds, administration.id]
            : adminsCentralesIds,
        []
      )
    }
  }

  // dédoublonne les ids d'administrations, au cas où
  return [...new Set([...adminsCentralesIds, ...adminsLocalesIds])]
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
                titre
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
