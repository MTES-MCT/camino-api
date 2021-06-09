/// <reference types="../@types/nodemailer-html-to-text" />
import nodemailer from 'nodemailer'
import { htmlToText } from 'nodemailer-html-to-text'
import emailRegex from 'email-regex'

const smtpTransportConfig = `smtps://${process.env.API_MAILJET_KEY}:${process.env.API_MAILJET_SECRET}@${process.env.API_MAILJET_SERVER}`

const from = process.env.API_MAILJET_EMAIL

const transport = nodemailer.createTransport(smtpTransportConfig)

transport.use('compile', htmlToText())

const emailSend = async (to: string, subject: string, html: string) => {
  try {
    // si on est pas sur le serveur de prod
    // l'adresse email du destinataire est remplacée
    if (process.env.NODE_ENV !== 'production' || process.env.ENV !== 'prod') {
      subject = `${subject} | env: ${process.env.ENV} | node: ${process.env.NODE_ENV} | 
dest: ${to}`
      to = process.env.ADMIN_EMAIL!
    }

    if (!emailRegex({ exact: true }).test(to)) {
      throw new Error(`adresse email invalide ${to}`)
    }

    subject = `[Camino] ${subject}`

    const res = await transport.sendMail({ from, to, subject, html })
    transport.close()

    console.info(`Message sent: ${to}, ${subject}, ${res.response}`)
  } catch (e) {
    console.info('erreur: emailsSend', e)
    throw new Error(e)
  }
}

const emailsSend = async (emails: string[], subject: string, html: string) => {
  try {
    if (Array.isArray(emails)) {
      emails.forEach(email => {
        emailSend(email, subject, html)
      })
    } else {
      throw new Error(`un tableau d'emails est attendu ${emails}`)
    }
  } catch (e) {
    console.info('erreur: emailsSend', e)
    throw new Error(e)
  }
}

export { emailsSend, emailSend }
