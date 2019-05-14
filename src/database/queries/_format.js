import * as dateFormat from 'dateformat'

import {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
} from '../../tools/geojson'

// optimisation possible pour un expert SQL
// remplacer le contenu de ce fichier
// par des requêtes sql (dans /database/queries/titres)
// qui retournent les données directement formatées
const titreFormat = t => {
  if (t.points && t.points.length) {
    t.geojsonMultiPolygon = geojsonFeatureMultiPolygon(t.points)
    t.geojsonPoints = geojsonFeatureCollectionPoints(t.points)
  }

  if (t.communes && t.communes.length) {
    t.pays = paysRegionsDepartementsCommunes(t.communes)
  }

  if (t.demarches && t.demarches.length) {
    t.demarches = t.demarches.map(td => titreDemarcheFormat(td))
  }

  if (t.volumeEtape) {
    t.volume = t.volumeEtape.volume
  }

  if (t.engagementEtape) {
    t.engagement = t.engagementEtape.engagement
  }

  if (t.surfaceEtape) {
    t.surface = t.surfaceEtape.surface
  }

  if (t.activites && t.activites.length) {
    t.activites = t.activites.map(titreActiviteFormat)
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

const titreDemarcheFormat = td => {
  if (td.titreType.id && td.type && td.type.etapesTypes) {
    td.type.etapesTypes = td.type.etapesTypes.filter(
      e => e.typeId === td.titreType.id
    )
  }

  if (td.etapes && td.etapes.length) {
    td.etapes = td.etapes.map(titreEtapeFormat)
  }

  return td
}

const titreEtapeFormat = te => {
  if (te.points && te.points.length) {
    te.geojsonMultiPolygon = geojsonFeatureMultiPolygon(te.points)
    te.geojsonPoints = geojsonFeatureCollectionPoints(te.points)
  }

  return te
}

const titreActiviteFormat = ta => {
  if (ta.frequencePeriodeId && ta.type && ta.type.frequence) {
    if (
      ta.type.frequence[ta.type.frequence.periodesNom] &&
      ta.type.frequence[ta.type.frequence.periodesNom].length
    ) {
      ta.periode = ta.type.frequence[ta.type.frequence.periodesNom].find(
        p => p.id === ta.frequencePeriodeId
      )
    }
  }

  // - ne conserve que les sections qui contiennent des élements
  ta.sections = ta.type.sections.reduce((sections, s) => {
    // ne conserve que les éléments dont la période,
    // la date de début et la date de fin
    // correspondent à l'activité
    const elements = s.elements.reduce(
      (elements, e) =>
        (!e.frequencePeriodesIds ||
          e.frequencePeriodesIds.find(
            id => ta.periode && ta.periode.id === id
          )) &&
        (!e.dateFin || e.dateFin >= dateFormat(ta.date, 'yyyy-mm-dd')) &&
        (!e.dateDebut || e.dateDebut < dateFormat(ta.date, 'yyyy-mm-dd'))
          ? [...elements, e]
          : elements,
      []
    )

    const section = {
      id: s.id,
      nom: s.nom,
      type: s.type,
      description: s.description,
      elements
    }

    if (s.frequencePeriodesIds) {
      section.frequencePeriodesIds = s.frequencePeriodesIds
    }

    return section.elements.length ? [...sections, section] : sections
  }, [])

  return ta
}

export {
  titreFormat,
  titreActiviteFormat,
  titreDemarcheFormat,
  titreEtapeFormat
}
