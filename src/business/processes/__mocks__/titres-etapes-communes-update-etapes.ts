import Communes from '../../../database/models/communes'
import Forets from '../../../database/models/forets'
import TitresEtapes from '../../../database/models/titres-etapes'

const commune1 = {
  id: '1',
  nom: 'commune1',
  departementId: 'departement',
  surface: 0
} as Communes

const foret1 = {
  id: '1',
  nom: 'foret1',
  surface: 10
} as Forets

const commune1SurfaceChangee = {
  id: '1',
  nom: 'commune1SurfaceChangee',
  departementId: 'departement',
  surface: 10
}

const foret1SurfaceChangee = {
  id: '1',
  nom: 'foret1SurfaceChangee',
  surface: 20
} as Forets

const commune2 = {
  id: '2',
  nom: 'commune2',
  departementId: 'departement',
  surface: 4
} as Communes

const titresEtapesSansPoints = {
  id: 'h-cx-courdemanges-1988-oct01-dpu01',
  titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
  typeId: 'dpu',
  statutId: 'acc',
  ordre: 2,
  date: '1988-03-11'
} as unknown as TitresEtapes

const titresEtapesPoints = {
  id: 'h-cx-courdemanges-1988-oct01-dpu01',
  titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
  typeId: 'dpu',
  statutId: 'acc',
  ordre: 2,
  date: '1988-03-11',
  points: [1, 2]
} as unknown as TitresEtapes

const titresEtapesPointsMemeCommune = {
  id: 'h-cx-courdemanges-1988-oct01-dpu01',
  titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
  typeId: 'dpu',
  statutId: 'acc',
  ordre: 2,
  date: '1988-03-11',
  points: [1, 2]
} as unknown as TitresEtapes

const titresEtapesPointsVides = {
  id: 'h-cx-courdemanges-1988-oct01-dpu01',
  titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
  typeId: 'dpu',
  statutId: 'acc',
  ordre: 2,
  date: '1988-03-11',
  points: []
} as unknown as TitresEtapes

const titresEtapesPointsCommuneInexistante = {
  id: 'h-cx-courdemanges-1988-oct01-dpu01',
  titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
  typeId: 'dpu',
  statutId: 'acc',
  ordre: 2,
  date: '1988-03-11',
  points: [],
  communes: [commune1]
} as unknown as TitresEtapes

const titresEtapesPointsCommuneExistante = {
  id: 'h-cx-courdemanges-1988-oct01-dpu01',
  titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
  typeId: 'dpu',
  statutId: 'acc',
  ordre: 2,
  date: '1988-03-11',
  points: [1, 2],
  communes: [commune1],
  forets: [foret1]
} as unknown as TitresEtapes

export {
  commune1,
  foret1,
  commune1SurfaceChangee,
  foret1SurfaceChangee,
  commune2,
  titresEtapesSansPoints,
  titresEtapesPoints,
  titresEtapesPointsMemeCommune,
  titresEtapesPointsVides,
  titresEtapesPointsCommuneInexistante,
  titresEtapesPointsCommuneExistante
}
