import { IAdministration, ITitreAdministrationGestionnaire } from '../../types'

const titreAdministrationsGestionnairesBuild = (
  { id: titreId, typeId }: { id: string; typeId: string },
  administrations: IAdministration[]
) =>
  administrations.reduce(
    (
      titreAdministrationsGestionnaires: ITitreAdministrationGestionnaire[],
      administration
    ) => {
      const administrationTitreType = administration.titresTypes?.find(
        at => at.id === typeId
      )

      // si le type de titre n'est pas autorisé pour cette administration
      // ou que l'administration n'est pas gestionnaire
      // alors on ne l'ajoute pas aux administrations gestionnaires
      if (!administrationTitreType || !administrationTitreType.gestionnaire) {
        return titreAdministrationsGestionnaires
      }

      const titreAdministrationGestionnaire = {
        titreId,
        administrationId: administration.id
      } as ITitreAdministrationGestionnaire

      if (administrationTitreType.associee) {
        titreAdministrationGestionnaire.associee =
          administrationTitreType.associee
      }

      titreAdministrationsGestionnaires.push(titreAdministrationGestionnaire)

      return titreAdministrationsGestionnaires
    },
    []
  )

export default titreAdministrationsGestionnairesBuild
