import Utilisateurs from '../models/utilisateurs'
import options from './_options'

const utilisateurGet = async id =>
  Utilisateurs.query()
    .findById(id)
    .eager(options.utilisateurs.eager)

const utilisateurByEmailGet = async email =>
  Utilisateurs.query()
    .where('email', email)
    .eager(options.utilisateurs.eager)
    .first()

const utilisateursGet = async ({
  noms,
  entrepriseIds,
  administrationIds,
  permissionIds
}) => {
  const q = Utilisateurs.query()
    .skipUndefined()
    .eager(options.utilisateurs.eager)

  if (administrationIds) {
    q.whereIn('administrationId', administrationIds)
  }

  if (permissionIds) {
    q.whereIn('permissionId', permissionIds)
  }

  if (entrepriseIds) {
    q.whereIn('entreprises.id', entrepriseIds).joinRelation('entreprises')
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
    .eager(options.utilisateurs.eager)
    .first()

const utilisateurDelete = async id =>
  Utilisateurs.query()
    .deleteById(id)
    .first()
    .returning('*')

const utilisateurUpdate = async utilisateur =>
  Utilisateurs.query()
    .upsertGraphAndFetch(utilisateur, options.utilisateurs.update)
    .eager(options.utilisateurs.eager)

export {
  utilisateurGet,
  utilisateurByEmailGet,
  utilisateursGet,
  utilisateurCreate,
  utilisateurDelete,
  utilisateurUpdate
}
