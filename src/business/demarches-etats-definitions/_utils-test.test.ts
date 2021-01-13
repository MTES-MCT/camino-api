import { demarcheEtatsValidate } from './_utils-test'

test('teste EtatsValidate', () => {
  const octEtatsValidate = demarcheEtatsValidate('oct', 'arm')

  expect(octEtatsValidate).toBeTruthy()
  expect(octEtatsValidate([], {})).toBeNull()
  expect(octEtatsValidate([{ typeId: 'aaa' }], {})).toEqual([
    'l’étape aaa n’existe pas dans l’arbre'
  ])
})
