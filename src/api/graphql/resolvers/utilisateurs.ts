import { GraphQLResolveInfo } from 'graphql'
import {
  IToken,
  IUtilisateur,
  IUtilisateurCreation,
  IUtilisateursColonneId
} from '../../../types'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import * as cryptoRandomString from 'crypto-random-string'
import { login as cerbereLogin } from '../../../tools/api-cerbere'

import init from '../../../database/init'

import { debug } from '../../../config/index'
import { emailSend } from '../../../tools/emails-send'
import fieldsBuild from './_fields-build'

import {
  userGet,
  utilisateurGet,
  utilisateursGet,
  utilisateurCreate,
  utilisateurUpdate,
  userByEmailGet,
  utilisateursCount
} from '../../../database/queries/utilisateurs'

import globales from '../../../database/cache/globales'

import utilisateurUpdationValidate from '../../../business/utilisateur-updation-validate'

import { utilisateurRowUpdate } from '../../../tools/export/utilisateur'

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
    const fields = fieldsBuild(info)
    const utilisateur = await utilisateurGet(id, { fields }, context.user?.id)

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
    entrepriseIds?: string[] | undefined
    administrationIds?: string[] | undefined
    permissionIds?: string[] | undefined
    noms?: string | null
    emails?: string | null
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
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
        context.user?.id
      ),
      utilisateursCount(
        {
          entrepriseIds,
          administrationIds,
          permissionIds,
          noms,
          emails
        },
        { fields: fields.elements },
        context.user?.id
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

const moi = async (_: never, context: IToken) => {
  try {
    // vérifie que la base de données est remplie au démarrage du serveur
    // TODO:
    // mettre ça dans un middleware à la racine de l'app express
    if (!globales.chargement) {
      await init()
    }

    const user = context.user && (await userGet(context.user.id))

    return userFormat(user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurTokenCreer = async (
  {
    email,
    motDePasse
  }: {
    email: string
    motDePasse: string
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)
    email = email.toLowerCase()
    if (!emailCheck(email)) {
      throw new Error('adresse email invalide')
    }

    const user = await userByEmailGet(email, { fields: fields.utilisateur })
    if (!user) {
      throw new Error('aucun utilisateur enregistré avec cette adresse email')
    }

    const valid = bcrypt.compareSync(motDePasse, user.motDePasse!)
    if (!valid) {
      throw new Error('mot de passe incorrect')
    }

    return {
      token: userTokenCreate(user),
      utilisateur: userFormat(user)
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
        ({
          user: { email: cerbereUtilisateur.email }
        } as unknown) as IToken
      )
    }

    return {
      token: userTokenCreate(utilisateur),
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
    if (!context.user) {
      throw new Error('droits insuffisants pour créer un utilisateur')
    }

    const user = await userGet(context.user?.id)

    utilisateur.email = utilisateur.email!.toLowerCase()

    const errors = utilisateurEditionCheck(utilisateur)

    if (
      !permissionCheck(user?.permissionId, ['super']) &&
      utilisateur.permissionId === 'super'
    ) {
      errors.push('droits insuffisants pour créer un super utilisateur')
    }

    if (
      !permissionCheck(user?.permissionId, ['super', 'admin']) &&
      context.user.email !== utilisateur.email
    ) {
      errors.push('droits insuffisants pour créer un utilisateur')
    }

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
      {}
    )

    await utilisateurRowUpdate(utilisateurUpdated)

    return utilisateurUpdated
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurCreationEmailEnvoyer = async ({
  email
}: {
  email: string
}) => {
  try {
    email = email.toLowerCase()

    if (!emailCheck(email)) {
      throw new Error('adresse email invalide')
    }

    const user = await userByEmailGet(email)

    if (user) {
      throw new Error(
        'un utilisateur est déjà enregistré avec cette adresse email'
      )
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET!)

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

    if (!user || (!isSuper && !isAdmin && user.id !== utilisateur.id)) {
      throw new Error('droits insuffisants pour modifier cet utilisateur')
    }

    const errors = utilisateurEditionCheck(utilisateur)

    if (
      utilisateur.permissionId &&
      !isSuper &&
      (!isAdmin ||
        permissionCheck(utilisateur.permissionId, ['super', 'admin']))
    ) {
      errors.push(
        'droits insuffisants pour affecter ces permissions à cet utilisateur'
      )
    }

    if (!isSuper && !isAdmin && user.email !== utilisateur.email) {
      errors.push(
        "droits insuffisants pour modifier l'adresse email de cet utilisateur"
      )
    }

    if (!isSuper) {
      const errorsValidate = await utilisateurUpdationValidate(
        user,
        utilisateur,
        isAdmin
      )

      if (errorsValidate.length) {
        errors.push(...errorsValidate)
      }
    }

    if (errors.length) {
      throw new Error(errors.join(', '))
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

    const fields = fieldsBuild(info)

    const utilisateurUpdated = await utilisateurUpdate(utilisateur, { fields })

    await utilisateurRowUpdate(utilisateurUpdated)

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
    if (
      !user ||
      (!['super', 'admin'].includes(user.permissionId) && user.id !== id)
    ) {
      throw new Error('droits insuffisants pour mettre à jour cet utilisateur')
    }

    const utilisateur = await utilisateurGet(id, {}, context.user?.id)
    if (!utilisateur) {
      throw new Error('aucun utilisateur avec cet id')
    }

    utilisateur.email = ''
    utilisateur.motDePasse = 'suppression'
    utilisateur.telephoneFixe = ''
    utilisateur.telephoneMobile = ''
    utilisateur.permissionId = 'defaut'
    utilisateur.entreprises = []
    utilisateur.administrations = []

    const utilisateurUpdated = await utilisateurUpdate(utilisateur, {})

    await utilisateurRowUpdate(utilisateurUpdated)

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

    const utilisateur = await utilisateurGet(id, {}, context.user?.id)

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

    const utilisateurUpdated = await utilisateurUpdate(
      {
        id,
        motDePasse: utilisateur.motDePasse
      } as IUtilisateur,
      {}
    )

    await utilisateurRowUpdate(utilisateurUpdated)

    return utilisateurUpdated
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

// envoie l'email avec un lien vers un formulaire de ré-init
const utilisateurMotDePasseEmailEnvoyer = async ({
  email
}: {
  email: string
}) => {
  try {
    if (!emailCheck(email)) {
      throw new Error('adresse email invalide')
    }

    const utilisateur = await userByEmailGet(email)

    if (!utilisateur) {
      throw new Error('aucun utilisateur enregistré avec cette adresse email')
    }

    const token = jwt.sign({ id: utilisateur.id }, process.env.JWT_SECRET!)

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

    const utilisateur = await utilisateurGet(
      context.user.id,
      {},
      context.user?.id
    )

    if (!utilisateur) {
      throw new Error('aucun utilisateur enregistré avec cet id')
    }

    utilisateur.motDePasse = bcrypt.hashSync(motDePasse1, 10)

    const utilisateurUpdated = await utilisateurUpdate(
      {
        id: context.user.id,
        motDePasse: utilisateur.motDePasse
      } as IUtilisateur,
      {}
    )

    await utilisateurRowUpdate(utilisateurUpdated)

    return {
      token: userTokenCreate(utilisateurUpdated),
      utilisateur: userFormat(utilisateurUpdated)
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const userTokenCreate = ({ id, email }: IUtilisateur) =>
  jwt.sign({ id, email }, process.env.JWT_SECRET!)

export {
  utilisateur,
  utilisateurs,
  moi,
  utilisateurTokenCreer,
  utilisateurCerbereUrlObtenir,
  utilisateurCerbereTokenCreer,
  utilisateurCreer,
  utilisateurCreationEmailEnvoyer,
  utilisateurModifier,
  utilisateurSupprimer,
  utilisateurMotDePasseModifier,
  utilisateurMotDePasseEmailEnvoyer,
  utilisateurMotDePasseInitialiser
}
