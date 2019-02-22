import titreDemarcheDateFinAndDureeFind from './titre-demarche-date-fin-duree-find'
import {
  titreDemarchesOctDateFin,
  titreDemarchesOctDateDebut,
  titreDemarchesOctDureeZero,
  titreDemarchesOctPasDeDpu,
  titreDemarchesOctDpuFirst,
  titreDemarchesOctNiDpuNiDex,
  titreDemarchesOctProDuree,
  titreDemarchesOctAbrDateFin,
  titreDemarchesOctAbrDate,
  titreDemarchesRenPoints,
  titreDemarchesRenPointsVide
} from './__mocks__/titre-demarche-date-fin-duree-find-demarches'

describe("retourne la date de fin et la durée d'une démarche", () => {
  test("la date de fin d'une démarche d'octroi est celle de la dernière étape dont la date de fin est renseignée", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesOctDateFin, 1)
    ).toEqual({
      dateFin: '2013-03-12',
      duree: 0
    })
  })

  test("la date de fin d'une démarche d'octroi est celle de la dernière étape dont la date de début et la durée sont renseignées", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesOctDateDebut, 1)
    ).toEqual({
      dateFin: '2023-03-12',
      duree: 10
    })
  })

  test("la date de fin d'une démarche d'octroi est fixée au 31 décembre 2018 si la durée de la dernière étape est 0", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesOctDureeZero, 1)
    ).toEqual({
      dateFin: '2018-12-31',
      duree: 0
    })
  })

  test("la date de fin d'une démarche d'octroi sans étape de dpu est celle de la dex", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesOctPasDeDpu, 5)
    ).toEqual({
      dateFin: '2013-03-07',
      duree: 25
    })
  })

  test("la date de fin d'une démarche d'octroi avec seulement une étape de dpu est celle de la dpu", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesOctDpuFirst, 5)
    ).toEqual({
      dateFin: '2013-03-07',
      duree: 25
    })
  })

  test("la date de fin d'une démarche d'octroi sans dpu ni dex est indéfinie", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesOctNiDpuNiDex, 5)
    ).toEqual({
      dateFin: null,
      duree: 25
    })
  })

  test("la date de fin d'une démarche d'octroi et d'une démarche normale avec une étape avec une durée est prolong2e d'autant", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesOctProDuree, 5)
    ).toEqual({
      dateFin: '2038-03-12',
      duree: 50
    })
  })

  test("la date de fin d'une démarche d'abrogation est celle de l'étape dont la date de fin est renseignée", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesOctAbrDateFin, 5)
    ).toEqual({
      dateFin: '2200-03-12',
      duree: 0
    })
  })

  test("la date de fin d'une démarche d'abrogation est la date de l'étape si aucune date de fin n'est renseignée", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesOctAbrDate, 5)
    ).toEqual({
      dateFin: '2013-05-22',
      duree: 0
    })
  })

  test("la date de fin d'une démarche de renonciation n'est pas prise en compte si celle-ci possède un périmètre géographique", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesRenPoints, 5)
    ).toEqual({
      dateFin: '2013-03-12',
      duree: 25
    })
  })

  test("la date de fin d'une démarche de renonciation est celle de l'étape si celle-ci ne possède pas de périmètre géographique", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesRenPointsVide, 5)
    ).toEqual({
      dateFin: '1988-06-07',
      duree: 0
    })
  })
})
