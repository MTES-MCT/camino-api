import * as dateFormat from 'dateformat'

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

const titresActivitesEmailFormat = (
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

export default titresActivitesEmailFormat
