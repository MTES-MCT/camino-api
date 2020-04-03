import {
  ITitreEtape,
  ITitreDemarche,
  IUtilisateur,
  IFields
} from '../../../types'

import { permissionsCheck } from '../permissions/permissions-check'
import metas from '../../../database/cache/metas'

import {
  autorisations,
  restrictions
} from '../../../database/cache/autorisations'
import { demarcheTypeFormat } from './demarches-types'
import { titreEtapeFormatFields, titreEtapeFormat } from './titres-etapes'
import { titreFormatFields, titreFormat } from './titres'
import {
  titreDemarchePermissionAdministrationsCheck,
  titreEtapePermissionAdministrationsCheck
} from '../permissions/titre-edition'
import { titrePermissionCheck } from '../permissions/titre'

const titreDemarcheFormatFields = {
  etapes: titreEtapeFormatFields,
  titre: titreFormatFields
} as IFields

const titreEtapeAutorisationLectureCheck = (
  user: IUtilisateur | undefined,
  etapeTypeId: string,
  userHasPermission?: boolean
) => {
  const etapeTypeAutorisation = autorisations.etapesTypes.find(
    re => re.etapeTypeId === etapeTypeId
  )
  if (!etapeTypeAutorisation) return false

  // si l'utilisateur n'est pas connecté
  // ou qu'il n'a pas de droit sur le titre
  if (!user || !userHasPermission) {
    return etapeTypeAutorisation.publicLecture
  }

  // si l'utilisateur est titulaire ou amodiataire
  const isEntreprise = permissionsCheck(user, ['entreprise'])
  if (isEntreprise) return etapeTypeAutorisation.entreprisesLecture

  // si l'utilisateur fait partie d'au moins une administration
  const isAdministration =
    permissionsCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user.administrations?.length
  if (isAdministration) {
    // cherche si le type d'étape fait l'objet de restriction
    // pour toutes les administrations de l'utilisateur
    const isEtapeTypeAdministrationRestricted = user.administrations?.every(
      ({ id: administrationId }) =>
        restrictions.titresTypesEtapesTypesAdministrations.some(
          rea =>
            administrationId === rea.administrationId &&
            rea.etapeTypeId === etapeTypeId &&
            rea.lectureInterdit
        )
    )

    return !isEtapeTypeAdministrationRestricted
  }

  // ne devrait pas arriver jusqu'ici
  return false
}

const titreDemarcheFormat = (
  user: IUtilisateur | undefined,
  titreDemarche: ITitreDemarche,
  titreTypeId: string,
  titreStatutId: string,
  { isSuper, isAdmin }: { isSuper: boolean; isAdmin: boolean },
  fields: IFields = titreDemarcheFormatFields
) => {
  // visibilité des démarches non publiques
  if (
    !(
      // si l'utilisateur a les permissions
      userHasPermission ||
      // sinon, les démarches visibles au public
      // ont le statut `acc` ou `ter`
      ['acc', 'ter'].includes(titreDemarche.statutId!) ||
      // sauf pour les AXM et ARM
      // dont les démarches `rej` sont aussi visibles
      (['axm', 'arm'].includes(titreTypeId) &&
        titreDemarche.statutId! === 'rej')
    )
  ) {
    return undefined
  }

  if (!fields) return titreDemarche

  const userHasPermission = titrePermissionCheck(
    user,
    ['super', 'admin', 'editeur', 'lecteur'],
    titreDemarche.titre!
  )

  titreDemarche.editable =
    isSuper ||
    titreDemarchePermissionAdministrationsCheck(
      user,
      titreTypeId,
      titreStatutId
    )
  titreDemarche.supprimable = isSuper

  const demarcheType = metas.demarchesTypes.find(
    demarcheType => demarcheType.id === titreDemarche.typeId
  )

  if (!demarcheType) {
    throw new Error(
      `${titreDemarche.type!.nom} inexistant pour un titre ${titreTypeId}`
    )
  }

  // si au moins un type d'étape est éditable pour le type de démarche
  // alors on peut ajouter des étapes à la démarche
  titreDemarche.etapesEditable =
    isSuper ||
    demarcheType.etapesTypes.some(
      et =>
        et.titreTypeId === titreTypeId &&
        titreEtapePermissionAdministrationsCheck(
          user,
          titreTypeId,
          titreStatutId!,
          et.id,
          'modification'
        )
    )

  titreDemarche.type = demarcheTypeFormat(
    user,
    titreDemarche.type!,
    titreTypeId,
    titreStatutId!
  )

  if (fields.titre && titreDemarche.titre) {
    titreDemarche.titre = titreFormat(user, titreDemarche.titre, fields.titre)
  }

  if (fields.etapes && titreDemarche.etapes && titreDemarche.etapes.length) {
    const isSuper = permissionsCheck(user, ['super'])

    const titreEtapes = titreDemarche.etapes.reduce(
      (titreEtapes: ITitreEtape[], te) => {
        if (
          !isSuper &&
          !titreEtapeAutorisationLectureCheck(
            user,
            te.typeId,
            userHasPermission
          )
        ) {
          return titreEtapes
        }

        const teFormatted = titreEtapeFormat(
          user,
          te,
          titreTypeId,
          titreStatutId,
          titreDemarche.type!,
          { userHasPermission, isSuper, isAdmin },
          fields.etapes
        )

        titreEtapes.push(teFormatted)

        return titreEtapes
      },
      []
    )

    titreDemarche.etapes = titreEtapes
  }

  return titreDemarche
}

const titresDemarchesFormat = (
  user: IUtilisateur | undefined,
  titresDemarches: ITitreDemarche[],
  { isSuper, isAdmin }: { isSuper: boolean; isAdmin: boolean },
  fields = titreDemarcheFormatFields
) =>
  titresDemarches?.reduce(
    (titresDemarches: ITitreDemarche[], titreDemarche) => {
      if (!titreDemarche.titre) return titresDemarches

      const titreDemarcheFormated = titreDemarcheFormat(
        user,
        titreDemarche,
        titreDemarche.titre.typeId,
        titreDemarche.titre.statutId!,
        {
          isSuper,
          isAdmin
        },
        fields
      )

      if (titreDemarcheFormated) {
        titresDemarches.push(titreDemarcheFormated)
      }

      return titresDemarches
    },
    []
  )

export { titreDemarcheFormatFields, titreDemarcheFormat, titresDemarchesFormat }
