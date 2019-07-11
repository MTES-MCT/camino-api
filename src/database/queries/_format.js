import * as dateFormat from 'dateformat'

import {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
} from '../../tools/geojson'

const titreEtapeFormatDefault = {
  geojsonMultiPolygon: {},
  geojsonPoints: {},
  pays: {}
}

const titreDemarcheFormatDefaut = {
  etapes: titreEtapeFormatDefault
}

const titreActiviteFormatDefault = {
  periode: {},
  sections: {}
}

const titreFormatDefault = {
  surface: {},
  engagement: {},
  volume: {},
  geojsonMultiPolygon: {},
  geojsonPoints: {},
  pays: {},
  demarches: titreDemarcheFormatDefaut,
  activites: titreActiviteFormatDefault,
  administrations: {}
}

// optimisation possible pour un expert SQL
// remplacer le contenu de ce fichier
// par des requêtes sql (dans /database/queries/titres)
// qui retournent les données directement formatées
const titreFormat = (t, format = titreFormatDefault) => {
  if (!format) return t

  if (t.points && t.points.length) {
    if (format.geojsonMultiPolygon) {
      t.geojsonMultiPolygon = geojsonFeatureMultiPolygon(t.points)
    }

    if (format.geojsonPoints) {
      t.geojsonPoints = geojsonFeatureCollectionPoints(t.points)
    }
  }

  if (t.communes && t.communes.length && format.pays) {
    t.pays = paysRegionsDepartementsCommunes(t.communes)
  }

  if (t.demarches && t.demarches.length && format.demarches) {
    t.demarches = t.demarches.map(titreDemarche =>
      titreDemarcheFormat(titreDemarche, format.demarches || true)
    )
  }

  if (t.volumeEtape && format.volume) {
    t.volume = t.volumeEtape.volume
  }

  if (t.engagementEtape && format.engagement) {
    t.engagement = t.engagementEtape.engagement
  }

  if (t.surfaceEtape && format.surface) {
    t.surface = t.surfaceEtape.surface
  }

  if (t.activites && t.activites.length && format.activites) {
    t.activites = t.activites.map(titreActivite =>
      titreActiviteFormat(titreActivite, format.activites)
    )
  }

  if (t.administrations && t.administrations.length && format.administrations) {
    t.administrations.sort((a, b) => a.type.ordre - b.type.ordre)
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

const titreDemarcheFormat = (td, format = titreDemarcheFormatDefaut) => {
  if (td.titreType.id && td.type && td.type.etapesTypes) {
    td.type.etapesTypes = td.type.etapesTypes.filter(
      e => e.typeId === td.titreType.id
    )
  }

  if (td.etapes && td.etapes.length && format.etapes) {
    td.etapes = td.etapes.map(titreEtape =>
      titreEtapeFormat(titreEtape, format.etapes || true)
    )
  }

  return td
}

const titreEtapeFormat = (te, format = titreEtapeFormatDefault) => {
  if (te.points && te.points.length) {
    if (format.geojsonMultiPolygon) {
      te.geojsonMultiPolygon = geojsonFeatureMultiPolygon(te.points)
    }

    if (format.geojsonPoints) {
      te.geojsonPoints = geojsonFeatureCollectionPoints(te.points)
    }
  }

  if (te.communes && te.communes.length && format.pays) {
    te.pays = paysRegionsDepartementsCommunes(te.communes)
  }

  return te
}

const titreActiviteFormat = (ta, format = titreActiviteFormatDefault) => {
  if (ta.frequencePeriodeId && ta.type && ta.type.frequence && format.periode) {
    if (
      ta.type.frequence[ta.type.frequence.periodesNom] &&
      ta.type.frequence[ta.type.frequence.periodesNom].length
    ) {
      ta.periode = ta.type.frequence[ta.type.frequence.periodesNom].find(
        p => p.id === ta.frequencePeriodeId
      )
    }
  }

  if (ta.type.sections && format.sections) {
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
  }

  return ta
}

export {
  titreFormat,
  titreActiviteFormat,
  titreDemarcheFormat,
  titreEtapeFormat
}
