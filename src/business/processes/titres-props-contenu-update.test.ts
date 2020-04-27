import { ITitre } from '../../types'
import { mocked } from 'ts-jest/utils'

import titresPropsContenuUpdate from './titres-props-contenu-update'
import titreContenuEtapeIdFind from '../rules/titre-contenu-etape-id-find'

jest.mock('../../database/queries/titres', () => ({
  titreUpdate: jest.fn().mockResolvedValue(true)
}))

jest.mock('../rules/titre-contenu-etape-id-find', () => ({
  default: jest.fn()
}))

const titreContenuEtapeIdFindMock = mocked(titreContenuEtapeIdFind, true)

console.info = jest.fn()

describe("propriétés (contenu) d'un titre", () => {
  test('ajoute 2 nouvelles propriétés dans les props du titre', async () => {
    titreContenuEtapeIdFindMock.mockReturnValue('etape-id')

    const titresUpdatedRequests = await titresPropsContenuUpdate([
      ({
        type: {
          propsEtapesTypes: [
            { sectionId: 'arm', elementId: 'mecanise' },
            { sectionId: 'arm', elementId: 'agent' }
          ]
        }
      } as unknown) as ITitre
    ])

    expect(titresUpdatedRequests.length).toEqual(1)
    expect(console.info).toHaveBeenCalled()
  })

  test('ajoute 1 nouvelle propriété dans les props du titre', async () => {
    titreContenuEtapeIdFindMock.mockReturnValue('etape-id')

    const titresUpdatedRequests = await titresPropsContenuUpdate([
      ({
        type: {
          propsEtapesTypes: [{ sectionId: 'arm', elementId: 'mecanise' }]
        },
        propsTitreEtapesIds: {}
      } as unknown) as ITitre
    ])

    expect(titresUpdatedRequests.length).toEqual(1)
    expect(console.info).toHaveBeenCalled()
  })

  test('met à jour 1 propriété dans les props du titre', async () => {
    titreContenuEtapeIdFindMock.mockReturnValue('new-etape-id')

    const titresUpdatedRequests = await titresPropsContenuUpdate([
      ({
        type: {
          propsEtapesTypes: [{ sectionId: 'arm', elementId: 'mecanise' }]
        },
        propsTitreEtapesIds: { arm: { mecanise: 'old-etape-id' } }
      } as unknown) as ITitre
    ])

    expect(titresUpdatedRequests.length).toEqual(1)
    expect(console.info).toHaveBeenCalled()
  })

  test('ne met pas à jour de propriété dans les props du titre', async () => {
    titreContenuEtapeIdFindMock.mockReturnValue('etape-id')

    const titresUpdatedRequests = await titresPropsContenuUpdate([
      ({
        type: {
          propsEtapesTypes: [{ sectionId: 'arm', elementId: 'mecanise' }]
        },
        propsTitreEtapesIds: { arm: { mecanise: 'etape-id' } }
      } as unknown) as ITitre
    ])

    expect(titresUpdatedRequests.length).toEqual(0)
    expect(console.info).not.toHaveBeenCalled()
  })

  test('efface 1 propriété dans les props du titre', async () => {
    titreContenuEtapeIdFindMock.mockReturnValue(null)

    const titresUpdatedRequests = await titresPropsContenuUpdate([
      ({
        type: {
          propsEtapesTypes: [{ sectionId: 'arm', elementId: 'mecanise' }]
        },
        propsTitreEtapesIds: { arm: { mecanise: 'etape-id' } }
      } as unknown) as ITitre
    ])

    expect(titresUpdatedRequests.length).toEqual(1)
    expect(console.info).toHaveBeenCalled()
  })

  test('efface 1 section dans les props du titre', async () => {
    titreContenuEtapeIdFindMock.mockReturnValue(null)

    const titresUpdatedRequests = await titresPropsContenuUpdate([
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
      } as unknown) as ITitre
    ])

    expect(titresUpdatedRequests.length).toEqual(1)
    expect(console.info).toHaveBeenCalled()
  })

  test("ne met pas à jour un titre qui n'a pas de configuration de props", async () => {
    titreContenuEtapeIdFindMock.mockReturnValue(null)

    const titresUpdatedRequests = await titresPropsContenuUpdate([
      ({ type: { propsEtapesTypes: null } } as unknown) as ITitre
    ])

    expect(titresUpdatedRequests.length).toEqual(0)
  })

  test("ne met pas à jour un titre qui n'a pas de type", async () => {
    titreContenuEtapeIdFindMock.mockReturnValue(null)

    const titresUpdatedRequests = await titresPropsContenuUpdate([
      ({ type: null } as unknown) as ITitre
    ])

    expect(titresUpdatedRequests.length).toEqual(0)
  })
})
