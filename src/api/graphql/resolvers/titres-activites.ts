import {
  IToken,
  ITitreActivite,
  ITitreActiviteColonneId,
  IUtilisateur
} from '../../../types'
import { GraphQLResolveInfo } from 'graphql'
import { debug } from '../../../config/index'
import * as dateFormat from 'dateformat'

import { titreActiviteEmailsSend } from './_titre-activite'
import { permissionCheck } from '../../../tools/permission'
import { titreActiviteFormat } from '../../_format/titres-activites'

import fieldsBuild from './_fields-build'

import {
  titreActiviteGet,
  titresActivitesCount,
  titresActivitesGet,
  activitesAnneesGet,
  titreActiviteUpdate as titreActiviteUpdateQuery
} from '../../../database/queries/titres-activites'
import {
  userGet,
  utilisateursGet
} from '../../../database/queries/utilisateurs'

import titreActiviteInputValidate from '../../_validate/titre-activite-input-validate'
import titreActiviteUpdationValidate from '../../../business/validations/titre-activite-updation-validate'

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
    const fields = fieldsBuild(info)

    const titreActivite = await titreActiviteGet(
      id,
      { fields },
      context.user?.id
    )

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
        context.user?.id
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
        context.user?.id
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
    const annees = await activitesAnneesGet(context.user?.id)

    if (!annees || !annees.length) return []

    return annees
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const activitePermissionCheck = (
  activite: ITitreActivite,
  user: IUtilisateur
) => {
  if (
    permissionCheck(user?.permissionId, ['super']) ||
    (permissionCheck(user?.permissionId, ['admin']) &&
      user.administrations?.some(a =>
        a.activitesTypes?.some(
          at => at.id === activite.typeId && at.modification
        )
      ))
  ) {
    return true
  }

  if (
    permissionCheck(user?.permissionId, ['entreprise']) &&
    ['enc', 'abs'].includes(activite.statutId) &&
    user.entreprises?.some(
      e =>
        activite.titre?.titulaires?.some(t => t.id === e.id) ||
        activite.titre?.amodiataires?.some(t => t.id === e.id)
    )
  ) {
    return true
  }

  return false
}

const activiteModifier = async (
  { activite }: { activite: ITitreActivite },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const activiteOld = await titreActiviteGet(
      activite.id,
      {
        fields: {
          titre: { titulaires: { id: {} }, amodiataires: { id: {} } }
        }
      },
      context.user?.id
    )

    if (!activiteOld) throw new Error("l'activité n'existe pas")

    const user = context.user && (await userGet(context.user.id))

    if (!user || !activitePermissionCheck(activiteOld, user)) {
      throw new Error('cette activité ne peut pas être modifiée')
    }

    const inputErrors = titreActiviteInputValidate(
      activite,
      activiteOld.type?.sections
    )
    if (inputErrors.length) {
      throw new Error(inputErrors.join(', '))
    }

    const rulesErrors = titreActiviteUpdationValidate(activite)
    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    activite.utilisateurId = user.id

    const aujourdhui = dateFormat(new Date(), 'yyyy-mm-dd')
    activite.dateSaisie = aujourdhui

    const fields = fieldsBuild(info)

    const activiteRes = await titreActiviteUpdateQuery(activite.id, activite, {
      fields
    })

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
        'super'
      )

      await titreActiviteEmailsSend(
        activiteFormated,
        activiteFormated.titre!.nom,
        user,
        utilisateurs
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

export { activite, activites, activitesAnnees, activiteModifier }
