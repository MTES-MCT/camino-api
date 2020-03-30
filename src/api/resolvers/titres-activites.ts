import { IToken, ITitreActivite, ITitre, IUtilisateur } from '../../types'
import { GraphQLResolveInfo } from 'graphql'
import { debug } from '../../config/index'
import * as dateFormat from 'dateformat'

import { titreActiviteEmailsSend } from './_titre-activite'
import { permissionsCheck } from './permissions/permissions-check'
import { titreActivitePermissionCheck } from './permissions/titre'
import { titreActiviteFormat } from './format/titres-activites'

import fieldsBuild from './_fields-build'

import {
  titreActiviteGet,
  titresActivitesGet,
  titreActiviteUpdate as titreActiviteUpdateQuery
} from '../../database/queries/titres-activites'
import { userGet, utilisateursGet } from '../../database/queries/utilisateurs'

import { titreActivitesRowUpdate } from '../../tools/export/titre-activites'

import titreActiviteUpdationValidate from '../../business/titre-activite-updation-validate'

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
  { typeId, annee }: { typeId: string; annee: number },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)

    const titresActivites = await titresActivitesGet(
      { typeId, annee },
      { fields },
      context.user?.id
    )

    if (!titresActivites.length) return []

    return titresActivites.map(ta => titreActiviteFormat(ta, fields))
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
      !permissionsCheck(user, ['super', 'admin']) &&
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
      const utilisateurs = await titreActiviteUtilisateursGet(
        activiteFormated.titre!,
        user
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

const titreActiviteUtilisateursGet = (
  titre: ITitre,
  utilisateur: IUtilisateur
) => {
  try {
    const isAmodiataire = titre.amodiataires?.some(t =>
      utilisateur.entreprises?.some(e => e.id === t.id)
    )
    const entrepriseIds = isAmodiataire
      ? titre.amodiataires?.map(t => t.id)
      : titre.titulaires?.map(t => t.id)

    return utilisateursGet({
      entrepriseIds,
      noms: undefined,
      administrationIds: undefined,
      permissionIds: undefined
    })
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { activite, activites, activiteModifier }
