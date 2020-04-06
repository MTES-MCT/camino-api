import { IUtilisateur } from '../../../types'

import {
  autorisations,
  restrictions
} from '../../../database/cache/autorisations'

import { permissionsCheck } from './permissions-check'

type TypeName =
  | 'titresModificationInterdit'
  | 'demarchesModificationInterdit'
  | 'etapesModificationInterdit'
type ModeName = 'creationInterdit' | 'modificationInterdit'

const titreTypePermissionAdministrationIdCheck = (
  administrationId: string,
  titreTypeId: string,
  mode: 'creation' | 'modification'
) =>
  autorisations.titresTypesAdministrations.some(
    tta =>
      administrationId === tta.administrationId &&
      tta.titreTypeId === titreTypeId &&
      // seule une administration gestionnaire peut créer un titre de ce type
      (mode === 'creation' ? tta.gestionnaire : true)
  )

const titreTypeStatutPermissionAdministrationCheck = (
  administrationId: string,
  titreTypeId: string,
  titreStatutId: string,
  type: 'titres' | 'demarches' | 'etapes'
) =>
  // vérifie que le type de titre est éditable par l'administration
  titreTypePermissionAdministrationIdCheck(
    administrationId,
    titreTypeId,
    'modification'
  ) &&
  // vérifie que l'administration n'a pas de restriction
  // sur le type donné au statut donné
  !restrictions.titresTypesTitresStatutsAdministrations.some(
    restriction =>
      restriction.administrationId === administrationId &&
      restriction.titreTypeId === titreTypeId &&
      restriction.titreStatutId === titreStatutId &&
      restriction[`${type}ModificationInterdit` as TypeName]
  )

const titreEtapePermissionAdministrationCheck = (
  administrationId: string,
  titreTypeId: string,
  titreStatutId: string,
  etapeTypeId: string,
  mode: 'creation' | 'modification'
) =>
  // vérifie que le type de titre est éditable par l'administration
  titreTypePermissionAdministrationIdCheck(
    administrationId,
    titreTypeId,
    'modification'
  ) &&
  // vérifie que l'administration a les droits d'édition
  // sur les étapes du titre au statut donné
  titreTypeStatutPermissionAdministrationCheck(
    administrationId,
    titreTypeId,
    titreStatutId,
    'etapes'
  ) &&
  // vérifie que l'administration n'a pas de restriction
  // sur le type d'étape pour le titre au mode d'édition donné
  !restrictions.titresTypesEtapesTypesAdministrations.some(
    restriction =>
      restriction.administrationId === administrationId &&
      restriction.titreTypeId === titreTypeId &&
      restriction.etapeTypeId === etapeTypeId &&
      restriction[`${mode}Interdit` as ModeName]
  )

const titrePermissionAdministrationsCheck = (
  user: IUtilisateur | undefined,
  titreTypeId: string,
  titreStatutId: string
) =>
  user &&
  (permissionsCheck(user, ['super']) ||
    // vérifie qu'au moins une administration a les droits d'édition
    // sur le type de titre pour un statut donné
    user.administrations!.some(administration =>
      titreTypeStatutPermissionAdministrationCheck(
        administration.id,
        titreTypeId,
        titreStatutId,
        'titres'
      )
    ))

const titreDemarchePermissionAdministrationsCheck = (
  user: IUtilisateur | undefined,
  titreTypeId: string,
  titreStatutId: string
) =>
  user &&
  (permissionsCheck(user, ['super']) ||
    // vérifie qu'au moins une administration a les droits d'édition
    // sur les démarches du titre au statut donné
    user.administrations!.some(administration =>
      titreTypeStatutPermissionAdministrationCheck(
        administration.id,
        titreTypeId,
        titreStatutId,
        'demarches'
      )
    ))

const titreEtapePermissionAdministrationsCheck = (
  user: IUtilisateur | undefined,
  titreTypeId: string,
  titreStatutId: string,
  etapeTypeId: string,
  mode: 'creation' | 'modification'
) =>
  user &&
  (permissionsCheck(user, ['super']) ||
    user.administrations!.some(administration =>
      // vérifie qu'au moins une administration a les droits d'édition
      // sur le type de démarche au statut donné
      titreEtapePermissionAdministrationCheck(
        administration.id,
        titreTypeId,
        titreStatutId,
        etapeTypeId,
        mode
      )
    ))

export {
  titrePermissionAdministrationsCheck,
  titreDemarchePermissionAdministrationsCheck,
  titreEtapePermissionAdministrationsCheck
}
