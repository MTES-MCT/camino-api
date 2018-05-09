const mongoose = require('mongoose')
const { host } = require('../conf/mongo')
const url = `mongodb://${host}:27017/camino`
const db = mongoose.connection

mongoose.connect(url)
// mongoose.Promise = global.Promise

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
  console.log('Connected to MongoDB')
})

module.exports = db
