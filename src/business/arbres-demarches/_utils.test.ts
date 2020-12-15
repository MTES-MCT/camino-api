import { arbreErreursGet } from './_utils'

test('teste arbreErreursGet', () => {
  const octArbreErreursGet = arbreErreursGet('oct', 'arm')

  expect(octArbreErreursGet).toBeTruthy()
  expect(octArbreErreursGet([], {})).toBeNull()
  expect(octArbreErreursGet([{ arbreTypeId: 'aaa' }], {})).toEqual(
    'L’étape aaa n’existe pas dans l’arbre'
  )
})
