const build = require('./_build')
const spreadsheetId = '1SCD93SteEzJIIam1fXjLW0Do815qaJj6drpKyWd1GHg'

const tables = ['utilisateurs', 'administrations', 'entreprises']

module.exports = () => {
  tables.forEach(name => build(spreadsheetId, name, name))
}
