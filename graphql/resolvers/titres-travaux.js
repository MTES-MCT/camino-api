const {
  titreTravauxRapportAdd
} = require('../../postgres/queries/titres-travaux')

const { permissionsCheck } = require('./_permissions')

const resolvers = {
  async titreTravauxRapportAjouter({ rapport }, context, info) {
    // if (
    //   permissionsCheck(context.user, ['super', 'admin']) ||
    //   (permissionsCheck(context.user, ['edit']) && context.user && context.user.id === id)
    // ) {
    return titreTravauxRapportAdd({ titreTravauxRapport: rapport })
    // } else {
    //   return null
    // }
  }
}

module.exports = resolvers
