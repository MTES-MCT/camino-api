const mongoose = require('mongoose')

const titleSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      lowercase: true,
      required: true,
      alias: 'id'
    },
    nom: {
      type: String,
      lowercase: true,
      required: true
    },
    type: {
      type: String
    }
  },
  { collection: 'titres' }
)

module.exports = mongoose.model('Title', titleSchema)
