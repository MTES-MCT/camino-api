import { IToken, ITitreActivite, ITitreActiviteColonneId } from '../../../types'
import { GraphQLResolveInfo } from 'graphql'
import { debug } from '../../../config/index'
import * as dateFormat from 'dateformat'

import { titreActiviteEmailsSend } from './_titre-activite'
import {
  titreActiviteContenuFormat,
  titreActiviteFormat
} from '../../_format/titres-activites'

import fieldsBuild from './_fields-build'

import {
  titreActiviteGet,
  titresActivitesCount,
  titresActivitesGet,
  titresActivitesAnneesGet,
  titreActiviteUpdate as titreActiviteUpdateQuery,
  titreActiviteDelete
} from '../../../database/queries/titres-activites'
import {
  userGet,
  utilisateursGet
} from '../../../database/queries/utilisateurs'

import { titreActiviteInputValidate } from '../../_validate/titre-activite-input-validate'
import { titreActiviteCompleteCheck } from '../../../business/validations/titre-activite-complete-check'
import { titreActiviteDeletionValidate } from '../../../business/validations/titre-activite-deletion-validate'
import { userSuper } from '../../../database/user-super'
import { documentsModifier } from './documents'

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
        { fields: { id: {} } },
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

const activiteModifier = async (
  { activite, depose }: { activite: ITitreActivite; depose: boolean },
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

    const aujourdhui = dateFormat(new Date(), 'yyyy-mm-dd')
    activite.dateSaisie = aujourdhui

    if (activite.contenu) {
      activite.contenu = titreActiviteContenuFormat(
        oldTitreActivite.sections,
        activite.contenu,
        'write'
      )
    }

    const fields = fieldsBuild(info)

    if (oldTitreActivite.statutId !== 'dep' && depose) {
      const complete = titreActiviteCompleteCheck(
        activite,
        oldTitreActivite.sections,
        oldTitreActivite.type!.documentsTypes
      )
      activite.statutId = depose && complete ? 'dep' : 'enc'
    }

    await documentsModifier(
      context,
      activite,
      'titreActiviteId',
      oldTitreActivite
    )

    await titreActiviteUpdateQuery(activite.id, activite)
    const activiteRes = await titreActiviteGet(activite.id, { fields }, user)

    if (!activiteRes) throw new Error("l'activité n'existe pas")
    const activiteFormated = titreActiviteFormat(activiteRes, fields)

    if (activiteRes.statutId === 'dep') {
      const titre = activiteFormated.titre!

      const isAmodiataire = titre.amodiataires?.some(t =>
        user.entreprises?.some(e => e.id === t.id)
      )

      const entrepriseIds = isAmodiataire
        ? titre.amodiataires?.map(t => t.id)
        : titre.titulaires?.map(t => t.id)

      const utilisateurs = await utilisateursGet(
        {
          entrepriseIds,
          noms: undefined,
          administrationIds: undefined,
          permissionIds: undefined
        },
        {},
        userSuper
      )

      await titreActiviteEmailsSend(
        activiteFormated,
        activiteFormated.titre!.nom,
        user,
        utilisateurs,
        oldTitreActivite.type!.email
      )
    }

    return activiteFormated
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

    return titreActiviteDelete(id, {})
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
  activiteSupprimer
}
