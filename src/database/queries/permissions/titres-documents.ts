import { IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import TitresDocuments from '../../models/titres-documents'

const titreDocumentsPermissionQueryBuild = (
  q: QueryBuilder<TitresDocuments, TitresDocuments | TitresDocuments[]>,
  user?: IUtilisateur
) => {
  console.log('titreDocumentPermissionQueryBuild')

  q.select('titresDocuments.*')

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
  } else if (!user || permissionCheck(user, ['defaut'])) {
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
