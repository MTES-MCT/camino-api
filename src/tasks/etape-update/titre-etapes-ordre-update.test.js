import titreEtapesOrdreUpdate from './titre-etapes-ordre-update'
import titreEtapes from '../titre-etapes'

import {
  titreDemarcheEtapes,
  titreDemarcheEtapesVides
} from './__mocks__/titre-etapes-ordre-update-demarches'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../titre-etapes', () => ({
  titreEtapesOrdreUpdate: etapes => etapes.map(e => Promise.resolve(e))
}))

console.log = jest.fn()

describe("met à jour l'ordre des étapes d'une démarche", () => {
  test("l'ordre de deux étapes d'une démarche est mis à jour", async () => {
    expect(await titreEtapesOrdreUpdate(titreDemarcheEtapes, [])).toEqual(
      "Mise à jour: 2 ordres d'étapes."
    )
  })

  test("la démarche ne contient pas d'étape et n'est pas mise à jour", async () => {
    expect(await titreEtapesOrdreUpdate(titreDemarcheEtapesVides, [])).toEqual(
      "Mise à jour: 0 ordres d'étapes."
    )
  })
})
