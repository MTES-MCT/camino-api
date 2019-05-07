import titreEtapeIdUpdate from './titre-etape-id-update'

import * as titreEtapesQueries from '../queries/titre-etapes'
import * as titreEtapesByTypeUpdate from '../utils/titre-etapes-by-type-update'

import {
  titreEtapeNoChange,
  titreEtapeChanged,
  titreWithDemarchesNoChange,
  titreWithDemarchesChanged
} from './__mocks__/titre-etape-id-update-etapes'

jest.mock('../queries/titres', () => ({
  titrePropsUpdate: jest.fn().mockImplementation(titre => {}),
  calculatedProps: ['titulaires']
}))

jest.mock('../queries/titre-etapes', () => ({
  titreEtapesIdsUpdate: jest.fn().mockImplementation(titreEtapes => titreEtapes)
}))

jest.mock('../utils/titre-etapes-by-type-update', () => ({
  default: jest.fn()
}))

describe("change l'id de l'étape d'un titre", () => {
  test("une étape dont le type n'a pas changé n'est pas mise à jour", async () => {
    const updateSpy = jest
      .spyOn(titreEtapesByTypeUpdate, 'default')
      .mockImplementation(() => ({
        titreEtapesOldIds: [],
        titreEtapesNew: [],
        titreProps: {}
      }))

    expect(
      await titreEtapeIdUpdate(titreEtapeNoChange, titreWithDemarchesNoChange)
    ).toEqual([
      "Mise à jour: 0 id d'étapes.",
      'Mise à jour: 0 propriétés de titres.'
    ])

    expect(updateSpy).toHaveBeenCalledTimes(1)
  })

  test("les étapes de l'ancien type de l'étape sont aussi mises à jour", async () => {
    const updateSpy = jest
      .spyOn(titreEtapesByTypeUpdate, 'default')
      .mockImplementation(titreEtapes => ({
        titreEtapesOldIds: titreEtapes.map(t => t.id),
        titreEtapesNew: titreEtapes,
        titreProps: { titulairesTitreEtapeId: 'test' }
      }))

    expect(
      await titreEtapeIdUpdate(titreEtapeChanged, titreWithDemarchesChanged)
    ).toEqual([
      "Mise à jour: 2 id d'étapes.",
      'Mise à jour: 1 propriétés de titres.'
    ])

    expect(updateSpy).toHaveBeenCalledTimes(1)
  })
})
