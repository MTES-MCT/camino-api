import titreDateDebutFind from './titre-date-debut-find'

import {
  titreDemarches,
  titreDemarchesDateDebut,
  titreDemarchesSansDateDebut
} from './__mocks__/titre-date-debut-find-demarches'

describe("cherche la date de début d'une démarche", () => {
  test("la date de début de validité d'un titre est celle de la première démarche d'octroi dont le statut est acceptée", () => {
    expect(titreDateDebutFind(titreDemarches, 'axm')).toMatch(/1988-03-12/)
  })

  test("la date de début de validité d'un titre est celle de la date de début de la première étape de dpu la première démarche d'octroi dont le statut est acceptée", () => {
    expect(titreDateDebutFind(titreDemarchesDateDebut, 'axm')).toMatch(
      /1988-03-16/
    )
  })

  test("la date de début de validité d'un titre est null si la démarche d'octroi ne contient pas d'étape qui remplit les conditions", () => {
    expect(titreDateDebutFind(titreDemarchesSansDateDebut, 'ddd')).toBeFalsy()
  })
})
