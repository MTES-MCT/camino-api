import Utilisateurs from '../models/utilisateurs'
import options from './_options'

const utilisateurGet = async id =>
  Utilisateurs.query()
    .findById(id)
    .withGraphFetched(options.utilisateurs.graph)

const utilisateurByEmailGet = async email =>
  Utilisateurs.query()
    .where('email', email)
    .withGraphFetched(options.utilisateurs.graph)
    .first()

const utilisateursGet = async ({
  noms,
  entrepriseIds,
  administrationIds,
  permissionIds
}) => {
  const q = Utilisateurs.query()
    .skipUndefined()
    .withGraphFetched(options.utilisateurs.graph)
    .orderBy('nom')

  if (administrationIds) {
    q.whereIn('administrations.id', administrationIds).joinRelated(
      'administrations'
    )
  }

  if (permissionIds) {
    q.whereIn('permissionId', permissionIds)
  }

  if (entrepriseIds) {
    q.whereIn('entreprises.id', entrepriseIds).joinRelated('entreprises')
  }

  if (noms) {
    q.whereRaw(`lower(??) ~* ${noms.map(n => '?').join('|')}`, [
      'utilisateurs.nom',
      ...noms.map(n => n.toLowerCase())
    ])
  }

  return q
}

const utilisateurCreate = async utilisateur =>
  Utilisateurs.query()
    .insertGraph(utilisateur, options.utilisateurs.update)
    .withGraphFetched(options.utilisateurs.graph)
    .first()

const utilisateurDelete = async id =>
  Utilisateurs.query()
    .deleteById(id)
    .first()
    .returning('*')

const utilisateurUpdate = async utilisateur =>
  Utilisateurs.query()
    .upsertGraphAndFetch(utilisateur, options.utilisateurs.update)
    .withGraphFetched(options.utilisateurs.graph)

export {
  utilisateurGet,
  utilisateurByEmailGet,
  utilisateursGet,
  utilisateurCreate,
  utilisateurDelete,
  utilisateurUpdate
}
