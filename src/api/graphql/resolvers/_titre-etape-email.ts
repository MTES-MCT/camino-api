import { IEtapeType, ITitreEtape, IUtilisateur } from '../../../types'

import { emailsSend } from '../../../tools/api-mailjet/emails'
import { titreGet } from '../../../database/queries/titres'
import { userSuper } from '../../../database/user-super'
import { titreEtapeGet } from '../../../database/queries/titres-etapes'

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

const titreEtapeEmailsSend = async (
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

  // Puis on envoie une notification aux titulaires qui ont le droit de voir l’étape
  const titulairesEmails = [] as string[]

  const titre = await titreGet(
    titreId,
    { fields: { titulaires: { utilisateurs: { id: {} } } } },
    userSuper
  )
  if (titre?.titulaires?.length) {
    for (const titulaire of titre.titulaires) {
      const user = titulaire.utilisateurs?.length
        ? titulaire.utilisateurs[0]
        : null

      if (user) {
        // On vérifie que le titulaire puisse voir l’étape
        const titreEtape = await titreEtapeGet(
          etape.id,
          { fields: { id: {} } },
          user
        )
        if (titreEtape) {
          // Si le titulaire voit l’étape, alors on envoie un email à tous les utilisateurs de l’entreprise
          const emails = titre.titulaires
            .flatMap(t => t.utilisateurs?.map(u => u.email))
            .filter(e => !!e)
          if (emails.length) {
            titulairesEmails.push(...(emails as string[]))
          }
        }
      }
    }
  }

  if (titulairesEmails.length) {
    await emailsSend(
      titulairesEmails,
      'Nouvel évenement sur un de vos titres miniers.',
      `
  <h3>L’étape « ${etapeType.nom} » vient d’ếtre réalisée sur l’un de vos titres (ou demandes).</h3>
  <hr>
  <b>Lien</b> : <a href="${process.env.UI_URL}/titres/${titreId}">${process.env.UI_URL}/titres/${titreId}</a> <br>
  `
    )
  }
}

export { titreEtapeEmailsSend }
