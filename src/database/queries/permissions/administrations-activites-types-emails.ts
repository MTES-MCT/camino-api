import { raw, QueryBuilder } from 'objection'

import { IUtilisateur } from '../../../types'

import { knex } from '../../../knex'
import { permissionCheck } from '../../../tools/permission'

import Administrations from '../../models/administrations'
import Entreprises from '../../models/entreprises'
import { entreprisesQueryModify } from './entreprises'
import ActivitesTypes from '../../models/activites-types'
import { emailsLectureQuery } from './administrations'

const administrationsActivitesTypesEmailsQueryModify = (
  q: QueryBuilder<ActivitesTypes, ActivitesTypes | ActivitesTypes[]>,
  user: IUtilisateur | null
) => {
  q.select('activitesTypes.*')

  const administrationsIds = user?.administrations?.map(a => a.id) || []
  const administrationsIdsReplace = administrationsIds.map(() => '?')

  q.whereRaw(`?? = ?`, [
    emailsLectureQuery(user, 'administrations', administrationsIds, administrationsIdsReplace), true
  ])
  return q
}

export { administrationsActivitesTypesEmailsQueryModify }
