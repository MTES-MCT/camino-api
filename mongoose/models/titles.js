const mongoose = require('mongoose')

const titleSchema = new mongoose.Schema({
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
    type: String,
    enum: ['aex', 'con', 'per'],
    lowercase: true,
    required: true
  },
  domaine: {
    type: String,
    enum: ['m', 'h', 's', 'g'],
    lowercase: true,
    required: true
  }
})

module.exports = mongoose.model('titre', titleSchema)
