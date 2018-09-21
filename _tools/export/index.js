require('dotenv').config()
require('../../postgres')

// const titresC = require('./titres/c')
// const titresG = require('./titres/g')
const titresH = require('./titres/h')
// const titresM = require('./titres/m')
// const titresM973 = require('./titres/m973')
// const titresR = require('./titres/r')
// const titresS = require('./titres/s')
// const titresW = require('./titres/w')
// const titresF = require('./titres/f')

const run = async () => {
  // await titresC()
  // await titresG()
  await titresH()
  // await titresM()
  // await titresM973()
  // await titresR()
  // await titresS()
  // await titresW()
  // await titresF()
}

run()
