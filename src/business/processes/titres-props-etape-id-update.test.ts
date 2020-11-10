import { mocked } from 'ts-jest/utils'
import titresPropsEtapeIdUpdate from './titres-props-etape-id-update'
import titrePropEtapeIdFind from '../rules/titre-prop-etape-id-find'
import { titresGet } from '../../database/queries/titres'
import Titres from '../../database/models/titres'

jest.mock('../../database/queries/titres', () => ({
  titreUpdate: jest.fn().mockResolvedValue(true),
  titresGet: jest.fn()
}))

jest.mock('../rules/titre-prop-etape-id-find', () => ({
  default: jest.fn()
}))

const titresGetMock = mocked(titresGet, true)
const titrePropEtapeIdFindMock = mocked(titrePropEtapeIdFind, true)

console.info = jest.fn()

describe("propriétés (étape) d'un titre", () => {
  test('trouve 8 propriétés dans les étapes', async () => {
    titrePropEtapeIdFindMock.mockReturnValue('etape-id')
    titresGetMock.mockResolvedValue([
      ({ titulairesTitreEtapeId: null } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresPropsEtapeIdUpdate()

    expect(titresUpdatedRequests.length).toEqual(1)
    expect(console.info).toHaveBeenCalled()
  })

  test('ne trouve pas de propriétés dans les étapes', async () => {
    titrePropEtapeIdFindMock.mockReturnValue(null)
    titresGetMock.mockResolvedValue([
      ({ titulairesTitreEtapeId: null } as unknown) as Titres
    ])

    const titresUpdatedRequests = await titresPropsEtapeIdUpdate()

    expect(titresUpdatedRequests.length).toEqual(0)
  })
})
