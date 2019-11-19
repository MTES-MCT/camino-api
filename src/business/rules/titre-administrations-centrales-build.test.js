import titreAdministrationsCentralesBuild from './titre-administrations-centrales-build'

import {
  administrations,
  titreArm,
  titreAxm
} from './__mocks__/titre-administrations-centrales-build-titres'

describe("construction des activités d'un titre", () => {
  test("ajoute l'ONF comme gestionnaire à un titre de type ARM", async () => {
    const titreAdministrationsCentrales = await titreAdministrationsCentralesBuild(
      titreArm,
      administrations
    )

    expect(titreAdministrationsCentrales.length).toEqual(2)
  })

  test("n'ajoute pas l'ONF comme gestionnaire à un titre de type AXM", async () => {
    const titreAdministrationsCentrales = await titreAdministrationsCentralesBuild(
      titreAxm,
      administrations
    )

    expect(
      titreAdministrationsCentrales.find(a => a.administrationId === 'onf')
    ).toBeFalsy()
  })
})
