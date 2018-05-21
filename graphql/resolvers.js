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
        let titres = await Titres.query().eager(
          '[type, domaine, statut, travaux]'
        )
        console.log(titres)
        return titres
      } catch (e) {
        console.log(e)
      }
    },

    async substances(root) {
      // return Substances.query().eager('legal')
      try {
        let substances = await Substances.query().eager('legal')
        console.log(substances)
        return substances
      } catch (e) {
        console.log(e)
      }
    },

    async substance(root, { id }) {
      // return Substances.findById(id).populate('legalId')
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
        console.log(t)
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
