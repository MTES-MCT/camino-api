const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config/index')

const tokenCreate = (payload, options) => jwt.sign(payload, jwtSecret, options)

module.exports = { tokenCreate }
