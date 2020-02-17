import { ITitresPoints } from '../../types'

import titresPointsReferencesCreate from './titres-points-references-create'
import * as queries from '../../database/queries/titres-points'

jest.mock('../../database/queries/titres-points', () => ({
  titrePointReferenceCreate: jest.fn().mockResolvedValue(true)
}))

console.log = jest.fn()

describe("références des points d'un titre", () => {
  test('crée une référence sur un point si elle est absente', async () => {
    const titresEtapes = [
      { id: 'point-id', coordonnees: { x: 0.1, y: 0.2 } },
      {
        id: 'point-id-2',
        coordonnees: { x: 0.1, y: 0.2 },
        references: [{}]
      }
    ] as ITitresPoints[]

    const pointsReferencesCreated = await titresPointsReferencesCreate(
      titresEtapes
    )

    expect(pointsReferencesCreated.length).toEqual(1)

    expect(queries.titrePointReferenceCreate).toHaveBeenCalledWith({
      id: 'point-id-4326',
      coordonnees: { x: 0.1, y: 0.2 },
      titrePointId: 'point-id',
      geoSystemeId: '4326'
    })
    expect(console.log).toHaveBeenCalled()
  })

  test("ne crée pas de référence sur un titre qui n'a pas de point", async () => {
    const titresEtapes = [] as ITitresPoints[]

    const pointsReferencesCreated = await titresPointsReferencesCreate(
      titresEtapes
    )

    expect(pointsReferencesCreated.length).toEqual(0)

    expect(queries.titrePointReferenceCreate).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})
