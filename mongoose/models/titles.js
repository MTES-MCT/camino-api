const mongoose = require('mongoose')

const titleSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      lowercase: true,
      required: true
    },
    nom: String,
    auteur: String
  },
  { collection: 'titres' }
)

module.exports = mongoose.model('Title', titleSchema)
