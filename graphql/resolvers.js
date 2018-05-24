const Titres = require('../postgres/models/titres')
const Substances = require('../postgres/models/substances')
const { json } = require('./types')

const options = {
  titresEager:
    '[type, domaine, statut, travaux, substancesPrincipales.legal, substancesSecondaires.legal, phases.type]',
  titresUpdate: {
    relate: [
      'type',
      'domaine',
      'statut',
      'travaux',
      'substancesPrincipales',
      'substancesSecondaires',
      'phases.type',
      'phases.emprise'
    ],
    unrelate: [
      'type',
      'domaine',
      'statut',
      'travaux',
      'substancesPrincipales',
      'substancesSecondaires',
      'phases.type',
      'phases.emprise'
    ],
    insertMissing: ['phases']
  }
}

const resolvers = {
  async titre({ id }) {
    try {
      return await Titres.query()
        .findById(id)
        .eager(options.titresEager)
    } catch (e) {
      console.log(e)
    }
  },

  async titres({ typeId, domaineId, statutId, travauxId }) {
    try {
      return await Titres.query()
        .whereIn('typeId', typeId)
        .whereIn('domaineId', domaineId)
        .whereIn('statutId', statutId)
        .whereIn('travauxId', travauxId)
        .eager(options.titresEager)
    } catch (e) {
      console.log(e)
    }
  },

  async substances(root) {
    console.log('boum')
    // return Substances.query().eager('legal')
    try {
      return await Substances.query().eager('legal')
    } catch (e) {
      console.log(e)
    }
  },

  async substance({ id }) {
    try {
      return await Substances.query()
        .findById(id)
        .eager('legal')
    } catch (e) {
      console.log(e)
    }
  },

  async titreAjouter({ titre }) {
    try {
      let t = await Titres.query()
        .insertGraph([titre], options.titresUpdate)
        .first()
        .eager(options.titresEager)
      return t
    } catch (e) {
      console.log(e)
    }
  },

  async titreSupprimer({ id }) {
    try {
      return await Titres.query()
        .deleteById(id)
        .first()
        .eager(options.titresEager)
        .returning('*')
    } catch (e) {
      console.log(e)
    }
  },

  async titreModifier({ titre }) {
    try {
      return await Titres.query()
        .upsertGraph([titre], options.titresUpdate)
        .eager(options.titresEager)
        .first()
    } catch (e) {
      console.log(e)
    }
  },

  json
}

module.exports = resolvers
