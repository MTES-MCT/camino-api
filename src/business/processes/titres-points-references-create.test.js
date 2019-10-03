import titresPointsReferencesCreate from './titres-points-references-create'
import * as queries from '../../database/queries/titres-points'

jest.mock('../../database/queries/titres-points', () => ({
  titrePointReferenceCreate: jest.fn().mockResolvedValue()
}))

console.log = jest.fn()

describe("références des points d'un titre", () => {
  test('crée une référence sur un point si elle est absente', async () => {
    const titres = [
      {
        id: 'titre-id',
        demarches: [
          {
            etapes: [
              {
                points: [
                  { id: 'point-id', coordonnees: { x: 0.1, y: 0.2 } },
                  {
                    id: 'point-id-2',
                    coordonnees: { x: 0.1, y: 0.2 },
                    references: [{}]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]

    const pointsReferencesCreated = await titresPointsReferencesCreate(titres)

    expect(pointsReferencesCreated.length).toEqual(1)

    expect(queries.titrePointReferenceCreate).toHaveBeenCalledWith({
      id: 'point-id-4326',
      coordonnees: { x: 0.1, y: 0.2 },
      titrePointId: 'point-id',
      geoSystemeId: '4326',
      uniteId: 'deg'
    })
    expect(console.log).toHaveBeenCalled()
  })

  test("ne crée pas de référence sur un titre qui n'a pas de point", async () => {
    const titres = [
      { id: 'titre-id-sans-demarches' },
      { id: 'titre-id-sans-etapes', demarches: [{}] },
      { id: 'titre-id-sans-points', demarches: [{ etapes: [{}] }] }
    ]

    const pointsReferencesCreated = await titresPointsReferencesCreate(titres)

    expect(pointsReferencesCreated.length).toEqual(0)

    expect(queries.titrePointReferenceCreate).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})
