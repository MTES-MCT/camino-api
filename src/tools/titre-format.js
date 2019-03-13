import {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
} from './geojson'

// optimisation possible pour un expert SQL
// remplacer le contenu de ce fichier
// par des requêtes sql (dans /database/queries/titres)
// qui retournent les données directement formatées
const titreFormat = t => {
  t.references =
    t.references &&
    Object.keys(t.references).map(r => ({
      type: r,
      valeur: t.references[r]
    }))

  if (t.points && t.points.length) {
    t.geojsonMultiPolygon = geojsonFeatureMultiPolygon(t.points)
    t.geojsonPoints = geojsonFeatureCollectionPoints(t.points)
  }

  if (t.communes && t.communes.length) {
    t.pays = paysRegionsDepartementsCommunes(t.communes)
  }

  t.demarches &&
    t.demarches.forEach(d => {
      d.etapes &&
        d.etapes.forEach(e => {
          if (e.points.length) {
            e.geojsonMultiPolygon = geojsonFeatureMultiPolygon(e.points)
            e.geojsonPoints = geojsonFeatureCollectionPoints(e.points)
          }
        })
    })

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
    t.activites.forEach(ta => {
      if (ta.frequenceElementId && ta.type && ta.type.frequence) {
        if (
          ta.type.frequence[ta.type.frequence.elementsNom] &&
          ta.type.frequence[ta.type.frequence.elementsNom].length
        ) {
          ta.periode = ta.type.frequence[ta.type.frequence.elementsNom].find(
            p => p.id === ta.frequenceElementId
          )
        }
      }

      ta.sections = ta.type.champs.sections.map(s => {
        const section = {
          id: s.id,
          nom: s.nom,
          type: s.type,
          description: s.description,
          elements: s.elements.reduce(
            (elements, e) =>
              !e.frequenceElementIds ||
              (e.frequenceElementIds &&
                e.frequenceElementIds.find(
                  id => ta.periode && ta.periode.id === id
                ) > 0)
                ? [...elements, e]
                : elements,
            []
          )
        }

        if (s.frequenceElementIds) {
          section.frequenceElementIds = s.frequenceElementIds
        }

        return section
      })
    })
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

export { titreFormat }
