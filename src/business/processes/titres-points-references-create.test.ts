import { mocked } from 'ts-jest/utils'
import titresPointsReferencesCreate from './titres-points-references-create'
import * as queries from '../../database/queries/titres-points'
import { titresPointsGet } from '../../database/queries/titres-points'
import TitresPoints from '../../database/models/titres-points'

jest.mock('../../database/queries/titres-points', () => ({
  titrePointReferenceCreate: jest.fn().mockResolvedValue(true),
  titresPointsGet: jest.fn()
}))

const titresPointsGetMock = mocked(titresPointsGet, true)

console.info = jest.fn()

describe("références des points d'un titre", () => {
  test('crée une référence sur un point si elle est absente', async () => {
    titresPointsGetMock.mockResolvedValue([
      { id: 'point-id', coordonnees: { x: 0.1, y: 0.2 } },
      {
        id: 'point-id-2',
        coordonnees: { x: 0.1, y: 0.2 },
        references: [{}]
      }
    ] as TitresPoints[])

    const pointsReferencesCreated = await titresPointsReferencesCreate()

    expect(pointsReferencesCreated.length).toEqual(1)
  })

  test("ne crée pas de référence sur un titre qui n'a pas de point", async () => {
    titresPointsGetMock.mockResolvedValue([] as TitresPoints[])

    const pointsReferencesCreated = await titresPointsReferencesCreate()

    expect(pointsReferencesCreated.length).toEqual(0)

    expect(queries.titrePointReferenceCreate).not.toHaveBeenCalled()
  })
})
