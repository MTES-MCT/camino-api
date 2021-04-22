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
  IFields,
  IGeoSysteme,
  IPermission,
  IPhaseStatut,
  IReferenceType,
  ITitreStatut,
  ITitreTypeType,
  IToken,
  IUnite
} from '../../../types'
import { debug } from '../../../config/index'

import {
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
  unitesGet,
  deviseUpdate,
  uniteUpdate,
  permissionUpdate,
  geoSystemeUpdate,
  documentTypeUpdate,
  referenceTypeUpdate
} from '../../../database/queries/metas'

import { userGet } from '../../../database/queries/utilisateurs'

import { permissionCheck } from '../../../tools/permission'
import { fieldsBuild } from './_fields-build'
import { etapeTypeIsValidCheck } from '../../_format/etapes-types'
import { titreDemarcheGet } from '../../../database/queries/titres-demarches'
import { titreEtapeGet } from '../../../database/queries/titres-etapes'
import {
  departementsGet,
  regionsGet
} from '../../../database/queries/territoires'
import { ordreUpdate } from './_ordre-update'
import { demarcheDefinitionFind } from '../../../business/rules-demarches/definitions'
import { userSuper } from '../../../database/user-super'
import { titresEtapesHeritageContenuUpdate } from '../../../business/processes/titres-etapes-heritage-contenu-update'

const npmPackage = require('../../../../package.json')

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
    const documentsTypes = await documentsTypesGet({ repertoire, typeId })

    return documentsTypes
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
    const user = await userGet(context.user?.id)

    return permissionsGet(null as never, null as never, user)
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
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info)

    const domaines = await domainesGet(null as never, { fields }, user)

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
    const user = await userGet(context.user?.id)

    return await titresStatutsGet(user)
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
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info)

    const demarchesTypes = await demarchesTypesGet(
      { titreId, titreDemarcheId },
      { fields },
      user
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

const demarcheEtapesTypesGet = async (
  {
    titreDemarcheId,
    titreEtapeId,
    date
  }: { titreDemarcheId: string; date: string; titreEtapeId?: string },
  { fields }: { fields: IFields },
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
    userSuper
  )

  if (!titreDemarche) throw new Error("la démarche n'existe pas")

  const titre = titreDemarche.titre!

  const titreEtape = titreEtapeId
    ? await titreEtapeGet(titreEtapeId, {}, user)
    : undefined

  if (titreEtapeId && !titreEtape) throw new Error("l'étape n'existe pas")

  // si on modifie une étape
  // vérifie que son type est possible sur la démarche
  if (titreEtape) {
    const etapeType = titreDemarche.type!.etapesTypes.find(
      et => et.id === titreEtape.typeId
    )

    if (!etapeType) {
      throw new Error(
        `étape ${titreEtape.type!.nom} inexistante pour une démarche ${
          titreDemarche.type!.nom
        } pour un titre ${titre.typeId}.`
      )
    }
  }

  // si il existe un arbre d’instructions pour cette démarche,
  // on laisse l’arbre traiter l’unicité des étapes
  const uniqueCheck = !demarcheDefinitionFind(
    titre.typeId,
    titreDemarche.typeId
  )?.restrictions

  // dans un premier temps on récupère toutes les étapes possibles pour cette démarche
  const etapesTypes = await etapesTypesGet(
    { titreDemarcheId, titreEtapeId },
    { fields, uniqueCheck },
    user
  )

  const etapesTypesFormatted = etapesTypes.filter(etapeType =>
    etapeTypeIsValidCheck(
      etapeType,
      date,
      titre,
      titreDemarche.type!,
      titreDemarche.etapes,
      titreEtape
    )
  )

  return etapesTypesFormatted
}

const etapesTypes = async (
  {
    titreDemarcheId,
    titreEtapeId,
    date
  }: {
    titreDemarcheId?: string
    titreEtapeId?: string
    date?: string
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = await userGet(context.user?.id)
    const fields = fieldsBuild(info)

    // si création ou édition d'une étape de démarche
    // retourne les types d'étape pour cette démarche
    if (titreDemarcheId) {
      if (!date) {
        throw new Error(`date manquante`)
      }

      return demarcheEtapesTypesGet(
        { titreDemarcheId, date, titreEtapeId },
        { fields },
        context.user?.id
      )
    }

    // sinon (p.e.: édition des métas ou des permissions d'administration)
    // retourne la liste des types d'étapes
    return etapesTypesGet({}, { fields }, user)
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
      const domaines = await domainesGet(null as never, { fields }, user)

      await ordreUpdate(domaine, domaines, domaineUpdate)
    }

    await domaineUpdate(domaine.id!, domaine)

    const domaines = await domainesGet(null as never, { fields }, user)

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
      const titresStatuts = await titresStatutsGet(user)

      await ordreUpdate(titreStatut, titresStatuts, titreStatutUpdate)
    }

    await titreStatutUpdate(titreStatut.id!, titreStatut)

    const titresStatut = await titresStatutsGet(user)

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
      const demarchesTypes = await demarchesTypesGet({}, { fields }, user)

      await ordreUpdate(demarcheType, demarchesTypes, demarcheTypeUpdate)
    }

    await demarcheTypeUpdate(demarcheType.id!, demarcheType)

    const demarchesTypes = await demarchesTypesGet({}, { fields }, user)

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
      const etapesTypes = await etapesTypesGet({}, { fields }, user)

      await ordreUpdate(etapeType, etapesTypes, etapeTypeUpdate)
    }

    await etapeTypeUpdate(etapeType.id!, etapeType)

    await titresEtapesHeritageContenuUpdate()

    const etapesTypes = await etapesTypesGet({}, { fields }, user)

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
        user
      )

      await ordreUpdate(permission, permissions, permissionUpdate)
    }

    await permissionUpdate(permission.id!, permission)

    const permissions = await permissionsGet(null as never, null as never, user)

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

export {
  devises,
  demarchesTypes,
  demarchesStatuts,
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
  definitions,
  administrationsTypes,
  regions,
  departements,
  domaineModifier,
  definitionModifier,
  titreTypeTypeModifier,
  demarcheTypeModifier,
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
  geoSystemeModifier
}
