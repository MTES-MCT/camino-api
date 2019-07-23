import entrepriseUpdate from './entreprises-update'
import * as apientreprises from '../../tools/api-insee'

import {
  entreprisesDbCreees,
  entreprisesEtablissementsDbCreees,
  entreprisesApiCreees,
  entreprisesDbModifiees,
  entreprisesEtablissementsDbModifies,
  entreprisesApiModifiees,
  entreprisesDbExistantes,
  entreprisesEtablissementsDbExistants,
  entreprisesApiExistantes,
  entreprisesDbInexistantes,
  entreprisesEtablissementsDbInexistants,
  entreprisesApiInexistantes
} from './__mocks__/entreprises-update'

// 'jest.mock()` est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../database/queries/entreprises', () => ({
  entreprisesUpsert: jest.fn().mockResolvedValue()
}))

jest.mock('../../database/queries/entreprises-etablissements', () => ({
  entreprisesEtablissementsUpsert: jest.fn().mockResolvedValue()
}))

// 'jest.mock()' est hoisté avant l'import, le court-circuitant
// https://jestjs.io/docs/en/jest-object#jestdomockmodulename-factory-options
jest.mock('../../tools/api-insee', () => ({
  entrepriseAdresseGet: jest.fn(),
  entrepriseEtablissementGet: jest.fn(),
  tokenInitialize: jest.fn().mockResolvedValue(1)
}))

console.log = jest.fn()
console.info = jest.fn()

describe('entreprises', () => {
  test("crée les entreprises si elles n'existent pas", async () => {
    apientreprises.entrepriseAdresseGet.mockResolvedValue(entreprisesApiCreees)
    apientreprises.entrepriseEtablissementGet.mockResolvedValue(
      entreprisesApiCreees
    )

    const log = await entrepriseUpdate(
      entreprisesDbCreees,
      entreprisesEtablissementsDbCreees
    )

    expect(log).toEqual([
      "Mise à jour: 1 établissement(s) d'entreprise(s).",
      "Mise à jour: 1 adresse(s) d'entreprise(s)."
    ])
    expect(console.log).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalled()
  })

  test('met à jour les entreprises qui ont été modifiées', async () => {
    apientreprises.entrepriseAdresseGet.mockResolvedValue(
      entreprisesApiModifiees
    )
    apientreprises.entrepriseEtablissementGet.mockResolvedValue(
      entreprisesApiModifiees
    )

    const log = await entrepriseUpdate(
      entreprisesDbModifiees,
      entreprisesEtablissementsDbModifies
    )

    expect(log).toEqual([
      "Mise à jour: 1 établissement(s) d'entreprise(s).",
      "Mise à jour: 1 adresse(s) d'entreprise(s)."
    ])
    expect(console.log).toHaveBeenCalled()
  })

  test('ne crée pas les entreprises qui existent déjà', async () => {
    apientreprises.entrepriseAdresseGet.mockResolvedValue(
      entreprisesApiExistantes
    )
    apientreprises.entrepriseEtablissementGet.mockResolvedValue(
      entreprisesApiExistantes
    )

    const log = await entrepriseUpdate(
      entreprisesDbExistantes,
      entreprisesEtablissementsDbExistants
    )

    expect(log).toEqual([
      "Mise à jour: 0 établissement(s) d'entreprise(s).",
      "Mise à jour: 0 adresse(s) d'entreprise(s)."
    ])
    expect(console.log).not.toHaveBeenCalled()
  })

  test("ne modifie pas d'entreprises si elles n'existent déjà", async () => {
    apientreprises.entrepriseAdresseGet.mockResolvedValue(
      entreprisesApiInexistantes
    )
    apientreprises.entrepriseEtablissementGet.mockResolvedValue(
      entreprisesApiInexistantes
    )

    const log = await entrepriseUpdate(
      entreprisesDbInexistantes,
      entreprisesEtablissementsDbInexistants
    )

    expect(log).toEqual([
      "Mise à jour: 0 établissement(s) d'entreprise(s).",
      "Mise à jour: 0 adresse(s) d'entreprise(s)."
    ])
    expect(console.log).not.toHaveBeenCalled()
  })

  test("retourne un message d'erreur si l'accès à l'api Siren ne fonctionne pas", async () => {
    apientreprises.tokenInitialize.mockRejectedValue(new Error('token error'))

    const log = await entrepriseUpdate(
      entreprisesDbCreees,
      entreprisesEtablissementsDbCreees
    )

    expect(log).toEqual([
      "Erreur: impossible de se connecter à l'API INSEE SIREN V3",
      "Mise à jour: 0 établissement(s) d'entreprise(s).",
      "Mise à jour: 0 adresse(s) d'entreprise(s)."
    ])
    expect(console.log).not.toHaveBeenCalled()
  })
})
