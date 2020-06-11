import { IToken, ITitreActivite, ITitreActiviteColonneId } from '../../../types'
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

import { titreActivitesRowUpdate } from '../../../tools/export/titre-activites'

import titreActiviteUpdationValidate from '../../../business/titre-activite-updation-validate'

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
    titresTerritoires
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

    const titresActivites = await titresActivitesGet(
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
        statutsIds
      },
      { fields: fields.elements },
      context.user?.id
    )

    const total = await titresActivitesCount(
      {
        typesIds,
        annees,
        titresNoms,
        titresEntreprises,
        titresSubstances,
        titresReferences,
        titresTerritoires,
        statutsIds
      },
      { fields: fields.elements },
      context.user?.id
    )

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

const activiteModifier = async (
  { activite }: { activite: ITitreActivite },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const activiteOld = await titreActiviteGet(
      activite.id,
      { fields: { type: { titresTypes: { id: {} } }, titre: { id: {} } } },
      context.user?.id
    )
    if (!activiteOld) throw new Error("l'activité n'existe pas")

    const user = context.user && (await userGet(context.user.id))
    if (!user) throw new Error("droits insuffisants modifier l'activité")

    if (
      !permissionCheck(user?.permissionId, ['super', 'admin']) &&
      activiteOld?.statutId === 'dep'
    ) {
      throw new Error(
        'cette activité a été validée et ne peux plus être modifiée'
      )
    }

    if (
      !activiteOld.type!.titresTypes.find(
        type =>
          type.domaineId === activiteOld.titre!.domaineId &&
          type.id === activiteOld.titre!.typeId
      )
    ) {
      throw new Error("ce titre ne peut pas recevoir d'activité")
    }

    const validationErrors = titreActiviteUpdationValidate(
      activite.contenu,
      activiteOld.type?.sections
    )

    if (validationErrors.length) {
      throw new Error(validationErrors.join(', '))
    }

    activite.utilisateurId = user.id

    const aujourdhui = dateFormat(new Date(), 'yyyy-mm-dd')
    activite.dateSaisie = aujourdhui

    const fields = fieldsBuild(info)

    const activiteRes = await titreActiviteUpdateQuery(activite.id, activite, {
      fields
    })

    titreActivitesRowUpdate([activiteRes])

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
