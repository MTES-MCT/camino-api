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

const mailer = async (to, subject, html) => {
  const email = { from, to, subject, html }

  // si on est pas sur le serveur de prod
  // l'adresse email du destinataire est remplacée
  if (
    !process.env.NODE_ENV ||
    process.env.NODE_ENV !== 'production' ||
    process.env.ENV !== 'prod' ||
    !process.env.ENV
  ) {
    email.subject = `
${email.subject} | env: ${process.env.ENV} | node: ${process.env.NODE_ENV} | 
dest: ${email.to}`
    email.to = process.env.ADMIN_EMAIL
  }

  try {
    if (emailRegex({ exact: true }).test(email.to)) {
      const res = await transport.sendMail(email)
      console.log(
        `Message sent: ${email.to}, ${email.subject}, ${res.response}`
      )
      transport.close()
    } else {
      throw new Error('adresse email invalide')
    }
  } catch (e) {
    console.log(e)
  }
}

const emailsSend = async (emails, subject, html) => {
  try {
    if (Array.isArray(emails)) {
      emails.forEach(email => {
        mailer(email, subject, html)
      })
    } else {
      mailer(emails, subject, html)
    }
  } catch (e) {
    console.log("erreur: envoi d'emails groupés")
  }
}

export default emailsSend
