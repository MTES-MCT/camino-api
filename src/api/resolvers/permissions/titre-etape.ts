import { permissionsAdministrationsCheck } from './permissions-check'
import restrictions from '../../../database/cache/restrictions'
import { IUtilisateur, IAdministration } from '../../../types'

type ModeName = 'creationInterdit' | 'modificationInterdit'

const titreEtapeEditionAdministrationsIdsFind = (
  mode: 'modification' | 'creation',
  etapeTypeId: string | undefined,
  titreAdministrationsGestionnaires: IAdministration[] | undefined,
  titreAdministrationsLocales: IAdministration[] | undefined
) => {
  const titreAdministrations = []

  if (titreAdministrationsGestionnaires) {
    titreAdministrations.push(...titreAdministrationsGestionnaires)
  }

  if (titreAdministrationsLocales) {
    titreAdministrations.push(...titreAdministrationsLocales)
  }

  // ne garde que les restrictions qui concernent le titre
  const titreEtapeRestrictions = restrictions.etapesTypesAdministrations.filter(
    r => r.etapeTypeId === etapeTypeId && r[`${mode}Interdit` as ModeName]
  )

  // filtre les administration qui font l'objet d'une restriction
  return titreAdministrations.reduce(
    (titreEtapeEditionAdministrationsIds: string[], a) => {
      if (!titreEtapeRestrictions.find(r => r.administrationId === a.id)) {
        titreEtapeEditionAdministrationsIds.push(a.id)
      }

      return titreEtapeEditionAdministrationsIds
    },
    []
  )
}

const titreEtapePermissionAdministrationsCheck = (
  user: IUtilisateur | undefined,
  mode: 'modification' | 'creation',
  etapeTypeId: string | undefined,
  titreTypeId: string,
  titreAdministrationsGestionnaires: IAdministration[] | undefined,
  titreAdministrationsLocales: IAdministration[] | undefined
) => {
  if (['arm', 'axm'].includes(titreTypeId)) return false

  const titreEtapeEditionAdministrationsIds = titreEtapeEditionAdministrationsIdsFind(
    mode,
    etapeTypeId,
    titreAdministrationsGestionnaires,
    titreAdministrationsLocales
  )

  return permissionsAdministrationsCheck(
    user,
    titreEtapeEditionAdministrationsIds
  )
}

export default titreEtapePermissionAdministrationsCheck
