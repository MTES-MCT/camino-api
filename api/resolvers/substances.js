const {
  substanceGet,
  substancesGet
} = require('../../database/queries/substances')

const resolvers = {
  async substances(_, context) {
    return substancesGet({})
  },
  async substance({ id }, context) {
    return substanceGet(id)
  }
}

module.exports = resolvers
