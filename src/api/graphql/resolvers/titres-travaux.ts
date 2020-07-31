import { IToken, ITitreTravaux } from '../../../types'
import { userGet } from '../../../database/queries/utilisateurs'
import { titreTravauxCreate } from '../../../database/queries/titres-travaux'
import fieldsBuild from './_fields-build'
import { permissionCheck } from '../../../tools/permission'
import { titreGet } from '../../../database/queries/titres'
import { debug } from '../../../config/index'
import { titreFormat } from '../../_format/titres'

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

    // TODO: à effectuer après l'insertion de la démarche
    // dans la fonction titreTravauxUpdateTask --->
    const titre = await titreGet(
      travaux.titreId,
      {
        fields: {
          travaux: { etapes: { id: {} }, type: { id: {} }, statut: { id: {} } }
        }
      },
      'super'
    )

    if (!titre) {
      throw new Error(`warning: le titre ${travaux.titreId} n'existe plus`)
    }

    const titreTravauxWithTheSameType = titre.travaux?.filter(
      tt => tt.type.id === travaux.typeId
    )

    travaux.statutId = 'eco'
    travaux.ordre = titreTravauxWithTheSameType?.length
      ? titreTravauxWithTheSameType?.length + 1
      : 1
    travaux.id = `${travaux.titreId}-${
      travaux.typeId
    }${travaux.ordre.toString().padStart(2, '0')}`
    // <----- fin du bricolage

    await titreTravauxCreate(travaux, {
      fields: { id: {} }
    })

    // const titreUpdatedId = await titreTravauxUpdateTask(
    //   travauxUpdated.id,
    //   travauxUpdated.titreId
    // )

    const fields = fieldsBuild(info)
    const titreUpdated = await titreGet(travaux.titreId, { fields }, user.id)

    return titreUpdated && titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxModifier = () => {}
const travauxSupprimer = () => {}

export { travauxCreer, travauxModifier, travauxSupprimer }
