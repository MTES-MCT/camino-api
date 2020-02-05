import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import * as cryptoRandomString from 'crypto-random-string'

import init from '../../server/init'

import { debug } from '../../config/index'
import { emailSend } from '../../tools/emails-send'

import {
  utilisateurGet,
  utilisateursGet,
  utilisateurCreate,
  utilisateurUpdate,
  utilisateurByEmailGet
} from '../../database/queries/utilisateurs'

import globales from '../../server/globales'

import { utilisateurRowUpdate } from '../../tools/export/utilisateur'

import { permissionsCheck } from './permissions/permissions-check'

import {
  emailCheck,
  utilisateurEditionCheck,
  utilisateurTestCheck
} from './permissions/utilisateur'

import { utilisateursFormat, utilisateurFormat } from './format/utilisateur'
import { userFormat } from './format/user'

const userIdGenerate = async () => {
  const id = cryptoRandomString({ length: 6 })
  const utilisateurWithTheSameId = await utilisateurGet(id)
  if (utilisateurWithTheSameId) {
    return userIdGenerate()
  }

  return id
}

const utilisateur = async ({ id }, context, info) => {
  try {
    const utilisateur = await utilisateurGet(id)

    const user = context.user && (await utilisateurGet(context.user.id))

    return utilisateurFormat(utilisateur, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurs = async (
  { entrepriseIds, administrationIds, permissionIds, noms },
  context,
  info
) => {
  try {
    const utilisateurs = await utilisateursGet({
      noms,
      entrepriseIds,
      administrationIds,
      permissionIds
    })

    const user = context.user && (await utilisateurGet(context.user.id))

    return utilisateursFormat(utilisateurs, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const moi = async (variables, context, info) => {
  try {
    // vérifie que la base de données était remplie au démarrage du serveur
    if (!globales.chargement) {
      await init()
    }

    if (!context.user) return null

    const utilisateur = await utilisateurGet(context.user.id)

    return userFormat(utilisateur)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurTokenCreer = async ({ email, motDePasse }, context, info) => {
  try {
    email = email.toLowerCase()

    if (!emailCheck(email)) {
      throw new Error('adresse email invalide')
    }

    const utilisateur = await utilisateurByEmailGet(email)

    if (!utilisateur) {
      throw new Error('aucun utilisateur enregistré avec cette adresse email')
    }

    const valid = bcrypt.compareSync(motDePasse, utilisateur.motDePasse)

    if (!valid) {
      throw new Error('mot de passe incorrect')
    }

    const token = userTokenCreate(utilisateur)

    return { token, utilisateur: userFormat(utilisateur) }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurCreer = async ({ utilisateur }, context) => {
  try {
    utilisateur.email = utilisateur.email.toLowerCase()

    const errors = utilisateurEditionCheck(context.user, utilisateur)

    if (utilisateur.motDePasse.length < 8) {
      errors.push('le mot de passe doit contenir au moins 8 caractères')
    }

    const utilisateurWithTheSameEmail = await utilisateurByEmailGet(
      utilisateur.email
    )

    if (utilisateurWithTheSameEmail) {
      errors.push('un utilisateur avec cet email existe déjà')
    }

    if (errors.length) {
      throw new Error(errors.join(', '))
    }

    if (!permissionsCheck(context.user, ['super', 'admin'])) {
      utilisateur.permissionId = 'defaut'
    }

    if (!permissionsCheck(utilisateur, ['admin', 'editeur', 'lecteur'])) {
      utilisateur.administrationsIds = []
    }

    if (!permissionsCheck(utilisateur, ['entreprise'])) {
      utilisateur.entreprisesIds = []
    }

    utilisateur.motDePasse = bcrypt.hashSync(utilisateur.motDePasse, 10)
    utilisateur.id = await userIdGenerate()

    const utilisateurNew = await utilisateurCreate(utilisateur)

    await utilisateurRowUpdate(utilisateurNew)

    return utilisateurNew
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurCreationEmailEnvoyer = async ({ email }, context) => {
  try {
    email = email.toLowerCase()

    if (!emailCheck(email)) {
      throw new Error('adresse email invalide')
    }

    const utilisateur = await utilisateurByEmailGet(email)

    if (utilisateur) {
      throw new Error(
        'un utilisateur est déjà enregistré avec cette adresse email'
      )
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET)

    const url = `${
      process.env.UI_URL
    }/creation-de-compte?token=${token}&email=${encodeURIComponent(email)}`

    const subject = `Création de votre compte utilisateur`
    const html = `<p>Pour créer votre compte, <a href="${url}">cliquez ici</a>.</p>`

    if (utilisateurTestCheck(email)) {
      return url
    }

    emailSend(email, subject, html)

    return 'email envoyé'
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurModifier = async ({ utilisateur }, context) => {
  try {
    utilisateur.email = utilisateur.email.toLowerCase()

    const errors = utilisateurEditionCheck(context.user, utilisateur)

    if (
      !permissionsCheck(context.user, ['super', 'admin']) &&
      context.user.id !== utilisateur.id
    ) {
      errors.push("droits insuffisants pour effectuer l'opération")
    }

    if (!permissionsCheck(context.user, ['super', 'admin'])) {
      const utilisateurOld = await utilisateurGet(utilisateur.id)

      if (utilisateurOld.permissionId !== utilisateur.permissionId) {
        errors.push('droits insuffisants pour modifier les permissions')
      }
    }

    if (errors.length) {
      throw new Error(errors.join(', '))
    }

    if (!permissionsCheck(utilisateur, ['admin', 'editeur', 'lecteur'])) {
      utilisateur.administrationsIds = []
    }

    if (!permissionsCheck(utilisateur, ['entreprise'])) {
      utilisateur.entreprisesIds = []
    }

    const utilisateurNew = await utilisateurUpdate(utilisateur)

    await utilisateurRowUpdate(utilisateurNew)

    return utilisateurNew
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurSupprimer = async ({ id }, context) => {
  try {
    if (
      !permissionsCheck(context.user, ['super', 'admin']) &&
      context.user.id !== id
    ) {
      throw new Error("droits insuffisants pour effectuer l'opération")
    }

    const utilisateur = await utilisateurGet(id)

    utilisateur.email = null
    utilisateur.motDePasse = 'suppression'
    utilisateur.telephoneFixe = null
    utilisateur.telephoneMobile = null
    utilisateur.permissionId = 'defaut'
    utilisateur.entreprises = []
    utilisateur.administrations = []

    const utilisateurNew = await utilisateurUpdate(utilisateur)

    await utilisateurRowUpdate(utilisateurNew)

    return utilisateurNew
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurMotDePasseModifier = async (
  { id, motDePasse, motDePasseNouveau1, motDePasseNouveau2 },
  context
) => {
  try {
    if (
      !permissionsCheck(context.user, ['super', 'admin']) &&
      context.user.id !== id
    ) {
      throw new Error("droits insuffisants pour effectuer l'opération")
    }

    if (motDePasseNouveau1.length < 8) {
      throw new Error('le mot de passe doit contenir au moins 8 caractères')
    }

    if (motDePasseNouveau1 !== motDePasseNouveau2) {
      throw new Error(
        'le nouveau mot de passe et la vérification sont différents'
      )
    }

    const utilisateur = await utilisateurGet(id)

    if (!utilisateur) {
      throw new Error('aucun utilisateur enregistré avec cet id')
    }

    if (!permissionsCheck(context.user, ['super'])) {
      const valid = bcrypt.compareSync(motDePasse, utilisateur.motDePasse)

      if (!valid) {
        throw new Error('mot de passe incorrect')
      }
    }

    utilisateur.motDePasse = bcrypt.hashSync(motDePasseNouveau1, 10)

    const utilisateurNew = utilisateurUpdate({
      id,
      motDePasse: utilisateur.motDePasse
    })

    await utilisateurRowUpdate(utilisateurNew)

    return utilisateurNew
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

// envoie l'email avec un lien vers un formulaire de ré-init
const utilisateurMotDePasseEmailEnvoyer = async ({ email }, context) => {
  try {
    if (!emailCheck(email)) {
      throw new Error('adresse email invalide')
    }

    const utilisateur = await utilisateurByEmailGet(email)

    if (!utilisateur) {
      throw new Error('aucun utilisateur enregistré avec cette adresse email')
    }

    const token = jwt.sign({ id: utilisateur.id }, process.env.JWT_SECRET)

    const url = `${process.env.UI_URL}/mot-de-passe?token=${token}`

    const subject = `Initialisation de votre mot de passe`
    const html = `<p>Pour initialiser votre mot de passe, <a href="${url}">cliquez ici</a> (lien valable 15 minutes).</p>`

    emailSend(email, subject, html)

    return 'email envoyé'
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

// formulaire de ré-init du mot de passe
const utilisateurMotDePasseInitialiser = async (
  { motDePasse1, motDePasse2 },
  context
) => {
  try {
    if (!context.user || !context.user.id) {
      throw new Error('aucun utilisateur identifié')
    }

    const now = Math.round(new Date().getTime() / 1000)
    const delay = 60 * 15 // 15 minutes

    if (now - context.user.iat > delay) {
      throw new Error('délai expiré')
    }

    if (motDePasse1.length < 8) {
      throw new Error('le mot de passe doit contenir au moins 8 caractères')
    }

    if (motDePasse1 !== motDePasse2) {
      throw new Error(
        'le nouveau mot de passe et la vérification sont différents'
      )
    }

    const utilisateur = await utilisateurGet(context.user.id)

    if (!utilisateur) {
      throw new Error('aucun utilisateur enregistré avec cet id')
    }

    utilisateur.motDePasse = bcrypt.hashSync(motDePasse1, 10)

    const utilisateurNew = await utilisateurUpdate({
      id: context.user.id,
      motDePasse: utilisateur.motDePasse
    })

    await utilisateurRowUpdate(utilisateurNew)

    const token = userTokenCreate(utilisateurNew)

    return { token, utilisateur: userFormat(utilisateurNew) }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const userTokenCreate = ({ id, email, permission }) =>
  jwt.sign(
    {
      id,
      email,
      permissionId: permission.id,
      permissionOrdre: permission.ordre
    },
    process.env.JWT_SECRET
  )

export {
  utilisateur,
  utilisateurs,
  moi,
  utilisateurTokenCreer,
  utilisateurCreer,
  utilisateurCreationEmailEnvoyer,
  utilisateurModifier,
  utilisateurSupprimer,
  utilisateurMotDePasseModifier,
  utilisateurMotDePasseEmailEnvoyer,
  utilisateurMotDePasseInitialiser
}
