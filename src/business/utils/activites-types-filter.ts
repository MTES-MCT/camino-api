import { ITitres, IActivitesTypes } from '../../types'

const activitesTypesFilter = (titre: ITitres, activiteType: IActivitesTypes) =>
  !!(
    activiteType.types.some(
      type => type.domaineId === titre.domaineId && type.id === titre.typeId
    ) &&
    titre.pays &&
    activiteType.pays &&
    activiteType.pays.some(pay => titre.pays!.some(p => pay.id === p.id))
  )

export default activitesTypesFilter
