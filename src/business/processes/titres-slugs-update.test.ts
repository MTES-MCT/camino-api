import { mocked } from 'ts-jest/utils'

import Titres from '../../database/models/titres'
import { titresSlugsUpdate } from './titres-slugs-update'

import { titreSlugAndRelationsUpdate } from '../utils/titre-slug-and-relations-update'
import { titresGet } from '../../database/queries/titres'

jest.mock('../utils/titre-slug-and-relations-update', () => ({
  __esModule: true,
  titreSlugAndRelationsUpdate: jest.fn()
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
const titreSlugAndRelationsUpdateMock = mocked(
  titreSlugAndRelationsUpdate,
  true
)

console.info = jest.fn()
console.error = jest.fn()

const titre = { slug: 'slug-old' } as Titres

describe("mise à jour du slug d'un titre", () => {
  test('met à jour le titre si le slug a changé', async () => {
    const slug = 'slug-new'

    titresGetMock.mockResolvedValue([titre])
    titreSlugAndRelationsUpdateMock.mockResolvedValue({
      hasChanged: true,
      slug
    })

    const titresUpdatedIndex = await titresSlugsUpdate()
    const titreSlug = titresUpdatedIndex && Object.keys(titresUpdatedIndex)[0]

    expect(titreSlug).toEqual(slug)

    expect(titreSlugAndRelationsUpdate).toHaveBeenCalled()
  })
})
