import { titrePhasesFind } from './titre-phases-find'
import {
  titreDemarcheOctDpuAcc,
  titreDemarcheOctDpuInexistante,
  titreAxmDemarcheOctDexAcc,
  titrePrmDemarcheOctRpuAcc,
  titreDemarcheOctDpuDateDebut,
  titreDemarchesOctProlongation,
  titreDemarchesOctAnnulation,
  titreDemarchesOctAnnulationSansPoints
} from './__mocks__/titre-phases-find-demarches'

describe("phases d'une démarche", () => {
  const aujourdhui = '2020-12-01'
  test("un titre qui a une démarche d'octroi avec une dpu a une phase", () => {
    expect(
      titrePhasesFind([titreDemarcheOctDpuAcc], aujourdhui, 'cxh')
    ).toEqual([
      {
        dateDebut: '2200-01-01',
        dateFin: '2202-01-01',
        statutId: 'val',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01'
      }
    ])
  })

  test("un titre qui a une démarche d'octroi sans dpu n'a pas de phase", () => {
    expect(
      titrePhasesFind([titreDemarcheOctDpuInexistante], aujourdhui, 'cxh')
    ).toEqual([])
  })

  test("un titre AXM qui a une démarche d'octroi avec une dex a une phase", () => {
    expect(
      titrePhasesFind([titreAxmDemarcheOctDexAcc], aujourdhui, 'axm')
    ).toEqual([
      {
        dateDebut: '2200-01-01',
        dateFin: '2202-01-01',
        statutId: 'val',
        titreDemarcheId: 'h-ax-courdemanges-1988-oct01'
      }
    ])
  })

  test("un titre PRM qui a une démarche d'octroi avec une rpu a une phase", () => {
    expect(
      titrePhasesFind([titrePrmDemarcheOctRpuAcc], aujourdhui, 'prm')
    ).toEqual([
      {
        dateDebut: '2200-01-01',
        dateFin: '2200-01-02',
        statutId: 'val',
        titreDemarcheId: 'm-pr-courdemanges-1988-oct01'
      }
    ])
  })

  test("un titre qui a une démarche d'octroi avec une dpu dont la date de début est renseignée a une phase", () => {
    expect(
      titrePhasesFind([titreDemarcheOctDpuDateDebut], aujourdhui, 'cxh')
    ).toEqual([
      {
        dateDebut: '2200-01-02',
        dateFin: '2202-01-02',
        statutId: 'val',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01'
      }
    ])
  })

  test('un titre qui a une démarche de prolongation avec une dpu a une phase', () => {
    expect(
      titrePhasesFind(titreDemarchesOctProlongation, aujourdhui, 'cxh')
    ).toEqual([
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
    expect(
      titrePhasesFind(titreDemarchesOctAnnulation, aujourdhui, 'cxh')
    ).toEqual([
      {
        dateDebut: '2000-01-02',
        dateFin: '2019-01-02',
        statutId: 'ech',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01'
      }
    ])
  })

  test("la phase d'un titre concernée par une démarche de renonciation partielle n'est pas affectée par la renonciation", () => {
    expect(
      titrePhasesFind(titreDemarchesOctAnnulationSansPoints, aujourdhui, 'cxh')
    ).toEqual([
      {
        dateDebut: '2000-01-02',
        dateFin: '2020-01-02',
        statutId: 'ech',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01'
      }
    ])
  })
})
