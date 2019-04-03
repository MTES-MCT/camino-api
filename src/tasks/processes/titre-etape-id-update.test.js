import titreEtapeIdUpdate from './titre-etape-id-update'

import * as titreQueries from '../queries/titres'
import * as titreEtapesQueries from '../queries/titre-etapes'

import {
  titreEtapeNoChange,
  titreEtapeChanged,
  titreWithDemarchesNoChange,
  titreWithDemarchesChanged,
  titreWith2Dpu,
  titreWithTitulaire,
  titreWithSubElement
} from './__mocks__/titre-etape-id-update-etapes'

jest.mock('../queries/titres', () => ({
  titrePropsUpdate: jest.fn().mockImplementation(titre => {}),
  calculatedProps: ['titulaires']
}))
jest.mock('../queries/titre-etapes', () => ({
  titreEtapesUpdateAll: jest.fn().mockImplementation(titreEtapes => {})
}))

console.log = jest.fn()

describe("change l'id de l'étape d'un titre", () => {
  test("une étape dont le type n'a pas changé n'est pas mise à jour", async () => {
    const updateSpy = jest.spyOn(titreEtapesQueries, 'titreEtapesUpdateAll')

    expect(
      await titreEtapeIdUpdate(titreEtapeNoChange, titreWithDemarchesNoChange)
    ).toEqual([
      "Mise à jour: 0 id d'étapes.",
      'Mise à jour: 0 propriétés de titres.'
    ])

    expect(updateSpy).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledTimes(0)
  })

  test('une étape dont le type a changé est mise à jour', async () => {
    const updateSpy = jest.spyOn(titreEtapesQueries, 'titreEtapesUpdateAll')

    expect(
      await titreEtapeIdUpdate(titreEtapeChanged, titreWithDemarchesChanged)
    ).toEqual([
      "Mise à jour: 1 id d'étapes.",
      'Mise à jour: 0 propriétés de titres.'
    ])

    expect(updateSpy).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledTimes(0)
  })

  test("une étape dont l'ordre a changé est mise à jour", async () => {
    const updateSpy = jest.spyOn(titreEtapesQueries, 'titreEtapesUpdateAll')

    expect(await titreEtapeIdUpdate(titreEtapeChanged, titreWith2Dpu)).toEqual([
      "Mise à jour: 1 id d'étapes.",
      'Mise à jour: 0 propriétés de titres.'
    ])

    expect(updateSpy).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledTimes(0)
  })

  test("la propriété calculée d'un titre est mise à jour si l'id de l'étape a changé", async () => {
    const updateSpy = jest.spyOn(titreEtapesQueries, 'titreEtapesUpdateAll')

    expect(
      await titreEtapeIdUpdate(titreEtapeChanged, titreWithTitulaire)
    ).toEqual([
      "Mise à jour: 1 id d'étapes.",
      'Mise à jour: 1 propriétés de titres.'
    ])

    expect(updateSpy).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledTimes(0)
  })

  test("la propriété d'un sous-élément d'une étape est mise à jour", async () => {
    const updateSpy = jest.spyOn(titreEtapesQueries, 'titreEtapesUpdateAll')

    expect(
      await titreEtapeIdUpdate(titreEtapeChanged, titreWithSubElement)
    ).toEqual([
      "Mise à jour: 1 id d'étapes.",
      'Mise à jour: 0 propriétés de titres.'
    ])

    expect(updateSpy).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledTimes(0)
  })
})
