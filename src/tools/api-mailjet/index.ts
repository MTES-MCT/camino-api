import mj from 'node-mailjet'

const mailjet = mj.connect(
  process.env.API_MAILJET_KEY || 'fakeKey',
  process.env.API_MAILJET_SECRET!
)

export { mailjet }
