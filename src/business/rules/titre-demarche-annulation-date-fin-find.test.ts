import { titreDemarcheAnnulationDateFinFind } from './titre-demarche-annulation-date-fin-find'

import {
  titreDemarcheAnnulationEtapes,
  titreDemarcheAnnulationEtapesDateFin,
  titreDemarcheAnnulationEtapesSansDate
} from './__mocks__/titre-demarche-annulation-date-fin-find'

describe("date de fin d'une démarche d'annulation", () => {
  test("retourne la date d'une démarche d'annulation si elle n'a pas de date de fin", () => {
    expect(
      titreDemarcheAnnulationDateFinFind(titreDemarcheAnnulationEtapes)
    ).toEqual('2013-05-21')
  })

  test("retourne la date de fin d'une démarche d'annulation si elle existe", () => {
    expect(
      titreDemarcheAnnulationDateFinFind(titreDemarcheAnnulationEtapesDateFin)
    ).toEqual('2013-05-25')
  })

  test("retourne null si l'étape n'a ni date, ni date de fin", () => {
    expect(
      titreDemarcheAnnulationDateFinFind(titreDemarcheAnnulationEtapesSansDate)
    ).toBeNull()
  })
})
