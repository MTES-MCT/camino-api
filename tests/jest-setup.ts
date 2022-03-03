import { Request, Response } from 'express'

const origEmails = jest.requireActual('../src/tools/api-mailjet/emails')
jest.mock('../src/tools/api-mailjet/emails', () => ({
  __esModule: true,
  ...origEmails,
  emailsSend: jest.fn().mockImplementation(a => a),
  emailsWithTemplateSend: jest.fn().mockImplementation(a => a)
}))

jest.mock('../src/tools/api-mailjet/newsletter', () => ({
  __esModule: true,
  newsletterSubscribersFind: jest.fn().mockImplementation(() => []),
  newsletterSubscriberUpdate: jest.fn().mockImplementation(() => 'succès'),
  newsletterSubscriberCheck: jest.fn().mockImplementation(() => false)
}))

jest.mock('tus-node-server')

const origUpload = jest.requireActual('../src/server/upload')
jest.mock('../src/server/upload', () => ({
  __esModule: true,
  ...origUpload,
  restUpload: jest.fn().mockImplementation(() => {
    return (_: Request, res: Response) => {
      res.sendStatus(200)
    }
  })
}))
