const Titres = require('../postgres/models/titres')
const Substances = require('../postgres/models/substances')

const resolvers = {
  Query: {
    titre(root, { id }) {
      return Titres.findById(id).populate({
        path: 'substances.principales',
        populate: { path: 'legalId' }
      })
    },

    async titres(root, { typeId, domaineId, statutId, travauxId }) {
      try {
        return await Titres.query()
          .whereIn('typeId', typeId)
          .whereIn('domaineId', domaineId)
          .whereIn('statutId', statutId)
          .whereIn('travauxId', travauxId)
          .eager('[type, domaine, statut, travaux]')
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
          .insertGraph([titre], { relate: true })
          .eager('[type, domaine, statut, travaux]')
          .first()
        return t
      } catch (e) {
        console.log(e)
      }
    },

    titreSupprimer(parent, { id }) {
      return Titres.findByIdAndRemove(id, {}, (err, t) => {
        if (err) throw err
        return t
      })
    },

    titreModifier(parent, { titre }) {
      return Titres.findByIdAndUpdate(
        titre.id,
        { $set: titre },
        { new: true },
        (err, t) => {
          if (err) throw err
          return t
        }
      )
    }
  }
}

module.exports = resolvers
