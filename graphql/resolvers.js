const TitlesModel = require('../mongo/models/titles')
const SubstancesModel = require('../mongo/models/substances')
require('../mongo/models/substances-legal')

const { TypeNom, DomaineNom, StatutNom } = require('./types')

const resolvers = {
  Query: {
    titre(root, { id }) {
      return TitlesModel.findById(id).populate({
        path: 'substances.principales',
        populate: { path: 'legal' }
      })
    },

    titres(root, { typeId, domaineId, statutId, travauxId }) {
      return TitlesModel.find({
        'type._id': { $in: typeId },
        'domaine._id': { $in: domaineId },
        'statut._id': { $in: statutId },
        'travaux._id': { $in: travauxId }
      }).populate({
        path: 'substances.principales',
        populate: { path: 'legal' }
      })
    },

    substances(root, { typeId, domaineId, statutId, travauxId }) {
      return SubstancesModel.find().populate('legal')
    }
  },

  Mutation: {
    titreAjouter(parent, { titre }) {
      const t = new TitlesModel(titre)
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
      return TitlesModel.findByIdAndRemove(id, {}, (err, t) => {
        if (err) throw err
        return t
      })
    },

    titreModifier(parent, { titre }) {
      return TitlesModel.findByIdAndUpdate(
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
