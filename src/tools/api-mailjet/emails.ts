import { convert } from 'html-to-text'
import emailRegex from 'email-regex'

import { mailjet } from './index'

const from = {
  email: process.env.API_MAILJET_EMAIL,
  name: 'Camino - le cadastre minier'
}

const emailsSend = async (emails: string[], subject: string, html: string) => {
  try {
    if (!Array.isArray(emails)) {
      throw new Error(`un tableau d'emails est attendu ${emails}`)
    }

    emails.forEach(to => {
      if (!emailRegex({ exact: true }).test(to)) {
        throw new Error(`adresse email invalide ${to}`)
      }
    })

    // si on est pas sur le serveur de prod
    // l'adresse email du destinataire est remplacée
    if (process.env.NODE_ENV !== 'production' || process.env.ENV !== 'prod') {
      subject = `[dev] ${subject}`
      html = `<p style="color: red">destinataire(s): ${emails.join(
        ', '
      )} | env: ${process.env.ENV} | node: ${process.env.NODE_ENV}</p> ${html}`
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
          'Html-part': html,
          'Text-part': convert(html, {
            wordwrap: 130
          })
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
  } catch (e) {
    console.error('erreur: emailsSend', e)
    throw new Error(e)
  }
}

export { emailsSend }
