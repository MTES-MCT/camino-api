import titreEtapeDemarcheEtapeTypeFind from './titre-etape-demarche-etape-type-find'
import { demarcheType } from './__mocks__/titre-etape-demarche-etape-type-find-types'

describe("retourne le type d'étape provenant des types d'étapes d'un type de démarche", () => {
  test("le titre d'étape est retourné", () => {
    expect(titreEtapeDemarcheEtapeTypeFind(demarcheType, 'xxx')).toEqual({
      id: 'xxx'
    })
  })

  test('une erreur est retournée', () => {
    expect(() =>
      titreEtapeDemarcheEtapeTypeFind(demarcheType, 'introuvable')
    ).toThrow(/étape "introuvable" invalide pour une démarche "demarche"/)
  })
})
