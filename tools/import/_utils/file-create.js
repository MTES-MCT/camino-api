const fs = require('fs-extra')

module.exports = async (name, content) => {
  try {
    await fs.writeFile(name, content, 'utf8')
    console.log('File:', name)
  } catch (err) {
    console.log('File: error', err)
  }
}
