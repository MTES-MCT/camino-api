require('dotenv').config()
require('../../postgres')

const titresC = require('./titres/c')
const titresF = require('./titres/f')
const titresG = require('./titres/g')
const titresH = require('./titres/h')
const titresM = require('./titres/m')
const titresR = require('./titres/r')
const titresS = require('./titres/s')
const titresW = require('./titres/w')

const run = async () => {
  // await titresC()
  // await titresF()
  // await titresG()
  await titresH()
  // await titresM()
  // await titresR()
  // await titresS()
  // await titresW()
}

run()
