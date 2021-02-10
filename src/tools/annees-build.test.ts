import { anneesBuild } from './annees-build'

describe('liste les années entre deux dates', () => {
  test("retourne un tableau d'années entre deux date", () => {
    expect(anneesBuild('2022-12-07', '2020-10-05')).toEqual([])
    expect(anneesBuild('2020-12-07', '2020-10-05')).toEqual([2020])
    expect(anneesBuild('2020-12-01', '2020-12-05')).toEqual([2020])
    expect(anneesBuild('2015-12-01', '2020-12-05')).toEqual([
      2015,
      2016,
      2017,
      2018,
      2019,
      2020
    ])
  })
})
