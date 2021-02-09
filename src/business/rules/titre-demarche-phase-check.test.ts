import { ITitreEtape } from '../../types'
import { titreDemarchePhaseCheck } from './titre-demarche-phase-check'

describe('retourne si la démarche donne lieu à une étape ou non', () => {
  test('une démarche sans étape ne donne pas lieu à une phase', () => {
    expect(titreDemarchePhaseCheck('mut', 'acc', 'cxh', null)).toBeFalsy()
  })

  test('une démarche de mutation sans étape ne donne pas lieu à une phase', () => {
    expect(titreDemarchePhaseCheck('mut', 'acc', 'cxh', [])).toBeFalsy()
  })

  test("une démarche d'octroi dont le statut n'est pas accepté ne donne pas lieu à une phase", () => {
    expect(titreDemarchePhaseCheck('oct', 'rej', 'cxh', [])).toBeFalsy()
  })

  test("une démarche d'octroi qui n'a pas d'étape de dpu ne donne pas lieu à une phase", () => {
    expect(
      titreDemarchePhaseCheck('oct', 'acc', 'cxh', [
        {
          id: 'h-cx-courdemanges-1988-oct01-dex01',
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1
        }
      ] as ITitreEtape[])
    ).toBeFalsy()
  })

  test("une démarche de mutation dont l'étape de dpu contient une date de fin donne lieu à une phase", () => {
    expect(
      titreDemarchePhaseCheck('mut', 'acc', 'cxh', [
        {
          id: 'h-cx-courdemanges-1988-mut01-dpu01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 1,
          dateFin: '2018-12-31'
        }
      ] as ITitreEtape[])
    ).toBeTruthy()
  })

  test("une démarche de mutation dont l'étape de dpu contient une durée donne lieu à une phase", () => {
    expect(
      titreDemarchePhaseCheck('mut', 'acc', 'cxh', [
        {
          id: 'h-cx-courdemanges-1988-mut01-dpu01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 1,
          duree: 20
        }
      ] as ITitreEtape[])
    ).toBeTruthy()
  })

  test("une démarche d'octroi dont l'étape de dpu est acceptée donne lieu à une phase", () => {
    expect(
      titreDemarchePhaseCheck('oct', 'acc', 'cxh', [
        {
          id: 'h-cx-courdemanges-1988-oct01-dpu01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 2
        },
        {
          id: 'h-cx-courdemanges-1988-oct01-dex01',
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1
        }
      ] as ITitreEtape[])
    ).toBeTruthy()
  })

  test("une démarche d'octroi dont l'étape de dpu n'est pas acceptée ne donne pas lieu à une phase", () => {
    expect(
      titreDemarchePhaseCheck('oct', 'acc', 'cxh', [
        {
          id: 'h-cx-courdemanges-1988-oct01-dpu01',
          typeId: 'dpu',
          statutId: 'rej',
          ordre: 2
        },
        {
          id: 'h-cx-courdemanges-1988-oct01-dex01',
          typeId: 'dex',
          statutId: 'rej',
          ordre: 1
        }
      ] as ITitreEtape[])
    ).toBeFalsy()
  })

  test("une démarche d'octroi dont l'étape de dex est acceptée pour un titre AXM donne lieu à une phase", () => {
    expect(
      titreDemarchePhaseCheck('oct', 'acc', 'axm', [
        {
          id: 'm-ax-courdemanges-1988-oct01-dex01',
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1
        }
      ] as ITitreEtape[])
    ).toBeTruthy()
  })

  test("une démarche d'octroi dont l'étape de dex n'est pas acceptée pour un titre AXM ne donne pas lieu à une phase", () => {
    expect(
      titreDemarchePhaseCheck('oct', 'acc', 'axm', [
        {
          id: 'm-ax-courdemanges-1988-oct01-dex01',
          typeId: 'dex',
          statutId: 'rej',
          ordre: 1
        }
      ] as ITitreEtape[])
    ).toBeFalsy()
  })

  test("une démarche d'octroi dont l'étape de rpu est acceptée pour un titre PRM donne lieu à une phase", () => {
    expect(
      titreDemarchePhaseCheck('oct', 'acc', 'prm', [
        {
          id: 'm-pr-courdemanges-1988-oct01-rpu01',
          typeId: 'rpu',
          statutId: 'acc',
          ordre: 1
        }
      ] as ITitreEtape[])
    ).toBeTruthy()
  })

  test("une démarche d'octroi dont l'étape de rpu n'est pas acceptée pour un titre PRM ne donne pas lieu à une phase", () => {
    expect(
      titreDemarchePhaseCheck('oct', 'acc', 'prm', [
        {
          id: 'm-pr-courdemanges-1988-oct01-rpu01',
          typeId: 'rpu',
          statutId: 'rej',
          ordre: 1
        }
      ] as ITitreEtape[])
    ).toBeFalsy()
  })

  test("une démarche de prolongation dont l'étape de dpu est acceptée donne lieu à une phase", () => {
    expect(
      titreDemarchePhaseCheck('pro', 'acc', 'cxh', [
        {
          id: 'h-cx-courdemanges-1988-pro01-dpu01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 2
        },
        {
          id: 'h-cx-courdemanges-1988-pro01-dex01',
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1
        }
      ] as ITitreEtape[])
    ).toBeTruthy()
  })

  test("une démarche de première prolongation dont l'étape de dpu est acceptée donne lieu à une phase", () => {
    expect(
      titreDemarchePhaseCheck('pr1', 'acc', 'cxh', [
        {
          id: 'h-cx-courdemanges-1988-pr101-dpu01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 2
        },
        {
          id: 'h-cx-courdemanges-1988-pr101-dex01',
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1
        }
      ] as ITitreEtape[])
    ).toBeTruthy()
  })

  test("une démarche de deuxième prolongation dont l'étape de dpu est acceptée donne lieu à une phase", () => {
    expect(
      titreDemarchePhaseCheck('pr2', 'acc', 'cxh', [
        {
          id: 'h-cx-courdemanges-1988-pr201-dpu01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 2
        },
        {
          id: 'h-cx-courdemanges-1988-pr201-dex01',
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1
        }
      ] as ITitreEtape[])
    ).toBeTruthy()
  })

  test("une démarche de prolongation exceptionnelle dont l'étape de dpu est acceptée donne lieu à une phase", () => {
    expect(
      titreDemarchePhaseCheck('pre', 'acc', 'cxh', [
        {
          id: 'h-cx-courdemanges-1988-pre01-dpu01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 2
        },
        {
          id: 'h-cx-courdemanges-1988-pre01-dex01',
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1
        }
      ] as ITitreEtape[])
    ).toBeTruthy()
  })
})
