const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

const smtpTransportConfig = {
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
}

const from = process.env.EMAIL_USER

const transport = nodemailer.createTransport(smtpTransport(smtpTransportConfig))

const mailer = (to, subject, text, html) => {
  const mail = { from, to, subject, text, html }

  transport.sendMail(mail, (error, res) => {
    if (error) {
      console.log(error)
    } else {
      console.log(`Message sent: ${res.response}`)
    }

    transport.close()
  })
}

module.exports = mailer
