import {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
} from '../../tools/geojson'

import { dupRemove } from '../../tools/index'

import {
  permissionsCheck,
  permissionsAdministrationsCheck
} from './_permissions-check'

import restrictions from './_restrictions'

import { titreIsPublicCheck, titrePermissionCheck } from './_titre'

import { administrationsFormat } from './_administration'
import { entreprisesFormat } from './_entreprise'

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

const titreFormatFields = {
  surface: true,
  engagement: true,
  volume: true,
  geojsonMultiPolygon: true,
  geojsonPoints: true,
  pays: true,
  demarches: titreDemarcheFormatFields,
  activites: titreActiviteFormatFields,
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

  if (!titreIsPublic && !userHasPermission) {
    return null
  }

  // si l'utilisateur n'est ni rattaché à la DGALN, ni à la DEAL de Guyane,
  // alors les rapports trimestriels de prod d'or de Guyane sont inaccessibles
  if (
    !titrePermissionCheck(t, user, ['super']) &&
    !permissionsAdministrationsCheck(user, [
      'min-mtes-dgaln-01',
      'dea-guyane-01'
    ])
  ) {
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

  if (fields.pays && t.communes && t.communes.length) {
    t.pays = paysRegionsDepartementsCommunes(t.communes)
  }

  if (fields.demarches && t.demarches && t.demarches.length) {
    t.demarches = t.demarches.map(titreDemarche =>
      titreDemarcheFormat(
        titreDemarche,
        user,
        userHasPermission,
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
      (t.administrationsCentrales && t.administrationsCentrales.length) ||
      (t.administrationsLocales && t.administrationsLocales.length)
    if (hasAdministrations) {
      // fusionne administrations centrales et locales
      let administrations = dupRemove('id', [
        ...(t.administrationsCentrales || []),
        ...(t.administrationsLocales || [])
      ])

      // si l'utilisateur n'a pas de droits de visualisation suffisants
      // alors filtre les administrations `subsidiaire`
      administrations = !permissionsCheck(user, ['super', 'admin', 'editeur'])
        ? administrations.filter(a => !a.subsidiaire)
        : administrations

      t.administrations = administrations.sort(
        (a, b) => a.type.ordre - b.type.ordre
      )

      t.administrations = administrationsFormat(t.administrations, user)

      delete t.administrationsCentrales
      delete t.administrationsLocales
    }
  }

  if (t.titulaires) {
    t.titulaires = entreprisesFormat(t.titulaires, user)
  }

  if (t.amodiataires) {
    t.amodiataires = entreprisesFormat(t.amodiataires, user)
  }

  return t
}

const paysRegionsDepartementsCommunes = communes => {
  const pays = communes.reduce((pays, commune) => {
    // "un pay", singulier de "des pays"
    let pay = pays.find(p => p.id === commune.departement.region.pays.id)

    if (!pay) {
      pay = {
        id: commune.departement.region.pays.id,
        nom: commune.departement.region.pays.nom,
        regions: []
      }
      pays.push(pay)
    }

    let region = pay.regions.find(r => r.id === commune.departement.region.id)

    if (!region) {
      region = {
        id: commune.departement.region.id,
        nom: commune.departement.region.nom,
        departements: []
      }
      pay.regions.push(region)
    }

    let departement = region.departements.find(
      d => d.id === commune.departement.id
    )

    if (!departement) {
      departement = {
        id: commune.departement.id,
        nom: commune.departement.nom,
        communes: []
      }
      region.departements.push(departement)
    }

    if (!departement.communes.find(c => c.id === commune.id)) {
      departement.communes.push({ id: commune.id, nom: commune.nom })
    }

    return pays
  }, [])

  // trie par ordre alphabétique
  pays.sort((a, b) => a.nom > b.nom)
  pays.forEach(p => {
    p.regions.sort((a, b) => (a.nom > b.nom ? 1 : -1))
    p.regions.forEach(r => {
      r.departements.sort((a, b) => (a.nom > b.nom ? 1 : -1))
      r.departements.forEach(d => {
        d.communes.sort((a, b) => (a.nom > b.nom ? 1 : -1))
      })
    })
  })

  return pays
}

const titreDemarcheFormat = (
  td,
  user,
  userHasPermission,
  fields = titreDemarcheFormatFields
) => {
  if (!fields) return td

  if (td.titreType.id && td.type && td.type.etapesTypes) {
    td.type.etapesTypes = td.type.etapesTypes.filter(
      et => et.typeId === td.titreType.id
    )
  }

  if (fields.etapes && td.etapes && td.etapes.length) {
    const isSuper = permissionsCheck(user, ['super'])

    td.etapes = td.etapes.reduce((titreEtapes, titreEtape) => {
      if (
        !isSuper &&
        !titreEtapeRestrictionsFilter(titreEtape, user, userHasPermission)
      ) {
        return titreEtapes
      }

      titreEtapes.push(
        titreEtapeFormat(titreEtape, user, userHasPermission, fields.etapes)
      )

      return titreEtapes
    }, [])
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
  user,
  userHasPermission,
  fields = titreEtapeFormatFields
) => {
  if (!fields) return te

  if (te.points && te.points.length) {
    if (fields.geojsonMultiPolygon) {
      te.geojsonMultiPolygon = geojsonFeatureMultiPolygon(te.points)
    }

    if (fields.geojsonPoints) {
      te.geojsonPoints = geojsonFeatureCollectionPoints(te.points)
    }
  }

  if (fields.pays && te.communes && te.communes.length) {
    te.pays = paysRegionsDepartementsCommunes(te.communes)
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

export { titreFormat, titresFormat, titreActiviteFormat }
