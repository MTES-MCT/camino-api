import { QueryBuilder } from 'objection'

import { IUtilisateur } from '../../../types'

import { permissionCheck } from '../../../tools/permission'

import Logs from '../../models/logs'
import { utilisateursQueryModify } from './utilisateurs'
import Utilisateurs from '../../models/utilisateurs'

export const logsQueryModify = (
  q: QueryBuilder<Logs, Logs | Logs[]>,
  user: IUtilisateur | null
) => {
  q.select('logs.*')

  // Les logs sont uniquement visibles par les super
  if (!user || !permissionCheck(user.permissionId, ['super'])) {
    q.where(false)
  }

  q.modifyGraph('utilisateur', b => {
    utilisateursQueryModify(
      b as QueryBuilder<Utilisateurs, Utilisateurs | Utilisateurs[]>,
      user
    )
  })
}
