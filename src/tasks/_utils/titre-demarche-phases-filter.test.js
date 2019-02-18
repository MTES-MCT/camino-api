import titreDemarchePhasesFilter from './titre-demarche-phases-filter'
import {
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

test("une démarche d'octroi dont l'étape de dex est acceptée pour un titre AXM ne donne pas lieu à une phase", () => {
  expect(
    titreDemarchePhasesFilter(titreAxmDemarcheOctDexRej, 'axm')
  ).toBeFalsy()
})

test("une démarche d'octroi dont l'étape de rpu est acceptée pour un titre PRX donne lieu à une phase", () => {
  expect(
    titreDemarchePhasesFilter(titrePrxDemarcheOctRpuAcc, 'prx')
  ).toBeTruthy()
})

test("une démarche d'octroi dont l'étape de rpu est acceptée pour un titre PRX ne donne pas lieu à une phase", () => {
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
