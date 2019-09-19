import * as dateFormat from 'dateformat'
import titreActiviteEmailFormat from './_titre-activite-email-format'
import { titrePermissionCheck } from './_titre'

import {
  titreActiviteGet,
  titreActiviteUpdate as titreActiviteUpdateQuery
} from '../../database/queries/titres-activites'
import {
  utilisateurGet,
  utilisateursGet
} from '../../database/queries/utilisateurs'
import { titreGet } from '../../database/queries/titres'

import permissionsCheck from './_permissions-check'

import emailsSend from '../../tools/emails-send'
import titreActiviteUpdate from '../../business/titre-activite-update'

const titreActiviteModifier = async ({ activite }, context, info) => {
  const user = await utilisateurGet(context.user.id)
  const activiteOld = await titreActiviteGet(activite.id)
  const titre = await titreGet(activiteOld.titreId)

  if (!titrePermissionCheck(titre, user, ['admin', 'super'], true)) {
    throw new Error("droits insuffisants pour effectuer l'opération")
  }

  if (
    !activiteOld.type.types.find(
      type => type.domaineId === titre.domaineId && type.id === titre.typeId
    )
  ) {
    throw new Error("ce titre ne peut pas recevoir d'activite")
  }

  if (
    !permissionsCheck(context.user, ['super', 'admin']) &&
    activiteOld &&
    activiteOld.statut.id === 'dep'
  ) {
    throw new Error(
      'cette activite a été validée et ne peux plus être modifiée'
    )
  }

  activite.utilisateurId = context.user.id
  activite.dateSaisie = dateFormat(new Date(), 'yyyy-mm-dd')

  const activiteRes = await titreActiviteUpdateQuery(activite.id, activite)

  await titreActiviteUpdate(activiteRes.id)

  if (activiteRes.activiteStatutId === 'dep') {
    const isAmodiataire = titre.amodiataires.some(
      t => t.id === user.entrepriseId
    )
    const entrepriseIds = isAmodiataire
      ? titre.amodiataires.map(t => t.id)
      : titre.titulaires.map(t => t.id)
    const emails = await emailsGet(entrepriseIds)
    const emailTitle = `${titre.nom} | ${activiteRes.type.nom}, ${
      activiteRes.type.frequence.periodesNom
        ? activiteRes.type.frequence[activiteRes.type.frequence.periodesNom][
            activiteRes.frequencePeriodeId - 1
          ].nom
        : ''
    } ${activiteRes.annee}`
    const subject = `[Camino] ${emailTitle}`
    const html = titreActiviteEmailFormat(emailTitle, user, activiteRes)

    await emailsSend(emails, subject, html)
  }

  return activiteRes
}

const emailsGet = async entrepriseIds => {
  const utilisateurs = await utilisateursGet({
    entrepriseIds,
    noms: undefined,
    administrationIds: undefined,
    permissionIds: undefined
  })

  return utilisateurs.reduce(
    (res, u) => {
      if (u.email) {
        res.push(u.email)
      }

      return res
    },
    // si la variable d'environnement existe,
    // on ajoute un email générique pour recevoir une copie
    process.env.ACTIVITES_RAPPORTS_EMAIL
      ? [process.env.ACTIVITES_RAPPORTS_EMAIL]
      : []
  )
}

export { titreActiviteModifier }
