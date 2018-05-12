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

const statutDescription = `
  - en instruction
  - valide 
  - échu
`

const Statut = makeCustomEnumScalar('Statut', statutDescription, [
  'en instruction',
  'valide',
  'échu'
])

const Travaux = new GraphQLEnumType({
  name: 'Travaux',
  values: {
    ins: { value: 'en instruction' },
    val: { value: 'valide' },
    ech: { value: 'échu' }
  }
})

// const Travaux = {
//   ins: 'en instruction',
//   val: 'valide',
//   ech: 'échu'
// }

module.exports = {
  Statut,
  Travaux
}
