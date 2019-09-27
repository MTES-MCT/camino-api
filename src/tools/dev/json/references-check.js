/*
 Script de détection de coordonnées tronquées dans les points
 ex : 12345678,1234
 */

const { readFileSync: read } = require('fs')

const domainesIds = ['r', 'c', 'f', 'g', 'h', 'm', 's', 'w']

const titresEtapesIds = domainesIds.reduce((titresEtapesIds, domaineId) => {
  const filePath = `./sources/titres-${domaineId}-titres-points-references.json`

  const references = JSON.parse(read(filePath))

  console.log(domaineId, references.length)

  return references.reduce((titresEtapesIds, reference) => {
    if (reference.unite_id === 'deg') return titresEtapesIds

    const coords = reference.coordonnees.split(',')

    if (coords[0].length - coords[1].length > 2) {
      const titreEtapeId = reference.titre_point_id
        .split('-')
        .slice(0, -3)
        .join('-')

      if (!titresEtapesIds[titreEtapeId]) {
        titresEtapesIds[titreEtapeId] = []
      }

      titresEtapesIds[titreEtapeId].push(reference.coordonnees)
    }

    return titresEtapesIds
  }, titresEtapesIds)
}, {})

Object.keys(titresEtapesIds).forEach(titreEtapeId => {
  console.log(`${titreEtapeId} ${titresEtapesIds[titreEtapeId].join('|')}`)
})
