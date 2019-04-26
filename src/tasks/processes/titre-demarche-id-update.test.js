import titreDemarcheIdUpdate from './titre-demarche-id-update'

import * as titreQueries from '../queries/titres'
import * as titreDemarchesQueries from '../queries/titre-demarches'
import * as titreDemarchesByTypeUpdate from '../utils/titre-demarches-by-type-update'

import {
  titreDemarcheNoChange,
  titreDemarcheChanged,
  titreWithDemarchesNoChange,
  titreWithDemarchesChanged
} from './__mocks__/titre-demarche-id-update-demarches'

jest.mock('../queries/titres', () => ({
  titrePropsUpdate: jest.fn().mockImplementation(titre => {}),
  calculatedProps: ['titulaires']
}))
jest.mock('../queries/titre-demarches', () => ({
  titreDemarchesIdsUpdate: jest
    .fn()
    .mockImplementation(titreDemarches => titreDemarches)
}))
jest.mock('../utils/titre-demarches-by-type-update', () => ({
  default: jest.fn().mockImplementation(titreDemarches => ({
    titreDemarchesOldIds: titreDemarches.map(t => t.id),
    titreDemarchesNew: titreDemarches,
    titreProps: titreDemarches.reduce((acc, d) => ((acc[d.id] = true), acc), {})
  }))
}))

describe("change l'id de la démarche d'un titre", () => {
  test("une démarche dont le type n'a pas changé n'est pas mise à jour", async () => {
    const updateSpy = jest.spyOn(
      titreDemarchesQueries,
      'titreDemarchesIdsUpdate'
    )

    expect(
      await titreDemarcheIdUpdate(
        titreDemarcheNoChange,
        titreWithDemarchesNoChange
      )
    ).toEqual([
      'Mise à jour: 0 id de démarches.',
      'Mise à jour: 0 propriétés de titres.'
    ])

    expect(updateSpy).not.toHaveBeenCalled()
  })

  test('une démarche dont le type a changé est mise à jour', async () => {
    const updateSpy = jest.spyOn(
      titreDemarchesQueries,
      'titreDemarchesIdsUpdate'
    )

    expect(
      await titreDemarcheIdUpdate(
        titreDemarcheChanged,
        titreWithDemarchesChanged
      )
    ).toEqual([
      'Mise à jour: 1 id de démarches.',
      'Mise à jour: 1 propriétés de titres.'
    ])

    expect(updateSpy).toHaveBeenCalledTimes(1)
  })
})
