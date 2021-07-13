import { documentsTypesFormat } from './etapes-types'

describe('teste etapes types format', () => {
  test.each`
    documentsTypes                       | documentsTypesSpecifiques            | result
    ${undefined}                         | ${undefined}                         | ${[]}
    ${[]}                                | ${undefined}                         | ${[]}
    ${undefined}                         | ${[]}                                | ${[]}
    ${[{ id: 'acr', optionnel: false }]} | ${undefined}                         | ${[{ id: 'acr', optionnel: false }]}
    ${undefined}                         | ${[{ id: 'acr', optionnel: false }]} | ${[{ id: 'acr', optionnel: false }]}
    ${[{ id: 'acr', optionnel: false }]} | ${[{ id: 'acr', optionnel: true }]}  | ${[{ id: 'acr', optionnel: true }]}
    ${[{ id: 'acr', optionnel: true }]}  | ${[{ id: 'acr', optionnel: false }]} | ${[{ id: 'acr', optionnel: false }]}
  `(
    'documentsTypesFormat',
    ({ documentsTypes, documentsTypesSpecifiques, result }) => {
      expect(
        documentsTypesFormat(documentsTypes, documentsTypesSpecifiques)
      ).toEqual(result)
    }
  )
})
