const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const {
  utilisateurGet,
  utilisateurAjouter
} = require('../../postgres/queries/utilisateurs')

const resolvers = {
  utilisateurIdentifier: async ({ id, password }, context, info) => {
    const utilisateur = await utilisateurGet(id)

    if (!utilisateur) {
      throw new Error('No utilisateur with that id')
    }

    const valid = await bcrypt.compare(password, utilisateur.password)

    if (!valid) {
      throw new Error('Incorrect password')
    }

    // return json web token
    return jwt.sign(
      {
        id: utilisateur.id,
        email: utilisateur.email
      },
      'somesuperdupersecret',
      { expiresIn: '1y' }
    )
  },

  utilisateurAjouter: async ({ utilisateur }, context) => {
    utilisateur.password = await bcrypt.hash(utilisateur.password, 10)
    const res = await utilisateurAjouter(utilisateur, context.user)

    return res
  }
}

module.exports = resolvers
