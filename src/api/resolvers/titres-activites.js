import { debug } from '../../config/index'
import * as dateFormat from 'dateformat'
import { titreActiviteEmailsSend } from './_titre-activite'
import { permissionsCheck } from './permissions/permissions-check'
import {
  titrePermissionCheck,
  titreActivitePermissionCheck
} from './permissions/titre'
import { titreActiviteFormat } from './format/titre-activites'
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

import titreActiviteUpdate from '../../business/titre-activite-update'
import titreActiviteUpdationValidate from '../../business/titre-activite-updation-validate'

const activite = async ({ id }, context, info) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))

    const fields = graphFieldsBuild(info)

    const graph = graphBuild(fields, 'activite', graphFormat)

    const activite = await titreActiviteGet(id, { graph })

    if (!titreActivitePermissionCheck(user, activite.titre, activite)) {
      throw new Error("droits insuffisants pour effectuer l'opération")
    }

    return activite && titreActiviteFormat(activite, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const activites = async ({ typeId, annee }, context, info) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))

    const fields = graphFieldsBuild(info)

    const graph = graphBuild(fields, 'activites', graphFormat)

    const activites = await titresActivitesGet({ typeId, annee }, { graph })

    return (
      activites &&
      activites.length &&
      activites.reduce((res, activite) => {
        if (titreActivitePermissionCheck(user, activite.titre, activite)) {
          res.push(titreActiviteFormat(activite, user))
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

const activiteModifier = async ({ activite }, context, info) => {
  try {
    const user = await utilisateurGet(context.user.id)
    const activiteOld = await titreActiviteGet(activite.id)
    const titre = await titreGet(activiteOld.titreId)

    if (!titrePermissionCheck(titre, user, ['super', 'admin'], true)) {
      throw new Error("droits insuffisants pour effectuer l'opération")
    }

    if (
      !activiteOld.type.types.find(
        type => type.domaineId === titre.domaineId && type.id === titre.typeId
      )
    ) {
      throw new Error("ce titre ne peut pas recevoir d'activité")
    }

    if (
      !permissionsCheck(context.user, ['super', 'admin']) &&
      activiteOld &&
      activiteOld.statut.id === 'dep'
    ) {
      throw new Error(
        'cette activité a été validée et ne peux plus être modifiée'
      )
    }

    const validationErrors = titreActiviteUpdationValidate(
      activite.contenu,
      activiteOld.type.sections
    )

    if (validationErrors.length) {
      throw new Error(validationErrors.join(', '))
    }

    activite.utilisateurId = context.user.id
    activite.dateSaisie = dateFormat(new Date(), 'yyyy-mm-dd')

    const activiteRes = await titreActiviteUpdateQuery(activite.id, activite)

    await titreActiviteUpdate(activiteRes.id)

    titreActivitesRowUpdate([activiteRes])

    const activiteFormated = titreActiviteFormat(activiteRes, user)

    if (activiteRes.activiteStatutId === 'dep') {
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

const titreActiviteUtilisateursGet = (titre, user) => {
  try {
    const isAmodiataire = titre.amodiataires.some(
      t => t.id === user.entrepriseId
    )
    const entrepriseIds = isAmodiataire
      ? titre.amodiataires.map(t => t.id)
      : titre.titulaires.map(t => t.id)

    return utilisateursGet({
      entrepriseIds,
      noms: null,
      administrationIds: null,
      permissionIds: null
    })
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { activite, activites, activiteModifier }
