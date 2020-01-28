const titreActiviteTypeFilter = (titre, { pays, types }) =>
  types.findIndex(
    type => type.domaineId === titre.domaineId && type.id === titre.typeId
  ) !== -1 &&
  (titre.pays || []).length > 0 &&
  pays.findIndex(pay => titre.pays.find(p => pay.id === p.id)) !== -1

export default titreActiviteTypeFilter
