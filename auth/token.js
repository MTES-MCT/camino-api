const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../conf')
const user = require('./user')

const token = jwtSecret ? jwt.sign(user, jwtSecret) : null

module.exports = token
