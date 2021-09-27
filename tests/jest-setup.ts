import { Request, Response } from 'express'

jest.mock('../src/tools/api-mailjet/emails', () => ({
  __esModule: true,
  emailsSend: jest.fn().mockImplementation(a => a)
}))

jest.mock('../src/tools/api-mailjet/newsletter', () => ({
  __esModule: true,
  newsletterSubscribersFind: jest.fn().mockImplementation(() => []),
  newsletterSubscriberUpdate: jest.fn().mockImplementation(() => 'succès'),
  newsletterSubscriberCheck: jest.fn().mockImplementation(() => false)
}))

jest.mock('tus-node-server')
jest.mock('../src/server/upload.ts', () => {
  const original = jest.requireActual('../src/server/upload.ts')

  return {
    uploadAllowedMiddleware: original.uploadAllowedMiddleware,
    graphqlUpload: original.graphqlUpload,
    restUpload: jest.fn().mockImplementation((req: Request, res: Response) => {
      res.sendStatus(200)
    })
  }
})
