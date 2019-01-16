const titreDateFinFind = require('./titre-date-fin-find')
const titreDemarches = require('./__mocks__/titre-demarches')

test("la date de fin de validité d'un titre", () => {
  expect(titreDateFinFind(titreDemarches)).toMatch(/2013-03-12/)
})
