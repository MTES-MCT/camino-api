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

const utilisateurErreurs = async utilisateur => {
  const errors = []

  if (!utilisateur.id) {
    errors.push('id manquante')
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(utilisateur.id)) {
    errors.push(
      "l'id doit contenir uniquement des minuscules, des chiffres et tirets"
    )
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

      if (permissionsCheck(utilisateur, ['editeur', 'lecteur'])) {
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
    if (context.user && permissionsCheck(context.user, ['super', 'admin'])) {
      if (permissionsCheck(context.user, ['admin'])) {
        if (permissionIds) {
          permissionIds = permissionIds.filter(id =>
            ['admin', 'editeur', 'lecteur'].includes(id)
          )
        } else {
          permissionIds = ['admin', 'editeur', 'lecteur']
        }
      }

      const utilisateurs = await utilisateursGet({
        noms,
        entrepriseIds,
        administrationIds,
        permissionIds
      })

      return utilisateurs
    } else {
      throw new Error("droits insuffisants pour effectuer l'opération")
    }
  },

  async utilisateurIdentifier(variables, context, info) {
    const utilisateur = context.user && (await utilisateurGet(context.user.id))

    return utilisateur
  },

  async utilisateurConnecter({ email, motDePasse }, context, info) {
    const errors = []
    let token
    let utilisateur

    if (!email) {
      errors.push('email manquante')
    }

    if (!motDePasse) {
      errors.push('mot de passe manquant')
    }

    if (email && motDePasse) {
      utilisateur = await utilisateurByEmailGet(email)

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
          permission: utilisateur.permission
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
      const errors = await utilisateurErreurs(utilisateur)
      let res

      if (utilisateur.email) {
        const utilisateurWithTheSameEmail = await utilisateurByEmailGet(
          utilisateur.email
        )
        if (utilisateurWithTheSameEmail) {
          errors.push('un utilisateur avec cet email existe déjà')
        }
      }

      if (!utilisateur.motDePasse) {
        errors.push('mot de passe manquant')
      } else if (utilisateur.motDePasse.length < 8) {
        errors.push('le mot de passe doit contenir au moins 8 caractères')
      }

      if (utilisateur.id) {
        const utilisateurWithTheSameId = await utilisateurGet(utilisateur.id)
        if (utilisateurWithTheSameId) {
          errors.push('un utilisateur avec cette id existe déjà')
        }
      }

      if (!errors.length) {
        utilisateur.motDePasse = await bcrypt.hash(utilisateur.motDePasse, 10)
        res = await utilisateurAdd(utilisateur)
      } else {
        throw new Error(errors.join(', '))
      }

      return res
    } else {
      throw new Error("droits insuffisants pour effectuer l'opération")
    }
  },

  async utilisateurModifier({ utilisateur }, context) {
    if (
      permissionsCheck(context.user, ['super', 'admin']) ||
      context.user.id === utilisateur.id
    ) {
      const errors = await utilisateurErreurs(utilisateur)
      let res

      if (!errors.length) {
        res = await utilisateurUpdate(utilisateur)
      } else {
        throw new Error(errors.join(', '))
      }

      return res
    } else {
      throw new Error("droits insuffisants pour effectuer l'opération")
    }
  },

  async utilisateurSupprimer({ id }, context) {
    if (
      permissionsCheck(context.user, ['super', 'admin']) ||
      context.user.id === id
    ) {
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
    } else {
      throw new Error("droits insuffisants pour effectuer l'opération")
    }
  },

  async utilisateurMotDePasseModifier(
    { id, motDePasse, motDePasseNouveau1, motDePasseNouveau2 },
    context
  ) {
    if (
      permissionsCheck(context.user, ['super', 'admin']) ||
      context.user.id === id
    ) {
      const errors = []
      let res

      if (!id) {
        errors.push('id manquante')
      }

      if (!motDePasse) {
        errors.push('mot de passe manquant')
      }

      if (!motDePasseNouveau1) {
        errors.push('nouveau mot de passe manquant')
      } else if (motDePasseNouveau1.length < 8) {
        errors.push('le mot de passe doit contenir au moins 8 caractères')
      }

      if (!motDePasseNouveau2) {
        errors.push('vérification du nouveau mot de passe manquante')
      }

      if (motDePasseNouveau1 !== motDePasseNouveau2) {
        errors.push(
          'le nouveau mot de passe est la vérification sont différents'
        )
      }

      if (id && motDePasse) {
        const utilisateur = await utilisateurGet(id)

        if (utilisateur) {
          const valid = await bcrypt.compare(motDePasse, utilisateur.motDePasse)

          if (!valid) {
            errors.push('mot de passe incorrect')
          }
        } else {
          errors.push("pas d'utilisateur avec cette id")
        }
      }

      if (!errors.length) {
        res = await utilisateurUpdate({
          id,
          motDePasse: await bcrypt.hash(motDePasseNouveau1, 10)
        })
      } else {
        throw new Error(errors.join(', '))
      }

      return res
    } else {
      throw new Error("droits insuffisants pour effectuer l'opération")
    }
  }
}

module.exports = resolvers
