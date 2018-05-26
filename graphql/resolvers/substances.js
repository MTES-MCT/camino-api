const { substance, substances } = require('../../postgres/queries/substances')

const resolvers = {
  async substances(_, context) {
    return substances({}, context)
  },

  async substance({ id }, context) {
    return substance(id, context)
  }
}

module.exports = resolvers
