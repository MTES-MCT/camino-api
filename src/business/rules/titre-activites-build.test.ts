import { mocked } from 'ts-jest/utils'
import {
  IActiviteType,
  ISubstance,
  ITitreActivite,
  ITitreDemarche,
  IUnite
} from '../../types'

import { titreActivitesBuild } from './titre-activites-build'
import { titreValideCheck } from '../utils/titre-valide-check'
import { titreEtapePropFind } from './titre-etape-prop-find'
import { metasGet } from '../../database/cache/metas'

import {
  titreActivitesGra,
  titreActivitesGrp,
  activiteTypeGra,
  activiteTypeGrp
} from './__mocks__/titre-activites-build-titres'

jest.mock('../utils/titre-valide-check', () => ({
  titreValideCheck: jest.fn()
}))

jest.mock('./titre-etape-prop-find', () => ({
  titreEtapePropFind: jest.fn()
}))

jest.mock('../../database/cache/metas', () => ({
  metasGet: jest.fn()
}))

const titreValideCheckMock = mocked(titreValideCheck, true)
const titreEtapePropFindMock = mocked(titreEtapePropFind, true)
const metasGetMock = mocked(metasGet, true)

describe("construction des activités d'un titre", () => {
  const aujourdhui = '2021-01-01'

  test("ne crée pas d'activité pour un titre qui n'a pas de phase de démarches", () => {
    titreValideCheckMock.mockReturnValue(true)

    const titreActivites1 = titreActivitesBuild(
      activiteTypeGrp,
      [2020],
      aujourdhui,
      'titre-id',
      undefined,
      undefined
    )

    expect(titreActivites1.length).toEqual(0)

    const titreActivites2 = titreActivitesBuild(
      activiteTypeGrp,
      [2020],
      aujourdhui,
      'titre-id',
      undefined,
      []
    )

    expect(titreActivites2.length).toEqual(0)

    const titreActivites3 = titreActivitesBuild(
      activiteTypeGrp,
      [2020],
      aujourdhui,
      'titre-id',
      undefined,
      [({ id: 'demarche-id' } as unknown) as ITitreDemarche]
    )

    expect(titreActivites3.length).toEqual(0)
    expect(titreValideCheckMock).not.toHaveBeenCalled()
  })

  test('ne crée pas une activité si elle existe déjà', () => {
    titreValideCheckMock.mockReturnValue(true)

    const res = titreActivitesBuild(
      activiteTypeGra,
      [2018],
      aujourdhui,
      'titre-id',
      undefined,
      [({ id: 'demarche-id', phase: {} } as unknown) as ITitreDemarche],
      [{ typeId: 'gra', annee: 2018, periodeId: 1 }] as ITitreActivite[]
    )

    expect(res.length).toEqual(0)
    expect(titreValideCheckMock).not.toHaveBeenCalled()
  })

  test("ne crée pas une activité si sa date de fin n'a pas eu lieu", () => {
    const res = titreActivitesBuild(
      activiteTypeGrp,
      [2021],
      aujourdhui,
      'titre-id',
      undefined,
      [({ id: 'demarche-id', phase: {} } as unknown) as ITitreDemarche]
    )

    expect(res.length).toEqual(0)
    expect(titreValideCheckMock).not.toHaveBeenCalled()
  })

  test('crée des activités', () => {
    titreValideCheckMock.mockReturnValue(true)
    metasGetMock.mockReturnValue([
      { id: 'mkg', nom: 'kilogramme' },
      { id: 'lit', nom: 'Litres' }
    ] as IUnite[])
    titreEtapePropFindMock.mockReturnValue([
      {
        id: 'auru',
        legales: [
          {
            fiscales: [
              {
                id: 'auru',
                nom: 'Or',
                description: 'métal précieux',
                unite: { nom: 'kilogramme' }
              },
              {
                id: 'sela',
                nom: 'Sel',
                description: 'Sel',
                unite: { nom: 'tonnes', referenceUniteRatio: 0.001 }
              },
              null
            ]
          }
        ]
      }
    ] as ISubstance[])

    const titreActivitesA = titreActivitesBuild(
      activiteTypeGra,
      [2018],
      aujourdhui,
      'titre-id',
      undefined,
      [({ id: 'demarche-id', phase: {} } as unknown) as ITitreDemarche]
    )

    expect(titreActivitesA).toEqual(titreActivitesGra)

    const titreActivitesB = titreActivitesBuild(
      activiteTypeGrp,
      [2018],
      aujourdhui,
      'titre-id',
      'mod',
      [({ id: 'demarche-id', phase: {} } as unknown) as ITitreDemarche]
    )

    expect(titreActivitesB).toEqual(titreActivitesGrp)

    expect(titreValideCheckMock).toHaveBeenCalled()
  })

  test("ne crée pas d'activité si le titre n'est pas valide pour la période", () => {
    titreValideCheckMock.mockReturnValue(false)

    const titreActivites = titreActivitesBuild(
      activiteTypeGrp,
      [2018],
      aujourdhui,
      'titre-id',
      undefined,
      [({ id: 'demarche-id', phase: {} } as unknown) as ITitreDemarche]
    )

    expect(titreActivites.length).toEqual(0)
    expect(titreValideCheckMock).toHaveBeenCalled()
  })

  test("ne crée pas d'activités si les sections sont vides", () => {
    titreValideCheckMock.mockReturnValue(true)
    titreEtapePropFindMock.mockReturnValueOnce([] as ISubstance[])

    const titreActivitesA = titreActivitesBuild(
      activiteTypeGra,
      [2018],
      aujourdhui,
      'titre-id',
      undefined,
      [({ id: 'demarche-id', phase: {} } as unknown) as ITitreDemarche]
    )

    expect(titreActivitesA).toEqual([])

    titreEtapePropFindMock.mockReturnValueOnce(null)

    const titreActivitesB = titreActivitesBuild(
      activiteTypeGra,
      [2018],
      aujourdhui,
      'titre-id',
      undefined,
      [({ id: 'demarche-id', phase: {} } as unknown) as ITitreDemarche]
    )

    expect(titreActivitesB).toEqual([])

    const titreActivitesC = titreActivitesBuild(
      ({
        id: 'gra',
        frequence: { periodesNom: 'annees', annees: [1] },
        sections: [{ id: 'renseignements' }]
      } as unknown) as IActiviteType,
      [2018],
      aujourdhui,
      'titre-id',
      undefined,
      [({ id: 'demarche-id', phase: {} } as unknown) as ITitreDemarche]
    )

    expect(titreActivitesC).toEqual([])
  })
})
