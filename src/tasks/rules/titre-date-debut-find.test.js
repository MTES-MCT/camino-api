import titreDateDebutFind from './titre-date-debut-find'

import {
  titreDemarchesDpu,
  titreDemarchesDex,
  titreDemarchesRpu,
  titreDemarchesRpuDateDebut,
  titreDemarchesDexDateDebut,
  titreDemarchesSansOctroi,
  titreDemarchesSansDateDebut
} from './__mocks__/titre-date-debut-find-demarches'

describe("cherche la date de début d'une démarche", () => {
  test("la date de début de validité d'un titre est celle de la première démarche d'octroi dont le statut est acceptée", () => {
    expect(titreDateDebutFind(titreDemarchesDpu, 'axm')).toMatch(/1988-03-12/)
  })

  test("la date de début de validité d'un titre est celle de la première démarche d'octroi dont le statut est acceptée", () => {
    expect(titreDateDebutFind(titreDemarchesDex, 'axm')).toMatch(/1988-03-12/)
  })

  test("la date de début de validité d'un titre est celle de la première démarche d'octroi dont le statut est acceptée", () => {
    expect(titreDateDebutFind(titreDemarchesRpu, 'prx')).toMatch(/1988-03-12/)
  })

  test("la date de début de validité d'un titre est celle de la date de début de la première étape de rpu de la première démarche d'octroi dont le statut est acceptée", () => {
    expect(titreDateDebutFind(titreDemarchesRpuDateDebut, 'prx')).toMatch(
      /1988-03-16/
    )
  })

  test("la date de début de validité d'un titre est celle de la date de début de la première étape de dpu de la première démarche d'octroi dont le statut est acceptée", () => {
    expect(titreDateDebutFind(titreDemarchesDexDateDebut, 'axm')).toMatch(
      /1988-03-16/
    )
  })

  test("la date de début de validité d'un titre est null si il n'y a pas de démarche d'octroi", () => {
    expect(titreDateDebutFind(titreDemarchesSansOctroi, 'ddd')).toBeNull()
  })

  test("la date de début de validité d'un titre est null si la démarche d'octroi ne contient pas d'étape qui remplit les conditions", () => {
    expect(titreDateDebutFind(titreDemarchesSansDateDebut, 'ddd')).toBeNull()
  })
})
