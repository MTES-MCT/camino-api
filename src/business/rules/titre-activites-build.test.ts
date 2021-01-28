import { mocked } from 'ts-jest/utils'

import { titreActivitesBuild } from './titre-activites-build'
import * as titreValiditePeriodeCheck from '../utils/titre-validite-periode-check'

import {
  titreVide,
  titreModificationEnInstance,
  titreAvecActivite201801,
  activiteTypeXxx,
  activiteTypeGrp
} from './__mocks__/titre-activites-build-titres'

jest.mock('../../database/queries/titres-activites', () => ({
  titreActiviteInsert: jest.fn().mockReturnValue(Promise.resolve())
}))

jest.mock('../utils/titre-validite-periode-check', () => ({
  default: jest.fn()
}))

const titreValiditePeriodeCheckMock = mocked(titreValiditePeriodeCheck, true)

describe("construction des activités d'un titre", () => {
  const aujourdhui = '2020-12-01'

  test("ne crée pas d'activité si la fin de la période est dans le futur", () => {
    titreValiditePeriodeCheckMock.default.mockReturnValue(true)

    const res = titreActivitesBuild(
      titreVide,
      activiteTypeGrp,
      [2300],
      aujourdhui
    )

    expect(res.length).toEqual(0)
    expect(titreValiditePeriodeCheckMock.default).not.toHaveBeenCalled()
  })

  test('crée quatre activités si le titre est valide pour la période', () => {
    titreValiditePeriodeCheckMock.default.mockReturnValue(true)

    const res = titreActivitesBuild(
      titreAvecActivite201801,
      activiteTypeXxx,
      [2018],
      aujourdhui
    )

    expect(res.length).toEqual(4)
    expect(titreValiditePeriodeCheckMock.default).toHaveBeenCalled()
  })

  test('crée trois activités si le titre est valide pour la période et possède déja une activité', () => {
    titreValiditePeriodeCheckMock.default.mockReturnValue(true)

    const res = titreActivitesBuild(
      titreAvecActivite201801,
      activiteTypeGrp,
      [2018],
      aujourdhui
    )

    expect(res.length).toEqual(3)
    expect(titreValiditePeriodeCheckMock.default).toHaveBeenCalled()
  })

  test("ne crée pas d'activité si le titre n'est pas valide pour la période", () => {
    titreValiditePeriodeCheckMock.default.mockReturnValue(false)

    const res = titreActivitesBuild(
      titreVide,
      activiteTypeGrp,
      [2018],
      aujourdhui
    )

    expect(res.length).toEqual(0)
    expect(titreValiditePeriodeCheckMock.default).toHaveBeenCalled()
  })

  test("crée une activité si le titre a le statut 'modification en instance'", () => {
    titreValiditePeriodeCheckMock.default.mockReturnValue(false)

    const res = titreActivitesBuild(
      titreModificationEnInstance,
      activiteTypeGrp,
      [2018],
      aujourdhui
    )

    expect(res.length).toEqual(4)
    expect(titreValiditePeriodeCheckMock.default).not.toHaveBeenCalled()
  })
})
