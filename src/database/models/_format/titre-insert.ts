import { Pojo } from 'objection'

const titreInsertFormat = (json: Pojo) => {
  delete json.geojsonMultiPolygon
  delete json.geojsonPoints
  delete json.pays
  delete json.surface
  delete json.contenu
  delete json.modification
  delete json.suppression
  delete json.travauxCreation
  delete json.demarchesCreation
  delete json.activitesAbsentes
  delete json.activitesEnConstruction
  delete json.activitesDeposees

  if (json.type) {
    delete json.type.sections
  }

  return json
}

export { titreInsertFormat }
