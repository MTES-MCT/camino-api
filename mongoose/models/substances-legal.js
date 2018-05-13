const mongoose = require('mongoose')

const substanceLegalSchema = new mongoose.Schema({
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
  description: {
    type: String,
    lowercase: true,
    required: true
  },
  lien: {
    type: String,
    lowercase: true,
    required: true
  }
})

module.exports = mongoose.model('SubstanceLegal', substanceLegalSchema)
