import { ITitreEtape, IUtilisateur } from '../../../types'

import { emailsSend } from '../../../tools/api-mailjet/emails'

const emailContentFormat = (
  subject: string,
  titreId: string,
  user: IUtilisateur
) =>
  `
  <h1>${subject}</h1>
  
  <hr>
  
  <b>Lien</b> : ${process.env.UI_URL}/titres/${titreId} <br>
  <b>Effectué par</b> : ${user.prenom} ${user.nom} (${user.email}) <br>
  
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

const emailGet = (
  etape: ITitreEtape,
  demarcheTypeId: string,
  titreNom: string,
  titreId: string,
  titreTypeId: string,
  user: IUtilisateur,
  oldEtape?: ITitreEtape
): { subject: string; content: string; emails: string[] } | null => {
  const emails = [] as string[]
  let subject = ''
  let content = ''

  if (demarcheTypeId === 'oct' && titreTypeId === 'arm') {
    // lorsque la demande est déposée
    if (etapeStatusUpdated(etape, 'mfr', 'dep', oldEtape)) {
      emails.push('ptmg@ctguyane.fr')
      emails.push('pole.minier@onf.fr')

      subject = 'Nouvelle demande déposée'

      // lorsque le PTMG déclare le dossier complet
    } else if (etapeStatusUpdated(etape, 'mcp', 'fav', oldEtape)) {
      emails.push('pole.minier@onf.fr')

      subject = 'Nouveau dossier complet'

      // lorsque la demande est complète
    } else if (etapeStatusUpdated(etape, 'mcr', 'fav', oldEtape)) {
      emails.push('mc.remd.deal-guyane@developpement-durable.gouv.fr')

      subject = 'Nouvelle demande complète'
    }
  }

  if (!emails.length) {
    return null
  }

  subject = `${titreNom} |`
  if (etape.type) {
    subject += ` ${etape.type!.nom} |`
  }
  subject += ` ${subject}`
  content = emailContentFormat(subject, titreId, user)

  return { subject, content, emails }
}

const titreEtapeEmailsSend = async (
  etape: ITitreEtape,
  demarcheTypeId: string,
  titreNom: string,
  titreId: string,
  titreTypeId: string,
  user: IUtilisateur,
  oldEtape?: ITitreEtape
) => {
  const email = emailGet(
    etape,
    demarcheTypeId,
    titreNom,
    titreId,
    titreTypeId,
    user,
    oldEtape
  )

  if (email) {
    await emailsSend(email.emails, email.subject, email.content)
  }
}

export { titreEtapeEmailsSend }
