const TitleModel = require('../mongo/models/titles')
const SubstanceModel = require('../mongo/models/substances')
require('../mongo/models/substances-legal')

const { TypeNom, DomaineNom, StatutNom } = require('./types')

const resolvers = {
  Query: {
    titre(root, { id }) {
      return TitleModel.findById(id).populate({
        path: 'substances.principales',
        populate: { path: 'legal' }
      })
    },

    titres(root, { typeId, domaineId, statutId, travauxId }) {
      return TitleModel.find({
        'type._id': { $in: typeId },
        'domaine._id': { $in: domaineId },
        'statut._id': { $in: statutId },
        'travaux._id': { $in: travauxId }
      }).populate({
        path: 'substances.principales',
        populate: { path: 'legal' }
      })
    },

    substances(root) {
      return SubstanceModel.find().populate('legal')
    },

    substance(root, { id }) {
      return SubstanceModel.findById(id).populate('legal')
    }
  },

  Mutation: {
    titreAjouter(parent, { titre }) {
      const t = new TitleModel(titre)
      return t.save().then(t =>
        t
          .populate({
            path: 'substances.principales',
            populate: { path: 'legal' }
          })
          .execPopulate()
      )
    },

    titreSupprimer(parent, { id }) {
      return TitleModel.findByIdAndRemove(id, {}, (err, t) => {
        if (err) throw err
        return t
      })
    },

    titreModifier(parent, { titre }) {
      return TitleModel.findByIdAndUpdate(
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
