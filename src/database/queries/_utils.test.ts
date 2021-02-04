import { stringSplit } from './_utils'

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
