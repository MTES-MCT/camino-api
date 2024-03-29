import { convert } from 'html-to-text'
import emailRegex from 'email-regex'

import { mailjet } from './index'

enum IEmail {
  ONF = 'pole.minier@onf.fr',
  PTMG = 'ptmg@ctguyane.fr',
  DGTM = 'mc.remd.deal-guyane@developpement-durable.gouv.fr'
}
const from = {
  email: process.env.API_MAILJET_EMAIL,
  name: 'Camino - le cadastre minier'
}

const mailjetSend = async (
  emails: string[],
  subject: string,
  options: Record<string, any>
) => {
  try {
    if (!Array.isArray(emails)) {
      throw new Error(`un tableau d'emails est attendu ${emails}`)
    }

    emails.forEach(to => {
      if (!emailRegex({ exact: true }).test(to)) {
        throw new Error(`adresse email invalide ${to}`)
      }
    })

    // Garde-fou pas top mais efficace pour éviter d’envoyer des emails à trop de gens
    if (emails.length > 40) {
      throw new Error(
        `email non envoyé car trop de destinataires pour l’email ${subject}`
      )
    }

    // si on est pas sur le serveur de prod
    // l'adresse email du destinataire est remplacée
    if (process.env.NODE_ENV !== 'production' || process.env.ENV !== 'prod') {
      subject = `[dev] ${subject}`
      emails = [process.env.ADMIN_EMAIL!]
    }

    subject = `[Camino] ${subject}`

    const res = (await mailjet.post('send', { version: 'v3' }).request({
      SandboxMode: 'true',
      Messages: [
        {
          FromEmail: from.email,
          FromName: from.name,
          Recipients: emails.map(Email => ({ Email })),
          Subject: subject,
          ...options
        }
      ]
    })) as {
      body: {
        Sent: { Email: string; MessageID: string; MessageUUID: string }[]
      }
    }

    console.info(
      `Messages envoyés: ${emails.join(
        ', '
      )}, ${subject}, MessageIDs: ${res.body.Sent.map(m => m.MessageID).join(
        ', '
      )}`
    )
  } catch (e: any) {
    console.error('erreur: emailsSend', e)
    throw new Error(e)
  }
}

const emailsSend = async (emails: string[], subject: string, html: string) => {
  if (process.env.NODE_ENV !== 'production' || process.env.ENV !== 'prod') {
    html = `<p style="color: red">destinataire(s): ${emails.join(
      ', '
    )} | env: ${process.env.ENV} | node: ${process.env.NODE_ENV}</p> ${html}`
  }

  mailjetSend(emails, subject, {
    'Html-part': html,
    'Text-part': convert(html, {
      wordwrap: 130
    })
  })
}

enum IEmailTemplateId {
  DEMARCHE_CONFIRMATION_DEPOT = 3413770
}

const emailsWithTemplateSend = async (
  emails: string[],
  subject: string,
  templateId: IEmailTemplateId,
  params: Record<string, string>
) =>
  mailjetSend(emails, subject, {
    'Mj-TemplateID': templateId,
    'Mj-TemplateLanguage': true,
    Vars: params
  })

export { emailsSend, emailsWithTemplateSend, IEmailTemplateId, IEmail }
