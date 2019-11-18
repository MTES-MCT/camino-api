import titreEtapeDemarcheEtapeTypeFind from './titre-etape-demarche-etape-type-find'
import { demarcheType } from './__mocks__/titre-etape-demarche-etape-type-find-types'

describe("vérifie la validité du contenu d'une activité", () => {
  test('une champs de section dont le type est un nombre et qui a une valeur positive est validée', () => {
    expect(titreEtapeDemarcheEtapeTypeFind(demarcheType, 'etape')).toEqual({
      id: 'etape'
    })
  })

  test('une champs de section dont le type est un nombre et qui a une valeur négative retourne une erreur', () => {
    expect(() =>
      titreEtapeDemarcheEtapeTypeFind(demarcheType, 'introuvable')
    ).toThrow(/étape "introuvable" invalide pour une démarche "demarche"/)
  })
})
