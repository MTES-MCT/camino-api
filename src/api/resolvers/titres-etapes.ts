import {
  IToken,
  IUtilisateur,
  ITitre,
  ITitreEtape,
  IEtapeType
} from '../../types'

import { debug } from '../../config/index'

import metas from '../../database/cache/metas'

import { titreFormat } from './format/titres'
import { etapesTypesFormat } from './format/etapes-types'

import { permissionsCheck } from './permissions/permissions-check'
import { titreEtapePermissionAdministrationsCheck } from './permissions/titre-edition'

import {
  titreEtapeGet,
  titreEtapeUpsert,
  titreEtapeDelete
} from '../../database/queries/titres-etapes'
import { titreDemarcheGet } from '../../database/queries/titres-demarches'
import { titreGet } from '../../database/queries/titres'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import titreEtapeUpdateTask from '../../business/titre-etape-update'
import titreEtapePointsCalc from '../../business/titre-etape-points-calc'
import titreEtapeUpdationValidate from '../../business/titre-etape-updation-validate'

const demarcheEtapeTypesFormat = (
  user: IUtilisateur | undefined,
  titre: ITitre,
  demarcheTypeId: string,
  titreEtapes: ITitreEtape[] | undefined,
  etapeTypeId: string | null
) => {
  const demarcheType = metas.demarchesTypes.find(
    ({ id }) => id === demarcheTypeId
  )
  if (!demarcheType || !demarcheType.etapesTypes) {
    throw new Error(`${demarcheTypeId} inexistant`)
  }

  const etapesTypes = demarcheType.etapesTypes

  return etapesTypes.reduce((etapesTypes: IEtapeType[], et) => {
    // si
    // - le type d'étape ne correspond pas au type de titre
    // ou
    // - il s'agit d'une creation d'étape (etapeTypeId absent)
    //   - ou il s'agit d'une modification d'étape (etapeTypeId présent)
    //   - et le type d'étape ne correspond pas à celui de l'étape éditée
    // - le type d'étape est unique
    // - la démarche contient déjà ce type d'étape
    // alors on n'ajoute pas ce type d'étape à ceux disponibles pour cette démarche
    if (
      et.titreTypeId !== titre.typeId ||
      ((!etapeTypeId || et.id !== etapeTypeId) &&
        et.unique &&
        titreEtapes &&
        titreEtapes.find(e => e.typeId === et.id))
    ) {
      return etapesTypes
    }

    et.editable = titreEtapePermissionAdministrationsCheck(
      user,
      titre.typeId,
      titre.statutId!,
      et.id,
      etapeTypeId ? 'modification' : 'creation'
    )

    if (et.editable) {
      et.demarcheTypeId = demarcheTypeId

      et = etapesTypesFormat(et)

      etapesTypes.push(et)
    }

    return etapesTypes
  }, [])
}

// si etapeTypeId existe
// alors c'est une modification d'étape
// sinon c'est une création d'étape dans une démarche
const demarcheEtapesTypes = async (
  {
    titreDemarcheId,
    etapeTypeId = null
  }: { titreDemarcheId: string; etapeTypeId: string | null },
  context: IToken
) => {
  const user = context.user && (await utilisateurGet(context.user.id))

  if (!user && !debug) return []

  const demarche = await titreDemarcheGet(titreDemarcheId, {
    graph: '[etapes, type.etapesTypes(orderAsc).etapesStatuts]'
  })

  if (!demarche) throw new Error("la démarche n'existe pas")

  if (!demarche.etapes) return []

  const titre = await titreGet(demarche.titreId, { graph: undefined })

  return demarcheEtapeTypesFormat(
    user,
    titre,
    demarche.typeId,
    demarche.etapes,
    etapeTypeId
  )
}

const etapeCreer = async (
  { etape }: { etape: ITitreEtape },
  context: IToken
) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))

    if (!user || !permissionsCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const isSuper = permissionsCheck(user, ['super'])

    if (!isSuper) {
      const demarche = await titreDemarcheGet(etape.titreDemarcheId, {
        graph: undefined
      })

      if (!demarche) throw new Error("la démarche n'existe pas")

      const titre = await titreGet(demarche.titreId, {
        graph: '[administrationsGestionnaires, administrationsLocales]'
      })

      if (!titre) throw new Error("le titre n'existe pas")

      if (
        !titreEtapePermissionAdministrationsCheck(
          user,
          titre.typeId,
          titre.statutId!,
          etape.typeId,
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
      etape.points = titreEtapePointsCalc(etape.points)
    }

    const etapeUpdated = await titreEtapeUpsert(etape)

    const titreUpdated = await titreEtapeUpdateTask(
      etapeUpdated.id,
      etapeUpdated.titreDemarcheId
    )

    return titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeModifier = async (
  { etape }: { etape: ITitreEtape },
  context: IToken
) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))

    if (!user || !permissionsCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    if (!permissionsCheck(user, ['super'])) {
      const demarche = await titreDemarcheGet(etape.titreDemarcheId, {
        graph: undefined
      })

      if (!demarche) throw new Error("la démarche n'existe pas")

      const titre = await titreGet(demarche.titreId, {
        graph: '[administrationsGestionnaires, administrationsLocales]'
      })
      if (!titre) throw new Error("le titre n'existe pas")

      if (
        !titreEtapePermissionAdministrationsCheck(
          user,
          titre.typeId,
          titre.statutId!,
          etape.typeId,
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
      etape.points = titreEtapePointsCalc(etape.points)
    }

    const etapeUpdated = await titreEtapeUpsert(etape)

    const titreUpdated = await titreEtapeUpdateTask(
      etapeUpdated.id,
      etapeUpdated.titreDemarcheId
    )

    return titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeSupprimer = async ({ id }: { id: string }, context: IToken) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))

    if (!user || !permissionsCheck(user, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const etapeOld = await titreEtapeGet(id)
    if (!etapeOld) throw new Error("l'étape n'existe pas")

    await titreEtapeDelete(id)

    const titreUpdated = await titreEtapeUpdateTask(
      null,
      etapeOld.titreDemarcheId
    )

    return titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { demarcheEtapesTypes, etapeCreer, etapeModifier, etapeSupprimer }
