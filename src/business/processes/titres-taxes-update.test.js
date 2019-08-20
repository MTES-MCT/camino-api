import titresTaxesUpdate from './titres-taxes-update'

import * as titreTaxesTypesFilter from '../utils/titre-activites-filter'
import * as titreTaxesQueries from '../../database/queries/titres-taxes'
import * as titreTaxesBuild from '../rules/titre-taxes-build'

import { titresToutesActivites } from './__mocks__/titres-activites-update-titres'

jest.mock('../utils/titre-activites-filter', () => ({
  default: jest.fn()
}))

jest.mock('../../database/queries/titres-taxes', () => ({
  titreTaxesUpsert: jest.fn().mockResolvedValue()
}))

jest.mock('../rules/titre-taxes-build', () => ({
  default: jest.fn().mockResolvedValue()
}))

describe("ajout de la taxe d'un titre", () => {
  test('met à jour un titre', async () => {
    titreTaxesTypesFilter.default.mockImplementation(() => [1])
    titreTaxesBuild.default.mockImplementation(() => [1])

    const log = await titresTaxesUpdate(titresToutesActivites, [])

    expect(log).toEqual('Mise à jour: 1 taxe(s) de titres.')

    expect(titreTaxesTypesFilter.default).toHaveBeenCalled()
    expect(titreTaxesQueries.titreTaxesUpsert).toHaveBeenCalled()
    expect(titreTaxesBuild.default).toHaveBeenCalled()
  })
})
