jest.mock('../titres', () => ({
  titreStatutIdUpdate: (titre, statutId) => statutId !== titre.statutId
}))

import titreStatutIdUpdate from './titre-statut-id-update'
import {
  titreValideStatutIdAJour,
  titreEchuStatutIdObselete
} from './__mocks__/titre-statut-id-update-titres'

describe("met à jour le statut d'un titre", () => {
  test('un statut obselète est mis à jour', async () => {
    expect(await titreStatutIdUpdate(titreEchuStatutIdObselete)).toEqual(
      'Mise à jour: 1 statuts de titres.'
    )
  })

  test("un statut à jour n'est pas mis à jour", async () => {
    expect(await titreStatutIdUpdate(titreValideStatutIdAJour)).toEqual(
      'Mise à jour: 0 statuts de titres.'
    )
  })
})
