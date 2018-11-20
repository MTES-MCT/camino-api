const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const emailRegex = require('email-regex')
const { jwtSecret } = require('../../config/index')
const mailer = require('../../tools/mailer/index')

const {
  utilisateurGet,
  utilisateursGet,
  utilisateurAdd,
  utilisateurUpdate,
  utilisateurRemove,
  utilisateurByEmailGet
} = require('../../postgres/queries/utilisateurs')

const permissionsCheck = require('./_permissions-check')

const permissionsVisibleForAdmin = [
  'admin',
  'editeur',
  'lecteur',
  'entreprise',
  'defaut'
]

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

      if (permissionsCheck(utilisateur, permissionsVisibleForAdmin)) {
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
            permissionsVisibleForAdmin.includes(id)
          )
        } else {
          permissionIds = permissionsVisibleForAdmin
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
    const utilisateur =
      context.user &&
      context.user.login &&
      (await utilisateurGet(context.user.id))

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
          permission: utilisateur.permission,
          login: true
        },
        jwtSecret
      )
    } else {
      throw new Error(errors.join(', '))
    }

    return { token, utilisateur }
  },

  async utilisateurAjouter({ utilisateur }, context) {
    const errors = await utilisateurErreurs(utilisateur)

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

    if (
      !permissionsCheck(context.user, ['super', 'admin']) ||
      !utilisateur.permission
    ) {
      utilisateur.permission = { id: 'defaut' }
    }

    if (
      !permissionsCheck(context.user, ['super']) &&
      utilisateur.permission.id === 'super'
    ) {
      errors.push(
        'droits insuffisants pour créer un utilisateur avec ces permissions'
      )
    }

    console.log(utilisateur)

    if (!errors.length) {
      utilisateur.motDePasse = await bcrypt.hash(utilisateur.motDePasse, 10)
      const res = await utilisateurAdd(utilisateur)

      return res
    } else {
      throw new Error(errors.join(', '))
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
          'le nouveau mot de passe et la vérification sont différents'
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
        const res = await utilisateurUpdate({
          id,
          motDePasse: await bcrypt.hash(motDePasseNouveau1, 10)
        })

        return res
      } else {
        throw new Error(errors.join(', '))
      }
    } else {
      throw new Error("droits insuffisants pour effectuer l'opération")
    }
  },

  async utilisateurMotDePasseEmailEnvoyer({ email }, context) {
    const errors = []
    let utilisateur

    if (!email) {
      errors.push('email manquant')
    } else if (!emailRegex({ exact: true }).test(email)) {
      errors.push('adresse email invalide')
    } else {
      utilisateur = await utilisateurByEmailGet(email)

      if (!utilisateur) {
        errors.push("pas d'utilisateur enregistré avec cet email")
      }
    }

    if (!errors.length) {
      const token = jwt.sign({ id: utilisateur.id }, jwtSecret)

      const url = `${process.env.UI_URL}/mot-de-passe?token=${token}`

      const subject = `[Camino] Initialisation de votre mot de passe`
      const text = `Pour initialiser votre mot de passe, rendez-vous sur cette url: ${url}  (lien valable 15 minutes).`
      const html = `<p>Pour initialiser votre mot de passe, <a href="${url}">cliquez ici</a> (lien valable 15 minutes).</p>`

      try {
        mailer(email, subject, text, html)
      } catch (e) {
        return "erreur lors de l'envoi d'email"
      }

      return 'email envoyé'
    } else {
      throw new Error(errors.join(', '))
    }
  },

  async utilisateurMotDePasseInitialiser(
    { motDePasse1, motDePasse2 },
    context
  ) {
    const errors = []
    const now = Math.round(new Date().getTime() / 1000)
    const delay = 60 * 15 // 15 minutes

    if (now - context.user.iat > delay) {
      errors.push('délai expiré')
    } else {
      if (!motDePasse1) {
        errors.push('nouveau mot de passe manquant')
      } else if (motDePasse1.length < 8) {
        errors.push('le mot de passe doit contenir au moins 8 caractères')
      }

      if (!motDePasse2) {
        errors.push('vérification du nouveau mot de passe manquante')
      }

      if (motDePasse1 !== motDePasse2) {
        errors.push(
          'le nouveau mot de passe et la vérification sont différents'
        )
      }

      if (context.user.id) {
        const utilisateur = await utilisateurGet(context.user.id)

        if (!utilisateur) {
          errors.push("pas d'utilisateur avec cette id")
        }
      }
    }

    if (!errors.length) {
      const res = await utilisateurUpdate({
        id: context.user.id,
        motDePasse: await bcrypt.hash(motDePasse1, 10)
      })

      console.log(res)

      return 'mot de passe mis à jour'
    } else {
      throw new Error(errors.join(', '))
    }
  }
}

module.exports = resolvers
