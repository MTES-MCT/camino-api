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

  test.each`
    description  | descriptionSpecifique | dtSpecifiqueDescription | result
    ${undefined} | ${undefined}          | ${undefined}            | ${undefined}
    ${'des'}     | ${undefined}          | ${undefined}            | ${'des'}
    ${'des'}     | ${'des1'}             | ${undefined}            | ${'des1'}
    ${'des'}     | ${'des1'}             | ${'des2'}               | ${'des2'}
    ${undefined} | ${'des1'}             | ${'des2'}               | ${'des2'}
    ${'des'}     | ${'des1'}             | ${'des2'}               | ${'des2'}
    ${undefined} | ${undefined}          | ${'des2'}               | ${'des2'}
    ${undefined} | ${'des1'}             | ${undefined}            | ${'des1'}
  `(
    'test la déclaration de la description',
    ({
      description,
      descriptionSpecifique,
      dtSpecifiqueDescription,
      result
    }) => {
      expect(
        documentsTypesFormat(
          [
            {
              id: 'acr',
              nom: 'test',
              optionnel: false,
              description,
              descriptionSpecifique
            }
          ],
          [
            {
              id: 'acr',
              nom: 'test',
              optionnel: false,
              description: dtSpecifiqueDescription
            }
          ]
        )[0].description
      ).toEqual(result)
    }
  )
})
