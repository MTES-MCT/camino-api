// sépare une chaîne de caractère à chaque espace
// supprime les parenthèses
// retourne un tableau

const stringSplit = (string: string) =>
  //        Code/Regex               |  signification
  // ===============================================================================================================================
  //             [                ]  |  matche les caractères qui sont...
  //              a-z                |  ...ou bien une lettre minuscule
  //                 A-Z             |  ...ou bien une lettre majuscule
  //                    0-9          |  ...ou bien un chiffre
  //                       À-ž       |  ...ou bien un caractère accentué (https://stackoverflow.com/questions/30225552/regex-for-diacritics)
  //                          -      |  ...ou bien le tiret lui même
  //                           &     |  ...ou bien le & commercial
  //                            *    |  ...ou bien le *
  //                             /   |  ...ou encore le /
  //                               + |  quantificateur de ce qui précède : 1 fois ou plus
  //                                 |  une suite de caractère matchés forme un mot
  //                                 |  tout caractère qui n'est pas matché n'est pas conservé et représente un séparateur
  //                                 |  car n'étant pas matché il ne fait pas partie du mot, c'est par exemple le cas pour : ( ) " ' _ , . ; [espace]
  //                                 |  la méthode String.match renvoie un tableau des occurences matchées
  //                                 |  Pour chaque élément du tableau
  //    .replace(         ,     )    |  on remplace
  //             /^\/(.*)/           |  cette chaîne...
  //              ^                  |     commence par
  //               \                 |     annule le caractère spécial suivant
  //                /                |     un slash
  //                 (  )            |     suivi d'un groupement contenu entre les parenthèses et référencé par #1
  //                  .              |     n'importe quel caractère
  //                   *             |     0 ou n fois
  //                        '$1'     |  ...par cette chaîne = insertion du groupement #1
  //    .replace(         ,     )    |  on remplace
  //             /(.*)\/$/           |  cette chaîne...
  //                    $            |     fini par
  //                  \              |     annule le caractère spécial suivant
  //                   /             |     un slash
  //              (  )               |     précédé d'un groupement contenu entre les parenthèses et référencé par #1
  //               .                 |     n'importe quel caractère
  //                *                |     0 ou n fois
  //                        '$1'     |  ...par cette chaîne = insertion du groupement #1
  //    .replace(        ,     )     |  on remplace
  //             /^-(.*)/            |  cette chaîne...
  //              ^                  |     commence par
  //               -                 |     un tiret
  //                (  )             |     suivi d'un groupement contenu entre les parenthèses et référencé par #1
  //                 .               |     n'importe quel caractère
  //                  *              |     0 ou n fois
  //                       '$1'      |  ...par cette chaîne = insertion du groupement #1
  //    .replace(        ,     )     |  on remplace
  //             /(.*)-$/            |  cette chaîne...
  //                   $             |     fini par
  //                  -              |     un tiret
  //              (  )               |     précédé d'un groupement contenu entre les parenthèses et référencé par #1
  //               .                 |     n'importe quel caractère
  //                *                |     0 ou n fois
  //                       '$1'      |  ...par cette chaîne = insertion du groupement #1
  (string.match(/[a-zA-Z0-9À-ž-&*/]+/g) || [])
    .map(e =>
      e
        .replace(/^\/(.*)/, '$1')
        .replace(/(.*)\/$/, '$1')
        .replace(/^-(.*)/, '$1')
        .replace(/(.*)-$/, '$1')
    )
    .filter(e => e) as string[]

export { stringSplit }
