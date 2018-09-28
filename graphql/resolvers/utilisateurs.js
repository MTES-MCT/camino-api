const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config')

const {
  utilisateurGet,
  utilisateurAdd
} = require('../../postgres/queries/utilisateurs')

const resolvers = {
  utilisateurToken: async ({ id, password }, context, info) => {
    console.log({ id, password })
    const errors = []
    let token

    if (!id) {
      errors.push('Id manquante.')
    }

    if (!password) {
      errors.push('Mot de passe manquant.')
    }

    if (id && password) {
      const utilisateur = await utilisateurGet({ id })

      if (utilisateur) {
        const valid = await bcrypt.compare(password, utilisateur.password)

        if (!valid) {
          errors.push('Mot de passe incorrect.')
        }
      } else {
        errors.push("Pas d'utilisateur avec cette id.")
      }

      if (!errors.length) {
        token = jwt.sign(
          {
            id: utilisateur.id
          },
          jwtSecret,
          { expiresIn: '1y' }
        )
      }
    }

    return { token, errors }
  },

  utilisateurAjouter: async ({ utilisateur }, context) => {
    utilisateur.password = await bcrypt.hash(utilisateur.password, 10)
    const res = await utilisateurAdd(utilisateur, context.user)

    return res
  }
}

module.exports = resolvers
