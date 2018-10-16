const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const emailRegex = require('email-regex')
const { jwtSecret } = require('../../config')

const utilisateurErreurs = utilisateur => {
  const errors = []

  if (!utilisateur.id) {
    errors.push('id manquante')
  } else if (utilisateur.id.length < 6) {
    errors.push("l'id doit contenir au moins 6 caractères")
  }

  if (!utilisateur.email) {
    errors.push('email manquant')
  } else if (!emailRegex({ exact: true }).test(utilisateur.email)) {
    errors.push('adresse email invalide')
  }

  return errors
}

const {
  utilisateurGet,
  utilisateursGet,
  utilisateurAdd,
  utilisateurUpdate,
  utilisateurRemove
} = require('../../postgres/queries/utilisateurs')

const resolvers = {
  async utilisateur(variables, context, info) {
    return utilisateurGet({ id: variables.id })
  },

  async utilisateurs(
    { entrepriseIds, administrationIds, noms },
    context,
    info
  ) {
    const utilisateurs = await utilisateursGet({
      noms,
      entrepriseIds,
      administrationIds
    })

    return utilisateurs
  },

  async utilisateurIdentifier(variables, context, info) {
    const utilisateur =
      context.user && (await utilisateurGet({ id: context.user.id }))

    return utilisateur
  },

  async utilisateurConnecter({ id, motDePasse }, context, info) {
    const errors = []
    let token
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
      token = jwt.sign(
        {
          id: utilisateur.id,
          email: utilisateur.email,
          permissions: utilisateur.permissions
        },
        jwtSecret,
        { expiresIn: '1y' }
      )
    } else {
      throw new Error(errors.join(', '))
    }

    return { token, utilisateur }
  },

  async utilisateurAjouter({ utilisateur }, context) {
    const errors = utilisateurErreurs(utilisateur)
    let res
    console.log(utilisateur)

    if (!utilisateur.motDePasse) {
      errors.push('mot de passe manquant')
    } else if (utilisateur.motDePasse.length < 8) {
      errors.push('le mot de passe doit contenir au moins 8 caractères')
    }

    if (!errors.length) {
      utilisateur.motDePasse = await bcrypt.hash(utilisateur.motDePasse, 10)
      res = await utilisateurAdd(utilisateur)
    } else {
      throw new Error(errors.join(', '))
    }

    return res
  },

  async utilisateurModifier({ utilisateur }, context) {
    const errors = utilisateurErreurs(utilisateur)
    let res

    if (!errors.length) {
      res = await utilisateurUpdate(utilisateur)
    } else {
      throw new Error(errors.join(', '))
    }

    return res
  },

  async utilisateurSupprimer({ id }, context) {
    const errors = []
    let res

    if (!id) {
      errors.push('id manquante')
    }

    if (!errors.length) {
      res = await utilisateurRemove(id)
    } else {
      throw new Error(errors.join(', '))
    }

    return res
  },

  async utilisateurMotDePasseModifier({ id, motDePasse }, context) {
    const errors = []
    let res

    if (!id) {
      errors.push('id manquante')
    }

    if (!motDePasse) {
      errors.push('mot de passe manquant')
    }

    if (!errors.length) {
      res = await utilisateurUpdate({
        id,
        motDePasse
      })
    } else {
      throw new Error(errors.join(', '))
    }

    return res
  }
}

module.exports = resolvers
