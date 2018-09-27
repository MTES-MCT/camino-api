const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config')
const user = require('./user')

const token = jwtSecret
  ? jwt.sign(user, jwtSecret, { noTimestamp: true })
  : null

module.exports = token
