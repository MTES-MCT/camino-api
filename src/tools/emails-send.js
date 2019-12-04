import * as nodemailer from 'nodemailer'
import * as nodemailerHtmlToText from 'nodemailer-html-to-text'
import * as emailRegex from 'email-regex'
// const smtpTransport from 'nodemailer-smtp-transport')

// const smtpTransportConfig = smtpTransport({
//   service: process.env.EMAIL_SERVICE,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD
//   }
// })

const smtpTransportConfig = `smtps://${process.env.EMAIL_API_KEY}:${process.env.EMAIL_API_PASSWORD}@${process.env.EMAIL_SMTP_SERVER}`

const from = process.env.EMAIL_USER

const transport = nodemailer.createTransport(smtpTransportConfig)

// https://www.npmjs.com/package/html-to-text
// const htmlToTextOptions = {}

transport.use('compile', nodemailerHtmlToText.htmlToText())

const emailSend = async (to, subject, html) => {
  try {
    // si on est pas sur le serveur de prod
    // l'adresse email du destinataire est remplacée
    if (process.env.NODE_ENV !== 'production' || process.env.ENV !== 'prod') {
      subject = `${subject} | env: ${process.env.ENV} | node: ${process.env.NODE_ENV} | 
dest: ${to}`
      to = process.env.ADMIN_EMAIL
    }

    subject = `[Camino] ${subject}`

    if (!emailRegex({ exact: true }).test(to)) {
      throw new Error(`adresse email invalide ${to}`)
    }

    const res = await transport.sendMail({ from, to, subject, html })
    transport.close()

    console.log(`Message sent: ${to}, ${subject}, ${res.response}`)
  } catch (e) {
    console.log('erreur: emailsSend', e)
    throw new Error(e)
  }
}

const emailsSend = async (emails, subject, html) => {
  try {
    if (Array.isArray(emails)) {
      emails.forEach(email => {
        emailSend(email, subject, html)
      })
    } else {
      throw new Error(`un tableau d'emails est attendu ${emails}`)
    }
  } catch (e) {
    console.log('erreur: emailsSend', e)
    throw new Error(e)
  }
}

export { emailsSend, emailSend }
