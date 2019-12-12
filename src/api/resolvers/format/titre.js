import {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
} from '../../../tools/geojson'

import { dupRemove } from '../../../tools/index'

import metas from '../_metas'

import restrictions from '../_restrictions'

import {
  permissionsCheck,
  permissionsAdministrationsCheck
} from '../permissions/permissions-check'
import {
  titreIsPublicCheck,
  titrePermissionCheck,
  titreEntreprisePermissionCheck,
  titreModificationPermissionAdministrationsCheck
} from '../permissions/titre'
import { titreEtapeModificationPermissionAdministrationsCheck } from '../permissions/titre-etape'

import { administrationsFormat } from './administration'
import { entreprisesFormat } from './entreprise'

const titreEtapeFormatFields = {
  geojsonMultiPolygon: true,
  geojsonPoints: true,
  pays: true,
  sections: true
}

const titreDemarcheFormatFields = {
  etapes: titreEtapeFormatFields
}

const titreActiviteFormatFields = {
  periode: true,
  sections: true
}

const titreTaxeFormatFields = {
  periode: true,
  sections: true
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
  taxes: titreTaxeFormatFields,
  administrations: true
}

const titresFormat = (titres, user, fields = titreFormatFields) =>
  titres &&
  titres.reduce((acc, titre) => {
    const titreFormated = titreFormat(titre, user, fields)

    if (titreFormated) {
      acc.push(titreFormated)
    }

    return acc
  }, [])

const titreEtapeRestrictionsFilter = (e, user, userHasPermission) => {
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
    permissionsCheck(user, ['admin', 'editeur']) &&
    user.administrations &&
    user.administrations.length
  if (isAdministration) {
    const etapeTypeRestrictedAdministration = restrictions.etapesTypesAdministrations.find(
      rea =>
        rea.etapeTypeId === e.typeId &&
        user.administrations.find(ua => ua.id === rea.administrationId) &&
        rea.lectureInterdit
    )

    return !etapeTypeRestrictedAdministration
  }

  // ne devrait pas arriver jusqu'ici
  return false
}

const demarcheTypeFormat = (demarcheType, titre, user, { isSuper }) => {
  if (!titre.editable) {
    demarcheType.editable = false

    return demarcheType
  }

  const dt = metas.demarchesTypes.find(dt => dt.id === demarcheType.id)
  if (!dt) throw new Error(`${demarcheType.id} inexistant`)

  demarcheType.editable = dt.etapesTypes.some(
    et =>
      et.typeId === titre.typeId &&
      (isSuper ||
        titreEtapeModificationPermissionAdministrationsCheck(
          et.id,
          titre,
          user
        ))
  )

  return demarcheType
}

// optimisation possible pour un expert SQL
// remplacer le contenu de ce fichier
// par des requêtes SQL (dans /database/queries/titres)
// qui retournent les données directement formatées
const titreFormat = (t, user, fields = titreFormatFields) => {
  const titreIsPublic = titreIsPublicCheck(t)
  const userHasPermission = titrePermissionCheck(t, user, [
    'super',
    'admin',
    'editeur'
  ])

  const isSuper = permissionsCheck(user, ['super'])
  const isAdmin = permissionsCheck(user, ['admin'])

  if (isSuper || isAdmin) {
    t.editable =
      isSuper || titreModificationPermissionAdministrationsCheck(t, user)
    t.supprimable = isSuper
  }

  if (!titreIsPublic && !userHasPermission) {
    return null
  }

  // si
  // - l'utilisateur est super
  // - ou l'utilisateur est rattaché à la DGALN ou à la DEAL de Guyane,
  // - ou l'utilisateur editeur est rattaché à la préfecture de Guyane,
  // - ou l'utilisateur est titulaire du titre
  // alors
  // - les activités sont inaccessibles

  const userHasAccessToActivites =
    isSuper ||
    permissionsAdministrationsCheck(user, [
      'min-mtes-dgaln-01',
      'dea-guyane-01'
    ]) ||
    (permissionsAdministrationsCheck(user, ['prefecture-97302-01']) &&
      permissionsCheck(user, ['editeur'])) ||
    titreEntreprisePermissionCheck(t, user)

  if (!userHasAccessToActivites) {
    t.activites = []
    t.activitesAbsentes = null
    t.activitesDeposees = null
    t.activitesEnConstruction = null
  }

  if (!fields) return t

  if (t.points && t.points.length) {
    if (fields.geojsonMultiPolygon) {
      t.geojsonMultiPolygon = geojsonFeatureMultiPolygon(t.points)
    }

    if (fields.geojsonPoints) {
      t.geojsonPoints = geojsonFeatureCollectionPoints(t.points)
    }
  }

  if (fields.demarches && t.demarches && t.demarches.length) {
    t.demarches = t.demarches.map(td =>
      titreDemarcheFormat(
        td,
        t,
        user,
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

  if (fields.activites && t.activites && t.activites.length) {
    t.activites = t.activites.map(titreActivite =>
      titreActiviteFormat(titreActivite, fields.activites)
    )
  }

  if (fields.administrations) {
    const hasAdministrations =
      (t.administrationsGestionnaires &&
        t.administrationsGestionnaires.length) ||
      (t.administrationsLocales && t.administrationsLocales.length)
    if (hasAdministrations) {
      // fusionne administrations gestionnaires et locales
      let administrations = dupRemove('id', [
        ...(t.administrationsGestionnaires || []),
        ...(t.administrationsLocales || [])
      ])

      // si l'utilisateur n'a pas de droits de visualisation suffisants
      // alors filtre les administrations `associee`
      administrations = !permissionsCheck(user, ['super', 'admin', 'editeur'])
        ? administrations.filter(a => !a.associee)
        : administrations

      t.administrations = administrations.sort(
        (a, b) => a.type.ordre - b.type.ordre
      )

      t.administrations = administrationsFormat(t.administrations, user)

      delete t.administrationsGestionnaires
      delete t.administrationsLocales
    } else {
      t.administrations = []
    }
  }

  if (t.titulaires) {
    t.titulaires = entreprisesFormat(t.titulaires, user)
  }

  if (t.amodiataires) {
    t.amodiataires = entreprisesFormat(t.amodiataires, user)
  }

  if (fields.taxes && t.taxes && t.taxes.length) {
    t.taxes = t.taxes.map(titreTaxe => titreTaxeFormat(titreTaxe, fields.taxes))
  }

  return t
}

const titreDemarcheFormat = (
  td,
  t,
  user,
  { userHasPermission, isSuper, isAdmin },
  fields = titreDemarcheFormatFields
) => {
  if (!fields) return td

  td.editable = isSuper || t.editable
  td.supprimable = isSuper

  if (td.titreType.id && td.type) {
    // cherche le statut `editable` dans le type de démarche du titre
    td.type = demarcheTypeFormat(td.type, t, user, { isSuper })
  }

  if (fields.etapes && td.etapes && td.etapes.length) {
    const isSuper = permissionsCheck(user, ['super'])

    const titreEtapes = td.etapes.reduce((titreEtapes, te) => {
      if (
        !isSuper &&
        !titreEtapeRestrictionsFilter(te, user, userHasPermission)
      ) {
        return titreEtapes
      }

      const teFormatted = titreEtapeFormat(
        te,
        td,
        t,
        user,
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

// - ne conserve que les sections qui contiennent des élements
const titreSectionsFormat = tea =>
  tea.type.sections.reduce((sections, s) => {
    const elements = s.elements.reduce((elements, e) => {
      // ne conserve que les éléments dont
      // - la période (si elle existe),
      // - la date de début et la date de fin
      // correspondent à l'activité
      if (
        (!e.frequencePeriodesIds ||
          e.frequencePeriodesIds.find(
            id => tea.periode && tea.periode.id === id
          )) &&
        (!e.dateFin || e.dateFin >= tea.date) &&
        (!e.dateDebut || e.dateDebut < tea.date)
      ) {
        elements.push(e)
      }

      return elements
    }, [])

    const section = {
      id: s.id,
      nom: s.nom,
      type: s.type,
      description: s.description,
      elements
    }

    if (section.elements.length) {
      sections.push(section)
    }

    return sections
  }, [])

const titreEtapeFormat = (
  te,
  td,
  t,
  user,
  { userHasPermission, isSuper, isAdmin },
  fields = titreEtapeFormatFields
) => {
  if (isSuper || isAdmin) {
    te.editable =
      isSuper ||
      (td.editable &&
        titreEtapeModificationPermissionAdministrationsCheck(
          te.typeId,
          t,
          user
        ))

    te.supprimable = isSuper

    if (te.type) {
      te.type.editable = te.editable
    }
  }

  if (!fields) return te

  if (te.points && te.points.length) {
    if (fields.geojsonMultiPolygon) {
      te.geojsonMultiPolygon = geojsonFeatureMultiPolygon(te.points)
    }

    if (fields.geojsonPoints) {
      te.geojsonPoints = geojsonFeatureCollectionPoints(te.points)
    }
  }

  if (te.documents && !userHasPermission) {
    te.documents = te.documents.filter(ted => ted.public)
  }

  if (te.administrations) {
    te.administrations = administrationsFormat(te.administrations, user)
  }

  if (te.titulaires) {
    te.titulaires = entreprisesFormat(te.titulaires, user)
  }

  if (te.amodiataires) {
    te.amodiataires = entreprisesFormat(te.amodiataires, user)
  }

  return te
}

const titreActiviteFormat = (ta, fields = titreActiviteFormatFields) => {
  // si
  // - le formatage de la période est requis
  // - l'activité a une périodicité
  // - le type d'activité a une fréquence qui contient un tableau de périodes
  // alors la période de l'activité en cours est définie
  if (
    fields.periode &&
    ta.frequencePeriodeId &&
    ta.type.frequence &&
    ta.type.frequence[ta.type.frequence.periodesNom] &&
    ta.type.frequence[ta.type.frequence.periodesNom].length
  ) {
    ta.periode = ta.type.frequence[ta.type.frequence.periodesNom].find(
      p => p.id === ta.frequencePeriodeId
    )
  }

  if (fields.sections && ta.type.sections) {
    // - les sections qui contiennent des élements sur cette activité
    ta.sections = titreSectionsFormat(ta)
  }

  return ta
}

const titreTaxeFormat = ta => ta

export { titreFormat, titresFormat, titreActiviteFormat, demarcheTypeFormat }
