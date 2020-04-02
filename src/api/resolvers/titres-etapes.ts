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
import { userGet } from '../../database/queries/utilisateurs'

import titreEtapeUpdateTask from '../../business/titre-etape-update'
import titreEtapePointsCalc from '../../business/titre-etape-points-calc'
import titreEtapeUpdationValidate from '../../business/titre-etape-updation-validate'
import titreEtapeDateValidate from '../../business/utils/titre-etape-date-validate'
import { GraphQLResolveInfo } from 'graphql'
import fieldsBuild from './_fields-build'

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
    // si le type d'étape courant est celui de l'étape dont l'éditione est en cours
    // alors on ne procède pas à la vérification car elle existe déjà
    if (et.id === etapeTypeId) return true

    // todo: utiliser la date de l'étape éditée
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

  et.modification = titreEtapePermissionAdministrationsCheck(
    user,
    titre.typeId,
    titre.statutId!,
    et.id,
    etapeTypeId ? 'modification' : 'creation'
  )

  if (!et.modification) {
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

  return demarcheType.etapesTypes
    .sort((a, b) => a.ordre - b.ordre)
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
  try {
    const user = context.user && (await userGet(context.user.id))
    if (!user) return []

    const demarche = await titreDemarcheGet(
      titreDemarcheId,
      {},
      user && user.id
    )
    if (!demarche) throw new Error("la démarche n'existe pas")

    const titre = await titreGet(demarche.titreId, {}, user.id)

    return demarcheEtapeTypesFormat(user, titre, demarche, etapeTypeId)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeCreer = async (
  { etape }: { etape: ITitreEtape },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionsCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const demarche = await titreDemarcheGet(
      etape.titreDemarcheId,
      {},
      user && user.id
    )

    if (!demarche) throw new Error("la démarche n'existe pas")

    const titre = await titreGet(
      demarche.titreId,
      {
        fields: {
          administrationsGestionnaires: { id: {} },
          administrationsLocales: { id: {} }
        }
      },
      user.id
    )

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

    const rulesErrors = await titreEtapeUpdationValidate(etape, demarche, titre)

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    if (etape.points) {
      etape.points = titreEtapePointsCalc(etape.points)
    }

    const etapeUpdated = await titreEtapeUpsert(etape)

    const titreUpdatedId = await titreEtapeUpdateTask(
      etapeUpdated.id,
      etapeUpdated.titreDemarcheId
    )

    const fields = fieldsBuild(info)
    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user.id)

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
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionsCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const demarche = await titreDemarcheGet(
      etape.titreDemarcheId,
      {},
      user && user.id
    )

    if (!demarche) throw new Error("la démarche n'existe pas")

    const titre = await titreGet(
      demarche.titreId,
      {
        fields: {
          administrationsGestionnaires: { id: {} },
          administrationsLocales: { id: {} }
        }
      },
      user.id
    )
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

    const rulesErrors = await titreEtapeUpdationValidate(etape, demarche, titre)
    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    if (etape.points) {
      etape.points = titreEtapePointsCalc(etape.points)
    }

    const etapeUpdated = await titreEtapeUpsert(etape)

    const titreUpdatedId = await titreEtapeUpdateTask(
      etapeUpdated.id,
      etapeUpdated.titreDemarcheId
    )

    const fields = fieldsBuild(info)
    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user.id)

    return titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeSupprimer = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionsCheck(user, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const etapeOld = await titreEtapeGet(id, { fields }, context.user?.id)
    if (!etapeOld) throw new Error("l'étape n'existe pas")

    await titreEtapeDelete(id)

    const titreUpdatedId = await titreEtapeUpdateTask(
      null,
      etapeOld.titreDemarcheId
    )

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user.id)

    return titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { demarcheEtapesTypes, etapeCreer, etapeModifier, etapeSupprimer }
