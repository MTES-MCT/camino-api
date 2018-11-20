const nodemailer = require('nodemailer')
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

const mailer = async (to, subject, text, html) => {
  const mail = { from, to, subject, text, html }

  try {
    const res = await transport.sendMail(mail)
    console.log(`Message sent: ${res.response}`)
    transport.close()
  } catch (e) {
    console.log(e)
  }
}

module.exports = mailer
