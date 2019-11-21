import titreAdministrationsGestionnairesBuild from './titre-administrations-gestionnaires-build'

import {
  administrations,
  titreArm,
  titreAxm
} from './__mocks__/titre-administrations-gestionnaires-build-titres'

describe("construction des activités d'un titre", () => {
  test("ajoute l'ONF comme gestionnaire à un titre de type ARM", async () => {
    const titreAdministrationsGestionnaires = await titreAdministrationsGestionnairesBuild(
      titreArm,
      administrations
    )

    expect(titreAdministrationsGestionnaires.length).toEqual(2)
  })

  test("n'ajoute pas l'ONF comme gestionnaire à un titre de type AXM", async () => {
    const titreAdministrationsGestionnaires = await titreAdministrationsGestionnairesBuild(
      titreAxm,
      administrations
    )

    expect(
      titreAdministrationsGestionnaires.find(a => a.administrationId === 'onf')
    ).toBeFalsy()
  })
})
