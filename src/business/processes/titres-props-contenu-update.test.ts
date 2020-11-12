import { mocked } from 'ts-jest/utils'

import titresPropsContenuUpdate from './titres-props-contenu-update'
import titreContenuEtapeIdFind from '../rules/titre-contenu-etape-id-find'
import { titresGet } from '../../database/queries/titres'
import Titres from '../../database/models/titres'

jest.mock('../../database/queries/titres', () => ({
  titreUpdate: jest.fn().mockResolvedValue(true),
  titresGet: jest.fn()
}))

jest.mock('../rules/titre-contenu-etape-id-find', () => ({
  default: jest.fn()
}))

const titresGetMock = mocked(titresGet, true)
const titreContenuEtapeIdFindMock = mocked(titreContenuEtapeIdFind, true)

console.info = jest.fn()

describe("propriétés (contenu) d'un titre", () => {
  test('ajoute 2 nouvelles propriétés dans les props du titre', async () => {
    titreContenuEtapeIdFindMock.mockReturnValue('etape-id')
    titresGetMock.mockResolvedValue([
      ({
        type: {
          propsEtapesTypes: [
            { sectionId: 'arm', elementId: 'mecanise' },
            { sectionId: 'arm', elementId: 'agent' }
          ]
        }
      } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresPropsContenuUpdate()

    expect(titresUpdatedRequests.length).toEqual(1)
  })

  test('ajoute 1 nouvelle propriété dans les props du titre', async () => {
    titreContenuEtapeIdFindMock.mockReturnValue('etape-id')
    titresGetMock.mockResolvedValue([
      ({
        type: {
          propsEtapesTypes: [{ sectionId: 'arm', elementId: 'mecanise' }]
        },
        propsTitreEtapesIds: {}
      } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresPropsContenuUpdate()

    expect(titresUpdatedRequests.length).toEqual(1)
  })

  test('met à jour 1 propriété dans les props du titre', async () => {
    titreContenuEtapeIdFindMock.mockReturnValue('new-etape-id')
    titresGetMock.mockResolvedValue([
      ({
        type: {
          propsEtapesTypes: [{ sectionId: 'arm', elementId: 'mecanise' }]
        },
        propsTitreEtapesIds: { arm: { mecanise: 'old-etape-id' } }
      } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresPropsContenuUpdate()

    expect(titresUpdatedRequests.length).toEqual(1)
  })

  test('ne met pas à jour de propriété dans les props du titre', async () => {
    titreContenuEtapeIdFindMock.mockReturnValue('etape-id')
    titresGetMock.mockResolvedValue([
      ({
        type: {
          propsEtapesTypes: [{ sectionId: 'arm', elementId: 'mecanise' }]
        },
        propsTitreEtapesIds: { arm: { mecanise: 'etape-id' } }
      } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresPropsContenuUpdate()
    expect(titresUpdatedRequests.length).toEqual(0)
  })

  test('efface 1 propriété dans les props du titre', async () => {
    titreContenuEtapeIdFindMock.mockReturnValue(null)
    titresGetMock.mockResolvedValue([
      ({
        type: {
          propsEtapesTypes: [{ sectionId: 'arm', elementId: 'mecanise' }]
        },
        propsTitreEtapesIds: { arm: { mecanise: 'etape-id' } }
      } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresPropsContenuUpdate()

    expect(titresUpdatedRequests.length).toEqual(1)
  })

  test('efface 1 section dans les props du titre', async () => {
    titreContenuEtapeIdFindMock.mockReturnValue(null)
    titresGetMock.mockResolvedValue([
      ({
        type: {
          propsEtapesTypes: [{ sectionId: 'arm', elementId: 'mecanise' }]
        },
        propsTitreEtapesIds: {
          arm: {
            mecanise: 'etape-id',
            xxx: { facture: 'etape-id' }
          }
        }
      } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresPropsContenuUpdate()

    expect(titresUpdatedRequests.length).toEqual(1)
  })

  test("ne met pas à jour un titre qui n'a pas de configuration de props", async () => {
    titreContenuEtapeIdFindMock.mockReturnValue(null)
    titresGetMock.mockResolvedValue([
      ({ type: { propsEtapesTypes: null } } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresPropsContenuUpdate()

    expect(titresUpdatedRequests.length).toEqual(0)
  })

  test("ne met pas à jour un titre qui n'a pas de type", async () => {
    titreContenuEtapeIdFindMock.mockReturnValue(null)
    titresGetMock.mockResolvedValue([({ type: null } as unknown) as Titres])

    const titresUpdatedRequests = await titresPropsContenuUpdate()

    expect(titresUpdatedRequests.length).toEqual(0)
  })
})
