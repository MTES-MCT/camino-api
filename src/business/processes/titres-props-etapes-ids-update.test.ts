import { ITitreEtape } from '../../types'
import { mocked } from 'ts-jest/utils'
import titresPropsEtapesIdsUpdate from './titres-props-etapes-ids-update'
import { titrePropEtapeFind } from '../rules/titre-prop-etape-find'
import { titresGet } from '../../database/queries/titres'
import Titres from '../../database/models/titres'

jest.mock('../../database/queries/titres', () => ({
  titreUpdate: jest.fn().mockResolvedValue(true),
  titresGet: jest.fn()
}))

jest.mock('../rules/titre-prop-etape-find', () => ({
  titrePropEtapeFind: jest.fn()
}))

const titresGetMock = mocked(titresGet, true)
const titrePropEtapeFindMock = mocked(titrePropEtapeFind, true)

console.info = jest.fn()

describe("propriétés (étape) d'un titre", () => {
  test('trouve 8 propriétés dans les étapes', async () => {
    titrePropEtapeFindMock.mockReturnValue({ id: 'etape-id' } as ITitreEtape)
    titresGetMock.mockResolvedValue([
      ({ titulairesTitreEtapeId: null } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresPropsEtapesIdsUpdate()

    expect(titresUpdatedRequests.length).toEqual(1)
    expect(console.info).toHaveBeenCalled()
  })

  test('ne trouve pas de propriétés dans les étapes', async () => {
    titrePropEtapeFindMock.mockReturnValue(null)
    titresGetMock.mockResolvedValue([
      ({ titulairesTitreEtapeId: null } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresPropsEtapesIdsUpdate()

    expect(titresUpdatedRequests.length).toEqual(0)
  })
})
