const titreActivitesTypesFilter = (titre, activitesTypes) =>
  activitesTypes.filter(
    ({ pays, types }) =>
      types.find(
        type => type.domaineId === titre.domaineId && type.id === titre.typeId
      ) &&
      titre.pays &&
      pays.find(pay => titre.pays.find(p => pay.id === p.id))
  )

export default titreActivitesTypesFilter
