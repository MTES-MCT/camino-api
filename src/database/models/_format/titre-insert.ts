import slugify from '@sindresorhus/slugify'
import { Pojo } from 'objection'
import cryptoRandomString from 'crypto-random-string'
import { idGenerate } from './id-create'

const titreInsertFormat = (json: Pojo) => {
  if (!json.id) {
    json.id = idGenerate()
  }

  if (!json.slug && json.domaineId && json.typeId && json.nom) {
    json.slug = `${json.domaineId}-${json.typeId.slice(0, -1)}-${slugify(
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

  if (json.type) {
    delete json.type.sections
  }

  return json
}

export { titreInsertFormat }
