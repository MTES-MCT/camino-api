import titreActivitesBuild from './titre-activites-build'
import * as titreValiditePeriodeCheck from '../utils/titre-validite-periode-check'

import {
  titreVide,
  titreModificationEnInstance,
  titreAvecActivite201801,
  activiteTypeXxx,
  activiteTypeGrp
} from './__mocks__/titre-activite-create-titres'

jest.mock('../../database/queries/titres-activites', () => ({
  titreActiviteInsert: jest.fn().mockImplementation(() => Promise.resolve())
}))

jest.mock('../utils/titre-validite-periode-check', () => ({
  default: jest.fn()
}))

describe("construction des activités d'un titre", () => {
  test("ne crée pas d'activité si la fin de la période est dans le futur", () => {
    titreValiditePeriodeCheck.default.mockImplementation(() => true)

    const res = titreActivitesBuild(titreVide, activiteTypeGrp, [2300])

    expect(res.length).toEqual(0)
    expect(titreValiditePeriodeCheck.default).not.toHaveBeenCalled()
  })

  test('crée quatre activités si le titre est valide pour la période', () => {
    titreValiditePeriodeCheck.default.mockImplementation(() => true)

    const res = titreActivitesBuild(titreAvecActivite201801, activiteTypeXxx, [
      2018
    ])

    expect(res.length).toEqual(4)
    expect(titreValiditePeriodeCheck.default).toHaveBeenCalled()
  })

  test('crée trois activités si le titre est valide pour la période et possède déja une activité', () => {
    titreValiditePeriodeCheck.default.mockImplementation(() => true)

    const res = titreActivitesBuild(titreAvecActivite201801, activiteTypeGrp, [
      2018
    ])

    expect(res.length).toEqual(3)
    expect(titreValiditePeriodeCheck.default).toHaveBeenCalled()
  })

  test("ne crée pas d'activité si le titre n'est pas valide pour la période", () => {
    titreValiditePeriodeCheck.default.mockImplementation(() => false)

    const res = titreActivitesBuild(titreVide, activiteTypeGrp, [2018])

    expect(res.length).toEqual(0)
    expect(titreValiditePeriodeCheck.default).toHaveBeenCalled()
  })

  test("crée une activité si le titre a le statut 'modification en instance'", () => {
    titreValiditePeriodeCheck.default.mockImplementation(() => false)

    const res = titreActivitesBuild(
      titreModificationEnInstance,
      activiteTypeGrp,
      [2018]
    )

    expect(res.length).toEqual(4)
    expect(titreValiditePeriodeCheck.default).not.toHaveBeenCalled()
  })
})
