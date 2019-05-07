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
  demarches: [
    titreDemarcheNoChange,
    {
      id: 'h-nom-cxx-mut01',
      typeId: 'mut',
      titreId: 'h-nom-cxx'
    }
  ]
}

const titreWithDemarchesChanged = {
  demarches: [
    titreDemarcheChanged,
    {
      id: 'h-nom-cxx-mut01',
      typeId: 'mut',
      titreId: 'h-nom-cxx'
    }
  ]
}

export {
  titreDemarcheNoChange,
  titreDemarcheChanged,
  titreWithDemarchesNoChange,
  titreWithDemarchesChanged
}
