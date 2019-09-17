import titresPropsEtapeIdUpdate from './titres-props-etape-id-update'
import titrePropEtapeIdFind from '../rules/titre-prop-etape-id-find'

jest.mock('../../database/queries/titres', () => ({
  titreUpdate: jest.fn().mockResolvedValue()
}))

jest.mock('../rules/titre-prop-etape-id-find', () => ({
  default: jest.fn()
}))

console.log = jest.fn()

describe("propriétés (étape) d'un titre", () => {
  test('trouve 8 propriétés dans les étapes', async () => {
    titrePropEtapeIdFind.mockImplementation(() => 'etape-id')
    const titresUpdatedRequests = await titresPropsEtapeIdUpdate([{}])

    expect(titresUpdatedRequests.length).toEqual(1)
    expect(console.log).toHaveBeenCalled()
  })

  test('ne trouve pas de propriétés dans les étapes', async () => {
    titrePropEtapeIdFind.mockImplementation(() => undefined)
    const titresUpdatedRequests = await titresPropsEtapeIdUpdate([{}])

    expect(titresUpdatedRequests.length).toEqual(0)
  })
})
