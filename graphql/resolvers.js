const Titres = require('../postgres/models/titres')
const Substances = require('../postgres/models/substances')

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
  Query: {
    async titre(root, { id }) {
      try {
        return await Titres.query()
          .findById(id)
          .eager(options.titresEager)
      } catch (e) {
        console.log(e)
      }
    },

    async titres(root, { typeId, domaineId, statutId, travauxId }) {
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
      // return Substances.query().eager('legal')
      try {
        return await Substances.query().eager('legal')
      } catch (e) {
        console.log(e)
      }
    },

    async substance(root, { id }) {
      try {
        return await Substances.query()
          .findById(id)
          .eager('legal')
      } catch (e) {
        console.log(e)
      }
    }
  },

  Mutation: {
    async titreAjouter(parent, { titre }) {
      try {
        let t = await Titres.query()
          .insertGraph([titre], options.titresUpdate)
          .eager(options.titresEager)
          .first()
        return t
      } catch (e) {
        console.log(e)
      }
    },

    async titreSupprimer(parent, { id }) {
      try {
        return await Substances.query()
          .findById(id)
          .eager('legal')
          .delete()
      } catch (e) {
        console.log(e)
      }
    },

    async titreModifier(parent, { titre }) {
      try {
        console.log('-----------------------', titre)
        let t = await Titres.query()
          .upsertGraph([titre], options.titresUpdate)
          .eager(options.titresEager)
          .first()
        return t
      } catch (e) {
        console.log(e)
      }
    }
  }
}

module.exports = resolvers
