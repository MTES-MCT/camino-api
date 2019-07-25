import PQueue from 'p-queue'
import {
  titresEtapesAdministrationsCreate,
  titreEtapeAdministrationDelete
} from '../../database/queries/titres-etapes'

const typesAdministrationsLocalesLink = {
  arm: false
}

const typesAdministrationsCentralesLink = {
  axm: false,
  arm: ['ope-onf-973-01']
}

const titreEtapeAdministrationsCreatedBuild = (
  titreEtape,
  administrationsIds
) =>
  administrationsIds.reduce(
    (queries, administrationId) =>
      !titreEtape.administrations ||
      !titreEtape.administrations.find(
        administrationOld => administrationOld.id === administrationId
      )
        ? [
            ...queries,
            {
              titreEtapeId: titreEtape.id,
              administrationId
            }
          ]
        : queries,
    []
  )

const titreEtapeAdministrationsDeleteBuild = (titreEtape, administrationsIds) =>
  titreEtape.administrations
    ? titreEtape.administrations.reduce(
        (queries, administrationOld) =>
          !administrationsIds.find(
            administrationId => administrationId === administrationOld.id
          )
            ? [
                ...queries,
                {
                  titreEtapeId: titreEtape.id,
                  administrationId: administrationOld.id
                }
              ]
            : queries,
        []
      )
    : []

// retourne un tableau d'ids d'administrations
const administrationsIdsBuild = (
  { domaineId, typeId },
  titreEtape,
  administrations
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

const titresEtapesAdministrationsCreatedDeletedBuild = titresEtapesAdministrations =>
  Object.values(titresEtapesAdministrations).reduce(
    (
      {
        titresEtapesAdministrationsCreated,
        titresEtapesAdministrationsDeleted
      },
      { titreEtape, administrationsIds }
    ) => {
      const titreEtapeAdministrationsCreated = titreEtapeAdministrationsCreatedBuild(
        titreEtape,
        administrationsIds
      )

      const titreEtapeAdministrationsDeleted = titreEtapeAdministrationsDeleteBuild(
        titreEtape,
        administrationsIds
      )

      return {
        titresEtapesAdministrationsCreated: [
          ...titresEtapesAdministrationsCreated,
          ...titreEtapeAdministrationsCreated
        ],
        titresEtapesAdministrationsDeleted: [
          ...titresEtapesAdministrationsDeleted,
          ...titreEtapeAdministrationsDeleted
        ]
      }
    },
    {
      titresEtapesAdministrationsCreated: [],
      titresEtapesAdministrationsDeleted: []
    }
  )

const titresEtapesAdministrationsBuild = (titres, administrations) =>
  titres.reduce(
    (titresEtapesAdministrations, titre) =>
      titre.demarches.reduce(
        (titresEtapesAdministrations, titreDemarche) =>
          titreDemarche.etapes.reduce(
            (titresEtapesAdministrations, titreEtape) => {
              const administrationsIds = administrationsIdsBuild(
                titre,
                titreEtape,
                administrations
              )

              return {
                ...titresEtapesAdministrations,
                [titreEtape.id]: {
                  titreEtape,
                  administrationsIds
                }
              }
            },
            titresEtapesAdministrations
          ),
        titresEtapesAdministrations
      ),
    {}
  )

const titresEtapesAdministrationsUpdate = async (titres, administrations) => {
  // parcourt les étapes à partir des titres
  // car on a besoin de titre.domaineId
  // retourne un dictionnaire { [titreEtapeId]: { titreEtape, administrationsIds}}
  const titresEtapesAdministrations = titresEtapesAdministrationsBuild(
    titres,
    administrations
  )

  const {
    titresEtapesAdministrationsCreated,
    titresEtapesAdministrationsDeleted
  } = titresEtapesAdministrationsCreatedDeletedBuild(
    titresEtapesAdministrations
  )

  if (titresEtapesAdministrationsCreated.length) {
    await titresEtapesAdministrationsCreate(titresEtapesAdministrationsCreated)
    console.log(
      `mise à jour: étape administrations ${titresEtapesAdministrationsCreated
        .map(tea => JSON.stringify(tea))
        .join(', ')}`
    )
  }

  if (titresEtapesAdministrationsDeleted.length) {
    const titresEtapesAdministrationsDeletedQueries = titresEtapesAdministrationsDeleted.map(
      ({ titreEtapeId, administrationId }) => async () => {
        await titreEtapeAdministrationDelete(titreEtapeId, administrationId)
        console.log(
          `suppression: étape ${titreEtapeId}, administration ${administrationId}`
        )
      }
    )

    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titresEtapesAdministrationsDeletedQueries)
  }

  return [
    `mise à jour: ${titresEtapesAdministrationsCreated.length} administration(s) ajoutée(s) dans des étapes`,
    `mise à jour: ${titresEtapesAdministrationsDeleted.length} administration(s) supprimée(s) dans des étapes`
  ]
}

export default titresEtapesAdministrationsUpdate
