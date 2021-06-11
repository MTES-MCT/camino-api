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
