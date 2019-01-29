const { writeFile } = require('fs-extra')

module.exports = async (name, content) => {
  try {
    await writeFile(name, content, 'utf8')
    console.log('File:', name)
  } catch (err) {
    console.log('File: error', err)
  }
}
