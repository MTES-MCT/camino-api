import { QueryBuilder } from 'objection'

import { IUtilisateur } from '../../../types'

import ActivitesTypes from '../../models/activites-types'
import { emailsLectureQuery } from './administrations'

const administrationsActivitesTypesEmailsQueryModify = (
  q: QueryBuilder<ActivitesTypes, ActivitesTypes | ActivitesTypes[]>,
  user: IUtilisateur | null
) => {
  q.select('activitesTypes.*')
  q.joinRelated('administrationsEmails')
  q.select('administrations__activites_types__emails.email')

  const administrationsIds = user?.administrations?.map(a => a.id) || []
  const administrationsIdsReplace = administrationsIds.map(() => '?')

  q.whereRaw(`?? = ?`, [
    emailsLectureQuery(
      user,
      'administrations_emails',
      administrationsIds,
      administrationsIdsReplace
    ),
    true
  ])

  return q
}

export { administrationsActivitesTypesEmailsQueryModify }
