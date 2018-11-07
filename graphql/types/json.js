const { GraphQLScalarType } = require('graphql')

const Json = new GraphQLScalarType({
  name: 'Json',
  serialize: value => {
    // console.log('serialize value', value);
    return value
  },
  parseValue: value => {
    // console.log('parseValue value', value);
    return value
  },
  parseLiteral: ast => {
    // console.log('parseLiteral ast', ast);
    return ast.value
  }
})

module.exports = Json
