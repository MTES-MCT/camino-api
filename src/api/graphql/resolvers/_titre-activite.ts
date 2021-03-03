import {
  ISectionElement,
  IContenu,
  IContenuValeur,
  ISection,
  IUtilisateur,
  ITitreActivite
} from '../../../types'

import * as dateFormat from 'dateformat'

import { emailsSend } from '../../../tools/emails-send'

const elementHtmlBuild = (
  sectionId: string,
  element: ISectionElement,
  contenu: IContenu
) =>
  contenu[sectionId] &&
  ((contenu[sectionId][element.id] as IContenuValeur) ||
    (contenu[sectionId][element.id] as IContenuValeur) === 0 ||
    (contenu[sectionId][element.id] as IContenuValeur) === false)
    ? `<li>${element.nom ? element.nom + ' : ' : ''}${
        element.type === 'checkboxes'
          ? (contenu[sectionId][element.id] as string[])
              .reduce((valeurs: string[], id) => {
                const valeur = element.valeurs!.find(v => v.id === id)

                if (valeur?.nom) {
                  valeurs.push(valeur.nom)
                }

                return valeurs
              }, [])
              .join(', ')
          : contenu[sectionId][element.id]
      } ${element.description}</li>`
    : `<li>–</li>`

const elementsHtmlBuild = (
  sectionId: string,
  elements: ISectionElement[],
  contenu: IContenu
) =>
  elements
    ? elements.reduce(
        (html, element) => `
${html}

${elementHtmlBuild(sectionId, element, contenu)}
`,
        ''
      )
    : ''

const sectionHtmlBuild = (
  { id, nom, elements }: ISection,
  contenu: IContenu
) => {
  const sectionNomHtml = nom ? `<h2>${nom}</h2>` : ''

  const listHtml = elements
    ? `<ul>
  ${elementsHtmlBuild(id, elements, contenu)}
</ul>`
    : ''

  return `
${sectionNomHtml}
${listHtml}
    `
}

const titreActiviteEmailFormat = (
  { contenu, titreId, dateSaisie, sections, type }: ITitreActivite,
  emailTitle: string,
  user: IUtilisateur
) => {
  const header = `
<h1>${emailTitle}</h1>

<hr>

<b>Lien</b> : ${process.env.UI_URL}/titres/${titreId} <br>
<b>Rempli par</b> : ${user.prenom} ${user.nom} (${user.email}) <br>
<b>Date de dépôt</b> : ${dateFormat(dateSaisie, 'dd-mm-yyyy')} <br>

<hr>
`

  let body =
    sections && contenu
      ? sections.reduce(
          (res, section) => `
${res}

${sectionHtmlBuild(section, contenu)}
`,
          ''
        )
      : ''
  const satisfactionUrl = type?.satisfactionUrl
  body += `<hr><a
        href="${satisfactionUrl}"
      >Je donne mon avis sur cette démarche
      </a>`

  return `
${header}
${body}
`
}

const titreActiviteEmailTitleFormat = (
  activite: ITitreActivite,
  titreNom: string
) =>
  `${titreNom} | ${activite.type!.nom}, ${
    activite.type?.frequence?.periodesNom
      ? activite.type.frequence[activite.type.frequence.periodesNom]![
          activite.periodeId - 1
        ].nom
      : ''
  } ${activite.annee}`

const titreActiviteEmailsGet = (utilisateurs: IUtilisateur[]) => {
  const emails = utilisateurs.reduce((res: string[], u) => {
    if (u.email) {
      res.push(u.email)
    }

    return res
  }, [])

  return emails
}

const titreActiviteEmailsSend = async (
  activite: ITitreActivite,
  titreNom: string,
  user: IUtilisateur,
  utilisateurs: IUtilisateur[],
  adminEmail?: string | null
) => {
  const subject = titreActiviteEmailTitleFormat(activite, titreNom)
  const content = titreActiviteEmailFormat(activite, subject, user)
  const emails = titreActiviteEmailsGet(utilisateurs)

  if (adminEmail) {
    emails.push(adminEmail)
  }

  await emailsSend(emails, subject, content)
}

export { titreActiviteEmailsSend }
