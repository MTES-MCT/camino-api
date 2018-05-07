const mongoose = require('mongoose')

const titleSchema = new mongoose.Schema(
  {
    id: Number,
    name: String
  },
  { collection: 'titles' }
)

module.exports = mongoose.model('Title', titleSchema)
