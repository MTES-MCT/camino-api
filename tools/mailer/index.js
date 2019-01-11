const nodemailer = require('nodemailer')
const htmlToText = require('nodemailer-html-to-text').htmlToText
// const smtpTransport = require('nodemailer-smtp-transport')

// const smtpTransportConfig = smtpTransport({
//   service: process.env.EMAIL_SERVICE,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD
//   }
// })

const smtpTransportConfig = `smtps://${process.env.EMAIL_API_KEY}:${
  process.env.EMAIL_API_PASSWORD
}@${process.env.EMAIL_SMTP_SERVER}`

const from = process.env.EMAIL_USER

const transport = nodemailer.createTransport(smtpTransportConfig)

// https://www.npmjs.com/package/html-to-text
// const htmlToTextOptions = {}

transport.use('compile', htmlToText())

const mailer = async (to, subject, html) => {
  const mail = { from, to, subject, html }

  // si on est pas sur le serveur de prod
  // l'adresse email du destinataire est remplacée
  if (
    !process.env.NODE_ENV ||
    process.env.NODE_ENV !== 'production' ||
    process.env.ENV !== 'prod' ||
    !process.env.ENV
  ) {
    mail.subject = `
${mail.subject} | env: ${process.env.ENV} | node: ${process.env.NODE_ENV} | 
dest: ${mail.to}`
    mail.to = process.env.ADMIN_EMAIL
  }

  try {
    const res = await transport.sendMail(mail)
    console.log(`Message sent: ${mail.to}, ${mail.subject}, ${res.response}`)
    transport.close()
  } catch (e) {
    console.log(e)
  }
}

module.exports = mailer
