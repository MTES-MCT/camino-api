import titresEtapeAdministrationsUpdate from './titres-etapes-administrations-update'

import * as titreEtapes from '../queries/titre-etapes'

import {
  administrations,
  titresEtapesCommunes,
  titresEtapesCommunesVides,
  titresEtapesCommunesMemeCommune
} from './__mocks__/titres-etapes-administrations-update-etapes'

// `jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../queries/titre-etapes', () => ({
  titreEtapeAdministrationsInsert: () => [],
  titreEtapeAdministrationsDelete: () => []
}))

console.log = jest.fn()

describe('met à jour la liste de administrations pour une étape', () => {
  test('ajoute 2 administrations dans une étape', async () => {
    const insertSpy = jest
      .spyOn(titreEtapes, 'titreEtapeAdministrationsInsert')
      .mockImplementation(titreEtape =>
        titreEtape.communes.map(p => Promise.resolve(p))
      )

    expect(
      await titresEtapeAdministrationsUpdate(
        titresEtapesCommunes,
        administrations
      )
    ).toEqual('Mise à jour: 2 administrations dans des étapes.')

    expect(insertSpy).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledTimes(2)

    insertSpy.mockRestore()
  })

  test("une administration en doublon n'est pas ajoutée deux fois", async () => {
    const insertSpy = jest
      .spyOn(titreEtapes, 'titreEtapeAdministrationsInsert')
      .mockImplementation(titreEtape => [Promise.resolve()])
    const deleteSpy = jest
      .spyOn(titreEtapes, 'titreEtapeAdministrationsDelete')
      .mockImplementation(titreEtape => [])

    expect(
      await titresEtapeAdministrationsUpdate(
        titresEtapesCommunesMemeCommune,
        administrations
      )
    ).toEqual('Mise à jour: 1 administrations dans des étapes.')

    expect(insertSpy).toHaveBeenCalledTimes(1)
    expect(deleteSpy).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledTimes(1)

    insertSpy.mockRestore()
    deleteSpy.mockRestore()
  })

  test("l'étape n'a pas de commune", async () => {
    expect(
      await titresEtapeAdministrationsUpdate(
        titresEtapesCommunesVides,
        administrations
      )
    ).toEqual('Mise à jour: 0 administrations dans des étapes.')

    expect(console.log).not.toHaveBeenCalled()
  })
})
