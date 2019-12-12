const chalk = require('chalk')
const decamelize = require('decamelize')

const sourcesImport = files =>
  files.reduce((d, file) => {
    let content

    try {
      // permet de récupérer le fichier sous la forme type--type
      // depuis un nom de fichier sous la forme type_type
      const fileName = decamelize(file.replace(/_/g, '--'), '-')

      console.log(file, fileName)

      content = require(`../sources/${fileName}.json`)
    } catch (e) {
      console.log(chalk.red(e.message.split('\n')[0]))

      content = []
    }

    d[file] = content

    return d
  }, {})

module.exports = sourcesImport
