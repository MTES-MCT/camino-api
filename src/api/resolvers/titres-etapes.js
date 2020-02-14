import { debug } from '../../config/index'

import metas from './_metas'

import { titreFormat } from './format/titres'
import { etapesTypesFormat } from './format/etapes-types'

import { permissionsCheck } from './permissions/permissions-check'
import { titreModificationPermissionAdministrationsCheck } from './permissions/titre'
import {
  titreEtapeCreationPermissionAdministrationsCheck,
  titreEtapeModificationPermissionAdministrationsCheck
} from './permissions/titre-etape'

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

const demarcheEtapeTypesFormat = (
  user,
  isSuper,
  titre,
  demarcheTypeId,
  titreEtapes,
  etapesTypes,
  etapeTypeId
) =>
  etapesTypes.reduce((etapesTypes, et) => {
    // si le type d'étape correspond à la démarche et au titre
    if (et.titreTypeId !== titre.typeId) return etapesTypes

    // si
    // - on ne reçoit pas de param etapeTypeId
    // - ou si le param etapeTypeId correspond à un type d'étape
    // alors on ne vérifie pas l'unicité
    // pour pouvoir proposer le type dans le sélecteur
    if (
      (!etapeTypeId || et.etapeTypeId !== etapeTypeId) &&
      // si le type d'étape est unique
      et.unique &&
      // et que la démarche en contient déjà un
      titreEtapes.find(e => e.typeId === et.etapeTypeId)
    ) {
      // alors on ne l'ajoute pas à la liste des types disponibles pour la démarche
      return etapesTypes
    }

    et.editable =
      isSuper ||
      // si un etapeTypeId est fourni au resolver
      // alors c'est une modification d'étape
      // sinon c'est une création d'étape dans une démarche
      (etapeTypeId
        ? titreEtapeModificationPermissionAdministrationsCheck
        : titreEtapeCreationPermissionAdministrationsCheck)(et.id, titre, user)

    if (et.editable) {
      et.demarcheTypeId = demarcheTypeId

      et = etapesTypesFormat(et)

      etapesTypes.push(et)
    }

    return etapesTypes
  }, [])

const demarcheEtapesTypes = async (
  { titreDemarcheId, etapeTypeId = null },
  context
) => {
  if (!context.user && !debug) return []

  const demarche = await titreDemarcheGet(titreDemarcheId, {
    graph: '[etapes, type.etapesTypes(orderAsc).etapesStatuts]'
  })

  const titre = await titreGet(demarche.titreId, {
    graph: '[administrationsGestionnaires, administrationsLocales]'
  })

  const isSuper = permissionsCheck(context.user, ['super'])

  const user = !isSuper && (await utilisateurGet(context.user.id))

  const demarcheType = metas.demarchesTypes.find(
    ({ id }) => id === demarche.typeId
  )

  return demarcheEtapeTypesFormat(
    user,
    isSuper,
    titre,
    demarche.typeId,
    demarche.etapes,
    demarcheType.etapesTypes,
    etapeTypeId
  )
}

const etapeCreer = async ({ etape }, context) => {
  try {
    if (!permissionsCheck(context.user, ['super', 'admin'])) {
      throw new Error('opération impossible')
    }

    let user

    const isSuper = permissionsCheck(context.user, ['super'])

    if (!isSuper) {
      const demarche = await titreDemarcheGet(etape.titreDemarcheId, {
        graph: null
      })

      if (!demarche) throw new Error("la démarche n'existe pas")

      const titre = await titreGet(demarche.titreId, {
        graph: '[administrationsGestionnaires, administrationsLocales]'
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

    if (isSuper) {
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

const etapeModifier = async ({ etape }, context) => {
  try {
    if (!permissionsCheck(context.user, ['super', 'admin'])) {
      throw new Error('opération impossible')
    }

    let user

    if (!permissionsCheck(context.user, ['super'])) {
      const demarche = await titreDemarcheGet(etape.titreDemarcheId, {
        graph: null
      })
      if (!demarche) throw new Error("la démarche n'existe pas")

      const titre = await titreGet(demarche.titreId, {
        graph: '[administrationsGestionnaires, administrationsLocales]'
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

const etapeSupprimer = async ({ id }, context) => {
  if (!permissionsCheck(context.user, ['super'])) {
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

export { demarcheEtapesTypes, etapeCreer, etapeModifier, etapeSupprimer }
