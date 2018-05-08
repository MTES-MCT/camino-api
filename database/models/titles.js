const mongoose = require('mongoose')

const titleSchema = new mongoose.Schema(
  {
    nom: String,
    auteur: String
  },
  { collection: 'titres' }
)

module.exports = mongoose.model('Title', titleSchema)
