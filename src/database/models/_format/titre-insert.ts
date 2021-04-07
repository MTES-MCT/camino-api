import * as slugify from '@sindresorhus/slugify'
import { Pojo } from 'objection'
import * as cryptoRandomString from 'crypto-random-string'

const titreInsertFormat = (json: Pojo) => {
  if (!json.id && json.domaineId && json.typeId && json.nom) {
    json.id = `${json.domaineId}-${json.typeId.slice(0, -1)}-${slugify(
      json.nom
    )}-${cryptoRandomString({ length: 4 })}`
  }

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
  delete json.justificatifsAssociation

  if (json.type) {
    delete json.type.sections
  }

  return json
}

export { titreInsertFormat }
