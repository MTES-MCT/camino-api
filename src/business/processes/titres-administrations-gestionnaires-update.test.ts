import { mocked } from 'ts-jest/utils'
import { ITitreAdministrationGestionnaire } from '../../types'
import { titresAdministrationsGestionnairesUpdate } from './titres-administrations-gestionnaires-update'

import {
  titresAdministrationsGestionnairesCreate,
  titreAdministrationGestionnaireDelete,
  titresGet
} from '../../database/queries/titres'
import { administrationsGet } from '../../database/queries/administrations'
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
  titreAdministrationGestionnaireDelete: jest.fn(),
  titresGet: jest.fn()
}))

jest.mock('../../database/queries/administrations', () => ({
  administrationsGet: jest.fn()
}))

jest.mock('../rules/titre-administrations-gestionnaires-build', () => ({
  __esModule: true,
  default: jest.fn()
}))

const titresGetMock = mocked(titresGet, true)
const administrationsGetMock = mocked(administrationsGet, true)
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
    titresGetMock.mockResolvedValue(titresAdministrationGestionnaireVide)
    administrationsGetMock.mockResolvedValue(administrations)
    titreAdministrationsGestionnairesBuildMock.mockReturnValue([
      { administrationId: 'ptmg' },
      { administrationId: 'dgaln' }
    ] as ITitreAdministrationGestionnaire[])

    const {
      titresAdministrationsGestionnairesCreated,
      titresAdministrationsGestionnairesDeleted
    } = await titresAdministrationsGestionnairesUpdate()

    expect(titresAdministrationsGestionnairesCreated.length).toEqual(2)
    expect(titresAdministrationsGestionnairesDeleted.length).toEqual(0)

    expect(titresAdministrationsGestionnairesCreateMock).toHaveBeenCalled()
  })

  test("n'ajoute pas d'administration gestionnaire si elle existe déjà dans l'étape", async () => {
    titresGetMock.mockResolvedValue(titresAdministrationGestionnaireExistante)
    administrationsGetMock.mockResolvedValue(administrations)
    titreAdministrationsGestionnairesBuildMock.mockReturnValue([
      { administrationId: 'dgec' }
    ] as ITitreAdministrationGestionnaire[])

    const {
      titresAdministrationsGestionnairesCreated,
      titresAdministrationsGestionnairesDeleted
    } = await titresAdministrationsGestionnairesUpdate()

    expect(titresAdministrationsGestionnairesCreated.length).toEqual(0)
    expect(titresAdministrationsGestionnairesDeleted.length).toEqual(0)
  })

  test("supprime une administration gestionnaire si l'étape ne la contient plus dans ses communes", async () => {
    titresGetMock.mockResolvedValue(titresAdministrationGestionnaireInexistante)
    administrationsGetMock.mockResolvedValue(administrations)
    titreAdministrationsGestionnairesBuildMock.mockReturnValue([])

    const {
      titresAdministrationsGestionnairesCreated,
      titresAdministrationsGestionnairesDeleted
    } = await titresAdministrationsGestionnairesUpdate()

    expect(titresAdministrationsGestionnairesCreated.length).toEqual(0)
    expect(titresAdministrationsGestionnairesDeleted.length).toEqual(1)
    expect(titreAdministrationGestionnaireDeleteMock).toHaveBeenCalled()
  })
})
