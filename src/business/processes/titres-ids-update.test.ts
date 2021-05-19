import { mocked } from 'ts-jest/utils'

import { ITitre } from '../../types'

import Titres from '../../database/models/titres'
import { titresIdsUpdate } from './titres-ids-update'

import titreIdAndRelationsUpdate from '../utils/titre-id-and-relations-update'
import {
  titreIdUpdate,
  titreGet,
  titresGet
} from '../../database/queries/titres'
import { titreFilePathsRename } from './titre-fichiers-rename'

jest.mock('../utils/titre-id-and-relations-update', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('./titre-fichiers-rename', () => ({
  titreFilePathsRename: jest.fn()
}))

jest.mock('../../database/queries/titres', () => ({
  __esModule: true,
  titreIdUpdate: jest.fn().mockResolvedValue(true),
  titreGet: jest.fn().mockResolvedValue(true),
  titresGet: jest.fn().mockResolvedValue(true)
}))

const titresGetMock = mocked(titresGet, true)
const titreIdAndRelationsUpdateMock = mocked(titreIdAndRelationsUpdate, true)
const titreGetMock = mocked(titreGet, true)
const titreIdUpdateMock = mocked(titreIdUpdate, true)
const titreFilePathsRenameMock = mocked(titreFilePathsRename, true)

console.info = jest.fn()
console.error = jest.fn()

const titre = { id: 'id-old' } as Titres

const relationsIdsUpdatedIndex = {}

describe("mise à jour de l'id d'un titre", () => {
  test('met à jour le titre si un id a changé', async () => {
    const id = 'id-new'

    titresGetMock.mockResolvedValue([titre])
    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: true,
      titre: { id } as ITitre,
      relationsIdsUpdatedIndex
    })

    const titresUpdatedIndex = await titresIdsUpdate()
    const titreId = titresUpdatedIndex && Object.keys(titresUpdatedIndex)[0]

    expect(titreId).toEqual(id)

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
  })

  test('met à jour les activités du titre si son id a changé', async () => {
    const id = 'id-new'

    titresGetMock.mockResolvedValue([titre])
    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: true,
      titre: { id } as ITitre,
      relationsIdsUpdatedIndex
    })

    const titresUpdatedIndex = await titresIdsUpdate()
    const titreId = titresUpdatedIndex && Object.keys(titresUpdatedIndex)[0]

    expect(titreId).toEqual(id)

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
  })

  test("ne met pas à jour le titre si aucun id n'a changé", async () => {
    titresGetMock.mockResolvedValue([titre])
    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: false,
      titre,
      relationsIdsUpdatedIndex
    })

    const titresUpdatedIndex = await titresIdsUpdate()

    expect(titresUpdatedIndex).toEqual({})

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).not.toHaveBeenCalled()
  })
})

describe('id de plusieurs titres', () => {
  test('met à jour les titres si un id a changé', async () => {
    const id = 'id-new'

    titresGetMock.mockResolvedValue([titre])
    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: true,
      titre: { id } as ITitre,
      relationsIdsUpdatedIndex
    })

    const titresIdsUpdatedIndex = await titresIdsUpdate()

    expect(Object.keys(titresIdsUpdatedIndex).length).toEqual(1)
    expect(titresIdsUpdatedIndex).toEqual({
      'id-new': 'id-old'
    })

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
  })

  test('met à jour les démarches si leur id a changé', async () => {
    const id = 'id-new'

    titresGetMock.mockResolvedValue([
      { id, demarches: [{ id: 'id-old' }] } as Titres
    ])
    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: true,
      titre: {
        id,
        demarches: [{ id: 'id-new' }]
      } as ITitre,
      relationsIdsUpdatedIndex
    })

    const titresIdsUpdatedIndex = await titresIdsUpdate()

    expect(Object.keys(titresIdsUpdatedIndex).length).toEqual(1)
    expect(titresIdsUpdatedIndex).toEqual({ 'id-new': 'id-new' })

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
  })

  test("ne met à jour aucun titre si aucun id n'a changé", async () => {
    titresGetMock.mockResolvedValue([titre])
    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: false,
      titre,
      relationsIdsUpdatedIndex
    })

    const titresIdsUpdatedIndex = await titresIdsUpdate()

    expect(Object.keys(titresIdsUpdatedIndex).length).toEqual(0)
    expect(titresIdsUpdatedIndex).toEqual({})

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).not.toHaveBeenCalled()
  })

  test("ajoute un hash dans l'id si le titre est en doublon", async () => {
    titresGetMock.mockResolvedValueOnce([titre])
    titreIdAndRelationsUpdateMock.mockReturnValueOnce({
      hasChanged: true,
      titre: {
        id: 'id-new'
      } as ITitre,
      relationsIdsUpdatedIndex
    })
    titreGetMock.mockResolvedValueOnce({ id: 'id-new' } as Titres)
    titreIdAndRelationsUpdateMock.mockReturnValueOnce({
      hasChanged: true,
      titre: {
        id: 'id-new-hash',
        doublonTitreId: 'id-new'
      } as ITitre,
      relationsIdsUpdatedIndex
    })

    const titresIdsUpdatedIndex = await titresIdsUpdate()

    expect(titresIdsUpdatedIndex).toEqual({ 'id-new-hash': 'id-old' })

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
  })

  test("ne met pas à jour un titre si le titre est en doublon et qu'il a déjà un hash existant dans l'id ", async () => {
    titresGetMock.mockResolvedValueOnce([
      { id: 'id-old-hashhash', doublonTitreId: 'id-old' } as Titres
    ])
    titreIdAndRelationsUpdateMock.mockReturnValueOnce({
      hasChanged: true,
      titre: {
        id: 'id-old',
        doublonTitreId: 'id-old'
      } as ITitre,
      relationsIdsUpdatedIndex
    })
    titreGetMock.mockResolvedValueOnce(titre as Titres)
    titreIdAndRelationsUpdateMock.mockReturnValueOnce({
      hasChanged: true,
      titre: {
        id: 'id-old-hashhash',
        doublonTitreId: 'id-old'
      } as ITitre,
      relationsIdsUpdatedIndex
    })

    const titresIdsUpdatedIndex = await titresIdsUpdate()

    expect(titresIdsUpdatedIndex).toEqual({})

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
  })

  test("supprime le hash dans l'id si le titre n'est plus en doublon", async () => {
    titresGetMock.mockResolvedValue([
      { id: 'id-old-hashhash', doublonTitreId: 'id-old' } as Titres
    ])
    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: true,
      titre: {
        id: 'id-old',
        doublonTitreId: 'id-old'
      } as ITitre,
      relationsIdsUpdatedIndex
    })
    titreGetMock.mockResolvedValue(null as unknown as Titres)

    const titresIdsUpdatedIndex = await titresIdsUpdate()

    expect(titresIdsUpdatedIndex).toEqual({
      'id-old': 'id-old-hashhash'
    })

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
  })

  test('continue le processus si le renommage de fichiers retourne une erreur', async () => {
    const id = 'id-new-fichier'
    titresGetMock.mockResolvedValue([
      { id, demarches: [{ id: 'id-old' }] } as Titres
    ])
    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: true,
      titre: { id } as ITitre,
      relationsIdsUpdatedIndex
    })
    titreFilePathsRenameMock.mockRejectedValue(new Error('bim !'))

    const titresIdsUpdatedIndex = await titresIdsUpdate()

    expect(Object.keys(titresIdsUpdatedIndex).length).toEqual(1)
    expect(titresIdsUpdatedIndex).toEqual({
      'id-new-fichier': 'id-new-fichier'
    })

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalled()
  })

  test('retourne une erreur si la base de données retourne une erreur', async () => {
    titresGetMock.mockResolvedValue([titre])
    const id = 'id-new'

    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: true,
      titre: { id } as ITitre,
      relationsIdsUpdatedIndex
    })
    titreIdUpdateMock.mockRejectedValue(new Error('bim !'))

    const titresIdsUpdatedIndex = await titresIdsUpdate()

    expect(Object.keys(titresIdsUpdatedIndex).length).toEqual(0)
    expect(titresIdsUpdatedIndex).toEqual({})

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledTimes(1)
  })
})
