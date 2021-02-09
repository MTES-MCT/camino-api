import { mocked } from 'ts-jest/utils'
import {
  IActiviteType,
  ITitreActivite,
  ITitreDemarche,
  IUnite
} from '../../types'

import { titreActivitesBuild } from './titre-activites-build'
import { metasGet } from '../../database/cache/metas'

import {
  titreActivitesGra,
  titreActivitesGrp,
  activiteTypeGra,
  activiteTypeGrp,
  titreDemarches
} from './__mocks__/titre-activites-build-titres'

jest.mock('../../database/cache/metas', () => ({ metasGet: jest.fn() }))

const metasGetMock = mocked(metasGet, true)

describe("construction des activités d'un titre", () => {
  const aujourdhui = '2021-01-01'

  test("ne crée pas d'activité pour un titre qui n'a pas de phase de démarches", () => {
    const titreActivites1 = titreActivitesBuild(
      activiteTypeGrp,
      [2020],
      aujourdhui,
      'titre-id',
      'pxm',
      undefined
    )

    expect(titreActivites1.length).toEqual(0)

    const titreActivites2 = titreActivitesBuild(
      activiteTypeGrp,
      [2020],
      aujourdhui,
      'titre-id',
      'pxm',
      []
    )

    expect(titreActivites2.length).toEqual(0)

    const titreActivites3 = titreActivitesBuild(
      activiteTypeGrp,
      [2020],
      aujourdhui,
      'titre-id',
      'pxm',
      [({ id: 'demarche-id' } as unknown) as ITitreDemarche]
    )

    expect(titreActivites3.length).toEqual(0)
  })

  test('ne crée pas une activité si elle existe déjà', () => {
    const res = titreActivitesBuild(
      activiteTypeGra,
      [2018],
      aujourdhui,
      'titre-id',
      'pxm',
      [({ id: 'demarche-id', phase: {} } as unknown) as ITitreDemarche],
      [{ typeId: 'gra', annee: 2018, periodeId: 1 }] as ITitreActivite[]
    )

    expect(res.length).toEqual(0)
  })

  test("ne crée pas une activité si sa date de fin n'a pas eu lieu", () => {
    const res = titreActivitesBuild(
      activiteTypeGrp,
      [2021],
      aujourdhui,
      'titre-id',
      'pxm',
      [({ id: 'demarche-id', phase: {} } as unknown) as ITitreDemarche]
    )

    expect(res.length).toEqual(0)
  })

  test('crée des activités', () => {
    metasGetMock.mockReturnValue([
      { id: 'mkg', nom: 'kilogramme' },
      { id: 'lit', nom: 'Litres' }
    ] as IUnite[])

    const titreActivitesA = titreActivitesBuild(
      activiteTypeGra,
      [2018],
      aujourdhui,
      'titre-id',
      'pxm',
      titreDemarches
    )

    expect(titreActivitesA).toEqual(titreActivitesGra)

    const titreActivitesB = titreActivitesBuild(
      activiteTypeGrp,
      [2018],
      aujourdhui,
      'titre-id',
      'pxm',
      [
        ({
          id: 'demarche-id',
          phase: { dateDebut: '2018-01-01', dateFin: '2018-12-31' }
        } as unknown) as ITitreDemarche
      ]
    )

    expect(titreActivitesB).toEqual(titreActivitesGrp)
  })

  test("ne crée pas d'activité si le titre n'est pas valide pour la période", () => {
    const titreActivites = titreActivitesBuild(
      activiteTypeGrp,
      [2018],
      aujourdhui,
      'titre-id',
      'pxm',
      [({ id: 'demarche-id', phase: {} } as unknown) as ITitreDemarche]
    )

    expect(titreActivites.length).toEqual(0)
  })

  test("ne crée pas d'activités si les sections sont vides", () => {
    const titreActivitesA = titreActivitesBuild(
      activiteTypeGra,
      [2018],
      aujourdhui,
      'titre-id',
      'pxm',
      [
        ({
          id: 'demarche-id',
          statutId: 'acc',
          typeId: 'oct',
          phase: { dateDebut: '2018-01-01', dateFin: '2018-12-31' },
          etapes: [
            {
              id: 'etape-id',
              date: '2018-01-01',
              typeId: 'dpu',
              statutId: 'fai',
              substances: []
            }
          ]
        } as unknown) as ITitreDemarche
      ]
    )

    expect(titreActivitesA).toEqual([])

    const titreActivitesB = titreActivitesBuild(
      activiteTypeGra,
      [2018],
      aujourdhui,
      'titre-id',
      'pxm',
      [
        ({
          id: 'demarche-id',
          statutId: 'acc',
          typeId: 'oct',
          phase: { dateDebut: '2018-01-01', dateFin: '2018-12-31' },
          etapes: [
            {
              id: 'etape-id',
              date: '2018-01-01',
              typeId: 'dpu',
              statutId: 'fai',
              substances: null
            }
          ]
        } as unknown) as ITitreDemarche
      ]
    )

    expect(titreActivitesB).toEqual([])

    const titreActivitesD = titreActivitesBuild(
      ({
        id: 'gra',
        frequence: { periodesNom: 'annees', annees: [1] },
        sections: [{ id: 'renseignements' }]
      } as unknown) as IActiviteType,
      [2018],
      aujourdhui,
      'titre-id',
      'pxm',
      [
        ({
          id: 'demarche-id',
          statutId: 'acc',
          typeId: 'oct',
          phase: { dateDebut: '2018-01-01', dateFin: '2018-12-31' }
        } as unknown) as ITitreDemarche
      ]
    )

    expect(titreActivitesD).toEqual([])
  })
})
