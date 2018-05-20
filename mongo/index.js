const mongoose = require('mongoose')
const { host, port, dbName } = require('../conf/mongo')
const url = `mongodb://${host}:${port}/${dbName}`
const db = mongoose.connection

mongoose.connect(url)
// mongoose.Promise = global.Promise

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
  console.log('Connected to MongoDB')
})

module.exports = db
