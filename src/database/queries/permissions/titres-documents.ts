import { IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import TitresDocuments from '../../models/titres-documents'

const titreDocumentsPermissionQueryBuild = (
  q: QueryBuilder<TitresDocuments, TitresDocuments | TitresDocuments[]>,
  user?: IUtilisateur
) => {
  q.select('titresDocuments.*')

  // TODO: décommenter le code et gérer les permissions
  // des documents visibles pour les entreprises
  /*
  if (permissionCheck(user, ['entreprise']) && user?.entreprises?.length) {
    // faire les join related ou pas
    q.leftJoinRelated('etape.demarche.titre.[titulaires, amodiataires]')

    q.where(b => {
      // si l'utilisateur est `entreprise`,
      // titres dont il est titulaire ou amodiataire
      const entreprisesIds = user.entreprises?.map(e => e.id)

      if (entreprisesIds) {
        b.orWhereIn('etape:demarche:titre:titulaires.id', entreprisesIds)
        b.orWhereIn('etape:demarche:titre:amodiataires.id', entreprisesIds)
      }
    })
  }
    */

  if (
    !user ||
    permissionCheck(user, ['defaut']) ||
    permissionCheck(user, ['entreprise'])
  ) {
    q.where('public', true)
  }

  if (permissionCheck(user, ['super', 'admin', 'editeur', 'lecteur'])) {
    q.select(raw('true').as('modification'))
    q.select(raw('true').as('suppression'))
  } else {
    q.select(raw('false').as('modification'))
    q.select(raw('false').as('suppression'))
  }
}

export { titreDocumentsPermissionQueryBuild }
