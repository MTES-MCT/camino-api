import { titresIdsUpdate, titreIdsUpdate } from './titres-ids-update'

import * as titreIdAndRelationsUpdate from '../utils/titre-id-and-relations-update'
import * as titresQueries from '../../database/queries/titres'

jest.mock('../utils/titre-id-and-relations-update', () => ({
  default: jest.fn()
}))

jest.mock('../../database/queries/titres', () => ({
  titreIdUpdate: jest.fn().mockResolvedValue()
}))

console.log = jest.fn()
console.error = jest.fn()

describe("id d'un titre", () => {
  test('met à jour le titre si un id a changé', async () => {
    const id = 'id-new'

    titreIdAndRelationsUpdate.default.mockImplementation(() => ({
      titreNew: {
        id
      },
      hasChanged: true
    }))

    const titresUpdated = await titreIdsUpdate({
      id: 'id-old'
    })

    expect(titresUpdated.id).toEqual(id)

    expect(titreIdAndRelationsUpdate.default).toHaveBeenCalled()
    expect(titresQueries.titreIdUpdate).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test('met à jour les activités du titre si son id a changé', async () => {
    const id = 'id-new'

    titreIdAndRelationsUpdate.default.mockImplementation(() => ({
      titreNew: {
        id,
        activites: [1]
      },
      hasChanged: true
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

    titreIdAndRelationsUpdate.default.mockImplementation(() => ({
      titreNew: {
        id
      },
      hasChanged: false
    }))

    const titresUpdated = await titreIdsUpdate({
      id
    })

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
      titreNew: {
        id,
        activites: [1]
      },
      hasChanged: true
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
      titreNew: {
        id,
        demarches: [
          {
            id: 'id-new'
          }
        ]
      },
      hasChanged: true
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

  test('retourne une erreur si la base de données retourne une erreur', async () => {
    const id = 'id-new'

    titreIdAndRelationsUpdate.default.mockImplementation(() => ({
      titreNew: {
        id,
        activites: [1]
      },
      hasChanged: true
    }))
    titresQueries.titreIdUpdate.mockRejectedValue(new Error('bim !'))

    const { titresUpdated, titresUpdatedIdsIndex } = await titresIdsUpdate([
      {
        id: 'id-old'
      }
    ])

    expect(titresUpdated.length).toEqual(0)
    expect(titresUpdatedIdsIndex).toEqual({
      'id-new': 'id-old'
    })

    expect(titreIdAndRelationsUpdate.default).toHaveBeenCalled()
    expect(titresQueries.titreIdUpdate).toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledTimes(2)
  })

  test("ne met à jour aucun titre si aucun id n'a changé", async () => {
    const id = 'id-old'

    titreIdAndRelationsUpdate.default.mockImplementation(() => ({
      titreNew: {
        id
      },
      hasChanged: false
    }))

    const { titresUpdated, titresUpdatedIdsIndex } = await titresIdsUpdate([
      {
        id
      }
    ])

    expect(titresUpdated.length).toEqual(0)
    expect(titresUpdatedIdsIndex).toEqual({})

    expect(titreIdAndRelationsUpdate.default).toHaveBeenCalled()
    expect(titresQueries.titreIdUpdate).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})
