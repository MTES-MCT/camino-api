import {
  IToken,
  IUtilisateur,
  ITitre,
  ITitreEtape,
  IEtapeType,
  ITitreEtapeInput,
  ITitreIncertitudes,
  ISubstance,
  ITitrePointInput,
  ITitrePoint
} from '../../types'

import { debug } from '../../config/index'

import metas from '../../database/cache/metas'

import { titreFormat } from './format/titres'
import { etapesTypesFormat } from './format/etapes-types'

import { permissionsCheck } from './permissions/permissions-check'
import { titrePermissionAdministrationsCheck } from './permissions/titre'
import titreEtapePermissionAdministrationsCheck from './permissions/titre-etape'

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

const pointInputConvert = (pointInput: ITitrePointInput) =>
  ({
    nom: pointInput.nom,
    groupe: pointInput.groupe,
    contour: pointInput.contour,
    point: pointInput.point,
    references: pointInput.references,
    lot: pointInput.lot,
    description: pointInput.description,
    securite: pointInput.securite,
    subsidiaire: pointInput.subsidiaire
  } as ITitrePoint)

const etapeInputConvert = (etapeInput: ITitreEtapeInput) =>
  ({
    id: etapeInput.id,
    typeId: etapeInput.typeId,
    statutId: etapeInput.statutId,
    titreDemarcheId: etapeInput.titreDemarcheId,
    date: etapeInput.date,
    ordre: etapeInput.ordre,
    duree: etapeInput.duree,
    dateDebut: etapeInput.dateDebut,
    dateFin: etapeInput.dateFin,
    surface: etapeInput.surface,
    volume: etapeInput.volume,
    volumeUniteId: etapeInput.volumeUniteId,
    engagement: etapeInput.engagement,
    engagementDeviseId: etapeInput.engagementDeviseId,
    substances:
      etapeInput.substancesIds &&
      (etapeInput.substancesIds.map(id => ({ id })) as ISubstance[]),
    points:
      etapeInput.points &&
      titreEtapePointsCalc(etapeInput.points.map(p => pointInputConvert(p))),
    titulaires:
      etapeInput.titulairesIds && etapeInput.titulairesIds.map(id => ({ id })),
    amodiataires:
      etapeInput.amodiatairesIds &&
      etapeInput.amodiatairesIds.map(id => ({ id })),
    administrations:
      etapeInput.administrationsIds &&
      etapeInput.administrationsIds.map(id => ({ id })),
    incertitudes: etapeInput.incertitudes as ITitreIncertitudes,
    contenu: etapeInput.contenu
  } as ITitreEtape)

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

  const etapesTypes = demarcheType?.etapesTypes

  if (!etapesTypes) return []

  const isSuper = permissionsCheck(user, ['super'])

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

    // actuellement, on ne peut éditer que les ARM et les AEX
    et.editable =
      isSuper ||
      titreEtapePermissionAdministrationsCheck(
        user,
        etapeTypeId ? 'modification' : 'creation',
        titre.typeId,
        et.id,
        titre.administrationsGestionnaires,
        titre.administrationsLocales
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

  if (!demarche.etapes) return []

  const titre = await titreGet(demarche.titreId, {
    graph: '[administrationsGestionnaires, administrationsLocales]'
  })

  return demarcheEtapeTypesFormat(
    user,
    titre,
    demarche.typeId,
    demarche.etapes,
    etapeTypeId
  )
}

const etapeCreer = async (
  { etape: etapeInput }: { etape: ITitreEtapeInput },
  context: IToken
) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))

    if (!user || !permissionsCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const isSuper = permissionsCheck(user, ['super'])

    if (!isSuper) {
      const demarche = await titreDemarcheGet(etapeInput.titreDemarcheId, {
        graph: ''
      })

      if (!demarche) throw new Error("la démarche n'existe pas")

      const titre = await titreGet(demarche.titreId, {
        graph: '[administrationsGestionnaires, administrationsLocales]'
      })

      if (!titre) throw new Error("le titre n'existe pas")

      if (
        !titrePermissionAdministrationsCheck(
          user,
          'modification',
          titre.typeId,
          titre.statutId!,
          titre.administrationsGestionnaires,
          titre.administrationsLocales
        ) ||
        !titreEtapePermissionAdministrationsCheck(
          user,
          'creation',
          etapeInput.typeId,
          titre.typeId,
          titre.administrationsGestionnaires,
          titre.administrationsLocales
        )
      ) {
        throw new Error('droits insuffisants pour créer cette étape')
      }
    }

    const etape = etapeInputConvert(etapeInput)

    const rulesErrors = await titreEtapeUpdationValidate(etape)

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
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
  { etape: etapeInput }: { etape: ITitreEtapeInput },
  context: IToken
) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))

    if (!user || !permissionsCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    if (!permissionsCheck(user, ['super'])) {
      const demarche = await titreDemarcheGet(etapeInput.titreDemarcheId, {
        graph: ''
      })

      if (!demarche) throw new Error("la démarche n'existe pas")

      const titre = await titreGet(demarche.titreId, {
        graph: '[administrationsGestionnaires, administrationsLocales]'
      })
      if (!titre) throw new Error("le titre n'existe pas")

      if (
        !titrePermissionAdministrationsCheck(
          user,
          'modification',
          titre.typeId,
          titre.statutId!,
          titre.administrationsGestionnaires,
          titre.administrationsLocales
        ) ||
        !titreEtapePermissionAdministrationsCheck(
          user,
          'modification',
          etapeInput.typeId,
          titre.typeId,
          titre.administrationsGestionnaires,
          titre.administrationsLocales
        )
      ) {
        throw new Error('droits insuffisants pour modifier cette étape')
      }
    }

    const etape = etapeInputConvert(etapeInput)

    const rulesErrors = await titreEtapeUpdationValidate(etape)

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
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
