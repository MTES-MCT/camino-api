import titresAdministrationCentralesUpdate from './titres-administrations-centrales-update'

import * as titre from '../../database/queries/titres'

import {
  administrations,
  titresAdministrationCentraleInexistante,
  titresAdministrationCentraleExistante,
  titresArm,
  titresAxm
} from './__mocks__/titres-administrations-centrales-update-titres'

jest.mock('../../database/queries/titres', () => ({
  titresAdministrationsCentralesCreate: jest.fn().mockImplementation(a => a),
  titreAdministrationCentraleDelete: jest.fn().mockImplementation(a => a)
}))

console.log = jest.fn()

describe("administrations d'une étape", () => {
  test("n'ajoute pas d'administration centrale si elle existe déjà dans l'étape", async () => {
    const [
      titresAdministrationCentralesCreated,
      titresAdministrationCentralesDeleted
    ] = await titresAdministrationCentralesUpdate(
      titresAdministrationCentraleExistante,
      administrations
    )

    expect(titresAdministrationCentralesCreated.length).toEqual(0)
    expect(titresAdministrationCentralesDeleted.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })

  test("supprime une administration centrale si l'étape ne la contient plus dans ses communes", async () => {
    const [
      titresAdministrationCentralesCreated,
      titresAdministrationCentralesDeleted
    ] = await titresAdministrationCentralesUpdate(
      titresAdministrationCentraleInexistante,
      [{ id: 0 }]
    )

    expect(titresAdministrationCentralesCreated.length).toEqual(0)
    expect(titresAdministrationCentralesDeleted.length).toEqual(1)
    expect(console.log).toHaveBeenCalled()
  })

  test("ajoute l'ONF comme gestionnaire à un titre de type ARM", async () => {
    const [
      titresAdministrationCentralesCreated,
      titresAdministrationCentralesDeleted
    ] = await titresAdministrationCentralesUpdate(titresArm, administrations)

    expect(titresAdministrationCentralesCreated.length).toEqual(2)
    expect(titresAdministrationCentralesDeleted.length).toEqual(0)

    expect(titre.titresAdministrationsCentralesCreate).toHaveBeenCalled()
    expect(titre.titreAdministrationCentraleDelete).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test("n'ajoute pas l'ONF comme gestionnaire à un titre de type AXM", async () => {
    const [
      titresAdministrationCentralesCreated,
      titresAdministrationCentralesDeleted
    ] = await titresAdministrationCentralesUpdate(titresAxm, administrations)

    expect(
      titresAdministrationCentralesCreated.find(
        a => a.administrationId === 'onf'
      )
    ).toBeFalsy()
    expect(titresAdministrationCentralesDeleted.length).toEqual(0)

    expect(titre.titresAdministrationsCentralesCreate).toHaveBeenCalled()
    expect(titre.titreAdministrationCentraleDelete).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })
})
