const TitleModel = require('../mongo/models/title')
// const SubstanceModel = require('../mongo/models/substance')
// require('../mongo/models/substances-legal')

const SubstanceModel = require('../postgres/models/substance')

const { TypeNom, DomaineNom, StatutNom } = require('./types')

const resolvers = {
  Query: {
    titre(root, { id }) {
      return TitleModel.findById(id).populate({
        path: 'substances.principales',
        populate: { path: 'legal_id' }
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
        populate: { path: 'legal_id' }
      })
    },

    async substances(root) {
      // return SubstanceModel.find().populate('legal_id')
      // return SubstanceModel.query().eager('legal')
      try {
        let substances = await SubstanceModel.query().eager('legal')
        console.log(substances)
        return substances
      } catch (error) {
        console.log(error)
      }
    },

    async substance(root, { id }) {
      // return SubstanceModel.findById(id).populate('legal_id')
      try {
        return await SubstanceModel.query()
          .findById(id)
          .eager('legal')
      } catch (error) {
        console.log(error)
      }
    }
  },

  Mutation: {
    titreAjouter(parent, { titre }) {
      const t = new TitleModel(titre)
      return t.save().then(t =>
        t
          .populate({
            path: 'substances.principales',
            populate: { path: 'legal_id' }
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
