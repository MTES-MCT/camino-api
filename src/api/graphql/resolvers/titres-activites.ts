import dateFormat from 'dateformat'
import { GraphQLResolveInfo } from 'graphql'

import {
  ITitre,
  ITitreActivite,
  ITitreActiviteColonneId,
  IToken,
  IUtilisateur
} from '../../../types'

import { debug } from '../../../config/index'

import { titreActiviteEmailsSend } from './_titre-activite'
import {
  titreActiviteContenuFormat,
  titreActiviteFormat
} from '../../_format/titres-activites'

import { fieldsBuild } from './_fields-build'

import {
  titreActiviteDelete,
  titreActiviteGet,
  titreActiviteUpdate as titreActiviteUpdateQuery,
  titresActivitesAnneesGet,
  titresActivitesCount,
  titresActivitesGet
} from '../../../database/queries/titres-activites'
import {
  userGet,
  utilisateursGet
} from '../../../database/queries/utilisateurs'

import { titreActiviteInputValidate } from '../../../business/validations/titre-activite-input-validate'
import { titreActiviteDeletionValidate } from '../../../business/validations/titre-activite-deletion-validate'
import { userSuper } from '../../../database/user-super'
import { fichiersRepertoireDelete } from './_titre-document'
import { documentsLier } from './documents'
import { titreGet } from '../../../database/queries/titres'

/**
 * Retourne une activité
 *
 * @param id - id de l'activité
 * @param context - contexte utilisateur
 * @param info - objet contenant les propriétés de la requête graphQl
 * @returns une activité
 *
 */

const activite = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info)

    const titreActivite = await titreActiviteGet(id, { fields }, user)

    if (!titreActivite) return null

    return titreActivite && titreActiviteFormat(titreActivite, fields)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

/**
 * Retourne les activités
 *
 * @param page - numéro de page
 * @param intervalle - nombre d'éléments par page
 * @param ordre - ordre de tri
 * @param colonne - colonne de tri
 * @param typesIds - tableau de type(s) d'activité
 * @param statutsIds - tableau de statut(s) d'activité
 * @param annees - année de l'activité
 * @param titresNoms - chaîne de nom(s) de titre
 * @param titresEntreprises - chaîne de nom(s) d'entreprise titulaire ou amodiataire d'un titre
 * @param titresSubstances - chaîne de substance(s) se rapportant à un titre
 * @param titresReferences - chaîne de référence(s) se rapportant à un titre
 * @param titresTerritoires - chaîne de territoire(s) se rapportant à un titre
 * @param titresTypesIds - tableau de type(s) de titre
 * @param titresDomainesIds - tableau de domaine(s)
 * @param titresStatutsIds - tableau de statut(s) de titre
 * @param context - contexte utilisateur
 * @param info - objet contenant les propriétés de la requête graphQl
 * @returns une liste d'activités
 *
 */

const activites = async (
  {
    page,
    intervalle,
    ordre,
    colonne,
    typesIds,
    statutsIds,
    annees,
    titresNoms,
    titresEntreprises,
    titresSubstances,
    titresReferences,
    titresTerritoires,
    titresTypesIds,
    titresDomainesIds,
    titresStatutsIds
  }: {
    page?: number | null
    intervalle?: number | null
    ordre?: 'asc' | 'desc' | null
    colonne?: ITitreActiviteColonneId | null
    typesIds?: string[] | null
    statutsIds?: string[] | null
    annees?: number[] | null
    titresNoms?: string | null
    titresEntreprises?: string | null
    titresSubstances?: string | null
    titresReferences?: string | null
    titresTerritoires?: string | null
    titresTypesIds?: string[] | null
    titresDomainesIds?: string[] | null
    titresStatutsIds?: string[] | null
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info)

    if (!intervalle) {
      intervalle = 200
    }

    if (!page) {
      page = 1
    }

    const [titresActivites, total] = await Promise.all([
      titresActivitesGet(
        {
          intervalle,
          page,
          ordre,
          colonne,
          typesIds,
          annees,
          titresNoms,
          titresEntreprises,
          titresSubstances,
          titresReferences,
          titresTerritoires,
          statutsIds,
          titresTypesIds,
          titresDomainesIds,
          titresStatutsIds
        },
        { fields: fields.elements },
        user
      ),
      titresActivitesCount(
        {
          typesIds,
          annees,
          titresNoms,
          titresEntreprises,
          titresSubstances,
          titresReferences,
          titresTerritoires,
          statutsIds,
          titresTypesIds,
          titresDomainesIds,
          titresStatutsIds
        },
        { fields: {} },
        user
      )
    ])

    if (!titresActivites.length) return { elements: [], total: 0 }

    return {
      elements: titresActivites.map(ta =>
        titreActiviteFormat(ta, fields.activites)
      ),
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

/**
 * Retourne les années des activités
 *
 * @param context - contexte utilisateur
 * @returns une liste d'année(s)
 *
 */

const activitesAnnees = async (_: never, context: IToken) => {
  try {
    const user = await userGet(context.user?.id)
    const titreActivites = await titresActivitesAnneesGet(user)

    if (!titreActivites || !titreActivites.length) return []
    const annees = titreActivites.map(ta => ta.annee)

    return annees
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const activiteDeposer = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!user) throw new Error('droits insuffisants')

    const activite = await titreActiviteGet(
      id,
      {
        fields: {
          documents: { id: {} },
          type: { documentsTypes: { id: {} } }
        }
      },
      user
    )

    if (!activite) throw new Error("l'activité n'existe pas")
    const fields = fieldsBuild(info)

    if (!titreActiviteFormat(activite, fields).deposable)
      throw new Error('droits insuffisants')

    await titreActiviteUpdateQuery(activite.id, {
      statutId: 'dep',
      utilisateurId: user.id,
      dateSaisie: dateFormat(new Date(), 'yyyy-mm-dd')
    })
    const activiteRes = await titreActiviteGet(activite.id, { fields }, user)

    if (!activiteRes) throw new Error("l'activité n'existe pas")
    const activiteFormated = titreActiviteFormat(activiteRes, fields)

    const titre = (await titreGet(
      activiteRes.titreId,
      {
        fields: {
          titulaires: { id: {} },
          amodiataires: { id: {} },
          administrationsGestionnaires: { activitesTypesEmails: { id: {} } },
          administrationsLocales: { activitesTypesEmails: { id: {} } }
        }
      },
      userSuper
    )) as ITitre

    const isAmodiataire = titre.amodiataires?.some(t =>
      user.entreprises?.some(e => e.id === t.id)
    )

    const entrepriseIds = isAmodiataire
      ? titre.amodiataires?.map(t => t.id)
      : titre.titulaires?.map(t => t.id)

    let utilisateurs: IUtilisateur[] = []
    if (entrepriseIds?.length) {
      utilisateurs = await utilisateursGet(
        {
          entrepriseIds,
          noms: undefined,
          administrationIds: undefined,
          permissionIds: undefined
        },
        { fields: {} },
        userSuper
      )
    }

    const administrations = []
    if (titre.administrationsGestionnaires?.length) {
      administrations.push(...titre.administrationsGestionnaires)
    }
    if (titre.administrationsLocales?.length) {
      administrations.push(...titre.administrationsLocales)
    }

    await titreActiviteEmailsSend(
      activiteFormated,
      activiteFormated.titre!.nom,
      user,
      utilisateurs,
      administrations
    )

    return activiteFormated
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const activiteModifier = async (
  { activite }: { activite: ITitreActivite & { documentIds?: string[] } },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!user) throw new Error('droits insuffisants')

    const oldTitreActivite = await titreActiviteGet(
      activite.id,
      {
        fields: {
          documents: { id: {} },
          type: { documentsTypes: { id: {} } }
        }
      },
      user
    )

    if (!oldTitreActivite) throw new Error("l'activité n'existe pas")

    if (!oldTitreActivite.modification) throw new Error('droits insuffisants')

    const inputErrors = titreActiviteInputValidate(
      activite,
      oldTitreActivite.sections
    )

    if (inputErrors.length) {
      throw new Error(inputErrors.join(', '))
    }

    activite.utilisateurId = user.id
    activite.dateSaisie = dateFormat(new Date(), 'yyyy-mm-dd')
    activite.statutId = 'enc'

    if (activite.contenu) {
      activite.contenu = titreActiviteContenuFormat(
        oldTitreActivite.sections,
        activite.contenu,
        'write'
      )
    }

    const fields = fieldsBuild(info)

    const documentIds = activite.documentIds || []
    await documentsLier(
      context,
      documentIds,
      activite.id,
      'titreActiviteId',
      oldTitreActivite
    )
    delete activite.documentIds

    await titreActiviteUpdateQuery(activite.id, activite)
    const activiteRes = await titreActiviteGet(activite.id, { fields }, user)

    if (!activiteRes) throw new Error("l'activité n'existe pas")

    return titreActiviteFormat(activiteRes, fields)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const activiteSupprimer = async ({ id }: { id: string }, context: IToken) => {
  try {
    const user = await userGet(context.user?.id)
    const oldTitreActivite = await titreActiviteGet(id, { fields: {} }, user)

    if (!oldTitreActivite) throw new Error("l'activité n'existe pas")

    if (!oldTitreActivite.suppression) throw new Error('droits insuffisants')

    const rulesErrors = titreActiviteDeletionValidate(oldTitreActivite)

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    const activite = titreActiviteDelete(id, {})

    await fichiersRepertoireDelete(id, 'activites')

    return activite
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export {
  activite,
  activites,
  activitesAnnees,
  activiteModifier,
  activiteSupprimer,
  activiteDeposer
}
