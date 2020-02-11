const titreWithDemarchesNoChange = {
  demarches: [
    {
      id: 'h-cx-nom-oct01',
      typeId: 'oct',
      etapes: []
    }
  ]
}

const titreWithDemarchesChanged = {
  demarches: [
    {
      id: 'h-cx-nom-oct01',
      titreId: 'h-cx-nom',
      typeId: 'mut',
      etapes: []
    }
  ]
}

const titreWith2Mut = {
  demarches: [
    {
      id: 'h-cx-nom-oct01',
      titreId: 'h-cx-nom',
      typeId: 'mut',
      etapes: [
        {
          id: 'h-cx-nom-oct01-dex01',
          typeId: 'dex',
          ordre: 1,
          titreDemarcheId: 'h-cx-nom-oct01',
          date: '2000-01-01'
        }
      ]
    },
    {
      id: 'h-cx-nom-mut01',
      titreId: 'h-cx-nom',
      typeId: 'mut',
      etapes: [
        {
          id: 'h-cx-nom-mut02-dex01',
          typeId: 'dex',
          ordre: 1,
          titreDemarcheId: 'h-cx-nom-mut02',
          date: '3000-01-01'
        }
      ]
    }
  ]
}

const titreWithPhase = {
  demarches: [
    {
      id: 'h-cx-nom-oct01',
      titreId: 'h-cx-nom',
      typeId: 'mut',
      etapes: [],
      phase: {
        titreDemarcheId: 'h-cx-nom-oct01'
      }
    }
  ]
}

const titreWithSubElement = {
  demarches: [
    {
      id: 'h-cx-nom-oct01',
      etapes: [
        {
          id: 'h-cx-nom-oct01-dex01',
          typeId: 'dpu',
          ordre: 1,
          titreDemarcheId: 'h-cx-nom-oct01',
          points: [
            {
              id: 'h-cx-nom-oct01-dex01-g01-p01-c01',
              titreEtapeId: 'h-cx-nom-oct01-dex01',
              references: [
                {
                  id: 'h-cx-nom-oct01-dex01-g01-p01-c01-134563',
                  titrePointId: 'h-cx-nom-oct01-dex01-g01-p01-c01'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'h-cx-nom-oct01',
      etapes: [
        {
          id: 'h-cx-nom-oct01-dpu01',
          ordre: 2,
          typeId: 'dpu',
          titreDemarcheId: 'h-cx-nom-oct01',
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
