import { ITitreEtape } from '../../../types'

const titreEtapesSortedAsc = [
  {
    id: 'h-cx-courdemanges-1988-oct01-dex01',
    typeId: 'dex',
    statutId: 'acc',
    ordre: 1,
    date: '1988-03-06'
  },
  {
    id: 'h-cx-courdemanges-1988-oct01-dpu01',
    typeId: 'dpu',
    statutId: 'acc',
    ordre: 2,
    date: '1988-03-11'
  }
] as ITitreEtape[]

const titreEtapesSortedDesc = [
  {
    id: 'h-cx-courdemanges-1988-oct01-dpu01',
    typeId: 'dpu',
    statutId: 'acc',
    ordre: 2,
    date: '1988-03-11'
  },
  {
    id: 'h-cx-courdemanges-1988-oct01-dex01',
    typeId: 'dex',
    statutId: 'acc',
    ordre: 1,
    date: '1988-03-06'
  }
] as ITitreEtape[]

const titreEtapesSortedAscResult = [
  {
    id: 'h-cx-courdemanges-1988-oct01-dex01',
    typeId: 'dex',
    statutId: 'acc',
    ordre: 1,
    date: '1988-03-06'
  },
  {
    id: 'h-cx-courdemanges-1988-oct01-dpu01',
    typeId: 'dpu',
    statutId: 'acc',
    ordre: 2,
    date: '1988-03-11'
  }
] as ITitreEtape[]

export {
  titreEtapesSortedAsc,
  titreEtapesSortedDesc,
  titreEtapesSortedAscResult
}
