import { mocked } from 'ts-jest/utils'

import { titresPropsContenuUpdate } from './titres-props-contenu-update'
import { titreContenuEtapeFind } from '../rules/titre-prop-etape-find'
import { titresGet } from '../../database/queries/titres'
import Titres from '../../database/models/titres'
import { ITitreEtape } from '../../types'

jest.mock('../../database/queries/titres', () => ({
  titreUpdate: jest.fn().mockResolvedValue(true),
  titresGet: jest.fn()
}))

jest.mock('../rules/titre-prop-etape-find', () => ({
  titreContenuEtapeFind: jest.fn()
}))

const titresGetMock = mocked(titresGet, true)
const titreContenuEtapeFindMock = mocked(titreContenuEtapeFind, true)

console.info = jest.fn()

describe("propriétés (contenu) d'un titre", () => {
  test('ajoute 2 nouvelles propriétés dans les props du titre', async () => {
    titreContenuEtapeFindMock.mockReturnValue({ id: 'etape-id' } as ITitreEtape)
    titresGetMock.mockResolvedValue([
      ({
        type: {
          contenuIds: [
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
    titreContenuEtapeFindMock.mockReturnValue({ id: 'etape-id' } as ITitreEtape)
    titresGetMock.mockResolvedValue([
      ({
        type: {
          contenuIds: [{ sectionId: 'arm', elementId: 'mecanise' }]
        },
        contenusTitreEtapesIds: {}
      } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresPropsContenuUpdate()

    expect(titresUpdatedRequests.length).toEqual(1)
  })

  test('met à jour 1 propriété dans les props du titre', async () => {
    titreContenuEtapeFindMock.mockReturnValue({
      id: 'new-etape-id'
    } as ITitreEtape)
    titresGetMock.mockResolvedValue([
      ({
        type: {
          contenuIds: [{ sectionId: 'arm', elementId: 'mecanise' }]
        },
        contenusTitreEtapesIds: { arm: { mecanise: 'old-etape-id' } }
      } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresPropsContenuUpdate()

    expect(titresUpdatedRequests.length).toEqual(1)
  })

  test('ne met pas à jour de propriété dans les props du titre', async () => {
    titreContenuEtapeFindMock.mockReturnValue({ id: 'etape-id' } as ITitreEtape)
    titresGetMock.mockResolvedValue([
      ({
        type: {
          contenuIds: [{ sectionId: 'arm', elementId: 'mecanise' }]
        },
        contenusTitreEtapesIds: { arm: { mecanise: 'etape-id' } }
      } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresPropsContenuUpdate()
    expect(titresUpdatedRequests.length).toEqual(0)
  })

  test('efface 1 propriété dans les props du titre', async () => {
    titreContenuEtapeFindMock.mockReturnValue(null)
    titresGetMock.mockResolvedValue([
      ({
        type: {
          contenuIds: [{ sectionId: 'arm', elementId: 'mecanise' }]
        },
        contenusTitreEtapesIds: { arm: { mecanise: 'etape-id' } }
      } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresPropsContenuUpdate()

    expect(titresUpdatedRequests.length).toEqual(1)
  })

  test('efface 1 section dans les props du titre', async () => {
    titreContenuEtapeFindMock.mockReturnValue(null)
    titresGetMock.mockResolvedValue([
      ({
        type: {
          contenuIds: [{ sectionId: 'arm', elementId: 'mecanise' }]
        },
        contenusTitreEtapesIds: {
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
    titreContenuEtapeFindMock.mockReturnValue(null)
    titresGetMock.mockResolvedValue([
      ({ type: { contenuIds: null } } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresPropsContenuUpdate()

    expect(titresUpdatedRequests.length).toEqual(0)
  })
})
