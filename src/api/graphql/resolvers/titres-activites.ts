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
    annees
  }: {
    page?: number | null
    intervalle?: number | null
    ordre?: 'asc' | 'desc' | null
    colonne?: ITitreActiviteColonneId | null
    typesIds?: string[] | null
    annees?: number[] | null
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
        annees
      },
      { fields: fields.activites },
      context.user?.id
    )

    const total = await titresActivitesCount(
      { typesIds, annees },
      { fields: fields.activites },
      context.user?.id
    )

    if (!titresActivites.length) return { activites: [], total: 0 }

    return {
      activites: titresActivites.map(ta =>
        titreActiviteFormat(ta, fields.activites)
      ),
      total
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const activitesAnnees = async (_: unknown, context: IToken) => {
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

    if (!activiteOld) return null

    if (
      !activiteOld.type!.titresTypes.find(
        type =>
          type.domaineId === activiteOld.titre!.domaineId &&
          type.id === activiteOld.titre!.typeId
      )
    ) {
      throw new Error("ce titre ne peut pas recevoir d'activité")
    }

    const user = context.user && (await userGet(context.user.id))
    if (!user) return null

    if (
      !permissionCheck(user, ['super', 'admin']) &&
      activiteOld?.statutId === 'dep'
    ) {
      throw new Error(
        'cette activité a été validée et ne peux plus être modifiée'
      )
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
