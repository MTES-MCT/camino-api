import { ITitreDemarche } from '../../../types'

const titreDemarcheOctEtapeMen = [
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'men',
        statutId: 'dep',
        ordre: 1,
        date: '1988-03-11'
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarcheOctSansEtapes = [
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: []
  }
] as ITitreDemarche[]

const titreDemarcheOctSansEtapeMen = [
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-11'
      }
    ]
  }
] as ITitreDemarche[]

export {
  titreDemarcheOctEtapeMen,
  titreDemarcheOctSansEtapes,
  titreDemarcheOctSansEtapeMen
}
