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
  },
  statut: {
    type: String,
    enum: ['en instruction', 'valide', 'échu'],
    lowercase: true,
    required: true
  }
  // travaux: {
  //   type: String,
  //   enum: ['en', 'enc', 'ech'],
  //   lowercase: true,
  //   required: true
  // }
})

module.exports = mongoose.model('titre', titleSchema)
