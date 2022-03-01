import dateFormat from 'dateformat'

import {
  IAdministration,
  IContenu,
  IContenuValeur,
  ISection,
  ISectionElement,
  ITitreActivite,
  IUtilisateur
} from '../../../types'

import { emailsSend } from '../../../tools/api-mailjet/emails'
import { titreUrlGet } from '../../../business/utils/urls-get'

const elementHtmlBuild = (
  sectionId: string,
  element: ISectionElement,
  contenu: IContenu
) =>
  contenu[sectionId] &&
  ((contenu[sectionId][element.id] as IContenuValeur) ||
    (contenu[sectionId][element.id] as IContenuValeur) === 0 ||
    (contenu[sectionId][element.id] as IContenuValeur) === false)
    ? `<li><strong>${element.nom ? element.nom + ' : ' : ''}</strong>${
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
      } <br><small>${element.description}</small></li>`
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
  const titreUrl = titreUrlGet(titreId)

  const header = `
<h1>${emailTitle}</h1>

<hr>

<b>Lien</b> : ${titreUrl} <br>
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

const titreActiviteUtilisateursEmailsGet = (
  utilisateurs: IUtilisateur[] | undefined | null
): string[] => {
  return utilisateurs?.filter(u => !!u.email).map(u => u.email!) || []
}

export const productionCheck = (
  activiteTypeId: string,
  contenu: IContenu | null | undefined
) => {
  if (activiteTypeId === 'grx' || activiteTypeId === 'gra') {
    if (contenu?.substancesFiscales) {
      return Object.keys(contenu.substancesFiscales).some(
        key => !!contenu.substancesFiscales[key]
      )
    }

    return false
  } else if (activiteTypeId === 'grp') {
    return !!contenu?.renseignements?.orExtrait
  } else if (activiteTypeId === 'wrp') {
    const production = contenu?.renseignementsProduction

    return (
      !!production?.volumeGranulatsExtrait ||
      !!production?.masseGranulatsExtrait
    )
  }

  return true
}

export const titreActiviteAdministrationsEmailsGet = (
  administrations: IAdministration[] | null | undefined,
  activiteTypeId: string,
  contenu: IContenu | null | undefined
): string[] => {
  if (!administrations || !administrations.length) {
    return []
  }

  // Si production > 0, envoyer à toutes les administrations liées au titre
  // sinon envoyer seulement aux minitères et aux DREAL
  const production = productionCheck(activiteTypeId, contenu)

  return (
    administrations
      .filter(
        administration =>
          production || ['min', 'dre', 'dea'].includes(administration.typeId)
      )
      .flatMap(administration => administration.activitesTypesEmails)
      .filter(activiteTypeEmail => !!activiteTypeEmail)
      .filter(activiteTypeEmail => activiteTypeEmail!.id === activiteTypeId)
      .filter(activiteTypeEmail => activiteTypeEmail!.email)
      .map(activiteTypeEmail => activiteTypeEmail!.email) || []
  )
}

const titreActiviteEmailsSend = async (
  activite: ITitreActivite,
  titreNom: string,
  user: IUtilisateur,
  utilisateurs: IUtilisateur[] | undefined | null,
  administrations: IAdministration[] | null | undefined
) => {
  const emails = titreActiviteUtilisateursEmailsGet(utilisateurs)
  emails.push(
    ...titreActiviteAdministrationsEmailsGet(
      administrations,
      activite.typeId,
      activite.contenu
    )
  )
  if (!emails.length) {
    return
  }
  const subject = titreActiviteEmailTitleFormat(activite, titreNom)
  const content = titreActiviteEmailFormat(activite, subject, user)

  await emailsSend(emails, subject, content)
}

export { titreActiviteEmailsSend }
