jest.mock('../src/tools/api-mailjet/emails', () => ({
  __esModule: true,
  emailsSend: jest.fn().mockImplementation(a => a)
}))

jest.mock('node-mailjet', () => ({
  __esModule: true,
  connect: jest.fn().mockImplementation(a => a)
}))
