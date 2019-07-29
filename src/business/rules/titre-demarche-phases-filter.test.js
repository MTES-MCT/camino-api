import titreDemarchePhasesFilter from './titre-demarche-phases-filter'
import {
  titreDemarcheMut,
  titreDemarcheOctRej,
  titreDemarcheOctDpuInexistante,
  titreDemarcheOctDpuAcc,
  titreDemarcheOctDpuRej,
  titreAxmDemarcheOctDexAcc,
  titreAxmDemarcheOctDexRej,
  titrePrxDemarcheOctRpuAcc,
  titrePrxDemarcheOctRpuRej,
  titreDemarcheProDpuAcc,
  titreDemarchePro1DpuAcc,
  titreDemarchePro2DpuAcc,
  titreDemarchePreDpuAcc
} from './__mocks__/titre-demarche-phases-filter-demarches'

describe('retourne si la démarche donne lieu à une étape ou non', () => {
  test('une démarche de mutation ne donne pas lieu à une phase', () => {
    expect(titreDemarchePhasesFilter(titreDemarcheMut)).toBeFalsy()
  })

  test("une démarche d'octroi dont le statut n'est pas accepté ne donne pas lieu à une phase", () => {
    expect(titreDemarchePhasesFilter(titreDemarcheOctRej)).toBeFalsy()
  })

  test("une démarche d'octroi qui n'a pas d'étape de dpu ne donne pas lieu à une phase", () => {
    expect(
      titreDemarchePhasesFilter(titreDemarcheOctDpuInexistante)
    ).toBeFalsy()
  })

  test("une démarche d'octroi dont l'étape de dpu est acceptée donne lieu à une phase", () => {
    expect(titreDemarchePhasesFilter(titreDemarcheOctDpuAcc)).toBeTruthy()
  })

  test("une démarche d'octroi dont l'étape de dpu n'est pas acceptée ne donne pas lieu à une phase", () => {
    expect(titreDemarchePhasesFilter(titreDemarcheOctDpuRej)).toBeFalsy()
  })

  test("une démarche d'octroi dont l'étape de dex est acceptée pour un titre AXM donne lieu à une phase", () => {
    expect(
      titreDemarchePhasesFilter(titreAxmDemarcheOctDexAcc, 'axm')
    ).toBeTruthy()
  })

  test("une démarche d'octroi dont l'étape de dex n'est pas acceptée pour un titre AXM ne donne pas lieu à une phase", () => {
    expect(
      titreDemarchePhasesFilter(titreAxmDemarcheOctDexRej, 'axm')
    ).toBeFalsy()
  })

  test("une démarche d'octroi dont l'étape de rpu est acceptée pour un titre PRX donne lieu à une phase", () => {
    expect(
      titreDemarchePhasesFilter(titrePrxDemarcheOctRpuAcc, 'prx')
    ).toBeTruthy()
  })

  test("une démarche d'octroi dont l'étape de rpu n'est pas acceptée pour un titre PRX ne donne pas lieu à une phase", () => {
    expect(
      titreDemarchePhasesFilter(titrePrxDemarcheOctRpuRej, 'prx')
    ).toBeFalsy()
  })

  test("une démarche de prolongation dont l'étape de dpu est acceptée donne lieu à une phase", () => {
    expect(titreDemarchePhasesFilter(titreDemarcheProDpuAcc)).toBeTruthy()
  })

  test("une démarche de première prolongation dont l'étape de dpu est acceptée donne lieu à une phase", () => {
    expect(titreDemarchePhasesFilter(titreDemarchePro1DpuAcc)).toBeTruthy()
  })

  test("une démarche de deuxième prolongation dont l'étape de dpu est acceptée donne lieu à une phase", () => {
    expect(titreDemarchePhasesFilter(titreDemarchePro2DpuAcc)).toBeTruthy()
  })

  test("une démarche de prolongation exceptionnelle dont l'étape de dpu est acceptée donne lieu à une phase", () => {
    expect(titreDemarchePhasesFilter(titreDemarchePreDpuAcc)).toBeTruthy()
  })
})
