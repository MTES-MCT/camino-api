import { IToken, ITitreActivite, ITitre, IUtilisateur } from '../../types'
import { GraphQLResolveInfo } from 'graphql'
import { debug } from '../../config/index'
import * as dateFormat from 'dateformat'
import { titreActiviteEmailsSend } from './_titre-activite'
import { permissionsCheck } from './permissions/permissions-check'
import {
  titrePermissionCheck,
  titreActivitePermissionCheck
} from './permissions/titre'
import { titreActiviteFormat } from './format/titres-activites'
import graphFieldsBuild from './graph/fields-build'
import graphBuild from './graph/build'
import graphFormat from './graph/format'

import {
  titreActiviteGet,
  titresActivitesGet,
  titreActiviteUpdate as titreActiviteUpdateQuery
} from '../../database/queries/titres-activites'
import {
  utilisateurGet,
  utilisateursGet
} from '../../database/queries/utilisateurs'
import { titreGet } from '../../database/queries/titres'

import { titreActivitesRowUpdate } from '../../tools/export/titre-activites'

import titreActiviteUpdationValidate from '../../business/titre-activite-updation-validate'

const activite = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))

    const fields = graphFieldsBuild(info)

    const graph = graphBuild(fields, 'activite', graphFormat)

    const titreActivite = await titreActiviteGet(id, { graph })

    if (
      !titreActivitePermissionCheck(
        user,
        titreActivite.type?.administrations,
        titreActivite.titre?.amodiataires,
        titreActivite.titre?.titulaires
      )
    ) {
      throw new Error('droits insuffisants')
    }

    return titreActivite && titreActiviteFormat(user, titreActivite)
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
    const user = context.user && (await utilisateurGet(context.user.id))

    const fields = graphFieldsBuild(info)

    const graph = graphBuild(fields, 'activites', graphFormat)

    const titresActivites = await titresActivitesGet(
      { typeId, annee },
      { graph }
    )

    return (
      titresActivites &&
      titresActivites.length &&
      titresActivites.reduce((res: ITitreActivite[], titreActivite) => {
        if (
          titreActivitePermissionCheck(
            user,
            titreActivite.type?.administrations,
            titreActivite.titre?.amodiataires,
            titreActivite.titre?.titulaires
          )
        ) {
          res.push(titreActiviteFormat(user, titreActivite))
        }

        return res
      }, [])
    )
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
    const user = context.user && (await utilisateurGet(context.user.id))

    if (!user) {
      throw new Error('droits insuffisants')
    }

    const activiteOld = await titreActiviteGet(activite.id)
    const titre = await titreGet(activiteOld.titreId)

    if (!titrePermissionCheck(user, ['super', 'admin'], titre, true)) {
      throw new Error('droits insuffisants')
    }

    if (!activiteOld) {
      throw new Error("cette activité n'existe pas")
    }

    if (
      !activiteOld.type!.titresTypes.find(
        type => type.domaineId === titre.domaineId && type.id === titre.typeId
      )
    ) {
      throw new Error("ce titre ne peut pas recevoir d'activité")
    }

    if (
      !permissionsCheck(user, ['super', 'admin']) &&
      activiteOld &&
      activiteOld.statutId === 'dep'
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
    activite.dateSaisie = dateFormat(new Date(), 'yyyy-mm-dd')

    const fields = graphFieldsBuild(info)

    const graph = graphBuild(fields, 'activites', graphFormat)

    const activiteRes = await titreActiviteUpdateQuery(activite.id, activite, {
      graph
    })

    titreActivitesRowUpdate([activiteRes])

    const activiteFormated = titreActiviteFormat(user, activiteRes)

    if (activiteRes.statutId === 'dep') {
      const utilisateurs = await titreActiviteUtilisateursGet(titre, user)

      await titreActiviteEmailsSend(
        activiteFormated,
        titre.nom,
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
