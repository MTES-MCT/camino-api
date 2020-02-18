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

describe("date de début d'une démarche", () => {
  test("retourne la date de la première étape d'octroi d'une dpu dont le statut est acceptée", () => {
    expect(titreDateDebutFind(titreDemarchesDpu, 'axm')).toBe('1988-03-11')
  })

  test("retourne la date de la première étape d'octroi d'une dex dont le statut est acceptée", () => {
    expect(titreDateDebutFind(titreDemarchesDex, 'axm')).toBe('1988-03-11')
  })

  test("retourne la date de la première étape d'octroi d'une rpu dont le statut est acceptée", () => {
    expect(titreDateDebutFind(titreDemarchesRpu, 'prx')).toBe('1988-03-11')
  })

  test('retourne la date de début de la première étape de rpu dont le statut est acceptée', () => {
    expect(titreDateDebutFind(titreDemarchesRpuDateDebut, 'prx')).toBe(
      '1988-03-15'
    )
  })

  test("retourne la date de début de la première étape de dpu de la première démarche d'octroi dont le statut est acceptée", () => {
    expect(titreDateDebutFind(titreDemarchesDexDateDebut, 'axm')).toBe(
      '1988-03-15'
    )
  })

  test("retourne undefined si il n'y a pas de démarche d'octroi", () => {
    expect(titreDateDebutFind(titreDemarchesSansOctroi, 'ddd')).toBeUndefined()
  })

  test("retourne undefined si la démarche d'octroi ne contient pas d'étape qui remplit les conditions", () => {
    expect(
      titreDateDebutFind(titreDemarchesSansDateDebut, 'ddd')
    ).toBeUndefined()
  })
})
