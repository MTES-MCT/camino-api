const mongoose = require('mongoose')

const domainSchema = new mongoose.Schema({
  _id: {
    type: String,
    enum: ['m', 'h', 's', 'g'],
    lowercase: true,
    required: true,
    alias: 'id'
  },
  nom: {
    type: String,
    enum: [
      'minéraux et métaux',
      'substances énergétiques',
      'stockage',
      'géothermie'
    ],
    lowercase: true,
    required: true
  }
})

const typeSchema = new mongoose.Schema({
  _id: {
    type: String,
    enum: ['aex', 'con', 'per'],
    lowercase: true,
    required: true,
    alias: 'id'
  },
  nom: {
    type: String,
    enum: [
      "autorisation d'exploitation",
      'concession',
      'permis exclusif de recherches'
    ],
    lowercase: true,
    required: true
  }
})

const statusSchema = new mongoose.Schema({
  _id: {
    type: String,
    enum: ['ins', 'val', 'ech'],
    lowercase: true,
    required: true,
    alias: 'id'
  },
  nom: {
    type: String,
    enum: ['en instruction', 'valide', 'échu'],
    lowercase: true,
    required: true
  }
})

const travauxSchema = new mongoose.Schema({
  _id: {
    type: String,
    enum: ['ins', 'enc', 'ach'],
    lowercase: true,
    required: true,
    alias: 'id'
  },
  nom: {
    type: String,
    enum: ['en instruction', 'en cours', 'achevés'],
    lowercase: true,
    required: true
  }
})

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
  type: typeSchema,
  domaine: domainSchema,
  statut: statusSchema,
  travaux: travauxSchema
})

module.exports = mongoose.model('Titre', titleSchema)
