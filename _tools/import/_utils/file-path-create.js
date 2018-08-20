const path = require('path')

const filePathCreate = fileName =>
  path.join(__dirname, `../../sources/${fileName.replace(/_/g, '-')}.json`)

module.exports = filePathCreate
