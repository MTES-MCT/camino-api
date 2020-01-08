import { debug } from '../../config/index'
import * as dateFormat from 'dateformat'
import { titreActiviteEmailsSend } from './_titre-activite'
import { permissionsCheck } from './permissions/permissions-check'
import { titrePermissionCheck } from './permissions/titre'
import { titreActiviteFormat } from './format/titre'
import fieldsBuild from './_fields-build'
import graphBuild from './_graph-build'
import titreGraphFormat from './_titre-graph-format'

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
    if (!permissionsCheck(user, ['super'])) {
      throw new Error("droits insuffisants pour effectuer l'opération")
    }

    const fields = fieldsBuild(info)

    const graph = graphBuild(fields, 'titre', titreGraphFormat)

    const activite = await titreActiviteGet(id, { graph })

    return activite && titreActiviteFormat(activite)
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
    if (!permissionsCheck(user, ['super'])) {
      throw new Error("droits insuffisants pour effectuer l'opération")
    }

    const fields = fieldsBuild(info)

    const graph = graphBuild(fields, 'titre', titreGraphFormat)

    const activites = await titresActivitesGet({ typeId, annee }, { graph })

    return activites && activites.map(activite => titreActiviteFormat(activite))
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

    const activiteFormated = titreActiviteFormat(activiteRes)

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
