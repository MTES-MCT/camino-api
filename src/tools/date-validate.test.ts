import { dateValidate } from './date-validate'

describe('comparaison entre des objets', () => {
  test("retourne une erreur si aucune date n'est fournie", () => {
    const res = dateValidate(null)

    expect(res).toBe('Date manquante')
  })

  test('retourne null si la date est valide', () => {
    const res = dateValidate('1910-01-01')

    expect(res).toBe(null)
  })

  test('retourne une erreur la date est invalide', () => {
    const res = dateValidate('1910-123123123-123123113')

    expect(res).toBe('Date invalide')
  })
})
