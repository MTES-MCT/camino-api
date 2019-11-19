import { debug } from '../../config/index'
import { permissionsCheck } from './_permissions-check'
import { titreFormat } from './_titre-format'

import { titreEditionPermissionAdministrationsCheck } from './_titre'
import { titreEtapeEditionPermissionAdministrationsCheck } from './_titre-etape'

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

const titreEtapeCreer = async ({ etape }, context, info) => {
  try {
    if (!context.user) {
      throw new Error('opération impossible')
    }

    let user

    if (!permissionsCheck(context.user, ['super'])) {
      const demarche = await titreDemarcheGet(etape.titreDemarcheId, {
        eager: null
      })
      if (!demarche) throw new Error("La démarche n'existe pas")

      const titre = await titreGet(demarche.titreId, {
        eager: '[administrationsCentrales,administrationsLocales]'
      })
      if (!titre) throw new Error("Le titre n'existe pas")

      const administrations = await administrationsGet()

      user = await utilisateurGet(context.user.id)

      if (
        !titreEditionPermissionAdministrationsCheck(
          titre,
          administrations,
          user,
          'modification'
        ) ||
        !titreEtapeEditionPermissionAdministrationsCheck(
          etape,
          titre,
          user,
          'creation'
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
    if (!context.user) {
      throw new Error('opération impossible')
    }

    let user

    if (!permissionsCheck(context.user, ['super'])) {
      const demarche = await titreDemarcheGet(etape.titreDemarcheId, {
        eager: null
      })
      if (!demarche) throw new Error("La démarche n'existe pas")

      const titre = await titreGet(demarche.titreId, {
        eager: '[administrationsCentrales,administrationsLocales]'
      })
      if (!titre) throw new Error("Le titre n'existe pas")

      const administrations = await administrationsGet()

      user = await utilisateurGet(context.user.id)

      if (
        !titreEditionPermissionAdministrationsCheck(
          titre,
          administrations,
          user,
          'modification'
        ) ||
        !titreEtapeEditionPermissionAdministrationsCheck(
          etape,
          titre,
          user,
          'modification'
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
    if (!etapeOld) throw new Error("L'étape n'existe pas")

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

export { titreEtapeCreer, titreEtapeModifier, titreEtapeSupprimer }
