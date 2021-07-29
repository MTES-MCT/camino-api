import cryptoRandomString from 'crypto-random-string'

const idGenerate = () =>
  cryptoRandomString({ length: 24, type: 'alphanumeric' })

export { idGenerate }
