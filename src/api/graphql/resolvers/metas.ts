import { GraphQLResolveInfo } from 'graphql'
import {
  IDefinition,
  IDemarcheStatut,
  IDemarcheType,
  IDocumentRepertoire,
  IDomaine,
  IEtapeType,
  IPhaseStatut,
  ITitreStatut,
  ITitreTypeType,
  IToken
} from '../../../types'
import { debug } from '../../../config/index'

import {
  activitesStatutsGet,
  activitesTypesGet,
  administrationsTypesGet,
  definitionsGet,
  definitionUpdate,
  demarchesTypesGet,
  demarcheTypeUpdate,
  demarchesStatutsGet,
  demarcheStatutUpdate,
  devisesGet,
  documentsTypesGet,
  domainesGet,
  domaineUpdate,
  etapesStatutsGet,
  etapesTypesGet,
  geoSystemesGet,
  permissionGet,
  permissionsGet,
  phasesStatutsGet,
  phaseStatutUpdate,
  referencesTypesGet,
  titresStatutsGet,
  titreStatutUpdate,
  titresTypesTypesGet,
  titreTypeTypeUpdate,
  travauxTypesGet,
  unitesGet
} from '../../../database/queries/metas'
import { userGet } from '../../../database/queries/utilisateurs'

import { permissionCheck } from '../../../tools/permission'
import fieldsBuild from './_fields-build'
import { etapeTypeFormat } from '../../_format/etapes-types'
import { titreDemarcheGet } from '../../../database/queries/titres-demarches'
import { titreEtapeGet } from '../../../database/queries/titres-etapes'
import {
  departementsGet,
  regionsGet
} from '../../../database/queries/territoires'

const npmPackage = require('../../../../package.json')

const ordreUpdate = async <I extends { id: string; ordre: number }, O>(
  element: I,
  elements: I[],
  update: (id: string, props: Partial<I>) => Promise<O>
) => {
  const elementOld = elements.find(d => d.id === element.id)

  // l'ordre augmente
  if (elementOld && element.ordre > elementOld.ordre) {
    const elementsModified = elements.filter(
      d => d.ordre > elementOld.ordre && d.ordre <= element.ordre!
    )

    for (const d of elementsModified) {
      await update(d.id!, { ordre: d.ordre - 1 } as Partial<I>)
    }
  }
  // l'ordre diminue
  else if (elementOld && element.ordre < elementOld.ordre) {
    const elementsModified = elements.filter(
      d => d.ordre < elementOld.ordre && d.ordre >= element.ordre!
    )

    for (const d of elementsModified) {
      await update(d.id!, { ordre: d.ordre + 1 } as Partial<I>)
    }
  }
}

const devises = async () => devisesGet()
const geoSystemes = async () => geoSystemesGet()
const unites = async () => unitesGet()

const documentsTypes = async ({
  repertoire,
  typeId
}: {
  repertoire: IDocumentRepertoire
  typeId?: string
}) => {
  try {
    return documentsTypesGet({ repertoire, typeId })
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const documentsVisibilites = async (_: never, context: IToken) => {
  const user = await userGet(context.user?.id)
  if (!user) return []

  if (permissionCheck(user.permissionId, ['super', 'admin', 'editeur'])) {
    return [
      { id: 'admin', nom: 'Administrations uniquement' },
      { id: 'entreprise', nom: 'Administrations et entreprises titulaires' },
      { id: 'public', nom: 'Public' }
    ]
  }

  if (permissionCheck(user.permissionId, ['entreprise'])) {
    return [
      { id: 'entreprise', nom: 'Administrations et entreprises titulaires' }
    ]
  }

  return []
}

const referencesTypes = async () => referencesTypesGet()
const permission = async ({ id }: { id: string }) => permissionGet(id)

const permissions = async (_: never, context: IToken) => {
  try {
    return permissionsGet(null as never, null as never, context.user?.id)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const domaines = async (
  _: never,
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)

    const domaines = await domainesGet(
      null as never,
      { fields },
      context.user?.id
    )

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

const statuts = async (_: never, context: IToken) => {
  try {
    return await titresStatutsGet(context.user?.id)
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

const travauxTypes = async (
  { titreId, titreTravauxId }: { titreId?: string; titreTravauxId?: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)

    const travauxTypes = await travauxTypesGet(
      { titreId, titreTravauxId },
      { fields },
      context.user?.id
    )

    return travauxTypes
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

const demarcheEtapesTypesGet = async (
  etapesTypes: IEtapeType[],
  titreDemarcheId: string,
  titreEtapeId?: string,
  userId?: string
) => {
  const user = await userGet(userId)

  const titreDemarche = await titreDemarcheGet(
    titreDemarcheId,
    {
      fields: {
        type: { etapesTypes: { etapesStatuts: { id: {} } } },
        titre: {
          type: { demarchesTypes: { id: {} } },
          demarches: { etapes: { id: {} } }
        },
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
        `Etape « ${titreEtape.type!.nom} » inexistante pour une démarche « ${
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
        titreEtape?.statutId,
        titreEtape?.date
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

const etapesTypes = async (
  {
    titreDemarcheId,
    titreEtapeId,
    titreTravauxId,
    titreTravauxEtapeId
  }: {
    titreDemarcheId?: string
    titreEtapeId?: string
    titreTravauxId?: string
    titreTravauxEtapeId?: string
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)

    const etapesTypes = await etapesTypesGet(
      { titreDemarcheId, titreEtapeId, titreTravauxId, titreTravauxEtapeId },
      { fields },
      context.user?.id
    )

    if (titreDemarcheId && context.user?.id) {
      return demarcheEtapesTypesGet(
        etapesTypes,
        titreDemarcheId,
        titreEtapeId,
        context.user.id
      )
    }

    return etapesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapesStatuts = async () => {
  try {
    const etapesStatuts = await etapesStatutsGet()

    return etapesStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const version = () => npmPackage.version

const activitesTypes = async (
  _: never,
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

const activitesStatuts = async () => {
  try {
    const activitesStatuts = await activitesStatutsGet()

    return activitesStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

/**
 * Retourne les définitions
 *
 * @returns un tableau de définitions
 */
const definitions = async () => {
  try {
    const definitions = await definitionsGet()

    return definitions
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

/**
 * Retourne les types d'administrations
 *
 * @returns un tableau de types d'administrations
 */
const administrationsTypes = async () => {
  try {
    const administrationsTypes = await administrationsTypesGet()

    return administrationsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

/**
 * Retourne les départements
 *
 * @returns un tableau de départements
 */
const departements = async () => {
  try {
    const departements = await departementsGet()

    return departements
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

/**
 * Retourne les régions
 *
 * @returns un tableau de régions
 */
const regions = async () => {
  try {
    const regions = await regionsGet()

    return regions
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const phasesStatuts = async () => {
  try {
    const phasesStatuts = await phasesStatutsGet()

    return phasesStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const definitionModifier = async (
  { definition }: { definition: IDefinition },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants pour effectuer cette opération')
    }

    if (definition.ordre) {
      const definitions = await definitionsGet()

      await ordreUpdate(definition, definitions, definitionUpdate)
    }

    await definitionUpdate(definition.id!, definition)

    const definitions = await definitionsGet()

    return definitions
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const domaineModifier = async (
  { domaine }: { domaine: IDomaine },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants pour effectuer cette opération')
    }

    const fields = fieldsBuild(info)

    if (domaine.ordre) {
      const domaines = await domainesGet(
        null as never,
        { fields },
        context.user?.id
      )

      await ordreUpdate(domaine, domaines, domaineUpdate)
    }

    await domaineUpdate(domaine.id!, domaine)

    const domaines = await domainesGet(
      null as never,
      { fields },
      context.user?.id
    )

    return domaines
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeModifier = async (
  { titreType }: { titreType: ITitreTypeType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants pour effectuer cette opération')
    }

    if (titreType.ordre) {
      const titresTypesTypes = await titresTypesTypesGet()

      await ordreUpdate(titreType, titresTypesTypes, titreTypeTypeUpdate)
    }

    await titreTypeTypeUpdate(titreType.id!, titreType)

    const titresTypesTypes = await titresTypesTypesGet()

    return titresTypesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreStatutModifier = async (
  { titreStatut }: { titreStatut: ITitreStatut },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants pour effectuer cette opération')
    }

    if (titreStatut.ordre) {
      const titresStatuts = await titresStatutsGet()

      await ordreUpdate(titreStatut, titresStatuts, titreStatutUpdate)
    }

    await titreStatutUpdate(titreStatut.id!, titreStatut)

    const titresStatut = await titresStatutsGet()

    return titresStatut
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const demarcheTypeModifier = async (
  { demarcheType }: { demarcheType: IDemarcheType },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants pour effectuer cette opération')
    }

    const fields = fieldsBuild(info)

    if (demarcheType.ordre) {
      const demarchesTypes = await demarchesTypesGet(
        {},
        { fields },
        context.user?.id
      )

      await ordreUpdate(demarcheType, demarchesTypes, demarcheTypeUpdate)
    }

    await demarcheTypeUpdate(demarcheType.id!, demarcheType)

    const demarchesTypes = await demarchesTypesGet(
      {},
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

const demarcheStatutModifier = async (
  { demarcheStatut }: { demarcheStatut: IDemarcheStatut },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants pour effectuer cette opération')
    }

    if (demarcheStatut.ordre) {
      const demarchesStatuts = await demarchesStatutsGet()

      await ordreUpdate(demarcheStatut, demarchesStatuts, demarcheStatutUpdate)
    }

    await demarcheStatutUpdate(demarcheStatut.id!, demarcheStatut)

    const demarchesStatuts = await demarchesStatutsGet()

    return demarchesStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const phaseStatutModifier = async (
  { phaseStatut }: { phaseStatut: IPhaseStatut },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants pour effectuer cette opération')
    }

    await phaseStatutUpdate(phaseStatut.id!, phaseStatut)

    const phasesStatuts = await phasesStatutsGet()

    return phasesStatuts
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
  travauxTypes,
  documentsTypes,
  documentsVisibilites,
  domaines,
  etapesTypes,
  etapesStatuts,
  geoSystemes,
  permission,
  permissions,
  phasesStatuts,
  referencesTypes,
  statuts,
  titreStatutModifier,
  types,
  unites,
  version,
  activitesTypes,
  activitesStatuts,
  definitions,
  administrationsTypes,
  regions,
  departements,
  domaineModifier,
  definitionModifier,
  titreTypeModifier,
  demarcheTypeModifier,
  demarcheStatutModifier,
  phaseStatutModifier
}
