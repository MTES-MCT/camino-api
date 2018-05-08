const mongoose = require('mongoose')
const url = 'mongodb://mongo:27017/camino'
const db = mongoose.connection
const connect = () => {
  mongoose.connect(url)
  // mongoose.Promise = global.Promise

  db.on('error', console.error.bind(console, 'MongoDB connection error:'))
  db.once('open', () => {
    console.log('Connected to MongoDB')
  })
}

module.exports = connect
