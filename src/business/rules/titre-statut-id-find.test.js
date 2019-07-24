import titreStatutIdFind from './titre-statut-id-find'
import {
  titreValide,
  titreEchu,
  titreOctroiInstruction,
  titreOctroiDepose,
  titreOctroiRejete,
  titreOctroiClasse,
  titreOctroiRetire,
  titreDemarcheInstruction
} from './__mocks__/titre-statut-id-find-titres'

describe("statut d'un titre", () => {
  test("le statut d'un titre dont la date de fin est dans le futur est “val”", () => {
    expect(titreStatutIdFind(titreValide)).toEqual('val')
  })

  test("le statut d'un titre dont la date de fin est dans le passé est “ech”", () => {
    expect(titreStatutIdFind(titreEchu)).toEqual('ech')
  })

  test("le statut d'un titre dont l'unique démarche est un octroi en instruction est “dmi”", () => {
    expect(titreStatutIdFind(titreOctroiInstruction)).toEqual('dmi')
  })

  test("le statut d'un titre dont l'unique démarche est un octroi déposé est “dmi”", () => {
    expect(titreStatutIdFind(titreOctroiDepose)).toEqual('dmi')
  })

  test("le statut d'un titre dont l'unique démarche est un octroi rejeté est “dmc”", () => {
    expect(titreStatutIdFind(titreOctroiRejete)).toEqual('dmc')
  })

  test("le statut d'un titre dont l'unique démarche est un octroi classé sans suite est “dmc”", () => {
    expect(titreStatutIdFind(titreOctroiClasse)).toEqual('dmc')
  })

  test("le statut d'un titre dont l'unique démarche est un octroi retiré est “dmc”", () => {
    expect(titreStatutIdFind(titreOctroiRetire)).toEqual('dmc')
  })

  test("le statut d'un titre avec une démarche en instruction est “mod”", () => {
    expect(titreStatutIdFind(titreDemarcheInstruction)).toEqual('mod')
  })
})
