import titresEtapeAdministrationsLocalesUpdate from './titres-etapes-administrations-locales-update'

import * as titreEtapes from '../../database/queries/titres-etapes'

import {
  administrations,
  titresEtapesCommunes,
  titresEtapesCommunesVides,
  titresEtapesCommunesMemeCommune,
  titresEtapesAdministrationLocalesInexistante,
  titresEtapesAdministrationLocalesExistante,
  titresArm,
  titresAxm
} from './__mocks__/titres-etapes-administrations-locales-update-etapes'

jest.mock('../../database/queries/titres-etapes', () => ({
  titresEtapesAdministrationsCreate: jest.fn().mockImplementation(a => a),
  titreEtapeAdministrationDelete: jest.fn().mockImplementation(a => a)
}))

console.log = jest.fn()

describe("administrations d'une étape", () => {
  test('ajoute 2 administrations dans une étape', async () => {
    const [
      titresEtapesAdministrationsCreated,
      titresEtapesAdministrationsLocalesDeleted
    ] = await titresEtapeAdministrationsLocalesUpdate(
      titresEtapesCommunes,
      administrations
    )

    expect(titresEtapesAdministrationsCreated.length).toEqual(2)
    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(0)

    expect(console.log).toHaveBeenCalledTimes(1)
  })

  test("n'ajoute pas deux fois une administration en doublon ", async () => {
    const [
      titresEtapesAdministrationsCreated,
      titresEtapesAdministrationsLocalesDeleted
    ] = await titresEtapeAdministrationsLocalesUpdate(
      titresEtapesCommunesMemeCommune,
      administrations
    )

    expect(titresEtapesAdministrationsCreated.length).toEqual(1)
    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(0)

    expect(titreEtapes.titresEtapesAdministrationsCreate).toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationDelete).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test("ne met pas à jour les administrations d'une étape qui n'a pas de commune", async () => {
    const [
      titresEtapesAdministrationsCreated,
      titresEtapesAdministrationsLocalesDeleted
    ] = await titresEtapeAdministrationsLocalesUpdate(
      titresEtapesCommunesVides,
      administrations
    )

    expect(titresEtapesAdministrationsCreated.length).toEqual(0)
    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(0)

    expect(titreEtapes.titresEtapesAdministrationsCreate).not.toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationDelete).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })

  test("n'ajoute pas d'administration si elle existe déjà dans l'étape", async () => {
    const [
      titresEtapesAdministrationsCreated,
      titresEtapesAdministrationsLocalesDeleted
    ] = await titresEtapeAdministrationsLocalesUpdate(
      titresEtapesAdministrationLocalesExistante,
      administrations
    )

    expect(titresEtapesAdministrationsCreated.length).toEqual(0)
    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })

  test("supprime une administration si l'étape ne la contient plus dans ses communes", async () => {
    const [
      titresEtapesAdministrationsCreated,
      titresEtapesAdministrationsLocalesDeleted
    ] = await titresEtapeAdministrationsLocalesUpdate(
      titresEtapesAdministrationLocalesInexistante,
      [{ id: 0 }]
    )

    expect(titresEtapesAdministrationsCreated.length).toEqual(0)
    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(1)
    expect(console.log).toHaveBeenCalled()
  })

  test("ajoute uniquement l'ONF comme décideur à un titre de type ARM", async () => {
    const [
      titresEtapesAdministrationsCreated,
      titresEtapesAdministrationsLocalesDeleted
    ] = await titresEtapeAdministrationsLocalesUpdate(
      titresArm,
      administrations
    )

    expect(titresEtapesAdministrationsCreated.length).toEqual(1)
    expect(
      titresEtapesAdministrationsCreated.find(
        a => a.administrationId === 'ope-onf-973-01'
      ).subsidiaire
    ).toBeFalsy()

    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(0)

    expect(titreEtapes.titresEtapesAdministrationsCreate).toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationDelete).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test("n'ajoute pas l'ONF comme décideur à un titre de type AEX", async () => {
    const [
      titresEtapesAdministrationsCreated,
      titresEtapesAdministrationsLocalesDeleted
    ] = await titresEtapeAdministrationsLocalesUpdate(
      titresAxm,
      administrations
    )

    expect(titresEtapesAdministrationsCreated.length).toEqual(1)
    expect(
      titresEtapesAdministrationsCreated.find(
        a => a.administrationId === 'ope-onf-973-01'
      ).subsidiaire
    ).toBeTruthy()

    expect(titresEtapesAdministrationsLocalesDeleted.length).toEqual(0)

    expect(titreEtapes.titresEtapesAdministrationsCreate).toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationDelete).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })
})
