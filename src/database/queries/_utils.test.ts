import { stringSplit } from './_utils'
const each = require('jest-each').default

// const fields: { input: string; output: string[] }[] = [
//   { input: 'Bâgé-le-Châtel', output: ['Bâgé-le-Châtel'] },
//   { input: 'La Chapelle-en-Vexin', output: ['La', 'Chapelle-en-Vexin'] },
//   { input: 'Saül', output: ['Saül'] },
//   { input: 'Saint-Élie', output: ['Saint-Élie'] },
//   {
//     input: 'andalousite / sillimanite / kyanite - (cyanite - disthène)',
//     output: ['andalousite', 'sillimanite', 'kyanite', 'cyanite', 'disthène']
//   },
//   {
//     input: 'cendres volcaniques riches en silice',
//     output: ['cendres', 'volcaniques', 'riches', 'en', 'silice']
//   },
//   { input: '2013-0021-MI', output: ['2013-0021-MI'] },
//   { input: 'DEB 2013-0021-MI', output: ['DEB', '2013-0021-MI'] },
//   { input: '2013-002', output: ['2013-002'] },
//   { input: '01/1880', output: ['01/1880'] },
//   { input: 'amazon gold', output: ['amazon', 'gold'] },
//   { input: 'TEREGA (TIGF)', output: ['TEREGA', 'TIGF'] },
//   { input: 'EnCore (E&P) Limited', output: ['EnCore', 'E&P', 'Limited'] },
//   { input: 'nom1, nom2, nom3', output: ['nom1', 'nom2', 'nom3'] },
//   { input: 'nom1*nom2', output: ['nom1*nom2'] }
// ]

// describe('sépare les groupes de mots', () => {
//   // TODO: ce qui se passe ici est assez confus
//   // les logs du test ne disent pas ce qui se passe
//   each(fields).test(
//     '%# convertit les chaines de caractères en groupes de mots',
//     (field: { input: string; output: string[] }) => {
//       expect(stringSplit(field.input)).toEqual(field.output)
//     }
//   )
// })

// const fields = [
//   ['Bâgé-le-Châtel', ['Bâgé-le-Châtel']],
//   ['La Chapelle-en-Vexin', ['La', 'Chapelle-en-Vexin']],
//   ['Saül', ['Saül']],
//   ['Saint-Élie', ['Saint-Élie']],
//   [
//     'andalousite / sillimanite / kyanite - (cyanite - disthène)',
//     ['andalousite', 'sillimanite', 'kyanite', 'cyanite', 'disthène']
//   ],
//   [
//     'cendres volcaniques riches en silice',
//     ['cendres', 'volcaniques', 'riches', 'en', 'silice']
//   ],
//   ['2013-0021-MI', ['2013-0021-MI']],
//   ['DEB 2013-0021-MI', ['DEB', '2013-0021-MI']],
//   ['2013-002', ['2013-002']],
//   ['01/1880', ['01/1880']],
//   ['amazon gold', ['amazon', 'gold']],
//   ['TEREGA (TIGF)', ['TEREGA', 'TIGF']],
//   ['EnCore (E&P) Limited', ['EnCore', 'E&P', 'Limited']],
//   ['nom1, nom2, nom3', ['nom1', 'nom2', 'nom3']],
//   ['nom1*nom2', ['nom1*nom2']]
// ]
// describe('sépare les groupes de mots', () => {
//   test.each(fields)(
//     '%# convertit les chaines de caractères en groupes de mots',
//     (input: string, output: string[]) => {
//       expect(stringSplit(input)).toEqual(output)
//     }
//   )
// })

describe('sépare les groupes de mots', () => {
  test.each`
    input                                                           | output
    ${'Bâgé-le-Châtel'}                                             | ${['Bâgé-le-Châtel']}
    ${'-Bâgé-le-Châtel'}                                            | ${['Bâgé-le-Châtel']}
    ${'- Bâgé-le-Châtel'}                                           | ${['Bâgé-le-Châtel']}
    ${'Bâgé-le-Châtel -'}                                           | ${['Bâgé-le-Châtel']}
    ${' -Bâgé-le-Châtel'}                                           | ${['Bâgé-le-Châtel']}
    ${'Bâgé-le-Châtel- '}                                           | ${['Bâgé-le-Châtel']}
    ${'La Chapelle-en-Vexin'}                                       | ${['La', 'Chapelle-en-Vexin']}
    ${'/La Chapelle-en-Vexin'}                                      | ${['La', 'Chapelle-en-Vexin']}
    ${'/ La Chapelle-en-Vexin'}                                     | ${['La', 'Chapelle-en-Vexin']}
    ${'La Chapelle-en-Vexin/'}                                      | ${['La', 'Chapelle-en-Vexin']}
    ${'La Chapelle-en-Vexin /'}                                     | ${['La', 'Chapelle-en-Vexin']}
    ${' /La Chapelle-en-Vexin'}                                     | ${['La', 'Chapelle-en-Vexin']}
    ${'La Chapelle-en-Vexin/ '}                                     | ${['La', 'Chapelle-en-Vexin']}
    ${'Saül'}                                                       | ${['Saül']}
    ${'Saint-Élie'}                                                 | ${['Saint-Élie']}
    ${'"Saint-Élie"'}                                               | ${['Saint-Élie']}
    ${"'Saint-Élie'"}                                               | ${['Saint-Élie']}
    ${'andalousite / sillimanite / kyanite - (cyanite - disthène)'} | ${['andalousite', 'sillimanite', 'kyanite', 'cyanite', 'disthène']}
    ${'cendres volcaniques riches en silice'}                       | ${['cendres', 'volcaniques', 'riches', 'en', 'silice']}
    ${'2013-0021-MI'}                                               | ${['2013-0021-MI']}
    ${'\\2013-0021-MI'}                                             | ${['2013-0021-MI']}
    ${'DEB 2013-0021-MI'}                                           | ${['DEB', '2013-0021-MI']}
    ${'2013-002'}                                                   | ${['2013-002']}
    ${'01/1880'}                                                    | ${['01/1880']}
    ${'amazon gold'}                                                | ${['amazon', 'gold']}
    ${'amazon_gold'}                                                | ${['amazon', 'gold']}
    ${'TEREGA (TIGF)'}                                              | ${['TEREGA', 'TIGF']}
    ${'EnCore (E&P) Limited'}                                       | ${['EnCore', 'E&P', 'Limited']}
    ${'nom1, nom2, nom3'}                                           | ${['nom1', 'nom2', 'nom3']}
    ${'nom1*nom2'}                                                  | ${['nom1*nom2']}
  `(
    'convertit la chaîne de caractères $input en liste de mots : $output',
    ({ input, output }) => {
      expect(stringSplit(input)).toEqual(output)
    }
  )
})
