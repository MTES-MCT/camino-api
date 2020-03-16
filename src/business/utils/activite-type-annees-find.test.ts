import { IActiviteType } from '../../types'

import activiteTypeAnneesFind from './activite-type-annees-find'

describe('calcule les années que couvre une activité', () => {
  test("retourne un tableau d'années que couvre une activité", () => {
    const anneeEnCours = new Date().getFullYear()

    expect(
      activiteTypeAnneesFind(({
        dateDebut: new Date()
      } as unknown) as IActiviteType)
    ).toEqual([anneeEnCours])
  })
})
