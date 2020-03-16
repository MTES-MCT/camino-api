import {
  IToken,
  IUtilisateur,
  ITitre,
  ITitreDemarche,
  ITitreEtape,
  IEtapeType
} from '../../types'

import { debug } from '../../config/index'

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
import titreEtapeDateValidate from '../../business/utils/titre-etape-date-validate'

const demarcheTypeEtapeTypeFormat = (
  user: IUtilisateur | undefined,
  et: IEtapeType,
  titre: ITitre,
  demarche: ITitreDemarche,
  etapeTypeId: string | null
) => {
  const { typeId: demarcheTypeId, etapes: titreEtapes } = demarche

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
    return null
  }

  // TODO : filtrer les types d'étapes avec type.dateFin
  // en fonction de la date du titre

  // restreint la liste des types d'étapes en fonction
  // de la possibilité de les créer
  et.etapesStatuts = et.etapesStatuts!.filter(es => {
    const error = !titreEtapeDateValidate(
      { typeId: et.id, date: '3000-01-01', statutId: es.id } as ITitreEtape,
      demarche,
      titre
    )

    return error
  })

  // si il n'est possible de crééer le type d'étape pour aucun statut
  // alors on ne retourne pas ce type d'étape pendant l'édition
  if (!et.etapesStatuts.length) return null

  et.editable = titreEtapePermissionAdministrationsCheck(
    user,
    titre.typeId,
    titre.statutId!,
    et.id,
    etapeTypeId ? 'modification' : 'creation'
  )

  if (!et.editable) {
    return null
  }

  et.demarcheTypeId = demarcheTypeId

  et = etapesTypesFormat(et)

  return et
}

const demarcheEtapeTypesFormat = (
  user: IUtilisateur | undefined,
  titre: ITitre,
  demarche: ITitreDemarche,
  etapeTypeId: string | null
) => {
  const { typeId: demarcheTypeId, type: demarcheType } = demarche

  if (!demarcheType || !demarcheType.etapesTypes) {
    throw new Error(`${demarcheTypeId} inexistant`)
  }

  return demarcheType.etapesTypes.sort((a, b) => a.ordre - b.ordre)
    .reduce((etapesTypes: IEtapeType[], et) => {
      const etapeType = demarcheTypeEtapeTypeFormat(
        user,
        et,
        titre,
        demarche,
        etapeTypeId
      )

      if (etapeType) {
        etapesTypes.push(etapeType)
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
    demarche,
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
