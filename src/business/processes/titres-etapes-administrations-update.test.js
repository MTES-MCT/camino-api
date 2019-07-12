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
  titreEtapeAdministrationsInsert: () => [],
  titreEtapeAdministrationsDelete: () => []
}))

console.log = jest.fn()

describe("met à jour la liste d'administrations d'une étape", () => {
  test('ajoute 4 administrations dans une étape', async () => {
    const insertSpy = jest
      .spyOn(titreEtapes, 'titreEtapeAdministrationsInsert')
      .mockImplementation(
        titreEtape =>
          titreEtape.communes &&
          titreEtape.communes.map(p => Promise.resolve(p))
      )

    expect(
      await titresEtapeAdministrationsUpdate(titresCommunes, administrations)
    ).toEqual('Mise à jour: 4 administrations dans des étapes.')

    expect(insertSpy).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledTimes(4)

    insertSpy.mockRestore()
  })

  test("n'ajoute pas deux fois une administration en doublon ", async () => {
    const insertSpy = jest
      .spyOn(titreEtapes, 'titreEtapeAdministrationsInsert')
      .mockImplementation(titreEtape => [Promise.resolve()])
    const deleteSpy = jest
      .spyOn(titreEtapes, 'titreEtapeAdministrationsDelete')
      .mockImplementation(titreEtape => [])

    expect(
      await titresEtapeAdministrationsUpdate(
        titresCommunesMemeCommune,
        administrations
      )
    ).toEqual('Mise à jour: 1 administrations dans des étapes.')

    expect(insertSpy).toHaveBeenCalledTimes(1)
    expect(deleteSpy).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledTimes(1)

    insertSpy.mockRestore()
    deleteSpy.mockRestore()
  })

  test("ne met pas à jour les administrations d'une étape qui n'a pas de commune", async () => {
    expect(
      await titresEtapeAdministrationsUpdate(
        titresCommunesVides,
        administrations
      )
    ).toEqual('Mise à jour: 0 administrations dans des étapes.')

    expect(console.log).not.toHaveBeenCalled()
  })

  test("ajoute uniquement l'ONF comme administration centrale à un titre de type ARM", async () => {
    jest
      .spyOn(titreEtapes, 'titreEtapeAdministrationsInsert')
      .mockImplementation((_, adminsIds) =>
        adminsIds.map(p => Promise.resolve(p))
      )

    expect(
      await titresEtapeAdministrationsUpdate(titresArm, administrations)
    ).toEqual('Mise à jour: 1 administrations dans des étapes.')

    expect(console.log).toHaveBeenCalledTimes(1)
  })

  test("n'ajoute aucune administration centrale à un titre de type AXM", async () => {
    expect(
      await titresEtapeAdministrationsUpdate(
        titresCommunesVides,
        administrations
      )
    ).toEqual('Mise à jour: 0 administrations dans des étapes.')

    expect(console.log).not.toHaveBeenCalled()
  })
})
