const { GraphQLScalarType, GraphQLEnumType } = require('graphql/type')

const makeCustomEnumScalar = (name, description, validValues) => {
  const checkValue = value => {
    const coerced = String(value)
    if (!validValues.includes(coerced)) {
      throw new TypeError(`${coerced} is not a valid value for scalar ${name}`)
    }
    return coerced
  }
  return new GraphQLScalarType({
    name,
    description,
    serialize: checkValue,
    parseValue: checkValue,
    parseLiteral: ast => checkValue(ast.value)
  })
}

const TypeNom = makeCustomEnumScalar(
  'TypeNom',
  `
- autorisation d'exploitation
- concession
- permis exclusif de recherches
`,
  ["autorisation d'exploitation", 'concession', 'permis exclusif de recherches']
)

const DomaineNom = makeCustomEnumScalar(
  'DomaineNom',
  `
- minéraux et métaux
- substances énergétiques
- stockage
- géothermie
`,
  ['minéraux et métaux', 'substances énergétiques', 'stockage', 'géothermie']
)

const StatutNom = makeCustomEnumScalar(
  'StatutNom',
  `
  - en instruction
  - valide 
  - échu
`,
  ['en instruction', 'valide', 'échu']
)

const TravauxNom = makeCustomEnumScalar(
  'StatutNom',
  `
  - en instruction
  - en cours 
  - achevés
`,
  ['en instruction', 'en cours', 'achevés']
)

module.exports = {
  TypeNom,
  DomaineNom,
  StatutNom,
  TravauxNom
}
