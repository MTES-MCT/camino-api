import Titres from '../../database/models/titres'
import { ITitres } from '../../types'

import { mocked } from 'ts-jest/utils'

import {
  titresIdsUpdate,
  titreIdsUpdate,
  titreIdFindHashAdd
} from './titres-ids-update'

import titreIdAndRelationsUpdate from '../utils/titre-id-and-relations-update'
import { titreIdUpdate, titreGet } from '../../database/queries/titres'
import titreIdFind from '../utils/titre-id-find'

jest.mock('../utils/titre-id-and-relations-update', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('./titre-fichiers-rename', () => ({
  titreFichiersRename: jest.fn()
}))

jest.mock('../utils/titre-id-find', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('../../database/queries/titres', () => ({
  __esModule: true,
  titreIdUpdate: jest.fn().mockResolvedValue(true),
  titreGet: jest.fn().mockResolvedValue(true)
}))

const titreIdAndRelationsUpdateMock = mocked(titreIdAndRelationsUpdate, true)
const titreGetMock = mocked(titreGet, true)
const titreIdUpdateMock = mocked(titreIdUpdate, true)
const titreIdFindMock = mocked(titreIdFind, true)

console.log = jest.fn()
console.error = jest.fn()

const titre = { id: 'id-old' } as ITitres

describe('ajoute un hash à une id de titre', () => {
  test('ajoute un hash à une id', async () => {
    titreIdFindMock.mockReturnValue('titre-id')
    const titreIdHashedFind = titreIdFindHashAdd('hash')
    const titreId = titreIdHashedFind({} as ITitres)

    expect(titreId).toEqual('titre-id-hash')
  })
})

describe("mise à jour de l'id d'un titre", () => {
  test('met à jour le titre si un id a changé', async () => {
    const id = 'id-new'

    titreIdAndRelationsUpdateMock.mockReturnValue({ id })

    const titresUpdatedIndex = await titreIdsUpdate(titre)
    const titreId = titresUpdatedIndex && Object.keys(titresUpdatedIndex)[0]

    expect(titreId).toEqual(id)

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test('met à jour les activités du titre si son id a changé', async () => {
    const id = 'id-new'

    titreIdAndRelationsUpdateMock.mockReturnValue({ id, activites: [1] })

    const titresUpdatedIndex = await titreIdsUpdate(titre)
    const titreId = titresUpdatedIndex && Object.keys(titresUpdatedIndex)[0]

    expect(titreId).toEqual(id)

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test("ne met pas à jour le titre si aucun id n'a changé", async () => {
    titreIdAndRelationsUpdateMock.mockReturnValue(null)

    const titresUpdatedIndex = await titreIdsUpdate(titre)

    expect(titresUpdatedIndex).toBeNull()

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})

describe('id de plusieurs titres', () => {
  test('met à jour les titres si un id a changé', async () => {
    const id = 'id-new'

    titreIdAndRelationsUpdateMock.mockReturnValue({
      id,
      activites: [1]
    })

    const titresIdsUpdatedIndex = await titresIdsUpdate([titre])

    expect(Object.keys(titresIdsUpdatedIndex).length).toEqual(1)
    expect(titresIdsUpdatedIndex).toEqual({
      'id-new': 'id-old'
    })

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test('met à jour les démarches si leur id a changé', async () => {
    const id = 'id-new'

    titreIdAndRelationsUpdateMock.mockReturnValue({
      id,
      demarches: [{ id: 'id-new' }]
    })

    const titresIdsUpdatedIndex = await titresIdsUpdate([
      { id, demarches: [{ id: 'id-old' }] }
    ] as ITitres[])

    expect(Object.keys(titresIdsUpdatedIndex).length).toEqual(1)
    expect(titresIdsUpdatedIndex).toEqual({ 'id-new': 'id-new' })

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalled()
  })

  test("ne met à jour aucun titre si aucun id n'a changé", async () => {
    titreIdAndRelationsUpdateMock.mockReturnValue(null)

    const titresIdsUpdatedIndex = await titresIdsUpdate([titre] as ITitres[])

    expect(Object.keys(titresIdsUpdatedIndex).length).toEqual(0)
    expect(titresIdsUpdatedIndex).toEqual({})

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })

  test("ajoute un hash dans l'id si le titre est en doublon", async () => {
    titreIdAndRelationsUpdateMock.mockReturnValue({
      id: 'id-new'
    })
    titreGetMock.mockResolvedValue({ id: 'id-new' } as Titres)
    titreIdAndRelationsUpdateMock.mockReturnValue({
      id: 'id-new-hash',
      doublonTitreId: 'id-new'
    })

    const titresIdsUpdatedIndex = await titresIdsUpdate([titre] as ITitres[])

    expect(titresIdsUpdatedIndex).toEqual({ 'id-new-hash': 'id-old' })

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledTimes(1)
  })

  test("utilise un hash déjà existant dans l'id si le titre est en doublon", async () => {
    titreIdAndRelationsUpdateMock.mockReturnValue({
      id: 'id-old',
      doublonTitreId: 'id-old'
    })
    titreGetMock.mockResolvedValue(titre as Titres)
    titreIdAndRelationsUpdateMock.mockReturnValue({
      id: 'id-old-hashhash',
      doublonTitreId: 'id-old'
    })

    const titresIdsUpdatedIndex = await titresIdsUpdate([
      { id: 'id-old-hashhash', doublonTitreId: 'id-old' }
    ] as ITitres[])

    expect(titresIdsUpdatedIndex).toEqual({
      'id-old-hashhash': 'id-old-hashhash'
    })

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledTimes(1)
  })

  test("supprime le hash dans l'id si le titre n'est plus en doublon", async () => {
    titreIdAndRelationsUpdateMock.mockReturnValue({
      id: 'id-old',
      doublonTitreId: 'id-old'
    })
    titreGetMock.mockResolvedValue((null as unknown) as Titres)

    const titresIdsUpdatedIndex = await titresIdsUpdate([
      { id: 'id-old-hashhash', doublonTitreId: 'id-old' }
    ] as ITitres[])

    expect(titresIdsUpdatedIndex).toEqual({
      'id-old': 'id-old-hashhash'
    })

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledTimes(1)
  })

  test('retourne une erreur si la base de données retourne une erreur', async () => {
    const id = 'id-new'

    titreIdAndRelationsUpdateMock.mockReturnValue({ id })
    titreIdUpdateMock.mockRejectedValue(new Error('bim !'))

    const titresIdsUpdatedIndex = await titresIdsUpdate([titre])

    expect(Object.keys(titresIdsUpdatedIndex).length).toEqual(0)
    expect(titresIdsUpdatedIndex).toEqual({})

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledTimes(2)
  })
})
