import { mocked } from 'ts-jest/utils'

import { titresEtapesAdministrationsLocalesUpdate } from './titres-etapes-administrations-locales-update'

import * as titreEtapes from '../../database/queries/titres-etapes'
import { titresGet } from '../../database/queries/titres'
import { administrationsGet } from '../../database/queries/administrations'

import {
  administrations,
  titresEtapesCommunes,
  titresEtapesCommunesVides,
  titresEtapesCommunesMemeCommune,
  titresEtapesAdministrationLocalesInexistante,
  titresEtapesAdministrationLocalesExistante,
  titresArm
} from './__mocks__/titres-etapes-administrations-locales-update-etapes'
import Administrations from '../../database/models/administrations'

jest.mock('../../database/queries/titres-etapes', () => ({
  titresEtapesAdministrationsCreate: jest.fn().mockImplementation(a => a),
  titreEtapeAdministrationDelete: jest.fn().mockImplementation(a => a)
}))

jest.mock('../../database/queries/titres', () => ({
  titresGet: jest.fn()
}))

jest.mock('../../database/queries/administrations', () => ({
  administrationsGet: jest.fn()
}))

const titresGetMock = mocked(titresGet, true)

const administrationsGetMock = mocked(administrationsGet, true)

console.info = jest.fn()

describe("administrations d'une étape", () => {
  test('ajoute 2 administrations dans une étape', async () => {
    titresGetMock.mockResolvedValue(titresEtapesCommunes)
    administrationsGetMock.mockResolvedValue(administrations)
    const {
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted
    } = await titresEtapesAdministrationsLocalesUpdate()

    expect(titresEtapesAdministrationsLocalesCreated.length).toEqual(2)
    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(0)
  })

  test("n'ajoute pas deux fois une administration en doublon ", async () => {
    titresGetMock.mockResolvedValue(titresEtapesCommunesMemeCommune)
    administrationsGetMock.mockResolvedValue(administrations)
    const {
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted
    } = await titresEtapesAdministrationsLocalesUpdate()

    expect(titresEtapesAdministrationsLocalesCreated.length).toEqual(1)
    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(0)

    expect(titreEtapes.titresEtapesAdministrationsCreate).toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationDelete).not.toHaveBeenCalled()
  })

  test("ne met pas à jour les administrations d'une étape qui n'a pas de commune", async () => {
    titresGetMock.mockResolvedValue(titresEtapesCommunesVides)
    administrationsGetMock.mockResolvedValue(administrations)
    const {
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted
    } = await titresEtapesAdministrationsLocalesUpdate()

    expect(titresEtapesAdministrationsLocalesCreated.length).toEqual(0)
    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(0)

    expect(titreEtapes.titresEtapesAdministrationsCreate).not.toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationDelete).not.toHaveBeenCalled()
  })

  test("n'ajoute pas d'administration si elle existe déjà dans l'étape", async () => {
    titresGetMock.mockResolvedValue(titresEtapesAdministrationLocalesExistante)
    administrationsGetMock.mockResolvedValue(administrations)
    const {
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted
    } = await titresEtapesAdministrationsLocalesUpdate()

    expect(titresEtapesAdministrationsLocalesCreated.length).toEqual(0)
    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(0)
  })

  test("supprime une administration si l'étape ne la contient plus dans ses communes", async () => {
    titresGetMock.mockResolvedValue(
      titresEtapesAdministrationLocalesInexistante
    )
    administrationsGetMock.mockResolvedValue([{ id: '0' }] as Administrations[])
    const {
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted
    } = await titresEtapesAdministrationsLocalesUpdate()

    expect(titresEtapesAdministrationsLocalesCreated.length).toEqual(0)
    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(1)
  })

  test("ajoute l'option 'associee' à la Déal Guyane sur une ARM", async () => {
    titresGetMock.mockResolvedValue(titresArm)
    administrationsGetMock.mockResolvedValue(administrations)
    const {
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted
    } = await titresEtapesAdministrationsLocalesUpdate()

    expect(titresEtapesAdministrationsLocalesCreated.length).toEqual(2)
    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(0)
    expect(
      titresEtapesAdministrationsLocalesCreated.find(
        ({ administrationId }) => administrationId === 'dea-guyane-01'
      )!.associee
    ).toBeTruthy()
  })
})
