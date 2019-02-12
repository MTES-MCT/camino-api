import titreDemarcheStatutIdFind from './titre-statut-id-find'
import {
  titreValide,
  titreEchu,
  titreOctroiDepose,
  titreOctroiRejete,
  titreDemarcheInstruction
} from './__mocks__/titres-statut-id-find'

test("retourne le statut d'un titre valide", () => {
  expect(titreDemarcheStatutIdFind(titreValide)).toEqual('val')
})

test("retourne le statut d'un titre échu", () => {
  expect(titreDemarcheStatutIdFind(titreEchu)).toEqual('ech')
})

test("retourne le statut d'un titre dont l'octroi a été déposé", () => {
  expect(titreDemarcheStatutIdFind(titreOctroiDepose)).toEqual('dmi')
})

test("retourne le statut d'un titre dont l'octroi a été rejeté", () => {
  expect(titreDemarcheStatutIdFind(titreOctroiRejete)).toEqual('dmc')
})

test("retourne le statut d'un titre dont une démarche est en instruction", () => {
  expect(titreDemarcheStatutIdFind(titreDemarcheInstruction)).toEqual('mod')
})
