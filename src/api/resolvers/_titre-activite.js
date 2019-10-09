import * as dateFormat from 'dateformat'

import emailsSend from '../../tools/emails-send'

const elementHtmlBuild = (sectionId, element, contenu) =>
  contenu[sectionId] &&
  (contenu[sectionId][element.id] || contenu[sectionId][element.id] === 0)
    ? `<li>${element.nom ? element.nom + ' : ' : ''}${
        element.type === 'checkboxes'
          ? contenu[sectionId][element.id]
              .map(id => element.valeurs[id])
              .join(', ')
          : contenu[sectionId][element.id]
      }</li>`
    : `<li>–</li>`

const elementsHtmlBuild = (sectionId, elements, contenu) =>
  elements.reduce(
    (html, element) => `
${html}

${elementHtmlBuild(sectionId, element, contenu)}
`,
    ''
  )

const sectionHtmlBuild = ({ id, nom, elements }, contenu) => {
  const sectionNomHtml = nom ? `<h2>${nom}</h2>` : ''

  return `
${sectionNomHtml}
<ul>
  ${elementsHtmlBuild(id, elements, contenu)}
</ul>
    `
}

const titreActiviteEmailFormat = (
  { contenu, titreId, dateSaisie, sections },
  emailTitle,
  user
) => {
  const header = `
<h1>${emailTitle}</h1>

<hr>

<b>Lien</b> : ${process.env.UI_URL}/titres/${titreId} <br>
<b>Rempli par</b> : ${user.prenom} ${user.nom} (${user.email}) <br>
<b>Date de dépôt</b> : ${dateFormat(dateSaisie, 'dd-mm-yyyy')} <br>

<hr>
`

  const body = sections.reduce(
    (res, section) => `
${res}

${sectionHtmlBuild(section, contenu)}
`,
    ''
  )

  return `
${header}
${body}
`
}

const titreActiviteEmailTitleFormat = (activite, titreNom) =>
  `${titreNom} | ${activite.type.nom}, ${
    activite.type.frequence.periodesNom
      ? activite.type.frequence[activite.type.frequence.periodesNom][
          activite.frequencePeriodeId - 1
        ].nom
      : ''
  } ${activite.annee}`

const titreActiviteEmailsGet = utilisateurs => {
  const emails = utilisateurs.reduce((res, u) => {
    if (u.email) {
      res.push(u.email)
    }

    return res
  }, [])

  // si la variable d'environnement existe,
  // on ajoute un email générique pour recevoir une copie
  if (process.env.ACTIVITES_RAPPORTS_EMAIL) {
    emails.push(process.env.ACTIVITES_RAPPORTS_EMAIL)
  }

  return emails
}

const titreActiviteEmailsSend = async (
  activite,
  titreNom,
  user,
  utilisateurs
) => {
  const subject = titreActiviteEmailTitleFormat(activite, titreNom)
  const content = titreActiviteEmailFormat(activite, subject, user)
  const emails = titreActiviteEmailsGet(utilisateurs)

  await emailsSend(emails, subject, content)
}

export { titreActiviteEmailsSend }
