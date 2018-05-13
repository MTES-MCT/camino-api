require('../mongoose/index')

module.exports = name => {
  const Model = require(`../mongoose/models/${name}`)

  const elements = require(`../sources/${name}.json`)

  elements.forEach(element => {
    const document = new Model(element)
    return document.save().then(sub => sub, err => err)
  })
}
