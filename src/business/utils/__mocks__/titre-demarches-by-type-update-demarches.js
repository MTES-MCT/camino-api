const titreWithDemarchesNoChange = {
  demarches: [
    {
      id: 'h-nom-cxx-oct01',
      typeId: 'oct',
      etapes: []
    }
  ]
}

const titreWithDemarchesChanged = {
  demarches: [
    {
      id: 'h-nom-cxx-oct01',
      titreId: 'h-nom-cxx',
      typeId: 'mut',
      etapes: []
    }
  ]
}

const titreWith2Mut = {
  demarches: [
    {
      id: 'h-nom-cxx-oct01',
      titreId: 'h-nom-cxx',
      typeId: 'mut',
      etapes: [
        {
          id: 'h-nom-cxx-oct01-dex01',
          typeId: 'dex',
          ordre: 1,
          titreDemarcheId: 'h-nom-cxx-oct01',
          date: '2000-01-01'
        }
      ]
    },
    {
      id: 'h-nom-cxx-mut01',
      titreId: 'h-nom-cxx',
      typeId: 'mut',
      etapes: [
        {
          id: 'h-nom-cxx-mut02-dex01',
          typeId: 'dex',
          ordre: 1,
          titreDemarcheId: 'h-nom-cxx-mut02',
          date: '3000-01-01'
        }
      ]
    }
  ]
}

const titreWithPhase = {
  demarches: [
    {
      id: 'h-nom-cxx-oct01',
      titreId: 'h-nom-cxx',
      typeId: 'mut',
      etapes: [],
      phase: {
        titreDemarcheId: 'h-nom-cxx-oct01'
      }
    }
  ]
}

const titreWithSubElement = {
  demarches: [
    {
      id: 'h-nom-cxx-oct01',
      etapes: [
        {
          id: 'h-nom-cxx-oct01-dex01',
          typeId: 'dpu',
          ordre: 1,
          titreDemarcheId: 'h-nom-cxx-oct01',
          points: [
            {
              id: 'h-nom-cxx-oct01-dex01-g01-p01-c01',
              titreEtapeId: 'h-nom-cxx-oct01-dex01',
              references: [
                {
                  id: 'h-nom-cxx-oct01-dex01-g01-p01-c01-134563',
                  titrePointId: 'h-nom-cxx-oct01-dex01-g01-p01-c01'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'h-nom-cxx-oct01',
      etapes: [
        {
          id: 'h-nom-cxx-oct01-dpu01',
          ordre: 2,
          typeId: 'dpu',
          titreDemarcheId: 'h-nom-cxx-oct01',
          points: []
        }
      ]
    }
  ]
}

export {
  titreWithDemarchesNoChange,
  titreWithDemarchesChanged,
  titreWith2Mut,
  titreWithPhase,
  titreWithSubElement
}
