import { IAdministration, ITitreAdministrationsGestionnaire } from '../../types'

// administrations restreintes à certains types types de titres
const administrationsTypesRestrictions = {
  'ope-ptmg-973-01': ['arm'],
  'ope-onf-973-01': ['arm'],
  'dea-guyane-01': ['axm']
} as { [id: string]: string[] }

// administrations associees sur certains types de titres
const administrationsTypesAssociees = {
  'dea-guyane-01': ['arm'],
  'ope-ptmg-973-01': ['arm'],
  'min-mtes-dgaln-01': ['arm', 'axm']
} as { [id: string]: string[] }

const titreAdministrationsGestionnairesBuild = (
  {
    id: titreId,
    domaineId,
    typeId
  }: { id: string; domaineId: string; typeId: string },
  administrations: IAdministration[]
) =>
  administrations.reduce(
    (
      titreAdministrationsGestionnaires: ITitreAdministrationsGestionnaire[],
      administration
    ) => {
      const isTitreAdministration =
        administration.domaines &&
        administration.domaines.length &&
        administration.domaines.find(({ id }) => id === domaineId)

      if (!isTitreAdministration) return titreAdministrationsGestionnaires

      const typesRestrictions =
        administrationsTypesRestrictions[administration.id]

      // si
      // - il y a des restrictions pour cette administration gestionnaire
      // - le type de titre n'est pas trouvé parmi les types de titres autorisés
      // l'administration n'est pas rattachée à l'étape
      if (typesRestrictions && !typesRestrictions.includes(typeId)) {
        return titreAdministrationsGestionnaires
      }

      const associee =
        administrationsTypesAssociees[administration.id] &&
        administrationsTypesAssociees[administration.id].includes(typeId)

      const titreAdministrationGestionnaire = {
        titreId,
        administrationId: administration.id
      } as ITitreAdministrationsGestionnaire

      if (associee) {
        titreAdministrationGestionnaire.associee = associee
      }

      titreAdministrationsGestionnaires.push(titreAdministrationGestionnaire)

      return titreAdministrationsGestionnaires
    },
    []
  )

export default titreAdministrationsGestionnairesBuild
