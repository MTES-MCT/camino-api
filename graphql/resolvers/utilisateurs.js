const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const emailRegex = require('email-regex')
const { jwtSecret } = require('../../config')

const {
  utilisateurGet,
  utilisateursGet,
  utilisateurAdd,
  utilisateurUpdate,
  utilisateurRemove,
  utilisateurByEmailGet
} = require('../../postgres/queries/utilisateurs')

const { permissionsCheck } = require('./_permissions')

const utilisateurErreurs = utilisateur => {
  const errors = []

  if (!utilisateur.id) {
    errors.push('id manquante')
  } else {
    if (utilisateur.id.length < 6) {
      errors.push("l'id doit contenir au moins 6 caractères")
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(utilisateur.id)) {
      errors.push(
        "l'id doit contenir uniquement des minuscules, des chiffres et tirets"
      )
    }
  }

  if (!utilisateur.email) {
    errors.push('email manquant')
  } else if (!emailRegex({ exact: true }).test(utilisateur.email)) {
    errors.push('adresse email invalide')
  }

  return errors
}

const resolvers = {
  async utilisateur({ id }, context, info) {
    if (
      permissionsCheck(context.user, ['super']) ||
      (context.user && context.user.id === id)
    ) {
      return utilisateurGet(id)
    } else if (context.user && permissionsCheck(context.user, ['admin'])) {
      const utilisateur = await utilisateurGet(id)

      if (permissionsCheck(utilisateur, ['edit', 'user'])) {
        return utilisateur
      } else {
        return null
      }
    }

    return null
  },

  async utilisateurs(
    { entrepriseIds, administrationIds, permissionIds, noms },
    context,
    info
  ) {
    if (context.user) {
      if (permissionsCheck(context.user, ['admin'])) {
        if (permissionIds) {
          permissionIds = permissionIds.filter(id =>
            ['edit', 'user'].includes(id)
          )
        } else {
          permissionIds = ['edit', 'user']
        }
      } else if (permissionsCheck(context.user, ['edit', 'user'])) {
        permissionIds = []
      }

      const utilisateurs = await utilisateursGet({
        noms,
        entrepriseIds,
        administrationIds,
        permissionIds
      })

      return utilisateurs
    }

    return null
  },

  async utilisateurIdentifier(variables, context, info) {
    const utilisateur = context.user && (await utilisateurGet(context.user.id))

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
      utilisateur = await utilisateurGet(id)

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
    if (permissionsCheck(context.user, ['super', 'admin'])) {
      const errors = utilisateurErreurs(utilisateur)
      let res

      if (!utilisateur.motDePasse) {
        errors.push('mot de passe manquant')
      } else if (utilisateur.motDePasse.length < 8) {
        errors.push('le mot de passe doit contenir au moins 8 caractères')
      }

      if (utilisateur.email) {
        const utilisateurWithTheSameEmail = await utilisateurByEmailGet(
          utilisateur.email
        )
        if (utilisateurWithTheSameEmail) {
          errors.push('un utilisateur avec cet email existe déja')
        }
      }

      if (!errors.length) {
        utilisateur.motDePasse = await bcrypt.hash(utilisateur.motDePasse, 10)
        res = await utilisateurAdd(utilisateur)
      } else {
        throw new Error(errors.join(', '))
      }

      return res
    }

    return null
  },

  async utilisateurModifier({ utilisateur }, context) {
    if (permissionsCheck(context.user, ['super', 'admin'])) {
      const errors = utilisateurErreurs(utilisateur)
      let res

      if (!errors.length) {
        res = await utilisateurUpdate(utilisateur)
      } else {
        throw new Error(errors.join(', '))
      }

      return res
    }

    return null
  },

  async utilisateurSupprimer({ id }, context) {
    if (permissionsCheck(context.user, ['super', 'admin'])) {
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
    }

    return null
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
