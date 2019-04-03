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

const titreWith2Dpu = {
  demarches: [
    {
      id: 'h-nom-cxx-oct01',
      etapes: [
        {
          id: 'h-nom-cxx-oct01-dex01',
          typeId: 'dpu',
          ordre: 1,
          titreDemarcheId: 'h-nom-cxx-oct01'
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
          titreDemarcheId: 'h-nom-cxx-oct01'
        }
      ]
    }
  ]
}

const titreWithTitulaire = {
  titulairesTitreEtapeId: 'h-nom-cxx-oct01-dex01',
  demarches: [
    {
      id: 'h-nom-cxx-oct01',
      etapes: [
        {
          id: 'h-nom-cxx-oct01-dex01',
          typeId: 'dpu',
          ordre: 1,
          titreDemarcheId: 'h-nom-cxx-oct01',
          titulaire: true
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
          titreDemarcheId: 'h-nom-cxx-oct01'
        }
      ]
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
  titreEtapeNoChange,
  titreEtapeChanged,
  titreWithDemarchesNoChange,
  titreWithDemarchesChanged,
  titreWith2Dpu,
  titreWithTitulaire,
  titreWithSubElement
}
