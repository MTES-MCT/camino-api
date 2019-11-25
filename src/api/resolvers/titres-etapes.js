import { debug } from '../../config/index'
import { permissionsCheck } from './_permissions-check'
import { titreFormat } from './_titre-format'

import { titreModificationPermissionAdministrationsCheck } from './_titre'
import {
  titreEtapeCreationPermissionAdministrationsCheck,
  titreEtapeModificationPermissionAdministrationsCheck
} from './_titre-etape'

import {
  titreEtapeGet,
  titreEtapeUpsert,
  titreEtapeDelete
} from '../../database/queries/titres-etapes'
import { titreDemarcheGet } from '../../database/queries/titres-demarches'
import { titreGet } from '../../database/queries/titres'
import { utilisateurGet } from '../../database/queries/utilisateurs'
import { administrationsGet } from '../../database/queries/administrations'

import titreEtapeUpdateTask from '../../business/titre-etape-update'
import titreEtapePointsCalc from '../../business/titre-etape-points-calc'
import titreEtapeUpdationValidate from '../../business/titre-etape-updation-validate'

const etapesTypesEtapeEdition = async (
  { titreDemarcheId, etapeTypeId },
  context,
  info
) => {
  if (!context.user) return []

  const demarche = await titreDemarcheGet(titreDemarcheId, {
    eager: '[etapes, type.[etapesTypes]]'
  })

  const titre = await titreGet(demarche.titreId, {
    eager: '[administrationsGestionnaires, administrationsLocales]'
  })

  const user = await utilisateurGet(context.user.id)

  const isSuper = permissionsCheck(context.user, ['super'])

  return demarche.type.etapesTypes.reduce((etapesTypes, et) => {
    if (et.typeId !== titre.typeId) return etapesTypes

    if (
      // si un type d'étape optionnel est passé
      // alors on ne vérifie pas l'unicité
      // pour pouvoir proposer le type dans le sélecteur
      (!etapeTypeId || et.id !== etapeTypeId) &&
      // si le type d'étape est unique
      et.unique &&
      // et que la démarche en contient déjà un
      demarche.etapes.find(e => e.typeId === et.id)
    ) {
      // alors on ne l'ajoute pas à la liste des types disponibles pour la démarche
      return etapesTypes
    }

    et.demarcheTypeId = demarche.typeId

    et.editable =
      isSuper ||
      titreEtapeModificationPermissionAdministrationsCheck(et.id, titre, user)

    if (et.editable) {
      etapesTypes.push(et)
    }

    return etapesTypes
  }, [])
}
const titreEtapeCreer = async ({ etape }, context, info) => {
  try {
    if (!context.user || !permissionsCheck(context.user, ['super', 'admin'])) {
      throw new Error('opération impossible')
    }

    let user

    if (permissionsCheck(context.user, ['admin'])) {
      const demarche = await titreDemarcheGet(etape.titreDemarcheId, {
        eager: null
      })
      if (!demarche) throw new Error("la démarche n'existe pas")

      const titre = await titreGet(demarche.titreId, {
        eager: '[administrationsGestionnaires, administrationsLocales]'
      })
      if (!titre) throw new Error("le titre n'existe pas")

      const administrations = await administrationsGet()

      user = await utilisateurGet(context.user.id)

      if (
        !titreModificationPermissionAdministrationsCheck(
          titre,
          user,
          administrations
        ) ||
        !titreEtapeCreationPermissionAdministrationsCheck(
          etape.typeId,
          titre,
          user
        )
      ) {
        throw new Error('droits insuffisants pour créer cette étape')
      }
    }

    const rulesErrors = await titreEtapeUpdationValidate(etape)

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    if (etape.points) {
      etape.points = await titreEtapePointsCalc(etape.points)
    }

    const etapeUpdated = await titreEtapeUpsert(etape)

    const titreUpdated = await titreEtapeUpdateTask(
      etapeUpdated.id,
      etapeUpdated.titreDemarcheId
    )

    if (!user) {
      user = await utilisateurGet(context.user.id)
    }

    return titreFormat(titreUpdated, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreEtapeModifier = async ({ etape }, context, info) => {
  try {
    if (!context.user || !permissionsCheck(context.user, ['super', 'admin'])) {
      throw new Error('opération impossible')
    }

    let user

    if (permissionsCheck(context.user, ['admin'])) {
      const demarche = await titreDemarcheGet(etape.titreDemarcheId, {
        eager: null
      })
      if (!demarche) throw new Error("la démarche n'existe pas")

      const titre = await titreGet(demarche.titreId, {
        eager: '[administrationsGestionnaires, administrationsLocales]'
      })
      if (!titre) throw new Error("le titre n'existe pas")

      const administrations = await administrationsGet()

      user = await utilisateurGet(context.user.id)

      if (
        !titreModificationPermissionAdministrationsCheck(
          titre,
          user,
          administrations
        ) ||
        !titreEtapeModificationPermissionAdministrationsCheck(
          etape.typeId,
          titre,
          user
        )
      ) {
        throw new Error('droits insuffisants pour modifier cette étape')
      }
    }

    const rulesErrors = await titreEtapeUpdationValidate(etape)

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    if (etape.points) {
      etape.points = await titreEtapePointsCalc(etape.points)
    }

    const etapeUpdated = await titreEtapeUpsert(etape)

    const titreUpdated = await titreEtapeUpdateTask(
      etapeUpdated.id,
      etapeUpdated.titreDemarcheId
    )

    if (!user) {
      user = await utilisateurGet(context.user.id)
    }

    return titreFormat(titreUpdated, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreEtapeSupprimer = async ({ id }, context, info) => {
  if (!context.user || !permissionsCheck(context.user, ['super'])) {
    throw new Error('opération impossible')
  }

  try {
    const etapeOld = await titreEtapeGet(id)
    if (!etapeOld) throw new Error("l'étape n'existe pas")

    await titreEtapeDelete(id)

    const titreUpdated = await titreEtapeUpdateTask(
      null,
      etapeOld.titreDemarcheId
    )

    const user = await utilisateurGet(context.user.id)

    return titreFormat(titreUpdated, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export {
  etapesTypesEtapeEdition,
  titreEtapeCreer,
  titreEtapeModifier,
  titreEtapeSupprimer
}
