import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import * as emailRegex from 'email-regex'
import emailsSend from '../../tools/emails-send'

import {
  utilisateurGet,
  utilisateursGet,
  utilisateurCreate,
  utilisateurUpdate,
  utilisateurByEmailGet
} from '../../database/queries/utilisateurs'

import { utilisateurRowUpdate } from '../../tools/export/utilisateur'

import { permissionsCheck } from './_permissions-check'

import {
  userIdGenerate,
  utilisateursFormat,
  utilisateurFormat
} from './_utilisateur'

const utilisateur = async ({ id }, context, info) => {
  const utilisateur = await utilisateurGet(id)

  const user = context.user && (await utilisateurGet(context.user.id))

  return utilisateurFormat(utilisateur, user)
}

const utilisateurs = async (
  { entrepriseIds, administrationIds, permissionIds, noms },
  context,
  info
) => {
  const utilisateurs = await utilisateursGet({
    noms,
    entrepriseIds,
    administrationIds,
    permissionIds
  })

  const user = context.user && (await utilisateurGet(context.user.id))

  return utilisateursFormat(utilisateurs, user)
}

const utilisateurIdentifier = async (variables, context, info) => {
  const utilisateur = context.user && (await utilisateurGet(context.user.id))

  let token

  if (utilisateur) {
    token = tokenCreate(
      utilisateur.id,
      utilisateur.email,
      utilisateur.permission
    )
  }

  return { token, utilisateur }
}

const utilisateurConnecter = async ({ email, motDePasse }, context, info) => {
  email = email.toLowerCase()

  const emailIsValid = emailRegex({ exact: true }).test(email)

  if (!emailIsValid) {
    throw new Error('adresse email invalide')
  }

  const utilisateur = await utilisateurByEmailGet(email)

  if (!utilisateur) {
    throw new Error('aucun utilisateur enregistré avec cette adresse email')
  }

  const valid = await bcrypt.compare(motDePasse, utilisateur.motDePasse)

  if (!valid) {
    throw new Error('mot de passe incorrect')
  }

  const token = tokenCreate(
    utilisateur.id,
    utilisateur.email,
    utilisateur.permission
  )

  return { token, utilisateur }
}

const utilisateurCreer = async ({ utilisateur }, context) => {
  utilisateur.email = utilisateur.email.toLowerCase()

  if (
    !permissionsCheck(context.user, ['super']) &&
    utilisateur.permissionId === 'super'
  ) {
    throw new Error(
      'droits insuffisants pour créer un utilisateur avec ces permissions'
    )
  }

  if (
    !permissionsCheck(context.user, ['super', 'admin']) &&
    context.user.email !== utilisateur.email
  ) {
    throw new Error(
      'droits insuffisants pour créer un compte avec cette adresse email'
    )
  }

  const errors = []

  if (!emailRegex({ exact: true }).test(utilisateur.email)) {
    errors.push('adresse email invalide')
  }

  if (utilisateur.motDePasse.length < 8) {
    errors.push('le mot de passe doit contenir au moins 8 caractères')
  }

  if (errors.length) {
    throw new Error(errors.join(', '))
  }

  const utilisateurWithTheSameEmail = await utilisateurByEmailGet(
    utilisateur.email
  )

  if (utilisateurWithTheSameEmail) {
    throw new Error('un utilisateur avec cet email existe déjà')
  }

  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    utilisateur.permission = { id: 'defaut' }
  }

  utilisateur.motDePasse = await bcrypt.hash(utilisateur.motDePasse, 10)
  utilisateur.id = await userIdGenerate()

  const utilisateurNew = await utilisateurCreate(utilisateur)

  await utilisateurRowUpdate(utilisateurNew)

  return utilisateurNew
}

const utilisateurCreationEmailEnvoyer = async ({ email }, context) => {
  email = email.toLowerCase()
  const emailIsValid = emailRegex({ exact: true }).test(email)

  if (!emailIsValid) {
    throw new Error('adresse email invalide')
  }

  const utilisateur = await utilisateurByEmailGet(email)

  if (utilisateur) {
    throw new Error(
      'un utilisateur est déjà enregistré avec cette adresse email'
    )
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET)

  const url = `${process.env.UI_URL}/creation-de-compte?token=${token}&email=${email}`

  const subject = `Création de votre compte utilisateur`
  const html = `<p>Pour créer votre compte, <a href="${url}">cliquez ici</a>.</p>`

  try {
    emailsSend(email, subject, html)
  } catch (e) {
    return "erreur: envoi d'email"
  }

  return 'un lien pour créer votre compte vous a été envoyé par email'
}

const utilisateurModifier = async ({ utilisateur }, context) => {
  utilisateur.email = utilisateur.email.toLowerCase()

  if (
    !permissionsCheck(context.user, ['super', 'admin']) &&
    context.user.id !== utilisateur.id
  ) {
    throw new Error("droits insuffisants pour effectuer l'opération")
  }

  if (!emailRegex({ exact: true }).test(utilisateur.email)) {
    throw new Error('adresse email invalide')
  }

  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    const utilisateurOld = await utilisateurGet(utilisateur.id)

    if (utilisateurOld.permissionId !== utilisateur.permissionId) {
      throw new Error('droits insuffisants pour modifier les permissions')
    }
  }

  const utilisateurNew = await utilisateurUpdate(utilisateur)

  await utilisateurRowUpdate(utilisateurNew)

  return utilisateurNew
}

const utilisateurSupprimer = async ({ id }, context) => {
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

  const utilisateurNew = await utilisateurUpdate(utilisateur)

  await utilisateurRowUpdate(utilisateurNew)

  return utilisateurNew
}

const utilisateurMotDePasseModifier = async (
  { id, motDePasse, motDePasseNouveau1, motDePasseNouveau2 },
  context
) => {
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

  const valid = await bcrypt.compare(motDePasse, utilisateur.motDePasse)

  if (!valid) {
    throw new Error('mot de passe incorrect')
  }

  utilisateur.motDePasse = await bcrypt.hash(motDePasseNouveau1, 10)

  const utilisateurNew = utilisateurUpdate({
    id,
    motDePasse: utilisateur.motDePasse
  })

  await utilisateurRowUpdate(utilisateurNew)

  return utilisateurNew
}

// envoie l'email avec un lien vers un formulaire de ré-init
const utilisateurMotDePasseEmailEnvoyer = async ({ email }, context) => {
  const emailIsValid = emailRegex({ exact: true }).test(email)

  if (!emailIsValid) {
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

  try {
    emailsSend(email, subject, html)
  } catch (e) {
    return "erreur: envoi d'email"
  }

  return 'email envoyé'
}

// formulaire de ré-init du mot de passe
const utilisateurMotDePasseInitialiser = async (
  { motDePasse1, motDePasse2 },
  context
) => {
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

  utilisateur.motDePasse = await bcrypt.hash(motDePasse1, 10)

  const utilisateurNew = await utilisateurUpdate({
    id: context.user.id,
    motDePasse: utilisateur.motDePasse
  })

  await utilisateurRowUpdate(utilisateurNew)

  const token = tokenCreate(
    utilisateurNew.id,
    utilisateurNew.email,
    utilisateurNew.permission
  )

  return { token, utilisateur: utilisateurNew }
}

const tokenCreate = (id, email, permission) =>
  jwt.sign(
    {
      id,
      email,
      permission
    },
    process.env.JWT_SECRET
  )

export {
  utilisateur,
  utilisateurs,
  utilisateurIdentifier,
  utilisateurConnecter,
  utilisateurCreer,
  utilisateurCreationEmailEnvoyer,
  utilisateurModifier,
  utilisateurSupprimer,
  utilisateurMotDePasseModifier,
  utilisateurMotDePasseEmailEnvoyer,
  utilisateurMotDePasseInitialiser
}
