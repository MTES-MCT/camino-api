const titreEtapeNoChange = {
  id: 'h-nom-cxx-oct01-dex01',
  typeId: 'dex',
  titreDemarcheId: 'h-nom-cxx-oct01'
}

const titreEtapeChanged = {
  id: 'h-nom-cxx-oct01-dex01',
  typeId: 'dpu',
  titreDemarcheId: 'h-nom-cxx-oct01'
}

const titreWithDemarchesNoChange = {
  demarches: [
    {
      id: 'h-nom-cxx-oct01',
      etapes: [
        {
          id: 'h-nom-cxx-oct01-dex01',
          typeId: 'dex',
          titreDemarcheId: 'h-nom-cxx-oct01'
        }
      ]
    }
  ]
}

const titreWithDemarchesChanged = {
  demarches: [
    {
      id: 'h-nom-cxx-oct01',
      etapes: [
        {
          id: 'h-nom-cxx-oct01-dex01',
          typeId: 'dpu',
          titreDemarcheId: 'h-nom-cxx-oct01'
        }
      ]
    }
  ]
}

export {
  titreEtapeNoChange,
  titreEtapeChanged,
  titreWithDemarchesNoChange,
  titreWithDemarchesChanged
}
