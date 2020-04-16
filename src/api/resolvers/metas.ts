import { GraphQLResolveInfo } from 'graphql'
import { IToken, IEtapeType } from '../../types'
import { debug } from '../../config/index'

import { autorisations } from '../../database/cache/autorisations'

import {
  demarchesTypesGet,
  demarchesStatutsGet,
  documentsTypesGet,
  domainesGet,
  devisesGet,
  etapesTypesGet,
  geoSystemesGet,
  permissionsGet,
  permissionGet,
  referencesTypesGet,
  titresStatutsGet,
  titresTypesTypesGet,
  unitesGet,
  activitesTypesGet
} from '../../database/queries/metas'
import { userGet } from '../../database/queries/utilisateurs'

import { permissionCheck } from '../../tools/permission'
import fieldsBuild from './_fields-build'
import { etapeTypeFormat } from './format/etapes-types'
import { titreDemarcheGet } from '../../database/queries/titres-demarches'
import { titreEtapeGet } from '../../database/queries/titres-etapes'

const npmPackage = require('../../../package.json')

const devises = async () => devisesGet()
const geoSystemes = async () => geoSystemesGet()
const unites = async () => unitesGet()
const documentsTypes = async () => documentsTypesGet()
const referencesTypes = async () => referencesTypesGet()
const permission = async ({ id }: { id: string }) => permissionGet(id)

const permissions = async (_: unknown, context: IToken) => {
  try {
    const user = await userGet(context.user?.id)

    if (!user || !permissionCheck(user, ['super', 'admin'])) {
      return null
    }

    // l'ordre des super est 0
    // si on a un ordre différent
    // alors c'est celui du role admin
    // et on retourne les permissions à partir de l'ordre suivant (éditeur)
    const ordreMax = user.permission.ordre ? user.permission.ordre + 1 : 0

    return permissionsGet({ ordreMax })
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const domaines = async (
  _: unknown,
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)

    const domaines = await domainesGet({}, { fields }, context.user?.id)

    return domaines
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const types = async () => {
  try {
    const types = await titresTypesTypesGet()

    return types
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const statuts = async (_: unknown, context: IToken) => {
  try {
    let statuts = await titresStatutsGet()

    if (!context.user) {
      statuts = statuts.filter(statut =>
        autorisations.statutsIds.includes(statut.id)
      )
    }

    return statuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const demarchesTypes = async (
  { titreId, titreDemarcheId }: { titreId?: string; titreDemarcheId?: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)

    const demarchesTypes = await demarchesTypesGet(
      { titreId, titreDemarcheId },
      { fields },
      context.user?.id
    )

    return demarchesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const demarchesStatuts = async () => {
  try {
    const demarchesStatuts = await demarchesStatutsGet()

    return demarchesStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapesTypes = async (
  {
    titreDemarcheId,
    titreEtapeId
  }: { titreDemarcheId?: string; titreEtapeId?: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)

    const etapesTypes = await etapesTypesGet(
      { titreDemarcheId, titreEtapeId },
      { fields },
      context.user?.id
    )

    if (titreDemarcheId && context.user?.id) {
      const user = await userGet(context.user.id)

      const titreDemarche = await titreDemarcheGet(
        titreDemarcheId,
        {
          fields: {
            type: { etapesTypes: { etapesStatuts: { id: {} } } },
            titre: { type: { demarchesTypes: { id: {} } } },
            etapes: { type: { id: {} } }
          }
        },
        user?.id
      )
      if (!titreDemarche) throw new Error("la démarche n'existe pas")

      const titre = titreDemarche.titre!

      const demarcheType = titre.type!.demarchesTypes!.find(
        demarcheType => demarcheType.id === titreDemarche.typeId
      )

      if (!demarcheType) {
        throw new Error(
          `Démarche « ${titreDemarche.type!.nom} » inexistante pour un titre ${
            titre.typeId
          }.`
        )
      }

      const titreEtape = titreEtapeId
        ? await titreEtapeGet(titreEtapeId, {}, user?.id)
        : null

      if (titreEtapeId && !titreEtape) throw new Error("l'étape n'existe pas")

      if (titreEtape) {
        const etapeType = titreDemarche.type!.etapesTypes.find(
          et => et.id === titreEtape.type!.id
        )
        if (!etapeType) {
          throw new Error(
            `Etape « ${
              titreEtape.type!.nom
            } » inexistante pour une démarche « ${
              titreDemarche.type!.nom
            } » pour un titre « ${titre.typeId} ».`
          )
        }
      }

      const etapesTypesFormatted = etapesTypes.reduce(
        (etapesTypes: IEtapeType[], etapeType) => {
          const etapeTypeFormatted = etapeTypeFormat(
            etapeType,
            titre,
            titreDemarche.type!,
            titreDemarche.etapes!,
            titreEtape?.typeId,
            titreEtape?.statutId
          )

          if (etapeTypeFormatted) {
            etapesTypes.push(etapeTypeFormatted)
          }

          return etapesTypes
        },

        []
      )

      return etapesTypesFormatted
    }

    return etapesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const version = () => {
  return npmPackage.version
}

const activitesTypes = async (
  _: unknown,
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)

    const activitesTypes = await activitesTypesGet({ fields }, context.user?.id)

    // TODO: ne retourner que les types d'activités auxquels l'utilisateur a accès

    return activitesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export {
  devises,
  demarchesTypes,
  demarchesStatuts,
  documentsTypes,
  domaines,
  etapesTypes,
  geoSystemes,
  permission,
  permissions,
  referencesTypes,
  statuts,
  types,
  unites,
  version,
  activitesTypes
}
