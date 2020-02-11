const titreWithDemarchesNoChange = {
  demarches: [
    {
      id: 'h-cx-nom-oct01',
      etapes: [
        {
          id: 'h-cx-nom-oct01-dex01',
          typeId: 'dex',
          titreDemarcheId: 'h-cx-nom-oct01'
        }
      ]
    }
  ]
}

const titreWithDemarchesChanged = {
  demarches: [
    {
      id: 'h-cx-nom-oct01',
      etapes: [
        {
          id: 'h-cx-nom-oct01-dex01',
          typeId: 'dpu',
          titreDemarcheId: 'h-cx-nom-oct01'
        }
      ]
    }
  ]
}

const titreWith2Dpu = {
  demarches: [
    {
      id: 'h-cx-nom-oct01',
      etapes: [
        {
          id: 'h-cx-nom-oct01-dex01',
          typeId: 'dpu',
          ordre: 1,
          titreDemarcheId: 'h-cx-nom-oct01'
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
          titreDemarcheId: 'h-cx-nom-oct01'
        }
      ]
    }
  ]
}

const titreWithTitulaire = {
  titulairesTitreEtapeId: 'h-cx-nom-oct01-dex01',
  demarches: [
    {
      id: 'h-cx-nom-oct01',
      etapes: [
        {
          id: 'h-cx-nom-oct01-dex01',
          typeId: 'dpu',
          ordre: 1,
          titreDemarcheId: 'h-cx-nom-oct01',
          titulaire: true
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
          titreDemarcheId: 'h-cx-nom-oct01'
        }
      ]
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
  titreWith2Dpu,
  titreWithTitulaire,
  titreWithSubElement
}
