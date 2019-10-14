import titreDateFinFind from './titre-date-fin-find'
import {
  titreDemarchesProAccOctAcc,
  titreDemarchesProTerOctAcc,
  titreDemarchesProRejOctAcc,
  titreDemarchesProRejOctRej
} from './__mocks__/titre-date-fin-find-demarches'

describe("cherche la date de fin d'une démarche", () => {
  test("la date de fin de validité d'un titre est celle de la dernière démarche dont le statut est acceptée", () => {
    expect(titreDateFinFind(titreDemarchesProAccOctAcc)).toBe('2038-03-11')
  })

  test("la date de fin de validité d'un titre est celle de la dernière démarche dont le statut est terminée", () => {
    expect(titreDateFinFind(titreDemarchesProTerOctAcc)).toBe('2038-03-11')
  })

  test("les démarches dont le statut n'est pas acceptée ou terminée sont ignorées", () => {
    expect(titreDateFinFind(titreDemarchesProRejOctAcc)).toBe('2013-03-11')
  })

  test("un titre dont aucune démarche n'est acceptée ou terminée n'a pas de date de fin de validité", () => {
    expect(titreDateFinFind(titreDemarchesProRejOctRej)).toBeFalsy()
  })
})
