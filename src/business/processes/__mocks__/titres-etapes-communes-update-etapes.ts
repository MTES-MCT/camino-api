import { IArea, ICommune, ITitreEtape } from '../../../types'
import { ITitreEtapesAreasIndex } from '../titres-etapes-areas-update'

const commune1: ICommune = {
  id: '1',
  nom: 'commune1',
  departementId: 'departement',
  surface: 0
}

const commune1SurfaceChangee = {
  id: '1',
  nom: 'commune1SurfaceChangee',
  departementId: 'departement',
  surface: 10
}

const commune2 = {
  id: '2',
  nom: 'commune2',
  departementId: 'departement',
  surface: 4
}

const titresEtapesSansPoints = ({
  id: 'h-cx-courdemanges-1988-oct01-dpu01',
  titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
  typeId: 'dpu',
  statutId: 'acc',
  ordre: 2,
  date: '1988-03-11'
} as unknown) as ITitreEtape

const titresEtapesPoints = ({
  id: 'h-cx-courdemanges-1988-oct01-dpu01',
  titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
  typeId: 'dpu',
  statutId: 'acc',
  ordre: 2,
  date: '1988-03-11',
  points: [1, 2]
} as unknown) as ITitreEtape

const titresEtapesPointsMemeCommune = ({
  id: 'h-cx-courdemanges-1988-oct01-dpu01',
  titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
  typeId: 'dpu',
  statutId: 'acc',
  ordre: 2,
  date: '1988-03-11',
  points: [1, 2]
} as unknown) as ITitreEtape

const titresEtapesPointsVides = ({
  id: 'h-cx-courdemanges-1988-oct01-dpu01',
  titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
  typeId: 'dpu',
  statutId: 'acc',
  ordre: 2,
  date: '1988-03-11',
  points: []
} as unknown) as ITitreEtape

const titresEtapesPointsCommuneInexistante = ({
  id: 'h-cx-courdemanges-1988-oct01-dpu01',
  titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
  typeId: 'dpu',
  statutId: 'acc',
  ordre: 2,
  date: '1988-03-11',
  points: [],
  communes: [commune1]
} as unknown) as ITitreEtape

const titresEtapesPointsCommuneExistante = ({
  id: 'h-cx-courdemanges-1988-oct01-dpu01',
  titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
  typeId: 'dpu',
  statutId: 'acc',
  ordre: 2,
  date: '1988-03-11',
  points: [1, 2],
  communes: [commune1]
} as unknown) as ITitreEtape

const titreEtapesAreasIndexGet = (
  titresEtapes: ITitreEtape,
  communes: IArea[]
): ITitreEtapesAreasIndex => ({
  [titresEtapes.id]: {
    titreEtape: titresEtapes,
    areas: { communes }
  }
})

export {
  commune1,
  commune1SurfaceChangee,
  commune2,
  titresEtapesSansPoints,
  titresEtapesPoints,
  titresEtapesPointsMemeCommune,
  titresEtapesPointsVides,
  titresEtapesPointsCommuneInexistante,
  titresEtapesPointsCommuneExistante,
  titreEtapesAreasIndexGet
}
