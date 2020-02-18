import {
  ITitre,
  ITitreEtape,
  IDemarcheType,
  ITitreActivite,
  IAdministration,
  ITitreDemarche,
  IGeoJson,
  IUtilisateur
} from '../../../types'

import {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
} from '../../../tools/geojson'

import { dupRemove } from '../../../tools/index'

import metas from '../../../database/cache/metas'

import restrictions from '../../../database/cache/restrictions'
import { permissionsCheck } from '../permissions/permissions-check'
import {
  titreIsPublicCheck,
  titrePermissionCheck,
  titrePermissionAdministrationsCheck,
  titreActivitePermissionCheck
} from '../permissions/titre'

import titreEtapePermissionAdministrationsCheck from '../permissions/titre-etape'

import { administrationsFormat } from './administrations'
import { entreprisesFormat } from './entreprises'
import { titreSectionsFormat } from './titres-sections'
import { etapesTypesFormat } from './etapes-types'

import {
  titreActiviteFormatFields,
  titreActiviteFormat,
  titreActiviteCalc
} from './titres-activites'

const titreEtapeFormatFields = {
  geojsonMultiPolygon: true,
  geojsonPoints: true,
  pays: true,
  sections: true
}

const titreDemarcheFormatFields = {
  etapes: titreEtapeFormatFields
}

const titreFormatFields = {
  surface: true,
  engagement: true,
  volume: true,
  geojsonMultiPolygon: true,
  geojsonPoints: true,
  pays: true,
  demarches: titreDemarcheFormatFields,
  activites: titreActiviteFormatFields,
  activitesAbsentes: true,
  activitesDeposees: true,
  activitesEnConstruction: true,
  administrations: true
}

const titreEtapeRestrictionsFilter = (
  user: IUtilisateur | undefined,
  e: ITitreEtape,
  userHasPermission?: boolean
) => {
  const etapeTypeRestricted = restrictions.etapesTypes.find(
    re => re.etapeTypeId === e.typeId
  )

  if (!etapeTypeRestricted) return true

  // si l'utilisateur n'est pas connecté ou qu'il n'a pas de droit sur le titre
  if (!user || !userHasPermission) {
    return !etapeTypeRestricted.publicLectureInterdit
  }

  // si l'utilisateur est titulaire ou amodiataire
  const isEntreprise = permissionsCheck(user, ['entreprise'])
  if (isEntreprise) return !etapeTypeRestricted.entreprisesLectureInterdit

  // si l'utilisateur fait partie d'une administration
  const isAdministration =
    permissionsCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user.administrations?.length
  if (isAdministration) {
    const etapeTypeRestrictedAdministration = restrictions.etapesTypesAdministrations.find(
      rea =>
        rea.etapeTypeId === e.typeId &&
        user.administrations?.find(ua => ua.id === rea.administrationId) &&
        rea.lectureInterdit
    )

    return !etapeTypeRestrictedAdministration
  }

  // ne devrait pas arriver jusqu'ici
  return false
}

const demarcheTypeFormat = (
  user: IUtilisateur | undefined,
  demarcheType: IDemarcheType,
  titre: ITitre,
  { isSuper }: { isSuper: boolean }
) => {
  if (!titre.editable) {
    demarcheType.editable = false

    return demarcheType
  }

  const dt = metas.demarchesTypes.find(dt => dt.id === demarcheType.id)
  if (!dt) throw new Error(`${demarcheType.id} inexistant`)

  demarcheType.editable = dt.etapesTypes.some(
    et =>
      et.titreTypeId === titre.typeId &&
      (isSuper ||
        titreEtapePermissionAdministrationsCheck(
          user,
          'modification',
          et.id,
          titre.typeId,
          titre.administrationsGestionnaires,
          titre.administrationsLocales
        ))
  )

  return demarcheType
}

// optimisation possible pour un expert SQL
// remplacer le contenu de ce fichier
// par des requêtes SQL (dans /database/queries/titres)
// qui retournent les données directement formatées
const titreFormat = (
  user: IUtilisateur | undefined,
  t: ITitre,
  fields = titreFormatFields
) => {
  const titreIsPublic = titreIsPublicCheck(t)
  const userHasPermission = titrePermissionCheck(
    user,
    ['super', 'admin', 'editeur', 'lecteur'],
    t
  )

  if (!titreIsPublic && !userHasPermission) {
    return null
  }

  const isSuper = permissionsCheck(user, ['super'])
  const isAdmin = permissionsCheck(user, ['admin'])

  if (isSuper || isAdmin) {
    t.editable =
      isSuper ||
      titrePermissionAdministrationsCheck(
        user,
        'modification',
        t.typeId,
        t.statutId!,
        t.administrationsGestionnaires,
        t.administrationsLocales
      )
    t.supprimable = isSuper
  }

  if (!fields) return t

  if (t.points?.length) {
    if (fields.geojsonMultiPolygon) {
      t.geojsonMultiPolygon = (geojsonFeatureMultiPolygon(
        t.points
      ) as unknown) as IGeoJson
    }

    if (fields.geojsonPoints) {
      t.geojsonPoints = (geojsonFeatureCollectionPoints(
        t.points
      ) as unknown) as IGeoJson
    }
  }

  if (fields.demarches && t.demarches && t.demarches.length) {
    t.demarches = t.demarches.map(td =>
      titreDemarcheFormat(
        user,
        td,
        t,
        { userHasPermission, isSuper, isAdmin },
        fields.demarches
      )
    )
  }

  if (fields.volume && t.volumeEtape) {
    t.volume = t.volumeEtape.volume
  }

  if (fields.engagement && t.engagementEtape) {
    t.engagement = t.engagementEtape.engagement
  }

  if (fields.surface && t.surfaceEtape) {
    t.surface = t.surfaceEtape.surface
  }

  if (t.activites?.length) {
    if (fields.activitesAbsentes) {
      t.activitesAbsentes = titreActiviteCalc(
        user,
        t.activites,
        'abs',
        t.amodiataires,
        t.titulaires
      )
    }

    if (fields.activitesDeposees) {
      t.activitesDeposees = titreActiviteCalc(
        user,
        t.activites,
        'dep',
        t.amodiataires,
        t.titulaires
      )
    }

    if (fields.activitesEnConstruction) {
      t.activitesEnConstruction = titreActiviteCalc(
        user,
        t.activites,
        'enc',
        t.amodiataires,
        t.titulaires
      )
    }

    if (fields.activites) {
      t.activites = t.activites.reduce((acc: ITitreActivite[], ta) => {
        if (
          titreActivitePermissionCheck(
            user,
            ta.type?.administrations,
            t.amodiataires,
            t.titulaires
          )
        ) {
          acc.push(titreActiviteFormat(user, ta, fields.activites))
        }

        return acc
      }, [])
    } else {
      delete t.activites
    }
  }

  if (fields.administrations) {
    const hasAdministrations =
      t.administrationsGestionnaires?.length || t.administrationsLocales?.length
    if (hasAdministrations) {
      // fusionne administrations gestionnaires et locales
      let administrations = dupRemove('id', [
        ...(t.administrationsGestionnaires || []),
        ...(t.administrationsLocales || [])
      ]) as IAdministration[]

      // si l'utilisateur n'a pas de droits de visualisation suffisants
      // alors filtre les administrations `associee`
      administrations = !permissionsCheck(user, [
        'super',
        'admin',
        'editeur',
        'lecteur'
      ])
        ? administrations.filter(a => !a.associee)
        : administrations

      t.administrations = administrations.sort(
        (a, b) => a.type.ordre - b.type.ordre
      )

      t.administrations = administrationsFormat(user, t.administrations)

      delete t.administrationsGestionnaires
      delete t.administrationsLocales
    } else {
      t.administrations = []
    }
  }

  if (t.titulaires) {
    t.titulaires = entreprisesFormat(user, t.titulaires)
  }

  if (t.amodiataires) {
    t.amodiataires = entreprisesFormat(user, t.amodiataires)
  }

  return t
}

const titresFormat = (
  user: IUtilisateur | undefined,
  titres: ITitre[],
  fields = titreFormatFields
) =>
  titres &&
  titres.reduce((acc: ITitre[], titre) => {
    const titreFormated = titreFormat(user, titre, fields)

    if (titreFormated) {
      acc.push(titreFormated)
    }

    return acc
  }, [])

const titreDemarcheFormat = (
  user: IUtilisateur | undefined,
  td: ITitreDemarche,
  t: ITitre,
  {
    userHasPermission,
    isSuper,
    isAdmin
  }: { userHasPermission?: boolean; isSuper: boolean; isAdmin: boolean },
  fields = titreDemarcheFormatFields
) => {
  if (!fields) return td

  td.editable = isSuper || t.editable
  td.supprimable = isSuper

  if (td.titreType?.id && td.type) {
    // cherche le statut `editable` dans le type de démarche du titre
    td.type = demarcheTypeFormat(user, td.type, t, { isSuper })
  }

  if (fields.etapes && td.etapes && td.etapes.length) {
    const isSuper = permissionsCheck(user, ['super'])

    const titreEtapes = td.etapes.reduce((titreEtapes: ITitreEtape[], te) => {
      if (
        !isSuper &&
        !titreEtapeRestrictionsFilter(user, te, userHasPermission)
      ) {
        return titreEtapes
      }

      const teFormatted = titreEtapeFormat(
        user,
        te,
        td,
        t,
        { userHasPermission, isSuper, isAdmin },
        fields.etapes
      )

      titreEtapes.push(teFormatted)

      return titreEtapes
    }, [])

    td.etapes = titreEtapes
  }

  return td
}

const titreEtapeFormat = (
  user: IUtilisateur | undefined,
  te: ITitreEtape,
  td: ITitreDemarche,
  t: ITitre,
  {
    userHasPermission,
    isSuper,
    isAdmin
  }: { userHasPermission?: boolean; isSuper: boolean; isAdmin: boolean },
  fields = titreEtapeFormatFields
) => {
  if (isSuper || isAdmin) {
    te.editable =
      isSuper ||
      (td.editable &&
        titreEtapePermissionAdministrationsCheck(
          user,
          'modification',
          te.typeId,
          t.typeId,
          t.administrationsGestionnaires,
          t.administrationsLocales
        ))

    te.supprimable = isSuper

    if (te.type) {
      te.type.editable = te.editable

      te.type = etapesTypesFormat(te.type)

      if (te.type.sections) {
        te.type.sections = titreSectionsFormat(te.type.sections)
      }
    }
  }

  if (!fields) return te

  if (te.points && te.points.length) {
    if (fields.geojsonMultiPolygon) {
      te.geojsonMultiPolygon = (geojsonFeatureMultiPolygon(
        te.points
      ) as unknown) as IGeoJson
    }

    if (fields.geojsonPoints) {
      te.geojsonPoints = (geojsonFeatureCollectionPoints(
        te.points
      ) as unknown) as IGeoJson
    }
  }

  if (te.documents) {
    if (!userHasPermission) {
      te.documents = te.documents.filter(ted => ted.public)
    } else {
      te.documents.forEach(ted => {
        ted.editable = te.editable
        ted.supprimable = isSuper
      })
    }
  }

  if (te.administrations) {
    te.administrations = administrationsFormat(user, te.administrations)
  }

  if (te.titulaires) {
    te.titulaires = entreprisesFormat(user, te.titulaires)
  }

  if (te.amodiataires) {
    te.amodiataires = entreprisesFormat(user, te.amodiataires)
  }

  return te
}

export { titreFormat, titresFormat, demarcheTypeFormat }
