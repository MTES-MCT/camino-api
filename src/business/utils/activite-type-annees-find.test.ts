import { IActiviteType } from '../../types'
import * as dateFormat from 'dateformat'

import activiteTypeAnneesFind from './activite-type-annees-find'

describe('calcule les années que couvre une activité', () => {
  test("retourne un tableau d'années que couvre une activité", () => {
    const anneeEnCours = new Date().getFullYear()
    const aujourdhui = dateFormat(new Date(), 'yyyy-mm-dd')

    expect(
      activiteTypeAnneesFind(({
        dateDebut: aujourdhui
      } as unknown) as IActiviteType)
    ).toEqual([anneeEnCours])
  })
})
