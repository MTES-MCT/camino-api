import { IActiviteType } from '../../types'

import activiteTypeAnneesFind from './activite-type-annees-find'

describe("calcule le nombre d'années que couvre une activité", () => {
  test('retourne', () => {
    const anneeEnCours = new Date().getFullYear()

    expect(
      activiteTypeAnneesFind(({
        dateDebut: new Date()
      } as unknown) as IActiviteType)
    ).toEqual([anneeEnCours])
  })
})
