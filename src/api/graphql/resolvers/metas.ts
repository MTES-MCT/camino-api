import { GraphQLResolveInfo } from 'graphql'
import {
  IAdministrationType,
  IDefinition,
  IDemarcheStatut,
  IDemarcheType,
  IDevise,
  IDocumentRepertoire,
  IDocumentType,
  IDomaine,
  IEtapeStatut,
  IEtapeType,
  IGeoSysteme,
  IPermission,
  IPhaseStatut,
  IReferenceType,
  ITitreStatut,
  ITitreType,
  ITitreTypeTitreStatut,
  ITitreTypeType,
  IToken,
  ITravauxType,
  IUnite
} from '../../../types'
import { debug } from '../../../config/index'

import {
  activitesStatutsGet,
  activitesTypesGet,
  administrationsTypesGet,
  administrationTypeUpdate,
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
  etapeStatutUpdate,
  etapesTypesGet,
  etapeTypeUpdate,
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
  travauxTypeUpdate,
  unitesGet,
  deviseUpdate,
  uniteUpdate,
  permissionUpdate,
  geoSystemeUpdate,
  documentTypeUpdate,
  referenceTypeUpdate,
  titresTypesGet,
  titreTypeUpdate,
  titreTypeCreate,
  titreTypeDelete,
  titresTypesTitresStatutsGet,
  titreTypeTitreStatutCreate,
  titreTypeTitreStatutDelete,
  titreTypeTitreStatutUpdate
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

const titresTypes = async (_: never, context: IToken) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const titresTypes = await titresTypesGet(null as never, {})

    return titresTypes
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
      throw new Error('droits insuffisants')
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
      throw new Error('droits insuffisants')
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

const titreTypeTypeModifier = async (
  { titreType }: { titreType: ITitreTypeType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
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
      throw new Error('droits insuffisants')
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
      throw new Error('droits insuffisants')
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

const travauxTypeModifier = async (
  { travauxType }: { travauxType: ITravauxType },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const fields = fieldsBuild(info)

    if (travauxType.ordre) {
      const travauxTypes = await travauxTypesGet(
        {},
        { fields },
        context.user?.id
      )

      await ordreUpdate(travauxType, travauxTypes, travauxTypeUpdate)
    }

    await travauxTypeUpdate(travauxType.id!, travauxType)

    const travauxTypes = await travauxTypesGet({}, { fields }, context.user?.id)

    return travauxTypes
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
      throw new Error('droits insuffisants')
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
      throw new Error('droits insuffisants')
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

const etapeTypeModifier = async (
  { etapeType }: { etapeType: IEtapeType },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const fields = fieldsBuild(info)

    if (etapeType.ordre) {
      const etapesTypes = await etapesTypesGet({}, { fields }, context.user?.id)

      await ordreUpdate(etapeType, etapesTypes, etapeTypeUpdate)
    }

    await etapeTypeUpdate(etapeType.id!, etapeType)

    const etapesTypes = await etapesTypesGet({}, { fields }, context.user?.id)

    return etapesTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const etapeStatutModifier = async (
  { etapeStatut }: { etapeStatut: IEtapeStatut },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    if (etapeStatut.ordre) {
      const etapesStatuts = await etapesStatutsGet()

      await ordreUpdate(etapeStatut, etapesStatuts, etapeStatutUpdate)
    }

    await etapeStatutUpdate(etapeStatut.id!, etapeStatut)

    const etapesStatuts = await etapesStatutsGet()

    return etapesStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const deviseModifier = async (
  { devise }: { devise: IDevise },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await deviseUpdate(devise.id!, devise)

    const devises = await devisesGet()

    return devises
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const uniteModifier = async ({ unite }: { unite: IUnite }, context: IToken) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await uniteUpdate(unite.id!, unite)

    const unites = await unitesGet()

    return unites
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const administrationTypeModifier = async (
  { administrationType }: { administrationType: IAdministrationType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    if (administrationType.ordre) {
      const administrationsTypes = await administrationsTypesGet()

      await ordreUpdate(
        administrationType,
        administrationsTypes,
        administrationTypeUpdate
      )
    }

    await administrationTypeUpdate(administrationType.id!, administrationType)

    const administrationsTypes = await administrationsTypesGet()

    return administrationsTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const permissionModifier = async (
  { permission }: { permission: IPermission },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    if (permission.ordre) {
      const permissions = await permissionsGet(
        null as never,
        null as never,
        context.user?.id
      )

      await ordreUpdate(permission, permissions, permissionUpdate)
    }

    await permissionUpdate(permission.id!, permission)

    const permissions = await permissionsGet(
      null as never,
      null as never,
      context.user?.id
    )

    return permissions
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const geoSystemeModifier = async (
  { geoSysteme }: { geoSysteme: IGeoSysteme },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    if (geoSysteme.ordre) {
      const geoSystemes = await geoSystemesGet()

      await ordreUpdate(geoSysteme, geoSystemes, geoSystemeUpdate)
    }

    await geoSystemeUpdate(geoSysteme.id!, geoSysteme)

    const geoSystemes = await geoSystemesGet()

    return geoSystemes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const documentTypeModifier = async (
  { documentType }: { documentType: IDocumentType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await documentTypeUpdate(documentType.id!, documentType)

    const documentTypes = await documentsTypesGet({})

    return documentTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}
const referenceTypeModifier = async (
  { referenceType }: { referenceType: IReferenceType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await referenceTypeUpdate(referenceType.id!, referenceType)

    const referenceTypes = await referencesTypesGet()

    return referenceTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeModifier = async (
  { titreType }: { titreType: ITitreType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeUpdate(titreType.id!, titreType)

    const titresTypes = await titresTypesGet(null as never, {})

    return titresTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeCreer = async (
  { titreType }: { titreType: ITitreType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeCreate(titreType)

    const titresTypes = await titresTypesGet(null as never, {})

    return titresTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeSupprimer = async (
  { titreType }: { titreType: ITitreType },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeDelete(titreType.id)

    const titresTypes = await titresTypesGet(null as never, {})

    return titresTypes
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titresTypesTitresStatuts = async (_: never, context: IToken) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    const titresTypesTitresStatuts = await titresTypesTitresStatutsGet()

    return titresTypesTitresStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeTitreStatutModifier = async (
  { titreTypeTitreStatut }: { titreTypeTitreStatut: ITitreTypeTitreStatut },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeTitreStatutUpdate(
      titreTypeTitreStatut.titreTypeId,
      titreTypeTitreStatut.titreStatutId,
      titreTypeTitreStatut
    )

    const titresTypesTitresStatuts = await titresTypesTitresStatutsGet()

    return titresTypesTitresStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeTitreStatutCreer = async (
  { titreTypeTitreStatut }: { titreTypeTitreStatut: ITitreTypeTitreStatut },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeTitreStatutCreate(titreTypeTitreStatut)

    const titresTypesTitresStatuts = await titresTypesTitresStatutsGet()

    return titresTypesTitresStatuts
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreTypeTitreStatutSupprimer = async (
  { titreTypeTitreStatut }: { titreTypeTitreStatut: ITitreTypeTitreStatut },
  context: IToken
) => {
  try {
    const user = await userGet(context.user?.id)

    if (!permissionCheck(user?.permissionId, ['super'])) {
      throw new Error('droits insuffisants')
    }

    await titreTypeTitreStatutDelete(
      titreTypeTitreStatut.titreTypeId,
      titreTypeTitreStatut.titreStatutId
    )

    const titresTypesTitresStatuts = await titresTypesTitresStatutsGet()

    return titresTypesTitresStatuts
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
  titresTypes,
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
  titreTypeTypeModifier,
  demarcheTypeModifier,
  travauxTypeModifier,
  demarcheStatutModifier,
  phaseStatutModifier,
  etapeTypeModifier,
  etapeStatutModifier,
  deviseModifier,
  uniteModifier,
  administrationTypeModifier,
  permissionModifier,
  documentTypeModifier,
  referenceTypeModifier,
  geoSystemeModifier,
  titreTypeModifier,
  titreTypeCreer,
  titreTypeSupprimer,
  titresTypesTitresStatuts,
  titreTypeTitreStatutModifier,
  titreTypeTitreStatutCreer,
  titreTypeTitreStatutSupprimer
}
