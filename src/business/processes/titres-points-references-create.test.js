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
    expect(await titresPointsReferencesCreate(titres)).toEqual(
      'création: 1 référence(s) de points'
    )

    expect(queries.titrePointReferenceCreate).toHaveBeenCalledWith({
      id: 'point-id-4326',
      coordonnees: { x: '0.1', y: '0.2' },
      titrePointId: 'point-id',
      geoSystemeId: '4326'
    })
    expect(console.log).toHaveBeenCalled()
  })

  test("ne crée pas de référence sur un titre qui n'a pas de point", async () => {
    const titres = [
      { id: 'titre-id-sans-demarches' },
      { id: 'titre-id-sans-etapes', demarches: [{}] },
      { id: 'titre-id-sans-points', demarches: [{ etapes: [{}] }] }
    ]
    expect(await titresPointsReferencesCreate(titres)).toEqual(
      'création: 0 référence(s) de points'
    )

    expect(queries.titrePointReferenceCreate).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })
})
