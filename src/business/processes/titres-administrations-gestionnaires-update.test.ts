import { mocked } from 'ts-jest/utils'
import { ITitreAdministrationsGestionnaire } from '../../types'

import titresAdministrationGestionnairesUpdate from './titres-administrations-gestionnaires-update'

import {
  titresAdministrationsGestionnairesCreate,
  titreAdministrationGestionnaireDelete
} from '../../database/queries/titres'
import titreAdministrationsGestionnairesBuild from '../rules/titre-administrations-gestionnaires-build'

import {
  administrations,
  titresAdministrationGestionnaireInexistante,
  titresAdministrationGestionnaireExistante,
  titresAdministrationGestionnaireVide
} from './__mocks__/titres-administrations-gestionnaires-update-titres'

jest.mock('../../database/queries/titres', () => ({
  __esModule: true,
  titresAdministrationsGestionnairesCreate: jest
    .fn()
    .mockImplementation(a => a),
  titreAdministrationGestionnaireDelete: jest.fn()
}))

jest.mock('../rules/titre-administrations-gestionnaires-build', () => ({
  __esModule: true,
  default: jest.fn()
}))

const titreAdministrationsGestionnairesBuildMock = mocked(
  titreAdministrationsGestionnairesBuild,
  true
)

const titresAdministrationsGestionnairesCreateMock = mocked(
  titresAdministrationsGestionnairesCreate,
  true
)

const titreAdministrationGestionnaireDeleteMock = mocked(
  titreAdministrationGestionnaireDelete,
  true
)

console.info = jest.fn()

describe("administrations d'une étape", () => {
  test("ajoute les administrations gestionnaires si elles n'existent pas dans l'étape", async () => {
    titreAdministrationsGestionnairesBuildMock.mockReturnValue([
      { administrationId: 'ptmg' },
      { administrationId: 'dgaln' }
    ] as ITitreAdministrationsGestionnaire[])

    const {
      titresAdministrationsGestionnairesCreated,
      titresAdministrationsGestionnairesDeleted
    } = await titresAdministrationGestionnairesUpdate(
      titresAdministrationGestionnaireVide,
      administrations
    )

    expect(titresAdministrationsGestionnairesCreated.length).toEqual(2)
    expect(titresAdministrationsGestionnairesDeleted.length).toEqual(0)

    expect(titresAdministrationsGestionnairesCreateMock).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalled()
  })

  test("n'ajoute pas d'administration gestionnaire si elle existe déjà dans l'étape", async () => {
    titreAdministrationsGestionnairesBuildMock.mockReturnValue([
      { administrationId: 'dgec' }
    ] as ITitreAdministrationsGestionnaire[])

    const {
      titresAdministrationsGestionnairesCreated,
      titresAdministrationsGestionnairesDeleted
    } = await titresAdministrationGestionnairesUpdate(
      titresAdministrationGestionnaireExistante,
      administrations
    )

    expect(titresAdministrationsGestionnairesCreated.length).toEqual(0)
    expect(titresAdministrationsGestionnairesDeleted.length).toEqual(0)

    expect(console.info).not.toHaveBeenCalled()
  })

  test("supprime une administration gestionnaire si l'étape ne la contient plus dans ses communes", async () => {
    titreAdministrationsGestionnairesBuildMock.mockReturnValue([])

    const {
      titresAdministrationsGestionnairesCreated,
      titresAdministrationsGestionnairesDeleted
    } = await titresAdministrationGestionnairesUpdate(
      titresAdministrationGestionnaireInexistante,
      administrations
    )

    expect(titresAdministrationsGestionnairesCreated.length).toEqual(0)
    expect(titresAdministrationsGestionnairesDeleted.length).toEqual(1)

    expect(titreAdministrationGestionnaireDeleteMock).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalled()
  })
})
