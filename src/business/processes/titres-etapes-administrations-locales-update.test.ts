import { IAdministration } from '../../types'

import titresEtapeAdministrationsLocalesUpdate from './titres-etapes-administrations-locales-update'

import * as titreEtapes from '../../database/queries/titres-etapes'

import {
  administrations,
  titresEtapesCommunes,
  titresEtapesCommunesVides,
  titresEtapesCommunesMemeCommune,
  titresEtapesAdministrationLocalesInexistante,
  titresEtapesAdministrationLocalesExistante,
  titresArm
} from './__mocks__/titres-etapes-administrations-locales-update-etapes'

jest.mock('../../database/queries/titres-etapes', () => ({
  titresEtapesAdministrationsCreate: jest.fn().mockImplementation(a => a),
  titreEtapeAdministrationDelete: jest.fn().mockImplementation(a => a)
}))

console.info = jest.fn()

describe("administrations d'une étape", () => {
  test('ajoute 2 administrations dans une étape', async () => {
    const {
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted
    } = await titresEtapeAdministrationsLocalesUpdate(
      titresEtapesCommunes,
      administrations
    )

    expect(titresEtapesAdministrationsLocalesCreated.length).toEqual(2)
    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(0)

    expect(console.info).toHaveBeenCalledTimes(1)
  })

  test("n'ajoute pas deux fois une administration en doublon ", async () => {
    const {
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted
    } = await titresEtapeAdministrationsLocalesUpdate(
      titresEtapesCommunesMemeCommune,
      administrations
    )

    expect(titresEtapesAdministrationsLocalesCreated.length).toEqual(1)
    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(0)

    expect(titreEtapes.titresEtapesAdministrationsCreate).toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationDelete).not.toHaveBeenCalled()
    expect(console.info).toHaveBeenCalled()
  })

  test("ne met pas à jour les administrations d'une étape qui n'a pas de commune", async () => {
    const {
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted
    } = await titresEtapeAdministrationsLocalesUpdate(
      titresEtapesCommunesVides,
      administrations
    )

    expect(titresEtapesAdministrationsLocalesCreated.length).toEqual(0)
    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(0)

    expect(titreEtapes.titresEtapesAdministrationsCreate).not.toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationDelete).not.toHaveBeenCalled()
    expect(console.info).not.toHaveBeenCalled()
  })

  test("n'ajoute pas d'administration si elle existe déjà dans l'étape", async () => {
    const {
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted
    } = await titresEtapeAdministrationsLocalesUpdate(
      titresEtapesAdministrationLocalesExistante,
      administrations
    )

    expect(titresEtapesAdministrationsLocalesCreated.length).toEqual(0)
    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(0)
    expect(console.info).not.toHaveBeenCalled()
  })

  test("supprime une administration si l'étape ne la contient plus dans ses communes", async () => {
    const {
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted
    } = await titresEtapeAdministrationsLocalesUpdate(
      titresEtapesAdministrationLocalesInexistante,
      [{ id: '0' }] as IAdministration[]
    )

    expect(titresEtapesAdministrationsLocalesCreated.length).toEqual(0)
    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(1)
    expect(console.info).toHaveBeenCalled()
  })

  test("ajoute l'option 'associee' à la Déal Guyane sur une ARM", async () => {
    const {
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted
    } = await titresEtapeAdministrationsLocalesUpdate(
      titresArm,
      administrations
    )

    expect(titresEtapesAdministrationsLocalesCreated.length).toEqual(2)
    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(0)
    expect(
      titresEtapesAdministrationsLocalesCreated.find(
        ({ administrationId }) => administrationId === 'dea-guyane-01'
      )!.associee
    ).toBeTruthy()
    expect(console.info).toHaveBeenCalled()
  })
})
