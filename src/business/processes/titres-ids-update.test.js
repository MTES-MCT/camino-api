import { titresIdsUpdate, titreIdsUpdate } from './titres-ids-update'

import * as titreIdAndRelationsUpdate from '../utils/titre-id-and-relations-update'
import * as titresQueries from '../../database/queries/titres'

jest.mock('../utils/titre-id-and-relations-update', () => ({
  default: jest.fn()
}))

jest.mock('../../database/queries/titres', () => ({
  titreIdUpdate: jest.fn().mockResolvedValue(),
  titreGet: jest.fn().mockResolvedValue()
}))

console.log = jest.fn()
console.error = jest.fn()

describe("mise à jour de l'id d'un titre", () => {
  test('met à jour le titre si un id a changé', async () => {
    const id = 'id-new'

    titreIdAndRelationsUpdate.default.mockImplementation(() => ({ id }))

    const titresUpdated = await titreIdsUpdate({ id: 'id-old' })

    expect(titresUpdated.id).toEqual(id)

    expect(titreIdAndRelationsUpdate.default).toHaveBeenCalled()
    expect(titresQueries.titreIdUpdate).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test('met à jour les activités du titre si son id a changé', async () => {
    const id = 'id-new'

    titreIdAndRelationsUpdate.default.mockImplementation(() => ({
      id,
      activites: [1]
    }))

    const titresUpdated = await titreIdsUpdate({
      id: 'id-old'
    })

    expect(titresUpdated.id).toEqual(id)

    expect(titreIdAndRelationsUpdate.default).toHaveBeenCalled()
    expect(titresQueries.titreIdUpdate).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test("ne met pas à jour le titre si aucun id n'a changé", async () => {
    const id = 'id-old'

    titreIdAndRelationsUpdate.default.mockImplementation(() => null)

    const titresUpdated = await titreIdsUpdate({ id })

    expect(titresUpdated).toBeNull()

    expect(titreIdAndRelationsUpdate.default).toHaveBeenCalled()
    expect(titresQueries.titreIdUpdate).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})

describe('id de plusieurs titres', () => {
  test('met à jour les titres si un id a changé', async () => {
    const id = 'id-new'

    titreIdAndRelationsUpdate.default.mockImplementation(() => ({
      id,
      activites: [1]
    }))

    const { titresUpdated, titresUpdatedIdsIndex } = await titresIdsUpdate([
      {
        id: 'id-old'
      }
    ])

    expect(titresUpdated.length).toEqual(1)
    expect(titresUpdatedIdsIndex).toEqual({
      'id-new': 'id-old'
    })

    expect(titreIdAndRelationsUpdate.default).toHaveBeenCalled()
    expect(titresQueries.titreIdUpdate).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test('met à jour les démarches si leur id a changé', async () => {
    const id = 'id-new'

    titreIdAndRelationsUpdate.default.mockImplementation(() => ({
      id,
      demarches: [{ id: 'id-new' }]
    }))

    const { titresUpdated, titresUpdatedIdsIndex } = await titresIdsUpdate([
      {
        id,
        demarches: [
          {
            id: 'id-old'
          }
        ]
      }
    ])

    expect(titresUpdated.length).toEqual(1)
    expect(titresUpdatedIdsIndex).toEqual({})

    expect(titreIdAndRelationsUpdate.default).toHaveBeenCalled()
    expect(titresQueries.titreIdUpdate).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test("ne met à jour aucun titre si aucun id n'a changé", async () => {
    const id = 'id-old'

    titreIdAndRelationsUpdate.default.mockImplementation(() => null)

    const { titresUpdated, titresUpdatedIdsIndex } = await titresIdsUpdate([
      { id }
    ])

    expect(titresUpdated.length).toEqual(0)
    expect(titresUpdatedIdsIndex).toEqual({})

    expect(titreIdAndRelationsUpdate.default).toHaveBeenCalled()
    expect(titresQueries.titreIdUpdate).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })

  test("ajoute un hash dans l'id si le titre est en doublon", async () => {
    const id = 'id-old'

    titreIdAndRelationsUpdate.default.mockImplementationOnce(() => ({
      id: 'id-new'
    }))
    titresQueries.titreGet.mockImplementation(() => ({ id: 'id-new' }))
    titreIdAndRelationsUpdate.default.mockImplementationOnce(() => ({
      id: 'id-new-hash',
      doublonTitreId: 'id-new'
    }))

    const { titresUpdated, titresUpdatedIdsIndex } = await titresIdsUpdate([
      { id }
    ])

    expect(titresUpdated).toEqual([
      { doublonTitreId: 'id-new', id: 'id-new-hash' }
    ])
    expect(titresUpdatedIdsIndex).toEqual({ 'id-new-hash': 'id-old' })

    expect(titreIdAndRelationsUpdate.default).toHaveBeenCalled()
    expect(titresQueries.titreIdUpdate).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledTimes(1)
  })

  test("utilise un hash déjà existant dans l'id si le titre est en doublon", async () => {
    titreIdAndRelationsUpdate.default.mockImplementationOnce(() => ({
      id: 'id-old',
      doublonTitreId: 'id-old'
    }))
    titresQueries.titreGet.mockImplementation(() => ({ id: 'id-old' }))
    titreIdAndRelationsUpdate.default.mockImplementationOnce(() => ({
      id: 'id-old-hashhash',
      doublonTitreId: 'id-old'
    }))

    const { titresUpdated, titresUpdatedIdsIndex } = await titresIdsUpdate([
      { id: 'id-old-hashhash', doublonTitreId: 'id-old' }
    ])

    expect(titresUpdated).toEqual([
      { id: 'id-old-hashhash', doublonTitreId: 'id-old' }
    ])
    expect(titresUpdatedIdsIndex).toEqual({})

    expect(titreIdAndRelationsUpdate.default).toHaveBeenCalled()
    expect(titresQueries.titreIdUpdate).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledTimes(1)
  })

  test('retourne une erreur si la base de données retourne une erreur', async () => {
    const id = 'id-new'

    titreIdAndRelationsUpdate.default.mockImplementation(() => ({ id }))
    titresQueries.titreIdUpdate.mockRejectedValue(new Error('bim !'))

    const { titresUpdated, titresUpdatedIdsIndex } = await titresIdsUpdate([
      { id: 'id-old' }
    ])

    expect(titresUpdated.length).toEqual(0)
    expect(titresUpdatedIdsIndex).toEqual({})

    expect(titreIdAndRelationsUpdate.default).toHaveBeenCalled()
    expect(titresQueries.titreIdUpdate).toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledTimes(2)
  })
})
