const { debug } = require('./index')

module.exports = {
  restrictedDomaineIds: debug ? [] : ['c', 'f', 'r', 's'],
  restrictedStatutIds: debug ? [] : ['dmc', 'ech', 'ind']
}
