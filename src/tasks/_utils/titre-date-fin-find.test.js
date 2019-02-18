import titreDateFinFind from './titre-date-fin-find'
import {
  titreDemarchesProAccOctAcc,
  titreDemarchesProTerOctAcc,
  titreDemarchesProRejOctAcc,
  titreDemarchesProRejOctRej
} from './__mocks__/titre-date-fin-find-demarches'

test("la date de fin de validité d'un titre est celle de la dernière démarche dont le statut est acceptée", () => {
  expect(titreDateFinFind(titreDemarchesProAccOctAcc)).toMatch(/2038-03-12/)
})

test("la date de fin de validité d'un titre est celle de la dernière démarche dont le statut est terminée", () => {
  expect(titreDateFinFind(titreDemarchesProTerOctAcc)).toMatch(/2038-03-12/)
})

test("les démarches dont le statut n'est pas acceptée ou terminée sont ignorées", () => {
  expect(titreDateFinFind(titreDemarchesProRejOctAcc)).toMatch(/2013-03-12/)
})

test("un titre dont aucune démarche n'est acceptée ou terminée n'a pas de date de fin de validité", () => {
  expect(titreDateFinFind(titreDemarchesProRejOctRej)).toBeFalsy()
})
