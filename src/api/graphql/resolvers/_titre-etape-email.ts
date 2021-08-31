import { IEtapeType, ITitreEtape, IUtilisateur } from '../../../types'

import { emailsSend } from '../../../tools/api-mailjet/emails'

const emailContentFormat = (
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

const emailGet = (
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
    } else if (etapeStatusUpdated(etape, 'mcp', 'fav', oldEtape)) {
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
  const content = emailContentFormat(etapeType.nom, titreId, user)

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
  const email = emailGet(
    etape,
    etapeType,
    demarcheTypeId,
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
