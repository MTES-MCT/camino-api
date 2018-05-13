const TitlesModel = require('../mongoose/models/titles')
const { TypeNom, DomaineNom, StatutNom } = require('./types')

const resolvers = {
  Query: {
    titre(root, { id }) {
      return TitlesModel.findById(id, (err, t) => {
        if (err) throw err
        return t
      })
    },

    titres(root, { typeId, domaineId, travauxId }) {
      return TitlesModel.find({
        'type._id': { $in: typeId },
        'domaine._id': { $in: domaineId },
        'travaux._id': { $in: travauxId }
      })
    }
  },

  Mutation: {
    titreAjouter(parent, { titre }) {
      const t = new TitlesModel(titre)
      return t.save().then(t => t, err => err)
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
