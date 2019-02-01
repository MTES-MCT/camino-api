import mailer from './index'

const emailsBatch = async (emails, subject, html) => {
  try {
    emails.forEach(email => {
      mailer(email, subject, html)
    })
  } catch (e) {
    console.log("erreur lors de l'envoi de batch email")
  }
}

export default emailsBatch
