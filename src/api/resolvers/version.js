const npmPackage = require('../../../package.json')

const version = (variables, context, info) => {
  return npmPackage.version
}

export { version }
