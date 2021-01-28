import { titreStatutIdFind } from './titre-statut-id-find'

import {
  titreDemarchesIndefini,
  titreDemarchesValide,
  titreDemarchesEchu,
  titreDemarchesOctroiInstruction,
  titreDemarchesOctroiDepose,
  titreDemarchesOctroiRejete,
  titreDemarchesOctroiClasse,
  titreDemarchesOctroiRetire,
  titreDemarchesInstruction
} from './__mocks__/titre-statut-id-find-titres'

describe("statut d'un titre", () => {
  const aujourdhui = '2020-12-01'

  test("le statut d'un titre sans démarche est “ind”", () => {
    expect(titreStatutIdFind(aujourdhui, undefined)).toEqual('ind')
  })

  test("le statut d'un titre avec des démarches dont le statut est “ind” est également “ind”", () => {
    expect(titreStatutIdFind(aujourdhui, titreDemarchesIndefini)).toEqual('ind')
  })

  test("le statut d'un titre dont la date de fin est dans le futur est “val”", () => {
    expect(titreStatutIdFind(aujourdhui, titreDemarchesValide)).toEqual('val')
  })

  test("le statut d'un titre dont la date de fin est dans le passé est “ech”", () => {
    expect(titreStatutIdFind(aujourdhui, titreDemarchesEchu)).toEqual('ech')
  })

  test("le statut d'un titre dont l'unique démarche est un octroi en instruction est “dmi”", () => {
    expect(
      titreStatutIdFind(aujourdhui, titreDemarchesOctroiInstruction)
    ).toEqual('dmi')
  })

  test("le statut d'un titre dont l'unique démarche est un octroi déposé est “dmi”", () => {
    expect(titreStatutIdFind(aujourdhui, titreDemarchesOctroiDepose)).toEqual(
      'dmi'
    )
  })

  test("le statut d'un titre dont l'unique démarche est un octroi rejeté est “dmc”", () => {
    expect(titreStatutIdFind(aujourdhui, titreDemarchesOctroiRejete)).toEqual(
      'dmc'
    )
  })

  test("le statut d'un titre dont l'unique démarche est un octroi classé sans suite est “dmc”", () => {
    expect(titreStatutIdFind(aujourdhui, titreDemarchesOctroiClasse)).toEqual(
      'dmc'
    )
  })

  test("le statut d'un titre dont l'unique démarche est un octroi retiré est “dmc”", () => {
    expect(titreStatutIdFind(aujourdhui, titreDemarchesOctroiRetire)).toEqual(
      'dmc'
    )
  })

  test("le statut d'un titre avec une démarche en instruction est “mod”", () => {
    expect(titreStatutIdFind(aujourdhui, titreDemarchesInstruction)).toEqual(
      'mod'
    )
  })
})
