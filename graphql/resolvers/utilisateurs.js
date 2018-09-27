const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config')

const {
  utilisateurGet,
  utilisateurAdd
} = require('../../postgres/queries/utilisateurs')

const resolvers = {
  utilisateurIdentifier: async ({ id, password }, context, info) => {
    const errors = []
    if (!id) {
      errors.push('id manquante')
    }

    if (!password) {
      errors.push('mot de passe manquant')
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '))
    }

    const utilisateur = await utilisateurGet({ id, password })

    if (!utilisateur) {
      throw new Error("Pas d'utilisateur avec cette id.")
    }

    const valid = await bcrypt.compare(password, utilisateur.password)

    if (!valid) {
      throw new Error('Mot de passe incorrect')
    }

    const token = jwt.sign(
      {
        id: utilisateur.id,
        email: utilisateur.email
      },
      jwtSecret,
      { expiresIn: '1y' }
    )
    console.log(token)
    return { token }
  },

  utilisateurAjouter: async ({ utilisateur }, context) => {
    utilisateur.password = await bcrypt.hash(utilisateur.password, 10)
    const res = await utilisateurAdd(utilisateur, context.user)

    return res
  }
}

module.exports = resolvers
