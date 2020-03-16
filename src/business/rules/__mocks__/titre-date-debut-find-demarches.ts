import { ITitreDemarche } from '../../../types'

const titreDemarchesDpu = ([
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
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-11'
      }
    ]
  }
] as unknown) as ITitreDemarche[]

const titreDemarchesRpu = ([
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
        typeId: 'rpu',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-11'
      }
    ]
  }
] as unknown) as ITitreDemarche[]

const titreDemarchesDex = ([
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
] as unknown) as ITitreDemarche[]

const titreDemarchesRpuDateDebut = ([
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'rpu',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-11',
        dateDebut: '1988-03-15'
      }
    ]
  }
] as unknown) as ITitreDemarche[]

const titreDemarchesDexDateDebut = ([
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-11',
        dateDebut: '1988-03-15'
      }
    ]
  }
] as unknown) as ITitreDemarche[]

const titreDemarchesSansOctroi = ([
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'mut',
    statutId: 'acc',
    ordre: 1
  }
] as unknown) as ITitreDemarche[]

const titreDemarchesSansDateDebut = ([
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-rpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06'
      }
    ]
  }
] as unknown) as ITitreDemarche[]

const titreDemarchesDateUndefined = ([
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
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 1
      }
    ]
  }
] as unknown) as ITitreDemarche[]

export {
  titreDemarchesDpu,
  titreDemarchesDex,
  titreDemarchesRpu,
  titreDemarchesRpuDateDebut,
  titreDemarchesDexDateDebut,
  titreDemarchesSansOctroi,
  titreDemarchesSansDateDebut,
  titreDemarchesDateUndefined
}
