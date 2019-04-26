const titreDemarcheNoChange = {
  id: 'h-nom-cxx-oct01',
  typeId: 'oct',
  titreId: 'h-nom-cxx'
}

const titreDemarcheChanged = {
  id: 'h-nom-cxx-oct01',
  typeId: 'mut',
  titreId: 'h-nom-cxx'
}

const titreWithDemarchesNoChange = {
  demarches: [titreDemarcheNoChange]
}

const titreWithDemarchesChanged = {
  demarches: [titreDemarcheChanged]
}

export {
  titreDemarcheNoChange,
  titreDemarcheChanged,
  titreWithDemarchesNoChange,
  titreWithDemarchesChanged
}
