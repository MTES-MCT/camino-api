import titreDateDemandeFind from './titre-date-demande-find'

import {
  titreDemarcheOctEtapeMen,
  titreDemarcheOctSansEtapes,
  titreDemarcheOctSansEtapeMen
} from './__mocks__/titre-date-demande-find-demarches'

describe("cherche la date de demande initiale d'un titre", () => {
  test("retourne null si le statut d'un titre n'est pas demande initiale", () => {
    expect(titreDateDemandeFind([], 'val')).toBeNull()
  })

  test("retourne la date de l'étape de dépôt de la demande d'une démarche demande initiale d'un titre dont le statut est demande initiale", () => {
    expect(titreDateDemandeFind(titreDemarcheOctEtapeMen, 'dmi')).toBe(
      '1988-03-11'
    )
  })

  test("retourne null si un titre avec le statut est demande initiale n'a pas de démarches", () => {
    expect(titreDateDemandeFind([], 'dmi')).toBeNull()
  })

  test("retourne null si la démarche d'octroi d'un titre avec le statut est demande initiale n'a pas d'étapes'", () => {
    expect(titreDateDemandeFind(titreDemarcheOctSansEtapes, 'dmi')).toBeNull()
  })

  test("retourne null si la démarche d'octroi d'un titre avec le statut est demande initiale n'a pas d'étape de dépôt de la demande'", () => {
    expect(titreDateDemandeFind(titreDemarcheOctSansEtapeMen, 'dmi')).toBeNull()
  })
})
