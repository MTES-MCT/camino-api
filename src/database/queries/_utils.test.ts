import { stringSplit } from './_utils'

// liste de champs en entrée
// chaque élément est une chaîne de caractères
const inputFields = [
  'Bâgé-le-Châtel',
  'La Chapelle-en-Vexin',
  'Saül',
  'Saint-Élie',
  'andalousite / sillimanite / kyanite - (cyanite - disthène)',
  'cendres volcaniques riches en silice',
  '2013-0021-MI',
  'DEB 2013-0021-MI',
  '2013-002',
  '01/1880',
  'amazon gold',
  'TEREGA (TIGF)',
  'EnCore (E&P) Limited',
  'nom1, nom2, nom3',
  'nom1*nom2'
]

// liste de champs en sortie
// chaque élément est une liste de chaînes de caractères
// (stringSplit renvoie une liste)
const outputFields = [
  ['Bâgé-le-Châtel'],
  ['La', 'Chapelle-en-Vexin'],
  ['Saül'],
  ['Saint-Élie'],
  [
    'andalousite',
    '/',
    'sillimanite',
    '/',
    'kyanite',
    '-',
    'cyanite',
    '-',
    'disthène'
  ],
  ['cendres', 'volcaniques', 'riches', 'en', 'silice'],
  ['2013-0021-MI'],
  ['DEB', '2013-0021-MI'],
  ['2013-002'],
  ['01/1880'],
  ['amazon', 'gold'],
  ['TEREGA', 'TIGF'],
  ['EnCore', 'E', 'P', 'Limited'],
  ['nom1', 'nom2', 'nom3'],
  ['nom1', 'nom2']
]

describe('méthode stringSplit de _utils', () => {
  test('la conversion des saisies est correct', () => {
    expect(inputFields.map(i => stringSplit(i))).toEqual(outputFields)
  })
})
