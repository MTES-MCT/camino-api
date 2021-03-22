import { IToken, ITitreTravauxEtape } from '../../../types'
import { GraphQLResolveInfo } from 'graphql'
import { debug } from '../../../config/index'
import fieldsBuild from './_fields-build'

import { titresTravauGet } from '../../../database/queries/titres-travaux'
import { userGet } from '../../../database/queries/utilisateurs'
import { titreGet } from '../../../database/queries/titres'

import { titreFormat } from '../../_format/titres'
import {
  titreTravauxEtapeUpsert,
  titreTravauxEtapeGet,
  titreTravauxEtapeDelete
} from '../../../database/queries/titres-travaux-etapes'

import titreTravauxEtapeUpdateTask from '../../../business/titre-travaux-etape-update'

import { fichiersDelete } from './_titre-document'
import { documentsModifier } from './documents'
import { documentsTypesValidate } from '../../../business/validations/documents-types-validate'
import { etapeTypeGet } from '../../../database/queries/metas'

const travauxEtapeCreer = async (
  { etape }: { etape: ITitreTravauxEtape },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    const titreTravaux = await titresTravauGet(etape.titreTravauxId, {}, user)

    if (!titreTravaux) throw new Error("les travaux n'existent pas")

    if (!titreTravaux.etapesCreation) throw new Error('droits insuffisants')

    const titre = await titreGet(
      titreTravaux.titreId,
      {
        fields: {
          administrationsGestionnaires: { id: {} },
          administrationsLocales: { id: {} }
        }
      },
      user
    )

    if (!titre) throw new Error("le titre n'existe pas")

    const etapeType = await etapeTypeGet(etape.typeId, {
      fields: { documentsTypes: { id: {} } }
    })
    if (!etapeType) {
      throw new Error(`etape type "${etape.typeId}" inconnu `)
    }

    if (etape.statutId !== 'aco') {
      const documentsErrors = await documentsTypesValidate(
        etape.documents,
        etapeType.documentsTypes
      )
      if (documentsErrors.length) {
        throw new Error(documentsErrors.join(', '))
      }
    }

    const documents = etape.documents || []
    delete etape.documents

    const travauxEtapeUpdated = await titreTravauxEtapeUpsert(etape)

    await documentsModifier(
      context,
      { id: travauxEtapeUpdated.id, documents },
      'titreEtapeId'
    )

    const titreUpdatedId = await titreTravauxEtapeUpdateTask(
      travauxEtapeUpdated.titreTravauxId
    )

    const fields = fieldsBuild(info)
    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user)

    return titreFormat(titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxEtapeModifier = async (
  { etape }: { etape: ITitreTravauxEtape },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    const titreTravauxEtapeOld = await titreTravauxEtapeGet(
      etape.id,
      { fields: { id: {} } },
      user
    )

    if (!titreTravauxEtapeOld.modification)
      throw new Error('droits insuffisants')

    if (titreTravauxEtapeOld.titreTravauxId !== etape.titreTravauxId)
      throw new Error("les travaux n'existent pas")

    const etapeType = await etapeTypeGet(etape.typeId, {
      fields: { documentsTypes: { id: {} } }
    })
    if (!etapeType) {
      throw new Error(`etape type "${etape.typeId}" inconnu `)
    }

    if (etape.statutId !== 'aco') {
      const documentsErrors = await documentsTypesValidate(
        etape.documents,
        etapeType.documentsTypes
      )
      if (documentsErrors.length) {
        throw new Error(documentsErrors.join(', '))
      }
    }

    await documentsModifier(
      context,
      etape,
      'titreEtapeId',
      titreTravauxEtapeOld
    )

    const travauxEtapeUpdated = await titreTravauxEtapeUpsert(etape)

    const titreUpdatedId = await titreTravauxEtapeUpdateTask(
      travauxEtapeUpdated.titreTravauxId
    )

    const fields = fieldsBuild(info)
    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user)

    return titreFormat(titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const travauxEtapeSupprimer = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)
    const user = await userGet(context.user?.id)

    const oldTitreTravauxEtape = await titreTravauxEtapeGet(
      id,
      {
        fields: { documents: { type: { id: {} } } }
      },
      user
    )

    if (!oldTitreTravauxEtape)
      throw new Error("l'étape de travaux n'existe pas")

    if (!oldTitreTravauxEtape.suppression)
      throw new Error('droits insuffisants')

    await titreTravauxEtapeDelete(id)

    await fichiersDelete(oldTitreTravauxEtape.documents)

    const titreUpdatedId = await titreTravauxEtapeUpdateTask(
      oldTitreTravauxEtape.titreTravauxId
    )

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user)

    return titreFormat(titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { travauxEtapeCreer, travauxEtapeModifier, travauxEtapeSupprimer }
