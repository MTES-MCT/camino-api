import { IActiviteType } from '../../types'

import { activiteTypeAnneesFind } from './activite-type-annees-find'

describe('calcule les années que couvre une activité', () => {
  test("retourne un tableau d'années que couvre une activité", () => {
    const anneeFin = 2020

    expect(
      activiteTypeAnneesFind(
        ({
          dateDebut: '2020-12-01'
        } as unknown) as IActiviteType,
        anneeFin
      )
    ).toEqual([anneeFin])
  })
})
