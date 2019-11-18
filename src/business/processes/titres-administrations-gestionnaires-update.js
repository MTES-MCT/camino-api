import PQueue from 'p-queue'

import {
  titresAdministrationsGestionnairesCreate,
  titreAdministrationGestionnaireDelete
} from '../../database/queries/titres'

// administrations restreintes à certains types types de titres
const administrationsTypesRestrictions = {
  'ope-ptmg-973-01': ['arm'],
  'ope-onf-973-01': ['arm'],
  'dea-guyane-01': ['axm']
}

// administrations subsidiaires sur certains types de titres
const administrationsTypesSubsidiaires = {
  'dea-guyane-01': ['arm'],
  'ope-ptmg-973-01': ['arm'],
  'min-mtes-dgaln-01': ['arm', 'axm']
}

const titreAdministrationsGestionnairesCreatedBuild = (
  titreAdministrationsGestionnairesOld,
  titreAdministrationsGestionnaires
) =>
  titreAdministrationsGestionnaires.reduce(
    (queries, titreAdministrationGestionnaire) => {
      if (
        !titreAdministrationsGestionnairesOld ||
        !titreAdministrationsGestionnairesOld.find(
          ({ id: idOld }) =>
            idOld === titreAdministrationGestionnaire.administrationId
        )
      ) {
        queries.push(titreAdministrationGestionnaire)
      }

      return queries
    },
    []
  )

const titreAdministrationsGestionnairesDeleteBuild = (
  titreAdministrationsGestionnairesOld,
  titreAdministrationsGestionnaires,
  titreId
) =>
  titreAdministrationsGestionnairesOld
    ? titreAdministrationsGestionnairesOld.reduce((queries, { id: idOld }) => {
        if (
          !titreAdministrationsGestionnaires.find(
            ({ administrationId: idNew }) => idNew === idOld
          )
        ) {
          queries.push({
            titreId,
            administrationId: idOld
          })
        }

        return queries
      }, [])
    : []

const titresAdministrationsGestionnairesToCreateAndDeleteBuild = titresAdministrationsGestionnaires =>
  Object.values(titresAdministrationsGestionnaires).reduce(
    (
      {
        titresAdministrationsGestionnairesToCreate,
        titresAdministrationsGestionnairesToDelete
      },
      {
        titreAdministrationsGestionnairesOld,
        titreAdministrationsGestionnaires,
        titreId
      }
    ) => {
      titresAdministrationsGestionnairesToCreate.push(
        ...titreAdministrationsGestionnairesCreatedBuild(
          titreAdministrationsGestionnairesOld,
          titreAdministrationsGestionnaires
        )
      )

      titresAdministrationsGestionnairesToDelete.push(
        ...titreAdministrationsGestionnairesDeleteBuild(
          titreAdministrationsGestionnairesOld,
          titreAdministrationsGestionnaires,
          titreId
        )
      )

      return {
        titresAdministrationsGestionnairesToCreate,
        titresAdministrationsGestionnairesToDelete
      }
    },
    {
      titresAdministrationsGestionnairesToCreate: [],
      titresAdministrationsGestionnairesToDelete: []
    }
  )

const titreAdministrationsGestionnairesBuild = (
  { id: titreId, domaineId, typeId },
  administrations
) =>
  administrations.reduce(
    (titreAdministrationsGestionnaires, administration) => {
      const isTitreAdministration =
        administration.domaines &&
        administration.domaines.length &&
        administration.domaines.find(({ id }) => id === domaineId)

      if (!isTitreAdministration) return titreAdministrationsGestionnaires

      const typesRestrictions =
        administrationsTypesRestrictions[administration.id]

      // si
      // - il y a des restrictions pour cette administration gestionnaire
      // - le type de titre n'est pas trouvé parmi les types de titres autorisés
      // l'administration n'est pas rattachée à l'étape
      if (typesRestrictions && !typesRestrictions.includes(typeId)) {
        return titreAdministrationsGestionnaires
      }

      const subsidiaire =
        administrationsTypesSubsidiaires[administration.id] &&
        administrationsTypesSubsidiaires[administration.id].includes(typeId)

      const titreAdministrationGestionnaire = {
        titreId,
        administrationId: administration.id
      }

      if (subsidiaire) {
        titreAdministrationGestionnaire.subsidiaire = subsidiaire
      }

      titreAdministrationsGestionnaires.push(titreAdministrationGestionnaire)

      return titreAdministrationsGestionnaires
    },
    []
  )

const titresAdministrationsGestionnairesBuild = (titres, administrations) =>
  titres.reduce((titresAdministrationsGestionnaires, titre) => {
    const titreAdministrationsGestionnaires = titreAdministrationsGestionnairesBuild(
      titre,
      administrations
    )

    titresAdministrationsGestionnaires.push({
      titreAdministrationsGestionnairesOld: titre.administrationsGestionnaires,
      titreAdministrationsGestionnaires,
      titreId: titre.id
    })

    return titresAdministrationsGestionnaires
  }, [])

const titresAdministrationsGestionnairesUpdate = async (
  titres,
  administrations
) => {
  // parcourt les étapes à partir des titres
  // car on a besoin de titre.domaineId
  const titresAdministrationsGestionnaires = titresAdministrationsGestionnairesBuild(
    titres,
    administrations
  )

  const {
    titresAdministrationsGestionnairesToCreate,
    titresAdministrationsGestionnairesToDelete
  } = titresAdministrationsGestionnairesToCreateAndDeleteBuild(
    titresAdministrationsGestionnaires
  )

  let titresAdministrationsGestionnairesCreated = []
  const titresAdministrationsGestionnairesDeleted = []

  if (titresAdministrationsGestionnairesToCreate.length) {
    titresAdministrationsGestionnairesCreated = await titresAdministrationsGestionnairesCreate(
      titresAdministrationsGestionnairesToCreate
    )

    console.log(
      `mise à jour: étape administrations ${titresAdministrationsGestionnairesCreated
        .map(tea => JSON.stringify(tea))
        .join(', ')}`
    )
  }

  if (titresAdministrationsGestionnairesToDelete.length) {
    const queue = new PQueue({ concurrency: 100 })

    titresAdministrationsGestionnairesToDelete.reduce(
      (
        titresAdministrationsGestionnairesDeleted,
        { titreId, administrationId }
      ) => {
        queue.add(async () => {
          await titreAdministrationGestionnaireDelete(titreId, administrationId)

          console.log(
            `suppression: étape ${titreId}, administration ${administrationId}`
          )

          titresAdministrationsGestionnairesDeleted.push(titreId)
        })

        return titresAdministrationsGestionnairesDeleted
      },
      titresAdministrationsGestionnairesDeleted
    )

    await queue.onIdle()
  }

  return [
    titresAdministrationsGestionnairesCreated,
    titresAdministrationsGestionnairesDeleted
  ]
}

export default titresAdministrationsGestionnairesUpdate
