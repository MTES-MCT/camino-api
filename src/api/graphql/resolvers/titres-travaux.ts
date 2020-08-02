import { IToken, ITitreTravaux } from '../../../types'
import { userGet } from '../../../database/queries/utilisateurs'
import { titreTravauxCreate } from '../../../database/queries/titres-travaux'
import fieldsBuild from './_fields-build'
import { permissionCheck } from '../../../tools/permission'
import { titreGet } from '../../../database/queries/titres'
import { debug } from '../../../config/index'
import { titreFormat } from '../../_format/titres'
import titreTravauxUpdateTask from '../../../business/titre-travaux-update'

import { GraphQLResolveInfo } from 'graphql'

const travauxCreer = async (
  { travaux }: { travaux: ITitreTravaux },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const travauxUpdated = await titreTravauxCreate(travaux, {
      fields: { id: {} }
    })

    const titreUpdatedId = await titreTravauxUpdateTask(travauxUpdated.titreId)

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user.id)

    return titreUpdated && titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxModifier = () => {
  console.log('travauxModifier')
}
const travauxSupprimer = () => {
  console.log('travauxSupprimer')
}

export { travauxCreer, travauxModifier, travauxSupprimer }
