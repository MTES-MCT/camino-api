const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const emailRegex = require('email-regex')
const cryptoRandomString = require('crypto-random-string')
const mailer = require('../../tools/mailer/index')

const {
  utilisateurGet,
  utilisateursGet,
  utilisateurAdd,
  utilisateurUpdate,
  utilisateurRemove,
  utilisateurByEmailGet
} = require('../../database/queries/utilisateurs')

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

  if (!utilisateur.prenom) {
    errors.push('prénom manquant')
  }

  if (!utilisateur.nom) {
    errors.push('nom manquant')
  }

  if (!utilisateur.email) {
    errors.push('email manquant')
  } else if (!emailRegex({ exact: true }).test(utilisateur.email)) {
    errors.push('adresse email invalide')
  }

  return errors
}

const userIdGenerate = async () => {
  const id = cryptoRandomString(6)
  const utilisateurWithTheSameId = await utilisateurGet(id)
  if (utilisateurWithTheSameId) {
    return userIdGenerate()
  }

  return id
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
    }
    return null
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
    const emailIsValid = emailRegex({ exact: true }).test(email)

    if (!email) {
      errors.push('adresse email manquante')
    }

    if (!emailIsValid) {
      errors.push('adresse email invalide')
    }

    if (!motDePasse) {
      errors.push('mot de passe manquant')
    }

    if (email && emailIsValid && motDePasse) {
      utilisateur = await utilisateurByEmailGet(email)

      if (utilisateur) {
        const valid = await bcrypt.compare(motDePasse, utilisateur.motDePasse)

        if (!valid) {
          errors.push('mot de passe incorrect')
        }
      } else {
        errors.push('aucun utilisateur enregistré avec cette adresse email')
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
        process.env.JWT_SECRET
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

    if (
      !permissionsCheck(context.user, ['super', 'admin']) &&
      context.user.email !== utilisateur.email
    ) {
      errors.push(
        'droits insuffisants pour créer un compte avec cette adresse email'
      )
    }

    if (!errors.length) {
      utilisateur.motDePasse = await bcrypt.hash(utilisateur.motDePasse, 10)
      utilisateur.id = await userIdGenerate()

      const res = await utilisateurAdd(utilisateur)

      return res
    } else {
      throw new Error(errors.join(', '))
    }
  },

  async utilisateurAjoutEmailEnvoyer({ email }, context) {
    const errors = []
    let utilisateur

    console.log('email', email)
    const emailIsValid = emailRegex({ exact: true }).test(email)

    if (!email) {
      errors.push('email manquant')
    } else if (!emailIsValid) {
      errors.push('adresse email invalide')
    } else {
      utilisateur = await utilisateurByEmailGet(email)

      if (utilisateur) {
        errors.push(
          'un utilisateur est déjà enregistré avec cette adresse email'
        )
      }
    }

    if (!errors.length) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET)

      const url = `${
        process.env.UI_URL
      }/creation-de-compte?token=${token}&email=${email}`

      const subject = `[Camino] Création de votre compte utilisateur`
      const html = `<p>Pour créer votre compte, <a href="${url}">cliquez ici</a>.</p>`

      try {
        mailer(email, subject, html)
      } catch (e) {
        return "erreur lors de l'envoi d'email"
      }

      return 'un lien pour créer votre compte vous a été envoyé par email'
    } else {
      throw new Error(errors.join(', '))
    }
  },

  async utilisateurModifier({ utilisateur }, context) {
    if (
      permissionsCheck(context.user, ['super', 'admin']) ||
      context.user.id === utilisateur.id
    ) {
      let res
      const errors = await utilisateurErreurs(utilisateur)

      if (!utilisateur.id) {
        errors.push('id manquante')
      }

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
          errors.push('aucun utilisateur enregistré avec cette id')
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
    const emailIsValid = emailRegex({ exact: true }).test(email)

    if (!email) {
      errors.push('email manquant')
    } else if (!emailIsValid) {
      errors.push('adresse email invalide')
    } else {
      utilisateur = await utilisateurByEmailGet(email)

      if (!utilisateur) {
        errors.push('aucun utilisateur enregistré avec cette adresse email')
      }
    }

    if (!errors.length) {
      const token = jwt.sign({ id: utilisateur.id }, process.env.JWT_SECRET)

      const url = `${
        process.env.UI_URL
      }/mot-de-passe?token=${token}&email=${email}`

      const subject = `[Camino] Initialisation de votre mot de passe`
      const html = `<p>Pour initialiser votre mot de passe, <a href="${url}">cliquez ici</a> (lien valable 15 minutes).</p>`

      try {
        mailer(email, subject, html)
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
          errors.push('aucun utilisateur enregistré avec cette id')
        }
      }
    }

    if (!errors.length) {
      const res = await utilisateurUpdate({
        id: context.user.id,
        motDePasse: await bcrypt.hash(motDePasse1, 10)
      })

      return 'mot de passe mis à jour'
    } else {
      throw new Error(errors.join(', '))
    }
  }
}

module.exports = resolvers
