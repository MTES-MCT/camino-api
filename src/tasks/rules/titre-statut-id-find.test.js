import titreDemarcheStatutIdFind from './titre-statut-id-find'
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

describe("retourne le statut d'un titre", () => {
  test("le statut d'un titre dont la date de fin est dans le futur est “val”", () => {
    expect(titreDemarcheStatutIdFind(titreValide)).toEqual('val')
  })

  test("le statut d'un titre dont la date de fin est dans le passé est “ech”", () => {
    expect(titreDemarcheStatutIdFind(titreEchu)).toEqual('ech')
  })

  test("le statut d'un titre dont l'unique démarche est un octroi en instruction est “dmi”", () => {
    expect(titreDemarcheStatutIdFind(titreOctroiInstruction)).toEqual('dmi')
  })

  test("le statut d'un titre dont l'unique démarche est un octroi déposé est “dmi”", () => {
    expect(titreDemarcheStatutIdFind(titreOctroiDepose)).toEqual('dmi')
  })

  test("le statut d'un titre dont l'unique démarche est un octroi rejeté est “dmc”", () => {
    expect(titreDemarcheStatutIdFind(titreOctroiRejete)).toEqual('dmc')
  })

  test("le statut d'un titre dont l'unique démarche est un octroi classé sans suite est “dmc”", () => {
    expect(titreDemarcheStatutIdFind(titreOctroiClasse)).toEqual('dmc')
  })

  test("le statut d'un titre dont l'unique démarche est un octroi retiré est “dmc”", () => {
    expect(titreDemarcheStatutIdFind(titreOctroiRetire)).toEqual('dmc')
  })

  test("le statut d'un titre avec une démarche en instruction est “mod”", () => {
    expect(titreDemarcheStatutIdFind(titreDemarcheInstruction)).toEqual('mod')
  })
})
