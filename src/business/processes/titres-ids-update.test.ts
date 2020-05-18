import Titres from '../../database/models/titres'
import { ITitre } from '../../types'

import { mocked } from 'ts-jest/utils'

import {
  titresIdsUpdate,
  titreIdsUpdate,
  titreIdFindHashAdd
} from './titres-ids-update'

import titreIdAndRelationsUpdate from '../utils/titre-id-and-relations-update'
import { titreIdUpdate, titreGet } from '../../database/queries/titres'
import titreIdFind from '../utils/titre-id-find'
import { titreFichiersRename } from './titre-fichiers-rename'

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
const titreFichiersRenameMock = mocked(titreFichiersRename, true)

console.info = jest.fn()
console.error = jest.fn()

const titre = { id: 'id-old' } as ITitre

describe('ajoute un hash à une id de titre', () => {
  test('ajoute un hash à une id', async () => {
    titreIdFindMock.mockReturnValue('titre-id')
    const titreIdHashedFind = titreIdFindHashAdd('hash')
    const titreId = titreIdHashedFind({} as ITitre)

    expect(titreId).toEqual('titre-id-hash')
  })
})

describe("mise à jour de l'id d'un titre", () => {
  test('met à jour le titre si un id a changé', async () => {
    const id = 'id-new'

    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: true,
      titre: { id } as ITitre
    })

    const titresUpdatedIndex = await titreIdsUpdate(titre)
    const titreId = titresUpdatedIndex && Object.keys(titresUpdatedIndex)[0]

    expect(titreId).toEqual(id)

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalled()
  })

  test('met à jour les activités du titre si son id a changé', async () => {
    const id = 'id-new'

    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: true,
      titre: { id } as ITitre
    })

    const titresUpdatedIndex = await titreIdsUpdate(titre)
    const titreId = titresUpdatedIndex && Object.keys(titresUpdatedIndex)[0]

    expect(titreId).toEqual(id)

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalled()
  })

  test("ne met pas à jour le titre si aucun id n'a changé", async () => {
    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: false,
      titre
    })

    const titresUpdatedIndex = await titreIdsUpdate(titre)

    expect(titresUpdatedIndex).toBeNull()

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).not.toHaveBeenCalled()
    expect(console.info).not.toHaveBeenCalled()
  })
})

describe('id de plusieurs titres', () => {
  test('met à jour les titres si un id a changé', async () => {
    const id = 'id-new'

    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: true,
      titre: { id } as ITitre
    })

    const titresIdsUpdatedIndex = await titresIdsUpdate([titre])

    expect(Object.keys(titresIdsUpdatedIndex).length).toEqual(1)
    expect(titresIdsUpdatedIndex).toEqual({
      'id-new': 'id-old'
    })

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalled()
  })

  test('met à jour les démarches si leur id a changé', async () => {
    const id = 'id-new'

    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: true,
      titre: {
        id,
        demarches: [{ id: 'id-new' }]
      } as ITitre
    })

    const titresIdsUpdatedIndex = await titresIdsUpdate([
      { id, demarches: [{ id: 'id-old' }] }
    ] as ITitre[])

    expect(Object.keys(titresIdsUpdatedIndex).length).toEqual(1)
    expect(titresIdsUpdatedIndex).toEqual({ 'id-new': 'id-new' })

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalled()
  })

  test("ne met à jour aucun titre si aucun id n'a changé", async () => {
    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: false,
      titre
    })

    const titresIdsUpdatedIndex = await titresIdsUpdate([titre] as ITitre[])

    expect(Object.keys(titresIdsUpdatedIndex).length).toEqual(0)
    expect(titresIdsUpdatedIndex).toEqual({})

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).not.toHaveBeenCalled()
    expect(console.info).not.toHaveBeenCalled()
  })

  test("ajoute un hash dans l'id si le titre est en doublon", async () => {
    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: true,
      titre: {
        id: 'id-new'
      } as ITitre
    })
    titreGetMock.mockResolvedValue({ id: 'id-new' } as Titres)
    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: true,
      titre: {
        id: 'id-new-hash',
        doublonTitreId: 'id-new'
      } as ITitre
    })

    const titresIdsUpdatedIndex = await titresIdsUpdate([titre] as ITitre[])

    expect(titresIdsUpdatedIndex).toEqual({ 'id-new-hash': 'id-old' })

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalledTimes(1)
  })

  test("utilise un hash déjà existant dans l'id si le titre est en doublon", async () => {
    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: true,
      titre: {
        id: 'id-old',
        doublonTitreId: 'id-old'
      } as ITitre
    })
    titreGetMock.mockResolvedValue(titre as Titres)
    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: true,
      titre: {
        id: 'id-old-hashhash',
        doublonTitreId: 'id-old'
      } as ITitre
    })

    const titresIdsUpdatedIndex = await titresIdsUpdate([
      { id: 'id-old-hashhash', doublonTitreId: 'id-old' }
    ] as ITitre[])

    expect(titresIdsUpdatedIndex).toEqual({
      'id-old-hashhash': 'id-old-hashhash'
    })

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalledTimes(1)
  })

  test("supprime le hash dans l'id si le titre n'est plus en doublon", async () => {
    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: true,
      titre: {
        id: 'id-old',
        doublonTitreId: 'id-old'
      } as ITitre
    })
    titreGetMock.mockResolvedValue((null as unknown) as Titres)

    const titresIdsUpdatedIndex = await titresIdsUpdate([
      { id: 'id-old-hashhash', doublonTitreId: 'id-old' }
    ] as ITitre[])

    expect(titresIdsUpdatedIndex).toEqual({
      'id-old': 'id-old-hashhash'
    })

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalledTimes(1)
  })

  test('continue le processus si le renommage de fichiers retourne une erreur', async () => {
    const id = 'id-new-fichier'

    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: true,
      titre: { id } as ITitre
    })
    titreFichiersRenameMock.mockRejectedValue(new Error('bim !'))

    const titresIdsUpdatedIndex = await titresIdsUpdate([
      { id, demarches: [{ id: 'id-old' }] }
    ] as ITitre[])

    expect(Object.keys(titresIdsUpdatedIndex).length).toEqual(1)
    expect(titresIdsUpdatedIndex).toEqual({ 'id-new-fichier': 'id-new-fichier' })

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalled()
  })

  test('retourne une erreur si la base de données retourne une erreur', async () => {
    const id = 'id-new'

    titreIdAndRelationsUpdateMock.mockReturnValue({
      hasChanged: true,
      titre: { id } as ITitre
    })
    titreIdUpdateMock.mockRejectedValue(new Error('bim !'))

    const titresIdsUpdatedIndex = await titresIdsUpdate([titre])

    expect(Object.keys(titresIdsUpdatedIndex).length).toEqual(0)
    expect(titresIdsUpdatedIndex).toEqual({})

    expect(titreIdAndRelationsUpdate).toHaveBeenCalled()
    expect(titreIdUpdateMock).toHaveBeenCalled()
    expect(console.info).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledTimes(2)
  })
})
