import titresAdministrationCentralesUpdate from './titres-administrations-centrales-update'

import * as titreQueries from '../../database/queries/titres'
import * as titreAdministrationsCentralesBuild from '../rules/titre-administrations-centrales-build'

import {
  administrations,
  titresAdministrationCentraleInexistante,
  titresAdministrationCentraleExistante,
  titresAdministrationCentraleVide
} from './__mocks__/titres-administrations-centrales-update-titres'

jest.mock('../../database/queries/titres', () => ({
  titresAdministrationsCentralesCreate: jest.fn().mockImplementation(a => a),
  titreAdministrationCentraleDelete: jest.fn()
}))

jest.mock('../rules/titre-administrations-centrales-build', () => ({
  default: jest.fn()
}))

console.log = jest.fn()

describe("administrations d'une étape", () => {
  test("ajoute les administrations centrales si elles n'existent pas dans l'étape", async () => {
    titreAdministrationsCentralesBuild.default.mockImplementation(() => [
      { administrationId: 'ptmg' },
      { administrationId: 'dgaln' }
    ])

    const [
      titresAdministrationCentralesCreated,
      titresAdministrationCentralesDeleted
    ] = await titresAdministrationCentralesUpdate(
      titresAdministrationCentraleVide,
      administrations
    )

    expect(titresAdministrationCentralesCreated.length).toEqual(2)
    expect(titresAdministrationCentralesDeleted.length).toEqual(0)

    expect(titreQueries.titresAdministrationsCentralesCreate).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test("n'ajoute pas d'administration centrale si elle existe déjà dans l'étape", async () => {
    titreAdministrationsCentralesBuild.default.mockImplementation(() => [
      { administrationId: 'dgec' }
    ])

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
    titreAdministrationsCentralesBuild.default.mockImplementation(() => [])

    const [
      titresAdministrationCentralesCreated,
      titresAdministrationCentralesDeleted
    ] = await titresAdministrationCentralesUpdate(
      titresAdministrationCentraleInexistante,
      administrations
    )

    expect(titresAdministrationCentralesCreated.length).toEqual(0)
    expect(titresAdministrationCentralesDeleted.length).toEqual(1)

    expect(titreQueries.titreAdministrationCentraleDelete).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })
})
