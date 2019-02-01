import titreDateFinFind from './titre-date-fin-find'
import titreDemarches from './__mocks__/titre-demarches'

test("la date de fin de validité d'un titre", () => {
  expect(titreDateFinFind(titreDemarches)).toMatch(/2013-03-12/)
})
