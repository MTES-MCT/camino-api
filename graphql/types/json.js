const { GraphQLScalarType } = require('graphql')

const json = new GraphQLScalarType({
  name: 'json',
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

module.exports = json
