import { IEtapeType, ITitreEtape, IUtilisateur } from '../../../types'

import { emailsSend } from '../../../tools/api-mailjet/emails'
import { titreEtapeGet } from '../../../database/queries/titres-etapes'
import { utilisateursTitresGet } from '../../../database/queries/utilisateurs'

const emailForAdministrationContentFormat = (
  etapeNom: string,
  titreId: string,
  user: IUtilisateur
) =>
  `
  <h3>L’étape « ${etapeNom} » d’une demande d’ARM vient d’être réalisée.</h3>
  
  <hr>
  
  <b>Lien</b> : <a href="${process.env.UI_URL}/titres/${titreId}">${process.env.UI_URL}/titres/${titreId}</a> <br>
  <b>Effectué par</b> : ${user.prenom} ${user.nom} (${user.email})<br>
  
  `

const etapeStatusUpdated = (
  etape: ITitreEtape,
  typeId: string,
  statusId: string,
  oldEtape?: ITitreEtape
) =>
  etape.typeId === typeId &&
  (!oldEtape || oldEtape.statutId !== statusId) &&
  etape.statutId === statusId

const emailsForAdministrationsGet = (
  etape: ITitreEtape,
  etapeType: IEtapeType,
  demarcheTypeId: string,
  titreId: string,
  titreTypeId: string,
  user: IUtilisateur,
  oldEtape?: ITitreEtape
): { subject: string; content: string; emails: string[] } | null => {
  const emails = [] as string[]
  let title = ''

  if (demarcheTypeId === 'oct' && titreTypeId === 'arm') {
    // lorsque la demande est déposée
    if (etapeStatusUpdated(etape, 'mdp', 'fai', oldEtape)) {
      emails.push('ptmg@ctguyane.fr')
      emails.push('pole.minier@onf.fr')

      title = 'Nouvelle demande déposée'

      // lorsque le PTMG déclare le dossier complet
    } else if (etapeStatusUpdated(etape, 'mcp', 'com', oldEtape)) {
      emails.push('pole.minier@onf.fr')

      title = 'Nouveau dossier complet'

      // lorsque la demande est complète
    } else if (etapeStatusUpdated(etape, 'mcr', 'fav', oldEtape)) {
      emails.push('mc.remd.deal-guyane@developpement-durable.gouv.fr')

      title = 'Nouvelle demande complète'
    }
  }

  if (!emails.length) {
    return null
  }

  const subject = `${etapeType.nom} | ${title}`
  const content = emailForAdministrationContentFormat(
    etapeType.nom,
    titreId,
    user
  )

  return { subject, content, emails }
}

const titreEtapeAdministrationsEmailsSend = async (
  etape: ITitreEtape,
  etapeType: IEtapeType,
  demarcheTypeId: string,
  titreId: string,
  titreTypeId: string,
  user: IUtilisateur,
  oldEtape?: ITitreEtape
) => {
  const emailsForAdministrations = emailsForAdministrationsGet(
    etape,
    etapeType,
    demarcheTypeId,
    titreId,
    titreTypeId,
    user,
    oldEtape
  )

  if (emailsForAdministrations) {
    await emailsSend(
      emailsForAdministrations.emails,
      emailsForAdministrations.subject,
      emailsForAdministrations.content
    )
  }
}

const titreEtapeUtilisateursEmailsSend = async (
  etape: ITitreEtape,
  etapeType: IEtapeType,
  demarcheTypeId: string,
  titreId: string
) => {
  const utilisateursEmails = [] as string[]

  const utilisateursTitres = await utilisateursTitresGet(titreId, {
    fields: { utilisateur: { id: {} } }
  })

  const utilisateurs = utilisateursTitres
    ?.map(utilisateurTitre => utilisateurTitre.utilisateur)
    .filter(utilisateur => !!utilisateur && !!utilisateur.email)

  for (const utilisateur of utilisateurs) {
    // On vérifie que le titulaire puisse voir l’étape
    const titreEtape = await titreEtapeGet(
      etape.id,
      { fields: { id: {} } },
      utilisateur
    )
    if (titreEtape) {
      utilisateursEmails.push(utilisateur!.email!)
    }
  }

  if (utilisateursEmails.length) {
    await emailsSend(
      utilisateursEmails,
      'Nouvel évenement sur un titre minier.',
      `
  <h3>L’étape « ${etapeType.nom} » vient d’ếtre réalisée sur un titre minier.</h3>
  <hr>
  <b>Lien</b> : <a href="${process.env.UI_URL}/titres/${titreId}">${process.env.UI_URL}/titres/${titreId}</a> <br>
  `
    )
  }
}

export { titreEtapeAdministrationsEmailsSend, titreEtapeUtilisateursEmailsSend }
