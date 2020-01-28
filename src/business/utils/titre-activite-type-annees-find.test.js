import titreActiviteTypeAnneesFind from './titre-activite-type-annees-find'

describe("calcule le nombre d'années que couvre une activité", () => {
  test('retourne ', () => {
    const anneeEnCours = new Date().getFullYear()

    expect(titreActiviteTypeAnneesFind({ dateDebut: new Date() })).toEqual([
      anneeEnCours
    ])
  })
})
