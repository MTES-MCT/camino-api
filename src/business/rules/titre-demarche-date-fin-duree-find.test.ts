import titreDemarcheDateFinAndDureeFind from './titre-demarche-date-fin-duree-find'

import {
  titreDemarchesOctDateFin,
  titreDemarchesOctDateDebut,
  titreDemarchesOctDureeZero,
  titreDemarchesOctPasDeDpu,
  titreDemarchesOctDpuFirst,
  titreDemarchesOctNiDpuNiDex,
  titreDemarchesOctProDuree,
  titreDemarchesOctRetDateFin,
  titreDemarchesOctRetDate,
  titreDemarchesOctRetNoDex,
  titreDemarchesRenPoints,
  titreDemarchesRenPointsVideDex,
  titreDemarchesRenPointsVideNiDpuNiDex
} from './__mocks__/titre-demarche-date-fin-duree-find-demarches'

describe("retourne la date de fin et la durée d'une démarche", () => {
  test("la date de fin d'une démarche d'octroi est celle de la dernière étape dont la date de fin est renseignée", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesOctDateFin, 1)
    ).toEqual({
      dateFin: '2013-03-11',
      duree: 0
    })
  })

  test("la date de fin d'une démarche d'octroi est celle de la dernière étape dont la date de début et la durée sont renseignées", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesOctDateDebut, 1)
    ).toEqual({
      dateFin: '2023-03-11',
      duree: 10 * 12
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
      titreDemarcheDateFinAndDureeFind(titreDemarchesOctPasDeDpu, 1)
    ).toEqual({
      dateFin: '2013-03-06',
      duree: 25 * 12
    })
  })

  test("la date de fin d'une démarche d'octroi avec seulement une étape de dpu est celle de la dpu", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesOctDpuFirst, 1)
    ).toEqual({
      dateFin: '2013-03-06',
      duree: 25 * 12
    })
  })

  test("la date de fin d'une démarche d'octroi sans dpu ni dex est indéfinie", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesOctNiDpuNiDex, 1)
    ).toEqual({
      dateFin: null,
      duree: 25 * 12
    })
  })

  test("la date de fin d'une démarche d'octroi et d'une démarche normale avec une étape avec une durée est prolongée d'autant", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesOctProDuree, 2)
    ).toEqual({
      dateFin: '2038-03-11',
      duree: 50 * 12
    })
  })

  test("la date de fin d'une démarche d'abrogation est celle de l'étape dont la date de fin est renseignée", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesOctRetDateFin, 2)
    ).toEqual({
      dateFin: '2200-03-11',
      duree: 0
    })
  })

  test("la date de fin d'une démarche d'abrogation est la date de l'étape dex si aucune date de fin n'est renseignée", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesOctRetDate, 2)
    ).toEqual({
      dateFin: '2013-05-21',
      duree: 0
    })
  })

  test("la date de fin d'une démarche d'abrogation est la date de fin de la démarche suivante si aucune dex n'existe", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesOctRetNoDex, 2)
    ).toEqual({
      dateFin: '2013-03-11',
      duree: 25 * 12
    })
  })

  test("la date de fin d'une démarche de renonciation n'est pas prise en compte si celle-ci possède un périmètre géographique", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesRenPoints, 2)
    ).toEqual({
      dateFin: '2013-03-11',
      duree: 25 * 12
    })
  })

  test("la date de fin d'une démarche de renonciation est la date de l'étape de dex si celle-ci ne possède pas de périmètre géographique", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesRenPointsVideDex, 1)
    ).toEqual({
      dateFin: '1988-06-06',
      duree: 0
    })
  })

  test("la date de fin d'une démarche de renonciation sans étape possédant de périmètre ni dpu est indéfinie", () => {
    expect(
      titreDemarcheDateFinAndDureeFind(titreDemarchesRenPointsVideNiDpuNiDex, 1)
    ).toEqual({
      dateFin: null,
      duree: 0
    })
  })
})
