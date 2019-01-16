const mailer = require('./index')

const emailsBatch = async (emails, subject, html) => {
  try {
    emails.forEach(email => {
      mailer(email, subject, html)
    })
  } catch (e) {
    console.log("erreur lors de l'envoi d'email")
  }
}

module.exports = emailsBatch
