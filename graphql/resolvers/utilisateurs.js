const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config')

const {
  utilisateurGet,
  utilisateurAdd
} = require('../../postgres/queries/utilisateurs')

const resolvers = {
  token: async ({ id, motDePasse }, context, info) => {
    const errors = []
    let res
    let utilisateur

    if (!id) {
      errors.push('id manquante')
    }

    if (!motDePasse) {
      errors.push('mot de passe manquant')
    }

    if (id && motDePasse) {
      utilisateur = await utilisateurGet({ id })

      if (utilisateur) {
        const valid = await bcrypt.compare(motDePasse, utilisateur.motDePasse)

        if (!valid) {
          errors.push('mot de passe incorrect')
        }
      } else {
        errors.push("pas d'utilisateur avec cette id")
      }
    }

    if (!errors.length && utilisateur) {
      res = jwt.sign(
        {
          id: utilisateur.id,
          email: utilisateur.email,
          role: utilisateur.role
        },
        jwtSecret,
        { expiresIn: '1y' }
      )
    } else {
      throw new Error(errors.join(', '))
    }

    return res
  },

  utilisateurAjouter: async ({ utilisateur }, context) => {
    utilisateur.motDePasse = await bcrypt.hash(utilisateur.motDePasse, 10)
    const res = await utilisateurAdd(utilisateur)

    return res
  },

  moi: async (variables, context, info) => {
    console.log(context.user)
    return context.user
  }
}

module.exports = resolvers
