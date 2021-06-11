jest.mock('../src/tools/api-mailjet/emails', () => ({
  __esModule: true,
  emailsSend: jest.fn().mockImplementation(a => a)
}))
