import { demarcheEtatsValidate } from './_utils-test'

test('teste EtatsValidate', () => {
  const octEtatsValidate = demarcheEtatsValidate('oct', 'arm')

  expect(octEtatsValidate).toBeTruthy()
  expect(octEtatsValidate([], {})).toHaveLength(0)
  expect(octEtatsValidate([{ typeId: 'aaa' }], {})).toEqual([
    'l’étape aaa n’existe pas dans l’arbre'
  ])
})
