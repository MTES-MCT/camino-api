import { ITitreEtape } from '../../types'
import { mocked } from 'ts-jest/utils'
import { titresPropsEtapesIdsUpdate } from './titres-props-etapes-ids-update'
import { titrePropTitreEtapeFind } from '../rules/titre-prop-etape-find'
import { titresGet } from '../../database/queries/titres'
import Titres from '../../database/models/titres'

jest.mock('../../database/queries/titres', () => ({
  titreUpdate: jest.fn().mockResolvedValue(true),
  titresGet: jest.fn()
}))

jest.mock('../rules/titre-prop-etape-find', () => ({
  titrePropTitreEtapeFind: jest.fn()
}))

const titresGetMock = mocked(titresGet, true)
const titrePropTitreEtapeFindMock = mocked(titrePropTitreEtapeFind, true)

console.info = jest.fn()

describe("propriétés (étape) d'un titre", () => {
  test('trouve 8 propriétés dans les étapes', async () => {
    titrePropTitreEtapeFindMock.mockReturnValue({
      id: 'etape-id'
    } as ITitreEtape)
    titresGetMock.mockResolvedValue([
      ({ titulairesTitreEtapeId: null } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresPropsEtapesIdsUpdate()

    expect(titresUpdatedRequests.length).toEqual(1)
    expect(console.info).toHaveBeenCalled()
  })

  test('ne trouve pas de propriétés dans les étapes', async () => {
    titrePropTitreEtapeFindMock.mockReturnValue(null)
    titresGetMock.mockResolvedValue([
      ({ titulairesTitreEtapeId: null } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresPropsEtapesIdsUpdate()

    expect(titresUpdatedRequests.length).toEqual(0)
  })
})
