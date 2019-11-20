import titresAdministrationGestionnairesUpdate from './titres-administrations-gestionnaires-update'

import * as titreQueries from '../../database/queries/titres'
import * as titreAdministrationsGestionnairesBuild from '../rules/titre-administrations-gestionnaires-build'

import {
  administrations,
  titresAdministrationGestionnaireInexistante,
  titresAdministrationGestionnaireExistante,
  titresAdministrationGestionnaireVide
} from './__mocks__/titres-administrations-gestionnaires-update-titres'

jest.mock('../../database/queries/titres', () => ({
  titresAdministrationsGestionnairesCreate: jest.fn().mockImplementation(a => a),
  titreAdministrationGestionnaireDelete: jest.fn()
}))

jest.mock('../rules/titre-administrations-gestionnaires-build', () => ({
  default: jest.fn()
}))

console.log = jest.fn()

describe("administrations d'une étape", () => {
  test("ajoute les administrations gestionnaires si elles n'existent pas dans l'étape", async () => {
    titreAdministrationsGestionnairesBuild.default.mockImplementation(() => [
      { administrationId: 'ptmg' },
      { administrationId: 'dgaln' }
    ])

    const [
      titresAdministrationGestionnairesCreated,
      titresAdministrationGestionnairesDeleted
    ] = await titresAdministrationGestionnairesUpdate(
      titresAdministrationGestionnaireVide,
      administrations
    )

    expect(titresAdministrationGestionnairesCreated.length).toEqual(2)
    expect(titresAdministrationGestionnairesDeleted.length).toEqual(0)

    expect(titreQueries.titresAdministrationsGestionnairesCreate).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test("n'ajoute pas d'administration gestionnaire si elle existe déjà dans l'étape", async () => {
    titreAdministrationsGestionnairesBuild.default.mockImplementation(() => [
      { administrationId: 'dgec' }
    ])

    const [
      titresAdministrationGestionnairesCreated,
      titresAdministrationGestionnairesDeleted
    ] = await titresAdministrationGestionnairesUpdate(
      titresAdministrationGestionnaireExistante,
      administrations
    )

    expect(titresAdministrationGestionnairesCreated.length).toEqual(0)
    expect(titresAdministrationGestionnairesDeleted.length).toEqual(0)

    expect(console.log).not.toHaveBeenCalled()
  })

  test("supprime une administration gestionnaire si l'étape ne la contient plus dans ses communes", async () => {
    titreAdministrationsGestionnairesBuild.default.mockImplementation(() => [])

    const [
      titresAdministrationGestionnairesCreated,
      titresAdministrationGestionnairesDeleted
    ] = await titresAdministrationGestionnairesUpdate(
      titresAdministrationGestionnaireInexistante,
      administrations
    )

    expect(titresAdministrationGestionnairesCreated.length).toEqual(0)
    expect(titresAdministrationGestionnairesDeleted.length).toEqual(1)

    expect(titreQueries.titreAdministrationGestionnaireDelete).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })
})
