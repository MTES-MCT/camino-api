import titresTaxesUpdate from './titres-taxes-update'

import * as titreTaxesTypesFilter from '../utils/titre-activites-filter'
import * as titreTaxesQueries from '../../database/queries/titres-taxes'
import * as titreTaxesBuild from '../rules/titre-taxes-build'

import { titresTaxe } from './__mocks__/titres-taxes-update-titres'

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

    const log = await titresTaxesUpdate(titresTaxe, [])

    expect(log).toEqual('Mise à jour: 1 taxe(s) de titres.')

    expect(titreTaxesTypesFilter.default).toHaveBeenCalled()
    expect(titreTaxesBuild.default).toHaveBeenCalled()
    expect(titreTaxesQueries.titreTaxesUpsert).toHaveBeenCalled()
  })

  test('le titre ne correspond à aucun type de taxe', async () => {
    titreTaxesTypesFilter.default.mockImplementation(() => [])

    const log = await titresTaxesUpdate(titresTaxe, [])

    expect(log).toEqual('Mise à jour: 0 taxe(s) de titres.')

    expect(titreTaxesTypesFilter.default).toHaveBeenCalled()
    expect(titreTaxesBuild.default).not.toHaveBeenCalled()
    expect(titreTaxesQueries.titreTaxesUpsert).not.toHaveBeenCalled()
  })

  test('le titre ne possède pas de taxe affilié', async () => {
    titreTaxesTypesFilter.default.mockImplementation(() => [1])
    titreTaxesBuild.default.mockImplementation(() => [])

    const log = await titresTaxesUpdate(titresTaxe, [])

    expect(log).toEqual('Mise à jour: 0 taxe(s) de titres.')

    expect(titreTaxesTypesFilter.default).toHaveBeenCalled()
    expect(titreTaxesBuild.default).toHaveBeenCalled()
    expect(titreTaxesQueries.titreTaxesUpsert).not.toHaveBeenCalled()
  })
})
