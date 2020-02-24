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

import autorisations from '../../../database/cache/autorisations'
import { permissionsCheck } from '../permissions/permissions-check'
import {
  titreIsPublicCheck,
  titrePermissionCheck,
  titreActivitePermissionCheck
} from '../permissions/titre'
import {
  titrePermissionAdministrationsCheck,
  titreDemarchePermissionAdministrationsCheck,
  titreEtapePermissionAdministrationsCheck
} from '../permissions/titre-edition'

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

const titreEtapeAutorisationLectureFilter = (
  user: IUtilisateur | undefined,
  etapeTypeId: string,
  userHasPermission?: boolean
) => {
  const etapeTypeAutorisation = autorisations.etapesTypes.find(
    re => re.etapeTypeId === etapeTypeId
  )
  if (!etapeTypeAutorisation) return false

  // si l'utilisateur n'est pas connecté
  // ou qu'il n'a pas de droit sur le titre
  if (!user || !userHasPermission) {
    return etapeTypeAutorisation.publicLecture
  }

  // si l'utilisateur est titulaire ou amodiataire
  const isEntreprise = permissionsCheck(user, ['entreprise'])
  if (isEntreprise) return etapeTypeAutorisation.entreprisesLecture

  // si l'utilisateur fait partie d'au moins une administration
  const isAdministration =
    permissionsCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user.administrations?.length
  if (isAdministration) {
    // cherche si le type d'étape fait l'objet de restriction
    // pour toutes les administrations de l'utilisateur
    const isEtapeTypeAdministrationRestricted =
      user.administrations?.every(({ id: administrationId }) =>
        autorisations.titresTypesEtapesTypesAdministrations.some(
          rea =>
            administrationId === rea.administrationId &&
            rea.etapeTypeId === etapeTypeId &&
            rea.lectureInterdit
        )
      )

    return !isEtapeTypeAdministrationRestricted
  }

  // ne devrait pas arriver jusqu'ici
  return false
}

const demarcheTypeFormat = (
  user: IUtilisateur | undefined,
  demarcheType: IDemarcheType,
  titreTypeId: string,
  titreStatutId: string
) => {
  const dt = metas.demarchesTypes.find(dt => dt.id === demarcheType.id)
  if (!dt) throw new Error(`${demarcheType.id} inexistant`)

  demarcheType.editable = titreDemarchePermissionAdministrationsCheck(
    user,
    titreTypeId,
    titreStatutId
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
        t.typeId,
        t.statutId!
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

  td.editable =
    isSuper ||
    titreDemarchePermissionAdministrationsCheck(user, t.typeId, t.statutId!)
  td.supprimable = isSuper

  const dt = metas.demarchesTypes.find(dt => dt.id === td.typeId)
  if (!dt) throw new Error(`${td.typeId} inexistant`)

  // si au moins un type d'étape est éditable pour le type de démarche
  // alors on peut ajouter des étapes à la démarche
  td.etapesEditable =
    isSuper ||
    dt.etapesTypes.some(
      et =>
        et.titreTypeId === t.typeId &&
        titreEtapePermissionAdministrationsCheck(
          user,
          t.typeId,
          t.statutId!,
          et.id,
          'modification'
        )
    )

  if (td.type) {
    td.type = demarcheTypeFormat(
      user,
      td.type,
      t.typeId,
      t.statutId!
    )
  }

  if (fields.etapes && td.etapes && td.etapes.length) {
    const isSuper = permissionsCheck(user, ['super'])

    const titreEtapes = td.etapes.reduce((titreEtapes: ITitreEtape[], te) => {
      if (
        !isSuper &&
        !titreEtapeAutorisationLectureFilter(user, te.typeId, userHasPermission)
      ) {
        return titreEtapes
      }

      const teFormatted = titreEtapeFormat(
        user,
        te,
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
      titreEtapePermissionAdministrationsCheck(
        user,
        t.typeId,
        t.statutId!,
        te.typeId,
        'modification'
      )
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
