import { GraphQLResolveInfo } from 'graphql'
import { IToken, IDomaine, IEtapeType } from '../../types'
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
import {
  domainePermissionAdministrationCheck,
  titreTypePermissionAdministrationCheck
} from './permissions/titre-edition'
import fieldsBuild from './_fields-build'
import { etapeTypeFormat } from './format/etapes-types'
import { titreGet } from '../../database/queries/titres'
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
    const user = context.user && (await userGet(context.user.id))
    if (!user || !permissionCheck(user, ['super', 'admin'])) {
      return null
    }

    return permissionsGet({
      ordreMax: user.permission.ordre ? user.permission.ordre : 0
    })
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const domaines = async (_: unknown, context: IToken) => {
  try {
    const user = context.user && (await userGet(context.user.id))
    const domaines = await domainesGet()

    if (!permissionCheck(user, ['super', 'admin'])) {
      return domaines.filter(domaine =>
        autorisations.domaines.find(
          d => d.domaineId === domaine.id && d.publicLecture
        )
      )
    }

    return domaines
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const utilisateurDomaines = async (_: unknown, context: IToken) => {
  try {
    if (!context.user) return []

    const user = await userGet(context.user.id)

    const isSuper = permissionCheck(user, ['super'])
    const isAdmin = permissionCheck(user, ['admin'])

    if (!isSuper && !isAdmin) return []

    let domaines = (await domainesGet()) as IDomaine[]

    if (isAdmin) {
      domaines = domaines.reduce((domaines: IDomaine[], domaine) => {
        const modification = domainePermissionAdministrationCheck(
          user,
          domaine.id
        )

        if (modification) {
          if (domaine.titresTypes) {
            domaine.titresTypes = domaine.titresTypes.filter(tt =>
              titreTypePermissionAdministrationCheck(user, tt.id, 'creation')
            )
          }

          domaines.push(domaine)
        }

        return domaines
      }, [])
    }

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

    console.log({ titreDemarcheId, titreEtapeId })

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
            type: {
              etapesTypes: { id: {} }
            },
            titre: { type: { demarchesTypes: { id: {} } } },
            etapes: { id: {} }
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
            titreDemarche,
            titreEtape?.typeId
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

const activitesTypes = async () => {
  try {
    const activitesTypes = await activitesTypesGet()

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
  utilisateurDomaines,
  activitesTypes
}
