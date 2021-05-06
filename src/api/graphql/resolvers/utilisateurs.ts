import { GraphQLResolveInfo } from 'graphql'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cryptoRandomString from 'crypto-random-string'

import {
  IToken,
  IUtilisateur,
  IUtilisateurCreation,
  IUtilisateursColonneId
} from '../../../types'

import { login as cerbereLogin } from '../../../tools/api-cerbere/index'

import { databaseInit } from '../../../database/init'

import { debug } from '../../../config/index'
import { emailSend } from '../../../tools/emails-send'
import { fieldsBuild } from './_fields-build'

import {
  userGet,
  utilisateurGet,
  utilisateursGet,
  utilisateurCreate,
  utilisateurUpdate,
  utilisateurUpsert,
  userByEmailGet,
  utilisateursCount,
  userByRefreshTokenGet
} from '../../../database/queries/utilisateurs'

import { globales } from '../../../database/cache/globales'

import { utilisateurUpdationValidate } from '../../../business/validations/utilisateur-updation-validate'
import { permissionCheck } from '../../../tools/permission'
import { emailCheck } from '../../../tools/email-check'
import { utilisateurEditionCheck } from '../../_permissions/utilisateur'
import { utilisateurFormat } from '../../_format/utilisateurs'
import { userFormat } from '../../_format/users'

const userIdGenerate = async (): Promise<string> => {
  const id = cryptoRandomString({ length: 6 })
  const utilisateurWithTheSameId = await userGet(id)
  if (utilisateurWithTheSameId) {
    return userIdGenerate()
  }

  return id
}

const utilisateur = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info)
    const utilisateur = await utilisateurGet(id, { fields }, user)

    return utilisateur && utilisateurFormat(utilisateur)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurs = async (
  {
    intervalle,
    page,
    colonne,
    ordre,
    entrepriseIds,
    administrationIds,
    permissionIds,
    noms,
    emails
  }: {
    intervalle?: number | null
    page?: number | null
    colonne?: IUtilisateursColonneId | null
    ordre?: 'asc' | 'desc' | null
    entrepriseIds?: string[]
    administrationIds?: string[]
    permissionIds?: string[]
    noms?: string | null
    emails?: string | null
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info)

    const [utilisateurs, total] = await Promise.all([
      utilisateursGet(
        {
          intervalle,
          page,
          colonne,
          ordre,
          entrepriseIds,
          administrationIds,
          permissionIds,
          noms,
          emails
        },
        { fields: fields.elements },
        user
      ),
      utilisateursCount(
        {
          entrepriseIds,
          administrationIds,
          permissionIds,
          noms,
          emails
        },
        { fields: {} },
        user
      )
    ])

    return {
      elements: utilisateurs.map(utilisateurFormat),
      page,
      intervalle,
      ordre,
      colonne,
      total
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const moi = async (_: never, context: IToken, info: GraphQLResolveInfo) => {
  try {
    // vérifie que la base de données est remplie au démarrage du serveur
    // TODO:
    // mettre ça dans un middleware à la racine de l'app express
    if (!globales.chargement) {
      await databaseInit()
    }

    const user = await userGet(context.user?.id)

    if (!user) throw new Error('utilisateur inconnu')

    const fields = fieldsBuild(info)

    const utilisateur = await utilisateurGet(user.id, { fields }, user)

    return userFormat(utilisateur)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurTokenCreer = async ({
  email,
  motDePasse
}: {
  email: string
  motDePasse: string
}) => {
  try {
    email = email.toLowerCase()
    if (!emailCheck(email)) {
      throw new Error('adresse email invalide')
    }

    let user = await userByEmailGet(email)
    if (!user) {
      throw new Error('aucun utilisateur enregistré avec cette adresse email')
    }

    const valid = bcrypt.compareSync(motDePasse, user.motDePasse!)
    if (!valid) {
      throw new Error('mot de passe incorrect')
    }

    // charge l’utilisateur totalement
    user = (await userGet(user.id))!

    const { accessToken, refreshToken } = userTokensCreate(user)

    await utilisateurUpdate(user.id, { refreshToken })

    return {
      utilisateur: userFormat(user),
      accessToken,
      refreshToken
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurTokenRafraichir = async (
  {
    refreshToken
  }: {
    refreshToken: string
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH!)

    const fields = fieldsBuild(info)

    const user = await userByRefreshTokenGet(refreshToken, {
      fields: fields.utilisateur
    })
    if (!user) {
      throw new Error('refresh token inconnu')
    }

    const tokens = userTokensCreate(user)

    return {
      utilisateur: userFormat(user),
      ...tokens
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurCerbereUrlObtenir = async ({ url }: { url: string }) => {
  try {
    return `${process.env.API_CERBERE}?service=${url}`
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurCerbereTokenCreer = async ({ ticket }: { ticket: string }) => {
  try {
    // authentification cerbere et récuperation de l'utilisateur
    const cerbereUtilisateur = await cerbereLogin(ticket)

    if (!cerbereUtilisateur) {
      throw new Error('aucun utilisateur sur Cerbère')
    }

    let utilisateur = await userByEmailGet(cerbereUtilisateur.email!)

    // si l'utilisateur n'existe pas encore en base
    // alors on le crée en lui générant un mot de passe aléatoire
    if (!utilisateur) {
      cerbereUtilisateur.motDePasse = cryptoRandomString({ length: 16 })

      utilisateur = await utilisateurCreer(
        { utilisateur: cerbereUtilisateur },
        { user: { email: cerbereUtilisateur.email } } as IToken
      )
    }

    // charge l’utilisateur totalement
    utilisateur = (await userGet(utilisateur.id))!

    return {
      ...userTokensCreate(utilisateur),
      utilisateur: userFormat(utilisateur)
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurCreer = async (
  { utilisateur }: { utilisateur: IUtilisateurCreation },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    utilisateur.email = utilisateur.email!.toLowerCase()

    if (
      !context.user ||
      (context.user.email !== utilisateur.email &&
        !user?.utilisateursCreation) ||
      (!permissionCheck(user?.permissionId, ['super']) &&
        utilisateur.permissionId === 'super')
    )
      throw new Error('droits insuffisants')

    const errors = utilisateurEditionCheck(utilisateur)

    if (utilisateur.motDePasse!.length < 8) {
      errors.push('le mot de passe doit contenir au moins 8 caractères')
    }

    const utilisateurWithTheSameEmail = await userByEmailGet(utilisateur.email!)

    if (utilisateurWithTheSameEmail) {
      errors.push('un utilisateur avec cet email existe déjà')
    }

    if (errors.length) {
      throw new Error(errors.join(', '))
    }

    if (
      !utilisateur.permissionId ||
      !user ||
      !permissionCheck(user?.permissionId, ['super', 'admin'])
    ) {
      utilisateur.permissionId = 'defaut'
    }

    if (
      !permissionCheck(utilisateur?.permissionId, [
        'admin',
        'editeur',
        'lecteur'
      ])
    ) {
      utilisateur.administrations = []
    }

    if (!permissionCheck(utilisateur?.permissionId, ['entreprise'])) {
      utilisateur.entreprises = []
    }

    utilisateur.motDePasse = bcrypt.hashSync(utilisateur.motDePasse!, 10)

    const utilisateurUpdated = await utilisateurCreate(
      {
        id: await userIdGenerate(),
        ...utilisateur
      } as IUtilisateur,
      { fields: {} }
    )

    emailSend(
      process.env.ADMIN_EMAIL!,
      `Nouvel utilisateur ${utilisateurUpdated.email} créé`,
      `L'utilisateur ${utilisateurUpdated.nom} ${utilisateurUpdated.prenom} vient de se créer un compte : ${process.env.UI_URL}/utilisateurs/${utilisateurUpdated.id}`
    )

    return utilisateurUpdated
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurCreationMessageEnvoyer = async ({
  email
}: {
  email: string
}) => {
  try {
    email = email.toLowerCase()

    if (!emailCheck(email)) throw new Error('adresse email invalide')

    const user = await userByEmailGet(email)

    if (user) {
      throw new Error('un utilisateur est déjà enregistré avec cet email')
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: '15m'
    })

    const url = `${
      process.env.UI_URL
    }/creation-de-compte?token=${token}&email=${encodeURIComponent(email)}`

    const subject = `Création de votre compte utilisateur`
    const html = `<p>Pour créer votre compte, <a href="${url}">cliquez ici</a>.</p>`

    const utilisateurTestCheck = (email: string) =>
      (process.env.NODE_ENV !== 'production' || process.env.ENV !== 'prod') &&
      email === 'test@camino.local'

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

const utilisateurModifier = async (
  { utilisateur }: { utilisateur: IUtilisateur },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    utilisateur.email = utilisateur.email!.toLowerCase()

    const isSuper = permissionCheck(user?.permissionId, ['super'])
    const isAdmin = permissionCheck(user?.permissionId, ['admin'])

    if (
      !user ||
      (!user.utilisateursCreation &&
        (user.id !== utilisateur.id || user.email !== utilisateur.email)) ||
      (utilisateur.permissionId &&
        !isSuper &&
        (!isAdmin ||
          permissionCheck(utilisateur.permissionId, ['super', 'admin'])))
    ) {
      throw new Error('droits insuffisants')
    }

    const errors = utilisateurEditionCheck(utilisateur)

    const errorsValidate = await utilisateurUpdationValidate(
      user,
      utilisateur,
      isAdmin,
      isSuper
    )

    if (errorsValidate.length) {
      errors.push(...errorsValidate)
    }

    const utilisateurWithTheSameEmail = await userByEmailGet(utilisateur.email)
    if (
      utilisateurWithTheSameEmail &&
      utilisateur.id !== utilisateurWithTheSameEmail.id
    ) {
      errors.push('un utilisateur avec cet email existe déjà')
    }

    if (errors.length) {
      throw new Error(errors.join(', '))
    }

    if (
      !permissionCheck(utilisateur.permissionId, [
        'admin',
        'editeur',
        'lecteur'
      ])
    ) {
      utilisateur.administrations = []
    }

    if (!permissionCheck(utilisateur?.permissionId, ['entreprise'])) {
      utilisateur.entreprises = []
    }

    const fields = fieldsBuild(info)

    const utilisateurUpdated = await utilisateurUpsert(utilisateur, { fields })

    return utilisateurFormat(utilisateurUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurSupprimer = async (
  { id }: { id: string },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!user || (!user.utilisateursCreation && user.id !== id))
      throw new Error('droits insuffisants')

    const utilisateur = await utilisateurGet(id, { fields: {} }, user)

    if (!utilisateur) {
      throw new Error('aucun utilisateur avec cet id')
    }

    utilisateur.email = null
    utilisateur.motDePasse = 'suppression'
    utilisateur.telephoneFixe = ''
    utilisateur.telephoneMobile = ''
    utilisateur.permissionId = 'defaut'
    utilisateur.entreprises = []
    utilisateur.administrations = []

    const utilisateurUpdated = await utilisateurUpsert(utilisateur, {})

    return utilisateurUpdated
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurMotDePasseModifier = async (
  {
    id,
    motDePasse,
    motDePasseNouveau1,
    motDePasseNouveau2
  }: {
    id: string
    motDePasse: string
    motDePasseNouveau1: string
    motDePasseNouveau2: string
  },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (
      !user ||
      (!permissionCheck(user?.permissionId, ['super', 'admin']) &&
        user.id !== id)
    ) {
      throw new Error('droits insuffisants')
    }

    if (motDePasseNouveau1.length < 8) {
      throw new Error('le mot de passe doit contenir au moins 8 caractères')
    }

    if (motDePasseNouveau1 !== motDePasseNouveau2) {
      throw new Error(
        'le nouveau mot de passe et la vérification sont différents'
      )
    }

    const utilisateur = await utilisateurGet(id, {}, user)

    if (!utilisateur) {
      throw new Error('aucun utilisateur enregistré avec cet id')
    }

    if (!permissionCheck(user?.permissionId, ['super'])) {
      const valid = bcrypt.compareSync(motDePasse, utilisateur.motDePasse!)

      if (!valid) {
        throw new Error('mot de passe incorrect')
      }
    }

    utilisateur.motDePasse = bcrypt.hashSync(motDePasseNouveau1, 10)

    const utilisateurUpdated = await utilisateurUpsert(
      {
        id,
        motDePasse: utilisateur.motDePasse
      } as IUtilisateur,
      { fields: {} }
    )

    return utilisateurUpdated
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

// envoie l'email avec un lien vers un formulaire de ré-init
const utilisateurMotDePasseMessageEnvoyer = async ({
  email
}: {
  email: string
}) => {
  try {
    if (!emailCheck(email)) throw new Error('adresse email invalide')

    const utilisateur = await userByEmailGet(email)

    if (!utilisateur) {
      throw new Error('aucun utilisateur enregistré avec cette adresse email')
    }

    const token = jwt.sign({ id: utilisateur.id }, process.env.JWT_SECRET!, {
      expiresIn: '15m'
    })

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
  { motDePasse1, motDePasse2 }: { motDePasse1: string; motDePasse2: string },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!context.user || !context.user.id) {
      throw new Error('aucun utilisateur identifié')
    }

    const now = Math.round(new Date().getTime() / 1000)
    const delay = 60 * 15 // 15 minutes

    if (now - context.user.iat! > delay) {
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

    const utilisateur = await utilisateurGet(context.user.id, {}, user)

    if (!utilisateur) {
      throw new Error('aucun utilisateur enregistré avec cet id')
    }

    utilisateur.motDePasse = bcrypt.hashSync(motDePasse1, 10)

    const utilisateurUpdated = await utilisateurUpsert(
      {
        id: context.user.id,
        motDePasse: utilisateur.motDePasse
      } as IUtilisateur,
      { fields: {} }
    )

    return {
      ...userTokensCreate(utilisateurUpdated),
      utilisateur: userFormat(utilisateurUpdated)
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

/**
 * envoie un email de vérification pour mettre à jour l’email de l’utilisateur
 * @param email - nouvel email de l’utilisateur
 * @param context
 */
const utilisateurEmailMessageEnvoyer = async (
  { email }: { email: string },
  context: IToken
) => {
  try {
    if (!emailCheck(email)) {
      throw new Error('adresse email invalide')
    }

    if (!context.user) {
      throw new Error('droits insuffisants')
    }

    const user = await userGet(context.user?.id)
    if (!user) {
      throw new Error('utilisateur inconnu')
    }

    const userExistant = await userByEmailGet(email)
    if (userExistant) {
      throw new Error(
        'un utilisateur est déjà enregistré avec cette adresse email'
      )
    }

    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET!, {
      expiresIn: '15m'
    })

    const url = `${process.env.UI_URL}/email?token=${token}`

    const subject = `Vérification de votre nouvel email`
    const html = `<p>Pour valider votre nouvel email, <a href="${url}">cliquez ici</a> (lien valable 15 minutes).</p>`

    emailSend(email, subject, html)

    return 'email envoyé'
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

/**
 * modifie l’email de l’utilisateur
 * @param context - context qui contient l’id et le nouvel email de l’utilisateur
 */
const utilisateurEmailModifier = async (
  { emailToken }: { emailToken: string },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!user) throw new Error("l'utilisateur n'existe pas")

    let emailTokenDecoded: { id: string; email: string }
    try {
      emailTokenDecoded = jwt.verify(emailToken, process.env.JWT_SECRET!) as {
        id: string
        email: string
      }
    } catch (e) {
      throw new Error('lien expiré')
    }

    if (user.id !== emailTokenDecoded.id) {
      throw new Error('droits insuffisants')
    }

    const utilisateur = await utilisateurGet(user.id, {}, user)

    if (!utilisateur) {
      throw new Error('aucun utilisateur enregistré avec cet id')
    }

    const utilisateurUpdated = await utilisateurUpsert(
      {
        id: user.id,
        email: emailTokenDecoded.email
      } as IUtilisateur,
      { fields: {} }
    )

    return {
      ...userTokensCreate(utilisateurUpdated),
      utilisateur: userFormat(utilisateurUpdated)
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const userTokensCreate = ({ id, email }: IUtilisateur) => {
  const refreshToken = jwt.sign({ id, email }, process.env.JWT_SECRET_REFRESH!)

  return {
    accessToken: jwt.sign({ id, email }, process.env.JWT_SECRET!, {
      expiresIn: '15m'
    }),
    refreshToken
  }
}

export {
  utilisateur,
  utilisateurs,
  moi,
  utilisateurTokenCreer,
  utilisateurTokenRafraichir,
  utilisateurCerbereUrlObtenir,
  utilisateurCerbereTokenCreer,
  utilisateurCreer,
  utilisateurCreationMessageEnvoyer,
  utilisateurModifier,
  utilisateurSupprimer,
  utilisateurMotDePasseModifier,
  utilisateurMotDePasseMessageEnvoyer,
  utilisateurMotDePasseInitialiser,
  utilisateurEmailMessageEnvoyer,
  utilisateurEmailModifier
}
