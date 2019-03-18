import titresEtapesOrdreUpdate from './titres-etapes-ordre-update'

import {
  titresDemarchesEtapes,
  titresDemarchesEtapesVides
} from './__mocks__/titres-etapes-ordre-update-demarches'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../queries/titre-etapes', () => ({
  titreEtapesOrdreUpdate: etapes => etapes.map(e => Promise.resolve(e))
}))

describe("met à jour l'ordre des étapes d'une démarche", () => {
  test("l'ordre de deux étapes d'une démarche est mis à jour", async () => {
    expect(await titresEtapesOrdreUpdate(titresDemarchesEtapes, [])).toEqual(
      "Mise à jour: 2 ordres d'étapes."
    )
  })

  test("la démarche ne contient pas d'étape et n'est pas mise à jour", async () => {
    expect(
      await titresEtapesOrdreUpdate(titresDemarchesEtapesVides, [])
    ).toEqual("Mise à jour: 0 ordres d'étapes.")
  })
})
