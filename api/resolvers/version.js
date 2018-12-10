const npmPackage = require('../../package.json')

const resolvers = {
  version(variables, context, info) {
    return npmPackage.version
  }
}

module.exports = resolvers
