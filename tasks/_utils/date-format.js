const leftPad = require('./left-pad')

const dateFormat = date => {
  var dd = leftPad(date.getDate() + 1, 2, '0')
  var mm = leftPad(date.getMonth() + 1, 2, '0')
  var yyyy = date.getFullYear()
  return `${yyyy}-${mm}-${dd}`
}

module.exports = dateFormat
