import * as dateFormat from 'dateformat'

import auth from './_auth'

import {
  titreActiviteGet,
  titreActiviteUpdate
} from '../../database/queries/titres-activites'
import {
  utilisateurGet,
  utilisateursGet
} from '../../database/queries/utilisateurs'
import { titreGet } from '../../database/queries/titres'

import permissionsCheck from './_permissions-check'

import { titreActivitesRowUpdate } from '../../tools/export/titre-activites'

import emailsSend from '../../tools/emails-send'
import titreActivitePropUpdate from '../../business/titre-activite-props-update'

const titreActiviteModifier = async ({ activite }, context, info) => {
  const user = await utilisateurGet(context.user.id)
  const activiteOld = await titreActiviteGet(activite.id)
  const titre = await titreGet(activiteOld.titreId)

  if (!auth(user, titre, ['admin', 'super'], true)) {
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

  const activiteRes = await titreActiviteUpdate(activite)

  await titreActivitePropUpdate(titre.id)

  titreActivitesRowUpdate([activiteRes])

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
    const html = emailFormat(emailTitle, user, activiteRes)

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
    (res, u) => (u.email ? [...res, u.email] : res),
    // si la variable d'environnement existe,
    // on ajoute un email générique pour recevoir une copie
    process.env.ACTIVITES_RAPPORTS_EMAIL
      ? [process.env.ACTIVITES_RAPPORTS_EMAIL]
      : []
  )
}

const emailFormat = (
  emailTitle,
  user,
  { contenu, titreId, dateSaisie, sections }
) => {
  const header = `
<h1>${emailTitle}</h1>

<hr>

<b>Lien</b> : ${process.env.UI_URL}/titres/${titreId} <br>
<b>Rempli par</b> : ${user.prenom} ${user.nom} (${user.email}) <br>
<b>Date de dépôt</b> : ${dateFormat(dateSaisie, 'dd-mm-yyyy')} <br>

<hr>
`

  const elementHtml = (sectionId, element) =>
    contenu[sectionId] &&
    (contenu[sectionId][element.id] || contenu[sectionId][element.id] === 0)
      ? `<li>${element.nom ? element.nom + ' : ' : ''}${
          element.type === 'checkbox'
            ? contenu[sectionId][element.id]
                .map(id => element.valeurs[id])
                .join(', ')
            : contenu[sectionId][element.id]
        }</li>`
      : `<li>–</li>`

  const elementsHtml = (sectionId, elements) =>
    elements.reduce(
      (html, element) => `
${html}

${elementHtml(sectionId, element)}
`,
      ''
    )

  const sectionHtml = ({ id, nom, elements }) => {
    const sectionNomHtml = nom ? `<h2>${nom}</h2>` : ''

    return `
${sectionNomHtml}
<ul>
  ${elementsHtml(id, elements)}
</ul>
    `
  }

  const body = sections.reduce(
    (res, section) => `
${res}

${sectionHtml(section)}
`,
    ''
  )

  return `
${header}
${body}
`
}

export { titreActiviteModifier }
