const { debug } = require('../../config/index')

module.exports = {
  restrictedDomaineIds: debug ? [] : ['f', 'r', 's'],
  restrictedStatutIds: debug ? [] : ['dmc', 'ech', 'ind']
}
