import titresEtapeAdministrationsUpdate from './titres-etapes-administrations-update'

import * as titreEtapes from '../../database/queries/titres-etapes'

import {
  administrations,
  titresEtapesCommunes,
  titresEtapesCommunesVides,
  titresEtapesCommunesMemeCommune,
  titresEtapesAdministrationInexistante,
  titresEtapesAdministrationExistante,
  titresArm
} from './__mocks__/titres-etapes-administrations-update-etapes'

jest.mock('../../database/queries/titres-etapes', () => ({
  titresEtapesAdministrationsCreate: jest.fn().mockImplementation(a => a),
  titreEtapeAdministrationDelete: jest.fn().mockImplementation(a => a)
}))

console.log = jest.fn()

describe("administrations d'une étape", () => {
  test('ajoute 2 administrations dans une étape', async () => {
    const [
      titresEtapesAdministrationsCreated,
      titresEtapesAdministrationsDeleted
    ] = await titresEtapeAdministrationsUpdate(
      titresEtapesCommunes,
      administrations
    )

    expect(titresEtapesAdministrationsCreated.length).toEqual(2)
    expect(titresEtapesAdministrationsDeleted.length).toEqual(0)

    expect(console.log).toHaveBeenCalledTimes(1)
  })

  test("n'ajoute pas deux fois une administration en doublon ", async () => {
    const [
      titresEtapesAdministrationsCreated,
      titresEtapesAdministrationsDeleted
    ] = await titresEtapeAdministrationsUpdate(
      titresEtapesCommunesMemeCommune,
      administrations
    )

    expect(titresEtapesAdministrationsCreated.length).toEqual(1)
    expect(titresEtapesAdministrationsDeleted.length).toEqual(0)

    expect(titreEtapes.titresEtapesAdministrationsCreate).toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationDelete).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test("ne met pas à jour les administrations d'une étape qui n'a pas de commune", async () => {
    const [
      titresEtapesAdministrationsCreated,
      titresEtapesAdministrationsDeleted
    ] = await titresEtapeAdministrationsUpdate(
      titresEtapesCommunesVides,
      administrations
    )

    expect(titresEtapesAdministrationsCreated.length).toEqual(0)
    expect(titresEtapesAdministrationsDeleted.length).toEqual(0)

    expect(titreEtapes.titresEtapesAdministrationsCreate).not.toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationDelete).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })

  test("n'ajoute pas d'administration si elle existe déjà dans l'étape", async () => {
    const [
      titresEtapesAdministrationsCreated,
      titresEtapesAdministrationsDeleted
    ] = await titresEtapeAdministrationsUpdate(
      titresEtapesAdministrationExistante,
      administrations
    )

    expect(titresEtapesAdministrationsCreated.length).toEqual(0)
    expect(titresEtapesAdministrationsDeleted.length).toEqual(0)
    expect(console.log).not.toHaveBeenCalled()
  })

  test("supprime une administration si l'étape ne la contient plus dans ses communes", async () => {
    const [
      titresEtapesAdministrationsCreated,
      titresEtapesAdministrationsDeleted
    ] = await titresEtapeAdministrationsUpdate(
      titresEtapesAdministrationInexistante,
      [{ id: 0 }]
    )

    expect(titresEtapesAdministrationsCreated.length).toEqual(0)
    expect(titresEtapesAdministrationsDeleted.length).toEqual(1)
    expect(console.log).toHaveBeenCalled()
  })

  test("ajoute uniquement l'ONF comme administration centrale à un titre de type ARM", async () => {
    const [
      titresEtapesAdministrationsCreated,
      titresEtapesAdministrationsDeleted
    ] = await titresEtapeAdministrationsUpdate(titresArm, administrations)

    expect(titresEtapesAdministrationsCreated.length).toEqual(1)
    expect(titresEtapesAdministrationsDeleted.length).toEqual(0)

    expect(titreEtapes.titresEtapesAdministrationsCreate).toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationDelete).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test("n'ajoute aucune administration centrale à un titre de type AXM", async () => {
    const [
      titresEtapesAdministrationsCreated,
      titresEtapesAdministrationsDeleted
    ] = await titresEtapeAdministrationsUpdate(
      titresEtapesCommunesVides,
      administrations
    )

    expect(titresEtapesAdministrationsCreated.length).toEqual(0)
    expect(titresEtapesAdministrationsDeleted.length).toEqual(0)

    expect(titreEtapes.titresEtapesAdministrationsCreate).not.toHaveBeenCalled()
    expect(titreEtapes.titreEtapeAdministrationDelete).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})
