const Titres = require('../mongo/models/titres')
// const Substances = require('../mongo/models/substances')
// require('../mongo/models/substances-legals')

const Substances = require('../postgres/models/substances')

const { TypeNom, DomaineNom, StatutNom } = require('./types')

const resolvers = {
  Query: {
    titre(root, { id }) {
      return Titres.findById(id).populate({
        path: 'substances.principales',
        populate: { path: 'legalId' }
      })
    },

    titres(root, { typeId, domaineId, statutId, travauxId }) {
      return Titres.find({
        'type._id': { $in: typeId },
        'domaine._id': { $in: domaineId },
        'statut._id': { $in: statutId },
        'travaux._id': { $in: travauxId }
      }).populate({
        path: 'substances.principales',
        populate: { path: 'legalId' }
      })
    },

    async substances(root) {
      // return Substances.find().populate('legalId')
      // return Substances.query().eager('legal')
      try {
        let substances = await Substances.query().eager('legal')
        console.log(substances)
        return substances
      } catch (error) {
        console.log(error)
      }
    },

    async substance(root, { id }) {
      // return Substances.findById(id).populate('legalId')
      try {
        return await Substances.query()
          .findById(id)
          .eager('legal')
      } catch (error) {
        console.log(error)
      }
    }
  },

  Mutation: {
    titreAjouter(parent, { titre }) {
      const t = new Titres(titre)
      return t.save().then(t =>
        t
          .populate({
            path: 'substances.principales',
            populate: { path: 'legalId' }
          })
          .execPopulate()
      )
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
  },

  DomaineNom,

  TypeNom,

  StatutNom
}

module.exports = resolvers
