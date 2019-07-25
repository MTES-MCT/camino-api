import titresEtapeAdministrationsUpdate from './titres-etapes-administrations-update'

import * as titreEtapes from '../../database/queries/titres-etapes'

import {
  administrations,
  titresEtapesCommunes,
  titresEtapesCommunesVides,
  titresEtapesCommunesMemeCommune,
  titresEtapesAdministrationInexistante,
  titresEtapesAdministrationExistante,
  titresArm
} from './__mocks__/titres-etapes-administrations-update-etapes'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/titres-etapes', () => ({
  titresEtapesAdministrationsCreate: jest.fn().mockResolvedValue(),
  titreEtapeAdministrationDelete: jest.fn().mockResolvedValue()
}))

console.log = jest.fn()

describe("administrations d'une étape", () => {
  test('ajoute 2 administrations dans une étape', async () => {
    const log = await titresEtapeAdministrationsUpdate(
      titresEtapesCommunes,
      administrations
    )

    expect(log).toEqual([
      'mise à jour: 2 administration(s) ajoutée(s) dans des étapes',
      'mise à jour: 0 administration(s) supprimée(s) dans des étapes'
    ])

    expect(console.log).toHaveBeenCalledTimes(1)
  })

  test("n'ajoute pas deux fois une administration en doublon ", async () => {
    const log = await titresEtapeAdministrationsUpdate(
      titresEtapesCommunesMemeCommune,
      administrations
    )

    expect(log).toEqual([
      'mise à jour: 1 administration(s) ajoutée(s) dans des étapes',
      'mise à jour: 0 administration(s) supprimée(s) dans des étapes'
    ])

    expect(titreEtapes.titresEtapesAdministrationsCreate).toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationDelete).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test("ne met pas à jour les administrations d'une étape qui n'a pas de commune", async () => {
    const log = await titresEtapeAdministrationsUpdate(
      titresEtapesCommunesVides,
      administrations
    )

    expect(log).toEqual([
      'mise à jour: 0 administration(s) ajoutée(s) dans des étapes',
      'mise à jour: 0 administration(s) supprimée(s) dans des étapes'
    ])

    expect(titreEtapes.titresEtapesAdministrationsCreate).not.toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationDelete).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })

  test("n'ajoute pas d'administration si elle existe déjà dans l'étape", async () => {
    const log = await titresEtapeAdministrationsUpdate(
      titresEtapesAdministrationExistante,
      administrations
    )

    expect(log).toEqual([
      'mise à jour: 0 administration(s) ajoutée(s) dans des étapes',
      'mise à jour: 0 administration(s) supprimée(s) dans des étapes'
    ])
    expect(console.log).not.toHaveBeenCalled()
  })

  test("supprime une administration si l'étape ne la contient plus dans ses communes", async () => {
    const log = await titresEtapeAdministrationsUpdate(
      titresEtapesAdministrationInexistante,
      [{ id: 0 }]
    )

    expect(log).toEqual([
      'mise à jour: 0 administration(s) ajoutée(s) dans des étapes',
      'mise à jour: 1 administration(s) supprimée(s) dans des étapes'
    ])
    expect(console.log).toHaveBeenCalled()
  })

  test("ajoute uniquement l'ONF comme administration centrale à un titre de type ARM", async () => {
    const log = await titresEtapeAdministrationsUpdate(
      titresArm,
      administrations
    )

    expect(log).toEqual([
      'mise à jour: 1 administration(s) ajoutée(s) dans des étapes',
      'mise à jour: 0 administration(s) supprimée(s) dans des étapes'
    ])

    expect(titreEtapes.titresEtapesAdministrationsCreate).toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationDelete).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test("n'ajoute aucune administration centrale à un titre de type AXM", async () => {
    const log = await titresEtapeAdministrationsUpdate(
      titresEtapesCommunesVides,
      administrations
    )

    expect(log).toEqual([
      'mise à jour: 0 administration(s) ajoutée(s) dans des étapes',
      'mise à jour: 0 administration(s) supprimée(s) dans des étapes'
    ])

    expect(titreEtapes.titresEtapesAdministrationsCreate).not.toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationDelete).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})
