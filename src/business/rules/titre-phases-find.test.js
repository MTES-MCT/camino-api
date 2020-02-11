import titrePhasesFind from './titre-phases-find'
import {
  titreDemarcheOctDpuAcc,
  titreDemarcheOctDpuInexistante,
  titreAxmDemarcheOctDexAcc,
  titrePrxDemarcheOctRpuAcc,
  titreDemarcheOctDpuDateDebut,
  titreDemarchesOctProlongation,
  titreDemarchesOctAnnulation
} from './__mocks__/titre-phases-find-demarches'

describe("phases d'une démarche", () => {
  test("un titre qui a une démarche d'octroi avec une dpu a une phase", () => {
    expect(titrePhasesFind([titreDemarcheOctDpuAcc])).toEqual([
      {
        dateDebut: '2200-01-01',
        dateFin: '2202-01-01',
        statutId: 'val',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01'
      }
    ])
  })

  test("un titre qui a une démarche d'octroi sans dpu n'a pas de phase", () => {
    expect(titrePhasesFind([titreDemarcheOctDpuInexistante])).toEqual([])
  })

  test("un titre AXM qui a une démarche d'octroi avec une dex a une phase", () => {
    expect(titrePhasesFind([titreAxmDemarcheOctDexAcc], 'axm')).toEqual([
      {
        dateDebut: '2200-01-01',
        dateFin: '2202-01-01',
        statutId: 'val',
        titreDemarcheId: 'h-ax-courdemanges-1988-oct01'
      }
    ])
  })

  test("un titre PRX qui a une démarche d'octroi avec une rpu a une phase", () => {
    expect(titrePhasesFind([titrePrxDemarcheOctRpuAcc], 'prx')).toEqual([
      {
        dateDebut: '2200-01-01',
        dateFin: '2200-01-02',
        statutId: 'val',
        titreDemarcheId: 'h-pr-courdemanges-1988-oct01'
      }
    ])
  })

  test("un titre qui a une démarche d'octroi avec une dpu dont la date de début est renseignée a une phase", () => {
    expect(titrePhasesFind([titreDemarcheOctDpuDateDebut])).toEqual([
      {
        dateDebut: '2200-01-02',
        dateFin: '2202-01-02',
        statutId: 'val',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01'
      }
    ])
  })

  test('un titre qui a une démarche de prolongation avec une dpu a une phase', () => {
    expect(titrePhasesFind(titreDemarchesOctProlongation)).toEqual([
      {
        dateDebut: '2200-01-01',
        dateFin: '2500-01-01',
        statutId: 'val',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01'
      },
      {
        dateDebut: '2500-01-01',
        dateFin: '3000-01-01',
        statutId: 'val',
        titreDemarcheId: 'h-cx-courdemanges-1988-pro01'
      }
    ])
  })

  test("la phase d'un titre concernée par une démarche d'annulation a une date de fin qui est celle de cette démarche d'annulation", () => {
    expect(titrePhasesFind(titreDemarchesOctAnnulation)).toEqual([
      {
        dateDebut: '2200-01-01',
        dateFin: '2019-01-02',
        statutId: 'ech',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01'
      }
    ])
  })
})
