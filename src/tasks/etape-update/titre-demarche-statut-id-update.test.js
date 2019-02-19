import titresDemarcheStatutIdUpdate from './titre-demarche-statut-id-update'
import { titreDemarcheOctPoints } from './__mocks__/titre-demarche-statut-id-update-demarches'

const titreDemarches = {}

jest.mock('../titre-demarches', () => ({
  titreDemarcheStatutIdUpdate: () =>
    titreDemarches.titreDemarcheStatutIdUpdate()
}))

describe("met à jour le statut d'une démarche en fonction du type de titre", () => {
  test('le statut de la démarche est mis à jour', async () => {
    titreDemarches.titreDemarcheStatutIdUpdate = () => true

    expect(await titresDemarcheStatutIdUpdate(titreDemarcheOctPoints)).toEqual(
      'Mise à jour: 1 statut de démarche.'
    )
  })

  test("le statut de la démarche n'est pas mis à jour", async () => {
    titreDemarches.titreDemarcheStatutIdUpdate = () => false

    expect(await titresDemarcheStatutIdUpdate(titreDemarcheOctPoints)).toEqual(
      'Mise à jour: 0 statut de démarche.'
    )
  })
})
