jest.mock('../src/tools/emails-send', () => ({
  __esModule: true,
  emailSend: jest.fn().mockImplementation(a => a)
}))
