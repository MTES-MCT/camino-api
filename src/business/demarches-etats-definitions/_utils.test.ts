import { demarcheEtatsValidate } from './_utils'

test('teste EtatsValidate', () => {
  const octEtatsValidate = demarcheEtatsValidate('oct', 'arm')

  expect(octEtatsValidate).toBeTruthy()
  expect(octEtatsValidate([], {})).toBeNull()
  expect(octEtatsValidate([{ etatId: 'aaa' }], {})).toEqual(
    'L’étape aaa n’existe pas dans l’arbre'
  )
})
