import { ITitre } from '../../types'
import { mocked } from 'ts-jest/utils'
import titresPropsEtapeIdUpdate from './titres-props-etape-id-update'
import titrePropEtapeIdFind from '../rules/titre-prop-etape-id-find'

jest.mock('../../database/queries/titres', () => ({
  titreUpdate: jest.fn().mockResolvedValue(true)
}))

jest.mock('../rules/titre-prop-etape-id-find', () => ({
  default: jest.fn()
}))

const titrePropEtapeIdFindMock = mocked(titrePropEtapeIdFind, true)

console.log = jest.fn()

describe("propriétés (étape) d'un titre", () => {
  test('trouve 8 propriétés dans les étapes', async () => {
    titrePropEtapeIdFindMock.mockReturnValue('etape-id')

    const titresUpdatedRequests = await titresPropsEtapeIdUpdate([
      ({ titulairesTitreEtapeId: null } as unknown) as ITitre
    ])

    expect(titresUpdatedRequests.length).toEqual(1)
    expect(console.log).toHaveBeenCalled()
  })

  test('ne trouve pas de propriétés dans les étapes', async () => {
    titrePropEtapeIdFindMock.mockReturnValue(null)

    const titresUpdatedRequests = await titresPropsEtapeIdUpdate([
      ({ titulairesTitreEtapeId: null } as unknown) as ITitre
    ])

    expect(titresUpdatedRequests.length).toEqual(0)
  })
})
