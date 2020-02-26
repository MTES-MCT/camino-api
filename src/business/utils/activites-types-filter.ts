import { ITitre, IActiviteType } from '../../types'

const activitesTypesFilter = (titre: ITitre, activiteType: IActiviteType) =>
  !!(
    activiteType.titresTypes.some(
      titreType =>
        titreType.domaineId === titre.domaineId &&
        titreType.id === titre.typeId
    ) &&
    titre.pays &&
    activiteType.pays?.some(pay => titre.pays!.some(p => pay.id === p.id))
  )

export default activitesTypesFilter
