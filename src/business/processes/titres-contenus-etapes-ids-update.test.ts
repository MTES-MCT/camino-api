import { mocked } from 'ts-jest/utils'

import { ITitreEtape } from '../../types'

import { titresContenusEtapesIdsUpdate } from './titres-contenus-etapes-ids-update'
import { titreContenuTitreEtapeFind } from '../rules/titre-prop-etape-find'
import { titresGet } from '../../database/queries/titres'
import Titres from '../../database/models/titres'

jest.mock('../../database/queries/titres', () => ({
  titreUpdate: jest.fn().mockResolvedValue(true),
  titresGet: jest.fn()
}))

jest.mock('../rules/titre-prop-etape-find', () => ({
  titreContenuTitreEtapeFind: jest.fn()
}))

const titresGetMock = mocked(titresGet, true)
const titreContenuTitreEtapeFindMock = mocked(titreContenuTitreEtapeFind, true)

console.info = jest.fn()

describe("propriétés (contenu) d'un titre", () => {
  test('ajoute 2 nouvelles propriétés dans les props du titre', async () => {
    titreContenuTitreEtapeFindMock.mockReturnValue({
      id: 'etape-id'
    } as ITitreEtape)
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

    const titresUpdatedRequests = await titresContenusEtapesIdsUpdate()

    expect(titresUpdatedRequests.length).toEqual(1)
  })

  test('ajoute 1 nouvelle propriété dans les props du titre', async () => {
    titreContenuTitreEtapeFindMock.mockReturnValue({
      id: 'etape-id'
    } as ITitreEtape)
    titresGetMock.mockResolvedValue([
      ({
        type: {
          contenuIds: [{ sectionId: 'arm', elementId: 'mecanise' }]
        },
        contenusTitreEtapesIds: {}
      } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresContenusEtapesIdsUpdate()

    expect(titresUpdatedRequests.length).toEqual(1)
  })

  test('met à jour 1 propriété dans les props du titre', async () => {
    titreContenuTitreEtapeFindMock.mockReturnValue({
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

    const titresUpdatedRequests = await titresContenusEtapesIdsUpdate()

    expect(titresUpdatedRequests.length).toEqual(1)
  })

  test('ne met pas à jour de propriété dans les props du titre', async () => {
    titreContenuTitreEtapeFindMock.mockReturnValue({
      id: 'etape-id'
    } as ITitreEtape)
    titresGetMock.mockResolvedValue([
      ({
        type: {
          contenuIds: [{ sectionId: 'arm', elementId: 'mecanise' }]
        },
        contenusTitreEtapesIds: { arm: { mecanise: 'etape-id' } }
      } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresContenusEtapesIdsUpdate()
    expect(titresUpdatedRequests.length).toEqual(0)
  })

  test('efface 1 propriété dans les props du titre', async () => {
    titreContenuTitreEtapeFindMock.mockReturnValue(null)
    titresGetMock.mockResolvedValue([
      ({
        type: {
          contenuIds: [{ sectionId: 'arm', elementId: 'mecanise' }]
        },
        contenusTitreEtapesIds: { arm: { mecanise: 'etape-id' } }
      } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresContenusEtapesIdsUpdate()

    expect(titresUpdatedRequests.length).toEqual(1)
  })

  test('efface 1 section dans les props du titre', async () => {
    titreContenuTitreEtapeFindMock.mockReturnValue(null)
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

    const titresUpdatedRequests = await titresContenusEtapesIdsUpdate()

    expect(titresUpdatedRequests.length).toEqual(1)
  })

  test("ne met pas à jour un titre qui n'a pas de configuration de props", async () => {
    titreContenuTitreEtapeFindMock.mockReturnValue(null)
    titresGetMock.mockResolvedValue([
      ({ type: { contenuIds: null } } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresContenusEtapesIdsUpdate()

    expect(titresUpdatedRequests.length).toEqual(0)
  })
})
