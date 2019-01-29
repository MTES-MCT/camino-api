const path = require('path')

const filePathCreate = fileName =>
  `./sources/${fileName.replace(/_/g, '-')}.json`

module.exports = filePathCreate
