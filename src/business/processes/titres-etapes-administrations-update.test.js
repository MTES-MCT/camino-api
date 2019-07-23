import titresEtapeAdministrationsUpdate from './titres-etapes-administrations-update'

import * as titreEtapes from '../queries/titre-etapes'

import {
  administrations,
  titresCommunes,
  titresCommunesVides,
  titresCommunesMemeCommune,
  titresArm
} from './__mocks__/titres-etapes-administrations-update-etapes'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../queries/titre-etapes', () => ({
  titresEtapesAdministrationsCreate: jest.fn().mockResolvedValue(),
  titreEtapeAdministrationsDelete: jest.fn().mockResolvedValue()
}))

console.log = jest.fn()

describe("administrations d'une étape", () => {
  test('ajoute 2 administrations dans une étape', async () => {
    const log = await titresEtapeAdministrationsUpdate(
      titresCommunes,
      administrations
    )

    expect(log).toEqual([
      'Mise à jour: 2 administration(s) ajoutée(s) dans des étapes.',
      'Mise à jour: 0 administration(s) supprimée(s) dans des étapes.'
    ])

    expect(console.log).toHaveBeenCalledTimes(1)
  })

  test("n'ajoute pas deux fois une administration en doublon ", async () => {
    const log = await titresEtapeAdministrationsUpdate(
      titresCommunesMemeCommune,
      administrations
    )

    expect(log).toEqual([
      'Mise à jour: 1 administration(s) ajoutée(s) dans des étapes.',
      'Mise à jour: 0 administration(s) supprimée(s) dans des étapes.'
    ])

    expect(titreEtapes.titresEtapesAdministrationsCreate).toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationsDelete).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test("ne met pas à jour les administrations d'une étape qui n'a pas de commune", async () => {
    const log = await titresEtapeAdministrationsUpdate(
      titresCommunesVides,
      administrations
    )

    expect(log).toEqual([
      'Mise à jour: 0 administration(s) ajoutée(s) dans des étapes.',
      'Mise à jour: 0 administration(s) supprimée(s) dans des étapes.'
    ])

    expect(titreEtapes.titresEtapesAdministrationsCreate).not.toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationsDelete).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })

  test("ajoute uniquement l'ONF comme administration centrale à un titre de type ARM", async () => {
    const log = await titresEtapeAdministrationsUpdate(
      titresArm,
      administrations
    )

    expect(log).toEqual([
      'Mise à jour: 1 administration(s) ajoutée(s) dans des étapes.',
      'Mise à jour: 0 administration(s) supprimée(s) dans des étapes.'
    ])

    expect(titreEtapes.titresEtapesAdministrationsCreate).toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationsDelete).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test("n'ajoute aucune administration centrale à un titre de type AXM", async () => {
    const log = await titresEtapeAdministrationsUpdate(
      titresCommunesVides,
      administrations
    )

    expect(log).toEqual([
      'Mise à jour: 0 administration(s) ajoutée(s) dans des étapes.',
      'Mise à jour: 0 administration(s) supprimée(s) dans des étapes.'
    ])

    expect(titreEtapes.titresEtapesAdministrationsCreate).not.toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationsDelete).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})
