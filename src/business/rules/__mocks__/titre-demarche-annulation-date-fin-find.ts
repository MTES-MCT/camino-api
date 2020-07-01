import { ITitreEtape } from '../../../types'

const titreDemarcheAnnulationEtapes = ([
  {
    id: 'h-cx-courdemanges-1988-ret01-dex01',
    titreDemarcheId: 'h-cx-courdemanges-1988-ret01',
    typeId: 'dex',
    statutId: 'acc',
    ordre: 1,
    date: '2013-05-21'
  }
] as unknown) as ITitreEtape[]

const titreDemarcheAnnulationEtapesDateFin = ([
  {
    id: 'h-cx-courdemanges-1988-ret01-dex01',
    titreDemarcheId: 'h-cx-courdemanges-1988-ret01',
    typeId: 'dex',
    statutId: 'acc',
    ordre: 1,
    date: '2013-05-21',
    dateFin: '2013-05-25'
  }
] as unknown) as ITitreEtape[]

const titreDemarcheAnnulationEtapesSansDate = ([
  {
    id: 'h-cx-courdemanges-1988-ret01-dex01',
    titreDemarcheId: 'h-cx-courdemanges-1988-ret01',
    typeId: 'dex',
    statutId: 'acc',
    ordre: 1
  }
] as unknown) as ITitreEtape[]

export {
  titreDemarcheAnnulationEtapes,
  titreDemarcheAnnulationEtapesDateFin,
  titreDemarcheAnnulationEtapesSansDate
}
