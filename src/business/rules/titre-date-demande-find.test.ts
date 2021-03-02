import { titreDateDemandeFind } from './titre-date-demande-find'

import {
  titreDemarcheOctEtapeMen,
  titreDemarcheOctSansEtapes,
  titreDemarcheOctSansEtapeMen
} from './__mocks__/titre-date-demande-find-demarches'

describe("cherche la date de demande initiale d'un titre", () => {
  test("retourne null si le titre n'a pas de démarches", () => {
    expect(titreDateDemandeFind([])).toBeNull()
  })

  test("retourne la date de l'étape de dépôt de la demande d'une démarche", () => {
    expect(titreDateDemandeFind(titreDemarcheOctEtapeMen)).toBe('1988-03-11')
  })

  test("retourne null si la démarche d'octroi d'un titre n'a pas d'étapes'", () => {
    expect(titreDateDemandeFind(titreDemarcheOctSansEtapes)).toBeNull()
  })

  test("retourne null si la démarche d'octroi d'un titre n'a pas d'étape de dépôt de la demande'", () => {
    expect(titreDateDemandeFind(titreDemarcheOctSansEtapeMen)).toBeNull()
  })
})
